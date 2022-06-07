"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEntry = exports.deleteEntry = exports.getEntry = exports.getAllEntries = exports.getMonthyReport = exports.getTodaysEntries = exports.addEntry = exports.initializeDB = exports.getDBVersion = void 0;
const msrrc_json_1 = __importDefault(require("../../msrrc.json"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const fs_1 = require("fs");
const SQLite3 = sqlite3_1.default.verbose();
const db = new SQLite3.Database(msrrc_json_1.default.dbPath);
const getDBVersion = () => {
    return new Promise((resolve, reject) => {
        const sql = (0, fs_1.readFileSync)('./src/sql/database_version.sql', { encoding: 'utf8' });
        db.all(sql, (err, result) => {
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
        const sql = (0, fs_1.readFileSync)('./src/sql/initialize_msrdb.sql', { encoding: 'utf8' });
        db.all(sql, (err, result) => {
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
        const sql = (0, fs_1.readFileSync)('./src/sql/insert_entry.sql', { encoding: 'utf8' });
        db.all(sql, { $description: entry }, (err, result) => {
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
        const sql = (0, fs_1.readFileSync)('./src/sql/get_today_entries.sql', { encoding: 'utf8' });
        db.all(sql, (err, result) => {
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
        const sql = (0, fs_1.readFileSync)('./src/sql/get_month_entries.sql', { encoding: 'utf8' });
        db.all(sql, (err, result) => {
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
        const sql = (0, fs_1.readFileSync)('./src/sql/get_all_entries.sql', { encoding: 'utf8' });
        db.all(sql, (err, result) => {
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
        const sql = (0, fs_1.readFileSync)('./src/sql/get_entry_by_id.sql', { encoding: 'utf8' });
        db.all(sql, { $id: id }, (err, result) => {
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
        const sql = (0, fs_1.readFileSync)('./src/sql/delete_entry.sql', { encoding: 'utf8' });
        db.all(sql, { $id: id }, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};
exports.deleteEntry = deleteEntry;
const updateEntry = (id, updatedEntry) => {
    return new Promise((resolve, reject) => {
        const sql = (0, fs_1.readFileSync)('./src/sql/update_entry.sql', { encoding: 'utf8' });
        db.all(sql, { $description: updatedEntry, $rowid: id }, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};
exports.updateEntry = updateEntry;
