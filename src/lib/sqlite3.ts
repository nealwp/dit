// import config from '../../msrrc.json';
import sqlite3 from 'sqlite3';
import { readFileSync } from 'fs';

// inline for now
const config = {
    dbPath: ""
}

const SQLite3 = sqlite3.verbose();
const db = new SQLite3.Database(config.dbPath);

export const getDBVersion = () => {
  return new Promise((resolve, reject) => {
    const sql = readFileSync('./sql/database_version.sql', {encoding: 'utf8'})
    db.all(sql, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result)
    })
  })
}

export const initializeDB = () => {
  return new Promise((resolve, reject) => {
    const sql = readFileSync('./sql/initialize_ditdb.sql', {encoding: 'utf8'})
    db.all(sql, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      })
  })
}

export function addEntry(db: sqlite3.Database, entry: string){
  return new Promise((resolve, reject) => {
    const sql = readFileSync('./sql/insert_entry.sql', {encoding: 'utf8'})
    db.all(sql, { $description: entry }, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      })
  })
}

export function addBackdatedEntry (db: sqlite3.Database, entryDate: string, entry: string) {
  return new Promise((resolve, reject) => {
    const sql = readFileSync('./sql/insert_backdate_entry.sql', {encoding: 'utf8'})
    db.all(sql, { $description: entry, $entrydate: entryDate }, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      })
  })
}

export function getTodaysEntries(db: sqlite3.Database){
  return new Promise((resolve, reject) => {
    const sql = readFileSync('./sql/get_today_entries.sql', {encoding: 'utf8'})
    db.all(sql, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

export function getMonthyReport (db: sqlite3.Database){
  return new Promise((resolve, reject) => {
    const sql = readFileSync('./sql/get_month_entries.sql', {encoding: 'utf8'})
    db.all(sql, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

export function getAllEntries(db: sqlite3.Database){
  return new Promise((resolve, reject) => {
    const sql = readFileSync('./sql/get_all_entries.sql', {encoding: 'utf8'})
    db.all(sql, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

export const getEntry = (id: string) => {
  return new Promise((resolve, reject) => {
    const sql = readFileSync('./sql/get_entry_by_id.sql', {encoding: 'utf8'})
    db.all(sql, {$id: id}, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

export const deleteEntry = (id: string) => {
  return new Promise((resolve, reject) => {
    const sql = readFileSync('./sql/delete_entry.sql', {encoding: 'utf8'})
    db.all(sql, {$id: id}, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

export const updateEntry = (id: string, updatedEntry: string) => {
  return new Promise((resolve, reject) => {
    const sql = readFileSync('./sql/update_entry.sql', {encoding: 'utf8'})
    db.all(sql, {$description: updatedEntry, $rowid: id}, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}
