#!/usr/bin/env node
import dit from './dit';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { existsSync, mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

async function main(args: string[]) {
    const homedir = os.homedir();
    const dbPath = path.join(homedir, '.local/share/dit');

    if (!existsSync(dbPath)) {
        mkdirSync(dbPath);
    }

    sqlite3.verbose();

    const db = await open({
        driver: sqlite3.Database,
        filename: path.join(dbPath, 'dit.db'),
    });

    await dit.initialize(db);

    const command = args[0];
    const inputs = args.slice(1);

    let text, date, id;

    switch (command) {
        case 'a':
        case 'add':
            [text] = inputs;
            if (!text) {
                console.log('ERROR: add command missing entry text');
                return;
            }
            console.log(await dit.addEntry(db, text));
            break;
        case 'b':
        case 'backdate':
            [date, text] = inputs;

            if (!date) {
                console.log('ERROR: backdate command missing entry date');
                return;
            }

            if (!text) {
                console.log('ERROR: backdate command missing entry text');
                return;
            }

            console.log(await dit.backdateEntry(db, date, text));
            break;
        case 'd':
        case 'rm':
        case 'delete':
            [id] = inputs;

            if (!id) {
                console.log('ERROR: delete command missing entry id');
                return;
            }

            console.log(await dit.deleteEntry(db, id));
            break;
        case 'e':
        case 'edit':
            [id, text] = inputs;

            if (!id) {
                console.log('ERROR: edit command missing entry id');
                return;
            }

            if (!text) {
                console.log('ERROR: edit command missing entry text');
                return;
            }

            console.log(await dit.editEntry(db, id, text));
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
main(args);
