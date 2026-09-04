"use strict";

const fs = require("fs");
const path = require("path");

const story = (a) => {
  const keys = ["problem", "what", "solves", "example", "uses", "watch"];
  for (const k of keys) {
    const text = String(a[k] ?? "");
    const n = text.trim().split(/\s+/).filter(Boolean).length;
    if (n < 50) {
      throw new Error(`story() "${k}" has ${n} words (need >= 50): ${text}`);
    }
  }
  return [
    "The problem before",
    a.problem,
    "",
    "What this is",
    a.what,
    "",
    "What it solves",
    a.solves,
    "",
    "Real-life example",
    a.example,
    "",
    "Uses",
    a.uses,
    "",
    "Watch out",
    a.watch
  ].join("\n");
};

const codes = (js, py, java, cpp) => ({
  javascript: js,
  python: py,
  java,
  cpp
});

const notes = [
  {
    title: "The problem before OOP",
    body: story({
      problem:
        "Name, marks, and payFees lived in three lists. Change a fee rule and you hunt twenty files. A typo in one list left a student without a marksheet. The clerk then matched Ada in the name drawer to a blank row while Bob's fee stamp sat on someone else's folder. Parent night mixed the three drawers and nobody could swear which paper was Ada's.",
      what:
        "OOP keeps the data and the actions that belong to it in one object. A class is the rubber stamp in the office drawer. An object is one inked copy such as Ada walking in. The clerk opens her folder and finds the name, the marks slot, and the pay-fees stamp already inside, so she never tapes three hallway lists onto one cover. That packing of state plus behaviour is the whole idea.",
      solves:
        "You ask ada.payFees() instead of payFees(adaId) plus a global table. Interviews call this the four pillars: encapsulation, abstraction, inheritance, polymorphism. After those words they will ask you to draw Student and point at each pillar on the folder. One object is the map, so a fee change is one restamp, not a hunt.",
      example:
        "A school file folder: one Student folder holds the name and the rubber stamp 'pay fees'. You do not keep marks in a drawer down the hall. When the fee rule changes, the clerk restamps that one folder instead of hunting three lists. Ada's cover and Bob's cover are two inked copies, not two new stamps carved for each child.",
      uses:
        "Java, C++, C#, Python, and modern JavaScript. Switch the language button — same idea, different spelling. An interviewer at TCS or Amazon still wants the folder picture first, then the lines in the language the job posting named. Start with Ada's folder before you name a design pattern or a pillar word.",
      watch:
        "A 20-line script does not need a class tree. Deep inheritance is how code goes stiff. If they ask when not to use OOP, say a one-off fee report that never grows a second student type. Do not invent a Person hierarchy for a single print of today's till tape."
    })
  },
  {
    title: "Four pillars (same in every language)",
    body: story({
      problem:
        "People recited 'inheritance polymorphism' and could not point at a line of code. The interviewer then asked them to mark private marks and speak() on a paper Student, and the four words sat unused on the whiteboard. The marker waited while the candidate listed posters, not folders, and the clerk picture never appeared.",
      what:
        "Encapsulation means hide the fields and offer methods, like a locker with a slot. Abstraction means show payFees() and hide the bank math behind the counter. Inheritance means Student is a Person, so the child stamp already inks the shared name. Polymorphism means the same speak() does different work on Dog and Cat. Point at one line for each word when they hand you a marker, then stop listing posters.",
      solves:
        "One story you can tell, then press Java or Python and show the lines. The same four pictures survive the language switch, so you are not learning four different pillars for four kitchens. They will next ask you to pick Student or Animal and walk the pillars in order. The folder, lock, parent stamp, and speak() button stay on the board.",
      example:
        "A TV remote is abstraction. The screws inside are encapsulation. A school bus is a vehicle, which is inheritance. Every vehicle starts(), but a bus and a bike start differently, which is polymorphism. If they ask for a fifth picture, say the clerk stamps payFees without opening the bank drawer, and leave Wikipedia in the bag.",
      uses:
        "Every OOP interview at Amazon, Google, Microsoft, TCS, Infosys. Campus labs use the same four words, then they hand you a marker and wait for Student, not a Wikipedia paragraph. Keep the four pictures ready before you name a design pattern. Ninety seconds of folders beats five minutes of slogans.",
      watch: "Listing the four words with no example. They will ask you to draw Student. If you cannot mark private marks, payFees(), extends Person, and speak() on Dog versus Cat, the four words do not count. A recitation without the folder is a poster, not an answer they will accept. They will wait for the folder picture if you only recite the poster."
    })
  },
  {
    title: "Language spelling",
    body: story({
      problem:
        "The idea is the same. The words change: this vs self, extends vs :, interface vs ABC vs virtual. Candidates froze when the interviewer switched from Java to Python and asked where super went. The folder picture vanished the moment the kitchen spelling changed, and Ada's stamp had no name in the new language.",
      what:
        "Java and C++ are class-heavy kitchens. Python and JavaScript can do OOP but also stay functional. C has structs, not classes — that is why this topic's buttons are JS, Python, Java, C++. The stamp, folder, and lock stay on the clerk's desk; only the kitchen spelling of this, self, extends, and virtual changes. You keep Ada's cover and swap the ink, not the idea of a student.",
      solves:
        "You can sit a Java interview or a Python one with the same pictures. When they switch the language, you keep Ada's folder and only change this to self or extends to the colon. The four pillars do not get a fifth meaning in a new kitchen, so you are not relearning school from scratch.",
      example: "The same dosa recipe in four kitchens. Oil and pan change. The dosa does not. Java uses a heavy tawa; Python uses a lighter pan; the clerk still flips one dosa called Student. Super is still the parent stamp, whether you write super(n) or Person(n) in the C++ list. A new guest still uses the same window, so nobody retrains the line.",
      uses: "Pick the language the job lists. The pillars do not change. Amazon Java, a Python startup, and a C++ systems round still want the same Student folder, only the spelling of this, self, and virtual changes. Say the folder first, then the keyword the posting named. Campus labs and Amazon both wait for the folder before a pattern catalog.",
      watch: "Saying JavaScript has no classes. ES6 class is syntactic sugar over prototypes — still say that in interviews. They will next ask whether class is hoisted like function, and the honest answer is no. The stamp looks printed; underneath it is still the old rubber prototype kit. Keep the clerk picture on the board and do not invent a second kitchen."
    })
  },
  {
    title: "SOLID in shop words",
    body: story({
      problem:
        "After the four pillars, they ask SOLID. People recited five letters and could not point at Student. The clerk still mixed fee rules into the marksheet class, and a Square that stretched like a Rectangle failed the next question. Five posters sat on the wall while the shop still had one overworked till.",
      what:
        "S means one reason to change, so fees and marks are two clerks. O means add a class, do not edit the old switch when a Bird arrives. L means a Student can stand where a Person stands without breaking promises. I means many small contracts, not one fat interface. D means depend on the idea Payable, not the UPI class. Give one shop sentence per letter, then stop before the essay.",
      solves:
        "You can give one shop picture per letter instead of a Wikipedia dump. The interviewer hears that fees and marks are two clerks, a new Bird is a new class, and checkout talks to Payable rather than one branded UPI machine. Two letters they pick next already have a folder you can point at.",
      example:
        "S: fees clerk vs marksheet clerk. O: a new Bird, not a new if. L: a Square that breaks Rectangle. I: Payable is just pay(). D: the shop talks to a till, not to one branded machine. They will pick two letters and ask you to point; keep the stretchy Square and the till ready, not five speeches.",
      uses: "Follow-up after the four pillars at Amazon, Microsoft, campus labs. If you already drew Student, they often ask S and L next, so keep the fees clerk and the stretchy Square ready. You do not need a design-pattern catalog once those two shop pictures are on the board. Google and Meta still ask you to mark it on Student or Animal next.",
      watch: "Explaining all five for ten minutes. They want two sentences and one example. If you start quoting Wikipedia, they will cut you and ask which clerk owns the fee rule on Student. Point at the fees drawer and stop talking. A poster with no folder is not an answer they will accept."
    })
  }
];

