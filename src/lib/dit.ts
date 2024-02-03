import promptSync from 'prompt-sync';
import sql from './sql';
import { Database } from 'sqlite';

const prompt = promptSync();

async function initialize(db: Database) {
    return db.all(sql.initialize)
}

async function addEntry(db: Database, entry: string) {

    if (!entry) {
        return 'Error: add command missing entry text';
    }

    return db.all(sql.insertEntry, { $description: entry });
}

async function deleteEntry(db: Database, id: string) {

    if (!id) {
        return 'ERROR: delete command missing entry id';
    }

    const result = await db.all(sql.selectEntry, {$id: id})
    console.log(result)

    const response = prompt('Delete this entry? (yes): ', 'yes')
    const confirmations = ['y','Y','yes','YES', 'Yes'];

    if (!confirmations.includes(response)) {
        return
    }

    return db.all(sql.deleteEntry, {$id: id})
}

interface TaskEntry {
    rowid: number,
    description: string,
    date_added: string
}

async function todaysEntries(db: Database) {
    const result = await db.all<TaskEntry[]>(sql.selectTodayEntries);
    let outputText = '';
    for (let entry of result) {
        outputText = `${entry.description}. ${outputText}`
    }
    return outputText
}

async function thisMonthsEntries(db: Database) {
    const result = await db.all<TaskEntry[]>(sql.selectMonthEntries);
    let entries: string[] = [];
    result.forEach(e => {
        if (!entries.includes(e.description)){
            entries.push(e.description)
        } 
        return
    })
    let output = '';
    entries.forEach(e => output = `- ${e}.\n${output}`)
    return output
}

async function editEntry(db: Database, id: string) {
    if (!id) {
        return 'Error: delete command missing entry id';
    }

    const result = await db.all(sql.selectEntry, {$id: id})

    console.log(result);

    const updatedEntry = prompt('Updated entry text: ');

    if (!updatedEntry) {
        return 'no changes made';
    } 

    return db.all(sql.updateEntry, {$description: updatedEntry, $rowid: id}); 

}

function backdateEntry(db: Database, entryDate: string, entryText: string) {

    if (!entryDate){
        return 'ERROR: backdate command missing entry date';
    }

    if (!entryText){
        return 'ERROR: backdate command missing entry text';
    }

    const entryDateUTC = new Date(entryDate).toISOString()
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
`
}

async function listEntries(db: Database) {
    return db.all(sql.selectAllEntry)
}

export { listEntries, help, backdateEntry, editEntry, thisMonthsEntries, initialize, todaysEntries, deleteEntry, addEntry }
