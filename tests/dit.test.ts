import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import fs from 'node:fs';
import dit from '../src/lib/dit';

describe('dit', () => {

    let db: Database;

    beforeAll(async () => {
        // create the testing db
        sqlite3.verbose();

        db = await open({ driver: sqlite3.Database, filename: './dit-test.db' })
    })

    it('should initialize the database', async () => {
        await dit.initialize(db);
        const schemas = await db.all('select * from sqlite_master where tbl_name like "task";');
        expect(schemas.length).toEqual(1);
        expect(schemas[0].sql).toEqual('CREATE TABLE task (description text not null, date_added date not null)');
    });

    afterAll(() => {
        // tear down testing db
        fs.rmSync("./dit-test.db") 
    })

})
