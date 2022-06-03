import config from '../../msrrc.json';
import sqlite3 from 'sqlite3';

const SQLite3 = sqlite3.verbose();
const db = new SQLite3.Database(config.dbPath);

export const getDBVersion = () => {
  return new Promise((resolve, reject) => {
    db.all("select sqlite_version()", (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result)
    })
  })
}

export const initializeDB = () => {
  return new Promise((resolve, reject) => {
    db.all(`create table if not exists task (
        description text not null,
        date_added date not null
      );`, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      })
  })
}

export const addEntry = (entry: string) => {
  return new Promise((resolve, reject) => {
    db.all(`insert into task values ($description, date('now'));`, 
      {
        $description: entry,
      }, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      })
  })
}

export const getTodaysEntries = () => {
  return new Promise((resolve, reject) => {
    db.all(`select description, date_added from task where date_added = date('now')`,
    (err, result) => {
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