import sqlite3 from 'sqlite3'
import { backdate } from '../src/lib/dit'
import fs from 'node:fs'
import { addBackdatedEntry } from '../src/lib/sqlite3'
import { promisify } from 'node:util'

const SQLite3 = sqlite3.verbose()
const db = new SQLite3.Database("./testing.db")
const query = promisify(db.all).bind(db);

const createTaskTableSQL = "CREATE TABLE task (description TEXT NOT NULL, dateAdded DATE NOT NULL);"

function taskQuery(id: number) {
    return `SELECT description, dateAdded FROM task WHERE rowid = ${id};` 
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

        it('should create a entry for given date', async () => {
            const date = new Date("1/1/1970").toISOString()
            const result = await addBackdatedEntry(db, date, "entry text") as {rowid: number}[]
            const rowId = result[0].rowid

            const rows = await query(taskQuery(rowId)) as Task[]
            expect(rows[0].dateAdded).toEqual("1970-01-01")
            expect(rows[0].description).toEqual("entry text")
        });
    })

    afterAll(() => {
        // tear down testing db
        fs.rmSync("./testing.db") 
    })

    it('should work', () => {
        expect(true).toBe(true)
    })
})
