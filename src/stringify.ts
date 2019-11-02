import { EquationNode } from './EquationNode'
import { throwUnknownType } from './throwUnknownType'

export default function stringify(tree: EquationNode) {
    const buffer: string[] = []
    stringifyTree(tree, buffer)
    return buffer.join('')
}

const operatorMap = {
    'equals': ' = ',
    'less-than': ' < ',
    'greater-than': ' > ',
    'less-than-equals': ' ≤ ',
    'greater-than-equals': ' ≥ ',
    'approximates': ' ≈ ',
    'plus': ' + ',
    'minus': ' - ',
    'plus-minus': ' ± ',
    'multiply-implicit': ' ',
    'multiply-dot': ' * ',
    'multiply-cross': ' × ',
    'divide-fraction': ' / ',
    'divide-inline': ' ÷ ',
    'power': ' ^ ',
} as const

function stringifyTree(tree: EquationNode, buffer: string[]) {
    switch (tree.type) {
        case 'number':
            buffer.push(tree.value.toString())
            break
        case 'variable':
            buffer.push(tree.name)
            break
        case 'positive':
            buffer.push('+')
            stringifyTree(tree.value, buffer)
            break
        case 'negative':
            buffer.push('-')
            stringifyTree(tree.value, buffer)
            break
        case 'positive-negative':
            buffer.push('±')
            stringifyTree(tree.value, buffer)
            break
        case 'block':
            buffer.push('(')
            stringifyTree(tree.child, buffer)
            buffer.push(')')
            break
        case 'plus':
        case 'minus':
        case 'plus-minus':
        case 'divide-fraction':
        case 'divide-inline':
        case 'multiply-implicit':
        case 'multiply-dot':
        case 'multiply-cross':
        case 'power':
        case 'equals':
        case 'less-than':
        case 'greater-than':
        case 'less-than-equals':
        case 'greater-than-equals':
        case 'approximates':
            stringifyTree(tree.a, buffer)
            buffer.push(operatorMap[tree.type])
            stringifyTree(tree.b, buffer)
            break
        case 'function':
            buffer.push(tree.name)
            buffer.push('(')
            tree.args.forEach((arg, idx) => {
                if (idx > 0) {
                    buffer.push(',')
                }
                stringifyTree(arg, buffer)
            })
            buffer.push(')')
            break
        case 'matrix':
            buffer.push('[')
            tree.values.forEach((row, rowIdx) => {
                if (tree.n > 1) {
                    buffer.push('[')
                } else if (rowIdx > 0) {
                    buffer.push(',')
                }
                row.forEach((cell, cellIdx) => {
                    if (cellIdx > 0) {
                        buffer.push(',')
                    }
                    stringifyTree(cell, buffer)
                })
                if (tree.n > 1) {
                    buffer.push(']')
                }
            })
            buffer.push(']')
            break
        case 'parser-error':
            buffer.push(tree.equation)
            break
        default:
            throwUnknownType(tree, (type) => `Equation tree to string: cannot resolve type "${type}"`)
    }
}
