import { 
  getDBVersion,
  initializeDB,
  addEntry,
  getTodaysEntries,
  getMonthyReport,
  getAllEntries,
  getEntry,
  deleteEntry
} from './sqlite3';
import promptSync from 'prompt-sync'

const prompt = promptSync();
const command = process.argv[2];

if (command === 'test') {
  console.log('app works');
  getDBVersion()
    .then((result) => console.log(result))
    .catch((error) => console.log(error))
} 

if (command === 'init') {
  initializeDB()
    .then((result) => console.log(result))
    .catch((error) => console.log(error))
}

if (command === 'add') {
  const entry = process.argv[3];
  if (!entry) {
    console.log('Error: add command missing entry text')
    process.exit();
  }
  addEntry(entry)
  .then((result) => console.log(result))
  .catch((error) => console.log(error))
}

if (command === 'delete') {
  const entryId = process.argv[3];
  if (!entryId) {
    console.log('Error: delete command missing entry id')
    process.exit()
  }
  getEntry(entryId)
  .then((result) => {
    console.log(result)
    const confirmations = ['y','Y','yes','YES', 'Yes'];
    const response = prompt('Delete this entry? (yes): ', 'yes')
    if (confirmations.includes(response)) {
      deleteEntry(entryId)
      .then((result) => console.log(result))
      .catch((error) => console.log(error))
    } else {
      console.log('no changes made')
    }
  })
  .catch((error) => console.log(error))
}

if (command === 'eod') {
  getTodaysEntries()
    .then((result) => console.log(result))
    .catch((error) => console.log(error))
}

if (command === 'eom') {
  getMonthyReport()
    .then((result) => console.log(result))
    .catch((error) => console.log(error))
}

if (command === 'list') {
  getAllEntries()
    .then((result) => console.log(result))
    .catch((error) => console.log(error))
}