#!/usr/env node
import * as dit from './lib/dit'

function main(args: string[]) {
    const command = args[0] 
    switch(command) {
        case 'test':
            dit.test()
            break
        case 'add':
            dit.add()
            break
        case 'init':
            dit.init()
            break
        case 'rm':
            dit.rm()
            break
        case 'eod':
            dit.eod()
            break
        case 'eom':
            dit.eom()
            break
        case 'edit':
            dit.edit()
            break
        case 'backdate':
            dit.backdate()
            break
        case 'help':
            dit.help()
            break
        case 'ls':
            dit.ls()
            break
        default:
            break
    }
}

const args = process.argv.slice(2);
main(args)
