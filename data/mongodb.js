window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA.mongodb = {
  notes: [
    { title: "Before you pick Mongo", body: "The problem before\nA blog post is already a nested object: title, tags, comments. Splitting that into five SQL tables made every page a pile of JOINs. Adding a field meant ALTER TABLE and a migration weekend.\n\nWhat this is\nMongo stores one JSON-like document per thing. A collection is the folder. You do not CREATE TABLE first. Still decide what one document means: one student, one post.\n\nWhat it solves\nYou save the object you already have. Fields can appear on the next write. One post with comments inside can be one document.\n\nReal-life example\nA student's file folder: one folder per student, papers stuffed inside. You pick up the whole folder. You do not run down the hall joining three registers unless you must.\n\nUses\nPosts, profiles, catalogs, APIs that return one object. Weak as the only store for money across two records, or reports that join five tables.\n\nWatch out\nUnique emails still need a unique index. Mongo will not guess that rule." },
    { title: "Why Mongo instead of SQL", body: "Before you use this\nKnow the map: database → collection → document. That is roughly database → table → row. _id is the primary key. find is SELECT. updateOne with $set is a partial UPDATE.\n\nWhy we use it\nEmbedding beats a JOIN when you always load the children with the parent. Schema flexibility beats a migration when the product is still changing fields every week. That is the real reason teams pick Mongo — not 'NoSQL is faster'.\n\nWatch out\nTwo documents can skip different fields. Your read code must handle a missing marks. Do not pass req.body into find() — that is NoSQL injection." },
    { title: "Documents", body: "MongoDB stores BSON documents in collections. BSON is a binary JSON-like format with extra types. A document is one object with keys and values. A collection is a group of documents, like a folder. Mongo does not force every document to have the same fields unless you add validation. Nested objects are easy to store together. People pick Mongo when the shape changes often or nests naturally." },
    { title: "Database → collection → document", body: "A database holds collections. A collection holds documents. In SQL, that maps roughly to database, table, row. Documents in one collection can differ. _id is required and unique inside that collection. Mongo indexes _id for you. Do not treat this map as a perfect twin. Documents can nest, which SQL rows usually do not." },
    { title: "_id", body: "_id is the primary key of a document. If you do not send one, Mongo makes an ObjectId for you. An ObjectId is 12 bytes with a timestamp inside. You can use your own _id string. Do not change _id later. Treat it as frozen. Knowing an _id is not permission to read the document. Your API must still check login." },
    { title: "Querying", body: "find({ field: value }, projection) is how you read. A projection picks which fields to return. Operators include $gt, $in, $or, $and, and $elemMatch. Always think about which index supports the filter. An empty filter {} matches the whole collection. find returns a cursor. findOne returns one document or null." },
    { title: "Updates", body: "updateOne and updateMany change documents. $set, $unset, $inc, $push, and $pull are operators. Replacing the whole document is different from operators. upsert inserts if the filter misses. Match on _id when you can. updateMany changes every match. Double-check the filter. Mixing replace and $set is a common wipe bug." },
    { title: "Aggregation", body: "An aggregation is a list of stages. Each stage changes the stream of documents. $match filters, $project reshapes, and $group buckets. $sort orders, $lookup joins, and $unwind flattens arrays. This is how you do reports and joins. Order of stages matters for speed and correctness. Filter first when you can." },
    { title: "Indexes", body: "Indexes help find() and sort. Single field and compound are everyday. Multikey is for arrays. Text, geospatial, and TTL also exist. TTL expires old documents. Explain() shows COLLSCAN versus IXSCAN. Start with the fields in your filter and sort. Huge arrays make huge indexes." },
    { title: "Schema design", body: "Embed means put the child object inside the parent. Reference means store an id and look up another collection. Embed when data is read together and stays small. Reference when the list is large, shared, or unbounded. The 16MB document limit is real. Draw your read patterns first. Unbounded comments[] on a post is a smell." },
    { title: "Transactions", body: "Updating one document is atomic. Other readers will not see a half-written mix of fields from that update. Changing two documents together needs a transaction, or a design that keeps related data in one document. Multi-document ACID exists on replica sets. Prefer one-document designs when they fit. Keep transactions short." },
    { title: "Replica set", body: "A replica set is several mongod nodes: one primary, others secondaries. Writes go to the primary. Secondaries copy the operations. If the primary dies, the set elects a new primary. Read preference can offload reads, with lag risk. You need this in production. A single node has no failover. Backups are still required." },
    { title: "Mongoose", body: "Mongoose is an ODM for Node: it maps collections to models. You define a schema with types, defaults, and validation. You also get hooks and populate(). Lean queries return plain objects when you do not need mongoose documents. Mongoose is extra code, not Mongo itself. Learn both find() styles so you can read either codebase." },
    { title: "Security", body: "Turn auth on. Give the app least privilege roles, not cluster admin. Use TLS and do not expose port 27017 to the world. Never pass user JSON as a query filter. That is NoSQL injection: operators like $ne can match too much. Allow-list the fields you copy. Hash passwords and rotate leaked secrets." },
  ],
  questions: [
    { id: 1, level: "beginner", q: "What is MongoDB?",
      a: "The problem before\nA blog post is already a nested object. Five SQL tables meant a pile of JOINs. A new field meant ALTER TABLE.\n\nWhat this is\nMongoDB stores documents, not rows. A document looks like the JavaScript object you already have. A collection is the folder name.\n\nWhat it solves\nYou save the object. The shape can grow. One post with comments inside can be one document.\n\nReal-life example\nA student's file folder. One folder per student. You pick up the whole folder instead of joining three registers.\n\nUses\nPosts, profiles, catalogs, Node APIs that think in objects. Not a bank ledger you will report across ten tables.\n\nWhat happens\ninsertOne saves an object. Mongo adds _id. find({ city: \"Pune\" }) reads. Two students can have different fields.\n\nWatch out\nExpecting every document to have the same columns. Missing marks is not NULL — the field is absent.",
      code: `{
  "_id": "u1",
  "name": "Ada",
  "marks": 90
}
// one document in a collection named students` },
    { id: 2, level: "beginner", q: "SQL vs Mongo mental model?",
      a: "A database is still a database. A table is like a collection. A row is like a document. A column is like a field.\n\nA join is like $lookup or populate. An index is still an index. The mapping is a starting map, not a perfect twin. Documents can nest.\n\nIn the code: db.students.find({ name: \"Ada\" }) is the collection query. findOne returns one document.\n\nA common mistake is treating nested documents as if they were SQL columns you always JOIN.",
      code: `// SQL idea: row in table students
// Mongo idea: document in collection students
db.students.find({ name: "Ada" });
db.students.findOne({ name: "Ada" });` },
    { id: 3, level: "beginner", q: "What is BSON?",
      a: "BSON is the binary format Mongo actually stores. It looks like JSON when you read it, but it can hold extra types.\n\nObjectId, Date, Decimal128, and binary data are examples. JSON is text. BSON is typed bytes. You still write queries in a JSON-like shape in code.\n\nIn the code: _id is an ObjectId. name is Ada. born is an ISODate.\n\nA common mistake is thinking Mongo stores plain JSON text files on disk.",
      code: `{
  "_id": ObjectId("66f100000000000000000001"),
  "name": "Ada",
  "born": ISODate("1815-12-10T00:00:00Z")
}` },
    { id: 4, level: "beginner", q: "What is _id?",
      a: "_id is the primary key of a document. If you do not send one, Mongo makes an ObjectId for you.\n\nIt must be unique inside that collection. Mongo also indexes _id automatically. Do not change _id. Treat it as frozen.\n\nIn the code: insertOne({ name: \"Ada\" }) lets Mongo add _id. find by ObjectId looks up that document.\n\nA common mistake is updating _id later like any other field.",
      code: `db.students.insertOne({ name: "Ada" });
// Mongo adds _id for you

db.students.find({ _id: ObjectId("66f100000000000000000001") });` },
    { id: 5, level: "beginner", q: "What is an ObjectId?",
      a: "An ObjectId is 12 bytes. Part of it is a timestamp, so you can guess created time. It is unique enough for normal apps.\n\nIt is not a secret password. Knowing someone's ObjectId is not permission to read their data. Your API must still check login. You can use your own _id string if you prefer. Do not treat ObjectId as authorization.\n\nIn the code: ObjectId(...) is stored in id. getTimestamp() reads created time from the id. find uses that _id.\n\nA common mistake is treating a guessed ObjectId as proof the caller may read the row.",
      code: `const id = ObjectId("66f100000000000000000001");
console.log(id.getTimestamp()); // created time is inside the id

db.students.find({ _id: id });` },
    { id: 6, level: "beginner", q: "insertOne vs insertMany?",
      a: "insertOne adds a single document. insertMany adds a list. You can stop on the first error, ordered, or keep going, unordered.\n\nAlways check that the write succeeded. Use insertMany for imports. Use insertOne for create this user. Duplicates on unique indexes will fail the write.\n\nIn the code: insertOne adds Ada with marks 90. insertMany adds Grace and Alan.\n\nA common mistake is insertMany without checking write errors on a unique email.",
      code: `db.students.insertOne({ name: "Ada", marks: 90 });

db.students.insertMany([
  { name: "Grace", marks: 85 },
  { name: "Alan", marks: 88 }
]);` },
    { id: 7, level: "beginner", q: "find vs findOne?",
      a: "find returns a cursor of many matches. findOne returns one document or null.\n\nAn empty filter {} matches the whole collection. Be careful on huge data. Add a filter so you do not scan everything by accident. Limit when you only needed a page.\n\nIn the code: find marks $gte 80 is many. findOne name Ada is one or null. find({}) is the whole collection.\n\nA common mistake is find({}) on a huge collection in an API.",
      code: `db.students.find({ marks: { $gte: 80 } }); // many
db.students.findOne({ name: "Ada" });      // one or null
const empty = db.students.find({});        // careful: whole collection
console.log(empty);` },
    { id: 8, level: "beginner", q: "What is a projection?",
      a: "A projection is the second argument, or { projection: ... }. { name: 1, _id: 0 } means name yes, _id no.\n\nSmaller documents mean less network and less memory. Do not ship password hashes to the browser. _id is included unless you turn it off.\n\nIn the code: find city Pune with name 1, marks 1, _id 0 returns only those fields.\n\nA common mistake is sending the whole document including passwordHash to the UI.",
      code: `db.students.find(
  { city: "Pune" },
  { name: 1, marks: 1, _id: 0 }  // only these fields
);` },
    { id: 9, level: "beginner", q: "How do you update a field?",
      a: "Use updateOne with $set so you only touch the fields you name. If you pass a full document without operators, some APIs replace the whole thing and you can wipe fields.\n\nMatch on _id when you can. updateMany changes every match. Double-check the filter.\n\nIn the code: updateOne matches name Ada and $set marks to 95. Only marks changes.\n\nA common mistake is passing a whole object without $set and erasing other fields.",
      code: `db.students.updateOne(
  { name: "Ada" },
  { $set: { marks: 95 } }  // only marks changes
);` },
    { id: 10, level: "beginner", q: "replaceOne vs updateOne?",
      a: "replaceOne puts a whole new document in. It keeps _id. updateOne applies operators like $set and $inc.\n\nMixing them is a common bug: you meant to change name and you erased marks. Use replace when you really have the full new object. Use $set for partial edits from an API.\n\nIn the code: replaceOne sets name and marks as a full document. updateOne $set only patches marks.\n\nA common mistake is replaceOne with only { name } and losing marks.",
      code: `db.students.replaceOne(
  { _id: id },
  { name: "Ada", marks: 95 }  // full new document
);

db.students.updateOne(
  { _id: id },
  { $set: { marks: 95 } }     // patch
);` },
    { id: 11, level: "beginner", q: "What is upsert?",
      a: "If the filter matches, Mongo updates. If not, it inserts a new document. Useful for set this settings key.\n\nYou want a unique index on the match fields, or two requests can insert two rows. Be explicit about which fields are the identity. upsert on a loose filter is how duplicate configs are born.\n\nIn the code: updateOne { key: \"theme\" } $set value dark with upsert true inserts if key is missing.\n\nA common mistake is upsert with a filter that can match many docs.",
      code: `db.settings.updateOne(
  { key: "theme" },
  { $set: { value: "dark" } },
  { upsert: true }  // insert if key is missing
);` },
    { id: 12, level: "beginner", q: "deleteOne vs deleteMany?",
      a: "deleteOne removes the first match. deleteMany removes every match. deleteMany({}) deletes all documents in the collection. That is scary.\n\nPrefer a tight filter, usually _id. drop() is even stronger: it removes the collection and its indexes.\n\nIn the code: deleteOne name Ada. deleteMany marks $lt 40. The comment warns about deleteMany({}).\n\nA common mistake is deleteMany({}) in production thinking it was a test.",
      code: `db.students.deleteOne({ name: "Ada" });
db.students.deleteMany({ marks: { $lt: 40 } }); // all failing rows
// deleteMany({}) would remove every document
const gone = { ok: true };` },
    { id: 13, level: "beginner", q: "What is a cursor?",
      a: "A cursor is a pointer that loads results in batches, not always one giant array. toArray() is easy but can blow memory on large results.\n\nIterate, or paginate with limit. The server does not want to ship a million documents in one gulp. Close or exhaust the cursor in long jobs.\n\nIn the code: find city Pune with limit 20. forEach prints each doc.name one at a time.\n\nA common mistake is toArray() on an unbounded find.",
      code: `const cursor = db.students.find({ city: "Pune" }).limit(20);

cursor.forEach(function (doc) {
  console.log(doc.name);  // one at a time
});` },
    { id: 14, level: "beginner", q: "countDocuments vs estimatedDocumentCount?",
      a: "countDocuments uses your filter and is accurate. estimatedDocumentCount uses metadata. It is fast, approximate, and does not apply your filter.\n\nUse the estimate for a dashboard about how big this collection is. Use countDocuments when the number must be right for a query. Counting a huge filtered collection can still be slow without an index.\n\nIn the code: countDocuments { city: \"Pune\" } is exact. estimatedDocumentCount is a fast guess for all docs.\n\nA common mistake is estimatedDocumentCount when you needed how many in Pune.",
      code: `db.students.countDocuments({ city: "Pune" }); // exact for this filter
db.students.estimatedDocumentCount();         // fast guess for all docs
// use the estimate for a dashboard, the exact count for a query
const n = 0;` },
    { id: 15, level: "intermediate", q: "$gt $gte $lt $lte $ne $in $nin?",
      a: "$gt is greater than. $gte is greater or equal. $lt and $lte are the less-than pair. $ne is not equal. $in is one of these. $nin is none of these.\n\nYou can combine two on the same field for a range. Put an index on fields you range over a lot. $in with a huge list can still be heavy.\n\nIn the code: marks $gte 18 and $lt 65, city $in Pune or Delhi.\n\nA common mistake is $in with ten thousand ids and no index plan.",
      code: `db.students.find({
  marks: { $gte: 18, $lt: 65 },
  city: { $in: ["Pune", "Delhi"] }
});` },
    { id: 16, level: "intermediate", q: "$or and $and?",
      a: "Listing fields in one object is already AND. $or takes an array of alternative clauses. $and is useful when you need two conditions on the same field in a way the object merge cannot express.\n\nIndexing $or can be harder. Prefer a structure that uses AND plus an index when you can. Keep $or lists short and indexed.\n\nIn the code: $or city Pune or marks $gte 90.\n\nA common mistake is a huge $or of unindexed fields.",
      code: `db.students.find({
  $or: [
    { city: "Pune" },
    { marks: { $gte: 90 } }
  ]
});` },
    { id: 17, level: "intermediate", q: "How do you query nested fields?",
      a: "Use dot notation: address.city. That matches a nested object, not a string that happens to contain a dot.\n\nFor arrays of objects, you may need $elemMatch when two conditions must hit the same element. Index address.city if you filter on it often. Do not confuse nested objects with a string path in your app until you save it nested.\n\nIn the code: find { \"address.city\": \"Pune\" }. The example document has address.city and pin.\n\nA common mistake is storing address as a string and querying address.city.",
      code: `db.students.find({ "address.city": "Pune" });

// document shape:
// { name: "Ada", address: { city: "Pune", pin: "411001" } }` },
    { id: 18, level: "intermediate", q: "$elemMatch why?",
      a: "If you write scores.subject math and scores.mark $gt 90, Mongo can match subject on one array item and mark on another. $elemMatch says both conditions must be true on the same element.\n\nThis bug is easy to miss in tests with only one score. Use $elemMatch whenever two filters talk about one array object.\n\nIn the code: scores $elemMatch subject math and mark $gt 90. Both must be true on the SAME array item.\n\nA common mistake is two dotted fields on an array without $elemMatch.",
      code: `db.students.find({
  scores: { $elemMatch: { subject: "math", mark: { $gt: 90 } } }
});
// both conditions must be true on the SAME array item` },
    { id: 19, level: "intermediate", q: "querying arrays?",
      a: "Equality can mean this exact array or this value is in the array, depending on what you pass. $all means all listed values appear. $size is the length.\n\nA multikey index helps find documents by an array value. Unbounded arrays, comments forever, are a schema smell. Know whether you stored strings or objects in the array.\n\nIn the code: tags mongo means the tag is in the list. $all sql and mongo. $size 2.\n\nA common mistake is matching the exact array [mongo] when you meant contains mongo.",
      code: `db.posts.find({ tags: "mongo" });           // tag is in the list
db.posts.find({ tags: { $all: ["sql", "mongo"] } });
db.posts.find({ tags: { $size: 2 } });
// unbounded tag lists still make huge documents` },
    { id: 20, level: "intermediate", q: "$push $pull $addToSet $pop?",
      a: "$push appends. $addToSet appends only if the value is new. $pull removes matching values. $pop removes from one end. $each lets you push several items in one update.\n\nThese updates are atomic on that one document. Do not grow arrays forever. Split a collection instead.\n\nIn the code: updateOne $addToSet tags beginner and $push history edited.\n\nA common mistake is $push on a comments array that never stops growing.",
      code: `db.posts.updateOne(
  { _id: postId },
  { $addToSet: { tags: "beginner" }, $push: { history: "edited" } }
);` },
    { id: 21, level: "intermediate", q: "$inc $mul $min $max?",
      a: "$inc adds, likes += 1. $mul multiplies. $min and $max only change the value if the new number is smaller or larger.\n\n$inc on one document does not need a transaction for a simple counter. Read-then-write in app code can lose an increment. Use $inc for counts, not for rewriting the whole document.\n\nIn the code: updateOne $inc likes 1 is atomic +1.\n\nA common mistake is find, likes+1 in JS, then $set likes, so two clicks can lose one.",
      code: `db.posts.updateOne(
  { _id: postId },
  { $inc: { likes: 1 } }  // atomic +1
);` },
    { id: 22, level: "intermediate", q: "What is atomicity in MongoDB?",
      a: "Updating a single document is atomic: other readers will not see a half-written mix of fields from that update. Changing two documents together needs a transaction, or a design that keeps related data in one document.\n\nThis is why embedding related data is popular. Multi-document transactions exist on replica sets, with extra cost. Prefer one-document designs when they fit.\n\nIn the code: $inc balance -10 and $push log paid change together on this one document.\n\nA common mistake is two updateOnes for one money move with no session.",
      code: `db.accounts.updateOne(
  { _id: "ada" },
  { $inc: { balance: -10 }, $push: { log: "paid" } }
); // both fields change together on this one document` },
    { id: 23, level: "intermediate", q: "embed vs reference?",
      a: "Embed means put the child object inside the parent. One read. Size limit. Copies if shared. Reference means store an id and look up the other collection. More queries or $lookup. Better for big or shared lists.\n\nEmbed when you always read it together and it stays small. Reference when many parents share one child, or the list has no end. Draw your read patterns first.\n\nIn the code: the first document embeds address.city. The second stores cityId as a reference.\n\nA common mistake is embedding millions of likes inside the user.",
      code: `// embed: address lives on the user
{ _id: "u1", name: "Ada", address: { city: "Pune" } }

// reference: city id points elsewhere
{ _id: "u1", name: "Ada", cityId: "pune" }` },
    { id: 24, level: "intermediate", q: "unbounded arrays problem?",
      a: "An array that grows forever makes huge documents. Updates rewrite a lot of data. Cache and RAM suffer. You can hit 16MB.\n\nPut comments in their own collection with postId instead. A short list of tags is fine. A lifetime of events is not. Cap or split early.\n\nIn the code: comments.insertOne with postId p1, text, createdAt. Better than posts.comments[] forever.\n\nA common mistake is comments[] on the post with no cap.",
      code: `// better than posts.comments[] forever
db.comments.insertOne({
  postId: "p1",
  text: "nice",
  createdAt: new Date()
});` },
    { id: 25, level: "intermediate", q: "16MB document limit?",
      a: "One document cannot be larger than 16 megabytes of BSON. Do not store big files as base64 inside the document.\n\nUse object storage, S3, plus a URL field, or GridFS if you must stay in Mongo. Even before 16MB, huge documents are slow to load. Keep documents focused on one thing.\n\nIn the code: the document stores name and a url to s3. The file lives outside the document.\n\nA common mistake is base64 of a video inside the document.",
      code: `{
  "_id": "file1",
  "name": "photo.jpg",
  "url": "s3://bucket/photo.jpg"
}
// store the file outside the document` },
    { id: 26, level: "intermediate", q: "schema validation?",
      a: "You can attach a JSON Schema validator to a collection. Then inserts that miss required fields can be rejected.\n\nIt is optional. Production apps benefit so random fields do not pile up forever. Mongoose schemas are a similar idea in Node. Validation is not a replacement for app checks, but it helps.\n\nIn the code: createCollection students with $jsonSchema required name as a string.\n\nA common mistake is relying on a flexible collection forever with no rules.",
      code: `db.createCollection("students", {
  validator: {
    $jsonSchema: {
      required: ["name"],
      properties: { name: { bsonType: "string" } }
    }
  }
});` },
    { id: 27, level: "intermediate", q: "What is Mongoose?",
      a: "Mongoose is an ODM: a helper that maps collections to models in Node. You define a schema with types, defaults, and validation.\n\nYou also get hooks and populate(). You can use the official Mongo driver without Mongoose. Many Node apps still like Mongoose. It is extra code, not Mongo itself. Learn both find() styles so you can read either codebase.\n\nIn the code: studentSchema has name String and marks Number. Student.create inserts Ada.\n\nA common mistake is thinking Mongoose is MongoDB itself.",
      code: `const studentSchema = new mongoose.Schema({
  name: String,
  marks: Number
});
const Student = mongoose.model("Student", studentSchema);
await Student.create({ name: "Ada", marks: 90 });` },
    { id: 28, level: "intermediate", q: "Mongoose populate?",
      a: "populate() loads related documents using stored ObjectIds. It is convenient. Nested populate can become N+1 queries.\n\nFor reports, an aggregation $lookup or a lean query you control can be faster. It is not a SQL JOIN inside one engine trip every time. Use it for app pages. Measure it for lists.\n\nIn the code: Post.findById(id).populate(\"authorId\") fills author fields. console.log post.authorId.name. Extra queries happen behind populate.\n\nA common mistake is nested populate on a list of 1000 posts.",
      code: `const post = await Post.findById(id).populate("authorId");
// authorId was an ObjectId; now author fields are filled in
console.log(post.authorId.name);
// extra queries happen behind populate` },
    { id: 29, level: "intermediate", q: "lean()?",
      a: "By default Mongoose gives you a fat document with save(), getters, and change tracking. lean() returns a plain object. Faster. Less memory.\n\nYou cannot .save() that result. It is for read-only APIs. Use it on list endpoints. Keep full documents when you will edit and save.\n\nIn the code: Student.find({ city: \"Pune\" }).lean() then res.json(rows). You cannot .save() a lean result.\n\nA common mistake is .lean() then calling .save() on the result.",
      code: `const rows = await Student.find({ city: "Pune" }).lean();
// plain objects, good for res.json(rows)
res.json(rows);
// you cannot .save() a lean result` },
    { id: 30, level: "intermediate", q: "Mongoose middleware (hooks)?",
      a: "Hooks run before or after save, delete, and some other actions. They do not run for every updateMany or for raw driver calls.\n\nIf your always hash the password logic lives only in a save hook, a bulk update can skip it. Put must-never-skip rules in the service if needed. Hooks are great for timestamps and small defaults.\n\nIn the code: pre save trims this.name. It runs on save(), not on updateMany. Bulk updates skip this hook.\n\nA common mistake is hashing passwords only in pre('save') then using updateOne.",
      code: `studentSchema.pre("save", function () {
  this.name = this.name.trim(); // runs on save(), not on updateMany
});
// bulk updates skip this hook` },
    { id: 31, level: "intermediate", q: "What is an aggregation pipeline?",
      a: "An aggregation is a list of stages. Each stage changes the stream of documents. It is like Unix pipes, or like SQL GROUP BY plus extra steps.\n\n$match, $group, $sort, $project are the everyday stages. This is how you join with $lookup and how you build dashboards. Order of stages matters for speed and for correctness.\n\nIn the code: $match marks $gte 40, then $group by city with $sum 1.\n\nA common mistake is $group first on the whole collection when a $match would cut most rows.",
      code: `db.students.aggregate([
  { $match: { marks: { $gte: 40 } } },
  { $group: { _id: "$city", n: { $sum: 1 } } }
]);` },
    { id: 32, level: "intermediate", q: "$match early why?",
      a: "Filter first so later stages see fewer documents. A $match at the start can use an index, like a WHERE.\n\nA $match after a huge $unwind is late: you already exploded the data. Put cheap filters up front. This is the same idea as SQL: filter before you group when you can.\n\nIn the code: $match status paid first, then $group by city summing cents.\n\nA common mistake is $unwind everything, then $match at the end.",
      code: `db.orders.aggregate([
  { $match: { status: "paid" } }, // first, uses an index
  { $group: { _id: "$city", total: { $sum: "$cents" } } }
]);` },
    { id: 33, level: "intermediate", q: "$project vs $set / $addFields?",
      a: "$project can keep, hide, and compute fields. It can drop everything you did not list, plus _id rules. $addFields / $set add or overwrite fields and keep the rest.\n\nBeginners accidentally drop fields with $project. Use $set when you only wanted to add one computed field. Use $project when the output should be a tight DTO.\n\nIn the code: $addFields pass is marks >= 40. $project keeps name and pass, drops _id.\n\nA common mistake is $project { pass: 1 } and wondering where name went.",
      code: `db.students.aggregate([
  { $addFields: { pass: { $gte: ["$marks", 40] } } },
  { $project: { name: 1, pass: 1, _id: 0 } }
]);` },
    { id: 34, level: "intermediate", q: "$group?",
      a: "_id is the group key, like city. Accumulators fill the rest: $sum, $avg, $min, $max, $push, $addToSet.\n\n_id can be a document with several fields if you group on more than one thing. $group does not keep leftover fields unless you accumulate them. This is Mongo's GROUP BY.\n\nIn the code: $group _id $city, total $sum 1, avg $avg $marks.\n\nA common mistake is expecting name to survive $group without an accumulator.",
      code: `db.students.aggregate([
  { $group: { _id: "$city", total: { $sum: 1 }, avg: { $avg: "$marks" } } }
]);
// _id is the group key, like GROUP BY city` },
    { id: 35, level: "intermediate", q: "$unwind?",
      a: "$unwind makes one output document per array element. That can explode the count: 10 posts with 100 comments become 1000 rows.\n\npreserveNullAndEmptyArrays keeps documents with empty arrays if you need them. Filter before unwind when you can. After unwind, $group can rebuild a list.\n\nIn the code: $unwind tags, then $group by tags counting n.\n\nA common mistake is $unwind a huge array with no earlier $match.",
      code: `db.posts.aggregate([
  { $unwind: "$tags" },
  { $group: { _id: "$tags", n: { $sum: 1 } } }
]);` },
    { id: 36, level: "intermediate", q: "$lookup?",
      a: "$lookup is a left outer join to another collection. You can match localField to foreignField, or run a sub-pipeline.\n\nIt is slower than embedding data you always need together. Fine when references are the right model. Index the foreign field.\n\nIn the code: orders $lookup from users, localField userId, foreignField _id, as user.\n\nA common mistake is $lookup on every request for data you could have embedded.",
      code: `db.orders.aggregate([
  { $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
  }}
]);` },
    { id: 37, level: "intermediate", q: "$sort $skip $limit pagination?",
      a: "$skip + $limit is like SQL OFFSET. Deep pages get slow. Prefer a range: sort by a unique key, then $match that key greater than the last you saw.\n\nAlways cap limit. Cursors, _id or createdAt+_id, stay stable as new rows arrive. Index the sort fields.\n\nIn the code: find _id $gt lastId, sort _id 1, limit 10. Cursor pagination, not OFFSET.\n\nA common mistake is skip(10000).limit(10) on a hot feed.",
      code: `db.posts.find({ _id: { $gt: lastId } })
  .sort({ _id: 1 })
  .limit(10);
// cursor pagination: after this last id, not OFFSET` },
    { id: 38, level: "advanced", q: "allowDiskUse?",
      a: "allowDiskUse: true lets the aggregation spill to disk. That is a warning sign the pipeline is heavy, but it can finish.\n\nPrefer a better $match first so you never need the floor. Reports can set this. A hot user-facing API should rarely need it. Watch time and disk when you enable it.\n\nIn the code: $sort createdAt -1 with allowDiskUse true. Spilling to disk means the pipeline is heavy.\n\nA common mistake is allowDiskUse on a user-facing list instead of adding $match.",
      code: `db.orders.aggregate([
  { $sort: { createdAt: -1 } }
], { allowDiskUse: true });
// spilling to disk means the pipeline is heavy` },
    { id: 39, level: "intermediate", q: "What indexes does Mongo support?",
      a: "Single field and compound, several fields, are everyday. Multikey is for arrays. TTL expires old docs. Unique enforces uniqueness.\n\nText, 2dsphere for maps, hashed for sharding, wildcard, partial, and sparse also exist. You will not use all of them on day one. Start with the fields in your find() filter and sort.\n\nIn the code: createIndex city 1. Compound city and marks. TTL on sessions createdAt.\n\nA common mistake is creating every index type before you have a slow query.",
      code: `db.students.createIndex({ city: 1 });                 // single
db.students.createIndex({ city: 1, marks: -1 });      // compound
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
// start with the fields you filter and sort on` },
    { id: 40, level: "intermediate", q: "compound index prefix rule?",
      a: "Index { a: 1, b: 1, c: 1 } can support queries on a, on a+b, and on a+b+c. It does not help a query that only has b.\n\nEquality on the left, then the next field, is the happy path. Sort can use the index if it lines up. Put the field you always have first.\n\nIn the code: index studentId, courseId. find both fields. find only studentId still uses the prefix.\n\nA common mistake is querying only courseId on an index that starts with studentId.",
      code: `db.enroll.createIndex({ studentId: 1, courseId: 1 });
db.enroll.find({ studentId: "s1", courseId: "c1" });
// prefix studentId also helps find({ studentId: "s1" })
db.enroll.find({ studentId: "s1" });` },
    { id: 41, level: "advanced", q: "ESR rule?",
      a: "ESR means Equality, then Sort, then Range. Put fields you equal-match first, then the sort field, then the range $gt.\n\nIt is a guideline, not a law. Explain() is the judge. If your query is city = Pune, sort by marks, marks > 50, try that order in the index. Measure. Guessing index order is a common time sink.\n\nIn the code: index city, marks -1, year. find city Pune year $gte 2020 sort marks -1.\n\nA common mistake is putting the range field first in a compound index.",
      code: `// filter equality city, sort marks, range year
db.students.createIndex({ city: 1, marks: -1, year: 1 });
db.students.find({ city: "Pune", year: { $gte: 2020 } }).sort({ marks: -1 });
// ESR: equality, sort, range` },
    { id: 42, level: "intermediate", q: "multikey index?",
      a: "Mongo writes one index entry per array value, multikey. That is how find({ tags: 'mongo' }) stays fast.\n\nYou cannot freely make a compound index of two array fields in the usual way. Huge arrays mean huge indexes. That is another reason unbounded arrays hurt.\n\nIn the code: createIndex tags 1. find tags mongodb. One index entry per tag value.\n\nA common mistake is a compound index on two array fields.",
      code: `db.posts.createIndex({ tags: 1 }); // multikey
db.posts.find({ tags: "mongodb" });
// one index entry per tag value
const tag = "mongodb";` },
    { id: 43, level: "intermediate", q: "TTL index?",
      a: "A TTL index is on a Date field plus expireAfterSeconds. Mongo deletes old documents in the background. It is not exact to the millisecond.\n\nSessions and logs are the usual use. The field must be a Date, not a string. Do not TTL your source-of-truth orders unless that is really the product.\n\nIn the code: sessions index createdAt with expireAfterSeconds 3600.\n\nA common mistake is a string timestamp field and wondering why TTL never fires.",
      code: `db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }
);` },
    { id: 44, level: "intermediate", q: "unique index?",
      a: "A unique index refuses a second document with the same key. Partial unique indexes can say unique only when email exists.\n\nSafe upserts need a unique index on the match fields. Without it, two signups at the same time can create two Adas. Handle the duplicate-key error in your API, 409.\n\nIn the code: unique index on email. insertOne ada@test.com. A second insert fails. dup code 11000.\n\nA common mistake is upsert without a unique index, so duplicates appear.",
      code: `db.users.createIndex({ email: 1 }, { unique: true });
db.users.insertOne({ email: "ada@test.com" });
// a second insert with the same email fails
const dup = { code: 11000 };` },
    { id: 45, level: "intermediate", q: "text index?",
      a: "A text index tokenizes string fields so you can $text search words. It is fine for simple search. Ranking is not as rich as a real search engine.\n\nYou usually get one text index per collection, with some exceptions as versions change. Keep the idea simple. For product search at scale, people add a search service. Language settings change stemming.\n\nIn the code: text index on title and body. find $text $search mongodb index.\n\nA common mistake is expecting Google-quality ranking from $text.",
      code: `db.posts.createIndex({ title: "text", body: "text" });
db.posts.find({ $text: { $search: "mongodb index" } });
// simple word search, not a full search engine
const q = "mongodb index";` },
    { id: 46, level: "intermediate", q: "explain()?",
      a: "explain() shows the winning plan: COLLSCAN versus IXSCAN. Look at how many documents were examined versus returned.\n\nIf examined is huge and returned is tiny, the index is a poor fit. Run it in Compass or in code before you ship a hot query. Winning plan is the one Mongo chose.\n\nIn the code: find city Pune explain executionStats. Look for IXSCAN, not COLLSCAN, on a large collection.\n\nA common mistake is shipping a hot filter with no explain.",
      code: `db.students.find({ city: "Pune" }).explain("executionStats");
// look for IXSCAN, not COLLSCAN, on a large collection
const plan = { stage: "IXSCAN" };
console.log(plan.stage);` },
    { id: 47, level: "advanced", q: "covered query?",
      a: "If the filter and the projection fields all live in the index, the query can be covered. explain may show totalDocsExamined: 0.\n\nProjections that ask for extra fields break coverage. _id is in the default index, so excluding _id can matter for coverage on a secondary index. This is an advanced speed trick, not day-one homework.\n\nIn the code: index city and name. find city Pune projection name 1 _id 0. Extra fields in the projection break coverage.\n\nA common mistake is adding email to the projection and losing coverage.",
      code: `db.students.createIndex({ city: 1, name: 1 });
db.students.find({ city: "Pune" }, { name: 1, _id: 0 });
// both city and name are in the index
// extra fields in the projection break coverage` },
    { id: 48, level: "intermediate", q: "COLLSCAN?",
      a: "COLLSCAN means Mongo read every document to answer you. Fine on a tiny collection. Painful on millions of rows with a selective filter.\n\nAdd an index, or change the query so an index applies. explain() is how you confirm. A COLLSCAN on a 20-document homework set is not a scandal.\n\nIn the code: explain on find city Pune. COLLSCAN means no useful index. createIndex city 1.\n\nA common mistake is panicking at COLLSCAN on a 12-document homework collection.",
      code: `db.students.find({ city: "Pune" }).explain();
// "winningPlan.stage": "COLLSCAN" means no useful index
db.students.createIndex({ city: 1 });
const hint = { city: 1 };` },
    { id: 49, level: "beginner", q: "What is a replica set?",
      a: "A replica set is several mongod nodes: one primary, others secondaries. Writes go to the primary. Secondaries copy the operations.\n\nIf the primary dies, the set elects a new primary. You need this in production. A single node has no failover. Backups are still required. Copies can copy a mistake.\n\nIn the code: rs0 has three members mongo1, mongo2, mongo3.\n\nA common mistake is a single mongod in production with no replica set.",
      code: `{
  "_id": "rs0",
  "members": [
    { "host": "mongo1:27017" },
    { "host": "mongo2:27017" },
    { "host": "mongo3:27017" }
  ]
}` },
    { id: 50, level: "intermediate", q: "primary vs secondary?",
      a: "The primary takes writes. Secondaries apply the oplog and can serve reads if you ask.\n\nReads on secondaries may be slightly old, lag. Send writes to the primary. That is the default. Reporting can use secondaries if stale data is OK.\n\nIn the code: insertOne Ada goes to the primary. readPreference secondary may read a copy that is a little behind.\n\nA common mistake is reading your own just-written row from a lagged secondary.",
      code: `db.students.insertOne({ name: "Ada" }); // primary
// readPreference: "secondary" may read a copy that is a little behind
const write = { where: "primary" };
const maybeStaleRead = { where: "secondary" };` },
    { id: 51, level: "intermediate", q: "oplog?",
      a: "The oplog is a capped collection of operations: inserts, updates, deletes. Secondaries play those operations in order.\n\nIf a secondary is down too long, the oplog may have rolled off and a full resync is needed. Oplog size is an ops decision. Change streams also read this history.\n\nIn the code: an oplog-like object has op i, ns school.students, o the Ada document.\n\nA common mistake is treating the oplog as a forever audit log.",
      code: `// oplog entries look like operations, not your full documents
{
  "op": "i",
  "ns": "school.students",
  "o": { "_id": "u1", "name": "Ada" }
}` },
    { id: 52, level: "intermediate", q: "write concern?",
      a: "w: 1 is only the primary. Faster, less safe. w: majority waits for most of the replica set. Safer, a bit slower.\n\nJournaling on disk is part of not losing the write on a crash. Production APIs often use majority. Too-low write concern plus failover can lose a write the app thought succeeded.\n\nIn the code: insertOne Ada with writeConcern w majority.\n\nA common mistake is w: 0 fire-and-forget for a payment.",
      code: `db.students.insertOne(
  { name: "Ada" },
  { writeConcern: { w: "majority" } }
);` },
    { id: 53, level: "intermediate", q: "read concern?",
      a: "local is the default-ish simple read. majority means the data is acknowledged by a majority. linearizable is even stricter and slower.\n\nAfter a failover, majority reads avoid seeing data that gets undone. Most apps start with local and learn majority when they care about failover. Pair it with write concern in your head.\n\nIn the code: find Ada with readConcern majority.\n\nA common mistake is majority writes then local reads that can roll back.",
      code: `db.students.find({ name: "Ada" }).readConcern("majority");
// majority: data a replica set majority has acknowledged
const safer = { readConcern: "majority" };
console.log(safer);` },
    { id: 54, level: "advanced", q: "read preference?",
      a: "primary is always the newest writes. secondary offloads reads but can be stale. nearest picks low latency and might be a secondary. primaryPreferred tries primary, then falls back.\n\nChat after a write should usually read primary. Set this on the client, not as a random per-query guess unless you know why.\n\nIn the code: find city Pune with readPref secondaryPreferred. nearest or secondary can be slightly old.\n\nA common mistake is nearest for a screen that must show the write you just did.",
      code: `db.students.find({ city: "Pune" }).readPref("secondaryPreferred");
// nearest or secondary can be slightly old
const pref = "secondaryPreferred";
console.log(pref);` },
    { id: 55, level: "advanced", q: "what happens on failover?",
      a: "The set elects a new primary. Writes pause briefly. Writes that were not majority-acknowledged might roll back.\n\nClients should retry. Drivers often help if retryable writes are on. Design the app to survive a retry, especially payments, idempotency. Health checks and connection strings should list the replica set.\n\nIn the code: updateOne marks 95 with w majority, less likely to vanish after failover.\n\nA common mistake is no retry and no majority on a write you cannot lose.",
      code: `db.students.updateOne(
  { _id: "u1" },
  { $set: { marks: 95 } },
  { writeConcern: { w: "majority" } }
); // less likely to vanish after failover` },
    { id: 56, level: "intermediate", q: "What is sharding?",
      a: "Sharding is horizontal partitioning: each shard holds a slice of the data. You choose a shard key that decides the slice.\n\nUse it when one replica set cannot hold the data or the write load. It adds ops complexity. Do not shard a small app for fashion. mongos routes queries to the right shard.\n\nIn the code: shardCollection school.students by city and _id.\n\nA common mistake is sharding a tiny collection because it sounds advanced.",
      code: `sh.shardCollection("school.students", { city: 1, _id: 1 });
// documents are split by shard key, not stored on one replica set only
const key = { city: 1, _id: 1 };
console.log(key);` },
    { id: 57, level: "advanced", q: "shard key choice?",
      a: "A good shard key has many values, spreads writes, and matches how you query. A monotone key like only createdAt or only ObjectId can send all new writes to one hot chunk.\n\nHashed keys spread writes but hurt range queries. Query isolation matters: if you always query by city, city as prefix can help. This choice is hard to change later. Think twice.\n\nIn the code: the risky comment is sharding logs only on rising _id. hashed userId spreads writes.\n\nA common mistake is sharding only on createdAt so today all hits one chunk.",
      code: `// risky hotspot: only rising _id
// sh.shardCollection("logs.events", { _id: 1 });
// better spread for writes: hashed userId
sh.shardCollection("logs.events", { userId: "hashed" });` },
    { id: 58, level: "advanced", q: "jumbo chunks / hotspot?",
      a: "If almost all inserts share a prefix, like today's date only, one chunk gets huge and one shard does all the writes. The cluster does not scale. That is a hotspot. Chunks can become jumbo and hard to move.\n\nFix is a better key, and maybe hashing, not add hardware and hope. Watch chunk distribution.\n\nIn the code: createdDay 2026-09-01. If shard key is only createdDay, all of today's inserts hit one place.\n\nA common mistake is a shard key with a handful of values.",
      code: `{ "createdDay": "2026-09-01", "n": 1 }
// if shard key is only createdDay, all of today's inserts hit one place
const hotspot = { shardKey: "createdDay" };
console.log(hotspot);` },
    { id: 59, level: "intermediate", q: "mongos?",
      a: "mongos is the query router in a sharded cluster. Your app connects to mongos. mongos talks to config servers and shards.\n\nYou do not point the app at one shard as if it were the whole database. It is not your data. It is the map. Connection strings for Atlas sharded clusters hide this a bit, but the idea remains.\n\nIn the code: uri points at mongos.example:27017/school. find city Pune goes through mongos.\n\nA common mistake is connecting the app to one shard host only.",
      code: `// app talks to mongos, mongos picks a shard
const uri = "mongodb://mongos.example:27017/school";
db.students.find({ city: "Pune" });
// do not point the app at one shard as the whole database` },
    { id: 60, level: "intermediate", q: "transactions in Mongo?",
      a: "You start a session and withTransaction, then pass { session } into the operations. There is overhead and a time limit. Prefer embedding or one-document updates.\n\nReplica set, or sharded transactions, is required. A lone standalone for homework may not support it the same way. Checkout across accounts is a candidate. Keep the transaction short.\n\nIn the code: withTransaction decrements a and increments b, both with { session }.\n\nA common mistake is forgetting { session } on the second update.",
      code: `const session = client.startSession();
await session.withTransaction(async function () {
  await accounts.updateOne({ _id: "a" }, { $inc: { bal: -10 } }, { session });
  await accounts.updateOne({ _id: "b" }, { $inc: { bal: 10 } }, { session });
});` },
    { id: 61, level: "beginner", q: "ACID in MongoDB?",
      a: "One document update is always atomic. Across several documents, modern replica sets can run transactions that are ACID, with performance cost.\n\nYou still design for isolation and retries. Do not assume Mongo is no transactions. Also do not wrap every find in a transaction. Say both sentences in an interview.\n\nIn the code: updateOne sets name and city on one user document. One document: atomic.\n\nA common mistake is wrapping every read in a multi-document transaction.",
      code: `db.users.updateOne(
  { _id: "u1" },
  { $set: { name: "Ada", city: "Pune" } }
); // one document: atomic` },
    { id: 62, level: "intermediate", q: "change streams?",
      a: "A change stream lets you listen for inserts and updates on a collection, using the oplog. Useful for sync and notifications.\n\nYou store a resume token so a disconnect can continue. It needs a replica set. Do not treat it as a replacement for a proper job queue in every case, but it is a real tool.\n\nIn the code: db.students.watch() and on change log operationType and fullDocument.\n\nA common mistake is change streams on a standalone with no replica set.",
      code: `const stream = db.students.watch();
stream.on("change", function (event) {
  console.log(event.operationType, event.fullDocument);
});` },
    { id: 63, level: "intermediate", q: "capped collection?",
      a: "A capped collection has a max size. New inserts overwrite the oldest. Order is insertion order. The oplog is a capped collection.\n\nYou cannot freely delete random documents the usual way. Good for recent logs. Bad for user records you must keep. Size it so you keep enough history.\n\nIn the code: createCollection recent_logs capped size 1MB. insertOne a started message. Oldest rows are overwritten when the cap is full.\n\nA common mistake is a capped collection for user accounts.",
      code: `db.createCollection("recent_logs", { capped: true, size: 1024 * 1024 });
db.recent_logs.insertOne({ msg: "started", at: new Date() });
// oldest rows are overwritten when the cap is full
const cap = { sizeBytes: 1048576 };` },
    { id: 64, level: "intermediate", q: "GridFS?",
      a: "GridFS splits a file into chunk documents plus a metadata document. For most apps, object storage plus a URL is simpler.\n\nGridFS keeps files inside the cluster. Use it if you must stay in Mongo and the file is large. Do not base64 a movie into a normal document.\n\nIn the code: filename talk.mp4, chunkSize, length 50MB. Chunks live in fs.chunks, metadata in fs.files.\n\nA common mistake is stuffing a 50MB file into one document.",
      code: `{
  "filename": "talk.mp4",
  "chunkSize": 261120,
  "length": 50000000
}
// chunks live in fs.chunks, metadata in fs.files` },
    { id: 65, level: "intermediate", q: "NoSQL injection?",
      a: "If you pass req.body into find(), a client can send operators like $ne and match too much. Cast types. Use a schema. Never spread user JSON into a filter.\n\nThis is the Mongo cousin of SQL injection. Login endpoints are a favourite target. Allow-list the fields you copy.\n\nIn the code: email is String(req.body.email). findOne { email } not findOne(req.body).\n\nA common mistake is User.findOne(req.body).",
      code: `const email = String(req.body.email || "");
db.users.findOne({ email: email }); // not findOne(req.body)
// $ne in user JSON must not become a query operator
const safe = { email: email };` },
    { id: 66, level: "intermediate", q: "how do you paginate?",
      a: "Use limit, a stable sort, and a cursor: last _id or createdAt plus _id. Avoid skip on deep pages. It still walks skipped docs.\n\nReturn the next cursor to the UI. Index the sort key. Offset pagination is OK for tiny admin tables.\n\nIn the code: find _id $lt lastId, sort _id -1, limit 10. Next page uses the last _id you already showed.\n\nA common mistake is skip(page*10) on a public feed.",
      code: `db.posts.find({ _id: { $lt: lastId } })
  .sort({ _id: -1 })
  .limit(10);
// next page: last _id you already showed` },
    { id: 67, level: "beginner", q: "sort + limit?",
      a: "Sort first in meaning: best 10 needs an order, then a cap. If the sort cannot use an index, Mongo may sort in memory and fail if the sort is huge, unless allowDiskUse.\n\nIndex { city: 1, marks: -1 } if you always filter city and sort marks. limit without sort is some 10, not top 10. Always say the order you want.\n\nIn the code: find city Pune sort marks -1 limit 10.\n\nA common mistake is limit(10) with no sort and calling it top 10.",
      code: `db.students.find({ city: "Pune" })
  .sort({ marks: -1 })
  .limit(10);
// index { city: 1, marks: -1 } helps this pair` },
    { id: 68, level: "intermediate", q: "collation?",
      a: "A collation sets rules: case-insensitive, locale, strength. Indexes can be built with a collation. The query must use the same collation to use that index.\n\nWithout collation, Ada and ada are different in a normal binary compare. You can also store a lowercase copy of the field. Pick one strategy and stick to it.\n\nIn the code: find name ada with collation en strength 2. createIndex name with that collation.\n\nA common mistake is a case-insensitive query on an index built with a different collation.",
      code: `db.users.find({ name: "ada" }).collation({ locale: "en", strength: 2 });
// strength 2: case-insensitive compare
const coll = { locale: "en", strength: 2 };
db.users.createIndex({ name: 1 }, { collation: coll });` },
    { id: 69, level: "intermediate", q: "case-insensitive search?",
      a: "Three options: collation on query and index. Regex with /i, often cannot use a normal index well. Or store emailLower and index that.\n\nStoring a normalized field is the simplest for logins. Regex /^Ada/i is better than /Ada/i in the middle if you can anchor. Be consistent at write time. Unique email should use the normalized form.\n\nIn the code: insert email and emailLower. findOne emailLower. unique index on emailLower.\n\nA common mistake is unique on mixed-case email so Ada@ and ada@ both exist.",
      code: `db.users.insertOne({ email: "Ada@Test.com", emailLower: "ada@test.com" });
db.users.findOne({ emailLower: "ada@test.com" });
db.users.createIndex({ emailLower: 1 }, { unique: true });
const login = "ada@test.com";` },
    { id: 70, level: "beginner", q: "regex queries?",
      a: "{ name: /ada/i } is a regular expression, case-insensitive here. A leading wildcard like /.*ada/ usually cannot use a normal index well.\n\nAnchor when you can: /^Ada/. User-built regex can also be a CPU attack. Cap and validate. Prefer exact or prefix when you can.\n\nIn the code: /^Ada/ is prefix, friendlier to an index. /ada/i is contains, often a scan.\n\nA common mistake is letting users send arbitrary regex to find().",
      code: `db.students.find({ name: /^Ada/ });     // prefix, friendlier to an index
db.students.find({ name: /ada/i });     // contains, often a scan
// user-built regex can also burn CPU
const prefix = /^Ada/;` },
    { id: 71, level: "intermediate", q: "geospatial?",
      a: "You store GeoJSON points, create a 2dsphere index, then $near or $geoWithin. Used for stores, drivers, maps.\n\nCoordinates are [longitude, latitude] in GeoJSON. Mixing them up is a classic bug. Index must match the query. Keep units in mind, meters.\n\nIn the code: 2dsphere on loc. $near a Point 73.8, 18.5 with maxDistance 1000.\n\nA common mistake is [latitude, longitude] in GeoJSON.",
      code: `db.shops.createIndex({ loc: "2dsphere" });
db.shops.find({
  loc: { $near: { $geometry: { type: "Point", coordinates: [73.8, 18.5] }, $maxDistance: 1000 } }
});` },
    { id: 72, level: "intermediate", q: "TTL for sessions example?",
      a: "Each session document has createdAt as a Date. A TTL index on createdAt with 3600 seconds deletes it after an hour.\n\nThe app still checks expiry if you store expiresAt too. Do not store huge session blobs if you can keep a userId and a few flags. Rotate session ids on login for security, as in any session design.\n\nIn the code: insertOne userId u1 createdAt now. TTL index 3600 seconds.\n\nA common mistake is createdAt as a string so TTL never deletes.",
      code: `db.sessions.insertOne({ userId: "u1", createdAt: new Date() });
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
// documents disappear about an hour after createdAt
const ttlSeconds = 3600;` },
    { id: 73, level: "beginner", q: "Compass vs mongosh?",
      a: "Compass is a graphical app: click collections, see documents, explain plans. mongosh is the modern shell: you type find() like in these snippets.\n\nBoth can create indexes and inspect queries. Learning the query shape matters more than which window you type in. Atlas also has a cloud UI. Same documents underneath.\n\nIn the code: find name Ada, then explain executionStats. The gui comment says Compass shows the same documents.\n\nA common mistake is only clicking Compass and never reading a filter object.",
      code: `// the same find you would type in mongosh or run from an app
db.students.find({ name: "Ada" });
db.students.find({ name: "Ada" }).explain("executionStats");
const gui = "Compass shows the same documents";` },
    { id: 74, level: "intermediate", q: "Atlas?",
      a: "Atlas is Mongo's hosted cloud: replica sets, backups, extra search, charts. You still write the same queries. Ops is easier. Cost and vendor choice are the trade.\n\nSelf-host if you need that control and have the people. Connection strings use mongodb+srv for Atlas. Keep that string in env, not in git.\n\nIn the code: uri is process.env.MONGODB_URI. mongoose.connect(uri). connection is db.\n\nA common mistake is committing mongodb+srv with the password in git.",
      code: `const uri = process.env.MONGODB_URI;
// mongodb+srv://... is still just a connection string for the driver
await mongoose.connect(uri);
const db = mongoose.connection;` },
    { id: 75, level: "intermediate", q: "backup?",
      a: "Dumps, snapshots, and Atlas backups are the usual tools. A replica set is not a backup. A bad delete replicates.\n\nTest restore or you are guessing. Point-in-time restore uses oplog plus a base backup. Schedule backups before you need them.\n\nIn the code: a JSON array of Ada is a copy at a time. insertMany restores it after a mistake.\n\nA common mistake is calling the replica a backup, then DELETE replicates.",
      code: `// a "backup" is a copy of documents at a time, e.g. exported JSON
[{ "_id": "u1", "name": "Ada" }]
// restoring means insert these back after a mistake
db.students.insertMany([{ _id: "u1", name: "Ada" }]);` },
    { id: 76, level: "advanced", q: "point-in-time restore?",
      a: "A base backup plus the oplog can replay to a moment just before the mistake. Atlas offers PITR as a product feature.\n\nYou need oplog coverage for that window. Practice the restore. The first time should not be during an outage. App code cannot replace this ops skill, but you should know it exists.\n\nIn the code: restore snapshot from 14:00, replay until 15:01. Stop before the 15:02 delete.\n\nA common mistake is no PITR practice until production is gone.",
      code: `// idea: restore snapshot from 14:00, then replay ops until 15:01
{ "op": "d", "ns": "shop.orders", "at": "15:02" }
// you stop before this delete
const stopAt = "15:01";` },
    { id: 77, level: "intermediate", q: "schema design for a blog?",
      a: "posts collection for articles. Embed a small author snapshot, name, if you show it on every card. Comments in a separate collection with postId if they can grow.\n\nTags as an array with an index if the list stays small. List pages should query posts with a projection. Avoid one document that is the whole blog.\n\nIn the code: post p1 has title, author.name Ada, tags mongo and beginner.\n\nA common mistake is embedding every comment ever on the post.",
      code: `{
  "_id": "p1",
  "title": "Indexes",
  "author": { name: "Ada" },
  "tags": ["mongo", "beginner"]
}` },
    { id: 78, level: "intermediate", q: "schema design for shopping cart?",
      a: "A cart can embed line items if the list is bounded. A person cannot hold 100,000 SKUs. When they pay, write an order document that snapshots prices. Do not look up live prices later for history.\n\nProducts stay referenced. Stock updates may need transactions or careful stock documents. Do not mutate old orders when a product name changes.\n\nIn the code: cart1 has userId u1 and items sku ABC n 2 cents 499.\n\nA common mistake is changing historical order line prices when the product price changes.",
      code: `{
  "_id": "cart1",
  "userId": "u1",
  "items": [{ "sku": "ABC", "n": 2, "cents": 499 }]
}` },
    { id: 79, level: "advanced", q: "polymorphic documents?",
      a: "A type field plus different fields: type cat meows versus type fish fins. It works. Validation and indexes get messier.\n\nSometimes two collections are cleaner. Use polymorphism when the app truly treats them as one list. Do not mix unrelated types just to have fewer collection names.\n\nIn the code: insertMany a cat Momo and a fish Nemo.\n\nA common mistake is mixing invoices and log lines in one collection for convenience.",
      code: `db.pets.insertMany([
  { type: "cat", name: "Momo", lives: 9 },
  { type: "fish", name: "Nemo", fins: 2 }
]);` },
    { id: 80, level: "intermediate", q: "migrating a schema in Mongo?",
      a: "Add new fields in new writes. Backfill old documents with a script. Read both old and new during the rollout. A schemaVersion field helps.\n\nThere is no required column, so old docs linger until you touch them. Dual-read is safer than a big-bang rewrite. Keep the backfill idempotent.\n\nIn the code: updateMany schemaVersion $ne 2, $set schemaVersion 2 and city unknown.\n\nA common mistake is assuming every old document already has the new field.",
      code: `db.students.updateMany(
  { schemaVersion: { $ne: 2 } },
  { $set: { schemaVersion: 2, city: "unknown" } }
);` },
    { id: 81, level: "beginner", q: "What is a connection string?",
      a: "A connection string tells the driver host, user, password, database, and options like retryWrites. Atlas uses mongodb+srv.\n\nKeep it in an environment variable, never in git. One MongoClient per app, not a new connect per request. w=majority is a common production option.\n\nIn the code: uri from env, example localhost school retryWrites w majority. MongoClient.connect once.\n\nA common mistake is new MongoClient() on every HTTP request.",
      code: `const uri = process.env.MONGODB_URI;
// e.g. mongodb://localhost:27017/school?retryWrites=true&w=majority
await MongoClient.connect(uri);
const client = { once: true };` },
    { id: 82, level: "intermediate", q: "connection pooling in drivers?",
      a: "The official driver keeps a pool of connections inside MongoClient. Create one client at startup. Reuse it.\n\nConnect per request will melt the server. Pool size has a default. Tune if you have many processes. Close the client on graceful shutdown.\n\nIn the code: new MongoClient, connect once, db school. GET /n uses that db.collection countDocuments.\n\nA common mistake is connect() inside the route handler.",
      code: `const client = new MongoClient(process.env.MONGODB_URI);
await client.connect(); // once
const db = client.db("school");
app.get("/n", async function (req, res) {
  res.json({ n: await db.collection("students").countDocuments() });
});` },
    { id: 83, level: "intermediate", q: "retryable writes?",
      a: "With retryWrites, the driver can retry some writes on failover or transient errors. You still want idempotent operations: $set to a value is safer than $inc if retried blindly without a request id.\n\nNeeds a replica set. Payments need extra idempotency keys. Not every command is retryable.\n\nIn the code: updateOne only $inc if doneIds $ne requestId, then $push requestId. Retry will not double-count the same requestId.\n\nA common mistake is $inc on every retry of the same HTTP POST.",
      code: `db.counters.updateOne(
  { _id: "jobs", doneIds: { $ne: requestId } },
  { $inc: { n: 1 }, $push: { doneIds: requestId } }
); // retry will not double-count the same requestId` },
    { id: 84, level: "advanced", q: "idempotent updates?",
      a: "$set to an absolute value is naturally idempotent. $inc is not, unless you also record a request id and refuse to apply it twice.\n\nfindOneAndUpdate with a unique key is another pattern. This pairs with retryable writes and with HTTP POST retries. Design the document so repeats are safe.\n\nIn the code: $set status paid on inv1. Paying twice stays paid.\n\nA common mistake is $inc paidCount on every retry of the same pay request.",
      code: `db.invoices.updateOne(
  { _id: "inv1" },
  { $set: { status: "paid" } }  // paying twice stays "paid"
);` },
    { id: 85, level: "intermediate", q: "findOneAndUpdate?",
      a: "findOneAndUpdate changes a document and can return the new or old version. Useful for counters and simple state machines: only move from pending to paid if still pending.\n\nreturnDocument after is the usual give me the new one. This avoids a separate find then update race. Combine with a filter on the old state.\n\nIn the code: findOneAndUpdate status pending, $set working, returnDocument after.\n\nA common mistake is find pending then update, so two workers grab the same job.",
      code: `db.jobs.findOneAndUpdate(
  { status: "pending" },
  { $set: { status: "working" } },
  { returnDocument: "after" }
);` },
    { id: 86, level: "intermediate", q: "bulkWrite?",
      a: "bulkWrite takes an array of insert, update, delete models. Ordered stops on first error. Unordered continues.\n\nHuge win for imports and backfills. Watch memory if the batch is enormous. Chunk it. Still respect unique indexes and validation.\n\nIn the code: bulkWrite insertOne Ada and updateOne Grace marks 90.\n\nA common mistake is a million-doc bulkWrite in one array in memory.",
      code: `db.students.bulkWrite([
  { insertOne: { document: { name: "Ada" } } },
  { updateOne: { filter: { name: "Grace" }, update: { $set: { marks: 90 } } } }
]);` },
    { id: 87, level: "beginner", q: "What is the difference between MongoDB and Firebase/Firestore?",
      a: "Both store documents. Firestore is Google-hosted with realtime listeners and different query limits. Mongo is general-purpose, self-hostable, or Atlas. Query and aggregation are very flexible.\n\nPick based on team, query needs, and cloud lock-in, not a meme. Your find() skills do not copy 1:1 to Firestore rules. Say one real difference: aggregations versus realtime listeners.\n\nIn the code: a Mongo document { _id, name Ada } and find name Ada. sameShape is { name: Ada }.\n\nA common mistake is saying they are the same API.",
      code: `// Mongo document — same idea as a Firestore doc, different query API
{ "_id": "u1", "name": "Ada" }
db.students.find({ name: "Ada" });
const sameShape = { name: "Ada" };` },
    { id: 88, level: "intermediate", q: "when would you pick Mongo over Postgres?",
      a: "Pick Mongo when documents nest naturally, the schema is still changing fast, or the team already knows Mongo well. If you have lots of relations, reports, and strict constraints, SQL is often easier.\n\nDo not pick Mongo only because it is NoSQL and modern. A blog with comments can work in both. The access pattern decides. Be ready to say what you would miss from SQL.\n\nIn the code: a nested post with author name and tags, one document read, a Mongo-shaped reason.\n\nA common mistake is picking Mongo only because it is modern.",
      code: `{
  "title": "Hello",
  "author": { "name": "Ada", "city": "Pune" },
  "tags": ["hello"]
}
// nested read in one document — a Mongo-shaped reason` },
    { id: 89, level: "intermediate", q: "when would you pick Postgres over Mongo?",
      a: "Pick Postgres for complex joins, foreign keys, CHECK constraints, and transactional logic across many tables. SQL tooling and reporting are mature.\n\nMongo can do transactions now, but the relational model still shines here. A unique student, course pair with FKs is boring and reliable in SQL. Say constraints and joins out loud.\n\nIn the code: enroll.studentId must exist in students as a relational idea. unique index on studentId and courseId.\n\nA common mistake is Mongo for a heavily relational enrollment system with no plan for constraints.",
      code: `// relational idea you may miss in Mongo
// enroll.student_id must exist in students
{ "studentId": "s1", "courseId": "c1" }
db.enroll.createIndex({ studentId: 1, courseId: 1 }, { unique: true });` },
    { id: 90, level: "advanced", q: "data modeling anti-pattern: massive documents?",
      a: "You hit 16MB. Updates are slow. RAM for the working set explodes. Split by time, monthly buckets, or by type, events collection.\n\nEmbed a short profile. Reference the long tail. This is the unbounded array problem at document scale. Design for growth on day one of history.\n\nIn the code: events.insertOne userId type login at now. Index userId and at.\n\nA common mistake is user.events = years of items in one document.",
      code: `// bad: user.events = [ years of items ]
// better:
db.events.insertOne({ userId: "u1", type: "login", at: new Date() });
db.events.createIndex({ userId: 1, at: -1 });` },
    { id: 91, level: "advanced", q: "working set?",
      a: "The working set is the indexes plus documents you touch often. If that set fits in RAM, queries stay snappy. If not, the disk thrashes and latency spikes.\n\nHot collections and their indexes should fit. This is why people size machines for WiredTiger cache. A sudden new query pattern can change the working set.\n\nIn the code: find city Pune hint city_1. workingSet is that index plus Pune students.\n\nA common mistake is a new report that scans a cold collection and knocks hot data out of RAM.",
      code: `db.students.find({ city: "Pune" }).hint({ city: 1 });
// hot filter + index should stay in memory for speed
const workingSet = { index: "city_1", docs: "Pune students" };
console.log(workingSet);` },
    { id: 92, level: "intermediate", q: "wiredTiger cache?",
      a: "WiredTiger keeps data and indexes in RAM. The default is roughly half of RAM minus a gigabyte, simple teaching version.\n\nSize the machine so working set plus OS fit. If the cache is too small, everything feels like COLLSCAN even with indexes. You do not tune this on day one of learning find(). Know the name for interviews.\n\nIn the code: find by _id should hit cache when hot. cache is the WiredTiger RAM cache.\n\nA common mistake is blaming the query when the working set no longer fits RAM.",
      code: `// not a query: the engine caches pages for queries like
db.students.find({ _id: id }); // _id lookups should hit cache when hot
const cache = "WiredTiger RAM cache";
console.log(cache);` },
    { id: 93, level: "intermediate", q: "authentication mechanisms?",
      a: "SCRAM username and password is the common default. Enterprise and Atlas add X.509, LDAP, OIDC in some setups.\n\nAlways turn auth on. Bind to a private network. Use TLS. App users are not cluster admins. Rotate leaked passwords like any secret.\n\nIn the code: user app, pwd from env, role readWrite on school.\n\nA common mistake is an open 27017 on the internet with no auth.",
      code: `{
  "user": "app",
  "pwd": process.env.MONGO_PASSWORD,
  "roles": [{ "role": "readWrite", "db": "school" }]
}` },
    { id: 94, level: "beginner", q: "roles?",
      a: "A role is a bundle of permissions: read, readWrite, dbAdmin, and so on. The app should be readWrite on its database, not atlasAdmin.\n\nLeast privilege limits damage if the password leaks. Do not use the root user in the application. Atlas has extra role names. The idea is the same.\n\nIn the code: createUser app with readWrite on school.\n\nA common mistake is the app connecting as root.",
      code: `db.createUser({
  user: "app",
  pwd: "secret",
  roles: [{ role: "readWrite", db: "school" }]
});` },
    { id: 95, level: "intermediate", q: "encryption?",
      a: "TLS protects data on the wire. Disk encryption, and Atlas at-rest, protects files if someone steals a disk. Field-level encryption can keep a field unreadable even to someone with a backup.\n\nPasswords still need hashing, which is a different tool. Turn TLS on for anything not on your laptop.\n\nIn the code: email is plain, card is encrypted-bytes-not-plain-digits. Sensitive fields should not sit as plain text in backups.\n\nA common mistake is storing card numbers as plain strings in documents.",
      code: `{
  "email": "ada@test.com",
  "card": "encrypted-bytes-not-plain-digits"
}
// sensitive fields should not sit as plain text in backups` },
    { id: 96, level: "intermediate", q: "how do you model many-to-many?",
      a: "If both sides stay small, arrays of ids on both documents can work. If lists grow, a join collection { userId, roleId } like SQL is safer.\n\nArrays of thousands of ids hurt documents and indexes. Pick based on growth, not on Mongo cannot join. $lookup can still query the join collection.\n\nIn the code: enroll.insertOne studentId s1 courseId c1. unique index on both. find by studentId.\n\nA common mistake is students.courseIds with thousands of ids.",
      code: `db.enroll.insertOne({ studentId: "s1", courseId: "c1" });
db.enroll.createIndex({ studentId: 1, courseId: 1 }, { unique: true });
db.enroll.find({ studentId: "s1" });
const join = { studentId: "s1", courseId: "c1" };` },
    { id: 97, level: "beginner", q: "drop vs deleteMany?",
      a: "deleteMany({}) removes documents but keeps the collection and indexes. drop() removes the collection and its indexes. Recreate indexes after if you still need them.\n\ndrop is faster for a full wipe in development. Never drop production by accident. Prefer targeted deletes in app code.\n\nIn the code: deleteMany({}) vs drop(). keepIndexes is deleteMany.\n\nA common mistake is drop() in a cleanup script pointed at production.",
      code: `db.students.deleteMany({}); // documents gone, indexes remain
db.students.drop();         // collection gone too
// drop is faster for a full wipe in development
const keepIndexes = "deleteMany";` },
    { id: 98, level: "intermediate", q: "how do you do transactions with Mongoose?",
      a: "startSession, then session.withTransaction, and pass { session } into every query in the block. You need a replica set.\n\nKeep the work small. If you forget { session } on one query, that query is not in the transaction. This is easy to miss.\n\nIn the code: mongoose.startSession, withTransaction two Account.updateOne calls both with { session }.\n\nA common mistake is omitting { session } on the second update.",
      code: `const session = await mongoose.startSession();
await session.withTransaction(async function () {
  await Account.updateOne({ _id: "a" }, { $inc: { bal: -1 } }, { session });
  await Account.updateOne({ _id: "b" }, { $inc: { bal: 1 } }, { session });
});` },
    { id: 99, level: "advanced", q: "how do you debug a slow Mongo query?",
      a: "explain('executionStats'). Look for COLLSCAN and huge examined counts. Move $match first. Cut $lookup and $unwind. Project fewer fields.\n\nAdd the index the filter actually uses. Working set and disk can also be the villain. Fix the query plan before you shard because we are slow.\n\nIn the code: aggregate $match paid then $lookup users, explain executionStats.\n\nA common mistake is sharding first when $match was last.",
      code: `db.orders.aggregate([
  { $match: { status: "paid" } },
  { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "u" } }
]).explain("executionStats");` },
    { id: 100, level: "advanced", q: "How do you answer a Mongo schema-design interview?",
      a: "List access patterns first: what do you read and write together? Then embed versus reference. Then indexes for those queries.\n\nThen growth and the 16MB cap. Then transactions only if you cannot keep it in one document. Say one trade-off you would revisit at ten times the data.\n\nIn the code: a post card embeds author.name. createIndex createdAt -1.\n\nA common mistake is designing collections from SQL tables without listing reads.",
      code: `// access pattern: show a post card with author name
{
  "_id": "p1",
  "title": "Hello",
  "author": { "name": "Ada" }
}
db.posts.createIndex({ createdAt: -1 });` },
  ]
};
