/**
 * Preplace Authentication & OTP Client Module
 * Supports Signup, Password Login, OTP Passwordless Login, Password Reset, and User Profile
 */

(function () {
  "use strict";

  // Configuration & Auto-detecting Backend API URL
  const isDevPort = window.location.port === "5500" || window.location.port === "3000";
  const API_BASE = isDevPort ? "http://127.0.0.1:5000" : window.location.origin;

  const TOKEN_KEY = "preplace_auth_token";
  const USER_KEY = "preplace_user_data";

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
    otpData: {
      email: "",
      previewOtp: null,
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

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "An unexpected error occurred");
      }
      return data;
    } catch (err) {
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

  // Save auth session
  function saveAuth(token, user) {
    state.token = token;
    state.user = user;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    renderAuthBar();
    closeModal();
    showToast(`Welcome, ${user.name}!`, "success");

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

    if (state.user) {
      const initials = (state.user.name || "U")
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      authBar.innerHTML = `
        <div class="user-menu-wrap">
          <button id="userMenuBtn" class="user-badge-btn" type="button" aria-expanded="false" title="Account: ${escapeHtml(state.user.name)} (${escapeHtml(state.user.email)})">
            <div class="user-avatar" style="background-color: ${state.user.avatar_color || "#b4532a"}">${initials}</div>
            <span class="user-name-label">${escapeHtml(state.user.name)}</span>
            <span style="font-size: 10px; opacity: 0.7;">▼</span>
          </button>
          <div id="userDropdown" class="user-dropdown">
            <div class="user-dropdown-header">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <div class="user-avatar" style="width: 32px; height: 32px; font-size: 14px; background-color: ${state.user.avatar_color || "#b4532a"}">${initials}</div>
                <div>
                  <strong style="font-size: 14px; color: var(--ink, #1c1914); display: block;">${escapeHtml(state.user.name)}</strong>
                  <span style="font-size: 11px; color: var(--accent, #b4532a); font-weight: 600;">✓ Verified Member</span>
                </div>
              </div>
              <div class="user-dropdown-email" style="margin-top: 4px;">${escapeHtml(state.user.email)}</div>
            </div>
            <a href="#/dashboard" class="user-dropdown-item" style="text-decoration: none;" id="userDashLink">
              <span>📊</span> My Dashboard
            </a>
            <a href="#/contact" class="user-dropdown-item" style="text-decoration: none;">
              <span>✉️</span> Message Raj
            </a>
            <div style="height: 1px; background: var(--line, #d8cfc0); margin: 4px 0;"></div>
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
        <button id="loginOpenBtn" class="auth-btn auth-btn-ghost" type="button">Sign In</button>
        <button id="signupOpenBtn" class="auth-btn auth-btn-primary" type="button">Sign Up</button>
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
    state.otpData.previewOtp = null;
    clearTimer();

    let modal = document.getElementById("authModalBackdrop");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "authModalBackdrop";
      modal.className = "auth-modal-backdrop";
      document.body.appendChild(modal);
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

    modal.innerHTML = `
      <div class="auth-modal-card" onclick="event.stopPropagation()">
        <div class="auth-modal-header">
          <div>
            <h3 class="auth-modal-title">
              ${state.tab === "signup" ? "Create your Preplace Account" : state.tab === "login" ? "Welcome back" : "Reset Password"}
            </h3>
            <p class="auth-modal-sub">
              ${state.tab === "signup" ? "Master careers, DSA, and interview prep" : state.tab === "login" ? "Sign in to track your prep journey" : "Verify your email to create a new password"}
            </p>
          </div>
          <button id="modalCloseBtn" class="auth-modal-close" type="button" aria-label="Close">✕</button>
        </div>

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

          ${state.otpData.previewOtp ? `
            <div class="otp-hint-banner">
              <span>Demo OTP Preview:</span>
              <span class="otp-code-pill" id="autoFillOtpBtn" title="Click to auto-fill">${state.otpData.previewOtp}</span>
            </div>
          ` : ""}

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

            ${state.otpData.previewOtp ? `
              <div class="otp-hint-banner">
                <span>Demo OTP Preview:</span>
                <span class="otp-code-pill" id="autoFillOtpBtn" title="Click to auto-fill">${state.otpData.previewOtp}</span>
              </div>
            ` : ""}

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

          ${state.otpData.previewOtp ? `
            <div class="otp-hint-banner">
              <span>Demo OTP Preview:</span>
              <span class="otp-code-pill" id="autoFillOtpBtn" title="Click to auto-fill">${state.otpData.previewOtp}</span>
            </div>
          ` : ""}

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
    const tabSignupBtn = document.getElementById("tabSignupBtn");
    const tabLoginBtn = document.getElementById("tabLoginBtn");

    if (backdrop) backdrop.onclick = closeModal;
    if (closeBtn) closeBtn.onclick = closeModal;

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

    // Auto-fill OTP button
    const autoFillBtn = document.getElementById("autoFillOtpBtn");
    if (autoFillBtn && state.otpData.previewOtp) {
      autoFillBtn.onclick = () => {
        fillOtpBoxes(state.otpData.previewOtp);
      };
    }

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
          state.otpData.previewOtp = res.previewOtp || null;
          showToast(res.message || "New code sent!", "success");
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

        state.formData.name = name;
        state.formData.email = email;
        state.formData.password = password;

        const btn = document.getElementById("signupStep1Btn");
        btn.disabled = true;
        btn.innerHTML = "Sending Code...";

        try {
          const res = await apiCall("/api/auth/send-otp", "POST", { email, purpose: "signup" });
          state.otpData.previewOtp = res.previewOtp || null;
          state.signupStep = 2;
          startTimer(60);
          showToast(res.message, "success");
          renderModalContent();
        } catch (err) {
          showToast(err.message, "error");
          btn.disabled = false;
          btn.innerHTML = "<span>Send Verification OTP</span> →";
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

        const btn = document.getElementById("signupCompleteBtn");
        btn.disabled = true;
        btn.innerHTML = "Creating Account...";

        try {
          const res = await apiCall("/api/auth/signup", "POST", {
            name: state.formData.name,
            email: state.formData.email,
            password: state.formData.password,
            otp
          });
          saveAuth(res.token, res.user);
        } catch (err) {
          showToast(err.message, "error");
          btn.disabled = false;
          btn.innerHTML = "Verify & Create Account";
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

        state.formData.email = email;
        const btn = loginPwdForm.querySelector("button[type='submit']");
        btn.disabled = true;
        btn.innerHTML = "Signing In...";

        try {
          const res = await apiCall("/api/auth/login-password", "POST", { email, password });
          saveAuth(res.token, res.user);
        } catch (err) {
          showToast(err.message, "error");
          btn.disabled = false;
          btn.innerHTML = "Sign In";
        }
      };
    }

    // Login OTP Step 1
    const loginOtp1Form = document.getElementById("loginOtpStep1Form");
    if (loginOtp1Form) {
      loginOtp1Form.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById("loginOtpEmail").value.trim();
        state.formData.email = email;

        const btn = loginOtp1Form.querySelector("button[type='submit']");
        btn.disabled = true;
        btn.innerHTML = "Sending Code...";

        try {
          const res = await apiCall("/api/auth/send-otp", "POST", { email, purpose: "login" });
          state.otpData.previewOtp = res.previewOtp || null;
          state.loginOtpStep = 2;
          startTimer(60);
          showToast(res.message, "success");
          renderModalContent();
        } catch (err) {
          showToast(err.message, "error");
          btn.disabled = false;
          btn.innerHTML = "Send Login Code →";
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

        const btn = loginOtp2Form.querySelector("button[type='submit']");
        btn.disabled = true;
        btn.innerHTML = "Verifying...";

        try {
          const res = await apiCall("/api/auth/login-otp", "POST", {
            email: state.formData.email,
            otp
          });
          saveAuth(res.token, res.user);
        } catch (err) {
          showToast(err.message, "error");
          btn.disabled = false;
          btn.innerHTML = "Verify & Sign In";
        }
      };
    }

    // Reset Password Step 1
    const reset1Form = document.getElementById("resetStep1Form");
    if (reset1Form) {
      reset1Form.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById("resetEmail").value.trim();
        state.formData.email = email;

        const btn = reset1Form.querySelector("button[type='submit']");
        btn.disabled = true;
        btn.innerHTML = "Sending Code...";

        try {
          const res = await apiCall("/api/auth/send-otp", "POST", { email, purpose: "reset_password" });
          state.otpData.previewOtp = res.previewOtp || null;
          state.resetStep = 2;
          startTimer(60);
          showToast(res.message, "success");
          renderModalContent();
        } catch (err) {
          showToast(err.message, "error");
          btn.disabled = false;
          btn.innerHTML = "Send Reset Code →";
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

        const btn = reset2Form.querySelector("button[type='submit']");
        btn.disabled = true;
        btn.innerHTML = "Updating Password...";

        try {
          const res = await apiCall("/api/auth/reset-password", "POST", {
            email: state.formData.email,
            otp,
            newPassword
          });
          showToast(res.message, "success");
          state.tab = "login";
          renderModalContent();
        } catch (err) {
          showToast(err.message, "error");
          btn.disabled = false;
          btn.innerHTML = "Reset Password";
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

  // Expose API for external modules if needed
  window.PreplaceAuth = {
    openModal,
    closeModal,
    logout,
    getState: () => ({ ...state })
  };
})();
