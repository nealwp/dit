import sql from './sql';
import { Database } from 'sqlite';

async function initialize(db: Database) {
    return db.all(sql.initialize);
}

async function addEntry(db: Database, entry: string) {
    return db.all(sql.insertEntry, { $description: entry });
}

async function deleteEntry(db: Database, id: string) {
    const result = await db.all(sql.selectEntry, { $id: id });

    if (!result.length) {
        return `ERROR: entry id ${id} not found`;
    }

    return db.all(sql.deleteEntry, { $id: id });
}

async function todaysEntries(db: Database) {
    return db.all(sql.selectTodayEntries);
}

async function thisMonthsEntries(db: Database) {
    return db.all(sql.selectMonthEntries);
}

async function editEntry(db: Database, id: string, entry: string) {
    const result = await db.all(sql.selectEntry, { $id: id });

    if (!result.length) {
        return `ERROR: entry id ${id} not found`;
    }

    return db.all(sql.updateEntry, { $description: entry, $rowid: id });
}

function backdateEntry(db: Database, entryDate: string, entryText: string) {
    const entryDateUTC = new Date(entryDate).toISOString();
    return db.all(sql.backdateEntry, { $description: entryText, $entrydate: entryDateUTC });
}

function help() {
    return `
Usage: dit <command> <args>

COMMAND                  DESCRIPTION                             ALIAS
-------                  -----------                             -----
add <entrytext>          create an entry for the current date    a
backdate <date> <entry>  create an entry for a given date        b
delete <id>              delete an entry                         d, rm
edit <id>                edit entry                              e
help                     displays help                           h, -h, --help
list                     prints all entries                      l, ls
month                    prints all entries for current month    m, eom
today                    prints all entries for today            t, eod
`;
}

async function listEntries(db: Database) {
    return db.all(sql.selectAllEntry);
}

export default {
    listEntries,
    help,
    backdateEntry,
    editEntry,
    thisMonthsEntries,
    initialize,
    todaysEntries,
    deleteEntry,
    addEntry,
};
