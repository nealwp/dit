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
        await dit.initialize(db);
    })

    beforeEach(async () => {
        await db.all('delete from task;');
    });

    it('should initialize the database', async () => {
        const schemas = await db.all('select * from sqlite_master where tbl_name like "task";');
        expect(schemas.length).toEqual(1);
        expect(schemas[0].sql).toEqual('CREATE TABLE task (description text not null, date_added date not null)');
    });

    it('should add an entry', async () => {
        await dit.addEntry(db, 'hello im an entry');
        const result = await db.all('select * from task;');
        const expected = { date_added: expect.any(String), description: 'hello im an entry' }
        expect(result.length).toEqual(1);
        expect(result[0]).toMatchObject(expected);
    });

    it('should delete an entry', async () => {
        const inserted = await db.all('insert into task (description, date_added) values ("delete me", "2023-02-03") returning rowid;');
        await dit.deleteEntry(db, inserted[0].rowid); 
        const result = await db.all('select * from task;');
        expect(result.length).toEqual(0);
    });

    it('should return an error message if no entry to delete', async () => {
        const response = await dit.deleteEntry(db, '123456'); 
        expect(response).toContain('ERROR');
    });

    it('should get todays entries', async () => {
        await db.all('insert into task (description, date_added) values ("yep", date("now")), ("yes", date("now")), ("nope", "1970-01-01");');
        const response = await dit.todaysEntries(db);
        const expected = [{ description: 'yep'}, { description: 'yes' }]
        expect(response).toEqual(expected);
    });

    it('should get current months entries', async () => {
        await db.all('insert into task (description, date_added) values ("foo", date("now")), ("bar", date("now")), ("baz", date("now", "-1 day")), ("ancient", date("now", "-999 days"));');
        const response = await dit.thisMonthsEntries(db);
        const expected = [
            { date_added: expect.any(String), description: 'foo' }, 
            { date_added: expect.any(String), description: 'bar' },
            { date_added: expect.any(String), description: 'baz' },
        ]
        expect(response).toEqual(expected);
    });

    it('should edit an existing entry', async () => {
        const inserted = await db.all('insert into task (description, date_added) values ("edit me", "2023-02-03") returning rowid;');
        await dit.editEntry(db, inserted[0].rowid, 'i am edited');
        const rows = await db.all('select description from task where rowid = $id', {$id: inserted[0].rowid});
        expect(rows[0].description).toEqual('i am edited');
    });

    it('should return an error message if no entry to edit', async () => {
        const response = await dit.editEntry(db, '123456', 'cant find me');
        expect(response).toContain('ERROR');
    });

    it('should create a backdated entry', async () => {
        await dit.backdateEntry(db, '1970-01-01', 'im an old one');
        const rows = await db.all('select description, date_added from task;');
        const expected = { description: 'im an old one', date_added: '1970-01-01' }
        expect(rows[0]).toEqual(expected)
    });

    it('should get all the entries', async () => {
        await db.all('insert into task (description, date_added) values ("foo", date("now")), ("bar", date("now")), ("baz", date("now", "-1 day")), ("ancient", date("now", "-999 days"));');
        const response = await dit.listEntries(db);
        const expected = [
            { rowid: expect.any(Number), date_added: expect.any(String), description: 'foo' }, 
            { rowid: expect.any(Number), date_added: expect.any(String), description: 'bar' },
            { rowid: expect.any(Number), date_added: expect.any(String), description: 'baz' },
            { rowid: expect.any(Number), date_added: expect.any(String), description: 'ancient' },
        ]
        expect(response).toEqual(expected);
    });

    it('should return the help text', async () => {
        const response = dit.help();
        expect(response).toContain('Usage: dit <command> <args>');
    })

    afterAll(() => {
        // tear down testing db
        fs.rmSync("./dit-test.db") 
    })

})
