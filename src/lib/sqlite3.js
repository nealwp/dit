"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEntry = exports.getEntry = exports.getAllEntries = exports.getMonthyReport = exports.getTodaysEntries = exports.addEntry = exports.initializeDB = exports.getDBVersion = void 0;
const msrrc_json_1 = __importDefault(require("../../msrrc.json"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const SQLite3 = sqlite3_1.default.verbose();
const db = new SQLite3.Database(msrrc_json_1.default.dbPath);
const getDBVersion = () => {
    return new Promise((resolve, reject) => {
        db.all("select sqlite_version()", (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};
exports.getDBVersion = getDBVersion;
const initializeDB = () => {
    return new Promise((resolve, reject) => {
        db.all(`create table if not exists task (
        description text not null,
        date_added date not null
      );`, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};
exports.initializeDB = initializeDB;
const addEntry = (entry) => {
    return new Promise((resolve, reject) => {
        db.all(`insert into task values ($description, date('now'));`, {
            $description: entry,
        }, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};
exports.addEntry = addEntry;
const getTodaysEntries = () => {
    return new Promise((resolve, reject) => {
        db.all(`select description, date_added from task where date_added = date('now')`, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};
exports.getTodaysEntries = getTodaysEntries;
const getMonthyReport = () => {
    return new Promise((resolve, reject) => {
        db.all(`
    select description, date_added
    from task
    where date_added between date('now', 'start of month') and date('now')`, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};
exports.getMonthyReport = getMonthyReport;
const getAllEntries = () => {
    return new Promise((resolve, reject) => {
        db.all(`select rowid, description, date_added from task`, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};
exports.getAllEntries = getAllEntries;
const getEntry = (id) => {
    return new Promise((resolve, reject) => {
        db.all(`
    select rowid, description, date_added
    from task where rowid = $id`, { $id: id }, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};
exports.getEntry = getEntry;
const deleteEntry = (id) => {
    return new Promise((resolve, reject) => {
        db.all(`
    delete from task where rowid = $id`, { $id: id }, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};
exports.deleteEntry = deleteEntry;
