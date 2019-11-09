import { EquationNode } from './EquationNode'
import { EquationParserError } from './EquationParserError'
import { ParserError } from './ParserError'
import { tokenize } from './tokenize'
import { parseSubexpression } from './parseExpression'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const parse = (input: string): EquationNode | EquationParserError => {
    try {
        const tokens = tokenize(input)

        const { result, last, terminator } = parseSubexpression(input, tokens, 0)

        if (terminator !== 'end') {
            throw new ParserError(tokens[last].position, tokens[last].position, 'expectedEnd')
        }

        if (result === null) {
            throw new ParserError(0, 0, 'expectedEnd')
        }

        return result
    } catch (error) {
        if (error instanceof ParserError) {
            return {
                type: 'parser-error',
                equation: input,
                errorType: error.type,
                start: error.start,
                end: error.end,
                values: error.values,
            }
        } else {
            throw error
        }
    }
}
