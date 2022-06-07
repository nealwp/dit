"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = require("./sqlite3");
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const child_process_1 = require("child_process");
const prompt = (0, prompt_sync_1.default)();
const command = process.argv[2];
const writeToClipboard = (data) => {
    (0, child_process_1.spawn)('clip').stdin.end(data);
};
if (command === 'test') {
    console.log('app works');
    (0, sqlite3_1.getDBVersion)()
        .then((result) => console.log(result))
        .catch((error) => console.log(error));
}
if (command === 'init') {
    (0, sqlite3_1.initializeDB)()
        .then((result) => console.log(result))
        .catch((error) => console.log(error));
}
if (command === 'add') {
    const entry = process.argv[3];
    if (!entry) {
        console.log('Error: add command missing entry text');
        process.exit();
    }
    (0, sqlite3_1.addEntry)(entry)
        .then((result) => console.log(result))
        .catch((error) => console.log(error));
}
if (command === 'delete') {
    const entryId = process.argv[3];
    if (!entryId) {
        console.log('Error: delete command missing entry id');
        process.exit();
    }
    (0, sqlite3_1.getEntry)(entryId)
        .then((result) => {
        console.log(result);
        const confirmations = ['y', 'Y', 'yes', 'YES', 'Yes'];
        const response = prompt('Delete this entry? (yes): ', 'yes');
        if (confirmations.includes(response)) {
            (0, sqlite3_1.deleteEntry)(entryId)
                .then((result) => console.log(result))
                .catch((error) => console.log(error));
        }
        else {
            console.log('no changes made');
        }
    })
        .catch((error) => console.log(error));
}
if (command === 'eod') {
    (0, sqlite3_1.getTodaysEntries)()
        .then((result) => {
        let outputText = '';
        for (let entry of result) {
            outputText = `${entry.description}. ${outputText}`;
        }
        writeToClipboard(outputText);
        console.log(outputText);
    })
        .catch((error) => console.log(error));
}
if (command === 'eom') {
    (0, sqlite3_1.getMonthyReport)()
        .then((result) => {
        let entries = [];
        result.forEach(e => {
            if (!entries.includes(e.description)) {
                entries.push(e.description);
            }
            return;
        });
        let output = '';
        entries.forEach(e => output = `• ${e}.\n${output}`);
        writeToClipboard(output);
        console.log(`\n${output}`);
    })
        .catch((error) => console.log(error));
}
if (command === 'edit') {
    const entryId = process.argv[3];
    if (!entryId) {
        console.log('Error: delete command missing entry id');
        process.exit();
    }
    (0, sqlite3_1.getEntry)(entryId)
        .then((result) => {
        console.log(result);
        const updatedEntry = prompt('Updated entry text: ');
        if (updatedEntry) {
            (0, sqlite3_1.updateEntry)(entryId, updatedEntry)
                .then((result) => console.log(result))
                .catch((error) => console.log(error));
        }
        else {
            console.log('no changes made');
        }
    })
        .catch((error) => console.log(error));
}
if (command === 'which') {
    console.log(process.cwd());
}
if (command === 'help') {
    const helpText = `
  add <entrytext>\tcreate an entry for the current date
  all\t\t\tprints all entries
  delete <id>\t\tdelete an entry by id
  eod\t\t\tprints all entries for today
  eom\t\t\tprints all entries for current month
  help\t\t\tdisplays this help
  init\t\t\tinitializes database (only used for setup)
  test\t\t\ttest database connection
  `;
    console.log(helpText);
}
if (command === 'all') {
    (0, sqlite3_1.getAllEntries)()
        .then((result) => console.log(result))
        .catch((error) => console.log(error));
}