const examples = [
  {
    title: "Class and object",
    desc: story({
      problem: "A student was three loose variables. Change the name spelling and the marks row still said Adah, so the clerk handed out a blank marksheet while payFees looked up the wrong id in a third list. Parent night then mixed the hallway drawers, and nobody could swear which paper belonged to Ada.",
      what: "class Student is the rubber stamp in the office drawer. new Student('Ada') / Student('Ada') is one inked folder on the shelf. The stamp knows the slots for name and hello(); each inked copy fills those slots for one person walking into the office. Ada and Bob are two folders from one stamp, not two new class files carved for each child.",
      solves: "Name and payFees travel together. The clerk never hunts a global table for Ada's id, and a rename updates the folder she already holds instead of three drawers down the hall. A fee-rule change is a restamp of Student, not a search through twenty files that each knew a different Ada.",
      example: "One rubber stamp, many report cards. The office keeps one Student stamp in the drawer, then inks Ada's card and Bob's card; each card is a folder, not a second stamp. You do not carve a new metal cutter when the next child walks into the canteen. The clerk keeps that beat on the desk when the next child walks in.",
      uses: "Every OOP language. Java, Python, JavaScript, and C++ all start here, and the interviewer will ask you to write the stamp and one folder before any pillar words. Start with Ada before you name a pillar. Campus labs and Amazon both open the round on this pair. Keep the clerk picture on the board when they hand you the marker.",
      watch: "Confusing the class (the idea) with one object (Ada). If you say 'the class Ada', they will ask how you would make Bob without photocopying Ada's whole file. Keep the stamp and the card separate. Point at Student as the cutter and ada as the cookie. They will wait for the folder picture if you only recite the poster."
    }),
    codes: codes(
      `class Student {
  constructor(name) { this.name = name; }  // one folder
  hello() { return "Hi " + this.name; }
}
const ada = new Student("Ada");  // one object
console.log(ada.hello());`,
      `class Student:
    def __init__(self, name):  # one folder
        self.name = name
    def hello(self):
        return "Hi " + self.name

ada = Student("Ada")  # one object
print(ada.hello())`,
      `class Student {
  String name;
  Student(String name) { this.name = name; }  // one folder
  String hello() { return "Hi " + name; }
}
Student ada = new Student("Ada");  // one object
System.out.println(ada.hello());`,
      `class Student {
 public:
  string name;
  Student(string n) : name(n) {}  // one folder
  string hello() { return "Hi " + name; }
};
Student ada("Ada");  // one object
cout << ada.hello();`
    )
  },
  {
    title: "Encapsulation (private + method)",
    desc: story({
      problem: "Anyone could set marks = -5 or salary = 0. An intern typed into the open register, the clerk printed a negative marksheet, and the bank paid a zero salary because no door checked the number. The next test poked the same public field and the locker still had no slot.",
      what: "Fields stay private. A method checks the rule at the door. The locker has a slot: deposit() accepts a positive amount, balance() reads the total, and no other file may touch the rupees pile inside. Encapsulation is that packing of data plus the only allowed stamps, so the hallway cannot scribble on the cash.",
      solves: "Bad values are refused at the door. The folder never stores a negative mark or an empty salary, so later reports and interviews see data that still matches the shop rule. A rename of the private pile stays inside one class instead of breaking twenty tests that knew the locker guts.",
      example: "The locker is locked. You pass money through the slot. The clerk counts it, stamps the slip, and never lets a customer reach into the cash box to scribble a new total. An intern with a pen still cannot write minus five on the inside pile. A new guest still uses the same window, so nobody retrains the line.",
      uses: "Bank balance, marks, passwords. Any number that would wreck a report if a stray file wrote -1 belongs behind a method, not on a public field. Lock the locker before the intern arrives. Interviews after 'what is OOP' almost always hide marks or rupees next. Say the shop sentence, then write the lines in the language the posting named.",
      watch: "Public fields 'just for now'. Tomorrow a test will poke marks = -5, and the interviewer will ask why the locker had no door if you already knew the rule. A please-do-not-touch comment is not a lock, and they will type the poke in front of you. They will wait for the folder picture if you only recite the poster."
    }),
    codes: codes(
      `class Account {
  #rupees = 0;  // private
  deposit(n) {
    if (n > 0) this.#rupees += n;  // rule at the door
  }
  balance() { return this.#rupees; }
}`,
      `class Account:
    def __init__(self):
        self.__rupees = 0  # private by convention
    def deposit(self, n):
        if n > 0:
            self.__rupees += n
    def balance(self):
        return self.__rupees`,
      `class Account {
  private int rupees = 0;
  void deposit(int n) {
    if (n > 0) rupees += n;  // rule at the door
  }
  int balance() { return rupees; }
}`,
      `class Account {
  int rupees = 0;  // keep private in real code
 public:
  void deposit(int n) { if (n > 0) rupees += n; }
  int balance() { return rupees; }
};`
    )
  },
  {
    title: "Inheritance",
    desc: story({
      problem: "Student and Teacher copied the same name and email fields. A typo fix landed in Student only, so the teacher list still said Gmal, and the clerk printed two kinds of ID cards from two slightly different stamps. The office kept two name drawers that drifted apart every week. Parent night mixed the leftover drawers and the stamp sat idle.",
      what: "Person holds the shared bits on the parent stamp. Student extends or inherits Person. The child stamp already inks name, then adds rollNumber; Teacher inks the same name slot and adds a staff id instead of copying the name field by hand. is-a means the child folder can stand at the Person desk without a second handwritten cover.",
      solves: "One name field. Extra rollNumber only on Student. When the office changes how names print, both folders pick up the change because they share the Person stamp, not a photocopied drawer. A spelling fix is one restamp, and the teacher cards stop saying Gmal the next morning. A later restamp stays in one drawer instead of twenty hallway lists.",
      example: "A school bus is a vehicle. It already has wheels. It adds a stop-sign. You do not rebuild the chassis for every bus; you stamp Vehicle once and ink the extra stop-sign on the school-bus folder. Cars in the shed keep the wheels and skip the stop-sign. Pull that picture apart and you are back to hallway lists and ifs.",
      uses: "UI widgets, animals, users/admins. Button extends Widget, Dog extends Animal, Admin extends User — each child is a true is-a, not a grab bag of leftover methods. The interviewer will ask you to name the parent. Say Person before you write rollNumber. Say the shop sentence, then write the lines in the language the posting named.",
      watch: "Inheriting just to reuse one function. Prefer composition. If Student is not a Person in real life, put a helper object inside the folder instead of stretching the family tree. A child that is not honestly an is-a will fail the next Liskov question. Keep the stamp on the folder and wait for the next honest question."
    }),
    codes: codes(
      `class Person {
  constructor(name) { this.name = name; }
}
class Student extends Person {
  constructor(name, roll) {
    super(name);  // Person's constructor
    this.roll = roll;
  }
}`,
      `class Person:
    def __init__(self, name):
        self.name = name

class Student(Person):
    def __init__(self, name, roll):
        super().__init__(name)
        self.roll = roll`,
      `class Person {
  String name;
  Person(String name) { this.name = name; }
}
class Student extends Person {
  int roll;
  Student(String name, int roll) {
    super(name);
    this.roll = roll;
  }
}`,
      `class Person {
 public:
  string name;
  Person(string n) : name(n) {}
};
class Student : public Person {
 public:
  int roll;
  Student(string n, int r) : Person(n), roll(r) {}
};`
    )
  },
  {
    title: "Polymorphism (same call, different work)",
    desc: story({
      problem: "You wrote if (type == dog) bark else meow in twenty places. A new Bird arrived, every file needed another else, and one forgotten if still printed meow on the bird's report card. The demo morning mixed the zoo list and the clerk had no honest stamp for the new animal.",
      what: "speak() lives on the parent. Dog and Cat override it. You call animal.speak(). The real folder in the list decides the sound; the clerk does not open a type column and run a chain of ifs. Polymorphism is that same message hitting different stamps, so a Bird can join the list with its own song and no extra else.",
      solves: "A new Bird needs a new class, not a new if. You add speak() on Bird, drop the object in the same list, and the old loop already prints the right line without touching twenty files. The zoo clerk restamps one child and the morning demo stays honest. A later restamp stays in one drawer instead of twenty hallway lists.",
      example: "The teacher says 'introduce yourself'. Each student answers differently. Ada reads a poem, Bob states his roll, and the teacher never writes if Ada then poem in the lesson plan. A new child joins the circle and still hears the same introduce button. Pull that picture apart and you are back to hallway lists and ifs.",
      uses: "Shapes.area(), payments.pay(), notifications.send(). Any time a parent type holds mixed children and one call must do the right work, this is the picture they want. Draw the zoo list before you write an if. Amazon and campus labs both wait for speak() on the parent. Keep that picture ready before they switch the language button.",
      watch: "Forgetting virtual in C++. The parent version runs by mistake. Java, Python, and JavaScript already dispatch on the real object; C++ needs virtual or the empty parent song plays. Write virtual on speak() first, and add a virtual destructor if you delete through Animal*. A poster with no folder is not an answer they will accept."
    }),
    codes: codes(
      `class Animal { speak() { return "..."; } }
class Dog extends Animal { speak() { return "woof"; } }
class Cat extends Animal { speak() { return "meow"; } }
[new Dog(), new Cat()].forEach(a => console.log(a.speak()));`,
      `class Animal:
    def speak(self):
        return "..."
class Dog(Animal):
    def speak(self):
        return "woof"
class Cat(Animal):
    def speak(self):
        return "meow"
for a in (Dog(), Cat()):
    print(a.speak())`,
      `class Animal { String speak() { return "..."; } }
class Dog extends Animal { String speak() { return "woof"; } }
class Cat extends Animal { String speak() { return "meow"; } }
Animal[] zoo = { new Dog(), new Cat() };
for (Animal a : zoo) System.out.println(a.speak());`,
      `class Animal {
 public:
  virtual string speak() { return "..."; }
};
class Dog : public Animal {
 public:
  string speak() override { return "woof"; }
};
Animal* a = new Dog();
cout << a->speak();  // woof — needs virtual`
    )
  },
  {
    title: "Getter and setter",
    desc: story({
      problem: "marks = -5 from any file. Or every field was public 'just this once'. The intern scribbled in the register, the clerk printed a negative total, and the next test poked the same open field again. Parent night then showed a minus on Ada's card because the locker still had no clerk at the window.",
      what: "A getter reads. A setter writes after a rule. The field stays private. The clerk is the only person who opens the marks box; everyone else asks for the stamped number or hands in a slip that can be refused. That pair is encapsulation with a named door: getMarks shows the total, setMarks checks the floor of zero.",
      solves: "The folder will not accept a negative mark. Later code can change how marks are stored, and callers still call the same getter, so a storage change does not hunt twenty files. The intern's pen never reaches the register, and reports stay legal for the interview demo. The next marker question already has a folder you can point at.",
      example: "The clerk stamps the marksheet. You do not scribble in the register yourself. You pass a slip through the window; if the number is below zero the clerk hands it back and the book stays clean. A later storage change still uses the same window, so the hallway never learns the box guts.",
      uses: "Java beans, Python @property, JS get/set. Interviews after encapsulation almost always ask you to write getMarks and setMarks with a floor of zero. Show the private field and the door. Name the language on the job posting and still keep the clerk picture. Keep that picture ready before they switch the language button.",
      watch: "A setter that only assigns, no rule — that is a public field in a costume. They will ask what setMarks(-5) does, and 'it stores -5' fails the door test. Refuse the slip, keep the field private, and do not dress a public slot in get and set hats. Keep the clerk picture on the board and do not invent a second kitchen."
    }),
    codes: codes(
      `class Student {
  #marks = 0;
  get marks() { return this.#marks; }          // read
  set marks(n) { if (n >= 0) this.#marks = n; } // rule
}`,
      `class Student:
    def __init__(self):
        self.__marks = 0
    @property
    def marks(self):
        return self.__marks
    @marks.setter
    def marks(self, n):
        if n >= 0:
            self.__marks = n`,
      `class Student {
  private int marks;
  int getMarks() { return marks; }
  void setMarks(int n) { if (n >= 0) marks = n; }
}`,
      `class Student {
  int marks = 0;
 public:
  int getMarks() { return marks; }
  void setMarks(int n) { if (n >= 0) marks = n; }
};`
    )
  },
  {
    title: "Compile-time vs run-time polymorphism",
    desc: story({
      problem: "They asked 'two kinds of polymorphism' and people only said override. The follow-up was print(int) versus print(string) in Java, and the candidate had no second word, so the kitchen picture never appeared. The whiteboard kept one song title and never grew the two print counters. The guest line stopped while someone hunted a missing honest folder.",
      what: "Overload is compile-time: same name, different args, chosen while the kitchen is still on paper — Java and C++. Override is run-time: the child replaces the parent, and the real object decides which song plays. JavaScript and Python skip overload and use defaults; still name both kinds so a Java interviewer hears the pair and a Python interviewer hears the honest skip.",
      solves: "You name both in a Java interview. In JS and Python you say we do not overload; we override and use defaults. That one sentence stops them from marking you as someone who only memorized override. You can label add(a,b) versus Kid.add without mixing the two kitchens. The next marker question already has a folder you can point at.",
      example: "Overload: two kitchens named print. Override: the child sings a new song to the same title. The hotel has two print counters with different menus; the child choir keeps the title and changes the lyrics at show time. Java posts both counters; JavaScript still has one cook with default arguments.",
      uses: "Java and C++ screens after the four pillars. Expect a whiteboard with add(a,b) and add(a,b,c) beside a Kid that replaces add, and be ready to label compile-time versus run-time. Name both words out loud. Campus labs love this wording right after override versus overload. Name the door they should press, not a Wikipedia paragraph, then stop.",
      watch: "Calling JS default arguments overloading. There is still one function. They will ask how many methods Calc has, and 'two' is the wrong count in JavaScript. Count the methods in the class body. Point at the single add and say defaults, not a second kitchen. Keep the clerk picture on the board and do not invent a second kitchen."
    }),
    codes: codes(
      `class Calc { add(a, b = 0) { return a + b; } }  // defaults, not overload
class Kid extends Calc { add(a, b = 0) { return super.add(a, b); } }`,
      `class Calc:
    def add(self, a, b=0):
        return a + b
class Kid(Calc):
    def add(self, a, b=0):
        return super().add(a, b)`,
      `class Calc {
  int add(int a, int b) { return a + b; }           // compile-time
  int add(int a, int b, int c) { return a+b+c; }
}
class Kid extends Calc {
  int add(int a, int b) { return super.add(a, b); } // run-time
}`,
      `class Calc {
 public:
  int add(int a, int b) { return a + b; }
  int add(int a, int b, int c) { return a+b+c; }
};
class Kid : public Calc {
 public:
  int add(int a, int b) override { return Calc::add(a, b); }
};`
    )
  }
];

const Q = (id, level, q, a, c, ask) => ({
  id,
  level,
  q,
  a: story(a),
  codes: c,
  ask
});

