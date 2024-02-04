const updateEntry = 'update task set description = $description where rowid = $rowid;'
const insertEntry = `insert into task values ($description, date('now')) returning rowid;`
const backdateEntry = 'insert into task values ($description, date($entrydate)) returning rowid;';
const initialize = 'create table if not exists task (description text not null, date_added date not null);';
const selectTodayEntries = `select description from task where date(date_added, 'localtime') = date(date('now'), 'localtime');`
const selectMonthEntries = `select description, date_added from task where date_added between date('now', 'start of month') and date('now');`
const selectEntry = 'select rowid, description, date_added from task where rowid = $id;';
const selectAllEntry = 'select rowid, description, date_added from task;';
const deleteEntry = 'delete from task where rowid = $id';

export default {
    updateEntry,
    insertEntry,
    backdateEntry,
    initialize,
    selectTodayEntries,
    selectMonthEntries,
    selectEntry,
    selectAllEntry,
    deleteEntry,
}
