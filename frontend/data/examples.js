(function () {
  const data = window.PREP_DATA || (window.PREP_DATA = {});
  const add = (id, examples) => { if (data[id]) data[id].examples = examples; };

  add("javascript", [
    {
      lang: "js",
      title: "1. Make a box (variable)",
      desc: "What this is\nA variable is a name that holds a value so later lines can use it.\nlet creates a binding you can assign again.\nconst creates a binding that must keep the same value.\n\nWhat the code is doing\nThe first line makes age and stores the number 20.\nThe next line makes name and stores the text Nitin.\nage = 21 puts a new number in the same age binding.\nconsole.log(name) prints the text.\nconsole.log(age) prints 21, the updated number.\n\nWatch out\nconst only locks the name, not the insides of an object.\nIf you need that name to point at a new value, use let.",
      code: `// make a number. you can change it later
let age = 20;

// make text. this name cannot point to a new value
const name = "Nitin";

// change the number
age = 21;

// show values in the browser console
console.log(name);
console.log(age);`
    },
    {
      lang: "js",
      title: "2. Make a list (array)",
      desc: "What this is\nAn array is an ordered list of items under one name.\nEach item has a position called an index.\nCounting starts at 0, not at 1.\n\nWhat the code is doing\nfruits holds three text items in a row.\nfruits[0] reads the first item, which is apple.\npush adds orange at the end of the list.\nlength then tells you how many items the list has, which is 4.\n\nWatch out\nfruits[1] is mango, the second item.\nfruits[3] would be the fourth item after push, not the third.",
      code: `// a list of 3 fruits
const fruits = ["apple", "mango", "banana"];

// read the first item (counting starts at 0)
console.log(fruits[0]);  // apple

// add one more item at the end
fruits.push("orange");

// how many items now?
console.log(fruits.length);  // 4`
    },
    {
      lang: "js",
      title: "3. Make an object",
      desc: "What this is\nAn object groups related facts under one name.\nEach fact has a key, which is the field name, and a value.\nYou read a field with a dot and the key.\n\nWhat the code is doing\nstudent is one object with name, age, and city.\nstudent.name reads the name field and prints Ada.\nstudent.city = \"Delhi\" changes only that field.\nThe last log prints Delhi, the new city.\n\nWatch out\nThe name student still points at the same object after you change a field.\nconst stops you from replacing the whole object, not from editing its fields.",
      code: `// one student with 3 pieces of info
const student = {
  name: "Ada",
  age: 21,
  city: "Pune"
};

// read one field
console.log(student.name);  // Ada

// change one field
student.city = "Delhi";
console.log(student.city);  // Delhi`
    },
    {
      lang: "js",
      title: "4. Make a function",
      desc: "What this is\nA function is a named set of steps you can run again.\nYou pass in values, called arguments.\nIt can send a result back with return.\n\nWhat the code is doing\nsayHello names the steps and takes one input called name.\nInside, return builds a sentence with Hello and that name.\nsayHello(\"Nitin\") runs those steps and gives back the sentence.\nmessage stores that result.\nconsole.log prints Hello, Nitin.\n\nWatch out\nIf you forget return, the function still runs but the result is undefined.\nThe name inside the function is the parameter, not the variable in the outer code.",
      code: `// this function takes a name and returns a sentence
function sayHello(name) {
  return "Hello, " + name;
}

// call (use) the function
const message = sayHello("Nitin");
console.log(message);  // Hello, Nitin`
    },
    {
      lang: "js",
      title: "5. If / else (make a choice)",
      desc: "What this is\nif / else lets the program pick a path.\nThe test in parentheses must be true or false.\nOnly one branch runs for that decision.\n\nWhat the code is doing\nmarks is 75.\nThe first if checks whether marks is at least 40, which is true, so it prints Pass.\nThe second block checks 80 first, which fails, then 60, which succeeds, so it prints Grade B.\nThe final else would run only if both of those checks failed.\n\nWatch out\nelse if is a second test, not a second independent if.\nOrder matters: a later check never runs once an earlier one matches.",
      code: `const marks = 75;

if (marks >= 40) {
  console.log("Pass");
} else {
  console.log("Fail");
}

// you can add more checks
if (marks >= 80) {
  console.log("Grade A");
} else if (marks >= 60) {
  console.log("Grade B");
} else {
  console.log("Grade C");
}`
    },
    {
      lang: "js",
      title: "6. Loop through a list",
      desc: "What this is\nA loop repeats the same work for many items.\nYou do not copy the same console.log by hand.\nTwo common styles are shown here.\n\nWhat the code is doing\nfruits is a list of three names.\nThe for loop sets i to 0, then 1, then 2, while i is less than the list length.\nEach round prints the index and the item at that index.\nThe for...of loop walks the same list and prints one fruit at a time with no index.\n\nWatch out\ni < fruits.length stops before you walk off the end of the list.\nfor...of gives each value; it does not give the index unless you add extra code.",
      code: `const fruits = ["apple", "mango", "banana"];

// i starts at 0, then 1, then 2
for (let i = 0; i < fruits.length; i++) {
  console.log(i, fruits[i]);
}

// easier style: one fruit at a time
for (const fruit of fruits) {
  console.log(fruit);
}`
    },
    {
      lang: "js",
      title: "7. Change a heading on the page",
      desc: "What this is\nThe DOM is the page as JavaScript sees it.\nquerySelector finds an element that matches a CSS selector.\ntextContent is the visible text inside that element.\n\nWhat the code is doing\nThe first line looks for the first h1 on the page.\ntitle holds that heading element.\nThe next line replaces its text with Welcome to Preplace.\nThe heading on the screen changes as soon as this runs.\n\nWatch out\nIf there is no h1, title is null and the next line crashes.\nThis code belongs in a browser page, not in a Node terminal.",
      code: `// find the first <h1> on the page
const title = document.querySelector("h1");

// change the text the user sees
title.textContent = "Welcome to Preplace";`
    },
    {
      lang: "js",
      title: "8. Button click",
      desc: "What this is\nA click listener waits for the user, then runs your function.\nquerySelector(\"#save\") finds the element whose id is save.\naddEventListener ties the click to the function you pass.\n\nWhat the code is doing\nThe first line finds the button.\naddEventListener registers a function for the click event.\nWhen the user clicks, that function runs.\nalert then shows You clicked Save.\n\nWatch out\nThe HTML must actually contain a button with id save.\nIf the selector finds nothing, calling addEventListener on null crashes.",
      code: `// find the button by its id
const button = document.querySelector("#save");

// when the user clicks, run this function
button.addEventListener("click", function () {
  alert("You clicked Save");
});`
    },
    {
      lang: "js",
      title: "9. Wait, then do something",
      desc: "What this is\nsetTimeout schedules work for later.\nThe delay is in milliseconds, so 2000 means two seconds.\nThe callback runs once, not in a loop.\n\nWhat the code is doing\nThe first log prints 1. start immediately.\nsetTimeout stores the inner function and the 2000 delay, then returns.\nThe last log prints 3. this runs right away, still before the wait ends.\nAfter two seconds the stored function runs and prints 2.\n\nWatch out\nThe numbers in the messages are not the real run order.\nStart and the last log happen first; the middle message is last on the clock.",
      code: `console.log("1. start");

// wait 2000 milliseconds = 2 seconds
setTimeout(function () {
  console.log("2. this runs after 2 seconds");
}, 2000);

console.log("3. this runs right away");`
    },
    {
      lang: "js",
      title: "10. Get data from the internet",
      desc: "What this is\nfetch asks another computer for data over the network.\nawait pauses this function until that answer arrives.\njson() turns the response body into a JavaScript object.\n\nWhat the code is doing\ngetUser is async so it may use await.\nThe first await calls fetch and waits for the HTTP response.\nThe second await reads the body and parses JSON into user.\nconsole.log prints the name field from that object.\ngetUser() at the bottom starts the function.\n\nWatch out\nawait only works inside an async function here.\nIf the URL fails, you need try/catch or the rejection is an unhandled error.",
      code: `async function getUser() {
  // ask the internet for data
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");

  // turn the answer into a JavaScript object
  const user = await response.json();

  // show one field
  console.log(user.name);
}

getUser();`
    }
  ]);

  add("react", [
    {
      lang: "jsx",
      title: "1. A tiny screen piece",
      desc: "What this is\nA component is a function that returns UI.\nReact calls that function and puts the result on the screen.\nJSX looks like HTML but it is JavaScript.\n\nWhat the code is doing\nHello is a function that returns an h1 with the text Hello React.\nApp is another component.\nApp returns <Hello />, which means render the Hello component.\nThe page shows that heading because App is the tree you mount.\n\nWatch out\nThe name must start with a capital letter or React treats it as an HTML tag.\nReturning more than one root element needs a wrapper or a fragment.",
      code: `function Hello() {
  return <h1>Hello React</h1>;
}

function App() {
  return <Hello />;
}`
    },
    {
      lang: "jsx",
      title: "2. Your first component",
      desc: "What this is\nA component is a function that returns UI.\nJSX is the HTML-like syntax inside the return.\nYou reuse a component by writing it as a tag.\n\nWhat the code is doing\nHello returns an h1 with the text Hello React.\nApp returns <Hello />, so Hello becomes part of App's tree.\nexport default App marks App as the file's main component.\nOther files can import it and render it.\n\nWatch out\n<Hello /> with a capital H is your function, not a built-in HTML tag.\nIf you return nothing, React has nothing to draw.",
      code: `// this function is a small piece of UI
function Hello() {
  return <h1>Hello React</h1>;
}

// App is the main page. it uses Hello
function App() {
  return <Hello />;
}

export default App;`
    },
    {
      lang: "jsx",
      title: "3. Pass data (props)",
      desc: "What this is\nProps are inputs a parent sends to a child.\nThe child reads them from its parameter.\nThe parent chooses the value when it writes the tag.\n\nWhat the code is doing\nHello receives props and reads props.name.\nIt puts that name inside the h1 using curly braces.\nApp renders <Hello name=\"Nitin\" />, so name is the text Nitin.\nThe heading becomes Hello, Nitin.\n\nWatch out\nCurly braces {props.name} insert a JavaScript value into JSX.\nA quoted attribute is a string; it is not a variable from the child.",
      code: `// child: it receives name
function Hello(props) {
  return <h1>Hello, {props.name}</h1>;
}

// parent: it sends name="Nitin"
function App() {
  return <Hello name="Nitin" />;
}

export default App;`
    },
    {
      lang: "jsx",
      title: "4. Remember a number (useState)",
      desc: "What this is\nState is data React remembers between renders.\nWhen state changes, React calls the component again.\nThe screen then shows the new value.\n\nWhat the code is doing\nuseState is imported from react.\nuseState(0) starts count at 0 and gives setCount to update it.\nThe button's onClick calls setCount(count + 1).\nThe button text includes {count}, so the number on screen goes up each click.\nexport default Counter makes this the file's main component.\n\nWatch out\nDo not assign count = count + 1; that skips React and the screen will not update.\nsetCount is the only supported way to change this state.",
      code: `import { useState } from "react";

function Counter() {
  // count starts at 0
  // setCount is how we change it
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked {count} times
    </button>
  );
}

export default Counter;`
    },
    {
      lang: "jsx",
      title: "5. Show a list",
      desc: "What this is\nmap turns each item in a list into an element.\nReact needs a key on each sibling in that list.\nThe key helps React match old rows to new rows.\n\nWhat the code is doing\nfruits is a plain array of three names.\nFruitList returns a ul.\nmap walks the array and returns one li per fruit.\nkey={fruit} sets the key to that name.\nThe li's text is the fruit itself.\n\nWatch out\nkey must be stable and unique among siblings.\nIf two fruits had the same name, using the name as key would clash.",
      code: `const fruits = ["apple", "mango", "banana"];

function FruitList() {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}

export default FruitList;`
    },
    {
      lang: "jsx",
      title: "6. Easy form (input box)",
      desc: "What this is\nA controlled input keeps its value in React state.\nTyping does not live only inside the DOM.\nonChange updates state, and value writes state back into the box.\n\nWhat the code is doing\nname starts as an empty string.\nThe input's value is always name.\nonChange reads event.target.value, the text in the box, and calls setName.\nThe paragraph prints Hello and the current name.\nEach keystroke re-renders with the new text.\n\nWatch out\nIf you omit value, the input is uncontrolled and React is not the source of truth.\nIf you set value but skip onChange, the box cannot change.",
      code: `import { useState } from "react";

function NameForm() {
  const [name, setName] = useState("");

  return (
    <div>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Type your name"
      />
      <p>Hello, {name}</p>
    </div>
  );
}

export default NameForm;`
    },
    {
      lang: "jsx",
      title: "7. Show / hide something",
      desc: "What this is\nA boolean in state can show or hide UI.\ntrue means one thing, false means another.\nYou store that flag with useState.\n\nWhat the code is doing\nopen starts as false, so the extra paragraph is hidden.\nThe button's onClick calls setOpen(!open), which flips the flag.\nThe button label uses a ternary: Hide when open is true, Show when it is false.\n{open && <p>...</p>} renders the paragraph only when open is true.\n\nWatch out\n!open is the opposite boolean, not a click count.\n&& will not render the paragraph when open is false.",
      code: `import { useState } from "react";

function Box() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Show"}
      </button>

      {open && <p>This text is visible now</p>}
    </div>
  );
}

export default Box;`
    },
    {
      lang: "jsx",
      title: "8. Do something when the page opens",
      desc: "What this is\nuseEffect runs extra work after React paints the screen.\nThe second argument is the dependency list.\nAn empty list means run after the first paint only.\n\nWhat the code is doing\nuseEffect is imported from react.\nThe effect function logs Page is ready.\n[] tells React this effect does not depend on changing values.\nWelcome still returns the h1 as usual.\nThe log happens after that heading is on the screen.\n\nWatch out\n[] is not the same as omitting the list; omitting runs after every render.\nDo not use useEffect to compute values you could calculate during render.",
      code: `import { useEffect } from "react";

function Welcome() {
  useEffect(() => {
    console.log("Page is ready");
  }, []);

  return <h1>Welcome</h1>;
}

export default Welcome;`
    },
    {
      lang: "jsx",
      title: "9. Load data from an API",
      desc: "What this is\nRemote data is not there on the first paint.\nYou start with an empty list in state.\nAfter fetch finishes, you put the real names into state.\n\nWhat the code is doing\nnames starts as [].\nuseEffect runs fetch to the users URL after the first paint.\nThe first then turns the response into JSON.\nThe second then maps each user object to user.name and calls setNames.\nThe ul maps names into li elements, one per name.\n\nWatch out\nThe empty [] on useEffect means this fetch runs once, not on every render.\nIf two users share a name, using name as key can confuse React's list.",
      code: `import { useEffect, useState } from "react";

function Users() {
  const [names, setNames] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        // keep only names so it stays simple
        setNames(data.map((user) => user.name));
      });
  }, []);

  return (
    <ul>
      {names.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}

export default Users;`
    },
    {
      lang: "jsx",
      title: "10. Two pages (simple router idea)",
      desc: "What this is\nA router picks which component to show from the URL.\nLink changes the path without a full page reload.\nRoute matches a path to an element.\n\nWhat the code is doing\nHome and About are two small page components.\nBrowserRouter wraps the app so routing works in the browser.\nThe Link tags point to / and /about.\nRoutes lists the matches: / renders Home, /about renders About.\nThe matching Route's element is what you see below the links.\n\nWatch out\npath=\"/\" is the home URL, not an empty string.\nA Link is not the same as an <a href> that reloads the whole site, though both can navigate.",
      code: `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return <h1>Home page</h1>;
}

function About() {
  return <h1>About page</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Link to="/">Home</Link>
      {" | "}
      <Link to="/about">About</Link>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;`
    }
  ]);

  add("typescript", [
    {
      lang: "ts",
      title: "1. A typed variable",
      desc: "What this is\nA type annotation sits after a colon and names the kind of value.\nnumber, string, and boolean are three primitive types.\nTypeScript checks assignments against those kinds before the code runs.\n\nWhat the code is doing\nage is annotated as number and starts at 20.\nname is annotated as string and stores Nitin.\nok is annotated as boolean and stores true.\nEach line must keep that kind of value.\n\nWatch out\nA type is erased when the file is compiled; the running JS has no colon.\nPutting quotes around 20 would be a string, not a number.",
      code: `let age: number = 20;
let name: string = "Nitin";
let ok: boolean = true;`
    },
    {
      lang: "ts",
      title: "2. Give a variable a type",
      desc: "What this is\nA type annotation sits after a colon and names the kind of value.\nnumber is for numeric values, string is for text, boolean is for true or false.\nThe checker rejects a value that does not match.\n\nWhat the code is doing\nage must be a number and starts at 20.\nname must be text and stores Nitin.\nisStudent must be true or false and stores true.\nage = 21 is allowed because 21 is still a number.\nThe log prints all three current values.\n\nWatch out\nage = \"21\" would be a type error even though it looks similar.\nboolean is not the text \"true\"; it is the real true or false value.",
      code: `// this must be a number
let age: number = 20;

// this must be text
let name: string = "Nitin";

// this must be true or false
let isStudent: boolean = true;

age = 21;
console.log(name, age, isStudent);`
    },
    {
      lang: "ts",
      title: "3. Type a function",
      desc: "What this is\nA function type lists each parameter and the return type.\nThe names a and b are the inputs.\nThe colon after the parameter list is what comes out.\n\nWhat the code is doing\nadd takes two numbers, a and b.\nThe return type is number, so the body must return a number.\nreturn a + b adds the two inputs.\nadd(2, 3) stores 5 in result.\nThe commented call add(\"2\", 3) is the kind of mistake the checker would catch.\n\nWatch out\nThe return type is not optional in your head even if you omit it; TypeScript will infer it.\nPassing a string where a number is required is a type error, not a silent conversion.",
      code: `// a and b are numbers. the answer is a number
function add(a: number, b: number): number {
  return a + b;
}

const result = add(2, 3);
console.log(result);  // 5

// this would be an error:
// add("2", 3);`
    },
    {
      lang: "ts",
      title: "4. Type an object",
      desc: "What this is\nAn interface lists the fields an object must have.\nEach field has a name and a type.\nAn object typed as that interface must include those fields.\n\nWhat the code is doing\nUser requires id as a number and name as a string.\nuser is annotated as User.\nThe object literal supplies id 1 and name Ada, which matches.\nconsole.log reads user.name.\n\nWatch out\nMissing name or giving id a string fails the checklist.\nExtra fields on a fresh object literal are often flagged as excess properties.",
      code: `// the shape of a user
interface User {
  id: number;
  name: string;
}

// this object must match the checklist
const user: User = {
  id: 1,
  name: "Ada"
};

console.log(user.name);`
    },
    {
      lang: "ts",
      title: "5. Optional field",
      desc: "What this is\nA question mark on a field means that field may be missing.\nThe other fields are still required.\nReading a missing optional field gives undefined.\n\nWhat the code is doing\nUser still requires id and name.\nemail? means email can be skipped.\nuser1 has no email, which is allowed.\nuser2 includes email.\nThe logs print undefined for user1.email and the address for user2.\n\nWatch out\nOptional is not the same as string | null unless you write that.\nIf you use email, check it before you treat it as a string.",
      code: `interface User {
  id: number;
  name: string;
  email?: string;  // optional
}

const user1: User = { id: 1, name: "Ada" };
const user2: User = { id: 2, name: "Grace", email: "g@test.com" };

console.log(user1.email);  // undefined
console.log(user2.email);`
    },
    {
      lang: "ts",
      title: "6. A list of one type",
      desc: "What this is\nAn array type names the type of every item.\nstring[] means each item is text.\nnumber[] means each item is a number.\n\nWhat the code is doing\nfruits is a string array starting with apple and mango.\npush adds banana, which is also a string.\nmarks is a number array of three scores.\nThe log reads the first fruit and the second mark.\n\nWatch out\nfruits.push(10) would be a type error.\nstring[] is not the same as [string], which is a tuple of length one.",
      code: `const fruits: string[] = ["apple", "mango"];
fruits.push("banana");

const marks: number[] = [80, 90, 70];

console.log(fruits[0], marks[1]);`
    },
    {
      lang: "ts",
      title: "7. This or that (union)",
      desc: "What this is\nA union type allows one value to be one of several kinds.\nThe bar between number and string means this id may be either.\nTypeScript still checks both sides.\n\nWhat the code is doing\nid is declared as number | string with no starting value.\nid = 10 stores a number, which matches the left side.\nid = \"u-10\" stores text, which matches the right side.\nconsole.log prints the last value, the string.\n\nWatch out\nA union is one kind at a time, not both at once.\nDo not call string-only or number-only operations until you have narrowed the type.",
      code: `// id can be a number OR text
let id: number | string;

id = 10;
id = "u-10";

console.log(id);`
    },
    {
      lang: "ts",
      title: "8. null is allowed only if you say so",
      desc: "What this is\nnull means this variable holds no object right now.\nYou must write | null if null is allowed.\nWithout that, TypeScript treats null as an error.\n\nWhat the code is doing\nuser starts as null, which matches the union.\nLater it becomes an object with name Ada.\nThe if checks that user is not null.\nInside that block, user.name is safe to read and print.\n\nWatch out\nuser.name before the check is a type error because user might still be null.\nundefined is a different empty value; list it only if you mean it.",
      code: `let user: { name: string } | null = null;

// later we get a user
user = { name: "Ada" };

if (user !== null) {
  console.log(user.name);
}`
    },
    {
      lang: "ts",
      title: "9. Type a React prop (simple)",
      desc: "What this is\nReact props can use the same object-shape idea as any other type.\nA type alias names that shape.\nThe component parameter is annotated with it.\n\nWhat the code is doing\nHelloProps requires a name field that is a string.\nHello takes props typed as HelloProps.\nThe h1 reads props.name.\nA call with name=\"Nitin\" matches.\nA call with name={10} does not, because 10 is a number.\n\nWatch out\nThe type is checked at compile time, not by React at runtime.\nRenaming the prop in the parent without updating the type will fail the check.",
      code: `type HelloProps = {
  name: string;
};

function Hello(props: HelloProps) {
  return <h1>Hello, {props.name}</h1>;
}

// <Hello name="Nitin" />  is OK
// <Hello name={10} />     is an error`
    },
    {
      lang: "ts",
      title: "10. Turn unknown JSON into a type",
      desc: "What this is\nData from outside your file is untrusted.\nunknown means you have not checked the shape yet.\nA type predicate function teaches TypeScript a runtime check.\n\nWhat the code is doing\nUser is an object with a string name.\nisUser takes unknown and returns whether it looks like User.\nIt checks that the value is an object, not null, and that name exists.\ndata is typed unknown even though the literal has a name.\nThe if (isUser(data)) block lets you read data.name safely.\n\nWatch out\nunknown is stricter than any; you must check before you use fields.\nA successful check still does not prove name is a string unless you test that too.",
      code: `type User = { name: string };

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value
  );
}

const data: unknown = { name: "Ada" };

if (isUser(data)) {
  console.log(data.name);
}`
    }
  ]);

  add("htmlcss", [
    {
      lang: "html",
      title: "1. Smallest HTML page",
      desc: "What this is\nHTML is the structure of a page.\nThe browser reads tags and draws content.\nA smallest page still needs a document type, html, head, and body.\n\nWhat the code is doing\nDOCTYPE tells the browser this is a modern HTML document.\nThe title in head is the tab name, My first page.\nbody holds what the user sees.\nh1 is the main heading Hello.\np is a paragraph of normal text.\n\nWatch out\nhead is metadata; putting visible text only in head hides it from the page.\nTags must nest correctly; an unclosed tag can swallow the rest of the page.",
      code: `<!DOCTYPE html>
<html>
  <head>
    <title>My first page</title>
  </head>
  <body>
    <h1>Hello</h1>
    <p>This is a paragraph.</p>
  </body>
</html>`
    },
    {
      lang: "html",
      title: "2. Headings, text, link, image",
      desc: "What this is\nHeadings, paragraphs, links, and images are everyday tags.\nh1 is the main title, h2 is a section title.\na makes a link, img shows a picture.\n\nWhat the code is doing\nThe h1 and h2 set two levels of title.\nThe p holds normal text.\nThe a tag's href is the URL the link opens.\nThe img src is the file to show, alt describes it if the image cannot load, and width sets the display width.\n\nWatch out\nalt is not a caption for people who can see the image; it is the fallback meaning.\nhref on a link is required for the link to go anywhere.",
      code: `<h1>Big title</h1>
<h2>Smaller title</h2>
<p>This is normal text.</p>

<a href="https://google.com">Go to Google</a>

<img src="photo.jpg" alt="A photo of a book" width="200" />`
    },
    {
      lang: "html",
      title: "3. A list and a button",
      desc: "What this is\nul is an unordered list of bullets.\nli is one item in that list.\nbutton is a control the user can activate.\n\nWhat the code is doing\nThe ul wraps three li elements: HTML, CSS, and JavaScript.\nEach li is one bullet on the screen.\nThe button's text is Click me.\nThis snippet has no click handler yet; it is only the markup.\n\nWatch out\nol would number the items; ul does not.\nA button inside a form may submit that form unless you set type=\"button\".",
      code: `<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>

<button>Click me</button>`
    },
    {
      lang: "html",
      title: "4. Easy form",
      desc: "What this is\nA form collects values the user types.\nlabel describes a control and can wrap it.\ninput is the actual box; its type changes what the browser expects.\n\nWhat the code is doing\nThe form wraps two labels and a submit button.\nThe first input is type text with name name.\nThe second input is type email with name email.\nThe button type submit sends the form.\nname on an input is the key that would be sent with the value.\n\nWatch out\nA label wrapped around the input ties the text to the box without extra for and id.\ntype=\"email\" is a hint to the browser; it is not full server-side validation.",
      code: `<form>
  <label>
    Your name
    <input type="text" name="name" />
  </label>

  <label>
    Your email
    <input type="email" name="email" />
  </label>

  <button type="submit">Send</button>
</form>`
    },
    {
      lang: "css",
      title: "5. Connect CSS and change colors",
      desc: "What this is\nCSS is a list of rules that style HTML.\nA selector picks which elements the rule touches.\nProperties inside the braces set colors and fonts.\n\nWhat the code is doing\nThe comment says this file is style.css.\nThe body rule sets a light background, dark text, and Arial.\nThe h1 rule sets the heading color to a brown-orange.\nThose rules apply to every matching element on the page.\n\nWatch out\nThe HTML page must link this file; CSS in a disconnected file does nothing.\nA more specific rule can override these colors later.",
      code: `/* style.css */

body {
  background: #fff8ee;
  color: #222;
  font-family: Arial, sans-serif;
}

h1 {
  color: #b4532a;
}`
    },
    {
      lang: "css",
      title: "6. Space around a box",
      desc: "What this is\nThe box around content has padding, border, and margin.\npadding is space inside the border, around the content.\nmargin is space outside the border, between this box and neighbors.\n\nWhat the code is doing\n.card selects elements with class card.\npadding 16px pushes content inward.\nmargin 16px pushes other elements away.\nborder draws a thin gray line.\nborder-radius rounds the corners.\n\nWatch out\npadding and margin are easy to mix up: padding is inside, margin is outside.\nClass selectors need the dot; card without a dot would mean a <card> tag.",
      code: `.card {
  padding: 16px;     /* space inside */
  margin: 16px;      /* space outside */
  border: 1px solid #ccc;
  border-radius: 12px;
}`
    },
    {
      lang: "css",
      title: "7. Put items in a row (flex)",
      desc: "What this is\nflex puts children in a row or a column.\nThe parent has display flex.\ngap, align-items, and justify-content control spacing and alignment.\n\nWhat the code is doing\n.row is the flex container.\ndisplay flex lays children out in a row by default.\ngap 12px is the space between those children.\nalign-items center centers them on the cross axis.\njustify-content space-between pushes the first child left and the last child right.\n\nWatch out\nflex on the parent is what matters; the children do not each need display flex for this layout.\nspace-between ignores gap for the ends; it spends extra space between items.",
      code: `.row {
  display: flex;
  gap: 12px;                 /* space between items */
  align-items: center;       /* vertical center */
  justify-content: space-between;  /* left and right */
}`
    },
    {
      lang: "css",
      title: "8. Simple 2-column grid",
      desc: "What this is\ngrid places items on rows and columns.\ngrid-template-columns defines the column track sizes.\nfr is a share of free space.\n\nWhat the code is doing\n.grid becomes a grid container.\n1fr 1fr makes two equal columns.\ngap 16px separates the cells.\nThe media query runs when the viewport is 600px wide or less.\nInside it, one 1fr column stacks the items.\n\nWatch out\nTwo 1fr columns are equal even if content length differs.\nThe media query must be written after the base rule so it can override the columns.",
      code: `.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* two equal columns */
  gap: 16px;
}

/* on a small phone, one column */
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}`
    },
    {
      lang: "css",
      title: "9. Center a box on the page",
      desc: "What this is\nCentering a box on the viewport is a layout problem.\nmin-height 100vh makes the container at least as tall as the screen.\ngrid with place-items center centers on both axes.\n\nWhat the code is doing\n.page is the full-page wrapper.\nmin-height 100vh stretches it to the viewport height.\ndisplay grid makes it a grid container.\nplace-items center centers the child horizontally and vertically.\n\nWatch out\n100vh is the viewport height, not the height of the content.\nIf the child is larger than the viewport, centering alone will not shrink it.",
      code: `.page {
  min-height: 100vh;   /* full screen height */
  display: grid;
  place-items: center; /* center left-right and up-down */
}`
    },
    {
      lang: "html",
      title: "10. Page pieces with meaning",
      desc: "What this is\nLandmark tags name regions of the page.\nheader, nav, main, and footer mean more than a generic div.\nBrowsers and assistive tools can jump to those regions.\n\nWhat the code is doing\nheader holds the site name.\nnav holds the Home and About links.\nmain holds the unique page content, the h1 and paragraph.\nfooter holds the closing line.\nEach tag wraps the content that belongs to that region.\n\nWatch out\nThere should be one main per page.\nA div with a class is not a landmark unless you also add the right role.",
      code: `<header>My site name</header>
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
<main>
  <h1>Home</h1>
  <p>Welcome.</p>
</main>
<footer>Thank you for visiting</footer>`
    }
  ]);

  add("nodeexpress", [
    {
      lang: "js",
      title: "1. A tiny server",
      desc: "What this is\nExpress is a function that builds a web server in Node.\napp.get registers what to do for a GET request to a path.\nlisten opens a port so browsers can connect.\n\nWhat the code is doing\nrequire loads the express module.\nexpress() creates the app object.\napp.get(\"/\", ...) runs when someone visits the home path.\nres.send writes Hello from my server as the response body.\napp.listen(3000) starts the server on port 3000.\n\nWatch out\nThe callback on get only runs when a matching request arrives, not at startup.\nIf another program already uses 3000, listen fails until you pick a free port.",
      code: `const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("Hello from my server");
});

app.listen(3000);`
    },
    {
      lang: "js",
      title: "2. Start a tiny server",
      desc: "What this is\nExpress is a function that builds a web server in Node.\nA route pairs an HTTP method and a path with a function.\nThe response object is how you send bytes back.\n\nWhat the code is doing\nrequire loads express and express() creates app.\napp.get(\"/\", ...) handles GET requests to the home path.\nThe handler receives req (the request) and res (the response).\nres.send writes the text Hello from my server.\napp.listen(3000) starts listening, and the callback logs the URL to open.\n\nWatch out\nres.send ends this response; do not send twice on the same request.\nThe server process must keep running; closing the terminal stops it.",
      code: `// load express
const express = require("express");

// make the app
const app = express();

// when someone visits the home page, send text
app.get("/", function (req, res) {
  res.send("Hello from my server");
});

// start listening on port 3000
app.listen(3000, function () {
  console.log("Open http://localhost:3000");
});`
    },
    {
      lang: "js",
      title: "3. Send JSON (data, not only text)",
      desc: "What this is\nJSON is a data format APIs send instead of a full HTML page.\nres.json turns a JavaScript object into that format.\nThe client can parse it back into fields.\n\nWhat the code is doing\napp.get(\"/hello\", ...) handles GET /hello.\nThe handler calls res.json with an object.\nmessage is Hello and ok is true.\nExpress sets a JSON content type and writes the object as text.\n\nWatch out\nres.json is not the same as res.send of a string; it serializes the object.\nA missing route here would not run this handler.",
      code: `app.get("/hello", function (req, res) {
  res.json({
    message: "Hello",
    ok: true
  });
});`
    },
    {
      lang: "js",
      title: "4. Read a value from the URL",
      desc: "What this is\nA colon in a path marks a parameter.\nThe value from the URL lands on req.params.\nThe handler can send that value back in JSON.\n\nWhat the code is doing\nThe path /users/:id matches /users/5 and similar URLs.\nreq.params.id is the text in that slot, such as 5.\nres.json sends an object with that id and a name.\nThe browser sees both fields.\n\nWatch out\nParams are strings even when they look like numbers.\n/users/:id does not match /users with no extra segment.",
      code: `app.get("/users/:id", function (req, res) {
  const id = req.params.id;
  res.json({ id: id, name: "Ada" });
});`
    },
    {
      lang: "js",
      title: "5. Read data the user sends (POST)",
      desc: "What this is\nPOST carries a body, not only a URL.\nexpress.json() reads that body and puts an object on req.body.\nYour handler then reads fields from req.body.\n\nWhat the code is doing\napp.use(express.json()) installs the JSON body parser for this app.\napp.post(\"/users\", ...) handles POST /users.\nname is taken from req.body.name.\nres.json replies with { saved: name }.\nThe comment shows a sample body { \"name\": \"Nitin\" }.\n\nWatch out\nWithout express.json(), req.body is undefined and name cannot be read.\nGET requests do not use this body parser the same way; this route is POST.",
      code: `app.use(express.json());

app.post("/users", function (req, res) {
  const name = req.body.name;
  res.json({ saved: name });
});

// example body: { "name": "Nitin" }`
    },
    {
      lang: "js",
      title: "6. A function that runs first (middleware)",
      desc: "What this is\nMiddleware is a function that runs before the route handler.\nIt receives req, res, and next.\nCalling next passes control to the next matching function.\n\nWhat the code is doing\nlogger prints the requested URL.\nnext() continues the chain.\napp.use(logger) runs logger on every request that reaches it.\nLater routes still run after next is called.\n\nWatch out\nIf you forget next() and also do not send a response, the request hangs.\nMiddleware order matters: use the logger before the routes you want logged.",
      code: `function logger(req, res, next) {
  console.log("Someone asked for", req.url);
  next();  // continue
}

app.use(logger);`
    },
    {
      lang: "js",
      title: "7. 404 if the page does not exist",
      desc: "What this is\nA 404 handler runs when no earlier route sent a response.\nYou place it after the real routes.\nstatus 404 tells the client the path was not found.\n\nWhat the code is doing\napp.use with a (req, res) function matches remaining requests.\nres.status(404) sets the HTTP status.\njson sends { error: \"Not found\" } as the body.\nThe client can read that error field.\n\nWatch out\nIf this use() sits above your real routes, those routes never run.\nA 404 is not a crash; it is a normal answer for an unknown path.",
      code: `app.use(function (req, res) {
  res.status(404).json({ error: "Not found" });
});`
    },
    {
      lang: "js",
      title: "8. Read a secret from .env",
      desc: "What this is\nprocess.env holds settings from the environment.\ndotenv reads a .env file into process.env when you call config.\nA fallback value is used when the setting is missing.\n\nWhat the code is doing\nThe comment shows a .env line PORT=3000.\nconfig() loads that file.\nport becomes process.env.PORT, or 3000 if PORT is empty.\napp.listen(port) starts the server on that port.\n\nWatch out\nDo not commit real secrets in .env to Git.\nThe names in .env are strings; compare and parse them with care.",
      code: `// .env file:
// PORT=3000

require("dotenv").config();

const port = process.env.PORT || 3000;
app.listen(port);`
    },
    {
      lang: "js",
      title: "9. Put routes in another file",
      desc: "What this is\nA router is a mini-app that holds its own routes.\nYou keep those routes in another file to shrink the main file.\napp.use mounts the router on a path prefix.\n\nWhat the code is doing\nhello.js creates a Router and handles GET / with a short text response.\nmodule.exports shares that router.\nThe comments in index.js show require and app.use(\"/hello\", helloRoutes).\nA request to /hello then runs the router's /.\n\nWatch out\nThe router's \"/\" is relative to the mount path, so it becomes /hello, not the site root.\nForgetting module.exports means require gets nothing useful.",
      code: `// routes/hello.js
const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.send("hello routes");
});

module.exports = router;

// in index.js
// const helloRoutes = require("./routes/hello");
// app.use("/hello", helloRoutes);`
    },
    {
      lang: "js",
      title: "10. Handle an error",
      desc: "What this is\nError-handling middleware takes four arguments: err, req, res, next.\nCalling next(error) skips to that handler.\nYou send a safe message to the client and log details on the server.\n\nWhat the code is doing\nGET /boom calls next with a new Error.\nThe four-argument use() function is the error handler.\nIt logs err.message on the server.\nIt replies with status 500 and { error: \"Server error\" }.\nThe client does not receive the original stack.\n\nWatch out\nA three-argument function is not an error handler even if you name it err.\nDo not send err.stack to the browser in production.",
      code: `app.get("/boom", function (req, res, next) {
  next(new Error("Something went wrong"));
});

// this special function has 4 inputs
app.use(function (err, req, res, next) {
  console.log(err.message);
  res.status(500).json({ error: "Server error" });
});`
    }
  ]);

  add("fullstack", [
    {
      lang: "txt",
      title: "1. The big picture",
      desc: "What this is\nFull stack means the browser, the server, and the database each have a job.\nThe browser shows the UI and calls the API.\nThe server talks to the database and answers the browser.\n\nWhat the code is doing\nThe top line is the React app in the browser.\nfetch(\"/api/notes\") is the HTTP call down to Express.\nExpress is the server in the middle.\nSELECT * FROM notes is the query down to Postgres.\nThe arrows are one round trip for a list of notes.\n\nWatch out\nThe browser does not query Postgres itself in this picture.\nIf /api/notes is wrong, the database can be healthy and the UI still empty.",
      code: `Browser (React)
    |
    |  fetch("/api/notes")
    v
Server (Express)
    |
    |  SELECT * FROM notes
    v
Database (Postgres)`
    },
    {
      lang: "js",
      title: "2. Frontend: ask the server",
      desc: "What this is\nThe frontend asks the backend for data with fetch.\nThis function runs in the browser.\nawait pauses until the server answers.\n\nWhat the code is doing\nloadNotes is async so it can use await.\nfetch(\"/api/notes\") sends GET to that path on the same site.\nres.json() parses the JSON body into notes.\nconsole.log prints the list.\nloadNotes() at the bottom starts the request.\n\nWatch out\nA relative URL /api/notes goes to this site's server, not to a random host.\nIf you skip await, notes is a Promise, not the list.",
      code: `async function loadNotes() {
  const res = await fetch("/api/notes");
  const notes = await res.json();
  console.log(notes);
}

loadNotes();`
    },
    {
      lang: "js",
      title: "3. Backend: answer the browser",
      desc: "What this is\nThe backend route is what fetch calls.\napp.get registers GET /api/notes.\nres.json sends an array of note objects.\n\nWhat the code is doing\nThe path is /api/notes, matching the frontend fetch.\nThe handler does not read a database here.\nIt replies with two objects, each with id and title.\nThe browser receives JSON, not HTML.\n\nWatch out\nThis is a stub: real code would load rows, then json them.\nIf the path does not match including /api, the frontend call 404s.",
      code: `app.get("/api/notes", function (req, res) {
  res.json([
    { id: 1, title: "Buy milk" },
    { id: 2, title: "Learn React" }
  ]);
});`
    },
    {
      lang: "js",
      title: "4. Save a new note (both sides)",
      desc: "What this is\nCreating a note is two sides of one POST.\nThe browser sends a JSON body.\nThe server reads it and replies with the saved record.\n\nWhat the code is doing\nThe frontend fetch uses method POST and Content-Type application/json.\nJSON.stringify turns { title: \"New note\" } into a string body.\nexpress.json() on the backend fills req.body.\nThe POST handler reads req.body.title.\nIt replies with id 3 and that title.\n\nWatch out\nForgetting Content-Type or stringify means req.body.title is missing.\nPOST /api/notes is not the same route as GET /api/notes.",
      code: `// FRONTEND
await fetch("/api/notes", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "New note" })
});

// BACKEND
app.use(express.json());
app.post("/api/notes", function (req, res) {
  const title = req.body.title;
  res.json({ id: 3, title: title });
});`
    },
    {
      lang: "js",
      title: "5. Super simple login check",
      desc: "What this is\nLogin checks credentials and then answers ok or not.\n401 means the client is not allowed.\nThis sample compares plain strings to show the branch, not a real password store.\n\nWhat the code is doing\nThe handler reads email and password from req.body.\nThe if checks one hard-coded pair.\nOn match it sends { ok: true, name: \"Ada\" }.\nOn mismatch it sets status 401 and sends ok false with an error string.\n\nWatch out\nReal apps store a hash, not the password 1234 in source.\nSending 200 with ok false hides the failure from HTTP clients that only look at status.",
      code: `app.post("/api/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  if (email === "ada@test.com" && password === "1234") {
    res.json({ ok: true, name: "Ada" });
  } else {
    res.status(401).json({ ok: false, error: "Wrong email or password" });
  }
});`
    },
    {
      lang: "js",
      title: "6. Stop strangers (a lock on a route)",
      desc: "What this is\nA lock on a route is middleware that runs first.\nIf the request has no token, it answers 401 and stops.\nIf the token is present, next() runs the real handler.\n\nWhat the code is doing\nneedLogin reads req.headers.authorization.\nIf that header is missing, it returns a 401 JSON error.\nnext() runs only when the header exists.\napp.get(\"/api/me\", needLogin, ...) puts the lock in front of the handler.\nThe handler then sends { name: \"Ada\" }.\n\nWatch out\nA present header is not a verified user; this sample only checks that the badge exists.\nreturn before next() is what stops the request.",
      code: `function needLogin(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Please log in" });
  }
  next();
}

app.get("/api/me", needLogin, function (req, res) {
  res.json({ name: "Ada" });
});`
    },
    {
      lang: "sql",
      title: "7. Table to store users",
      desc: "What this is\nA table is the database's place to keep rows.\nSERIAL PRIMARY KEY makes an auto-increment id.\nUNIQUE on email rejects a second row with the same email.\n\nWhat the code is doing\nCREATE TABLE users starts the table.\nid is SERIAL PRIMARY KEY, so each insert gets a new number.\nemail is TEXT, UNIQUE, and NOT NULL.\nname is TEXT and NOT NULL.\nThose constraints are enforced by the database, not only by the app.\n\nWatch out\nUNIQUE is not the same as PRIMARY KEY; you can have only one primary key.\nNOT NULL means the column cannot be empty; omit it and nulls are allowed.",
      code: `CREATE TABLE users (
  id    SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name  TEXT NOT NULL
);`
    },
    {
      lang: "env",
      title: "8. .env file (settings)",
      desc: "What this is\nA .env file holds settings outside the source.\nPORT is which port the server listens on.\nDATABASE_URL is how the app finds Postgres.\n\nWhat the code is doing\nPORT=3000 sets the listen port.\nDATABASE_URL uses the postgres URL form with host localhost and database myapp.\nThe app reads these through process.env, not by opening the file in every module by hand.\n\nWatch out\nThis file should stay out of Git when it has real passwords.\nA missing DATABASE_URL is a config bug, not a SQL bug.",
      code: `PORT=3000
DATABASE_URL=postgres://localhost:5432/myapp`
    },
    {
      lang: "js",
      title: "9. Three UI states",
      desc: "What this is\nA screen that loads data has more than the success list.\nloading is true while the request is in flight.\nerror holds a message if the request failed.\nAn empty list is a fourth state, not an error.\n\nWhat the code is doing\nnotes starts as [].\nloading starts as true so the first paint can say Loading.\nerror starts as an empty string.\nThe comments list the JSX branches: loading, error, empty, then the list.\n\nWatch out\nLeaving loading true forever hides the list even after data arrives.\nTreating [] as an error will flash a failure on every successful empty mailbox.",
      code: `const [notes, setNotes] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

// then in JSX:
// if (loading) show "Loading..."
// if (error) show the error
// if notes.length === 0 show "No notes yet"
// else show the list`
    },
    {
      lang: "js",
      title: "10. Same error shape every time",
      desc: "What this is\nA shared error shape means every failure has the same field names.\nThe server sends message.\nThe browser reads message when the status is not ok.\n\nWhat the code is doing\nThe server uses status 400 and json { message: \"Title is required\" }.\nThe browser parses the body into data.\nif (!res.ok) runs when the status is 400 or other errors.\nalert shows data.message.\nSuccess paths skip that alert.\n\nWatch out\nIf one route sends error and another sends message, the UI has to guess.\nres.ok is false for 400 and 500; it is not a stand-in for a missing message field.",
      code: `// server
res.status(400).json({ message: "Title is required" });

// browser
const data = await res.json();
if (!res.ok) {
  alert(data.message);
}`
    }
  ]);

  add("sql", [
    {
      lang: "sql",
      title: "1. Make a table",
      desc: "Before you use this\nDecide what one row is — here, one student. Pick columns and types on paper. You need a SQL engine (Postgres, MySQL, or SQLite). This statement creates the empty table; it does not add Ada yet.\n\nWhat this is\nCREATE TABLE defines columns and their types.\nA table is named rows, not a spreadsheet file.\nPRIMARY KEY uniquely identifies each row.\n\nWhy we use it\nWithout a table, there is nowhere safe to INSERT. The PRIMARY KEY stops two students from sharing the same id. NOT NULL on name stops an empty person. Those rules live in the database even if your Node code has a bug.\n\nWhat the code is doing\nstudents is the table name.\nid is SERIAL PRIMARY KEY, so new rows get 1, 2, 3 automatically.\nname is TEXT and NOT NULL, so a row cannot skip it.\nmarks is INTEGER and may be empty unless you add NOT NULL.\n\nWatch out\nSERIAL is the auto number; you usually omit it in INSERT.\nTEXT and INTEGER are different types; storing marks as text breaks comparisons.",
      code: `CREATE TABLE students (
  id    SERIAL PRIMARY KEY,  -- auto number 1, 2, 3...
  name  TEXT NOT NULL,       -- must have a name
  marks INTEGER              -- a number
);`
    },
    {
      lang: "sql",
      title: "2. Add rows",
      desc: "Before you use this\nThe students table already exists from CREATE TABLE. INSERT does not make the table. It only adds people.\n\nWhat this is\nINSERT adds new rows.\nYou list the columns, then VALUES with one tuple per row.\nColumns you omit use defaults, such as SERIAL id.\n\nWhy we use it\nThis is how a signup or 'add student' button becomes a lasting row. Without INSERT, the table stays empty.\n\nWhat the code is doing\nINSERT INTO students names the table.\n(name, marks) is the column list, not including id.\nVALUES has two rows: Ada 90 and Grace 85.\nEach pair becomes one stored row.\n\nWatch out\nThe number of values in a tuple must match the column list.\nQuotes around Ada are text; 90 without quotes is a number.",
      code: `INSERT INTO students (name, marks)
VALUES
  ('Ada', 90),
  ('Grace', 85);`
    },
    {
      lang: "sql",
      title: "3. Read rows",
      desc: "Before you use this\nRows are already in the table. SELECT never changes data. You only ask questions.\n\nWhat this is\nSELECT reads rows.\n* means every column.\nWHERE filters which rows come back.\n\nWhy we use it\nEvery list page, login lookup, and report is a SELECT. We filter with WHERE so we do not ship the whole table to the browser.\n\nWhat the code is doing\nThe first query returns all columns for all students.\nThe second returns only name and marks.\nThe third returns name for rows where marks is at least 80.\nAda 90 would match that filter; a 70 would not.\n\nWatch out\nWHERE is not ORDER BY; it does not sort, it filters.\n= and >= are different tests; pick the one you mean.",
      code: `-- all students
SELECT * FROM students;

-- only some columns
SELECT name, marks FROM students;

-- only students with marks 80 or more
SELECT name FROM students
WHERE marks >= 80;`
    },
    {
      lang: "sql",
      title: "4. Change a row",
      desc: "Before you use this\nAda's row already exists. You are changing a score, not adding a new person (that would be INSERT).\n\nWhat this is\nUPDATE changes existing rows.\nSET names the new values.\nWHERE names which rows to change.\n\nWhy we use it\nEdit profile, change marks, mark a todo done — all UPDATE. The row id stays. Only the fields you SET change.\n\nWhat the code is doing\nThe table is students.\nSET marks = 95 writes the new score.\nWHERE name = 'Ada' limits the change to Ada's row.\nOther students keep their marks.\n\nWatch out\nWithout WHERE, every row in the table gets marks 95.\nThe string Ada needs quotes; an unquoted Ada would look like a column name.",
      code: `UPDATE students
SET marks = 95
WHERE name = 'Ada';`
    },
    {
      lang: "sql",
      title: "5. Delete a row",
      desc: "Before you use this\nGrace's row exists. DELETE removes data. The table (columns, types) stays. DROP TABLE would remove the table itself — different command.\n\nWhat this is\nDELETE removes rows that match WHERE.\nThere is no undo unless you have backups or a transaction you roll back.\n\nWhy we use it\nWe use DELETE when a row should be gone (account closed, todo removed). Prefer a WHERE on id, not on a name that two people could share.\n\nWhat the code is doing\nDELETE FROM students names the table.\nWHERE name = 'Grace' picks Grace's row.\nThat row is removed.\nAda and others remain.\n\nWatch out\nWithout WHERE, DELETE removes every row in the table.\nDELETE is not DROP TABLE; DROP would remove the table itself.",
      code: `DELETE FROM students
WHERE name = 'Grace';`
    },
    {
      lang: "sql",
      title: "6. Sort and take only a few",
      desc: "What this is\nORDER BY sorts the result.\nDESC means high to low for numbers.\nLIMIT stops after N rows.\n\nWhat the code is doing\nThe select list is name and marks.\nFROM students is the source.\nORDER BY marks DESC puts the highest marks first.\nLIMIT 3 keeps only the first three of those sorted rows.\n\nWatch out\nLIMIT without ORDER BY picks an undefined set of N rows.\nASC is the opposite of DESC and is the default if you omit the direction.",
      code: `SELECT name, marks
FROM students
ORDER BY marks DESC   -- high marks first
LIMIT 3;              -- only top 3`
    },
    {
      lang: "sql",
      title: "7. Two tables and a JOIN",
      desc: "Before you use this\nYou already have two tables: students (one person) and marks (one score). They share a key: marks.student_id must match students.id. That is why we created a primary key earlier.\n\nWhat this is\nJOIN combines rows from two tables that share a key.\nON says which columns must match.\nEach result row can contain columns from both tables.\n\nWhy we use it\nWe do not copy the student name onto every marks row. We store the name once, then JOIN when we need a report. That is the whole point of a relational database — facts live in one place, queries stitch them.\n\nWhat the code is doing\nmarks is a second table with student_id, subject, and score.\nThe SELECT lists students.name plus marks.subject and marks.score.\nFROM students JOIN marks starts the combination.\nON marks.student_id = students.id pairs a mark row with its student.\n\nWatch out\nIf student_id does not match any id, an inner JOIN drops that marks row.\nSelecting * after a join duplicates id-like columns and is harder to read.",
      code: `CREATE TABLE marks (
  student_id INTEGER,
  subject    TEXT,
  score      INTEGER
);

SELECT students.name, marks.subject, marks.score
FROM students
JOIN marks ON marks.student_id = students.id;`
    },
    {
      lang: "sql",
      title: "8. Count groups",
      desc: "What this is\nGROUP BY collapses rows that share a value.\nCOUNT(*) counts how many rows landed in each group.\nThe extra column needs an alias if you want a clear name.\n\nWhat the code is doing\nSELECT subject, COUNT(*) AS total picks the subject and the count.\nFROM marks is the source.\nGROUP BY subject makes one result row per subject.\ntotal is the alias for the count.\n\nWatch out\nSelecting a column that is not in GROUP BY and not aggregated is invalid in strict SQL.\nCOUNT(*) counts rows, not unique values, unless you write COUNT(DISTINCT ...).",
      code: `SELECT subject, COUNT(*) AS total
FROM marks
GROUP BY subject;`
    },
    {
      lang: "sql",
      title: "9. Empty value is NULL",
      desc: "What this is\nNULL means the value is missing.\nIS NULL tests for that missing value.\n= NULL is not the test you want.\n\nWhat the code is doing\nThe query selects name from students.\nWHERE marks IS NULL keeps rows with no marks stored.\nStudents with 0 marks are different; 0 is a number, not NULL.\n\nWatch out\nWHERE marks = NULL does not find NULL rows in SQL.\nIS NOT NULL is the opposite test.",
      code: `SELECT name
FROM students
WHERE marks IS NULL;`
    },
    {
      lang: "js",
      title: "10. Safe query from Node",
      desc: "Before you use this\nThe id comes from the URL or the request. It is user input. You already know SELECT. Now you must keep that id out of the SQL text.\n\nWhat this is\nA parameterized query keeps user values out of the SQL text.\n$1 is a placeholder for the first bound value.\nThe driver sends the SQL and the values separately.\n\nWhy we use it\nIf you glue id into the string, a hostile value can add extra SQL and dump the table. That is injection — still one of the worst web bugs. Parameters are why we can safely take input from the browser.\n\nWhat the code is doing\ndb.query runs the SELECT.\nWHERE id = $1 is the placeholder, not string addition.\n[id] is the array of values; id fills $1.\nThe commented line concatenates id into the string, which is the dangerous pattern.\n\nWatch out\nNever build SQL with + or template strings from user input.\n$1 is specific to this driver style; other libraries use ? or named keys.",
      code: `// good
const result = await db.query(
  "SELECT * FROM students WHERE id = $1",
  [id]
);

// bad (dangerous)
// "SELECT * FROM students WHERE id = " + id`
    }
  ]);

  add("mongodb", [
    {
      lang: "js",
      title: "1. A document is a box of fields",
      desc: "Before you use this\nIf you know a JavaScript object, you already know a document. You do not write CREATE TABLE. Still decide what one document means (one student). You need a running MongoDB or Atlas URL, and a collection name — here, students.\n\nWhat this is\nMongoDB stores documents, not spreadsheet rows. A document is one object with fields (name, marks, city). The object you save is the shape.\n\nWhy we use it\nWe use Mongo when the thing you load is already an object and the shape can change. Ada has marks. Raj does not. Both are valid. A SQL table would force a marks column on everyone, even if you store NULL.\n\nWhat the code is doing\nstudent is one JavaScript object: Ada, 90, Pune. insertOne writes that object into the students collection. Mongo adds an _id if you do not send one. A second student can skip marks — that field is simply missing, not a SQL NULL column.\n\nAlso know\nA collection is the group of documents (like a table name). Think: one student = one document. The whole class = one collection. You query with find({ city: \"Pune\" }), not SELECT * FROM.\n\nWatch out\nTwo documents in the same collection can have different fields. That is allowed. Your read code must handle a missing field. Do not assume every student has marks.",
      code: `const student = {
  name: "Ada",   // field
  marks: 90,     // field
  city: "Pune"   // field
};

await db.collection("students").insertOne(student);  // save the document

const other = { name: "Raj", city: "Delhi" };  // no marks — still valid
await db.collection("students").insertOne(other);`
    },
    {
      lang: "js",
      title: "2. Connect from Node",
      desc: "Before you use this\nMongoDB must be running (local or Atlas). You do not CREATE TABLE. You still pick a database name — here, school. Default port is 27017.\n\nWhat this is\nmongoose.connect opens a connection to a MongoDB database.\nThe URL includes host, port, and database name.\nYou wait for connect before you query.\n\nWhy we use it\nEvery insert and find needs one shared connection, not a new one per request. The URL is how Node finds the engine, the same idea as a Postgres DATABASE_URL.\n\nWhat the code is doing\nrequire loads mongoose.\nstart is async so it can await connect.\nThe URL points at 127.0.0.1 port 27017 and database school.\nAfter it succeeds, the log prints Connected.\nstart() at the bottom kicks it off.\n\nWatch out\nThe database name is the last path segment, school, not the hostname.\nIf Mongo is not running, await connect throws instead of printing Connected.",
      code: `const mongoose = require("mongoose");

async function start() {
  await mongoose.connect("mongodb://127.0.0.1:27017/school");
  console.log("Connected");
}

start();`
    },
    {
      lang: "js",
      title: "3. Make a simple model",
      desc: "What this is\nA schema lists the fields Mongoose should expect.\nA model is the constructor you call to create and query documents.\nThe model name maps to a collection.\n\nWhat the code is doing\nstudentSchema has name as String and marks as Number.\nmongoose.model(\"Student\", studentSchema) builds the Student model.\nLater lines will call Student.create and Student.find.\nThe schema is the shape; the model is the tool.\n\nWatch out\nString and Number here are Mongoose types, not TypeScript types.\nThe collection name is derived from the model name unless you override it.",
      code: `const studentSchema = new mongoose.Schema({
  name: String,
  marks: Number
});

const Student = mongoose.model("Student", studentSchema);`
    },
    {
      lang: "js",
      title: "4. Add one student",
      desc: "What this is\ncreate inserts one document and returns the saved object.\nMongo assigns _id if you do not supply one.\nawait waits until the write finishes.\n\nWhat the code is doing\nStudent.create is called with name Ada and marks 90.\nstudent holds the saved document.\nconsole.log prints student._id, the id Mongo generated.\nYou did not set _id in the argument object.\n\nWatch out\ncreate fails validation if the schema requires a field you omitted.\n_id is not the same as a SQL SERIAL you pick yourself, unless you set it.",
      code: `const student = await Student.create({
  name: "Ada",
  marks: 90
});

console.log(student._id);  // Mongo makes this id for you`
    },
    {
      lang: "js",
      title: "5. Find students",
      desc: "What this is\nfind returns an array of matching documents.\nfindOne returns one document or null.\nThe object you pass is the filter.\n\nWhat the code is doing\nStudent.find() with no filter loads all students into all.\nfindOne({ name: \"Ada\" }) loads the first Ada.\nfind({ marks: { $gte: 80 } }) loads students with marks 80 or higher.\n$gte is the operator for greater than or equal.\n\nWatch out\nfind always gives an array, even for one match; findOne does not.\n{ marks: 80 } is equality; { $gte: 80 } is a range.",
      code: `// all students
const all = await Student.find();

// only Ada
const ada = await Student.findOne({ name: "Ada" });

// marks 80 or more
const good = await Student.find({ marks: { $gte: 80 } });`
    },
    {
      lang: "js",
      title: "6. Update and delete",
      desc: "What this is\nupdateOne changes fields on matching documents.\ndeleteOne removes matching documents.\n$set names the fields to change without replacing the whole document.\n\nWhat the code is doing\nupdateOne's first argument { name: \"Ada\" } is the filter.\nThe second argument { $set: { marks: 95 } } sets marks to 95.\ndeleteOne({ name: \"Ada\" }) removes that document.\nBoth calls are awaited.\n\nWatch out\nOmitting $set can replace the document in ways you did not mean, depending on the API.\nupdateOne without a filter match updates nothing; it does not throw just because the name is new.",
      code: `await Student.updateOne(
  { name: "Ada" },
  { $set: { marks: 95 } }
);

await Student.deleteOne({ name: "Ada" });`
    },
    {
      lang: "js",
      title: "7. A document looks like this",
      desc: "What this is\nA stored document is JSON-like text with fields.\n_id is the primary identifier Mongo added.\nThe other keys are the fields you saved.\n\nWhat the code is doing\nThe object shows _id as a short placeholder string.\nname is Ada.\nmarks is 90.\nThat is the shape findOne would give you after a create.\n\nWatch out\n_id is an ObjectId in real results, not always a short string.\nThere is no separate column list; what you see is the document.",
      code: `{
  "_id": "66f1...",
  "name": "Ada",
  "marks": 90
}`
    },
    {
      lang: "js",
      title: "8. Nested data (address inside student)",
      desc: "What this is\nA field can hold a nested object.\nYou query nested fields with a dotted path.\nThe parent document still has one _id.\n\nWhat the code is doing\ncreate saves Ada with address.city Pune and address.pin 411001.\naddress is an object inside the student document.\nfindOne({ \"address.city\": \"Pune\" }) matches that nested city.\ns holds the found student.\n\nWatch out\nThe filter key is \"address.city\" as one string, not a nested JavaScript object unless you write it that way on purpose.\nUpdating pin later still lives under address, not as a top-level pin unless you add one.",
      code: `await Student.create({
  name: "Ada",
  address: {
    city: "Pune",
    pin: "411001"
  }
});

const s = await Student.findOne({ "address.city": "Pune" });`
    },
    {
      lang: "js",
      title: "9. Make email unique",
      desc: "What this is\nunique: true on a path builds a unique index.\nTwo documents cannot store the same email.\nThe database enforces that on write.\n\nWhat the code is doing\nuserSchema defines email as a String with unique true.\nThat option is on the field config object, not a separate SQL constraint line.\nWhen you compile a model from this schema, Mongoose will create the index.\n\nWatch out\nunique does not merge duplicates that already exist; you must clean those first.\nunique is not the same as required; an email can still be missing unless you also set required.",
      code: `const userSchema = new mongoose.Schema({
  email: { type: String, unique: true }
});`
    },
    {
      lang: "js",
      title: "10. Count how many",
      desc: "What this is\ncountDocuments returns how many documents match a filter.\nWith no filter it counts the whole collection.\nThe result is a number, not a list.\n\nWhat the code is doing\nStudent.countDocuments() is awaited.\ntotal holds that number.\nconsole.log prints it.\nThere is no projection of name or marks here, only the count.\n\nWatch out\ncountDocuments is not find().length in your app memory; it is counted in the database.\nA filter you forget to pass counts everyone, not the subset you had in mind.",
      code: `const total = await Student.countDocuments();
console.log(total);`
    }
  ]);

  add("git", [
    { lang: "js", title: "1. What Git stores", desc: "What this is\nGit stores snapshots of files, not a live folder magically.\nYou move work through working files, staging, then committed history.\nEach snapshot is a commit.\n\nWhat the code is doing\nworking is the object you are typing, here app.js with hello.\nstaging is the set you chose for the next save, the same app.js.\nrepo is an array of finished snapshots.\nThe first commit c1 has message first save and files with hi.\n\nWatch out\nStaging is not a second copy on disk you edit separately; it is the list of what the next commit will include.\nA file can be changed in working after you staged an older version.", code: `// picture of Git (not commands)
working = { "app.js": "hello" };     // you are typing
staging = { "app.js": "hello" };     // you chose this for the next save
repo    = [                          // history of finished saves
  { id: "c1", message: "first save", files: { "app.js": "hi" } }
];` },
    { lang: "js", title: "2. A commit is a snapshot", desc: "What this is\nA commit is a snapshot of the project at one moment.\nIt has an id, a message, a parent, and the file contents.\nOld snapshots stay; a new save is a new snapshot.\n\nWhat the code is doing\ncommit has id a1b2.\nmessage is Add hello text.\nparent is c1, the snapshot before this one.\nfiles records app.js as hello.\nThe comment says Git does not edit an old photo.\n\nWatch out\nChanging a file after this commit does not rewrite a1b2.\nparent is how history chains; a commit with no parent is a root.", code: `const commit = {
  id: "a1b2",
  message: "Add hello text",
  parent: "c1",
  files: { "app.js": "hello" }
};
// Git never edits an old photo. A new save is a new photo.` },
    { lang: "js", title: "3. A branch is a sticky note", desc: "What this is\nA branch is a name that points at one commit.\nHEAD is which branch you are on.\nWhen you commit, that name moves to the new snapshot.\n\nWhat the code is doing\nbranches.main points at c1.\nbranches.login points at c3, extra work.\nHEAD is login, so you are standing on the login name.\nNew commits on login move that pointer, not main, until you merge.\n\nWatch out\nA branch is not a full extra copy of every file by itself; it is a pointer plus the commits it can reach.\nDetached HEAD means you are pointing at a commit id, not a branch name.", code: `const branches = {
  main: "c1",
  login: "c3"   // extra work lives here
};
const HEAD = "login"; // you are standing on the login sticky note` },
    { lang: "js", title: "4. Remote is a copy", desc: "What this is\nA remote is another copy of the repository, often on GitHub.\npush sends commits the remote does not have.\nfetch downloads commit data; pull also updates your branch.\n\nWhat the code is doing\nlaptop.repo has c1 and c2.\ngithub.repo has only c1.\nThe comments map push, fetch, and pull to those albums.\nUntil you push, c2 lives only on the laptop.\n\nWatch out\nfetch does not merge into your branch by itself.\npull is fetch plus integrate; it is not a synonym for clone.", code: `laptop.repo = ["c1", "c2"];
github.repo = ["c1"];        // not updated yet
// push  = send missing photos to GitHub
// fetch = look at GitHub photos
// pull  = look + add them into your branch` },
    { lang: "txt", title: "5. What .gitignore means", desc: "What this is\n.gitignore lists paths Git should not track.\nThose files can still exist on disk.\nThey will not be in commits if the ignore matches.\n\nWhat the code is doing\nnode_modules/ is the huge installed package folder.\n.env holds secrets.\n.DS_Store is machine junk.\nThe array is the do-not-save list.\n\nWatch out\nIgnoring a file that is already tracked does not untrack it; you have to remove it from the index too.\n.env belongs here so passwords do not enter history.", code: `do_not_save = [
  "node_modules/",   // huge downloaded folder
  ".env",            // secrets
  ".DS_Store"        // computer junk
];` },
    { lang: "txt", title: "6. A merge conflict file", desc: "What this is\nA merge conflict means both sides changed the same lines.\nGit writes both versions into the file with marks.\nYou delete the marks and keep the final text.\n\nWhat the code is doing\nThe first block is your-branch's title My site.\nThe ======= line splits the two versions.\nThe second block is main's title Our site.\nThe comment says remove the marks and keep one title so the commit can finish.\n\nWatch out\nLeaving the <<<<<<< marks in the file ships broken source.\nThe conflict is in the file contents; resolving it is an edit, then a commit.", code: `<<<<<<< your-branch
title = "My site";
=======
title = "Our site";
>>>>>>> main
// delete the marks. keep one title. then the save can finish.` },
    { lang: "js", title: "7. Undo ideas (what they mean)", desc: "What this is\nUndo in Git is several different goals.\nTaking a file out of staging is not the same as deleting your edits.\nReversing a commit on a shared branch should add a new commit, not rewrite published history.\n\nWhat the code is doing\nThe first comment is unstage: drop from staging, keep the working text.\nThe second is discard uncommitted edits: put the file back to the last snapshot.\nThe third is undo a save on main: make a new snapshot that reverses it.\nNone of these lines is a command list; they are the outcomes.\n\nWatch out\nThe same English word undo maps to different operations.\nRewriting a commit others already pulled causes duplicate or missing history for them.", code: `// I staged a file too soon     -> take it out of staging, keep the typing
// I hate these unsaved edits  -> put the file back to the last photo
// I want to undo a save on main -> make a NEW photo that reverses it` },
    { lang: "js", title: "8. Git vs GitHub", desc: "What this is\nGit is the version tool on your computer.\nGitHub is a website that hosts a copy and adds review.\nYou can use Git with no GitHub account.\n\nWhat the code is doing\nThe first line names Git as the local camera and album.\nThe second names GitHub as the hosted copy and review place.\nThe comment says the camera works with no website.\nPush is how the two copies meet when you choose to publish.\n\nWatch out\nA GitHub URL is not Git itself; clone uses Git to copy from that host.\nIssues and pull requests are website features, not core Git objects.", code: `Git    = camera + photo album on your computer
GitHub = website that stores a copy and lets people review
// you can use the camera with no website` },
    { lang: "js", title: "9. A pull request is a conversation", desc: "What this is\nA pull request asks to add one branch's commits onto another.\nfrom and into name the branches.\nChecks are extra gates such as tests and review.\n\nWhat the code is doing\npr.from is login, the work branch.\npr.into is main, the target.\nquestion is the human ask, Please add my login work.\nchecks lists tests green and one friend reviewed.\nMerging happens after people accept that ask.\n\nWatch out\nOpening a pull request does not merge by itself.\nThe branch names must exist on the remote the host uses.", code: `const pr = {
  from: "login",
  into: "main",
  question: "Please add my login work",
  checks: ["tests green", "one friend reviewed"]
};` },
    { lang: "txt", title: "10. A good save message", desc: "What this is\nA commit message is a note to future readers.\nIt should say why the change exists.\nShort junk messages hide that reason.\n\nWhat the code is doing\nThe good line explains that login check blocks guests from /me.\nThe first bad line is only update, which names no reason.\nThe second bad line is asdf, which names nothing.\nReaders of git log need the good shape.\n\nWatch out\nThe message is not the same as the file diff; the diff is what changed, the message is why.\nRewriting messages of commits already pushed rewrites public history.", code: `Good:  Add login check so guests cannot see /me
Bad:   update
Bad:   asdf` }
  ]);

  add("linux", [
    { lang: "js", title: "1. Folders are a tree", desc: "What this is\nThe filesystem is a tree of folders.\nYou always have a current directory.\nPaths start from / at the root.\n\nWhat the code is doing\ntree[\"/\"] has home and var.\nUnder home.nitin.notes is hello.txt with Hi.\nhere is /home/nitin, the current folder.\nOther files exist but you are not standing in them.\n\nWatch out\nA relative name like notes is from here, not always from /.\n/home and home without the slash are different starting points.", code: `tree = {
  "/": {
    home: { nitin: { notes: { "hello.txt": "Hi" } } },
    var: { log: {} }
  }
};
here = "/home/nitin";` },
    { lang: "js", title: "2. A file has a name and permission", desc: "What this is\nEvery file has an owner and permission bits.\nr is read, w is write, x is execute or enter a folder.\nOwner, group, and others each have a set of those bits.\n\nWhat the code is doing\nfile.name is hello.txt.\nowner is nitin.\ncan.owner is rw-, so the owner can read and write but not execute.\ngroup and others are r--, read only.\nThe comment restates r, w, and x.\n\nWatch out\nx on a folder means you can enter it, not that the folder is a program.\nchmod numbers are just another way to write these bits.", code: `const file = {
  name: "hello.txt",
  owner: "nitin",
  can: { owner: "rw-", group: "r--", others: "r--" }
};
// r = read, w = write, x = run / enter folder` },
    { lang: "js", title: "3. A process is a running program", desc: "What this is\nA process is a running program with an id.\npid is that id.\nTwo processes cannot both listen on the same port.\n\nWhat the code is doing\nprocess.pid is 4421.\nname is node.\nusing lists port 3000 and file app.js.\nThe comment says if two apps want the same port, one must stop.\n\nWatch out\nThe pid is not the port; 4421 is the process, 3000 is the door.\nKilling the wrong pid stops a different program.", code: `const process = {
  pid: 4421,
  name: "node",
  using: ["port 3000", "file app.js"]
};
// if two apps want the same port, one must stop` },
    { lang: "txt", title: "4. stdin / stdout / stderr", desc: "What this is\nA process has three standard streams.\nstdin is input, stdout is normal output, stderr is errors.\nA pipe can send stdout into the next program.\n\nWhat the code is doing\nstdin is what you type in.\nstdout is normal answers.\nstderr is error messages.\nThe comment notes you can pipe stdout to the next program.\n\nWatch out\nstderr still prints when you redirect stdout only.\nMixing them up makes errors look like success data.", code: `stdin  = what you type in
stdout = normal answers
stderr = error messages
// you can send stdout into the next program (a pipe)` },
    { lang: "js", title: "5. A tiny script is just steps", desc: "What this is\nA script is a list of steps the computer runs in order.\nA function here groups those steps under a name.\nCalling the function runs them.\n\nWhat the code is doing\nhello prints Hello.\nIt then prints Today is a date.\nhello() at the bottom runs those two prints.\nExecution is top to bottom inside the function.\n\nWatch out\nDefining hello does not print until you call it.\nA real shell script would use echo; this snippet is the idea of ordered steps.", code: `function hello() {
  print("Hello");
  print("Today is a date");
}
hello();` },
    { lang: "js", title: "6. Environment values", desc: "What this is\nEnvironment variables are settings the process can read.\nThey are not source files.\nThe program should read them instead of hard-coding secrets.\n\nWhat the code is doing\nenv.PORT is 3000 as text.\nenv.DATABASE_URL is labeled secret here.\nThe comment says the program reads env.PORT instead of writing 3000 in the code.\nThat lets each machine supply its own values.\n\nWatch out\nPORT is a string in the environment, not automatically a number.\nPrinting DATABASE_URL in logs leaks the secret.", code: `const env = {
  PORT: "3000",
  DATABASE_URL: "secret"
};
// the program reads env.PORT instead of writing 3000 in the code` },
    { lang: "txt", title: "7. A service is a program that should stay up", desc: "What this is\nA service is a program the machine should keep running.\nIf it crashes, the supervisor starts it again.\nLogs are collected so you can read them later.\n\nWhat the code is doing\nservice my-api names the unit.\nrun is node index.js.\nfolder is /var/www/api.\nrestart is when it crashes.\nlogs are collected for you.\n\nWatch out\nA service is not the same as a one-off command in a terminal that dies when you log out.\nIf restart is on and the app crash-loops, the machine will keep restarting it.", code: `service my-api:
  run: node index.js
  folder: /var/www/api
  restart: when it crashes
  logs: collected for you` },
    { lang: "js", title: "8. Disk full = apps break", desc: "What this is\nWhen the disk is nearly full, writes fail and apps look randomly broken.\nused and free describe that pressure.\nLogs and uploads are common fillers.\n\nWhat the code is doing\ndisk.used is 95%.\ndisk.free is 2 GB.\nThe if checks whether used is over 90%.\nThe comment points at logs or uploads as likely causes.\n\nWatch out\nA full disk can break databases and logs, not only new file uploads.\nClearing files you still need is worse than finding the growth first.", code: `disk = { used: "95%", free: "2 GB" };
if (disk.used > "90%") {
  // logs or uploads may have filled the disk
}` },
    { lang: "js", title: "9. A port is a door number", desc: "What this is\nA port is a number on which a program listens.\nThe host has many doors; each listener takes one.\n\"address already in use\" means that door is taken.\n\nWhat the code is doing\ndoors[22] is remote login.\ndoors[80] is the website.\ndoors[3000] is the node app.\nThe comment states the busy-door error.\n\nWatch out\nThe port is not the pid; stopping the process that holds the port frees it.\nBinding 3000 on localhost is not the same as opening 3000 on the public network.", code: `doors = {
  22: "remote login",
  80: "website",
  3000: "my node app"
};
// "address already in use" means that door is taken` },
    { lang: "txt", title: "10. Keys vs passwords", desc: "What this is\nSSH keys come in a public and private pair.\nThe public key can live on the server.\nThe private key stays on your machine and must not be shared.\n\nWhat the code is doing\npublic_key is labeled as something you may put on the server.\nprivate_key is labeled never share this file.\nThe comment says the server checks the public key while you keep the private key.\nLogin proves you hold the matching private key.\n\nWatch out\nCopying the private key into chat or Git is a credential leak.\nThe public key is not a password you type; the private key does the proof.", code: `public_key  = "you may put this on the server"
private_key = "never share this file"
// the server checks the public key, you keep the private key` }
  ]);

  add("docker", [
    {
      lang: "txt",
      title: "1. Image vs container (easy words)",
      desc: "What this is\nAn image is a saved recipe for a filesystem and a start command.\nA container is a running instance of that image.\nOne image can start many containers.\n\nWhat the code is doing\nimage is labeled recipe, saved, does not run.\ncontainer is labeled the cake, a running copy.\nThe comment says many cakes can come from one recipe.\nDeleting a container does not delete the image.\n\nWatch out\nChanging a running container does not change the image until you commit or rebuild.\ndocker run starts a container; it does not edit the recipe file.",
      code: `Image      = the cake recipe (saved)
Container  = the cake you baked (running)

docker build  -> make the image
docker run    -> start a container`
    },
    {
      lang: "dockerfile",
      title: "2. Easiest Dockerfile for Node",
      desc: "What this is\nA Dockerfile is the text recipe for an image.\nEach instruction adds a layer.\nFROM, WORKDIR, COPY, RUN, and CMD are the steps here.\n\nWhat the code is doing\nFROM node:20 starts from a Node base image.\nWORKDIR /app sets the working directory.\nCOPY package.json . copies the dependency list.\nRUN npm install installs packages at build time.\nCOPY . . copies the app, then CMD starts node index.js when a container starts.\n\nWatch out\nRUN happens at build; CMD happens at start.\nCopying package.json before the rest of the files lets install stay cached when only app code changes.",
      code: `FROM node:20
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "index.js"]`
    },
    {
      lang: "txt",
      title: "3. Ports in easy words",
      desc: "What this is\nPort publish maps a port on your machine to a port in the container.\nThe app still listens inside the container.\nThe browser talks to localhost on your machine.\n\nWhat the code is doing\nThe first line shows laptop port 3000 leading to container port 3000.\nThat inner port is the Node app.\nThe comment says the browser still opens http://localhost:3000.\nWithout that map, the app can run and still be unreachable from the host browser.\n\nWatch out\n3000:3000 is host then container; swapping them by accident binds the wrong door.\nThe app must listen on the container port you published.",
      code: `your laptop :3000  -->  container :3000  -->  Node app
// the browser still opens http://localhost:3000`
    },
    {
      lang: "txt",
      title: "4. Make a .dockerignore file",
      desc: "What this is\n.dockerignore lists paths not to send to the build context.\nThose files then cannot be COPY'd from the client context.\nSecrets and huge folders belong on this list.\n\nWhat the code is doing\nnode_modules is listed so the host install is not packed in.\n.git is listed so history is not packed in.\n.env is listed so secrets are not packed in.\nThe array is the do-not-copy list.\n\nWatch out\nIgnoring .env does not remove a secret you already COPY'd in an earlier image layer.\nnode_modules inside the image should come from RUN install, not from the host folder.",
      code: `node_modules
.git
.env`
    },
    {
      lang: "yaml",
      title: "5. App + database together (Compose)",
      desc: "What this is\nCompose describes more than one container as one project.\nservices lists those containers.\nOne service can build from a Dockerfile; another can pull an image.\n\nWhat the code is doing\napp.build . means build from the Dockerfile in this folder.\napp.ports 3000:3000 publishes the app.\ndb.image postgres:16 pulls that database image.\nPOSTGRES_PASSWORD is set in the db environment.\nTogether they are one compose file.\n\nWatch out\nThe app still needs a connection string to reach db; listing both services does not auto-wire SQL.\nPasswords in compose files are still secrets; do not commit real ones.",
      code: `services:
  app:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret`
    },
    {
      lang: "txt",
      title: "6. Data must live in a volume",
      desc: "What this is\nA volume keeps files on the host side of Docker's storage.\nThe container's writable layer is thrown away when the container is removed.\nDatabase files need a volume or named box.\n\nWhat the code is doing\nThe bad line is database files only inside the container.\nThe good line is a volume, a named box on your disk.\nThe comment says the container opens the box each time it starts.\nWithout that, compose down and remove can drop the data.\n\nWatch out\nA volume is not the same as publishing a port.\nPutting data in the image is also wrong; images should stay replaceable.",
      code: `Bad:  database files only inside the container
Good: volume = a named box on your disk
// the container opens the box each time it starts`
    },
    {
      lang: "dockerfile",
      title: "7. CMD is the start button",
      desc: "What this is\nCMD is the default process a container runs.\nThe list form runs the program directly, not through a shell.\nThat process should receive stop signals.\n\nWhat the code is doing\nCMD [\"node\", \"index.js\"] starts Node on index.js.\nThe comment says this program is the main process.\nWhen Docker sends stop, that process should close.\nA shell wrapper can swallow signals if you use the wrong form.\n\nWatch out\nCMD is not RUN; RUN is build time.\nIf CMD exits, the container exits.",
      code: `CMD ["node", "index.js"]
// this program is the main process
// when Docker says stop, this program should close nicely`
    },
    {
      lang: "txt",
      title: "8. Layers are stacked sheets",
      desc: "What this is\nImage layers stack; each instruction is a sheet.\nUnchanged early sheets can be reused from cache.\nFiles that change often should be copied late.\n\nWhat the code is doing\nSheet 1 is FROM node.\nSheet 2 is COPY package.json plus npm install, which you want cached.\nSheet 3 is COPY your code, which changes often.\nA change in sheet 3 does not redo sheet 2 when the recipe is written this way.\n\nWatch out\nEditing package.json busts the install layer on purpose.\nCOPY . . too early makes every code edit redo npm install.",
      code: `# sheet 1: FROM node
# sheet 2: COPY package.json + npm install   <- cache this
# sheet 3: COPY your code                    <- this changes often`
    },
    {
      lang: "txt",
      title: "9. Keep database files",
      desc: "What this is\nA volume keeps database files outside the container's writable layer.\nIf files live only inside the container, they vanish when that container is removed.\npgdata is a named box on the disk.\n\nWhat the code is doing\nThe bad line is database files only inside the container.\nThe good line says save them in a volume, a named box on your disk.\nvolumes: then names pgdata.\nThe database container should mount that name on its data directory.\n\nWatch out\nPublishing a port does not save files; only a volume or bind mount does.\ncompose down without a volume is a data wipe for that database.",
      code: `Bad:  database files only inside the container
Good: save them in a volume (a named box on your disk)

volumes:
  pgdata:`
    },
    {
      lang: "dockerfile",
      title: "10. Do not run as the boss (optional later)",
      desc: "What this is\nContainers often default to a root user inside.\nUSER switches to a named user before CMD.\nA compromised app then has fewer privileges.\n\nWhat the code is doing\nUSER node selects the node user.\nCMD still starts node index.js.\nThe comment says if the app is hacked, the attacker is not the boss.\nThis line belongs after the files are in place with the right ownership.\n\nWatch out\nUSER does not fix a secret you baked into the image.\nIf files are owned by root and not readable by node, the app fails at start.",
      code: `USER node
CMD ["node", "index.js"]`
    }
  ]);

  add("kubernetes", [
    {
      lang: "txt",
      title: "1. Easy words",
      desc: "What this is\nKubernetes keeps a desired number of copies of your app running.\nA Pod is one running place, usually one container.\nA Deployment asks for N copies; a Service gives them a stable name.\n\nWhat the code is doing\nPod is labeled one running app.\nDeployment is labeled please keep 3 copies.\nService is labeled a stable name so others can find the copies.\nThose three objects are the core picture.\n\nWatch out\nA Service is not a second container; it is a stable address in front of Pods.\nIf you only create a Pod, nothing restarts a replacement when it dies unless a controller owns it.",
      code: `Pod         = 1 running app (usually 1 container)
Deployment  = "please keep 3 copies of my app"
Service     = a stable name so others can find the pods
kubectl     = the command to talk to the cluster`
    },
    {
      lang: "yaml",
      title: "2. Smallest Deployment",
      desc: "What this is\nA Deployment is a controller that owns Pods.\nreplicas is how many copies to keep.\nThe template is the Pod recipe, including the image.\n\nWhat the code is doing\nkind Deployment names the object type.\nmetadata.name is my-app.\nreplicas 2 asks for two Pods.\nselector.matchLabels app my-app must match the template labels.\nThe container image is nginx, listening on containerPort 80.\n\nWatch out\nIf the selector does not match the template labels, the Deployment cannot manage the Pods.\nreplicas is a count, not a percentage.",
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: nginx
          ports:
            - containerPort: 80`
    },
    {
      lang: "yaml",
      title: "3. Smallest Service",
      desc: "What this is\nA Service is a stable name and port in the cluster.\nselector finds Pods by labels.\nport is the port the Service exposes.\n\nWhat the code is doing\nkind Service names the object.\nmetadata.name is my-app.\nselector app my-app must match Pod labels.\nports lists port 80.\nOther apps can use the name my-app and that port.\n\nWatch out\nA Service with the wrong selector points at no Pods and traffic goes nowhere.\nport on the Service is not automatically containerPort unless you also set targetPort.",
      code: `apiVersion: v1
kind: Service
metadata:
  name: my-app
spec:
  selector:
    app: my-app
  ports:
    - port: 80`
    },
    {
      lang: "bash",
      title: "4. Apply and look",
      desc: "What this is\napply sends a manifest to the cluster.\nget lists objects.\nlogs prints a container's stdout.\n\nWhat the code is doing\nkubectl apply -f app.yaml creates or updates from the file.\nkubectl get pods lists Pods.\nkubectl get services lists Services.\nkubectl logs deploy/my-app prints logs from the Deployment's Pods.\n\nWatch out\napply is not the same as running a container on your laptop.\nIf the file is invalid YAML, apply fails before anything is created.",
      code: `kubectl apply -f app.yaml
kubectl get pods
kubectl get services
kubectl logs deploy/my-app`
    },
    {
      lang: "bash",
      title: "5. If a pod is broken",
      desc: "What this is\nWhen a Pod is broken, you inspect it; you do not guess.\ndescribe shows events and conditions.\nlogs prints output; --previous is the last crashed container.\n\nWhat the code is doing\nget pods lists names and status.\ndescribe pod POD_NAME shows events such as image pull errors.\nlogs POD_NAME shows the current container printout.\nlogs --previous shows the printout from the previous instance after a crash.\n\nWatch out\nPOD_NAME must be a real pod name from get, not the Deployment name unless you use deploy/.\ndescribe events are often the reason; logs are empty if the container never started.",
      code: `kubectl get pods
kubectl describe pod POD_NAME
kubectl logs POD_NAME
kubectl logs POD_NAME --previous`
    },
    {
      lang: "yaml",
      title: "6. Is the app alive? (easy probe)",
      desc: "What this is\nA liveness probe asks whether the process should be restarted.\nhttpGet calls a path on a port.\nRepeated failure leads Kubernetes to restart the container.\n\nWhat the code is doing\nlivenessProbe starts the probe block.\nhttpGet uses path /health.\nport 3000 is where the app serves that path.\nIf /health fails, the container is eligible to restart.\n\nWatch out\nA probe on a path that is slow to start will kill the app during boot unless you set delays.\nLiveness is not readiness; killing a busy app is not the same as stopping traffic.",
      code: `livenessProbe:
  httpGet:
    path: /health
    port: 3000`
    },
    {
      lang: "yaml",
      title: "7. Settings that are not secrets",
      desc: "What this is\nA ConfigMap holds non-secret settings as keys and values.\nYour app often reads them as environment variables.\nThe object is YAML in the cluster.\n\nWhat the code is doing\nkind ConfigMap names the object.\nmetadata.name is my-settings.\ndata.MESSAGE is hello.\nThat key can be mounted or injected into a Pod.\n\nWatch out\nConfigMap is the wrong place for passwords.\nChanging a ConfigMap does not always restart Pods unless you wired a hash or restart.",
      code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: my-settings
data:
  MESSAGE: "hello"`
    },
    {
      lang: "yaml",
      title: "8. A password (Secret)",
      desc: "What this is\nA Secret holds sensitive strings.\nThe YAML shape looks like a ConfigMap.\nYou still keep real values out of Git when you can.\n\nWhat the code is doing\nkind Secret names the object.\nmetadata.name is my-secret.\nstringData.PASSWORD is change-me, a placeholder.\nstringData lets you write the value in plain text in the file before it is stored.\n\nWatch out\nA Secret in a Git repo is still a leaked password.\nstringData is convenience; the object is still sensitive at rest in the cluster.",
      code: `apiVersion: v1
kind: Secret
metadata:
  name: my-secret
stringData:
  PASSWORD: "change-me"`
    },
    {
      lang: "bash",
      title: "9. Change the image (update the app)",
      desc: "What this is\nUpdating a Deployment can change the image tag.\nset image writes that new tag on the container.\nrollout status waits until the new Pods are ready.\n\nWhat the code is doing\nkubectl set image deploy/my-app my-app=nginx:1.27 points the my-app container at nginx:1.27.\nrollout status deploy/my-app blocks until the rollout finishes or fails.\nA new tag is a new version of the running image.\n\nWatch out\nThe container name my-app in set image must match the name in the Pod template.\nA tag that does not exist on the registry leaves new Pods stuck pulling.",
      code: `kubectl set image deploy/my-app my-app=nginx:1.27
kubectl rollout status deploy/my-app`
    },
    {
      lang: "bash",
      title: "10. Undo a bad update",
      desc: "What this is\nA rollout undo takes the Deployment back to the previous revision.\nThe old ReplicaSet is scaled up again.\nYou use this when the new version is bad.\n\nWhat the code is doing\nkubectl rollout undo deploy/my-app is the single action.\nIt does not ask the YAML file; it uses the Deployment's revision history.\nThe previous working Pods come back if history is still there.\n\nWatch out\nUndo is not a substitute for fixing the bad image.\nIf you already rolled several times, undo goes one step, not all the way to the first version unless you pick a revision.",
      code: `kubectl rollout undo deploy/my-app`
    }
  ]);

  add("devops", [
    {
      lang: "txt",
      title: "1. What CI and CD mean",
      desc: "What this is\nCI is automated checks on each push.\nCD is putting a built package on a server.\nThe diagram is one pipeline: push, check, then deploy.\n\nWhat the code is doing\nThe first line is you pushing code to GitHub.\nCI then installs, tests, and builds to ask if it is broken.\nIf those steps pass, CD deploys, which means put it online.\nThe arrows are that order, not three unrelated jobs.\n\nWatch out\nA green deploy with no tests is CD without CI.\nA test that only runs on your laptop is not CI.",
      code: `You push code to GitHub
        |
        v
CI: install, test, build   (is it broken?)
        |
        v
CD: deploy                 (put it online)`
    },
    {
      lang: "yaml",
      title: "2. Tiny GitHub Actions file",
      desc: "What this is\nGitHub Actions is YAML the host reads on events.\non: [push] starts the job when you push.\nsteps are the commands and actions in order.\n\nWhat the code is doing\nname check is the workflow title.\njobs.test runs on ubuntu-latest.\nactions/checkout@v4 copies the repo.\nsetup-node@v4 installs Node 20.\nrun npm install then npm test execute those scripts.\n\nWatch out\nThis file must live under .github/workflows/ to run.\nA failing npm test stops later deploy steps if you wire them in the same job.",
      code: `name: check
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm test`
    },
    {
      lang: "txt",
      title: "3. Same commands at home and in CI",
      desc: "What this is\nThe same install, test, and build should run locally and in CI.\nIf a step only works on one machine, the pipeline will lie.\nFailing tests should block deploy.\n\nWhat the code is doing\nnpm install installs dependencies.\nnpm test runs the test script from package.json.\nnpm run build produces the production assets.\nThose three lines are the same work CI should repeat.\n\nWatch out\nA test skipped locally and skipped in CI is not a check.\npackage.json scripts define what test and build actually do.",
      code: `npm install
npm test
npm run build`
    },
    {
      lang: "hcl",
      title: "4. Tiny Terraform (make a bucket)",
      desc: "What this is\nTerraform describes cloud resources in files.\nA provider picks the cloud and region.\nA resource block declares one object to create.\n\nWhat the code is doing\nprovider aws sets region ap-south-1.\nresource aws_s3_bucket photos names the bucket resource.\nbucket = \"my-photos-demo-123\" is the bucket name in AWS.\nApplying this file would create that bucket.\n\nWatch out\nThe name photos is Terraform's local name; the AWS bucket name is the bucket argument.\nBucket names must be globally unique in S3.",
      code: `provider "aws" {
  region = "ap-south-1"
}

resource "aws_s3_bucket" "photos" {
  bucket = "my-photos-demo-123"
}`
    },
    {
      lang: "bash",
      title: "5. Terraform three commands",
      desc: "What this is\nTerraform has a small loop: init, plan, apply.\ninit downloads providers.\nplan shows the proposed change; apply performs it.\n\nWhat the code is doing\nterraform init runs once per working directory to set up plugins.\nterraform plan prints what would be created, changed, or destroyed.\nterraform apply makes those changes after confirmation.\nThat is the whole loop in this snippet.\n\nWatch out\napply without reading plan can still change production.\ninit is not optional on a fresh checkout.",
      code: `terraform init
terraform plan
terraform apply`
    },
    {
      lang: "txt",
      title: "6. Never put secrets in Git",
      desc: "What this is\nSecrets in Git stay in history even after you delete the line.\nCI should read secrets from a store the host provides.\nA .env file that is ignored is for local use.\n\nWhat the code is doing\nThe bad line is a password written in code.\nThe good line is PASSWORD living in GitHub Settings Secrets.\nThe pipeline injects that value at run time.\nThe repo YAML should not contain the real password.\n\nWatch out\nRotating a leaked secret is required; deleting the file is not enough.\nLogging the secret in a CI step publishes it in the job log.",
      code: `Bad:  password written in code
Good: PASSWORD lives in GitHub → Settings → Secrets`
    },
    {
      lang: "bash",
      title: "7. After deploy, check the app",
      desc: "What this is\nA deploy is not done until the app answers.\nA health URL is a cheap check.\ncurl is one way to hit that URL from a runner or laptop.\n\nWhat the code is doing\ncurl requests http://localhost:3000/health.\nIf the process is down, the request fails.\nIf the process is up but /health is missing, you get 404.\nThe line is the check, not the deploy itself.\n\nWatch out\nlocalhost in CI is the runner, not your production host unless you set the URL.\nA 200 from /health does not prove every feature works.",
      code: `curl http://localhost:3000/health`
    },
    {
      lang: "js",
      title: "8. Easy log line",
      desc: "What this is\nA log line is for later debugging.\nInclude identifiers that help you find the event.\nNever include passwords, tokens, or card numbers.\n\nWhat the code is doing\nconsole.log prints user logged in and { userId: 12 }.\nuserId is enough to trace the session.\nThe comment lists password, token, and credit card as things not to log.\n\nWatch out\nLogging the whole req.body often leaks secrets by accident.\nuserId 12 in a public log is still personal data in some systems; keep logs access-controlled.",
      code: `console.log("user logged in", { userId: 12 });
// do not log: password, token, credit card`
    },
    {
      lang: "txt",
      title: "9. If production breaks",
      desc: "What this is\nWhen production is down, restore service first.\nInvestigation comes after users can work again.\nRollback means the previous good package.\n\nWhat the code is doing\nStep 1 is roll back to the old image or old commit.\nStep 2 is tell the team so people do not fight the same fire blindly.\nStep 3 is then find the bug.\nThe order is the point of the snippet.\n\nWatch out\nDebugging on the broken production version while users wait extends the outage.\nRollback without a previous artifact is not possible; keep the last good build.",
      code: `1. Roll back (old image / old commit)
2. Tell the team
3. Then find the bug`
    },
    {
      lang: "yaml",
      title: "10. Auto-update npm packages (optional)",
      desc: "What this is\nDependabot is a GitHub file that opens update pull requests.\npackage-ecosystem npm means Node packages.\nA weekly interval batches those PRs.\n\nWhat the code is doing\nversion 2 is the config format.\nupdates has one item for npm at directory /.\nschedule interval weekly asks for a weekly check.\nThe file belongs at .github/dependabot.yml.\n\nWatch out\nAn open PR is not an applied update until you merge it.\nMajor version bumps can still break the app; CI on that PR is the safety net.",
      code: `version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly`
    }
  ]);

  add("aws", [
    {
      lang: "txt",
      title: "1. Big AWS boxes in easy words",
      desc: "What this is\nAWS is rented services, not a computer you unbox.\nEC2 is a virtual machine, S3 is object storage, RDS is a managed database.\nIAM is who may do what; VPC is the private network.\n\nWhat the code is doing\nEC2 is labeled a computer in the cloud.\nS3 is labeled a folder for files.\nRDS is labeled a managed database.\nIAM is labeled who is allowed to do what.\nVPC is labeled your private network.\n\nWatch out\nThese names are services, not folders on your laptop.\nOpening S3 to the world is not the same as attaching an IAM user.",
      code: `EC2   = a computer in the cloud
S3    = a folder for files
RDS   = a managed database
IAM   = who is allowed to do what
VPC   = your private network`
    },
    {
      lang: "bash",
      title: "2. Who am I? (CLI)",
      desc: "What this is\nThe CLI call asks AWS who the current credentials are.\nThe answer is an account and identity.\nYou run this after credentials are configured.\n\nWhat the code is doing\naws sts get-caller-identity is the whole snippet.\nSTS returns the caller, not a list of buckets.\nA successful print means the CLI found credentials that AWS accepts.\n\nWatch out\nA working identity does not mean that identity may touch every service.\nWrong profile credentials look like AccessDenied later, not always here.",
      code: `aws sts get-caller-identity`
    },
    {
      lang: "bash",
      title: "3. Make a folder in S3 and upload a file",
      desc: "What this is\nS3 stores objects in a named bucket.\nmb creates a bucket, cp uploads a file, ls lists keys.\nThe s3:// URL names the bucket and key.\n\nWhat the code is doing\naws s3 mb s3://my-first-bucket-123 creates the bucket.\naws s3 cp hello.txt s3://my-first-bucket-123/ uploads hello.txt.\naws s3 ls lists what is in that bucket.\nThe three lines are create, upload, then look.\n\nWatch out\nBucket names must be globally unique; a taken name fails mb.\nls is not a recursive dump of every prefix unless you ask for that.",
      code: `aws s3 mb s3://my-first-bucket-123
aws s3 cp hello.txt s3://my-first-bucket-123/
aws s3 ls s3://my-first-bucket-123/`
    },
    {
      lang: "json",
      title: "4. Tiny IAM rule",
      desc: "What this is\nAn IAM statement grants or denies actions on resources.\nEffect Allow means permit.\nAction and Resource bound what and where.\n\nWhat the code is doing\nEffect is Allow.\nAction lists s3:GetObject and s3:PutObject.\nResource is arn:aws:s3:::my-first-bucket-123/*, objects in that bucket.\nThe role that uses this statement may read and write those objects only.\n\nWatch out\nMissing /* on the bucket ARN often fails object APIs.\nAllow on s3:* and Resource * is far wider than this snippet.",
      code: `{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject"],
  "Resource": "arn:aws:s3:::my-first-bucket-123/*"
}`
    },
    {
      lang: "js",
      title: "5. Tiny Lambda function",
      desc: "What this is\nLambda runs a function when an event arrives.\nYou do not keep a server process listening.\nhandler is the entry function AWS calls.\n\nWhat the code is doing\nexports.handler is an async function that receives event.\nIt returns statusCode 200.\nbody is Hello from Lambda.\nThat object is the HTTP-style result for a function URL or API Gateway.\n\nWatch out\nA thrown error becomes a failed invocation, not this 200.\nevent holds the trigger payload; this sample does not read it.",
      code: `exports.handler = async function (event) {
  return {
    statusCode: 200,
    body: "Hello from Lambda"
  };
};`
    },
    {
      lang: "txt",
      title: "6. Public vs private subnet",
      desc: "What this is\nPublic and private subnets split who can be reached from the internet.\nThe load balancer sits on the public side.\nThe app and database stay private.\n\nWhat the code is doing\nInternet points at the load balancer, which is public.\nThe next hop is your app, private.\nThe last hop is the database, private with no public IP.\nTraffic from the world should not hit the database directly.\n\nWatch out\nA database with a public IP is the opposite of this picture.\nPrivate is not encrypt-only; it is network reachability.",
      code: `Internet
   |
Load balancer   (public)
   |
Your app        (private)
   |
Database        (private, no public IP)`
    },
    {
      lang: "txt",
      title: "7. Security group = firewall",
      desc: "What this is\nA security group is a virtual firewall on a network interface.\nYou allow ports from sources you choose.\nClosed by default is the safe starting point.\n\nWhat the code is doing\nThe web app group allows 80 and 443 from the world.\nThe database group allows 5432 only from the web app group.\nSSH 22 is limited to your IP, or you use SSM instead.\nEach line is a door you chose to open.\n\nWatch out\nAllowing 0.0.0.0/0 on 5432 publishes the database.\nSecurity groups are stateful; they are not a substitute for IAM.",
      code: `Web app SG:   allow 80 and 443 from the world
Database SG:  allow 5432 only from the web app SG
SSH:          allow 22 only from your IP (or use SSM)`
    },
    {
      lang: "txt",
      title: "8. RDS connection (idea)",
      desc: "What this is\nRDS gives you a hostname, not a postgres on localhost.\nThe app reads DATABASE_URL from config.\nUSER, PASSWORD, HOST, port, and DBNAME are parts of that URL.\n\nWhat the code is doing\nThe URL scheme is postgres://USER:PASSWORD@HOST:5432/DBNAME.\nHOST looks like mydb.xxxx.ap-south-1.rds.amazonaws.com.\nThe app uses that host from a private network path.\nYour laptop is not the database server in this setup.\n\nWatch out\nPutting this URL in Git leaks the password.\nlocalhost in the app still means the app container, not RDS.",
      code: `DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DBNAME

HOST is something like:
mydb.xxxx.ap-south-1.rds.amazonaws.com`
    },
    {
      lang: "js",
      title: "9. Upload a file with the AWS SDK",
      desc: "What this is\nThe AWS SDK sends API calls with the process credentials.\nS3Client is the client for one region.\nPutObjectCommand uploads bytes under a key.\n\nWhat the code is doing\nThe require line loads S3Client and PutObjectCommand.\nS3Client is constructed with region ap-south-1.\nsend runs PutObjectCommand.\nBucket, Key hello.txt, and Body hi are the object.\n\nWatch out\nAccess keys in source are the wrong credential pattern; use a role.\nA region mismatch looks like a missing bucket.",
      code: `const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client({ region: "ap-south-1" });

await s3.send(new PutObjectCommand({
  Bucket: "my-first-bucket-123",
  Key: "hello.txt",
  Body: "hi"
}));`
    },
    {
      lang: "txt",
      title: "10. If something fails, look here first",
      desc: "What this is\nCloudWatch Logs holds application printout.\nCloudTrail holds API calls, who did what.\nAccessDenied is usually a missing IAM permission.\n\nWhat the code is doing\nApp errors go to CloudWatch Logs.\nAPI calls go to CloudTrail.\nThe last line says AccessDenied usually means the role is missing a permission.\nThose are three different places to look.\n\nWatch out\nEmpty CloudWatch logs can mean the app never started, not that it has no bugs.\nFixing a log group does not grant S3 access.",
      code: `App errors  -> CloudWatch Logs
API calls   -> CloudTrail
Is it IAM?  -> "AccessDenied" usually means the role is missing a permission`
    }
  ]);

  add("python", [
    {
      lang: "py",
      title: "1. First program",
      desc: "What this is\nprint writes text to the terminal.\nA hash starts a comment Python ignores.\nThis is the first running program.\n\nWhat the code is doing\nThe first line is a comment.\nprint(\"Hello\") writes Hello.\nprint(\"I am learning Python\") writes the second line.\nBoth prints run in order.\n\nWatch out\nQuotes make a string; Hello without quotes would be a name Python does not know.\nComments do not run; they are notes.",
      code: `# this is a comment. Python ignores it
print("Hello")
print("I am learning Python")`
    },
    {
      lang: "py",
      title: "2. Make a variable",
      desc: "What this is\nA variable is a name bound to a value.\nYou assign with =.\nYou can assign a new value to the same name.\n\nWhat the code is doing\nname stores the text Nitin.\nage stores 21.\nThe first two prints show those values.\nage = 22 replaces the number.\nThe last print shows 22.\n\nWatch out\n= is assignment, not a math equals test.\nPython does not need let or const; the name appears on the left.",
      code: `name = "Nitin"
age = 21
print(name)
print(age)

# change the number
age = 22
print(age)`
    },
    {
      lang: "py",
      title: "3. Make a list",
      desc: "What this is\nA list is an ordered sequence.\nIndex 0 is the first item.\nappend adds at the end; len counts items.\n\nWhat the code is doing\nfruits holds apple, mango, and banana.\nfruits[0] is apple.\nappend adds kiwi.\nlen(fruits) is then 4.\n\nWatch out\nfruits[3] is kiwi after append, not banana.\nA list is not a dict; you do not look up by the word apple as a key here.",
      code: `fruits = ["apple", "mango", "banana"]
print(fruits[0])      # apple
fruits.append("kiwi")
print(len(fruits))    # 4`
    },
    {
      lang: "py",
      title: "4. Make a dictionary",
      desc: "What this is\nA dictionary maps keys to values.\nKeys are usually strings in this style.\nYou read with square brackets and the key.\n\nWhat the code is doing\nstudent has name Ada and marks 90.\nstudent[\"name\"] reads Ada.\nstudent[\"marks\"] = 95 updates the score.\nThe last print shows 95.\n\nWatch out\nstudent.name is not the dict lookup unless you use an object type.\nA missing key raises KeyError; it does not return undefined like JavaScript.",
      code: `student = {
  "name": "Ada",
  "marks": 90
}
print(student["name"])
student["marks"] = 95
print(student["marks"])`
    },
    {
      lang: "py",
      title: "5. if / else",
      desc: "What this is\nif / else picks a branch.\nThe condition after if must be true or false.\nIndentation is the block in Python.\n\nWhat the code is doing\nmarks is 75.\nif marks >= 40 is true, so it prints Pass.\nThe else branch prints Fail only when the test is false.\nSpaces before print belong to the if or else.\n\nWatch out\nA missing indent is a syntax error, not a style nit.\n>= 40 is pass here; a 39 takes else.",
      code: `marks = 75

if marks >= 40:
    print("Pass")
else:
    print("Fail")`
    },
    {
      lang: "py",
      title: "6. Loop a list",
      desc: "What this is\nfor walks a sequence one item at a time.\nThe loop variable holds the current item.\nThe body runs once per item.\n\nWhat the code is doing\nfruits is the same three names.\nfor fruit in fruits binds fruit to each name.\nprint(fruit) writes that name.\nThe loop ends after banana.\n\nWatch out\nfruit is a new name each round, not an index unless you use enumerate.\nChanging fruits while looping can skip or repeat items.",
      code: `fruits = ["apple", "mango", "banana"]

for fruit in fruits:
    print(fruit)`
    },
    {
      lang: "py",
      title: "7. Make a function",
      desc: "What this is\ndef names a function.\nThe parameter is the input name inside the function.\nreturn sends a value back to the caller.\n\nWhat the code is doing\nsay_hello takes name.\nIt returns Hello, plus that name.\nsay_hello(\"Nitin\") stores the sentence in message.\nprint(message) writes Hello, Nitin.\n\nWatch out\nForgetting return means the function returns None.\nThe def line does not print until you call the function.",
      code: `def say_hello(name):
    return "Hello, " + name

message = say_hello("Nitin")
print(message)`
    },
    {
      lang: "py",
      title: "8. Read a file",
      desc: "What this is\nopen reads a file from disk.\nwith closes the file even if an error happens.\nread() returns the whole text as one string.\n\nWhat the code is doing\nopen(\"data.txt\", encoding=\"utf-8\") opens that file as text.\nas f names the file object.\ntext = f.read() loads the contents.\nprint(text) writes them.\nThe with block ends and the file is closed.\n\nWatch out\nThe file must exist next to the script, or you must pass a real path.\nencoding utf-8 avoids surprises with non-ASCII bytes.",
      code: `with open("data.txt", encoding="utf-8") as f:
    text = f.read()

print(text)`
    },
    {
      lang: "py",
      title: "9. Ask the user",
      desc: "What this is\ninput pauses and reads a line from the user.\nThe result is always a string.\nint() converts text to a number when you need math.\n\nWhat the code is doing\ninput(\"Your name: \") shows the prompt and waits.\nname stores what the user typed.\nprint(\"Hi\", name) writes Hi and that text.\nThe commented line shows int() around input for age.\n\nWatch out\nint(\"21\") works; int(\"twenty\") raises ValueError.\nDo not wrap input in int until you are ready to handle bad text.",
      code: `name = input("Your name: ")
print("Hi", name)

# age = int(input("Your age: "))`
    },
    {
      lang: "py",
      title: "10. A tiny table of rows",
      desc: "What this is\nA list of dictionaries is a table in memory.\nEach dict is a row with named columns.\nA loop prints one row at a time.\n\nWhat the code is doing\nstudents has two dicts, Ada 90 and Lin 76.\nfor row in students walks those dicts.\nprint(row[\"name\"], row[\"marks\"]) writes the two fields.\nThe loop runs twice.\n\nWatch out\nrow[\"marks\"] is not row.marks on a plain dict.\nAn empty list prints nothing; that is not an error.",
      code: `students = [
  {"name": "Ada", "marks": 90},
  {"name": "Lin", "marks": 76}
]
for row in students:
    print(row["name"], row["marks"])`
    }
  ]);

  add("machinelearning", [
    {
      lang: "txt",
      title: "1. The idea in one picture",
      desc: "What this is\nA model learns from rows that already have answers.\nThen it guesses on new rows that do not.\nTrain is the learning step; predict is the guess.\n\nWhat the code is doing\nOld data with answers feeds train.\nThe result is a model.\npredict uses that model on new data with no answers yet.\nThe picture is that flow, not a library call.\n\nWatch out\nPredicting on the same rows you trained on is not a fair test.\nA model is not a database lookup unless you built it that way.",
      code: `Old data (with answers)
        |
     train
        v
      Model
        |
     predict
        v
New data (no answers yet)`
    },
    {
      lang: "py",
      title: "2. A table in pandas",
      desc: "What this is\npandas DataFrame is a table with named columns.\nYou can build one from a dict of lists.\nprint shows the rows and column names.\n\nWhat the code is doing\nimport pandas as pd loads the library.\nDataFrame gets rooms 2,3,4 and price 20,30,45.\ndata holds that table.\nprint(data) shows three rows and two columns.\n\nWatch out\nThe lists must be the same length or construction fails.\nrooms and price are column names, not Python variables until you select them.",
      code: `import pandas as pd

data = pd.DataFrame({
    "rooms": [2, 3, 4],
    "price": [20, 30, 45]
})
print(data)`
    },
    {
      lang: "py",
      title: "3. Features and target",
      desc: "What this is\nFeatures X are the inputs the model may use.\nTarget y is the value you want to guess.\nDouble brackets on a DataFrame keep a column as a table.\n\nWhat the code is doing\nX = data[[\"rooms\"]] selects the rooms column as a DataFrame.\ny = data[\"price\"] selects price as a Series.\nprint(X) shows the input table.\nprint(y) shows the prices.\n\nWatch out\ndata[\"rooms\"] is one-dimensional; many sklearn models want X two-dimensional.\nX and y must have the same number of rows.",
      code: `X = data[["rooms"]]   # input
y = data["price"]     # answer

print(X)
print(y)`
    },
    {
      lang: "py",
      title: "4. Split train and test",
      desc: "What this is\nA train/test split hides some rows during learning.\ntest_size is the fraction held out.\nrandom_state makes the split repeatable.\n\nWhat the code is doing\ntrain_test_split is imported from sklearn.model_selection.\nIt returns X_train, X_test, y_train, y_test.\ntest_size 0.25 holds out a quarter of the rows.\nrandom_state 42 fixes the shuffle.\n\nWatch out\nFitting on X_test leaks the hidden rows.\nA tiny dataset with 0.25 test can leave very few test rows.",
      code: `from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)`
    },
    {
      lang: "py",
      title: "5. Train a simple line (regression)",
      desc: "What this is\nLinear regression guesses a number along a line.\nfit learns from training rows.\npredict guesses on new rows.\n\nWhat the code is doing\nLinearRegression is imported and constructed.\nmodel.fit(X_train, y_train) learns from the train split.\nmodel.predict(X_test) guesses prices for the held-out rooms.\nprint shows those guesses.\n\nWatch out\nThis is regression, not yes/no classification.\npredict needs the same columns X had during fit.",
      code: `from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)

print(model.predict(X_test))`
    },
    {
      lang: "py",
      title: "6. Yes / no model (classification)",
      desc: "What this is\nLogistic regression guesses a class, here 0 or 1.\nfit still learns from X and y.\npredict still guesses for new X.\n\nWhat the code is doing\nX is four one-feature rows: 10, 20, 80, 90.\ny is 0, 0, 1, 1, fail then pass.\nfit trains on those four points.\npredict([[50]]) guesses the class for 50.\n\nWatch out\n[[50]] is two-dimensional, matching sklearn's expected X shape.\nAccuracy on these four points is not proof on new students.",
      code: `from sklearn.linear_model import LogisticRegression

X = [[10], [20], [80], [90]]
y = [0, 0, 1, 1]

model = LogisticRegression()
model.fit(X, y)
print(model.predict([[50]]))`
    },
    {
      lang: "py",
      title: "7. How good is it? (accuracy)",
      desc: "What this is\naccuracy_score is the fraction of matching labels.\nIt is for classification, not for price error.\n1.0 means every guess matched y.\n\nWhat the code is doing\nguess = model.predict(X) labels the same X used above.\naccuracy_score(y, guess) compares true y to guess.\nprint shows that fraction.\n\nWatch out\nScoring the train rows is optimistic.\nDo not use accuracy for a regression model's number guesses.",
      code: `from sklearn.metrics import accuracy_score

guess = model.predict(X)
print(accuracy_score(y, guess))`
    },
    {
      lang: "py",
      title: "8. How wrong is a number guess?",
      desc: "What this is\nmean_absolute_error is the average gap between guess and true number.\nLower is better.\nIt is for regression.\n\nWhat the code is doing\nguess = model.predict(X_test) on the held-out features.\nmean_absolute_error(y_test, guess) averages the absolute differences.\nprint shows that average miss.\n\nWatch out\nThis metric is not accuracy; a 0.0 MAE would mean perfect number guesses.\nCompare y_test to guesses from the same split, not to y_train.",
      code: `from sklearn.metrics import mean_absolute_error

guess = model.predict(X_test)
print(mean_absolute_error(y_test, guess))`
    },
    {
      lang: "txt",
      title: "9. Do not cheat",
      desc: "What this is\nThe test rows must stay hidden while you fit.\nScoring those hidden rows is the honest check.\nFitting on all rows then testing on them is cheating.\n\nWhat the code is doing\nThe good list is split, fit on TRAIN only, score on TEST.\nThe bad list is fit on all rows, then test on the same rows.\nThe snippet is the rule, not a library call.\n\nWatch out\nTuning hyperparameters on the test set also cheats; use a validation split or cross-validation.\nA perfect train score with a poor test score is overfitting.",
      code: `Good:
  1. split
  2. fit on TRAIN only
  3. score on TEST

Bad:
  fit on all rows, then test on the same rows`
    },
    {
      lang: "txt",
      title: "10. A tiny project idea",
      desc: "What this is\nA first project is one table, one question, one simple model.\nPass or fail from hours studied is that shape.\nYou print a metric, then try one new row.\n\nWhat the code is doing\nThe question is guessing pass/fail from hours studied.\nStep 1 is a small table of hours and pass.\nStep 2 is split.\nStep 3 is LogisticRegression.\nSteps 4 and 5 print accuracy and try hours = 5.\n\nWatch out\nFive numbered steps are still not a production system.\nA model trained on ten toy rows will not generalize to a real school.",
      code: `Question: Can I guess pass/fail from hours studied?
1. Make a small table (hours, pass)
2. Split
3. LogisticRegression
4. Print accuracy
5. Try one new student: hours = 5`
    }
  ]);

  add("git", [
    { lang: "js", title: "1. What Git stores", desc: "What this is\nGit stores snapshots of files, not a live folder magically.\nYou move work through working files, staging, then committed history.\nEach snapshot is a commit.\n\nWhat the code is doing\nworking is the object you are typing, here app.js with hello.\nstaging is the set you chose for the next save, the same app.js.\nrepo is an array of finished snapshots.\nThe first commit c1 has message first save and files with hi.\n\nWatch out\nStaging is not a second copy on disk you edit separately; it is the list of what the next commit will include.\nA file can be changed in working after you staged an older version.", code: `// picture of Git (not commands)
working = { "app.js": "hello" };     // you are typing
staging = { "app.js": "hello" };     // you chose this for the next save
repo    = [                          // history of finished saves
  { id: "c1", message: "first save", files: { "app.js": "hi" } }
];` },
    { lang: "js", title: "2. A commit is a snapshot", desc: "What this is\nA commit is a snapshot of the project at one moment.\nIt has an id, a message, a parent, and the file contents.\nOld snapshots stay; a new save is a new snapshot.\n\nWhat the code is doing\ncommit has id a1b2.\nmessage is Add hello text.\nparent is c1, the snapshot before this one.\nfiles records app.js as hello.\nThe comment says Git does not edit an old photo.\n\nWatch out\nChanging a file after this commit does not rewrite a1b2.\nparent is how history chains; a commit with no parent is a root.", code: `const commit = {
  id: "a1b2",
  message: "Add hello text",
  parent: "c1",
  files: { "app.js": "hello" }
};
// Git never edits an old photo. A new save is a new photo.` },
    { lang: "js", title: "3. A branch is a sticky note", desc: "What this is\nA branch is a name that points at one commit.\nHEAD is which branch you are on.\nWhen you commit, that name moves to the new snapshot.\n\nWhat the code is doing\nbranches.main points at c1.\nbranches.login points at c3, extra work.\nHEAD is login, so you are standing on the login name.\nNew commits on login move that pointer, not main, until you merge.\n\nWatch out\nA branch is not a full extra copy of every file by itself; it is a pointer plus the commits it can reach.\nDetached HEAD means you are pointing at a commit id, not a branch name.", code: `const branches = {
  main: "c1",
  login: "c3"   // extra work lives here
};
const HEAD = "login"; // you are standing on the login sticky note` },
    { lang: "js", title: "4. Remote is a copy", desc: "What this is\nA remote is another copy of the repository, often on GitHub.\npush sends commits the remote does not have.\nfetch downloads commit data; pull also updates your branch.\n\nWhat the code is doing\nlaptop.repo has c1 and c2.\ngithub.repo has only c1.\nThe comments map push, fetch, and pull to those albums.\nUntil you push, c2 lives only on the laptop.\n\nWatch out\nfetch does not merge into your branch by itself.\npull is fetch plus integrate; it is not a synonym for clone.", code: `laptop.repo = ["c1", "c2"];
github.repo = ["c1"];        // not updated yet
// push  = send missing photos to GitHub
// fetch = look at GitHub photos
// pull  = look + add them into your branch` },
    { lang: "txt", title: "5. What .gitignore means", desc: "What this is\n.gitignore lists paths Git should not track.\nThose files can still exist on disk.\nThey will not be in commits if the ignore matches.\n\nWhat the code is doing\nnode_modules/ is the huge installed package folder.\n.env holds secrets.\n.DS_Store is machine junk.\nThe array is the do-not-save list.\n\nWatch out\nIgnoring a file that is already tracked does not untrack it; you have to remove it from the index too.\n.env belongs here so passwords do not enter history.", code: `do_not_save = [
  "node_modules/",   // huge downloaded folder
  ".env",            // secrets
  ".DS_Store"        // computer junk
];` },
    { lang: "txt", title: "6. A merge conflict file", desc: "What this is\nA merge conflict means both sides changed the same lines.\nGit writes both versions into the file with marks.\nYou delete the marks and keep the final text.\n\nWhat the code is doing\nThe first block is your-branch's title My site.\nThe ======= line splits the two versions.\nThe second block is main's title Our site.\nThe comment says remove the marks and keep one title so the commit can finish.\n\nWatch out\nLeaving the <<<<<<< marks in the file ships broken source.\nThe conflict is in the file contents; resolving it is an edit, then a commit.", code: `<<<<<<< your-branch
title = "My site";
=======
title = "Our site";
>>>>>>> main
// delete the marks. keep one title. then the save can finish.` },
    { lang: "js", title: "7. Undo ideas (what they mean)", desc: "What this is\nUndo in Git is several different goals.\nTaking a file out of staging is not the same as deleting your edits.\nReversing a commit on a shared branch should add a new commit, not rewrite published history.\n\nWhat the code is doing\nThe first comment is unstage: drop from staging, keep the working text.\nThe second is discard uncommitted edits: put the file back to the last snapshot.\nThe third is undo a save on main: make a new snapshot that reverses it.\nNone of these lines is a command list; they are the outcomes.\n\nWatch out\nThe same English word undo maps to different operations.\nRewriting a commit others already pulled causes duplicate or missing history for them.", code: `// I staged a file too soon     -> take it out of staging, keep the typing
// I hate these unsaved edits  -> put the file back to the last photo
// I want to undo a save on main -> make a NEW photo that reverses it` },
    { lang: "js", title: "8. Git vs GitHub", desc: "What this is\nGit is the version tool on your computer.\nGitHub is a website that hosts a copy and adds review.\nYou can use Git with no GitHub account.\n\nWhat the code is doing\nThe first line names Git as the local camera and album.\nThe second names GitHub as the hosted copy and review place.\nThe comment says the camera works with no website.\nPush is how the two copies meet when you choose to publish.\n\nWatch out\nA GitHub URL is not Git itself; clone uses Git to copy from that host.\nIssues and pull requests are website features, not core Git objects.", code: `Git    = camera + photo album on your computer
GitHub = website that stores a copy and lets people review
// you can use the camera with no website` },
    { lang: "js", title: "9. A pull request is a conversation", desc: "What this is\nA pull request asks to add one branch's commits onto another.\nfrom and into name the branches.\nChecks are extra gates such as tests and review.\n\nWhat the code is doing\npr.from is login, the work branch.\npr.into is main, the target.\nquestion is the human ask, Please add my login work.\nchecks lists tests green and one friend reviewed.\nMerging happens after people accept that ask.\n\nWatch out\nOpening a pull request does not merge by itself.\nThe branch names must exist on the remote the host uses.", code: `const pr = {
  from: "login",
  into: "main",
  question: "Please add my login work",
  checks: ["tests green", "one friend reviewed"]
};` },
    { lang: "txt", title: "10. A good save message", desc: "What this is\nA commit message is a note to future readers.\nIt should say why the change exists.\nShort junk messages hide that reason.\n\nWhat the code is doing\nThe good line explains that login check blocks guests from /me.\nThe first bad line is only update, which names no reason.\nThe second bad line is asdf, which names nothing.\nReaders of git log need the good shape.\n\nWatch out\nThe message is not the same as the file diff; the diff is what changed, the message is why.\nRewriting messages of commits already pushed rewrites public history.", code: `Good:  Add login check so guests cannot see /me
Bad:   update
Bad:   asdf` }
  ]);

  add("linux", [
    { lang: "js", title: "1. Folders are a tree", desc: "What this is\nThe filesystem is a tree of folders.\nYou always have a current directory.\nPaths start from / at the root.\n\nWhat the code is doing\ntree[\"/\"] has home and var.\nUnder home.nitin.notes is hello.txt with Hi.\nhere is /home/nitin, the current folder.\nOther files exist but you are not standing in them.\n\nWatch out\nA relative name like notes is from here, not always from /.\n/home and home without the slash are different starting points.", code: `tree = {
  "/": {
    home: { nitin: { notes: { "hello.txt": "Hi" } } },
    var: { log: {} }
  }
};
here = "/home/nitin";` },
    { lang: "js", title: "2. A file has a name and permission", desc: "What this is\nEvery file has an owner and permission bits.\nr is read, w is write, x is execute or enter a folder.\nOwner, group, and others each have a set of those bits.\n\nWhat the code is doing\nfile.name is hello.txt.\nowner is nitin.\ncan.owner is rw-, so the owner can read and write but not execute.\ngroup and others are r--, read only.\nThe comment restates r, w, and x.\n\nWatch out\nx on a folder means you can enter it, not that the folder is a program.\nchmod numbers are just another way to write these bits.", code: `const file = {
  name: "hello.txt",
  owner: "nitin",
  can: { owner: "rw-", group: "r--", others: "r--" }
};
// r = read, w = write, x = run / enter folder` },
    { lang: "js", title: "3. A process is a running program", desc: "What this is\nA process is a running program with an id.\npid is that id.\nTwo processes cannot both listen on the same port.\n\nWhat the code is doing\nprocess.pid is 4421.\nname is node.\nusing lists port 3000 and file app.js.\nThe comment says if two apps want the same port, one must stop.\n\nWatch out\nThe pid is not the port; 4421 is the process, 3000 is the door.\nKilling the wrong pid stops a different program.", code: `const process = {
  pid: 4421,
  name: "node",
  using: ["port 3000", "file app.js"]
};
// if two apps want the same port, one must stop` },
    { lang: "txt", title: "4. stdin / stdout / stderr", desc: "What this is\nA process has three standard streams.\nstdin is input, stdout is normal output, stderr is errors.\nA pipe can send stdout into the next program.\n\nWhat the code is doing\nstdin is what you type in.\nstdout is normal answers.\nstderr is error messages.\nThe comment notes you can pipe stdout to the next program.\n\nWatch out\nstderr still prints when you redirect stdout only.\nMixing them up makes errors look like success data.", code: `stdin  = what you type in
stdout = normal answers
stderr = error messages
// you can send stdout into the next program (a pipe)` },
    { lang: "js", title: "5. A tiny script is just steps", desc: "What this is\nA script is a list of steps the computer runs in order.\nA function here groups those steps under a name.\nCalling the function runs them.\n\nWhat the code is doing\nhello prints Hello.\nIt then prints Today is a date.\nhello() at the bottom runs those two prints.\nExecution is top to bottom inside the function.\n\nWatch out\nDefining hello does not print until you call it.\nA real shell script would use echo; this snippet is the idea of ordered steps.", code: `function hello() {
  print("Hello");
  print("Today is a date");
}
hello();` },
    { lang: "js", title: "6. Environment values", desc: "What this is\nEnvironment variables are settings the process can read.\nThey are not source files.\nThe program should read them instead of hard-coding secrets.\n\nWhat the code is doing\nenv.PORT is 3000 as text.\nenv.DATABASE_URL is labeled secret here.\nThe comment says the program reads env.PORT instead of writing 3000 in the code.\nThat lets each machine supply its own values.\n\nWatch out\nPORT is a string in the environment, not automatically a number.\nPrinting DATABASE_URL in logs leaks the secret.", code: `const env = {
  PORT: "3000",
  DATABASE_URL: "secret"
};
// the program reads env.PORT instead of writing 3000 in the code` },
    { lang: "txt", title: "7. A service is a program that should stay up", desc: "What this is\nA service is a program the machine should keep running.\nIf it crashes, the supervisor starts it again.\nLogs are collected so you can read them later.\n\nWhat the code is doing\nservice my-api names the unit.\nrun is node index.js.\nfolder is /var/www/api.\nrestart is when it crashes.\nlogs are collected for you.\n\nWatch out\nA service is not the same as a one-off command in a terminal that dies when you log out.\nIf restart is on and the app crash-loops, the machine will keep restarting it.", code: `service my-api:
  run: node index.js
  folder: /var/www/api
  restart: when it crashes
  logs: collected for you` },
    { lang: "js", title: "8. Disk full = apps break", desc: "What this is\nWhen the disk is nearly full, writes fail and apps look randomly broken.\nused and free describe that pressure.\nLogs and uploads are common fillers.\n\nWhat the code is doing\ndisk.used is 95%.\ndisk.free is 2 GB.\nThe if checks whether used is over 90%.\nThe comment points at logs or uploads as likely causes.\n\nWatch out\nA full disk can break databases and logs, not only new file uploads.\nClearing files you still need is worse than finding the growth first.", code: `disk = { used: "95%", free: "2 GB" };
if (disk.used > "90%") {
  // logs or uploads may have filled the disk
}` },
    { lang: "js", title: "9. A port is a door number", desc: "What this is\nA port is a number on which a program listens.\nThe host has many doors; each listener takes one.\n\"address already in use\" means that door is taken.\n\nWhat the code is doing\ndoors[22] is remote login.\ndoors[80] is the website.\ndoors[3000] is the node app.\nThe comment states the busy-door error.\n\nWatch out\nThe port is not the pid; stopping the process that holds the port frees it.\nBinding 3000 on localhost is not the same as opening 3000 on the public network.", code: `doors = {
  22: "remote login",
  80: "website",
  3000: "my node app"
};
// "address already in use" means that door is taken` },
    { lang: "txt", title: "10. Keys vs passwords", desc: "What this is\nSSH keys come in a public and private pair.\nThe public key can live on the server.\nThe private key stays on your machine and must not be shared.\n\nWhat the code is doing\npublic_key is labeled as something you may put on the server.\nprivate_key is labeled never share this file.\nThe comment says the server checks the public key while you keep the private key.\nLogin proves you hold the matching private key.\n\nWatch out\nCopying the private key into chat or Git is a credential leak.\nThe public key is not a password you type; the private key does the proof.", code: `public_key  = "you may put this on the server"
private_key = "never share this file"
// the server checks the public key, you keep the private key` }
  ]);

  add("docker", [
    { lang: "txt", title: "1. Image vs container", desc: "What this is\nAn image is a saved recipe for a filesystem and a start command.\nA container is a running instance of that image.\nOne image can start many containers.\n\nWhat the code is doing\nimage is labeled recipe, saved, does not run.\ncontainer is labeled the cake, a running copy.\nThe comment says many cakes can come from one recipe.\nDeleting a container does not delete the image.\n\nWatch out\nChanging a running container does not change the image until you commit or rebuild.\ndocker run starts a container; it does not edit the recipe file.", code: `image     = recipe   (saved, does not run)
container = the cake (running copy of the recipe)
// many cakes can come from one recipe` },
    { lang: "dockerfile", title: "2. A Dockerfile is the recipe", desc: "What this is\nA Dockerfile is the text recipe for an image.\nEach instruction adds a layer.\nFROM, WORKDIR, COPY, RUN, and CMD are the steps here.\n\nWhat the code is doing\nFROM node:20 starts from a Node base image.\nWORKDIR /app sets the working directory.\nCOPY package.json . copies the dependency list.\nRUN npm install installs packages at build time.\nCOPY . . copies the app, then CMD starts node index.js when a container starts.\n\nWatch out\nRUN happens at build; CMD happens at start.\nCopying package.json before the rest of the files lets install stay cached when only app code changes.", code: `FROM node:20          # start from a Node kitchen
WORKDIR /app          # stand in this folder
COPY package.json .   # copy the shopping list
RUN npm install       # install packages (build time)
COPY . .              # copy your code
CMD ["node", "index.js"]  # when the cake starts, run this` },
    { lang: "txt", title: "3. Ports in easy words", desc: "What this is\nPort publish maps a port on your machine to a port in the container.\nThe app still listens inside the container.\nThe browser talks to localhost on your machine.\n\nWhat the code is doing\nThe first line shows laptop port 3000 leading to container port 3000.\nThat inner port is the Node app.\nThe comment says the browser still opens http://localhost:3000.\nWithout that map, the app can run and still be unreachable from the host browser.\n\nWatch out\n3000:3000 is host then container; swapping them by accident binds the wrong door.\nThe app must listen on the container port you published.", code: `your laptop :3000  -->  container :3000  -->  Node app
// the browser still opens http://localhost:3000` },
    { lang: "txt", title: "4. Do not copy junk into the image", desc: "What this is\n.dockerignore lists paths not to send to the build context.\nThose files then cannot be COPY'd from the client context.\nSecrets and huge folders belong on this list.\n\nWhat the code is doing\nnode_modules is listed so the host install is not packed in.\n.git is listed so history is not packed in.\n.env is listed so secrets are not packed in.\nThe array is the do-not-copy list.\n\nWatch out\nIgnoring .env does not remove a secret you already COPY'd in an earlier image layer.\nnode_modules inside the image should come from RUN install, not from the host folder.", code: `do_not_copy = [
  "node_modules",
  ".git",
  ".env"        // secrets do not belong in an image
];` },
    { lang: "yaml", title: "5. Compose = two recipes together", desc: "What this is\nCompose describes more than one container as one project.\nservices lists those containers.\nOne service can build from a Dockerfile; another can pull an image.\n\nWhat the code is doing\napp.build . means build from the Dockerfile in this folder.\napp.ports 3000:3000 publishes the app.\ndb.image postgres:16 pulls that database image.\nPOSTGRES_PASSWORD is set in the db environment.\nTogether they are one compose file.\n\nWatch out\nThe app still needs a connection string to reach db; listing both services does not auto-wire SQL.\nPasswords in compose files are still secrets; do not commit real ones.", code: `services:
  app:
    build: .           # make from Dockerfile
    ports: ["3000:3000"]
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret` },
    { lang: "txt", title: "6. Data must live in a volume", desc: "What this is\nA volume keeps files on the host side of Docker's storage.\nThe container's writable layer is thrown away when the container is removed.\nDatabase files need a volume or named box.\n\nWhat the code is doing\nThe bad line is database files only inside the container.\nThe good line is a volume, a named box on your disk.\nThe comment says the container opens the box each time it starts.\nWithout that, compose down and remove can drop the data.\n\nWatch out\nA volume is not the same as publishing a port.\nPutting data in the image is also wrong; images should stay replaceable.", code: `Bad:  database files only inside the container
Good: volume = a named box on your disk
// the container opens the box each time it starts` },
    { lang: "dockerfile", title: "7. CMD is the start button", desc: "What this is\nCMD is the default process a container runs.\nThe list form runs the program directly, not through a shell.\nThat process should receive stop signals.\n\nWhat the code is doing\nCMD [\"node\", \"index.js\"] starts Node on index.js.\nThe comment says this program is the main process.\nWhen Docker sends stop, that process should close.\nA shell wrapper can swallow signals if you use the wrong form.\n\nWatch out\nCMD is not RUN; RUN is build time.\nIf CMD exits, the container exits.", code: `CMD ["node", "index.js"]
// this program is the main process
// when Docker says stop, this program should close nicely` },
    { lang: "txt", title: "8. Layers are stacked sheets", desc: "What this is\nImage layers stack; each instruction is a sheet.\nUnchanged early sheets can be reused from cache.\nFiles that change often should be copied late.\n\nWhat the code is doing\nSheet 1 is FROM node.\nSheet 2 is COPY package.json plus npm install, which you want cached.\nSheet 3 is COPY your code, which changes often.\nA change in sheet 3 does not redo sheet 2 when the recipe is written this way.\n\nWatch out\nEditing package.json busts the install layer on purpose.\nCOPY . . too early makes every code edit redo npm install.", code: `# sheet 1: FROM node
# sheet 2: COPY package.json + npm install   <- cache this
# sheet 3: COPY your code                    <- this changes often` },
    { lang: "dockerfile", title: "9. Two stages (build then run)", desc: "What this is\nA multi-stage build uses one stage to compile and another to run.\nThe final image copies only the artifacts it needs.\nThe compiler tools stay in the build stage.\n\nWhat the code is doing\nFROM node:20 AS build names the first stage build.\nThe comment stands in for making a dist folder.\nThe second FROM node:20 starts a slimmer runtime stage.\nCOPY --from=build copies /app/dist into ./dist.\nCMD runs node dist/index.js.\n\nWatch out\n--from=build refers to the stage name, not a folder on your laptop.\nIf dist is missing in the build stage, the copy fails.", code: `FROM node:20 AS build
# ... make the dist folder ...

FROM node:20
COPY --from=build /app/dist ./dist
CMD ["node", "dist/index.js"]` },
    { lang: "txt", title: "10. Do not be root if you can avoid it", desc: "What this is\nContainers often default to a root user inside.\nUSER switches to a named user before CMD.\nA compromised app then has fewer privileges.\n\nWhat the code is doing\nUSER node selects the node user.\nCMD still starts node index.js.\nThe comment says if the app is hacked, the attacker is not the boss.\nThis line belongs after the files are in place with the right ownership.\n\nWatch out\nUSER does not fix a secret you baked into the image.\nIf files are owned by root and not readable by node, the app fails at start.", code: `USER node
CMD ["node", "index.js"]
// if the app is hacked, the attacker is not the boss` }
  ]);

  add("kubernetes", [
    { lang: "txt", title: "1. Easy words", desc: "What this is\nKubernetes keeps the number of copies you asked for.\nA Pod is one running place.\nA Deployment owns those copies; a Service names them.\n\nWhat the code is doing\nPod is one running app.\nDeployment is please keep 3 copies.\nService is a stable name so others can find the copies.\nThose three lines are the map.\n\nWatch out\nDeleting a Pod that a Deployment owns just makes a replacement.\nA Service with no matching Pods is a name with no backends.", code: `Pod        = one running app
Deployment = "please keep 3 copies"
Service    = a stable name so others can find the copies` },
    { lang: "yaml", title: "2. A Deployment", desc: "What this is\nA Deployment's spec is the desired Pods.\nreplicas is the count.\ntemplate is the Pod, including image and labels.\n\nWhat the code is doing\nkind Deployment and name api identify the object.\nreplicas 2 asks for two Pods.\nselector matchLabels app api must match the template labels.\nThe container is named api and uses image my-app:1.0.\n\nWatch out\nIf labels on the template do not match the selector, the Deployment never adopts the Pods.\nimage my-app:1.0 must exist in the registry the cluster uses.", code: `kind: Deployment
metadata: { name: api }
spec:
  replicas: 2
  selector:
    matchLabels: { app: api }
  template:
    metadata:
      labels: { app: api }
    spec:
      containers:
        - name: api
          image: my-app:1.0` },
    { lang: "yaml", title: "3. A Service", desc: "What this is\nA Service selects Pods by label and gives them a cluster name.\nselector must match Pod labels.\nport is the Service port others call.\n\nWhat the code is doing\nkind Service and name api identify the object.\nselector app api finds Pods with that label.\nports lists port 80.\nThe comment says find pods with this sticker.\n\nWatch out\nWrong selector means endpoints stay empty.\nThis snippet does not set type LoadBalancer; it is a cluster Service.", code: `kind: Service
metadata: { name: api }
spec:
  selector: { app: api }   # find pods with this sticker
  ports:
    - port: 80` },
    { lang: "yaml", title: "4. Alive vs ready", desc: "What this is\nLiveness and readiness are different questions.\nLiveness failure restarts the container.\nReadiness failure stops sending traffic until it passes.\n\nWhat the code is doing\nlivenessProbe httpGet calls /health on port 3000 and restarts if dead.\nreadinessProbe httpGet calls /ready on port 3000 and withholds traffic if not ready.\nBoth are HTTP checks against your app.\n\nWatch out\nUsing the same path for both can restart a Pod that is only busy, not dead.\nA probe port that the app does not listen on fails forever.", code: `livenessProbe:
  httpGet: { path: /health, port: 3000 }  # restart if dead
readinessProbe:
  httpGet: { path: /ready, port: 3000 }   # no traffic if not ready` },
    { lang: "yaml", title: "5. Settings", desc: "What this is\nA ConfigMap stores non-secret key/value settings.\ndata holds those keys.\nPods can mount or inject them.\n\nWhat the code is doing\nkind ConfigMap and name api-config identify the object.\ndata.MESSAGE is hello.\nThe app would read MESSAGE as configuration, not as a password.\n\nWatch out\nDo not put passwords here; that is a Secret.\nEditing the ConfigMap does not always restart Pods by itself.", code: `kind: ConfigMap
metadata: { name: api-config }
data:
  MESSAGE: "hello"` },
    { lang: "yaml", title: "6. A secret", desc: "What this is\nA Secret stores sensitive keys.\nThe YAML shape is close to ConfigMap.\nstringData lets you write the value in plain text in the manifest.\n\nWhat the code is doing\nkind Secret and name api-secret identify the object.\nstringData.PASSWORD is change-me.\nTreat that value as confidential even in this sample.\n\nWatch out\nCommitting a real password in this file leaks it.\nSecrets in the cluster are still reachable by anyone who can get the object.", code: `kind: Secret
metadata: { name: api-secret }
stringData:
  PASSWORD: "change-me"` },
    { lang: "txt", title: "7. How a request travels", desc: "What this is\nA request hits a stable name, then a Pod.\nIngress is the entry from outside.\nIf a Pod dies, the Service picks another.\n\nWhat the code is doing\nThe path is user to Ingress to Service api to Pod ip:3000.\nThe comment says if a pod dies, Service picks another pod.\nThe Service name api is what other objects call.\n\nWatch out\nWithout a Service, Pod IPs change and clients break.\nIngress without matching Service rules drops the request.", code: `user -> Ingress -> Service "api" -> Pod ip:3000
// if a pod dies, Service picks another pod` },
    { lang: "yaml", title: "8. CPU and memory ask", desc: "What this is\nrequests reserve CPU and memory for the scheduler.\nlimits cap what the container may use.\ncpu 100m is a tenth of a core in this sample.\n\nWhat the code is doing\nresources.requests set cpu 100m and memory 128Mi.\nresources.limits set cpu 500m and memory 256Mi.\nThe scheduler uses requests; the runtime enforces limits.\n\nWatch out\nA tiny request with a huge limit can still starve neighbors if many Pods burst.\nMemory over the limit is usually killed; CPU over the limit is throttled.", code: `resources:
  requests: { cpu: 100m, memory: 128Mi }
  limits:   { cpu: 500m, memory: 256Mi }` },
    { lang: "yaml", title: "9. A one-time Job", desc: "What this is\nA Job runs a Pod until the work finishes.\nrestartPolicy OnFailure retries the container if it crashes.\ncommand overrides the image's default process.\n\nWhat the code is doing\nkind Job and name migrate identify the object.\ntemplate.spec.restartPolicy is OnFailure.\nThe container image is my-app:1.0.\ncommand is node migrate.js, a one-time script.\n\nWatch out\nA Job is not a Deployment; it is not meant to stay at 3 replicas forever.\nA migrate that never exits keeps the Job running.", code: `kind: Job
metadata: { name: migrate }
spec:
  template:
    spec:
      restartPolicy: OnFailure
      containers:
        - name: migrate
          image: my-app:1.0
          command: ["node", "migrate.js"]` },
    { lang: "txt", title: "10. If a pod is sad", desc: "What this is\nA failing Pod is diagnosed by listing, reading events, then logs.\nGuessing the YAML first wastes time.\nThose three places usually hold the reason.\n\nWhat the code is doing\nStep 1 is list pods.\nStep 2 is read the story, the events.\nStep 3 is read the printout, the logs.\nThe comment says the answer is usually in those three places.\n\nWatch out\nCrashLoopBackOff with empty logs often means the process never started; events show image or command errors.\nWaiting without looking does not fix a bad image tag.", code: `1. list pods
2. read the story (events)
3. read the printout (logs)
// the answer is usually in those three places` }
  ]);

  add("devops", [
    { lang: "txt", title: "1. CI then CD", desc: "What this is\nCI checks the commit; CD ships the same package.\nThe pipeline is save, check, then give the server that package.\nYou do not rebuild a different artifact for production if you can avoid it.\n\nWhat the code is doing\nyou save code starts the flow.\nCI is install, test, build.\nCD is give the same package to the server.\nThe arrows are that sequence.\n\nWatch out\nShipping a package that never ran tests is CD without CI.\nA manual copy from a laptop is not the same package CI built.", code: `you save code
   -> CI: install, test, build
   -> CD: give the same package to the server` },
    { lang: "yaml", title: "2. A tiny check file", desc: "What this is\nA workflow file is configuration GitHub runs.\non push starts it.\nsteps are checkout and then a test command.\n\nWhat the code is doing\nname check titles the workflow.\non [push] is the trigger.\njobs.test runs on ubuntu-latest.\ncheckout@v4 copies the repo.\nrun npm test executes the test script.\n\nWatch out\nThis is YAML the host reads, not a script you run by hand as the source of truth.\nIf npm test is missing in package.json, the step fails.", code: `name: check
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test` },
    { lang: "txt", title: "3. Same steps everywhere", desc: "What this is\nLaptop and CI should run the same steps.\nA step that fails should stop deploy.\nThe list is install, test, build.\n\nWhat the code is doing\nsteps holds npm install, npm test, and npm run build.\nThe comment says if a step fails, do not deploy.\nThat list is the contract between local and CI.\n\nWatch out\nA build that only exists on one developer machine will fail on the runner.\nSkipping test in CI to go green hides regressions.", code: `steps = ["npm install", "npm test", "npm run build"]
// if a step fails, do not deploy` },
    { lang: "hcl", title: "4. Infra as a file", desc: "What this is\nInfrastructure as a file means the cloud object is declared in source.\nTerraform resource blocks name the type and local id.\nThe bucket argument is the real cloud name.\n\nWhat the code is doing\nresource aws_s3_bucket photos opens a bucket resource.\nbucket = \"my-photos-demo\" is the S3 name.\nThere is no provider block here; it is the resource shape.\n\nWatch out\nChanging the bucket name in place can force a destroy and create.\nThe Terraform name photos is not the DNS name of the bucket.", code: `resource "aws_s3_bucket" "photos" {
  bucket = "my-photos-demo"
}` },
    { lang: "txt", title: "5. Secrets do not live in Git", desc: "What this is\nGit history keeps deleted secrets.\nA secret box the pipeline can read is the alternative.\nThe repo should hold a reference, not the password.\n\nWhat the code is doing\nThe bad line is password = \"1234\" inside the repo.\nThe good line is a secret box the pipeline can read.\nThat is the whole contrast.\n\nWatch out\nOnce 1234 is pushed, assume it is public and rotate it.\nA comment that still contains the password is still a leak.", code: `Bad:  password = "1234" inside the repo
Good: password lives in a secret box the pipeline can read` },
    { lang: "js", title: "6. A health answer", desc: "What this is\nA health route tells operators the process is alive.\nAfter deploy, something should call it.\nThe handler returns a small JSON object.\n\nWhat the code is doing\napp.get(\"/health\", ...) registers GET /health.\nThe handler sends { ok: true }.\nA load balancer or probe can call this path.\n\nWatch out\nok true does not mean the database is up unless you check it here.\nPutting /health behind login makes probes fail.", code: `app.get("/health", (req, res) => {
  res.json({ ok: true });
});` },
    { lang: "js", title: "7. A useful log line", desc: "What this is\nLogs should identify the event without secrets.\nuserId is a safe-enough handle in this sample.\npassword and token are not.\n\nWhat the code is doing\nconsole.log prints user logged in and { userId: 12 }.\nThe comment says do not log password or token.\nThat is the rule for this line.\n\nWatch out\nJSON-stringifying the whole request will include headers like Authorization.\nDebug flags that print bodies need to be off in production.", code: `console.log("user logged in", { userId: 12 });
// do not log password or token` },
    { lang: "txt", title: "8. If production breaks", desc: "What this is\nOutage response is restore, communicate, then debug.\nThe old package is the restore tool.\nFinding the bug on a down site is the wrong first step.\n\nWhat the code is doing\nStep 1 is put the old package back.\nStep 2 is tell the team.\nStep 3 is then find the bug.\nThe snippet is that order.\n\nWatch out\nNo stored previous package means you cannot roll back.\nTelling the team after a two-hour silent debug duplicates work.", code: `1. put the old package back
2. tell the team
3. then find the bug` },
    { lang: "txt", title: "9. One package, many rooms", desc: "What this is\nBuild once and promote the same image.\nStaging and production should run the same tag.\nOnly settings change between rooms.\n\nWhat the code is doing\nbuild once produces image app:a1b2.\nstaging runs app:a1b2.\nproduction runs the SAME app:a1b2.\nThe comment says only settings change, not the code package.\n\nWatch out\nRebuilding for production can include untested commits.\nA latest tag that moves under you is not a pinned package.", code: `build once -> image:app:a1b2
staging runs app:a1b2
production runs the SAME app:a1b2
// only settings change, not the code package` },
    { lang: "yaml", title: "10. Weekly package updates", desc: "What this is\nDependabot YAML asks GitHub to open update PRs.\nnpm at / is this Node repo.\nweekly is how often it looks.\n\nWhat the code is doing\nversion 2 is the format.\npackage-ecosystem npm and directory / select the lockfile at the root.\nschedule interval weekly sets the cadence.\n\nWatch out\nMerging the PR is still your job.\nIgnoring major bumps forever leaves known holes.", code: `version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule: { interval: weekly }` }
  ]);

  add("aws", [
    { lang: "txt", title: "1. Big boxes in easy words", desc: "What this is\nAWS services are rented building blocks.\nEC2 is compute, S3 is objects, RDS is a database.\nIAM is permission; VPC is the network boundary.\n\nWhat the code is doing\nEC2 is a computer in the cloud.\nS3 is a folder for files.\nRDS is a managed database.\nIAM is who is allowed to do what.\nVPC is your private network.\n\nWatch out\nRenting EC2 is not the same as storing files in S3.\nIAM mistakes look like AccessDenied, not like a missing npm package.", code: `EC2 = a computer in the cloud
S3  = a folder for files
RDS = a managed database
IAM = who is allowed to do what
VPC = your private network` },
    { lang: "js", title: "2. Who am I? (idea)", desc: "What this is\nEvery AWS request is signed as an identity.\nA role is a kind of identity a service can wear.\nThe cloud checks that identity before S3.\n\nWhat the code is doing\nme.account is 123456789012.\nkind is role.\nname is photo-uploader.\nThe comment says the cloud checks me before it allows S3.\n\nWatch out\nA role name is not an access key you paste into the browser.\nThe wrong account id means you are looking at a different place.", code: `const me = {
  account: "123456789012",
  kind: "role",
  name: "photo-uploader"
};
// the cloud checks me before it allows S3` },
    { lang: "js", title: "3. A file in S3", desc: "What this is\nAn S3 object is bucket plus key plus bytes.\nThe key is the path-like name inside the bucket.\nbody is the file content.\n\nWhat the code is doing\nobject.bucket is photos.\nobject.key is cat.jpg.\nobject.body is a placeholder for file bytes.\nTogether they are one stored object.\n\nWatch out\nThe key is not a local filesystem path on EC2 unless you download it.\nTwo objects cannot share the same bucket and key.", code: `const object = {
  bucket: "photos",
  key: "cat.jpg",
  body: "<file bytes>"
};` },
    { lang: "json", title: "4. A tiny IAM rule", desc: "What this is\nAn IAM statement is Effect, Action, and Resource.\nAllow plus a short action list is a narrow grant.\nThe ARN pins the bucket.\n\nWhat the code is doing\nEffect is Allow.\nAction is s3:GetObject and s3:PutObject.\nResource is arn:aws:s3:::photos/*, objects in photos.\nThat is read and write on those keys, not every AWS API.\n\nWatch out\ns3:ListBucket is a bucket-level action and often needs the bucket ARN without /*.\nCopying this statement to Resource * opens every bucket.", code: `{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject"],
  "Resource": "arn:aws:s3:::photos/*"
}` },
    { lang: "js", title: "5. A Lambda function", desc: "What this is\nLambda is a function AWS invokes on an event.\nYou export handler.\nThe return value is the result of that invocation.\n\nWhat the code is doing\nexports.handler is async and receives event.\nIt returns statusCode 200 and body Hello.\nThere is no listen(3000) because AWS invokes this process.\n\nWatch out\nA timeout in the Lambda config kills a slow handler.\nForgetting to export handler means the runtime cannot find the entry.", code: `exports.handler = async function (event) {
  return { statusCode: 200, body: "Hello" };
};` },
    { lang: "txt", title: "6. Public vs private", desc: "What this is\nThe load balancer is the public door.\nThe app and database sit on private networks.\nThe database has no public door in this picture.\n\nWhat the code is doing\nInternet points at the load balancer, marked public.\nYour app is private.\nThe database is private.\nThat stack is the network story.\n\nWatch out\nPutting the database in a public subnet undoes this design.\nPrivate subnets still need a route to reach AWS APIs or NAT if the app needs the internet.", code: `Internet
  -> load balancer   (public)
  -> your app        (private)
  -> database        (private)` },
    { lang: "txt", title: "7. Security group = door list", desc: "What this is\nA security group lists allowed doors.\nThe web group opens HTTP and HTTPS to the world.\nThe database group opens 5432 only to the web group.\n\nWhat the code is doing\nweb doors are 80 and 443 from the world.\ndb doors are 5432 only from the web app.\nThe comment says a closed door is safer than a clever password.\nSSH is omitted here on purpose.\n\nWatch out\nAllowing the world to 5432 bypasses the web tier.\nA security group is not encryption; it is reachability.", code: `web doors:  80 and 443 from the world
db doors:   5432 only from the web app
// a closed door is safer than a clever password` },
    { lang: "js", title: "8. The app reads a URL", desc: "What this is\nThe app reads a host name, port, and database name.\nThat host is an RDS endpoint, not localhost on your laptop.\nPort 5432 is Postgres in this sample.\n\nWhat the code is doing\ndb.host is mydb.xxxx.ap-south-1.rds.amazonaws.com.\ndb.port is 5432.\ndb.name is app.\nThose fields are what a connection string would use.\n\nWatch out\nUsing localhost in production talks to the app box, not RDS.\nA changed password in RDS must be updated in the app config too.", code: `const db = {
  host: "mydb.xxxx.ap-south-1.rds.amazonaws.com",
  port: 5432,
  name: "app"
};` },
    { lang: "json", title: "9. Who may wear this role", desc: "What this is\nA trust policy says who may assume a role.\nPrincipal names that who.\nsts:AssumeRole is the action of putting the role on.\n\nWhat the code is doing\nEffect is Allow.\nPrincipal Service is ec2.amazonaws.com, so EC2 may assume.\nAction is sts:AssumeRole.\nThat is the who-list, not the S3 permissions.\n\nWatch out\nTrust is not the permission policy; without both, the instance still cannot call S3.\nA Principal of * lets unexpected callers try to assume the role.", code: `{
  "Effect": "Allow",
  "Principal": { "Service": "ec2.amazonaws.com" },
  "Action": "sts:AssumeRole"
}` },
    { lang: "txt", title: "10. Where to look when it fails", desc: "What this is\nCloudWatch is application logs.\nCloudTrail is an account's API history.\nAccessDenied points at IAM, not at a missing log line.\n\nWhat the code is doing\nApp errors go to CloudWatch Logs.\nAPI calls go to CloudTrail.\nAccessDenied usually means the role is missing a permission.\nLook in that order for those symptoms.\n\nWatch out\nCloudTrail will not show your console.log output.\nFixing IAM does not fix a crashed process with no logs.", code: `App errors -> CloudWatch Logs
API calls  -> CloudTrail
AccessDenied usually means the role is missing a permission` }
  ]);

  add("react", [
    { lang: "jsx", title: "1. A tiny screen piece", desc: "What this is\nA component is a function that returns UI.\nReact renders that return value into the page.\nJSX is the HTML-like syntax in the return.\n\nWhat the code is doing\nHello returns an h1 with Hello React.\nApp returns <Hello />, so Hello is a child of App.\nThe heading appears because App is the tree you render.\n\nWatch out\nA lowercase <hello /> would be treated as an unknown HTML tag, not this function.\nApp must return one tree; two adjacent elements need a wrapper.", code: `function Hello() {
  return <h1>Hello React</h1>;
}

function App() {
  return <Hello />;
}` },
    { lang: "jsx", title: "2. Pass data (props)", desc: "What this is\nProps are values a parent passes into a child.\nThe child reads them from its parameter.\nThe parent sets them as attributes on the tag.\n\nWhat the code is doing\nHello reads props.name and puts it in the h1.\nApp renders <Hello name=\"Nitin\" />.\nThe heading becomes Hello, Nitin.\nThe data flows parent to child.\n\nWatch out\n{props.name} is a JavaScript expression inside JSX.\nThe child should not mutate props; the parent owns that data.", code: `function Hello(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return <Hello name="Nitin" />;
}` },
    { lang: "jsx", title: "3. Remember a number", desc: "What this is\nuseState stores a value React will redraw when it changes.\nThe first item is the current value.\nThe second item is the setter function.\n\nWhat the code is doing\nuseState(0) starts count at 0.\nThe button onClick calls setCount(count + 1).\nClicked {count} shows the current number.\nEach click schedules a render with a larger count.\n\nWatch out\nCalling setCount is required; count++ does not update the screen.\nThe setter from useState is stable; the count value is not.", code: `import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count}
    </button>
  );
}` },
    { lang: "jsx", title: "4. Show a list", desc: "What this is\nmap turns each array item into an element.\nkey tells React which item is which across renders.\nThe li text is the fruit name.\n\nWhat the code is doing\nfruits is apple and mango.\nList returns a ul.\nmap returns one li per fruit with key={fruit}.\nThe list shows those two names.\n\nWatch out\nMissing key makes React warn and can mix up row state.\nTwo identical strings as keys collide.", code: `const fruits = ["apple", "mango"];

function List() {
  return (
    <ul>
      {fruits.map((fruit) => <li key={fruit}>{fruit}</li>)}
    </ul>
  );
}` },
    { lang: "jsx", title: "5. An input box", desc: "What this is\nA controlled input takes its value from state.\nonChange writes state from the event.\nThe box always shows what React has.\n\nWhat the code is doing\nname starts as \"\".\nvalue={name} displays that string.\nonChange calls setName with e.target.value.\nEach keystroke updates state and the input.\n\nWatch out\nWithout onChange, a value= input cannot type.\ne.target is the DOM input; value is the text in it.", code: `import { useState } from "react";

function NameBox() {
  const [name, setName] = useState("");
  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}` },
    { lang: "jsx", title: "6. Show / hide", desc: "What this is\nA boolean flag can hide or show extra UI.\nsetOpen(!open) flips that flag.\n&& renders the right side only when the left side is true.\n\nWhat the code is doing\nopen starts false.\nThe button Toggle flips it.\n{open && <p>You can see me</p>} shows the paragraph only when open is true.\nClicking again hides it.\n\nWatch out\n!open is boolean not, not a string Hide.\nIf open were 0, && would skip the paragraph because 0 is falsy.", code: `const [open, setOpen] = useState(false);
<button onClick={() => setOpen(!open)}>Toggle</button>
{open && <p>You can see me</p>}` },
    { lang: "jsx", title: "7. After the first paint", desc: "What this is\nuseEffect runs after paint.\nThe dependency array lists values that should re-run the effect.\n[] means run once after the first paint.\n\nWhat the code is doing\nuseEffect is imported from react.\nThe function logs page is ready.\n[] is the dependency list.\nThe log happens after the first render.\n\nWatch out\nOmitting [] re-runs after every render, which can loop if you set state inside.\nThis effect does not load data; it only logs.", code: `import { useEffect } from "react";

useEffect(() => {
  console.log("page is ready");
}, []);` },
    { lang: "jsx", title: "8. Load names", desc: "What this is\nNames start empty and fill after the network returns.\nuseEffect starts the fetch once.\nsetNames puts the mapped names into state.\n\nWhat the code is doing\nnames starts as [].\nfetch(\"/api/users\") requests the list.\nThe first then parses JSON.\nThe second then maps u.name and calls setNames.\nThe empty [] on useEffect keeps this to one fetch.\n\nWatch out\nA loading flag is not in this snippet; the list is empty until data arrives.\nIf the URL 404s, you need a catch; this sample has none.", code: `const [names, setNames] = useState([]);

useEffect(() => {
  fetch("/api/users")
    .then((r) => r.json())
    .then((data) => setNames(data.map((u) => u.name)));
}, []);` },
    { lang: "jsx", title: "9. Two pages", desc: "What this is\nRoutes pick a component from the path.\nLink changes the path in the app.\nRoute path is matched to element.\n\nWhat the code is doing\nLink to=\"/\" is the Home link.\nRoutes wraps the Route list.\npath / renders an h1 Home.\npath /about renders an h1 About.\nThe URL decides which element you see.\n\nWatch out\nThese Routes need a router wrapper such as BrowserRouter in a real app.\npath / and path /about are different matches.", code: `<Link to="/">Home</Link>
<Routes>
  <Route path="/" element={<h1>Home</h1>} />
  <Route path="/about" element={<h1>About</h1>} />
</Routes>` },
    { lang: "jsx", title: "10. A tiny hook", desc: "What this is\nA custom hook is a function whose name starts with use.\nIt can call useState and return values to components.\nHere it shares a boolean and a flipper.\n\nWhat the code is doing\nuseToggle calls useState(false) for on.\nIt returns an array: on, and a function that calls setOn(!on).\nA component can write const [on, toggle] = useToggle().\nThe hook owns the state; the component owns the UI.\n\nWatch out\nHooks cannot be called inside regular loops or conditions.\nReturning an array is a convention like useState; you could return an object instead.", code: `function useToggle() {
  const [on, setOn] = useState(false);
  return [on, () => setOn(!on)];
}` }
  ]);

  add("typescript", [
    { lang: "ts", title: "1. A typed variable", desc: "What this is\nA type annotation names the kind of value a binding may hold.\nnumber, string, and boolean are primitives.\nThe checker uses those names at compile time.\n\nWhat the code is doing\nage is a number starting at 20.\nname is a string Nitin.\nok is a boolean true.\nEach colon is the annotation.\n\nWatch out\nThese types disappear in the compiled JavaScript.\nAssigning a string to age is a type error.", code: `let age: number = 20;
let name: string = "Nitin";
let ok: boolean = true;` },
    { lang: "ts", title: "2. A typed function", desc: "What this is\nA function type lists parameter types and a return type.\na and b are numbers.\nThe result is a number.\n\nWhat the code is doing\nadd takes a and b as number.\nThe : number after the list is the return type.\nreturn a + b implements that.\nadd(2, 3) is a valid call.\n\nWatch out\nadd(\"2\", 3) does not match the parameter types.\nOmitting the return annotation still infers a number here, but writing it documents the contract.", code: `function add(a: number, b: number): number {
  return a + b;
}
add(2, 3);` },
    { lang: "ts", title: "3. An object shape", desc: "What this is\nAn interface is a named object shape.\nid and name are required fields.\nA value typed as User must supply them.\n\nWhat the code is doing\ninterface User lists id number and name string.\nuser is annotated User.\nThe object { id: 1, name: \"Ada\" } matches.\nThat is a valid assignment.\n\nWatch out\nSkipping name fails the shape.\ninterface is not a runtime class; it is erased.", code: `interface User {
  id: number;
  name: string;
}
const user: User = { id: 1, name: "Ada" };` },
    { lang: "ts", title: "4. Optional field", desc: "What this is\nA ? on a property means the property may be omitted.\nRequired fields stay required.\nThe object is still a User without email.\n\nWhat the code is doing\nUser requires name as string.\nemail? is optional.\nconst u = { name: \"Ada\" } is allowed.\nNo email key is present.\n\nWatch out\nu.email is string | undefined, not string.\nOptional is not the same as email: string | null unless you write that.", code: `interface User {
  name: string;
  email?: string;
}
const u: User = { name: "Ada" };` },
    { lang: "ts", title: "5. A list type", desc: "What this is\nT[] means an array whose items are T.\nstring[] is only text items.\nnumber[] is only numbers.\n\nWhat the code is doing\nfruits is string[] with apple and mango.\nmarks is number[] with 80 and 90.\nEach array keeps one item type.\n\nWatch out\nfruits.push(80) is a type error.\nArray<string> is the same idea as string[].", code: `const fruits: string[] = ["apple", "mango"];
const marks: number[] = [80, 90];` },
    { lang: "ts", title: "6. This or that", desc: "What this is\nA union type lets one variable hold more than one kind of value.\nThe bar between number and string means this id may be a number in one assignment and text in another.\nTypeScript still checks both sides, so you cannot treat it as only a number until you check.\n\nWhat the code is doing\nThe first line declares id with type number | string, so both kinds are allowed.\nThen id = 10 stores a number, which matches the left side of the union.\nThen id = \"u-10\" stores text, which matches the right side.\nNothing in this snippet checks which kind is stored before a later use.\n\nWatch out\nA union is one kind at a time, not both at once.\nDo not read .length or do math on id until you have narrowed the type.", code: `let id: number | string;
id = 10;
id = "u-10";` },
    { lang: "ts", title: "7. Maybe empty", desc: "What this is\nnull is allowed only when the type includes it.\n{ name: string } | null is either an object or null.\nYou check before you read name.\n\nWhat the code is doing\nuser starts as null.\nThen it becomes { name: \"Ada\" }.\nif (user !== null) narrows the type.\nconsole.log(user.name) is valid inside that block.\n\nWatch out\nuser.name outside the if is a type error.\nnull and undefined are different; this code allows null only.", code: `let user: { name: string } | null = null;
user = { name: "Ada" };
if (user !== null) {
  console.log(user.name);
}` },
    { lang: "ts", title: "8. React props", desc: "What this is\nA type alias can name props for a component.\nThe function parameter uses that alias.\nJSX attributes must match the fields.\n\nWhat the code is doing\nHelloProps is { name: string }.\nHello takes props: HelloProps.\nThe h1 renders props.name.\nA parent would pass name as a string.\n\nWatch out\nPassing a number for name fails the type check.\nThe alias is not a React runtime propTypes object.", code: `type HelloProps = { name: string };
function Hello(props: HelloProps) {
  return <h1>{props.name}</h1>;
}` },
    { lang: "ts", title: "9. Partial update", desc: "What this is\nPartial<T> makes every property of T optional.\nA patch object can include only the fields you change.\nid can be skipped here.\n\nWhat the code is doing\nUser has id and name, both required on User itself.\nPartial<User> is the type of patch.\npatch supplies only name Ada.\nThat assignment is allowed.\n\nWatch out\nPartial is not Omit; id is optional, not removed from the type forever.\nAn empty object is also a valid Partial<User>.", code: `type User = { id: number; name: string };
const patch: Partial<User> = { name: "Ada" };` },
    { lang: "ts", title: "10. Check unknown data", desc: "What this is\nunknown means you have not validated the value yet.\nYou check the shape at runtime.\nOnly then do you read fields.\n\nWhat the code is doing\ndata is unknown even though the literal has name Ada.\nThe if checks typeof object, that data is truthy, and that name is in data.\nInside, data is treated as { name: string } via assertion.\nconsole.log prints that name.\n\nWatch out\nunknown is not any; property access without a check is an error.\n\"name\" in data does not prove the name field is a string.", code: `const data: unknown = { name: "Ada" };
if (typeof data === "object" && data && "name" in data) {
  console.log((data as { name: string }).name);
}` }
  ]);

  add("nodeexpress", [
    { lang: "js", title: "1. A tiny server", desc: "What this is\nExpress builds an HTTP server in Node.\napp.get handles GET for a path.\nlisten opens the port.\n\nWhat the code is doing\nrequire loads express and express() creates app.\napp.get(\"/\", ...) handles the home path.\nres.send writes Hello from my server.\napp.listen(3000) starts the server on port 3000.\n\nWatch out\nThe handler does not run at startup; it runs when a request matches.\nPort 3000 must be free or listen fails.", code: `const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("Hello from my server");
});

app.listen(3000);` },
    { lang: "js", title: "2. Send JSON", desc: "What this is\nres.json sends an object as JSON.\nAPIs use this instead of an HTML page.\nThe client parses fields like message and ok.\n\nWhat the code is doing\nGET /hello is the route.\nres.json is called with { message: \"Hello\", ok: true }.\nExpress writes JSON and sets the content type.\n\nWatch out\nres.json(undefined) is not a useful API body.\nThis route does not run for POST /hello.", code: `app.get("/hello", function (req, res) {
  res.json({ message: "Hello", ok: true });
});` },
    { lang: "js", title: "3. A value from the URL", desc: "What this is\n:id in the path is a parameter.\nreq.params.id is the string in that slot.\nYou send it back in JSON in this sample.\n\nWhat the code is doing\napp.get(\"/users/:id\", ...) matches /users/5.\nres.json({ id: req.params.id }) echoes that id.\nThe name id matches the :id token.\n\nWatch out\nreq.params.id is a string, even when it looks like 5.\n/users without a segment does not match this route.", code: `app.get("/users/:id", function (req, res) {
  res.json({ id: req.params.id });
});` },
    { lang: "js", title: "4. Read a POST body", desc: "What this is\nexpress.json() parses JSON bodies into req.body.\nPOST handlers read those fields.\nThe reply can echo what was saved.\n\nWhat the code is doing\napp.use(express.json()) installs the parser.\napp.post(\"/users\", ...) handles POST.\nres.json({ saved: req.body.name }) returns the name field.\nThe client must send JSON with a name key.\n\nWatch out\nWithout the parser, req.body is undefined.\nGET will not fill req.body from a JSON body the same way.", code: `app.use(express.json());
app.post("/users", function (req, res) {
  res.json({ saved: req.body.name });
});` },
    { lang: "js", title: "5. A function that runs first", desc: "What this is\nMiddleware runs before later handlers.\nnext() continues the chain.\napp.use attaches it to the app.\n\nWhat the code is doing\nlogger prints req.url.\nnext() passes control onward.\napp.use(logger) runs logger on arriving requests.\nRoutes registered after this still run if next is called.\n\nWatch out\nSkipping next() and skipping res.send hangs the request.\nOrder of app.use versus app.get decides what gets logged.", code: `function logger(req, res, next) {
  console.log(req.url);
  next();
}
app.use(logger);` },
    { lang: "js", title: "6. Not found", desc: "What this is\nA catch-all use() after routes handles unknown paths.\nstatus 404 is the not-found code.\nThe body is a small JSON error.\n\nWhat the code is doing\napp.use((req, res) => ...) matches leftover requests.\nres.status(404) sets the status.\njson { error: \"Not found\" } is the body.\n\nWatch out\nPlacing this before real routes hides those routes.\n404 is not 500; the server understood the request and found no page.", code: `app.use(function (req, res) {
  res.status(404).json({ error: "Not found" });
});` },
    { lang: "js", title: "7. Read a setting", desc: "What this is\nprocess.env.PORT reads an environment setting.\n|| 3000 means use 3000 when PORT is missing.\nlisten uses that number.\n\nWhat the code is doing\nport is process.env.PORT or 3000.\napp.listen(port) binds that port.\nNo secret is hard-coded in this snippet.\n\nWatch out\nPORT is a string from the environment; listen accepts it, but math on it needs Number.\nAn empty string PORT is falsy and falls back to 3000.", code: `const port = process.env.PORT || 3000;
app.listen(port);` },
    { lang: "js", title: "8. Routes in another file", desc: "What this is\nRouter() is a small app that only has routes.\nYou export it and mount it with app.use.\nThe router's / is relative to the mount path.\n\nWhat the code is doing\nexpress.Router() creates router.\nrouter.get(\"/\", ...) sends hello.\nThe comment shows app.use(\"/hello\", router).\nGET /hello then runs that handler.\n\nWatch out\nExporting the router is required for the other file to mount it.\nMounting at /hello means router / is not the site root.", code: `const router = express.Router();
router.get("/", (req, res) => res.send("hello"));
// app.use("/hello", router);` },
    { lang: "js", title: "9. An error box", desc: "What this is\nAn error handler has four parameters.\nerr is the error next(err) passed.\nYou log on the server and send a generic body.\n\nWhat the code is doing\nThe function lists err, req, res, next.\nconsole.log(err.message) records the real message.\nres.status(500).json({ error: \"Server error\" }) is the client answer.\nnext is unused here but required in the signature.\n\nWatch out\nThree arguments is a normal middleware, not this handler.\nSending err.stack to the client leaks internals.", code: `app.use(function (err, req, res, next) {
  console.log(err.message);
  res.status(500).json({ error: "Server error" });
});` },
    { lang: "js", title: "10. A lock on a route", desc: "What this is\nA lock function checks a header before the route.\nMissing authorization returns 401.\nnext() runs the real handler only when the header exists.\n\nWhat the code is doing\nneedLogin reads req.headers.authorization.\nIf it is missing, it returns 401 JSON Please log in.\nnext() runs otherwise.\nYou would pass needLogin before a route handler.\n\nWatch out\nA non-empty header is not a verified login; this sample only checks presence.\nreturn is required so you do not call next after 401.", code: `function needLogin(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Please log in" });
  }
  next();
}` }
  ]);
})();

