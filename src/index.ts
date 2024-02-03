#!/usr/env node
import dit from './lib/dit'
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { existsSync, mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

async function main(args: string[]) {

    const homedir = os.homedir();
    const dbPath = path.join(homedir, '.local/dit');

    if (!existsSync(dbPath)){
        mkdirSync(dbPath);
    }

    sqlite3.verbose();

    const db = await open({
        driver: sqlite3.Database, 
        filename: path.join(dbPath, 'dit.db'),
    })

    await dit.initialize(db)

    const command = args[0];
    const inputs = args.slice(1);

    let text, date, id: string;

    switch(command) {
        case 'a':
        case 'add':
            [ text ] = inputs;
            console.log(await dit.addEntry(db, text));
            break;
        case 'b':
        case 'backdate':
            [ date, text ] = inputs;
            console.log(await dit.backdateEntry(db, date, text));
            break;
        case 'd':
        case 'rm':
        case 'delete':
            [ id ] = inputs;
            console.log(await dit.deleteEntry(db, id));
            break;
        case 'e':
        case 'edit':
            [ id ] = inputs;
            console.log(await dit.editEntry(db, id));
            break;
        case 't':
        case 'eod':
        case 'today':
            console.log(await dit.todaysEntries(db));
            break;
        case 'm':
        case 'eom':
        case 'month':
            console.log(await dit.thisMonthsEntries(db));
            break;
        case 'h':
        case '-h':
        case '--help':
        case 'help':
            console.log(dit.help());
            break;
        case 'l':
        case 'ls':
        case 'list':
            console.log(await dit.listEntries(db));
            break;
        default:
            console.log(dit.help());
            break;
    }

}

const args = process.argv.slice(2);
main(args)
