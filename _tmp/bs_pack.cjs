const notesEx = require("./bs_notes_ex.cjs");
module.exports = {
  notes: notesEx.notes,
  examples: notesEx.examples,
  questions: []
    .concat(require("./bs_q01_06.cjs"))
    .concat(require("./bs_q07_12.cjs"))
    .concat(require("./bs_q13_18.cjs"))
};
