import { ParserError } from './ParserError'
import { Token } from './Token'
import { operatorMap } from './operatorMap'

const isWhitespace = /\s/
const isCharNumber = /[0-9.]/
// Leading numbers doesn't matter, since number check is before name check
const isCharName = /[0-9A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u01BF\u0391-\u03c9'"%‰°_∞]/
const isValidNumber = /^([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/

function endOfPattern(input: string, pattern: RegExp, start: number) {
    let end = start
    do {
        end++
    } while (end < input.length && pattern.test(input[end]))
    return end
}

export const tokenize = (input: string) => {
    const result: Token[] = []
    let lastType: Token['type'] | null = null

    for (let i = 0; i < input.length; i++) {
        const current = input[i]
        if (isWhitespace.test(current)) {
            continue
        } else if (isCharNumber.test(current)) {
            const end = endOfPattern(input, isCharNumber, i)
            if (lastType === 'number') {
                throw new ParserError(result[result.length - 1].position, end - 1, 'numberWhitespace', {})
            }
            if (lastType === 'name' || lastType === 'parens-close' || lastType === 'matrix-close') {
                result.push({ type: 'operator', value: 'multiply-implicit', symbol: ' ', position: i })
            }
            const value = input.substring(i, end)
            if (!isValidNumber.test(value)) {
                throw new ParserError(i, end - 1, 'invalidNumber', {})
            }
            result.push({ type: 'number', value, position: i })
            i = end - 1
        } else if (isCharName.test(current)) {
            if (lastType === 'number' || lastType === 'name' || lastType === 'parens-close' || lastType === 'matrix-close') {
                result.push({ type: 'operator', value: 'multiply-implicit', symbol: ' ', position: i })
            }
            const end = endOfPattern(input, isCharName, i)
            result.push({ type: 'name', value: input.substring(i, end), position: i })
            i = end - 1
        } else if (current in operatorMap) {
            if (lastType === 'operator') {
                throw new ParserError(i - 1, i, 'adjecentOperator', {})
            }
            result.push({
                type: 'operator',
                value: operatorMap[current as keyof typeof operatorMap],
                symbol: current as keyof typeof operatorMap,
                position: i,
            })
        } else if (current === '(') {
            if (lastType === 'number' || lastType === 'parens-close' || lastType === 'matrix-close') {
                result.push({ type: 'operator', value: 'multiply-implicit', symbol: ' ', position: i })
            }
            result.push({ type: 'parens-open', position: i })
        } else if (current === ')') {
            result.push({ type: 'parens-close', position: i })
        } else if (current === '[') {
            if (lastType === 'number' || lastType === 'name' || lastType === 'parens-close') {
                result.push({ type: 'operator', value: 'multiply-implicit', symbol: ' ', position: i })
            }
            result.push({ type: 'matrix-open', position: i })
        } else if (current === ']') {
            result.push({ type: 'matrix-close', position: i })
        } else if (current === ',') {
            result.push({ type: 'comma', position: i })
        } else {
            throw new ParserError(i, i, 'invalidChar', { character: current })
        }

        lastType = result[result.length - 1].type
    }

    return result
}