const questions = [
  Q(1, "beginner", "What is OOP?", {
    problem: "Loose functions and global lists. A student lived in three arrays. Change a fee rule and the clerk hunts the name list, the marks list, and the payFees table, then a typo leaves Ada without a marksheet. Parent night mixes the three drawers and nobody can swear which paper is hers.",
    what: "Object-Oriented Programming groups data and actions into objects. A class is the blueprint stamp. The stamp named Student already knows name and payFees; each inked folder is one person, not three drawers taped together. The clerk opens Ada and finds the cover, the marks slot, and the fee stamp already inside, so the hallway lists can stay shut.",
    solves: "ada.payFees() instead of hunting payFees(id) plus a global table. The folder already knows whose fees to stamp, so a rename or a new fee rule lives in one place the clerk can actually find. Interviews then let you point at Student instead of waving at three arrays. The zoo list or the fee door keeps working when a new child walks in.",
    example: "One school folder per student. The stamp 'pay fees' lives on the folder. You do not keep Ada's name in a hall drawer and her fee rubber-stamp in a different cabinet two rooms away. Bob gets his own inked copy from the same Student stamp, not a second class file.",
    uses: "Java, C++, C#, Python, JS interviews — first question. They want the folder picture in under a minute, then they ask you to write class Student and one object named ada. Campus labs and Amazon both open here before any pillar word. Google and Meta still ask you to mark it on Student or Animal next.",
    watch: "Reciting a definition with no class vs object. If you cannot say the stamp is Student and the inked copy is Ada, they will stop you and ask for a drawing. Do not start with design patterns while the folder is still blank. Keep the stamp on the folder and wait for the next honest question."
  }, codes(
    `class Student { constructor(name) { this.name = name; } }
const ada = new Student("Ada");`,
    `class Student:
    def __init__(self, name):
        self.name = name
ada = Student("Ada")`,
    `class Student {
  String name;
  Student(String n) { name = n; }
}
Student ada = new Student("Ada");`,
    `class Student {
 public:
  string name;
  Student(string n) : name(n) {}
};
Student ada("Ada");`
  ), "Most asked · Amazon · Google · Microsoft · TCS"),

  Q(2, "beginner", "Class vs object?", {
    problem: "People said 'the class Ada' as if the stamp and the card were the same. The interviewer then asked how many files you would write for forty students, and the candidate started photocopying Ada's whole class. The office would have drowned in duplicate stamps by lunch. Ada's card and Bob's card no longer matched the same office story.",
    what: "A class is the stamp named Student. An object is one inked copy such as ada. Many objects, one class. The office keeps one rubber stamp in the drawer and inks a fresh card for Ada, then another for Bob, without carving a second stamp. Forty children still share one cutter; each cookie on the tray is a folder, not a new metal tool.",
    solves: "You can have 40 students without 40 class files. One stamp, forty folders. A change to how names print is a change to the stamp, not a hunt through forty handwritten copies of the class. The clerk restamps Student once and every cover picks it up. The zoo list or the fee door keeps working when a new child walks in.",
    example: "Cookie cutter vs one cookie. The cutter is the class. Ada is one cookie on the tray, Bob is the next cookie; you do not bake a new metal cutter for each child who walks into the canteen. The tray holds many cookies from one shape. A new guest still uses the same window, so nobody retrains the line.",
    uses: "Every beginner round. Amazon, TCS, and campus labs all open with this pair, then they watch whether you write class Student once and new Student twice. Two cookies, one cutter. Say stamp versus card before you write a line. Say the shop sentence, then write the lines in the language the posting named.",
    watch: "new Student used as if it were the class itself. If you point at ada and say 'that is the class', they will ask what you would name the stamp that made Bob. Keep the cutter in the drawer and the cookies on the tray. Keep the stamp on the folder and wait for the next honest question."
  }, codes(
    `class Student {}           // the stamp
const a = new Student();  // cookie 1
const b = new Student();  // cookie 2`,
    `class Student:
    pass
a = Student()
b = Student()`,
    `class Student {}
Student a = new Student();
Student b = new Student();`,
    `class Student {};
Student a;
Student b;`
  ), "Most asked · Amazon · Google · Microsoft"),

  Q(3, "beginner", "What are the four pillars of OOP?", {
    problem: "A list of words with no picture. The interviewer handed a marker, asked where private marks live, and the four words sat on the whiteboard while the Student drawing stayed blank. The clerk picture never arrived, so the round stalled on posters. The clerk could not swear which paper was still true that morning.",
    what: "Encapsulation hides fields behind a lock. Abstraction shows the payFees button and hides the bank math. Inheritance is the is-a child stamp. Polymorphism is the same call doing different work. Say each word, then point at one line: private marks, payFees(), extends Person, and speak() on Dog versus Cat. That pointing is the answer, not the poster list.",
    solves: "One minute answer plus a Student or Animal example. You sound like you have opened a folder, not like you recited a poster, and they can follow you into Java or Python on the same pictures. The next question is already easier because the lock and the speak() button are on the board.",
    example: "Remote, screws, bus-is-vehicle, start() on bus vs bike. The clerk shows the TV remote, never the screws; the school bus already is a vehicle; start() still means something different in the bike shed. Four pictures, one school tour, no Wikipedia dump. The clerk keeps that beat on the desk when the next child walks in.",
    uses: "Amazon, TCS, Infosys, campus interviews. This is the question after 'what is OOP', and they will pick one pillar and ask you to mark it on Student before they move on. Keep the four pictures ready before you name a design pattern. Campus labs and Amazon both wait for the folder before a pattern catalog.",
    watch: "Stopping at the four words. They will ask you to draw Student. If you cannot mark the lock, the button, the parent stamp, and the two speak() songs, the list does not count. A recitation without Ada's folder is a fail. Draw the honest family tree or they will reject the child stamp."
  }, codes(
    `// encapsulate: #marks private
// abstract:    payFees()
// inherit:     class Student extends Person
// poly:        dog.speak() vs cat.speak()`,
    `# encapsulate: __marks
# abstract:    pay_fees()
# inherit:     class Student(Person)
# poly:        dog.speak() vs cat.speak()`,
    `// encapsulate: private int marks
// abstract:    payFees()
// inherit:     class Student extends Person
// poly:        dog.speak() vs cat.speak()`,
    `// encapsulate: private marks
// abstract:    payFees()
// inherit:     class Student : public Person
// poly:        virtual speak()`
  ), "Most asked · Amazon · Google · Microsoft · Meta"),

  Q(4, "beginner", "What is encapsulation?", {
    problem: "marks = -5 from any file. Invariants died. An intern wrote into the open register, the clerk printed a negative marksheet, and the next test still poked the same public field. Parent night showed a minus on Ada's card because the locker had no door. The desk then had no honest cover left to hand the parent.",
    what: "Bundle fields with methods. Make fields private. Check rules in setters. The locker has a slot: only deposit() may add rupees, only a setter may change marks, and the pile inside is not a public number on the counter. Encapsulation is that packing, so the hallway cannot smash the shop rule with one assignment.",
    solves: "The object guards its own data. Callers cannot smash the invariant from across the hallway, so a later report still shows a legal balance and the clerk does not chase a ghost row. A rename of the private pile stays inside one class instead of breaking twenty tests. Parent night then shows two honest cards instead of one mixed pile.",
    example: "ATM slot. You cannot reach into the cash box. You push a card and a number through the door; the machine counts, stamps the slip, and keeps the notes behind the lock you never open. An intern with a pen still cannot write zero on the inside pile. The clerk keeps that beat on the desk when the next child walks in.",
    uses: "Balances, passwords, game health. Anywhere a stray assignment would wreck a report belongs behind a method, and interviews will ask you to hide marks or rupees next. Put the rule in the setter. Amazon and campus labs both lock the locker before the next pillar. Google and Meta still ask you to mark it on Student or Animal next.",
    watch: "Public fields plus a 'please do not touch' comment. The intern will touch them. The interviewer will type marks = -5 in front of you and wait for the door you forgot. A comment is not a lock, and they will poke it. A poster with no folder is not an answer they will accept."
  }, codes(
    `class Bank {
  #bal = 0;
  deposit(n) { if (n > 0) this.#bal += n; }
}`,
    `class Bank:
    def __init__(self):
        self.__bal = 0
    def deposit(self, n):
        if n > 0:
            self.__bal += n`,
    `class Bank {
  private int bal = 0;
  void deposit(int n) { if (n > 0) bal += n; }
}`,
    `class Bank {
  int bal = 0;
 public:
  void deposit(int n) { if (n > 0) bal += n; }
};`
  ), "Most asked · Amazon · Microsoft · Google"),

  Q(5, "beginner", "What is abstraction?", {
    problem: "Callers had to know how the bank talks to UPI and cash. Every fee change reopened twenty files, and a new wallet meant rewriting the school counter instead of swapping one drawer behind the door. The parent at the window was asked to wire the house. The whiteboard stayed blank while the mess on the desk grew.",
    what: "Show a simple door named payFees. Hide the messy steps. The clerk stamps pay; UPI, cash, or a later wallet stay behind the counter, so the parent at the window never wires the house. Abstraction is that public button: one stamp the caller knows, and a cupboard of cables they never open.",
    solves: "You can change the bank later. Callers still call payFees(). The folder's public door stays the same, so a new payment brand is a new inside drawer, not a hunt through every class that pays. The school counter keeps one button while the till brand changes. The clerk finds the rule in one place and the demo morning stays honest.",
    example: "A light switch. You do not wire the house each time. You flip one button on the wall; the messy cables, the meter, and the fuse box stay in the cupboard the guest never opens. A new meter still uses the same switch, so the guest is not retrained. The clerk keeps that beat on the desk when the next child walks in.",
    uses: "APIs, interfaces, 'I only need start()'. Interviews after encapsulation ask this next, and they want you to name the button you show versus the bank math you hide. Keep the wires in the cupboard. Amazon and TCS both split this word from the lock. Write the stamp once, then show two folders, then wait for the next pillar.",
    watch: "Exposing 20 getters that leak the whole insides. That is a glass locker, not a door. They will ask whether getUpiHost() is abstraction, and the honest answer is no. Hide the host name too. A remote with twenty wire labels is not a button. They will wait for the folder picture if you only recite the poster."
  }, codes(
    `class Fees {
  pay() { /* UPI or cash — caller does not care */ }
}
new Fees().pay();`,
    `class Fees:
    def pay(self):
        # UPI or cash — caller does not care
        pass
Fees().pay()`,
    `class Fees {
  void pay() { /* UPI or cash */ }
}
new Fees().pay();`,
    `class Fees {
 public:
  void pay() { /* UPI or cash */ }
};
Fees().pay();`
  ), "Most asked · Amazon · Google"),

  Q(6, "beginner", "What is inheritance?", {
    problem: "Student and Teacher both copied name and email. A spelling fix landed only on Student, so the teacher ID cards still said Gmal, and the clerk kept two slightly different stamps for the same name slot. The two name drawers drifted apart every week after that. Parent night mixed the leftover drawers and the stamp sat idle.",
    what: "A child class reuses a parent's fields and methods. is-a: Student is a Person. The child stamp already inks name from Person, then adds rollNumber; you do not photocopy the name field into a second drawer by hand. Teacher inks the same shared name and adds a staff id, so both children stand at the Person desk honestly.",
    solves: "Shared code lives once. Extra fields live on the child. When the office changes how names print, every Person folder picks it up, and Student still carries the extra roll the parent never needed. A spelling fix is one restamp, and the teacher cards stop saying Gmal. A rename of Ada updates the same cover the method will stamp.",
    example: "A school bus is a vehicle. Wheels are free. Stop-sign is extra. You stamp Vehicle once for the chassis, then ink the stop-sign only on the bus folder, not on every car in the shed. Cars keep the wheels and skip the extra sign. The clerk keeps that beat on the desk when the next child walks in.",
    uses: "UI Button extends Widget. Admin extends User. Interviews want a true is-a: the child can stand where the parent stands, not a grab of one helper function from a stranger class. Name the parent before you write the extra field. Write the stamp once, then show two folders, then wait for the next pillar.",
    watch: "Inheriting just to steal one function. That is not is-a. If Student is not a Person in the shop, put a helper object inside the folder and keep the family tree honest. A stretchy child will fail the next Liskov question they ask. Keep the stamp on the folder and wait for the next honest question."
  }, codes(
    `class Person { constructor(n) { this.name = n; } }
class Student extends Person {
  constructor(n, roll) { super(n); this.roll = roll; }
}`,
    `class Person:
    def __init__(self, n):
        self.name = n
class Student(Person):
    def __init__(self, n, roll):
        super().__init__(n)
        self.roll = roll`,
    `class Person { String name; Person(String n) { name = n; } }
class Student extends Person {
  int roll;
  Student(String n, int r) { super(n); roll = r; }
}`,
    `class Person { public: string name; Person(string n): name(n) {} };
class Student : public Person {
 public:
  int roll;
  Student(string n, int r) : Person(n), roll(r) {}
};`
  ), "Most asked · Amazon · Google · Microsoft"),

  Q(7, "beginner", "What is polymorphism?", {
    problem: "if (t==dog) bark; else if (t==cat) meow; in ten files. A new Bird arrived, nine files got an else, and the tenth still printed meow on the bird's report card the morning of the demo. The zoo list had no honest stamp for the new animal. The guest line stopped while someone hunted a missing honest folder.",
    what: "Same message, different action. Override speak() on each child. Call through the parent type. The real folder in the list decides the sound; the clerk does not open a type column and walk a chain of ifs. Polymorphism is that one introduce button hitting Ada's poem and Bob's roll without a lesson-plan if.",
    solves: "A new Bird is a new class, not a new if. You add speak() on Bird, drop the object in the same zoo list, and the old loop already prints the right line without touching ten files. The demo morning stays honest because the forgotten else no longer exists. The next marker question already has a folder you can point at.",
    example: "Teacher says 'introduce yourself'. Each student answers their own way. Ada reads a poem, Bob states his roll, and the teacher never writes if Ada then poem into the lesson plan. A new child still hears the same button when they join the circle. Pull that picture apart and you are back to hallway lists and ifs.",
    uses: "area() on shapes. pay() on UPI/Card. Any parent list that holds mixed children and one call must do the right work — this is the picture they want after inheritance. Draw the zoo list before you write an if. Amazon and Meta both wait for speak() on the parent. TCS and Microsoft still open here, then pick one follow-up on the same drawing.",
    watch: "C++ without virtual — parent method runs. Java, Python, and JavaScript already dispatch on the real object; forget virtual and the empty parent song plays while the Dog sits in the pointer. Write virtual on speak() first, and a virtual destructor if you delete through Animal*. They will wait for that fail picture if you skip the door."
  }, codes(
    `class Shape { area() { return 0; } }
class Circle extends Shape { area() { return 3.14; } }
console.log(new Circle().area());`,
    `class Shape:
    def area(self):
        return 0
class Circle(Shape):
    def area(self):
        return 3.14
print(Circle().area())`,
    `class Shape { double area() { return 0; } }
class Circle extends Shape { double area() { return 3.14; } }
Shape s = new Circle();
System.out.println(s.area());`,
    `class Shape { public: virtual double area() { return 0; } };
class Circle : public Shape {
 public:
  double area() override { return 3.14; }
};
Shape* s = new Circle();
cout << s->area();`
  ), "Most asked · Amazon · Google · Microsoft · Meta"),

  Q(8, "intermediate", "Overriding vs overloading?", {
    problem: "The two words sound alike. Interviews love the difference. Candidates said override for print(int) versus print(string), then froze when asked what JavaScript actually has. The kitchen count was wrong and the Java follow-up died. The whiteboard kept one song title and never grew the two print counters. Ada's card and Bob's card no longer matched the same office story.",
    what: "Override means same name and same args, child replaces parent. Overload means same name, different args, same class. JS and Python do not overload; Java and C++ do. Keep both sentences ready so a Java kitchen and a Python kitchen get the right word. Compile-time picks the overload on paper; run-time picks the override from the real folder in the list.",
    solves: "You pick the right word in a Java vs Python interview. You can say Kid replaces add, and also say two add kitchens in one Calc class, without mixing the songs. The interviewer hears compile-time and run-time as two labels, not one mashed slogan. The interviewer hears a shop sentence and lets you write the lines next.",
    example: "Override: the child sings a new song to the same title. Overload: print(int) and print(string) are two kitchens. The hotel posts two print counters with different menus; the child choir keeps the title and changes the lyrics at show time. JavaScript still has one cook with default arguments. Ada gets one inked copy; Bob gets another; the stamp in the drawer stays one.",
    uses: "Java/C++ jobs ask both. JS/Python: say 'we use default args / rest'. After the four pillars they often draw add(a,b) beside add(a,b,c) and wait for the word compile-time. Label override on the child line. Campus labs love this pair right after polymorphism. Campus labs and Amazon both wait for the folder before a pattern catalog.",
    watch: "Calling JS default parameters 'overloading'. There is still one function. They will ask how many methods Calc has, and counting two in JavaScript is the wrong kitchen. Point at the single add body. Defaults are one cook, not two counters. Say the honest kitchen count before they switch the language button again."
  }, codes(
    `// JS: no real overload. Use defaults.
class Calc {
  add(a, b = 0) { return a + b; }  // not two methods
}
class Kid extends Calc {
  add(a, b = 0) { return super.add(a, b); }  // override
}`,
    `# Python: no real overload. Use defaults.
class Calc:
    def add(self, a, b=0):
        return a + b
class Kid(Calc):
    def add(self, a, b=0):  # override
        return super().add(a, b)`,
    `class Calc {
  int add(int a, int b) { return a + b; }      // overload
  int add(int a, int b, int c) { return a+b+c; }
}
class Kid extends Calc {
  int add(int a, int b) { return super.add(a, b); }  // override
}`,
    `class Calc {
 public:
  int add(int a, int b) { return a + b; }
  int add(int a, int b, int c) { return a+b+c; }  // overload
};
class Kid : public Calc {
 public:
  int add(int a, int b) { return Calc::add(a, b); }  // override
};`
  ), "Most asked · Amazon · Google · Microsoft"),

  Q(9, "beginner", "What is a constructor?", {
    problem: "Objects were empty. Callers forgot to set name and left nulls. The clerk opened Ada's folder on day one and found a blank cover, so the marksheet printed 'null' and the fee stamp had nowhere to land. The guest line stopped while someone hunted a missing name. The desk then had no honest cover left to hand the parent.",
    what: "A constructor is a special method that runs when you create the object. It sets the first values. constructor, __init__, or Student(String name) inks the cover the moment the folder is opened, so name is not a later chore someone can forget. The stamp lands on day one; a blank tab is not a finished folder in this office.",
    solves: "A Student is born with a name. You cannot forget the field. new Student('Ada') already holds Ada, so the next line can stamp fees instead of checking whether someone remembered to write the cover. Null covers stop appearing on parent night because the folder never left the desk blank. Parent night then shows two honest cards instead of one mixed pile.",
    example: "Filling the name on the folder the day you open it. The clerk writes Ada on the tab before the folder hits the shelf; a blank tab is not a finished folder in this office. Bob gets his own tab the same way, from the same stamp, on the same morning.",
    uses: "Every class you write. Interviews ask you to show the constructor in the language on the job posting, then they ask what happens if you add a second constructor later. Java and C++ care about the empty one; Python and JS can keep a default argument on name. Google and Meta still ask you to mark it on Student or Animal next.",
    watch: "Heavy work (network, DB) inside a constructor. The folder should open quickly. They will ask where you would put a fee API call, and the honest answer is a method after the object exists. Do not wire the house while you are still writing the tab. A poster with no folder is not an answer they will accept."
  }, codes(
    `class Student {
  constructor(name) { this.name = name; }  // runs on new
}
new Student("Ada");`,
    `class Student:
    def __init__(self, name):  # runs on Student()
        self.name = name
Student("Ada")`,
    `class Student {
  String name;
  Student(String name) { this.name = name; }  // runs on new
}
new Student("Ada");`,
    `class Student {
 public:
  string name;
  Student(string n) : name(n) {}  // runs on Student ada(...)
};
Student ada("Ada");`
  ), "Most asked · Amazon · Microsoft"),

  Q(10, "beginner", "this vs self vs super?", {
    problem: "name was the parameter, not the field. Or the child forgot to call the parent. The cover stayed blank, roll sat alone, and the clerk filed a Student with no Person name on the tab. Parent night then showed a folder that was only half inked. The guest line stopped while someone hunted a missing honest folder.",
    what: "this in JS, Java, and C++ and self in Python mean this object, this folder. super is the parent class stamp. You write this.name = name so the folder, not the argument, keeps the name, then super(n) so Person still inks the shared tab. The child adds roll; the parent still writes the cover the office already promised.",
    solves: "You set this.name = name and still call the parent's constructor. The child folder gets roll and the parent stamp still runs, so Ada is both a Person and a Student on the same cover. A rename of the argument no longer blanks the field the clerk files. The clerk finds the rule in one place and the demo morning stays honest.",
    example: "self = this folder. super = the parent folder's stamp. The clerk inks the child tab, then reaches for the Person stamp instead of rewriting name by hand on a second scrap. Two stamps, one cover, no leftover blank tab on the shelf. The clerk keeps that beat on the desk when the next child walks in.",
    uses: "Every constructor and override. Interviews watch the first three lines of Student and ask where name is stored if you skip this or self. Then they ask whether super ran. Campus labs fail people who leave Person uncalled. Say the shop sentence, then write the lines in the language the posting named.",
    watch: "Forgetting super() in a child that has its own constructor. Person never runs. Java and JavaScript will refuse the compile or throw; Python leaves the parent fields missing until something later crashes. The cover stays half-inked and they will ask which stamp you skipped. Keep the clerk picture on the board and do not invent a second kitchen."
  }, codes(
    `class Person { constructor(n) { this.name = n; } }
class Student extends Person {
  constructor(n, r) { super(n); this.roll = r; }
}`,
    `class Person:
    def __init__(self, n):
        self.name = n
class Student(Person):
    def __init__(self, n, r):
        super().__init__(n)
        self.roll = r`,
    `class Person { String name; Person(String n) { this.name = n; } }
class Student extends Person {
  int roll;
  Student(String n, int r) { super(n); this.roll = r; }
}`,
    `class Person { public: string name; Person(string n): name(n) {} };
class Student : public Person {
 public:
  int roll;
  Student(string n, int r) : Person(n), roll(r) {}
};`
  ), "Most asked · Amazon · Google"),

  Q(11, "intermediate", "What are access modifiers?", {
    problem: "Every field was public. Tests poked insides. A rename broke the world. The intern changed marks from the hallway, a refactor renamed the field, and twenty tests that knew the locker guts failed together. The vault key sat on the front desk 'just for tests'. The whiteboard stayed blank while the mess on the desk grew.",
    what: "public means anyone may walk in. private means only this class. protected means this class plus children. Python uses underscore and double underscore by convention. The lobby is public, the staff corridor is protected, and the vault is private — say which door the field sits behind before you write the line. Access modifiers are those doors on the folder.",
    solves: "You choose who may touch the locker. A rename of a private field stays inside one class, and a child can still read a protected roll without opening the vault to the whole school. Tests that never knew the guts survive a refactor of the pile inside. The next marker question already has a folder you can point at.",
    example: "Staff-only corridor vs the lobby. Guests walk the lobby; teachers use the corridor; the fee cash box stays in the vault. The clerk does not put the vault key on the front desk 'just for tests'. A parent at the window still uses the public button, never the corridor. Pull that picture apart and you are back to hallway lists and ifs.",
    uses: "Java and C++ interviews. Python: say convention. They will draw public, protected, and private on Box and ask which line a Student child may read versus which line a test in another package may not. Point at lobby, corridor, and vault. Keep the clerk picture on the board when they hand you the marker.",
    watch: "protected everything. That is still a wide door. Every child and every same-package class can walk the corridor, so a rename still ripples, and they will ask why you did not lock the vault. Prefer private unless a true child needs the corridor. Say the honest kitchen count before they switch the language button again."
  }, codes(
    `class Box {
  #secret = 1;     // private (JS)
  _hint = 2;       // convention: stay out
}`,
    `class Box:
    def __init__(self):
        self._hint = 2    # stay out (convention)
        self.__secret = 1  # name-mangled`,
    `class Box {
  public int open = 1;
  protected int family = 2;
  private int secret = 3;
}`,
    `class Box {
 public:
  int open = 1;
 protected:
  int family = 2;
 private:
  int secret = 3;
};`
  ), "Most asked · Amazon · Microsoft · Google"),

  Q(12, "intermediate", "Abstract class vs interface?", {
    problem: "When do I write interface and when abstract class? Candidates picked at random, then could not say whether wheels were shared code or just a can-do tag on the door. The bus either duplicated horn() or wore a fat contract nobody could implement. The desk then had no honest cover left to hand the parent.",
    what: "An abstract class can hold some real methods plus some empty ones you must fill. An interface is a contract of method names, a can-do tag. Java and C++ use interface or pure virtual. Python uses ABC. JS has no keyword — TypeScript interface or a class with methods you must implement. Share the horn on Vehicle; hang pay() on Payable as a thin door.",
    solves: "Share a little code with abstract versus many can-do tags with interface. Vehicle can already horn() and still force start(); Payable is only pay(), and one shop class can wear several of those tags. The till talks to the tag, not to one branded machine. Parent night then shows two honest cards instead of one mixed pile.",
    example: "Abstract: 'every vehicle has wheels, and you must write start()'. Interface: 'if you are Payable, you have pay()'. A class can implement many interfaces. The bus already shares the horn; the till only cares that you can pay. Cash and UPI both wear the same thin tag. The clerk keeps that beat on the desk when the next child walks in.",
    uses: "Java interviews love this pair. After inheritance they ask whether Payable should be a class you extend or a contract you implement, and they want the many-tags answer. Say wheels versus can-do pay(). Amazon and Microsoft both wait for that split. Google and Meta still ask you to mark it on Student or Animal next.",
    watch: "An interface with 30 methods. Nobody can implement it cleanly. Split it into small doors such as Payable and Refundable, or they will ask which SOLID letter you just broke. A fat contract is a junk drawer wearing a can-do badge. A poster with no folder is not an answer they will accept."
  }, codes(
    `// JS: no interface keyword. A shape others must match:
class Payable { pay() { throw new Error("implement me"); } }
class Upi extends Payable { pay() { return "paid"; } }`,
    `from abc import ABC, abstractmethod
class Payable(ABC):
    @abstractmethod
    def pay(self):
        pass
class Upi(Payable):
    def pay(self):
        return "paid"`,
    `interface Payable { void pay(); }
abstract class Vehicle { abstract void start(); void horn() {} }
class Upi implements Payable {
  public void pay() { }
}`,
    `struct Payable { virtual void pay() = 0; };  // interface
class Vehicle {
 public:
  virtual void start() = 0;  // abstract
  void horn() {}
};`
  ), "Most asked · Amazon · Google · Microsoft"),

  Q(13, "intermediate", "Composition vs inheritance?", {
    problem: "Stack extended Array and inherited 40 methods you did not want. Callers used splice on a stack, the clerk's 'last in' promise broke, and a later interview asked why a stack was pretending to be a list. The family tree had lied about is-a. The shop till then stamped the wrong slip and nobody caught it.",
    what: "Composition is has-a. A Car has an Engine. Inheritance is is-a. A Car is a Vehicle. The car folder holds an engine object and asks it to start; it does not become an engine or inherit forty engine tools it cannot honestly promise. Prefer the helper inside the folder when you only need a toolbox, not a parent.",
    solves: "You reuse the engine without becoming an engine. The car still starts, testers can swap a mock engine, and you do not inherit a family of methods that would let someone tune pistons from the driver's seat. The stack keeps push and pop without splice from a list it is not.",
    example: "A phone has a camera. A phone is not a camera. You press the camera object inside the phone; you do not extend Camera and inherit zoom, flash, and lens-cap methods on the call screen. The clerk keeps the camera as a helper in the pocket, not as a parent stamp.",
    uses: "Prefer composition when you only need a helper object. Design interviews after inheritance ask this next, and they want you to put Engine inside Car instead of extending Engine. Has-a, not is-an-engine. Amazon and Meta both wait for that sentence. Google and Meta still ask you to mark it on Student or Animal next.",
    watch: "Deep is-a trees that nobody can redraw. If you need a whiteboard to remember who is whose parent, the clerk already lost the stamp. Flatten with has-a before the next feature lands. A stack that extends Array is the picture they want you to refuse. Draw the honest family tree or they will reject the child stamp."
  }, codes(
    `class Engine { start() { return "vroom"; } }
class Car {
  constructor() { this.engine = new Engine(); }  // has-a
  start() { return this.engine.start(); }
}`,
    `class Engine:
    def start(self):
        return "vroom"
class Car:
    def __init__(self):
        self.engine = Engine()  # has-a
    def start(self):
        return self.engine.start()`,
    `class Engine { String start() { return "vroom"; } }
class Car {
  Engine engine = new Engine();  // has-a
  String start() { return engine.start(); }
}`,
    `class Engine { public: string start() { return "vroom"; } };
class Car {
  Engine engine;  // has-a
 public:
  string start() { return engine.start(); }
};`
  ), "Most asked · Amazon · Google · Microsoft · Meta"),

  Q(14, "intermediate", "What does static mean?", {
    problem: "A counter on each object stayed 1. You wanted one count for the whole class. Ada's folder said 1, Bob's folder said 1, and the clerk never knew how many students had walked in that morning. Forty sticky notes each said one, and the staff-room board stayed blank. The shop till then stamped the wrong slip and nobody caught it.",
    what: "static belongs to the class, not one object. It is shared. Call Student.count or Math.max. The staff-room board holds the number; each student folder does not carry its own private copy of the school-wide roll. Utility methods with no instance also sit on that board, so you do not invent a Math object just to find a maximum.",
    solves: "One school-wide roll counter. Utility functions with no instance. You increment Student.count in the constructor, then read the board without opening Ada or Bob, and Math.max never needs a Math object. Morning headcount is one glance at the board, not a walk of forty desks. A rename of Ada updates the same cover the method will stamp.",
    example: "A board in the staff room, not a note in each folder. The clerk ticks the board when a folder is opened; she does not walk forty desks to add forty sticky notes that each say one. Ada and Bob share that one board, and the count is two after both walk in.",
    uses: "Constants, factories, counters. Interviews ask you to count Students, then they ask whether ada.count or Student.count is the honest door — the class name is the door. Tick the staff-room board. Campus labs fail people who increment a field on Ada and call it a school total. Name the door they should press, not a Wikipedia paragraph, then stop.",
    watch: "A huge static bag of globals. That is not OOP. If every fee rule lives on a static Utils board, you are back to the hallway lists, and they will ask where the folder went. Keep static for shared counters and true utilities, not a junk drawer. They will wait for the folder picture if you only recite the poster."
  }, codes(
    `class Student {
  static count = 0;
  constructor() { Student.count += 1; }
}
new Student(); new Student();
console.log(Student.count);  // 2`,
    `class Student:
    count = 0  # class variable
    def __init__(self):
        Student.count += 1
Student(); Student()
print(Student.count)  # 2`,
    `class Student {
  static int count = 0;
  Student() { count++; }
}
new Student(); new Student();
System.out.println(Student.count);`,
    `class Student {
 public:
  static int count;
  Student() { count++; }
};
int Student::count = 0;`
  ), "Most asked · Amazon · Microsoft"),

  Q(15, "intermediate", "What is the diamond problem?", {
    problem: "D inherits B and C. B and C both inherit A. Which A's method does D get? The clerk found two 'start the car' stamps on the same grandchild folder and did not know which key to turn. Two counters named A sat in one ignition and the compiler shrugged.",
    what: "The diamond is multiple inheritance of the same grandparent. Java forbids a class diamond but allows interfaces. C++ needs virtual inheritance so D has one A. Python MRO, the C3 walk, picks an order. Say the language's rule before you draw the diamond, or they will think you only memorized the shape. The grandchild should not hold two fighting keys.",
    solves: "You can name the fight and the language's rule. Java: one extends, many implements. C++: virtual public A so D has one A. Python: print the mro and walk B before C if that is how you listed the parents. The clerk then knows which key turns the ignition. Parent night then shows two honest cards instead of one mixed pile.",
    example: "Two grandparents both named 'start the car'. Whose key? The grandchild stands at the gate with two key rings labeled A; virtual inheritance or MRO decides there is one ignition, not two fighting stamps. Java hangs extra abilities on interface tags instead of a second parent class. The shop still shows one button while the messy drawer stays shut.",
    uses: "C++ and Python interviews. Java: 'why we have interfaces'. After multiple inheritance they ask this by name, so keep the diamond sketch and one sentence per language. Name virtual inheritance or MRO. Amazon and Microsoft both wait for the language rule, not just the shape. Keep the clerk picture on the board when they hand you the marker.",
    watch: "Casual multiple inheritance in C++ without virtual. You get two A subobjects, two counters, and a start() that the compiler refuses to pick. They will ask what virtual inheritance removes. Draw one A under D, not two stacked copies. Keep the stamp on the folder and wait for the next honest question."
  }, codes(
    `// JS/Java: one extends. Extra abilities = other objects or interfaces.
class A { start() { return "A"; } }
class B extends A {}
// no class C extends B, A`,
    `# Python MRO
class A:
    def start(self):
        return "A"
class B(A): pass
class C(A): pass
class D(B, C): pass
print(D().start())
print(D.mro())`,
    `// Java: one extends, many implements
class A { void start() {} }
interface CanFly { void fly(); }
class Bird extends A implements CanFly {
  public void fly() {}
}`,
    `class A { public: virtual void start() {} };
class B : virtual public A {};
class C : virtual public A {};
class D : public B, public C {};  // one A`
  ), "Most asked · Amazon · Google · Microsoft"),

  Q(16, "beginner", "What is a destructor / finalizer?", {
    problem: "A file handle stayed open after the object died. The next student could not open the register, the clerk found a locked drawer with no owner, and the exam hall waited on a file that nobody closed. Overnight the staff-room lock stayed turned with no folder left to own it.",
    what: "A C++ destructor ~Class() runs when the object dies. Java has finalize, which you must not rely on. Python __del__ is not a real destructor. JS has no destructor — close in a method or try/finally. Say the language's honest close door, not a fairy-tale cleanup. RAII means the C++ folder carries the book and shelves it on the way out.",
    solves: "In C++ RAII: the object owns the file and closes it. Leave the desk and the destructor puts the book back. In other kitchens you close in finally, try-with-resources, or a with block so an error still returns the book. The next student can open the register because the drawer has an owner who left cleanly.",
    example: "Putting the library book back when you leave the desk. The C++ folder carries the book and shelves it on the way out; Java and Python make you use the desk's with or try door so the book does not stay in your bag. An exam hall should never wait on a lock with no owner.",
    uses: "C++ interviews. Others: say 'we close in finally / with'. They will ask what ~File does, then they will ask why you must not trust finalize or __del__ for a lock. Name RAII in C++ and the with block in Python on the same picture. Keep the clerk picture on the board when they hand you the marker.",
    watch: "Trusting __del__ or finalize for locks. Those may run late or never. A lock left on the staff-room door overnight is the picture they want you to refuse. Close in finally or with instead. Do not wait for the garbage truck to return the library book. They will wait for that fail picture if you skip the door."
  }, codes(
    `class File {
  close() { /* JS: you call this */ }
}
const f = new File();
f.close();`,
    `with open("a.txt") as f:  # closes even on error
    f.read()
# do not rely on __del__`,
    `class File implements AutoCloseable {
  public void close() { }
}
try (File f = new File()) { }  // auto close`,
    `class File {
  FILE* p;
 public:
  File() { p = fopen("a.txt", "r"); }
  ~File() { if (p) fclose(p); }  // destructor
};`
  ), "Most asked · Amazon · Microsoft · Google"),

  Q(17, "intermediate", "When should you not use inheritance?", {
    problem: "A Square extended Rectangle and broke area() when width changed. Tests that stretched a rectangle failed on a square, and the clerk could no longer trust the parent stamp on the child folder. Parent night then showed a shape that lied about setWidth. The next intern poked the same hole and the report failed again.",
    what: "If it is not a true is-a, or the child must break the parent's promises, do not inherit. Use composition. A square cannot honestly keep a rectangle's 'set one side' promise, so both should be a Shape with area() instead. Inheritance is for a child that can stand at the parent desk without secret extra work.",
    solves: "You avoid the Liskov surprise, which is SOLID's L. Code that expects a Rectangle still works when you pass a child, because you refused the lying family tree and kept the promises on the parent stamp true. Testers can stretch a rectangle without a square secretly fixing height. The clerk finds the rule in one place and the demo morning stays honest.",
    example: "A square is not a rectangle you can stretch on one side. Pull the width and a real rectangle stays a rectangle; pull the width on a square and the clerk has to fix the height in secret, which breaks the parent story. Both can still be a Shape with area().",
    uses: "Design interviews after the four pillars. They often draw Square and Rectangle next, then wait for you to say both are Shape, not Square extends Rectangle. Refuse the stretchy child. Amazon and Google both keep this as the follow-up to inheritance. Keep the clerk picture on the board when they hand you the marker.",
    watch: "Inheriting to get a free list of methods. If you wanted a toolbox, put the toolbox inside the folder. A child that skips or breaks parent methods is a stamp the interviewer will reject. Has-a beats a lying is-a every time they draw Square. Keep the clerk picture on the board and do not invent a second kitchen."
  }, codes(
    `// bad: Square extends Rectangle
// good: both have a Shape { area() }
class Shape { area() { return 0; } }
class Square extends Shape {
  constructor(s) { super(); this.s = s; }
  area() { return this.s * this.s; }
}`,
    `class Shape:
    def area(self):
        return 0
class Square(Shape):
    def __init__(self, s):
        self.s = s
    def area(self):
        return self.s * self.s`,
    `class Shape { double area() { return 0; } }
class Square extends Shape {
  int s;
  Square(int s) { this.s = s; }
  double area() { return s * s; }
}`,
    `class Shape { public: virtual double area() { return 0; } };
class Square : public Shape {
  int s;
 public:
  Square(int s): s(s) {}
  double area() override { return s * s; }
};`
  ), "Most asked · Amazon · Google · Microsoft"),

  Q(18, "beginner", "How do you explain OOP in an interview?", {
    problem: "Candidates listed four words and froze when asked 'show me'. The marker stayed unused, Student never appeared, and the interviewer stopped the pillar recitation at thirty seconds. No folder, no lock, no speak(). The whiteboard kept posters and never grew Ada. The desk then had no honest cover left to hand the parent.",
    what: "Pick one domain such as school, bank, or zoo. Draw Person to Student. Show private marks, payFees(), and Animal.speak(). Then switch the language button and write the same thing. The pictures stay; only the kitchen spelling changes. Ninety seconds of stamp, folder, lock, child stamp, and the same speak button is the tour they want.",
    solves: "You sound like you have written a class, not only read a blog. They can follow the folder, the lock, and the speak() button, then they let you type Java or Python on the same story. The next pillar question already has a drawing to point at. The next marker question already has a folder you can point at.",
    example: "A 90-second factory tour: stamp, folder, lock, child stamp, same 'speak' button. The clerk opens Ada, hides marks, stamps payFees, then asks the zoo list to speak without an if on dog versus cat. Switch the language and the tour does not change, only this versus self. The clerk keeps that beat on the desk when the next child walks in.",
    uses: "Every campus and SDE screen. Amazon, TCS, and startups all want this tour before design patterns, so keep Student ready and leave the pattern catalog in the bag. Ninety seconds, then code. Meta and Adobe still open here before Factory or Singleton. Name the door they should press, not a Wikipedia paragraph, then stop.",
    watch: "Ten design patterns. They asked for Student. If you start with Singleton and Factory, they will cut you and point at the blank folder you never drew. Draw Ada first, patterns later. A poster of patterns with no lock is not a tour. Keep the stamp on the folder and wait for the next honest question."
  }, codes(
    `class Person { constructor(n) { this.name = n; } }
class Student extends Person {
  #marks = 0;
  constructor(n) { super(n); }
  setMarks(m) { if (m >= 0) this.#marks = m; }
}
class Dog { speak() { return "woof"; } }`,
    `class Person:
    def __init__(self, n):
        self.name = n
class Student(Person):
    def __init__(self, n):
        super().__init__(n)
        self.__marks = 0
    def set_marks(self, m):
        if m >= 0:
            self.__marks = m`,
    `class Person { String name; Person(String n) { name = n; } }
class Student extends Person {
  private int marks;
  Student(String n) { super(n); }
  void setMarks(int m) { if (m >= 0) marks = m; }
}
class Dog { String speak() { return "woof"; } }`,
    `class Person { public: string name; Person(string n): name(n) {} };
class Student : public Person {
  int marks = 0;
 public:
  Student(string n) : Person(n) {}
  void setMarks(int m) { if (m >= 0) marks = m; }
};`
  ), "Most asked · Amazon · Google · Microsoft · Meta · Adobe"),

  Q(19, "beginner", "Encapsulation vs abstraction?", {
    problem: "People used the two words as twins and failed the follow-up. The interviewer asked which one is the lock and which one is the button, and the candidate pointed at the same screw twice. The TV stayed a glass box with twenty labeled wires. The shop till then stamped the wrong slip and nobody caught it.",
    what: "Encapsulation hides the fields: lock the locker. Abstraction hides the steps: show only the button. One is how you pack. One is what you show. The screws stay inside; the remote only offers Power, not twenty wires. Say lock versus button before you mark #wires and power() on the same Tv class.",
    solves: "You can say both in one breath with two pictures. They hear the locker and the remote, then they let you mark #wires and power() on the same Tv class without mixing the words. The next pillar question already has two fingers, not one mashed slogan. The zoo list or the fee door keeps working when a new child walks in.",
    example: "Encapsulation: the screws inside the TV. Abstraction: the remote has Power, not twenty wires. The clerk locks the chassis and still hands the guest one button; opening the back panel is not how you change the channel. A glass locker with getters for every screw is neither picture. A new guest still uses the same window, so nobody retrains the line.",
    uses: "After 'four pillars' — the usual second question. Amazon, TCS, and campus labs all split these two words, so keep the locker picture and the remote picture on separate fingers. Do not point at the same screw twice when they ask which word is which. Keep the clerk picture on the board when they hand you the marker.",
    watch: "A class with 20 public getters that leak every field. That is not abstraction. They will ask whether getWireCount() hides the steps, and the honest answer is you just opened the locker from the hallway. Hide the wires, show Power, and keep the lock on the chassis. A remote with twenty wire labels is still a glass locker."
  }, codes(
    `class Tv {
  #wires = "messy";                 // encapsulation
  power() { return "on"; }          // abstraction
}`,
    `class Tv:
    def __init__(self):
        self.__wires = "messy"      # encapsulation
    def power(self):
        return "on"                 # abstraction`,
    `class Tv {
  private String wires = "messy";   // encapsulation
  String power() { return "on"; }   // abstraction
}`,
    `class Tv {
  string wires = "messy";           // keep private
 public:
  string power() { return "on"; }   // abstraction
};`
  ), "Most asked · Amazon · Google · Microsoft · TCS"),

  Q(20, "intermediate", "Compile-time vs run-time polymorphism?", {
    problem: "They said 'two types' and people only named override. The follow-up was two add kitchens in one Java class, and the candidate had no compile-time word, so the second half of the question sat empty. The whiteboard kept one song title and never grew the two print counters. The desk then had no honest cover left to hand the parent.",
    what: "Compile-time polymorphism is overload: same name, different args, chosen while the kitchen is still on paper. Run-time polymorphism is override: the real object picks the method. JS and Python skip overload. Still name both so a Java interviewer hears the pair and a Python interviewer hears the honest skip. Defaults are one cook, not a second kitchen.",
    solves: "A Java interviewer hears both words. You can label add(a,b) versus add(a,b,c) as compile-time, then label Kid.add as run-time, without pretending JavaScript grew a second method. Say defaults, not overload, in JS. The two labels sit on the board before they switch language. The clerk finds the rule in one place and the demo morning stays honest.",
    example: "Overload: two kitchens named print. Override: the child sings a new song to the same title. The hotel posts two print counters; the child choir keeps the title and changes the lyrics when the real singer walks on. Java posts both counters; Python still has one def add with defaults.",
    uses: "Java, C++, C# screens. After overriding versus overloading they ask this wording, so keep compile-time on overload and run-time on override ready as two short labels. Write the two labels on the board. Campus labs love this as the follow-up to the four pillars. Campus labs and Amazon both wait for the folder before a pattern catalog.",
    watch: "Calling Python default arguments overloading. There is still one function. They will ask how many add methods exist, and counting two in Python is the wrong kitchen. Point at the single def add. Defaults are one cook, not two counters on the hotel wall. Draw the honest family tree or they will reject the child stamp."
  }, codes(
    `class Calc { add(a, b = 0) { return a + b; } }  // not two methods
class Kid extends Calc { add(a, b = 0) { return super.add(a, b); } }`,
    `class Calc:
    def add(self, a, b=0):
        return a + b
class Kid(Calc):
    def add(self, a, b=0):
        return super().add(a, b)`,
    `class Calc {
  int add(int a, int b) { return a + b; }
  int add(int a, int b, int c) { return a + b + c; }  // compile-time
}`,
    `class Calc {
 public:
  int add(int a, int b) { return a + b; }
  int add(int a, int b, int c) { return a + b + c; }
};`
  ), "Most asked · Amazon · Google · Microsoft"),

  Q(21, "beginner", "What is a method vs a function?", {
    problem: "payFees lived as a loose function. It needed a student id every time. The clerk called payFees(adaId), looked up the global table, and one wrong id stamped Bob's folder with Ada's receipt. The hallway lists still owned the recipe, not the cover. Parent night mixed the leftover drawers and the stamp sat idle.",
    what: "A function is a recipe on its own, a street-cart dish anyone can fry. A method is a recipe stamped on an object. It can see this or self. ada.payFees() already knows the folder; a free function must be handed the id and then hunt the hallway lists. The stamp travels with the cover, so the clerk presses one folder, not a global id.",
    solves: "ada.payFees() already knows whose folder. The stamp travels with the cover, so a rename of Ada updates the same object the method will stamp, and you stop threading ids through every call. A wrong id can no longer land Ada's receipt on Bob. The next marker question already has a folder you can point at.",
    example: "A street cart recipe (function) vs the stamp on Ada's folder (method). Anyone can fry the cart dosa; only Ada's folder already has her name under the pay-fees stamp when the clerk presses it. Bob's cover has his own stamp, not a borrowed id from the hall. The clerk keeps that beat on the desk when the next child walks in.",
    uses: "Every class you write. Interviews ask this early so they know you will not put payFees in a utilities file that still needs a student id on every line. Stamp the folder, not the hallway. Campus labs and Amazon both watch whether the recipe sits on Student. Keep the clerk picture on the board when they hand you the marker.",
    watch: "A 'method' that never uses the object — that is a function wearing a class. They will ask why it sits on Student if it never reads this or self, and static or a free function is the honest door. Do not dress a street-cart recipe in a folder costume."
  }, codes(
    `function add(a, b) { return a + b; }     // function
class Bank {
  deposit(n) { this.bal += n; }          // method
}`,
    `def add(a, b):
    return a + b
class Bank:
    def deposit(self, n):                # method
        self.bal += n`,
    `int add(int a, int b) { return a + b; }
class Bank {
  int bal;
  void deposit(int n) { bal += n; }      // method
}`,
    `int add(int a, int b) { return a + b; }
class Bank {
 public:
  int bal;
  void deposit(int n) { bal += n; }
};`
  ), "Most asked · Amazon · TCS"),

  Q(22, "beginner", "What is a getter and a setter?", {
    problem: "Anyone wrote marks = -5. Or they made every field public to 'save time'. The intern scribbled in the register, the clerk printed a negative total, and the next file poked the same open field. Parent night showed a minus on Ada's card because the window had no clerk. The guest line stopped while someone hunted a missing honest folder.",
    what: "A getter reads. A setter writes after a check. The field stays private. The clerk is the only person who opens the marks box; everyone else asks for the stamped number or hands in a slip that can be refused at the window. That pair is the named door on the locker: getMarks shows the total, setMarks checks the floor of zero.",
    solves: "The folder refuses a bad mark at the door. Later you can change how marks are stored, and callers still call getMarks, so a storage change does not hunt twenty files that used to write the field. The intern's pen never reaches the register, and reports stay legal. The interviewer hears a shop sentence and lets you write the lines next.",
    example: "The clerk stamps the marksheet. You do not scribble in the book. You pass a slip through the window; if the number is below zero the clerk hands it back and the register stays clean. A later storage change still uses the same window, so the hallway never learns the box guts.",
    uses: "Java interviews, Python @property, JS get/set. After encapsulation they almost always ask you to write getMarks and setMarks with a floor of zero in the language on the job posting. Show the private field and the door. TCS and Amazon both wait for the refused slip. Campus labs and Amazon both wait for the folder before a pattern catalog.",
    watch: "setX that only assigns. That is a public field in a hat. They will type setMarks(-5) in front of you, and 'it stores -5' means the costume fooled nobody. Refuse the negative slip. Keep the field private and put the rule in the setter, not in a comment. A poster with no folder is not an answer they will accept."
  }, codes(
    `class Student {
  #marks = 0;
  get marks() { return this.#marks; }
  set marks(n) { if (n >= 0) this.#marks = n; }
}`,
    `class Student:
    def __init__(self):
        self.__marks = 0
    @property
    def marks(self):
        return self.__marks
    @marks.setter
    def marks(self, n):
        if n >= 0:
            self.__marks = n`,
    `class Student {
  private int marks;
  int getMarks() { return marks; }
  void setMarks(int n) { if (n >= 0) marks = n; }
}`,
    `class Student {
  int marks = 0;
 public:
  int getMarks() { return marks; }
  void setMarks(int n) { if (n >= 0) marks = n; }
};`
  ), "Most asked · Amazon · Microsoft · TCS"),

  Q(23, "intermediate", "What is SOLID?", {
    problem: "Five letters with no shop picture. People recited the Wikipedia line, then could not say which clerk owns fees, and a Square that stretched like a Rectangle failed the next question. Five posters sat on the wall while the shop still had one overworked till. Ada's card and Bob's card no longer matched the same office story.",
    what: "S means one reason to change. O means add a class, do not edit the old switch. L means a child can stand in for the parent. I means small contracts. D means depend on Payable, not Upi. Give one shop sentence per letter, then stop before the essay. Fees and marks are two clerks; a new Bird is a new class; the till talks to the idea of pay.",
    solves: "You can give one sentence per letter. The interviewer hears two clerks, a new Bird class, an honest child, a thin pay() door, and a till that talks to the idea of Payable rather than one branded machine. Two letters they pick next already have a folder you can point at.",
    example: "S fees clerk vs marks clerk. O a new Bird. L Square is not a stretchy Rectangle. I pay() only. D the till, not one brand of machine. They will pick two letters and ask you to point at Student or checkout. Keep the stretchy Square and the till ready, not five speeches.",
    uses: "Follow-up after the four pillars. Amazon and campus labs often ask S and L next, so keep the fees clerk and the stretchy Square ready instead of all five speeches. You do not need a design-pattern catalog once those two shop pictures are on the board. TCS and Microsoft still open here, then pick one follow-up on the same drawing.",
    watch: "A 10-minute Wikipedia recitation. They want two sentences and one example. If you start quoting the book, they will cut you and ask which clerk owns the fee rule. Point at the fees clerk. A poster of five letters with no till is not an answer. A poster with no folder is not an answer they will accept."
  }, codes(
    `class Payable { pay() { throw new Error("implement"); } }
class Upi extends Payable { pay() { return "paid"; } }
function checkout(p) { return p.pay(); }  // D: depend on Payable`,
    `class Payable:
    def pay(self):
        raise NotImplementedError
class Upi(Payable):
    def pay(self):
        return "paid"
def checkout(p):
    return p.pay()`,
    `interface Payable { void pay(); }
class Upi implements Payable {
  public void pay() { }
}
void checkout(Payable p) { p.pay(); }`,
    `struct Payable { virtual void pay() = 0; };
class Upi : public Payable {
 public:
  void pay() override {}
};
void checkout(Payable& p) { p.pay(); }`
  ), "Most asked · Amazon · Google · Microsoft"),

  Q(24, "intermediate", "What is the Liskov Substitution Principle?", {
    problem: "Square extended Rectangle. setWidth(10) broke the square. Tests on Rectangle failed for Square. The clerk could no longer drop a child folder where a parent folder was promised without wrecking area(). Parent night then showed a shape that lied about one side. The next intern poked the same hole and the report failed again.",
    what: "If code expects a Parent, a Child must not break the Parent's promises. is-a must stay true after you stretch the object. A square cannot honestly keep 'set one side and leave the other', so it must not stand in for Rectangle. Both can still be a Shape with area(), which is a promise a square can keep without secret height fixes.",
    solves: "You know when inheritance is a lie. You refuse Square extends Rectangle, give both a Shape with area(), and code that trusted the parent stamp still works when a child walks up to the desk. Testers can stretch a rectangle without a square secretly rewriting height. The next marker question already has a folder you can point at.",
    example: "A square is not a rectangle you can pull on one side. Both can be a Shape with area(). Pull the width on a square and the clerk has to fix the height in secret, which is the lie Liskov asks you to catch. Refuse that child stamp and keep the parent promise honest.",
    uses: "The L in SOLID. Design interviews. After 'when not to inherit' they often name Liskov, so keep the stretchy Square picture and the Shape fix ready. Both are Shape with area(). Amazon and Google both wait for you to refuse Square extends Rectangle. Keep the clerk picture on the board when they hand you the marker.",
    watch: "Inheriting just to steal methods. If the child must skip or break a parent promise, put a helper inside the folder. They will ask what setWidth should do on a square, and 'also change height' fails L. Has-a beats a lying is-a on that whiteboard. Draw the honest family tree or they will reject the child stamp."
  }, codes(
    `class Shape { area() { return 0; } }
class Square extends Shape {
  constructor(s) { super(); this.s = s; }
  area() { return this.s * this.s; }
}`,
    `class Shape:
    def area(self):
        return 0
class Square(Shape):
    def __init__(self, s):
        self.s = s
    def area(self):
        return self.s * self.s`,
    `class Shape { double area() { return 0; } }
class Square extends Shape {
  int s;
  Square(int s) { this.s = s; }
  double area() { return s * (double) s; }
}`,
    `class Shape { public: virtual double area() { return 0; } };
class Square : public Shape {
  int s;
 public:
  Square(int s): s(s) {}
  double area() override { return s * (double)s; }
};`
  ), "Most asked · Amazon · Google · Microsoft"),

  Q(25, "intermediate", "Association vs aggregation vs composition?", {
    problem: "Three words for 'objects related'. Interviews want the strength of the bond. Candidates called every field composition, then could not say whether a teacher survives if the department folder is shredded. The clerk mixed shop, team, and house glue on one line. The guest line stopped while someone hunted a missing honest folder.",
    what: "Association means they know each other: a Student uses a Library. Aggregation means has-a, and parts can live alone: a Department has Teachers. Composition means has-a, and the part dies with the whole: a House has Rooms. Say how tight the glue is before you draw the line. The clerk should know who walks away when the whole folder is shredded.",
    solves: "You pick how tight the glue is. A house owns its rooms and they vanish with the building; a department lists teachers who can walk to another office; a student may visit the library without being built from it. The next UML question already has three strengths of glue, not one mashed word.",
    example: "A customer and a shop is association. A team and players who can leave is aggregation. A house and its walls is composition. Demolish the house and the walls go; fire the coach and the players can still join the next team. Do not call the shop visit a wall.",
    uses: "UML and 'why not inherit' follow-ups. After composition versus inheritance they ask these three words, so keep shop, team, and house as the three strengths of glue. Say who dies when the whole is deleted. TCS and Amazon both wait for Teacher versus Room. Google and Meta still ask you to mark it on Student or Animal next.",
    watch: "Calling every field composition. If the part can live when the whole is gone, that is aggregation or association. They will ask what happens to Teacher when Department is deleted, and 'Teacher dies' is the wrong glue. Players walk; walls fall; the shop still stands. They will wait for the folder picture if you only recite the poster."
  }, codes(
    `class Room { constructor(n) { this.n = n; } }
class House {
  constructor() { this.rooms = [new Room(1)]; }  // composition
}`,
    `class Room:
    def __init__(self, n):
        self.n = n
class House:
    def __init__(self):
        self.rooms = [Room(1)]  # composition`,
    `class Room { int n; Room(int n) { this.n = n; } }
class House {
  Room r = new Room(1);  // composition
}`,
    `class Room { public: int n; Room(int n): n(n) {} };
class House {
  Room r;  // composition — room lives with the house
 public:
  House() : r(1) {}
};`
  ), "Most asked · Amazon · Microsoft · TCS"),

  Q(26, "intermediate", "What is coupling? What is cohesion?", {
    problem: "A Student class imported Payment, Email, Pdf, and Slack. One fee change broke mail. The clerk opened Ada's folder to fix a rupee rule and found the marksheet, the printer, and the chat bot all taped to the same cover. Tests could not hand her a fake till without importing Slack.",
    what: "Coupling is how much one class knows about another — you want it loose. Cohesion is how much one class's methods belong together — you want it high. Student should hold name and marks; fees should live next door and talk through a small pay() door. The cook plates food; the waiter should not need the vault combination to take an order.",
    solves: "Student holds name and marks. Fees lives next door. They talk through a small door. A fee-rule change stays in the fees clerk's drawer, and a test can hand Student a fake till without importing Slack. Mail and Pdf stop breaking when the rupee rule moves. The next marker question already has a folder you can point at.",
    example: "A kitchen that also does accounts has low cohesion. A waiter who must enter the vault has tight coupling. The cook should plate food; the waiter should not need the vault combination to take an order at the table. Split the drawers and keep a small door between them. The clerk keeps that beat on the desk when the next child walks in.",
    uses: "After SOLID. 'Why is this class hard to test?' They point at a Student that sends email and ask you to name coupling and cohesion, then to move Fees behind a small door. Amazon and Google both wait for the fake till you can pass in a test. Name the door they should press, not a Wikipedia paragraph, then stop.",
    watch: "A Utils class that does everything. That is a junk drawer. High coupling, low cohesion, and the next intern will add one more helper until nobody can find the fee stamp. Split the clerks before the junk drawer grows another Slack call. Draw the honest family tree or they will reject the child stamp."
  }, codes(
    `class Fees { pay() { return "ok"; } }
class Student {
  constructor() { this.fees = new Fees(); }  // small door
  settle() { return this.fees.pay(); }
}`,
    `class Fees:
    def pay(self):
        return "ok"
class Student:
    def __init__(self):
        self.fees = Fees()
    def settle(self):
        return self.fees.pay()`,
    `class Fees { String pay() { return "ok"; } }
class Student {
  Fees fees = new Fees();
  String settle() { return fees.pay(); }
}`,
    `class Fees { public: string pay() { return "ok"; } };
class Student {
  Fees fees;
 public:
  string settle() { return fees.pay(); }
};`
  ), "Most asked · Amazon · Google"),

  Q(27, "intermediate", "Can you override a static method? A private method?", {
    problem: "People said 'yes, any method' and then the parent version still ran. The interviewer called A.hello() on a B object, the staff-room board still said A, and the candidate had no second sentence. Polymorphism never picked a static song because there was no object to ask. The whiteboard stayed blank while the mess on the desk grew.",
    what: "Private is invisible to the child — there is nothing to override. Static belongs to the class, not the object. Java hides a static; it does not override it. Call the class name. The real object never picks a static song at run time. The locked note in the parent's drawer stays locked; the staff-room board is one board, not one per student.",
    solves: "You do not expect polymorphism on static or private. You call A.hello() or B.hello() on purpose, and you never wait for a child to replace a lock the child cannot even see in the parent's drawer. The board you named is the board you read, even if Ada is standing at the desk.",
    example: "A note locked in the parent's drawer is private. A board in the staff room is static — one board, not one per student. The child cannot rewrite the locked note, and swapping Ada for Bob does not change which board you read if you asked for A's board. Two class doors, not one speak() button.",
    uses: "Java trick questions. After override they ask this pair, so say 'no real override' for both, then show A.hello() versus B.hello() as two class doors. Never wait for the object to pick a static. Amazon and Microsoft both call A.hello() on a B reference and wait. Keep the clerk picture on the board when they hand you the marker.",
    watch: "Student.count vs ada.count. Use the class name. Reading ada.count looks like an object field and hides that the board is school-wide; they will ask which copy you incremented. Tick Student.count, not Ada's cover. A static song is a board, not a speak() button. Keep the clerk picture on the board and do not invent a second kitchen."
  }, codes(
    `class A { static hello() { return "A"; } }
class B extends A { static hello() { return "B"; } }
console.log(A.hello(), B.hello());  // A B — two class methods`,
    `class A:
    @staticmethod
    def hello():
        return "A"
class B(A):
    @staticmethod
    def hello():
        return "B"
print(A.hello(), B.hello())`,
    `class A { static String hello() { return "A"; } }
class B extends A { static String hello() { return "B"; } }
System.out.println(A.hello());  // A — not runtime poly`,
    `class A { public: static string hello() { return "A"; } };
class B : public A { public: static string hello() { return "B"; } };
cout << A::hello();`
  ), "Most asked · Amazon · Microsoft · Google"),

  Q(28, "beginner", "What is upcasting and downcasting?", {
    problem: "A list of Animal held a Dog. They could not call wag() without a cast. The clerk treated every folder as Animal, then crashed the desk by kicking a stand on a box that actually held a Cat. The zoo shelf mixed pets and the blind downcast blew up. Ada's card and Bob's card no longer matched the same office story.",
    what: "Upcast means treat a Dog as an Animal, which is safe. Downcast means treat that Animal as a Dog again, only if it really is. Store mixed pets as Animal, then check instanceof or dynamic_cast before you ask for wag(). speak() can stay on the parent; wag() waits until you have checked the box so a Cat does not blow up the stamp.",
    solves: "You store mixed animals in one list, then ask the real type only when you must. speak() stays on Animal; wag() waits until you have checked the box, so a Cat in the list does not blow up the clerk's stamp. The zoo loop stays honest without a chain of ifs for every sound.",
    example: "A box labeled Vehicle. A bike is inside. You may lift it as a Vehicle. Calling 'kickstand' needs you to check it is a bike. Lift a car from the same shelf and ask for a kickstand, and the box fights back. Check the real type before you kick the stand.",
    uses: "Java/C++ collections of a parent type. Interviews draw Animal[] zoo, put a Dog in, then ask how you call wag() without lying about every animal on the shelf. Check instanceof before the cast. Amazon and Google both swap the Dog for a Cat on the next line. Keep the clerk picture on the board when they hand you the marker.",
    watch: "A blind downcast. It blows up if the box held a Car. Always check the real type first; they will swap the Dog for a Cat on the next line and wait for the crash you promised not to hit. instanceof or dynamic_cast is the clerk looking inside the box."
  }, codes(
    `class Animal { speak() { return "..."; } }
class Dog extends Animal { wag() { return "tail"; } }
const a = new Dog();                 // upcast in the list
console.log(a instanceof Dog);       // check before you wag`,
    `class Animal:
    def speak(self):
        return "..."
class Dog(Animal):
    def wag(self):
        return "tail"
a = Dog()
print(isinstance(a, Dog))`,
    `Animal a = new Dog();           // upcast
if (a instanceof Dog) {
  Dog d = (Dog) a;              // downcast
  d.wag();
}`,
    `class Animal { public: virtual ~Animal() {} };
class Dog : public Animal { public: void wag() {} };
Animal* a = new Dog();          // upcast
Dog* d = dynamic_cast<Dog*>(a); // check, then downcast`
  ), "Most asked · Amazon · Google"),

  Q(29, "intermediate", "What is duck typing?", {
    problem: "Java wanted an interface on the page. Python just called .quack() and hoped. A typo named quak() passed the review, then the till crashed only when a real customer tried to pay. The cashier had no family name to check before the crash. The next intern poked the same hole and the report failed again.",
    what: "If it walks like a duck and quacks, it is a duck. JS and Python care about the methods, not the family name. Java wants implements. A test double only needs pay(); it does not need to inherit the whole Upi family tree. Duck typing is that cashier who lets cash, card, or a test envelope stand at the till if they can pay.",
    solves: "A test double only needs pay(), not a full Upi class tree. You hand checkout a tiny object that can pay, the till stamps the slip, and you did not build a fake bank just to satisfy a family name. The clerk never checks the printed last name on the envelope.",
    example: "The cashier does not ask your caste. If you can pay(), you may stand at the till. Cash, card, or a test envelope with a pay stamp all walk up; the clerk never checks the printed family on the envelope. A typo quak() still fails only when that line runs, so tests or TypeScript are the honest doors.",
    uses: "Python and JS. TypeScript adds a named contract if you want. Interviews contrast this with Java implements, so say 'methods, not last name' and then mention the typo risk. A test pay() envelope is enough. Amazon and Microsoft both wait for that contrast. Say the shop sentence, then write the lines in the language the posting named.",
    watch: "A typo quak() fails only when that line runs. There is no compile-time family check. They will ask how you catch it, and tests or a TypeScript contract are the honest doors. Do not wait for a real customer to find the missing quack. Keep the stamp on the folder and wait for the next honest question."
  }, codes(
    `function checkout(p) { return p.pay(); }  // any object with pay()
checkout({ pay() { return "ok"; } });`,
    `def checkout(p):
    return p.pay()
class Upi:
    def pay(self):
        return "ok"
checkout(Upi())`,
    `interface Payable { void pay(); }
void checkout(Payable p) { p.pay(); }
class Upi implements Payable {
  public void pay() { }
}`,
    `struct Payable { virtual void pay() = 0; };
void checkout(Payable& p) { p.pay(); }`
  ), "Most asked · Amazon · Google · Microsoft"),

  Q(30, "intermediate", "Does JavaScript have real classes?", {
    problem: "Someone said JS has no OOP. Someone else said class is exactly Java. Both answers failed when the interviewer asked what typeof Student prints and whether the class line is hoisted. The stamp looked printed, and nobody flipped it over to the old rubber kit. The shop till then stamped the wrong slip and nobody caught it.",
    what: "ES6 class is sugar over prototypes. new Student still sets a prototype chain. Interviews want both sentences. The printed stamp looks like Java; underneath it is still the old rubber prototype kit, and Student is a function. Class is not hoisted like function; it lives in the temporal dead zone until the line runs, so new Student() above the class throws.",
    solves: "You are not shocked by Student.prototype or by extends. You can say class is the spelling, prototype is the machinery, and you can still draw Ada's folder without pretending JavaScript grew Java's class file. typeof Student is function, and that sentence stops the slogan fight. The next marker question already has a folder you can point at.",
    example: "A printed stamp (class) that is still made of the old rubber prototype kit. The clerk shows a neat Student stamp to the parent; flip it over and the prototype chain is the same kit the office used before ES6. The cover still inks Ada; the kit under the stamp did not become Java.",
    uses: "JS screens after 'what is a class'. Amazon and Meta like this follow-up, so keep 'sugar over prototypes' and 'typeof Student is function' ready after you draw the folder. Then say it is not hoisted. Campus labs still trap people who say JS has no OOP. Keep that picture ready before they switch the language button.",
    watch: "Saying class is hoisted like function. It is not. They will put new Student() above the class line and wait for the temporal-dead-zone error you should already name. Class lives in the TDZ until the line runs. Do not treat the printed stamp as a hoisted function. A poster with no folder is not an answer they will accept."
  }, codes(
    `class Student { hello() { return "hi"; } }
const a = new Student();
console.log(typeof Student);           // function
console.log(a.hello === Student.prototype.hello);`,
    `# Python: class is the real type
class Student:
    def hello(self):
        return "hi"
print(type(Student))`,
    `class Student { String hello() { return "hi"; } }
Student a = new Student();`,
    `class Student { public: string hello() { return "hi"; } };
Student a;`
  ), "Most asked · Amazon · Google · Meta"),

  Q(31, "beginner", "What is a default constructor?", {
    problem: "new Student() failed after they wrote Student(String name) and forgot the empty one. The clerk tried to hand out a blank folder the old way, the compiler said no default constructor, and the guest line stopped. The named stamp had cancelled the free blank folders. The desk then had no honest cover left to hand the parent.",
    what: "If you write no constructor, the language gives a blank one. If you write any constructor, you own them — add an empty one if you still need new Student(). Java and C++ are strict here; Python and JS can keep a default argument on name instead. The shop used to hand out blank folders; once a named stamp exists, blank folders are no longer free unless you print an empty stamp too.",
    solves: "You know why 'no default constructor' appeared. You either add Student() that inks 'guest', or you stop calling new Student() with empty hands, and the clerk no longer expects free blank folders after a named stamp exists. The guest line moves because the wall rule is honest. A later restamp stays in one drawer instead of twenty hallway lists.",
    example: "The shop used to hand out blank folders. Once you print a named stamp, blank folders are no longer free. Ask for a folder with no name after the named stamp exists, and the clerk points at the new rule on the wall. Add a guest stamp or bring a name.",
    uses: "Java and C++. Python __init__ with defaults. Interviews write Student(String name), then call new Student() on the next line and wait for you to name the missing empty constructor. Add Student() or stop the empty new. Amazon and Microsoft both spring this after the first constructor. Name the door they should press, not a Wikipedia paragraph, then stop.",
    watch: "A child constructor that forgets super(). The parent blank folder never opens. Java will refuse the compile; JavaScript throws; the cover stays half-inked and they will ask which stamp you skipped. Default constructors do not save a child that never called the parent. Keep the stamp on the folder and wait for the next honest question."
  }, codes(
    `class Student {
  constructor(name = "guest") { this.name = name; }
}
new Student();
new Student("Ada");`,
    `class Student:
    def __init__(self, name="guest"):
        self.name = name
Student()
Student("Ada")`,
    `class Student {
  String name;
  Student() { name = "guest"; }
  Student(String n) { name = n; }
}`,
    `class Student {
 public:
  string name;
  Student() : name("guest") {}
  Student(string n) : name(n) {}
};`
  ), "Most asked · Amazon · Microsoft"),

  Q(32, "intermediate", "What is a copy constructor? Shallow vs deep copy?", {
    problem: "Student b = a; both folders pointed at the same marks list. Change one, the other changed. The clerk photocopied only the cover, Ada's marks moved, and Bob's report card showed Ada's numbers at parent night. Two jackets, one stack of papers, and a scribble stained both children. The clerk could not swear which paper was still true that morning.",
    what: "A copy constructor in C++, or clone in Java, makes a second object. Shallow copy shares inner lists. Deep copy clones the inner lists too. The cover can look new while the papers inside are still the same stack unless you photocopy every sheet. JS spread and Python copy are shallow unless you clone the nested marks array as well.",
    solves: "You know why two 'copies' still fight over one array. You clone the marks list when you need two independent folders, and you stop being surprised when b.marks[0] = 40 also rewrites Ada. Parent night then shows two honest cards instead of one shared pile with two jackets. The interviewer hears a shop sentence and lets you write the lines next.",
    example: "Photocopying the cover is shallow; photocopying every paper inside is deep. The clerk can hand Bob a new jacket that still holds Ada's marksheet, or she can copy each page so a scribble on Bob never stains Ada. Ask which array the two folders share before you call it a copy.",
    uses: "C++ interviews. JS: spread vs structuredClone. Python: copy vs deepcopy. They will mutate the inner list after a spread and wait for you to name shallow versus deep. Ask which array the two folders share. Amazon and Google both poke marks[0] after the copy line. Campus labs and Amazon both wait for the folder before a pattern catalog.",
    watch: "A shallow copy of a student that still shares the marks array. Changing Bob's marks rewrites Ada. They will ask which line allocated a new list, and pointing at the cover spread is not enough. Deep copy means a new stack of papers, not a new jacket on the same stack."
  }, codes(
    `const a = { marks: [90] };
const shallow = { ...a };           // same marks array
const deep = { marks: [...a.marks] };`,
    `import copy
a = {"marks": [90]}
shallow = copy.copy(a)
deep = copy.deepcopy(a)`,
    `int[] marks = {90};
int[] shallow = marks;                 // same array
int[] deep = java.util.Arrays.copyOf(marks, 1);`,
    `class Student {
 public:
  int* marks;
  Student(const Student& o) {          // copy ctor — deep
    marks = new int(*o.marks);
  }
};`
  ), "Most asked · Amazon · Google · Microsoft"),

  Q(33, "intermediate", "== vs equals? is vs == in Python?", {
    problem: "Two Student objects with name Ada printed false. People thought the class was broken. The clerk held two folders both labeled Ada, compared the locker numbers, and declared they were not the same person. A set then lost Ada after equals was overridden without hashCode. The clerk could not swear which paper was still true that morning.",
    what: "== in Java and JS on objects asks 'same folder in memory?'. equals, or a custom equals, asks 'same contents?'. Python: is is identity, == calls __eq__. Decide whether you care about the locker number or the name on the cover before you write the check. Two Adas can be equal by name and still sit in two lockers.",
    solves: "You compare roll numbers, not pointer addresses, when that is the question. Two Adas in two folders can be equal by name, and a set can find the student again if hashCode matches the same story. Mixing locker number with cover name is how the set shelves Ada where nobody can find her.",
    example: "Two folders both labeled Ada — different paper, same name. 'Same locker?' vs 'same name on the cover?' The clerk can ask either question; mixing them is how a set loses the student after you override only equals. Same locker versus same name must stay two questions. Pull that picture apart and you are back to hallway lists and ifs.",
    uses: "Java equals/hashCode pair. Python __eq__. Interviews create two new String('Ada') or two dicts and wait for you to split identity from contents in the language on the board. Same locker versus same name. Amazon and Google both print a == b next to a.equals(b). Keep the clerk picture on the board when they hand you the marker.",
    watch: "Overriding equals and forgetting hashCode in Java. The set loses the student. Two folders that claim the same name must also hash the same, or the clerk shelves Ada where the set can never find her again. Override both or override neither. They will wait for the folder picture if you only recite the poster."
  }, codes(
    `const a = { name: "Ada" };
const b = { name: "Ada" };
console.log(a === b);                 // false — two objects
console.log(a.name === b.name);       // true`,
    `a = {"name": "Ada"}
b = {"name": "Ada"}
print(a is b)                         # False — identity
print(a == b)                         # True — same keys`,
    `String a = new String("Ada");
String b = new String("Ada");
System.out.println(a == b);           // false
System.out.println(a.equals(b));      // true`,
    `string a = "Ada";
string b = "Ada";
cout << (a == b);                     // true — value`
  ), "Most asked · Amazon · Google · Microsoft"),

  Q(34, "intermediate", "What is a virtual function?", {
    problem: "C++ called Animal::speak even though the pointer held a Dog. The clerk asked the empty parent form, the Dog sat silently in the box, and the zoo list printed '...' on every line. Delete through the parent then skipped the Dog's cleanup too. The whiteboard stayed blank while the mess on the desk grew.",
    what: "virtual in C++ means look at the real object at run time. Java instance methods already do this. JS and Python too. Without virtual, a parent pointer plays the parent song even when the box holds a Dog; with virtual, the child's speak() runs. Add a virtual destructor on Animal so deleting through the parent pointer also calls the right cleanup.",
    solves: "You remember to write virtual in C++ or the parent song plays. Add virtual on speak() and a virtual destructor on Animal, and deleting through the parent pointer also calls the right cleanup. The zoo list then prints woof, and the Dog's file handle does not stay open. The interviewer hears a shop sentence and lets you write the lines next.",
    example: "The teacher asks the child, not the empty parent form. She looks at the student standing in front of her, not at the blank Person template on the desk, and the Dog answers woof instead of a dotted line. Without virtual she reads the blank form and the child never sings.",
    uses: "Every C++ polymorphism question. After Animal* a = new Dog() they ask why you need virtual, then they ask for a virtual destructor if you delete a. Mark both speak and ~Animal. Amazon and Microsoft both wait for the destructor as the second sentence. Keep the clerk picture on the board when they hand you the marker.",
    watch: "A virtual destructor on a base you delete through a parent pointer. Skip it and only ~Animal runs. The Dog's file handle stays open, and they will ask which destructor you forgot to mark virtual. Cleanup is part of the same virtual picture as speak(). They will wait for that fail picture if you skip the door."
  }, codes(
    `class Animal { speak() { return "..."; } }
class Dog extends Animal { speak() { return "woof"; } }
console.log(new Dog().speak());`,
    `class Animal:
    def speak(self):
        return "..."
class Dog(Animal):
    def speak(self):
        return "woof"
print(Dog().speak())`,
    `class Animal { String speak() { return "..."; } }
class Dog extends Animal { String speak() { return "woof"; } }
Animal a = new Dog();
System.out.println(a.speak());`,
    `class Animal {
 public:
  virtual string speak() { return "..."; }
  virtual ~Animal() {}
};
class Dog : public Animal {
 public:
  string speak() override { return "woof"; }
};`
  ), "Most asked · Amazon · Microsoft · Google"),

  Q(35, "intermediate", "Why is Java said to be not 100% OOP?", {
    problem: "A quiz asked 'is Java fully object oriented?' People said yes because everything is a class. Then they could not explain int, and the MCQ marked them wrong while they argued about class files. Loose coins still sat on the counter next to the folders. The shop till then stamped the wrong slip and nobody caught it.",
    what: "int, boolean and the other primitives are not objects. static methods can run with no instance. Multiple inheritance of classes is banned. Most of the shop is folders; a few loose coins still sit on the counter and static boards run with nobody holding a folder. You can box a coin into Integer, but the raw int the clerk counts is not itself a Student-style object.",
    solves: "You give a short 'no, because primitives and static' instead of a fight. The interviewer hears int versus Integer, hears Math.max with no Math object, and moves on instead of debating slogans. The MCQ is already answered before the language-war speech starts. A later restamp stays in one drawer instead of twenty hallway lists.",
    example: "Most of the shop is folders. A few loose coins (int) still sit on the counter. You can box a coin into Integer and put it in a folder, but the raw int the clerk counts is not itself a Student-style object. Math.max ticks a static board with nobody holding a Math folder.",
    uses: "Campus MCQ and Java screens. TCS and Infosys love this wording, so keep 'primitives and static' as the two reasons and do not start a language-war speech. int is a coin, not a folder. Amazon still asks it as a thirty-second trap after the four pillars. Keep the clerk picture on the board when they hand you the marker.",
    watch: "Saying Python is 100% either. ints are objects there; Java's int is not. They will ask n.bit_length() versus Java int, and mixing the two kitchens is how the MCQ traps you. Keep Java's coin on the counter and Python's int as a tiny object. A poster with no folder is not an answer they will accept."
  }, codes(
    `const n = 5;                          // JS number is an object-like primitive
console.log((5).toFixed(1));`,
    `n = 5
print(n.bit_length())                 # Python int is an object`,
    `int n = 5;                            // not an object
Integer boxed = Integer.valueOf(5);   // now an object
System.out.println(n + boxed);`,
    `int n = 5;                            // primitive
// no methods on n`
  ), "Most asked · TCS · Infosys · Amazon"),

  Q(36, "beginner", "What is a final / const / sealed class or method?", {
    problem: "A child overrode payFees and skipped the tax. Or a constant was reassigned. The clerk found a student class that scribbled a new rate on the metal plate, and the shop collected the wrong fee all morning. The wall rule had been filed off and rewritten as zero. The shop till then stamped the wrong slip and nobody caught it.",
    what: "final in Java, const on a C++ method or JS field, and sealed in newer Java all mean stop. A final class cannot be extended. A final method cannot be overridden. A const field cannot be reassigned. Lock the stamp you do not want a child to rewrite. String stays final so nobody extends it; pay() stays final so a child cannot skip tax.",
    solves: "You lock the stamp you do not want rewritten. String stays final so nobody extends it; pay() stays final so a child cannot skip tax; RATE stays const so a stray assignment cannot zero the shop. The metal plate on the wall still shows the real fee after a child stamp walks in.",
    example: "The fee rule is printed on metal. A student class cannot scribble a new rate. The clerk points at the plate on the wall; a child stamp may add a roll number, but it may not file the metal rule off and write zero. Morning collections then match the plate, not a hallway scribble.",
    uses: "Java String is final. C++ const methods. JS const on the binding, not the object guts. Interviews ask why String is final, then they ask whether const a = {} still lets you change a.name. Amazon and Microsoft both poke the object guts after const. Say the shop sentence, then write the lines in the language the posting named.",
    watch: "JS const obj still lets you change obj.name. const locks the binding, not the papers inside the folder. They will assign a.rate = 0 after const a and wait for you to name that hole. Lock the binding and still lock the field if the shop rate must stay metal."
  }, codes(
    `class Account {
  constructor() { this.rate = 0.18; }
}
const a = new Account();
a.rate = 0;                           // object guts still move
// a = 1;  // const binding — this line would throw`,
    `class Account:
    RATE = 0.18                       # convention: do not rebind
    def rate(self):
        return Account.RATE`,
    `final class Account {
  final double RATE = 0.18;
  final void pay() { }
}`,
    `class Account {
 public:
  const double RATE = 0.18;
  void pay() const { }                // will not change *this
};`
  ), "Most asked · Amazon · Microsoft · Google")
];

const data = {
  kind: "practice",
  langBar: true,
  langs: ["javascript", "python", "java", "cpp"],
  notes,
  examples,
  questions
};

const out = path.join(__dirname, "..", "data", "oops.js");
fs.writeFileSync(
  out,
  "window.PREP_DATA = window.PREP_DATA || {};\n" +
    'window.PREP_DATA["oops"] = ' +
    JSON.stringify(data, null, 2) +
    ";\n"
);
console.log("wrote", out, "examples", examples.length, "questions", questions.length);
