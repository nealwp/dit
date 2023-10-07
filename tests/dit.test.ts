import sqlite3 from 'sqlite3'
import fs from 'node:fs'
import { addBackdatedEntry, addEntry, getTodaysEntries, getMonthyReport, getAllEntries, deleteEntry } from '../src/lib/sqlite3'
import { promisify } from 'node:util'

const SQLite3 = sqlite3.verbose()
const db = new SQLite3.Database("./testing.db")
const query = promisify(db.all).bind(db);

const createTaskTableSQL = "CREATE TABLE task (description TEXT NOT NULL, dateAdded DATE NOT NULL);"

function taskQuery(id: number) {
    return `SELECT description, dateAdded FROM task WHERE rowid = ${id};` 
}

async function seedTaskTable() {
    const sql = `
    INSERT INTO task
    VALUES 
        ("foo", date('now')),
        ("bar", date('now')),
        ("baz", date('now')),
        ("yesterday", date('now', '-1 day')),
        ("ancient", date('now', '-999 days'));
    `
    await query(sql)
}

interface Task {
    description: string,
    dateAdded: string
}

describe('dit', () => {

    beforeAll(async () => {
        // create testing db
        await query(createTaskTableSQL)
    })


    describe('database', () => {
        it('should work', async () => {
            const result = await query("select sqlite_version();") as any[]
            expect(result).toHaveLength(1)
            expect(result[0]).not.toBeNull()
        })
    }) 

    describe('addBackdatedEntry', () => {

        beforeEach(async() => {
            await query("DELETE FROM task;")
        })

        it('should create a entry for given date', async () => {
            const date = new Date("1/1/1970").toISOString()
            const result = await addBackdatedEntry(db, date, "entry text") as {rowid: number}[]
            const rowId = result[0].rowid

            const rows = await query(taskQuery(rowId)) as Task[]
            expect(rows[0].dateAdded).toEqual("1970-01-01")
            expect(rows[0].description).toEqual("entry text")
        });
    })

    describe('addEntry', () => {

        beforeEach(async() => {
            await query("DELETE FROM task;")
        })

        it('should create an entry with current date', async () => {
            const result = await addEntry(db, "some entry text") as {rowid: number}[]
            const rowId = result[0].rowid

            const rows = await query(taskQuery(rowId)) as Task[]

            const date = new Date()
            date.setUTCHours(0,0,0,0)

            expect(new Date(rows[0].dateAdded)).toEqual(date)
            expect(rows[0].description).toEqual("some entry text")
        });
    })
    
    describe('getTodaysEntries', () => {

        beforeEach(async() => {
            await query("DELETE FROM task;")
            await seedTaskTable()
        })

        it('should retrieve all entries with the current date', async () => {
            const rows = await getTodaysEntries(db) as Task[]
            expect(rows.length).toEqual(3)
        });
    })

    describe('getMonthlyReport', () => {

        beforeEach(async() => {
            await query("DELETE FROM task;")
            await seedTaskTable()
        })

        it('should retrieve all entries for current month', async () => {
            const rows = await getMonthyReport(db) as Task[]
            expect(rows.length).toEqual(4)
        });
    })

    describe('getAllEntries', () => {

        beforeEach(async() => {
            await query("DELETE FROM task;")
            await seedTaskTable()
        })

        it('should retrieve all entries', async () => {
            const rows = await getAllEntries(db) as Task[]
            expect(rows.length).toEqual(5)
        });
    })

    describe('deleteEntry', () => {

        beforeEach(async() => {
            await query("DELETE FROM task;")
            await seedTaskTable()
        })

        it('should delete entry for id', async () => {
            const rows = await query("SELECT rowid FROM task;") as {rowid: number}[]
            const rowid = rows[0].rowid 
            await deleteEntry(db, rowid)
            const afterRows = await query(`SELECT rowid FROM task WHERE rowid = ${rowid};`) as {rowid: number}[]
            expect(afterRows.length).toEqual(0)
        });
    })

    afterAll(() => {
        // tear down testing db
        fs.rmSync("./testing.db") 
    })

})
