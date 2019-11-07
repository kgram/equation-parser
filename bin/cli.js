#!/usr/bin/env node

const { parse, renderTree } = require('..')

const [, , command, equation] = process.argv

switch(command) {
    case 'json':
        console.log(JSON.stringify(parse(equation), null, '  '))
        break
    case 'tree':
        console.log(renderTree(parse(equation)))
        break
    default:
        console.log(`Unknown command '${command}'`)

}
