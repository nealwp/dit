import config from '../../msrrc.json';
import sqlite3 from 'sqlite3';
import { readFileSync } from 'fs';

const SQLite3 = sqlite3.verbose();
const db = new SQLite3.Database(config.dbPath);

export const getDBVersion = () => {
  return new Promise((resolve, reject) => {
    const sql = readFileSync('./src/sql/database_version.sql', {encoding: 'utf8'})
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
    const sql = readFileSync('./src/sql/initialize_msrdb.sql', {encoding: 'utf8'})
    db.all(sql, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      })
  })
}

export const addEntry = (entry: string) => {
  return new Promise((resolve, reject) => {
    const sql = readFileSync('./src/sql/insert_entry.sql', {encoding: 'utf8'})
    db.all(sql, { $description: entry }, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      })
  })
}

export const getTodaysEntries = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const sql = readFileSync('./src/sql/get_today_entries.sql', {encoding: 'utf8'})
    db.all(sql, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

export const getMonthyReport = () => {
  return new Promise((resolve, reject) => {
    db.all(`
    select description, date_added
    from task
    where date_added between date('now', 'start of month') and date('now')`, 
    (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

export const getAllEntries = () => {
  return new Promise((resolve, reject) => {
    db.all(`select rowid, description, date_added from task`,
    (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

export const getEntry = (id: string) => {
  return new Promise((resolve, reject) => {
    db.all(`
    select rowid, description, date_added
    from task where rowid = $id`,
    {$id: id},
    (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

export const deleteEntry = (id: string) => {
  return new Promise((resolve, reject) => {
    db.all(`
    delete from task where rowid = $id`,
    {$id: id},
    (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

export const updateEntry = (id: string, updatedEntry: string) => {
  return new Promise((resolve, reject) => {
    db.all(`update task set description = $description where rowid = $rowid`,
    {$description: updatedEntry, $rowid: id},
    (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}