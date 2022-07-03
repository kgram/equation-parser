import { ParserError } from './ParserError'
import { Token } from './Token'
import { operatorMap } from './operatorMap'
import { charNamePattern, charNumberPattern, numberPattern, whitespacePattern } from './patterns'

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
        if (whitespacePattern.test(current)) {
            continue
        } else if (charNumberPattern.test(current)) {
            const end = endOfPattern(input, charNumberPattern, i)
            if (lastType === 'number') {
                throw new ParserError(result[result.length - 1].position, end - 1, 'numberWhitespace', {})
            }
            if (lastType === 'name' || lastType === 'parens-close' || lastType === 'matrix-close') {
                result.push({ type: 'operator', value: 'multiply-implicit', symbol: ' ', position: i })
            }
            const value = input.substring(i, end)
            if (!numberPattern.test(value)) {
                throw new ParserError(i, end - 1, 'invalidNumber', {})
            }
            result.push({ type: 'number', value, position: i })
            i = end - 1
        // Doesn't matter that this can also match a number, we already checked for that above
        } else if (charNamePattern.test(current)) {
            if (lastType === 'number' || lastType === 'name' || lastType === 'parens-close' || lastType === 'matrix-close') {
                result.push({ type: 'operator', value: 'multiply-implicit', symbol: ' ', position: i })
            }
            const end = endOfPattern(input, charNamePattern, i)
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
