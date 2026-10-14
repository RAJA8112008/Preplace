/**
 * Preplace Authentication & OTP Client Module
 * Supports Signup, Password Login, OTP Passwordless Login, Password Reset, and User Profile
 */

(function () {
  "use strict";

  // Configuration & Auto-detecting Backend API URL
  const isLocalHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const isLocalDevPort = isLocalHost && (window.location.port === "5500" || window.location.port === "3000" || window.location.port === "5173");
  const PRODUCTION_BACKEND_URL = "https://preplace-1.onrender.com";
  const API_BASE = window.PREPLACE_API_BASE || (isLocalDevPort ? "http://127.0.0.1:5000" : (window.location.hostname.includes("onrender.com") ? window.location.origin : PRODUCTION_BACKEND_URL));
  window.PREPLACE_API_BASE = API_BASE;

  const TOKEN_KEY = "preplace_auth_token";
  const USER_KEY = "preplace_user_data";

  // Flag to set Work in Progress mode when login/signup backend is under maintenance
  const AUTH_WORK_IN_PROGRESS = true;

  // Auth State
  let state = {
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: null,
    modalOpen: false,
    tab: "signup", // 'signup' | 'login' | 'reset'
    loginMethod: "password", // 'password' | 'otp'
    signupStep: 1, // 1: form, 2: otp
    loginOtpStep: 1, // 1: email, 2: otp
    resetStep: 1, // 1: email, 2: otp & password
    forceShowForm: false,
    otpData: {
      email: "",
      resendTimer: 0,
      intervalId: null
    },
    formData: {
      name: "",
      email: "",
      password: "",
      newPassword: ""
    }
  };

  // Try parsing stored user
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) state.user = JSON.parse(raw);
  } catch (e) {}

  // =========================================================================
  // API Helpers
  // =========================================================================
  async function apiCall(endpoint, method = "GET", body = null) {
    const headers = { "Content-Type": "application/json" };
    if (state.token) {
      headers["Authorization"] = `Bearer ${state.token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "An unexpected error occurred");
      }
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new Error("Request timed out. Please check your network connection and try again.");
      }
      if (err.message === "Failed to fetch") {
        throw new Error("Cannot connect to backend server. Make sure it is running on port 5000.");
      }
      throw err;
    }
  }

  // Toast Notification
  function showToast(message, type = "info") {
    let container = document.getElementById("authToastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "authToastContainer";
      container.className = "auth-toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `auth-toast ${type}`;
    toast.innerHTML = `
      <span>${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
      <div>${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      setTimeout(() => toast.remove(), 200);
    }, 4000);
  }

  // Display inline error banner directly inside the form
  function showFormError(formElement, message, actionText = null, actionFn = null) {
    if (!formElement) return;
    const oldErr = formElement.querySelector(".auth-inline-error");
    if (oldErr) oldErr.remove();

    const banner = document.createElement("div");
    banner.className = "auth-inline-error";
    banner.innerHTML = `<span>⚠️ ${escapeHtml(message)}</span>`;

    if (actionText && actionFn) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "auth-inline-error-btn";
      btn.textContent = actionText;
      btn.onclick = actionFn;
      banner.appendChild(btn);
    }

    formElement.prepend(banner);
  }

  // Set form loading / pending state
  function setFormPending(form, isPending, pendingText = "Processing request...", defaultHtml = null) {
    if (!form) return;
    const btn = form.querySelector("button[type='submit']") || form.querySelector(".auth-submit-btn");
    const inputs = form.querySelectorAll("input, button.auth-sublink");
    const oldBanner = form.querySelector(".auth-pending-banner");
    const oldErr = form.querySelector(".auth-inline-error");

    if (isPending) {
      if (oldErr) oldErr.remove();
      if (btn) {
        if (!btn.dataset.defaultHtml) {
          btn.dataset.defaultHtml = defaultHtml || btn.innerHTML;
        }
        btn.disabled = true;
        btn.classList.add("is-pending");
        btn.innerHTML = `<span class="auth-btn-spinner"></span> <span>${pendingText}</span>`;
      }
      inputs.forEach((el) => {
        if (el !== btn) el.disabled = true;
      });

      if (!oldBanner) {
        const banner = document.createElement("div");
        banner.className = "auth-pending-banner";
        banner.innerHTML = `<span class="auth-pending-dot"></span><span>${pendingText || "Processing request... Please wait"}</span>`;
        if (btn && btn.parentNode) {
          btn.parentNode.insertBefore(banner, btn.nextSibling);
        } else {
          form.appendChild(banner);
        }
      }
    } else {
      if (btn) {
        btn.disabled = false;
        btn.classList.remove("is-pending");
        const restoredHtml = defaultHtml || btn.dataset.defaultHtml;
        if (restoredHtml) {
          btn.innerHTML = restoredHtml;
        }
      }
      inputs.forEach((el) => {
        el.disabled = false;
      });
      if (oldBanner) oldBanner.remove();
    }
  }

  // Save auth session
  function saveAuth(token, user, showWelcomeToast = true) {
    state.token = token;
    state.user = user;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    renderAuthBar();
    closeModal();
    if (showWelcomeToast) {
      showToast(`Welcome, ${user.name}!`, "success");
    }

    // Synchronize latest MongoDB progress & navigate directly to Dashboard
    if (window.PreplaceProgress && typeof window.PreplaceProgress.fetchProgress === "function") {
      window.PreplaceProgress.fetchProgress();
    }
    window.location.hash = "#/dashboard";
  }

  // Logout
  function logout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    renderAuthBar();
    showToast("Signed out successfully", "info");
    window.location.hash = "#/";
  }

  // Validate session on load
  async function checkSession() {
    if (!state.token) return;
    try {
      const data = await apiCall("/api/auth/me");
      state.user = data.user;
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      renderAuthBar();
    } catch (err) {
      console.warn("Session check failed:", err.message);
      logout();
    }
  }

  // =========================================================================
  // Topbar Auth Rendering
  // =========================================================================
  function renderAuthBar() {
    const authBar = document.getElementById("authBar");
    if (!authBar) return;

    const dashNav = document.querySelector('[data-nav="dashboard"]');
    if (dashNav) {
      dashNav.style.display = state.user ? "inline-flex" : "none";
    }

    if (state.user) {
      const initials = (state.user.name || "U")
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      authBar.innerHTML = `
        <div class="user-menu-wrap">
          <button id="userMenuBtn" class="user-badge-btn" type="button" aria-expanded="false">
            <div class="user-avatar" style="background-color: ${state.user.avatar_color || "#4f46e5"}">${initials}</div>
            <span class="user-name-label">${escapeHtml(state.user.name)}</span>
          </button>
          <div id="userDropdown" class="user-dropdown">
            <div class="user-dropdown-header">
              <strong style="font-size: 13px; color: var(--fg);">${escapeHtml(state.user.name)}</strong>
              <div class="user-dropdown-email">${escapeHtml(state.user.email)}</div>
            </div>
            <a href="#/dashboard" class="user-dropdown-item" style="text-decoration: none;" id="userDashLink">
              <span>📊</span> My Dashboard
            </a>
            <button id="logoutBtn" class="user-dropdown-item danger" type="button">
              <span>🚪</span> Sign Out
            </button>
          </div>
        </div>
      `;

      const menuBtn = document.getElementById("userMenuBtn");
      const dropdown = document.getElementById("userDropdown");
      const logoutBtn = document.getElementById("logoutBtn");

      if (menuBtn && dropdown) {
        menuBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          dropdown.classList.toggle("show");
        });

        document.addEventListener("click", () => {
          dropdown.classList.remove("show");
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
      }
    } else {
      authBar.innerHTML = `
        <button id="loginOpenBtn" class="auth-btn auth-btn-ghost" type="button" title="Sign In — Work in progress">
          <span>Sign In</span>
          <span class="auth-wip-pill">WIP</span>
        </button>
        <button id="signupOpenBtn" class="auth-btn auth-btn-primary" type="button" title="Sign Up — Work in progress">
          <span>Sign Up</span>
          <span class="auth-wip-pill auth-wip-pill-accent">WIP</span>
        </button>
      `;

      document.getElementById("loginOpenBtn")?.addEventListener("click", () => openModal("login"));
      document.getElementById("signupOpenBtn")?.addEventListener("click", () => openModal("signup"));
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[m]);
  }

  // =========================================================================
  // Modal Controller & Templates
  // =========================================================================
  function openModal(tab = "signup") {
    state.modalOpen = true;
    state.tab = tab;
    state.signupStep = 1;
    state.loginOtpStep = 1;
    state.resetStep = 1;
    state.forceShowForm = false;
    clearTimer();

    let modal = document.getElementById("authModalBackdrop");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "authModalBackdrop";
      modal.className = "auth-modal-backdrop";
      document.body.appendChild(modal);
    }

    if (AUTH_WORK_IN_PROGRESS) {
      showToast(
        tab === "signup"
          ? "🚧 Work in progress — Account Sign Up is currently under development. Enjoy full guest access!"
          : "🚧 Work in progress — Account Sign In is currently under development. Enjoy full guest access!",
        "info"
      );
    }

    renderModalContent();
    setTimeout(() => modal.classList.add("open"), 10);
  }

  function closeModal() {
    state.modalOpen = false;
    clearTimer();
    const modal = document.getElementById("authModalBackdrop");
    if (modal) {
      modal.classList.remove("open");
      const pendingForms = modal.querySelectorAll("form");
      pendingForms.forEach((form) => setFormPending(form, false));
    }
  }

  function handleGoBack() {
    const currentHash = window.location.hash;
    closeModal();
    // If user arrived at modal via an auth route or dashboard redirection
    if (currentHash === "#/login" || currentHash === "#/signup" || currentHash === "#/dashboard") {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.hash = "#/";
      }
    }
  }

  function startTimer(seconds = 60) {
    clearTimer();
    state.otpData.resendTimer = seconds;
    state.otpData.intervalId = setInterval(() => {
      state.otpData.resendTimer--;
      const timerSpan = document.getElementById("otpResendTimer");
      const resendBtn = document.getElementById("otpResendBtn");
      if (timerSpan) {
        timerSpan.textContent = `(${state.otpData.resendTimer}s)`;
      }
      if (state.otpData.resendTimer <= 0) {
        clearTimer();
        if (resendBtn) {
          resendBtn.disabled = false;
          resendBtn.innerHTML = "Resend Code";
        }
      }
    }, 1000);
  }

  function clearTimer() {
    if (state.otpData.intervalId) {
      clearInterval(state.otpData.intervalId);
      state.otpData.intervalId = null;
    }
  }

  function renderModalContent() {
    const modal = document.getElementById("authModalBackdrop");
    if (!modal) return;

    if (AUTH_WORK_IN_PROGRESS && !state.forceShowForm) {
      modal.innerHTML = renderWipModalContent();
      attachWipModalEvents();
      return;
    }

    modal.innerHTML = `
      <div class="auth-modal-card" onclick="event.stopPropagation()">
        <div class="auth-modal-header">
          <div class="auth-modal-header-left">
            <button id="modalHeaderBackBtn" class="auth-modal-back-btn" type="button" title="Go back to previous screen" aria-label="Go back">
              <span class="auth-back-arrow">←</span>
              <span>Back</span>
            </button>
            <div>
              <h3 class="auth-modal-title">
                ${state.tab === "signup" ? "Create your Preplace Account" : state.tab === "login" ? "Welcome back" : "Reset Password"}
              </h3>
              <p class="auth-modal-sub">
                ${state.tab === "signup" ? "Master careers, DSA, and interview prep" : state.tab === "login" ? "Sign in to track your prep journey" : "Verify your email to create a new password"}
              </p>
            </div>
          </div>
          <button id="modalCloseBtn" class="auth-modal-close" type="button" aria-label="Close">✕</button>
        </div>

        ${AUTH_WORK_IN_PROGRESS && state.forceShowForm ? `
          <div class="auth-wip-form-banner">
            <div class="auth-wip-form-banner-text">
              <span class="auth-wip-pulse-dot" aria-hidden="true"></span>
              <span>Backend under maintenance — Testing mode active</span>
            </div>
            <button id="wipReturnToNoticeBtn" class="auth-wip-banner-btn" type="button">
              ← Go back to notice
            </button>
          </div>
        ` : ""}

        ${state.tab !== "reset" ? `
          <div class="auth-tabs">
            <button id="tabSignupBtn" class="auth-tab-btn ${state.tab === "signup" ? "active" : ""}" type="button">Sign Up</button>
            <button id="tabLoginBtn" class="auth-tab-btn ${state.tab === "login" ? "active" : ""}" type="button">Sign In</button>
          </div>
        ` : ""}

        <div class="auth-modal-body">
          ${renderTabBody()}
        </div>
      </div>
    `;

    attachModalEvents();
  }

  function renderTabBody() {
    if (state.tab === "signup") {
      return renderSignupView();
    } else if (state.tab === "login") {
      return renderLoginView();
    } else {
      return renderResetView();
    }
  }

  // =========================================================================
  // Work In Progress (WIP) Mode Renderer & Handlers
  // =========================================================================
  function renderWipModalContent() {
    const isSignup = state.tab === "signup";
    return `
      <div class="auth-modal-card auth-wip-card" onclick="event.stopPropagation()" role="dialog" aria-modal="true" aria-labelledby="wipTitle">
        
        <div class="auth-modal-header auth-wip-header">
          <button id="wipHeaderBackBtn" class="auth-modal-back-btn" type="button" title="Go back to previous screen" aria-label="Go back">
            <span class="auth-back-arrow">←</span>
            <span>Back</span>
          </button>
          <div class="auth-wip-status-badge">
            <span class="auth-wip-pulse-dot" aria-hidden="true"></span>
            <span class="auth-wip-status-label">Work in progress</span>
          </div>
          <button id="modalCloseBtn" class="auth-modal-close" type="button" title="Close" aria-label="Close dialog">✕</button>
        </div>

        <div class="auth-modal-body auth-wip-body">
          <div class="auth-wip-hero">
            <div class="auth-wip-icon-circle" aria-hidden="true">
              <span class="auth-wip-icon">🚧</span>
            </div>
            <h3 id="wipTitle" class="auth-wip-title">
              ${isSignup ? "Account Registration" : "Account Sign In"} is Under Development
            </h3>
            <p class="auth-wip-subtitle">
              Cloud accounts &amp; cross-device sync are currently being finalized.
            </p>
          </div>

          <div class="auth-wip-info-box">
            <div class="auth-wip-highlight-head">
              <span class="auth-wip-badge-mini">Guest Mode Active</span>
              <span class="auth-wip-highlight-sub">No account required to prepare!</span>
            </div>
            <ul class="auth-wip-points">
              <li>
                <span class="auth-wip-check" aria-hidden="true">✓</span>
                <div>
                  <strong>100% Free &amp; Unlocked Roadmaps</strong>
                  <p>Study Frontend, Backend, MERN, Machine Learning, DevOps, and System Design notes freely.</p>
                </div>
              </li>
              <li>
                <span class="auth-wip-check" aria-hidden="true">✓</span>
                <div>
                  <strong>Solved Questions Saved Locally</strong>
                  <p>All your problem ticks, stars, and notes are automatically saved to your browser on this device.</p>
                </div>
              </li>
              <li>
                <span class="auth-wip-check" aria-hidden="true">✓</span>
                <div>
                  <strong>Live Code Playground &amp; Runner</strong>
                  <p>Test JavaScript DSA solutions with console logs and execution times directly in the browser.</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="auth-wip-actions">
            <button id="wipContinueGuestBtn" class="auth-btn auth-btn-primary auth-wip-btn" type="button">
              <span>Continue Learning as Guest →</span>
            </button>
            <button id="wipExploreDsaBtn" class="auth-btn auth-btn-ghost auth-wip-btn" type="button">
              <span>Open Problem Sheet ⚡</span>
            </button>
            <button id="wipBackBtn" class="auth-btn auth-btn-ghost auth-wip-btn auth-wip-back-main-btn" type="button" title="Go back to previous screen">
              <span class="auth-back-arrow">←</span>
              <span>Go Back</span>
            </button>
          </div>

          <div class="auth-wip-switch-tab">
            <span>${isSignup ? "Already have an account?" : "Need a new account?"}</span>
            <button id="wipSwitchTabBtn" class="auth-sublink" type="button">
              ${isSignup ? "Check Sign In →" : "Check Sign Up →"}
            </button>
          </div>

          <div class="auth-wip-dev-toggle">
            <button id="wipDevBypassBtn" class="auth-sublink auth-dev-bypass-link" type="button" title="Open traditional authentication form">
              Developer testing? Open ${isSignup ? "Sign Up" : "Sign In"} form anyway ⚙️
            </button>
          </div>

          <p class="auth-wip-footer-note">
            Preplace by <strong>Raj Kumar</strong> · Need help? <a href="#/contact">Send a message</a> or <a href="#/feedback">Feedback</a>.
          </p>
        </div>

      </div>
    `;
  }

  function attachWipModalEvents() {
    const backdrop = document.getElementById("authModalBackdrop");
    const closeBtn = document.getElementById("modalCloseBtn");
    const headerBackBtn = document.getElementById("wipHeaderBackBtn");
    const backBtn = document.getElementById("wipBackBtn");
    const continueBtn = document.getElementById("wipContinueGuestBtn");
    const dsaBtn = document.getElementById("wipExploreDsaBtn");
    const switchTabBtn = document.getElementById("wipSwitchTabBtn");
    const devBypassBtn = document.getElementById("wipDevBypassBtn");

    if (backdrop) backdrop.onclick = closeModal;
    if (closeBtn) closeBtn.onclick = closeModal;
    if (headerBackBtn) headerBackBtn.onclick = handleGoBack;
    if (backBtn) backBtn.onclick = handleGoBack;

    if (continueBtn) {
      continueBtn.onclick = () => {
        closeModal();
      };
    }

    if (dsaBtn) {
      dsaBtn.onclick = () => {
        closeModal();
        window.location.hash = "#/dsa";
      };
    }

    if (switchTabBtn) {
      switchTabBtn.onclick = () => {
        state.tab = state.tab === "signup" ? "login" : "signup";
        renderModalContent();
      };
    }

    if (devBypassBtn) {
      devBypassBtn.onclick = () => {
        state.forceShowForm = true;
        renderModalContent();
      };
    }
  }

  // 1. SIGNUP VIEW
  function renderSignupView() {
    if (state.signupStep === 1) {
      return `
        <form id="signupStep1Form">
          <div class="auth-form-group">
            <label class="auth-label">Full Name</label>
            <input id="suName" class="auth-input" type="text" placeholder="e.g. Alex Johnson" required value="${escapeHtml(state.formData.name)}" />
          </div>
          <div class="auth-form-group">
            <label class="auth-label">Email Address</label>
            <input id="suEmail" class="auth-input" type="email" placeholder="name@example.com" required value="${escapeHtml(state.formData.email)}" />
          </div>
          <div class="auth-form-group">
            <label class="auth-label">Password</label>
            <input id="suPassword" class="auth-input" type="password" placeholder="At least 6 characters" minlength="6" required value="${escapeHtml(state.formData.password)}" />
          </div>
          <button id="signupStep1Btn" class="auth-submit-btn" type="submit">
            <span>Send Verification OTP</span> →
          </button>
        </form>
      `;
    } else {
      // Step 2: OTP Verification
      return `
        <form id="signupStep2Form">
          <p style="font-size: 13px; color: var(--fg-muted); margin-bottom: 12px;">
            We sent a 6-digit verification code to <strong>${escapeHtml(state.formData.email)}</strong>
          </p>

          <label class="auth-label">Enter 6-Digit Code</label>
          <div class="otp-inputs-wrap" id="otpInputsWrap">
            <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autofocus />
            <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" />
            <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" />
            <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" />
            <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" />
            <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" />
          </div>

          <button id="signupCompleteBtn" class="auth-submit-btn" type="submit">
            Verify & Create Account
          </button>

          <div class="auth-sublinks">
            <button id="otpBackBtn" class="auth-sublink" type="button">← Change Email</button>
            <button id="otpResendBtn" class="auth-sublink" type="button" ${state.otpData.resendTimer > 0 ? "disabled" : ""}>
              Resend Code <span id="otpResendTimer">${state.otpData.resendTimer > 0 ? `(${state.otpData.resendTimer}s)` : ""}</span>
            </button>
          </div>
        </form>
      `;
    }
  }

  // 2. LOGIN VIEW
  function renderLoginView() {
    return `
      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        <button id="loginMethodPwd" class="auth-btn ${state.loginMethod === "password" ? "auth-btn-primary" : "auth-btn-ghost"}" style="flex: 1; border-radius: 8px;" type="button">
          Password
        </button>
        <button id="loginMethodOtp" class="auth-btn ${state.loginMethod === "otp" ? "auth-btn-primary" : "auth-btn-ghost"}" style="flex: 1; border-radius: 8px;" type="button">
          Instant OTP
        </button>
      </div>

      ${state.loginMethod === "password" ? `
        <form id="loginPasswordForm">
          <div class="auth-form-group">
            <label class="auth-label">Email Address</label>
            <input id="loginEmail" class="auth-input" type="email" placeholder="name@example.com" required value="${escapeHtml(state.formData.email)}" />
          </div>
          <div class="auth-form-group">
            <label class="auth-label">Password</label>
            <input id="loginPassword" class="auth-input" type="password" placeholder="Enter your password" required />
          </div>
          <button class="auth-submit-btn" type="submit">
            Sign In
          </button>
          <div class="auth-sublinks" style="justify-content: flex-end; margin-top: 12px;">
            <button id="forgotPasswordBtn" class="auth-sublink" type="button">Forgot password?</button>
          </div>
        </form>
      ` : `
        ${state.loginOtpStep === 1 ? `
          <form id="loginOtpStep1Form">
            <div class="auth-form-group">
              <label class="auth-label">Email Address</label>
              <input id="loginOtpEmail" class="auth-input" type="email" placeholder="name@example.com" required value="${escapeHtml(state.formData.email)}" />
            </div>
            <button class="auth-submit-btn" type="submit">
              Send Login Code →
            </button>
          </form>
        ` : `
          <form id="loginOtpStep2Form">
            <p style="font-size: 13px; color: var(--fg-muted); margin-bottom: 12px;">
              Enter the 6-digit code sent to <strong>${escapeHtml(state.formData.email)}</strong>
            </p>

            <div class="otp-inputs-wrap" id="otpInputsWrap">
              <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autofocus />
              <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" />
              <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" />
              <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" />
              <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" />
              <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" />
            </div>

            <button class="auth-submit-btn" type="submit">
              Verify & Sign In
            </button>

            <div class="auth-sublinks">
              <button id="otpBackBtn" class="auth-sublink" type="button">← Back</button>
              <button id="otpResendBtn" class="auth-sublink" type="button" ${state.otpData.resendTimer > 0 ? "disabled" : ""}>
                Resend Code <span id="otpResendTimer">${state.otpData.resendTimer > 0 ? `(${state.otpData.resendTimer}s)` : ""}</span>
              </button>
            </div>
          </form>
        `}
      `}
    `;
  }

  // 3. RESET PASSWORD VIEW
  function renderResetView() {
    if (state.resetStep === 1) {
      return `
        <form id="resetStep1Form">
          <div class="auth-form-group">
            <label class="auth-label">Registered Email</label>
            <input id="resetEmail" class="auth-input" type="email" placeholder="name@example.com" required value="${escapeHtml(state.formData.email)}" />
          </div>
          <button class="auth-submit-btn" type="submit">
            Send Reset Code →
          </button>
          <div class="auth-sublinks" style="justify-content: center; margin-top: 14px;">
            <button id="backToLoginBtn" class="auth-sublink" type="button">← Back to Sign In</button>
          </div>
        </form>
      `;
    } else {
      return `
        <form id="resetStep2Form">
          <p style="font-size: 13px; color: var(--fg-muted); margin-bottom: 12px;">
            Enter the code sent to <strong>${escapeHtml(state.formData.email)}</strong> and choose a new password.
          </p>

          <label class="auth-label">6-Digit Code</label>
          <div class="otp-inputs-wrap" id="otpInputsWrap">
            <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autofocus />
            <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" />
            <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" />
            <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" />
            <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" />
            <input class="otp-digit-box" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" />
          </div>

          <div class="auth-form-group">
            <label class="auth-label">New Password</label>
            <input id="resetNewPassword" class="auth-input" type="password" placeholder="At least 6 characters" minlength="6" required />
          </div>

          <button class="auth-submit-btn" type="submit">
            Reset Password
          </button>

          <div class="auth-sublinks">
            <button id="otpBackBtn" class="auth-sublink" type="button">← Back</button>
            <button id="otpResendBtn" class="auth-sublink" type="button" ${state.otpData.resendTimer > 0 ? "disabled" : ""}>
              Resend Code <span id="otpResendTimer">${state.otpData.resendTimer > 0 ? `(${state.otpData.resendTimer}s)` : ""}</span>
            </button>
          </div>
        </form>
      `;
    }
  }

  // =========================================================================
  // Modal Event Listeners & Actions
  // =========================================================================
  function attachModalEvents() {
    const backdrop = document.getElementById("authModalBackdrop");
    const closeBtn = document.getElementById("modalCloseBtn");
    const headerBackBtn = document.getElementById("modalHeaderBackBtn");
    const returnToNoticeBtn = document.getElementById("wipReturnToNoticeBtn");
    const tabSignupBtn = document.getElementById("tabSignupBtn");
    const tabLoginBtn = document.getElementById("tabLoginBtn");

    if (backdrop) backdrop.onclick = closeModal;
    if (closeBtn) closeBtn.onclick = closeModal;
    if (headerBackBtn) headerBackBtn.onclick = handleGoBack;
    if (returnToNoticeBtn) {
      returnToNoticeBtn.onclick = () => {
        state.forceShowForm = false;
        renderModalContent();
      };
    }

    if (tabSignupBtn) {
      tabSignupBtn.onclick = () => {
        state.tab = "signup";
        state.signupStep = 1;
        renderModalContent();
      };
    }
    if (tabLoginBtn) {
      tabLoginBtn.onclick = () => {
        state.tab = "login";
        renderModalContent();
      };
    }

    // Login Method Switcher
    const methodPwd = document.getElementById("loginMethodPwd");
    const methodOtp = document.getElementById("loginMethodOtp");
    if (methodPwd) {
      methodPwd.onclick = () => {
        state.loginMethod = "password";
        renderModalContent();
      };
    }
    if (methodOtp) {
      methodOtp.onclick = () => {
        state.loginMethod = "otp";
        state.loginOtpStep = 1;
        renderModalContent();
      };
    }

    // Forgot password
    const forgotBtn = document.getElementById("forgotPasswordBtn");
    if (forgotBtn) {
      forgotBtn.onclick = () => {
        state.tab = "reset";
        state.resetStep = 1;
        renderModalContent();
      };
    }

    const backToLoginBtn = document.getElementById("backToLoginBtn");
    if (backToLoginBtn) {
      backToLoginBtn.onclick = () => {
        state.tab = "login";
        renderModalContent();
      };
    }

    // OTP Navigation & Box Management
    setupOtpInputBoxes();



    // OTP Back button
    const otpBackBtn = document.getElementById("otpBackBtn");
    if (otpBackBtn) {
      otpBackBtn.onclick = () => {
        if (state.tab === "signup") state.signupStep = 1;
        else if (state.tab === "login") state.loginOtpStep = 1;
        else if (state.tab === "reset") state.resetStep = 1;
        renderModalContent();
      };
    }

    // Resend OTP button
    const otpResendBtn = document.getElementById("otpResendBtn");
    if (otpResendBtn) {
      otpResendBtn.onclick = async () => {
        try {
          otpResendBtn.disabled = true;
          otpResendBtn.innerHTML = "Sending...";
          const purpose = state.tab === "signup" ? "signup" : state.tab === "login" ? "login" : "reset_password";
          const res = await apiCall("/api/auth/send-otp", "POST", {
            email: state.formData.email,
            purpose
          });
          showToast(res.message || "New code sent!", "success");
          otpResendBtn.disabled = false;
          otpResendBtn.innerHTML = "Resend Code";
          startTimer(60);
          renderModalContent();
        } catch (err) {
          showToast(err.message, "error");
          otpResendBtn.disabled = false;
          otpResendBtn.innerHTML = "Resend Code";
        }
      };
    }

    // --- FORM SUBMIT HANDLERS ---

    // Signup Step 1
    const suStep1Form = document.getElementById("signupStep1Form");
    if (suStep1Form) {
      suStep1Form.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById("suName").value.trim();
        const email = document.getElementById("suEmail").value.trim();
        const password = document.getElementById("suPassword").value;

        if (!name || name.length < 2) {
          showToast("Please enter your name (at least 2 characters)", "error");
          return;
        }
        if (!email || !email.includes("@")) {
          showToast("Please enter a valid email address", "error");
          return;
        }
        if (!password || password.length < 6) {
          showToast("Password must be at least 6 characters", "error");
          return;
        }

        state.formData.name = name;
        state.formData.email = email;
        state.formData.password = password;

        setFormPending(suStep1Form, true, "Sending Verification Code...", "<span>Send Verification OTP</span> →");

        try {
          const res = await apiCall("/api/auth/send-otp", "POST", { email, purpose: "signup" });
          showToast(res.message || "Verification code sent!", "success");
          setFormPending(suStep1Form, false);
          state.signupStep = 2;
          startTimer(60);
          renderModalContent();
        } catch (err) {
          showToast(err.message, "error");
          setFormPending(suStep1Form, false);

          const isExisting = err.message && err.message.toLowerCase().includes("already exists");
          if (isExisting) {
            showFormError(suStep1Form, err.message, "Sign In Instead →", () => {
              state.tab = "login";
              renderModalContent();
            });
          } else {
            showFormError(suStep1Form, err.message);
          }
        }
      };
    }

    // Signup Step 2 (Verify & Signup)
    const suStep2Form = document.getElementById("signupStep2Form");
    if (suStep2Form) {
      suStep2Form.onsubmit = async (e) => {
        e.preventDefault();
        const otp = collectOtp();
        if (otp.length < 6) {
          showToast("Please enter all 6 digits of the code", "error");
          return;
        }

        setFormPending(suStep2Form, true, "Creating Account...", "Verify & Create Account");

        try {
          const res = await apiCall("/api/auth/signup", "POST", {
            name: state.formData.name,
            email: state.formData.email,
            password: state.formData.password,
            otp
          });
          showToast(res.message || "Account created successfully!", "success");
          setFormPending(suStep2Form, false);
          saveAuth(res.token, res.user, false);
        } catch (err) {
          showToast(err.message, "error");
          setFormPending(suStep2Form, false);
          showFormError(suStep2Form, err.message);
        }
      };
    }

    // Login Password Form
    const loginPwdForm = document.getElementById("loginPasswordForm");
    if (loginPwdForm) {
      loginPwdForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!email || !email.includes("@")) {
          showToast("Please enter a valid email address", "error");
          return;
        }
        if (!password) {
          showToast("Please enter your password", "error");
          return;
        }

        state.formData.email = email;
        setFormPending(loginPwdForm, true, "Signing In...", "Sign In");

        try {
          const res = await apiCall("/api/auth/login-password", "POST", { email, password });
          showToast(res.message || `Welcome back, ${res.user.name}!`, "success");
          setFormPending(loginPwdForm, false);
          saveAuth(res.token, res.user, false);
        } catch (err) {
          showToast(err.message, "error");
          setFormPending(loginPwdForm, false);
          showFormError(loginPwdForm, err.message);
        }
      };
    }

    // Login OTP Step 1
    const loginOtp1Form = document.getElementById("loginOtpStep1Form");
    if (loginOtp1Form) {
      loginOtp1Form.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById("loginOtpEmail").value.trim();
        if (!email || !email.includes("@")) {
          showToast("Please enter a valid email address", "error");
          return;
        }
        state.formData.email = email;

        setFormPending(loginOtp1Form, true, "Sending Login Code...", "Send Login Code →");

        try {
          const res = await apiCall("/api/auth/send-otp", "POST", { email, purpose: "login" });
          showToast(res.message || "Login code sent!", "success");
          setFormPending(loginOtp1Form, false);
          state.loginOtpStep = 2;
          startTimer(60);
          renderModalContent();
        } catch (err) {
          showToast(err.message, "error");
          setFormPending(loginOtp1Form, false);
          const notFound = err.message && err.message.toLowerCase().includes("no account");
          if (notFound) {
            showFormError(loginOtp1Form, err.message, "Create Account →", () => {
              state.tab = "signup";
              state.signupStep = 1;
              renderModalContent();
            });
          } else {
            showFormError(loginOtp1Form, err.message);
          }
        }
      };
    }

    // Login OTP Step 2
    const loginOtp2Form = document.getElementById("loginOtpStep2Form");
    if (loginOtp2Form) {
      loginOtp2Form.onsubmit = async (e) => {
        e.preventDefault();
        const otp = collectOtp();
        if (otp.length < 6) {
          showToast("Please enter all 6 digits of the code", "error");
          return;
        }

        setFormPending(loginOtp2Form, true, "Verifying Code...", "Verify & Sign In");

        try {
          const res = await apiCall("/api/auth/login-otp", "POST", {
            email: state.formData.email,
            otp
          });
          showToast(res.message || `Welcome back, ${res.user.name}!`, "success");
          setFormPending(loginOtp2Form, false);
          saveAuth(res.token, res.user, false);
        } catch (err) {
          showToast(err.message, "error");
          setFormPending(loginOtp2Form, false);
          showFormError(loginOtp2Form, err.message);
        }
      };
    }

    // Reset Password Step 1
    const reset1Form = document.getElementById("resetStep1Form");
    if (reset1Form) {
      reset1Form.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById("resetEmail").value.trim();
        if (!email || !email.includes("@")) {
          showToast("Please enter a valid email address", "error");
          return;
        }
        state.formData.email = email;

        setFormPending(reset1Form, true, "Sending Reset Code...", "Send Reset Code →");

        try {
          const res = await apiCall("/api/auth/send-otp", "POST", { email, purpose: "reset_password" });
          showToast(res.message || "Reset code sent!", "success");
          setFormPending(reset1Form, false);
          state.resetStep = 2;
          startTimer(60);
          renderModalContent();
        } catch (err) {
          showToast(err.message, "error");
          setFormPending(reset1Form, false);
          showFormError(reset1Form, err.message);
        }
      };
    }

    // Reset Password Step 2
    const reset2Form = document.getElementById("resetStep2Form");
    if (reset2Form) {
      reset2Form.onsubmit = async (e) => {
        e.preventDefault();
        const otp = collectOtp();
        const newPassword = document.getElementById("resetNewPassword").value;

        if (otp.length < 6) {
          showToast("Please enter all 6 digits of the code", "error");
          return;
        }
        if (!newPassword || newPassword.length < 6) {
          showToast("New password must be at least 6 characters", "error");
          return;
        }

        setFormPending(reset2Form, true, "Updating Password...", "Reset Password");

        try {
          const res = await apiCall("/api/auth/reset-password", "POST", {
            email: state.formData.email,
            otp,
            newPassword
          });
          showToast(res.message || "Password updated successfully!", "success");
          setFormPending(reset2Form, false);
          state.tab = "login";
          renderModalContent();
        } catch (err) {
          showToast(err.message, "error");
          setFormPending(reset2Form, false);
          showFormError(reset2Form, err.message);
        }
      };
    }
  }

  // =========================================================================
  // OTP 6-Digit Box Handling
  // =========================================================================
  function setupOtpInputBoxes() {
    const wrap = document.getElementById("otpInputsWrap");
    if (!wrap) return;

    const boxes = Array.from(wrap.querySelectorAll(".otp-digit-box"));
    if (boxes.length === 0) return;

    boxes.forEach((box, idx) => {
      box.addEventListener("input", (e) => {
        const val = e.target.value.replace(/[^0-9]/g, "");
        e.target.value = val ? val.slice(-1) : "";

        if (val && idx < boxes.length - 1) {
          boxes[idx + 1].focus();
        }
      });

      box.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !box.value && idx > 0) {
          boxes[idx - 1].focus();
        } else if (e.key === "Enter") {
          e.preventDefault();
          const form = box.closest("form");
          if (form) {
            if (form.requestSubmit) form.requestSubmit();
            else form.dispatchEvent(new Event("submit", { cancelable: true }));
          }
        }
      });

      box.addEventListener("paste", (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData("text").trim();
        fillOtpBoxes(pasted);
      });
    });

    setTimeout(() => boxes[0]?.focus(), 50);
  }

  function fillOtpBoxes(codeStr) {
    const digits = (codeStr || "").replace(/[^0-9]/g, "").slice(0, 6);
    const wrap = document.getElementById("otpInputsWrap");
    if (!wrap) return;

    const boxes = Array.from(wrap.querySelectorAll(".otp-digit-box"));
    boxes.forEach((box, i) => {
      box.value = digits[i] || "";
    });

    if (digits.length === 6) {
      boxes[5]?.focus();
    } else {
      boxes[digits.length]?.focus();
    }
  }

  function collectOtp() {
    const wrap = document.getElementById("otpInputsWrap");
    if (!wrap) return "";
    const boxes = Array.from(wrap.querySelectorAll(".otp-digit-box"));
    return boxes.map((b) => b.value).join("");
  }

  // =========================================================================
  // Initialization
  // =========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    renderAuthBar();
    checkSession();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.modalOpen) {
      closeModal();
    }
  });

  // Expose API for external modules if needed
  window.PreplaceAuth = {
    openModal,
    closeModal,
    logout,
    getUser: () => state.user,
    renderAuthBar,
    isWorkInProgress: () => AUTH_WORK_IN_PROGRESS,
    getState: () => ({ ...state })
  };
})();
