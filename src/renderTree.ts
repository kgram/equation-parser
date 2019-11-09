import { EquationNode } from './EquationNode'
import { EquationParserError } from './EquationParserError'
import { throwUnknownType } from './throwUnknownType'

export const renderTree = (tree: EquationNode | EquationParserError) => {
    if (tree.type === 'parser-error') {
        return `${tree.errorType} error\n  ${tree.equation}\n  ${''.padStart(tree.start, ' ').padEnd(tree.end + 1, '^')}`
    }

    return pushTree(tree).join('\n')
}

const operatorMap = {
    'equals': '=',
    'less-than': '<',
    'greater-than': '>',
    'less-than-equals': '≤',
    'greater-than-equals': '≥',
    'approximates': '≈',
    'plus': '+',
    'minus': '-',
    'plus-minus': '±',
    'multiply-implicit': '*',
    'multiply-dot': '*',
    'multiply-cross': '×',
    'divide-fraction': '/',
    'divide-inline': '÷',
    'power': '^',
}

function pushTree(tree: EquationNode, buffer: string[] = [], indent = '', indentType: 'initial' | 'regular' | 'last' = 'initial') {
    let ownIndent = indent
    let descendantIndent = indent
    switch (indentType) {
        case 'regular':
            ownIndent += '├─ '
            descendantIndent += '│  '
            break
        case 'last':
            ownIndent += '└─ '
            descendantIndent += '   '
            break
    }
    switch (tree.type) {
        case 'number':
            buffer.push(ownIndent + tree.value)
            break
        case 'variable':
            buffer.push(`${ownIndent}"${tree.name}"`)
            break
        case 'positive':
            buffer.push(`${ownIndent}-`)
            pushTree(tree.value, buffer, descendantIndent, 'last')
            break
        case 'negative':
            buffer.push(`${ownIndent}-`)
            pushTree(tree.value, buffer, descendantIndent, 'last')
            break
        case 'positive-negative':
            buffer.push(`${ownIndent}±`)
            pushTree(tree.value, buffer, descendantIndent, 'last')
            break
        case 'block':
            buffer.push(`${ownIndent}()`)
            pushTree(tree.child, buffer, descendantIndent, 'last')
            break
        case 'equals':
        case 'less-than':
        case 'greater-than':
        case 'less-than-equals':
        case 'greater-than-equals':
        case 'approximates':
        case 'plus':
        case 'minus':
        case 'plus-minus':
        case 'multiply-implicit':
        case 'multiply-dot':
        case 'multiply-cross':
        case 'divide-fraction':
        case 'divide-inline':
        case 'power':
            buffer.push(ownIndent + operatorMap[tree.type])
            pushTree(tree.a, buffer, descendantIndent, 'regular')
            pushTree(tree.b, buffer, descendantIndent, 'last')
            break
        case 'function':
            buffer.push(`${ownIndent}${tree.name}()`)
            tree.args.forEach((arg, idx) => {
                pushTree(arg, buffer, descendantIndent, idx < tree.args.length - 1 ? 'regular' : 'last')
            })
            break
        case 'matrix':
            if (tree.n === 1) {
                buffer.push(`${ownIndent}v ${tree.m}`)

                tree.values.forEach((row, idx) => {
                    pushTree(row[0], buffer, descendantIndent, idx < tree.m - 1 ? 'regular' : 'last')
                })
            } else {
                buffer.push(`${ownIndent}m ${tree.m}x${tree.n}`)

                tree.values.forEach((row, rowIdx) => {
                    const rowIndent = descendantIndent + (rowIdx < tree.m - 1 ? '│  ' : '   ')
                    row.forEach((cell, cellIdx) => {
                        if (cellIdx === 0) {
                            if (rowIdx < tree.m - 1) {
                                pushTree(cell, buffer, descendantIndent + '├──┬─ ', 'initial')
                            } else {
                                pushTree(cell, buffer, descendantIndent + '└──┬─ ', 'initial')
                            }
                        } else {
                            pushTree(cell, buffer, rowIndent, cellIdx < tree.n - 1 ? 'regular' : 'last')
                        }
                    })
                })
            }
            break
        default:
            throwUnknownType(tree, (type) => `Equation tree to string: cannot resolve type "${type}"`)
    }

    return buffer
}
