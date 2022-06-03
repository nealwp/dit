"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = require("./sqlite3");
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)();
const command = process.argv[2];
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
        .then((result) => console.log(result))
        .catch((error) => console.log(error));
}
if (command === 'eom') {
    (0, sqlite3_1.getMonthyReport)()
        .then((result) => console.log(result))
        .catch((error) => console.log(error));
}
if (command === 'list') {
    (0, sqlite3_1.getAllEntries)()
        .then((result) => console.log(result))
        .catch((error) => console.log(error));
}
