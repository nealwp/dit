import { 
  getDBVersion,
  initializeDB,
  addEntry,
  addBackdatedEntry,
  getTodaysEntries,
  getMonthyReport,
  getAllEntries,
  getEntry,
  deleteEntry,
  updateEntry
} from './sqlite3';
import promptSync from 'prompt-sync'
import { spawn } from 'child_process';

const prompt = promptSync();
const command = process.argv[2];

const writeToClipboard = (data: string) => {
  spawn('clip').stdin.end(data)
}

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
    .then((result: TaskEntry[]) => {
      let outputText = '';
      for (let entry of result) {
        outputText = `${entry.description}. ${outputText}`
      }
      writeToClipboard(outputText)
      console.log(outputText)
    })
    .catch((error) => console.log(error))
}

if (command === 'eom') {
  getMonthyReport()
    .then((result: TaskEntry[]) => {
      let entries: string[] = [];
      result.forEach(e => {
        if (!entries.includes(e.description)){
          entries.push(e.description)
        } 
        return
      })
      let output = '';
      entries.forEach(e => output = `- ${e}.\n${output}`)
      writeToClipboard(output)
      console.log(`\n${output}`)
    })
    .catch((error) => console.log(error))
}

if (command === 'edit') {
  const entryId = process.argv[3];
  if (!entryId) {
    console.log('Error: delete command missing entry id')
    process.exit()
  }
  getEntry(entryId)
  .then((result) => {
    console.log(result)
    const updatedEntry = prompt('Updated entry text: ')
    if (updatedEntry) {
      updateEntry(entryId, updatedEntry)
        .then((result) => console.log(result))
        .catch((error) => console.log(error))
    } else {
      console.log('no changes made')
    }
  })
    .catch((error) => console.log(error))
}

if (command === 'backdate') {
  const entryDate = process.argv[3]
  const entryText = process.argv[4]
  
  if (!entryDate){
    console.log('Error: backdate command missing entry date')
    process.exit()
  }

  if (!entryText){
    console.log('Error: backdate command missing entry text')
    process.exit()
  }

  const entryDateUTC = new Date(entryDate).toISOString()
  addBackdatedEntry(entryDateUTC, entryText)
    .then((result) => console.log(result))
    .catch((error) => console.log(error))
}

if (command === 'which') {
  console.log(process.cwd())
}

if (command === 'help') {
  const helpText = `
  add <entrytext>\tcreate an entry for the current date
  all\t\t\tprints all entries
  delete <id>\t\tdelete an entry by id
  eod\t\t\tprints all entries for today
  eom\t\t\tprints all entries for current month
  help\t\t\tdisplays this help
  init\t\t\tinitializes database (only used for setup)
  test\t\t\ttest database connection
  `
  console.log(helpText);
}

if (command === 'all') {
  getAllEntries()
    .then((result) => console.log(result))
    .catch((error) => console.log(error))
}