import { EquationNode } from './EquationNode'
import { Token, TokenMatrixClose, TokenParensClose, TokenComma, TokenOperator } from './Token'

import { ParserError } from './ParserError'
import { throwUnknownType } from './throwUnknownType'

export const precedence = {
    'equals': 1,
    'less-than': 1,
    'greater-than': 1,
    'less-than-equals': 1,
    'greater-than-equals': 1,
    'approximates': 1,

    'plus': 2,
    'minus': 2,
    'plus-minus': 2,

    'multiply-implicit': 3,
    'multiply-dot': 3,
    'multiply-cross': 3,
    'divide-fraction': 3,
    'divide-inline': 3,

    'power': 4,

    'operator-placeholder': 5,
}

export const unaryOperatorMap = {
    'plus': 'positive',
    'minus': 'negative',
    'plus-minus': 'positive-negative',
    'operator-placeholder': 'operator-unary-placeholder',
} as const

export const rightAssociativeOperators = ['power']

type Terminator =
    | TokenMatrixClose['type']
    | TokenParensClose['type']
    | TokenComma['type']
    | 'end'

export const parseListExpression = (input: string, tokens: Array<Token>, startAt: number): { results: EquationNode[], terminator: Terminator, last: number } => {
    const results: Array<EquationNode> = []
    let subexpression: ReturnType<typeof parseSubexpression>
    let i = startAt
    do {
        subexpression = parseSubexpression(input, tokens, i)
        if (subexpression.result) {
            results.push(subexpression.result)
        }
        i = subexpression.last + 1
    } while (subexpression.terminator === 'comma')
    return {
        results,
        terminator: subexpression.terminator,
        last: subexpression.last,
    }
}

export const parseSubexpression = (input: string, tokens: Token[], startAt: number): { result: EquationNode | null, terminator: Terminator, last: number } => {
    const output: Array<EquationNode> = []
    const operators: Array<TokenOperator> = []

    const getTokenType = (index: number): Token['type'] | undefined => tokens[index] ? tokens[index].type : undefined
    const getTokenPosition = (index: number) => tokens[index] && tokens[index].position

    const addOperator = (operator: TokenOperator) => {
        const b = output.pop()
        const a = output.pop()
        const unaryType: typeof unaryOperatorMap[keyof typeof unaryOperatorMap] | undefined = unaryOperatorMap[operator.value as keyof typeof unaryOperatorMap]
        if (a && b) {
            output.push({ type: operator.value, a, b })
        } else if (unaryType && b) {
            output.push({ type: unaryType, value: b })
        } else if (b) {
            throw new ParserError(operator.position, operator.position, 'invalidUnary', { symbol: operator.symbol })
        } else {
            // No operands. This should never happen, all cases should be caught by operatorLast instead
            throw new Error('Unexpected parser state, operator with no operands')
        }
    }

    const prepareResult = (terminator: Terminator, last: number) => {
        if (last > 0 && tokens[last - 1].type === 'operator') {
            throw new ParserError(getTokenPosition(last - 1), getTokenPosition(last - 1), 'operatorLast', {})
        }
        while(operators.length > 0) {
            addOperator(operators.pop()!)
        }

        if (output.length > 1) {
            throw new ParserError(getTokenPosition(startAt), getTokenPosition(last - 1), 'multipleExpressions', {})
        }

        if (output.length === 0) {
            return { result: null, terminator, last }
        }

        return { result: output[0], terminator, last }
    }

    for (let i = startAt; i < tokens.length; i++) {
        const token = tokens[i]

        switch (token.type) {
            case 'number':
                output.push({ type: 'number', value: token.value })
                break

            case 'name':
                if (getTokenType(i + 1) === 'parens-open') {
                    // Function
                    const { results, last, terminator } = parseListExpression(input, tokens, i + 2)
                    if (terminator !== 'parens-close') {
                        throw new ParserError(getTokenPosition(i + 1), getTokenPosition(last - 1), 'expectedCloseParens', {})
                    }
                    if (token.value === '_') {
                        output.push({ type: 'function-placeholder', args: results })
                    } else {
                        output.push({ type: 'function', name: token.value, args: results })
                    }
                    i = last
                } else if (token.value === '_') {
                    output.push({ type: 'operand-placeholder' })
                } else {
                    // Variable
                    output.push({ type: 'variable', name: token.value })
                }
                break

            case 'matrix-open':
                if (getTokenType(i + 1) === 'matrix-open') {
                    // Parsing matrix
                    // [[a,b,c][d,e,f][g,h,i]]

                    const values: Array<Array<EquationNode>> = []
                    // Extract all nested vectors
                    let current = i + 1
                    while (getTokenType(current) === 'matrix-open') {
                        const { results, last, terminator } = parseListExpression(input, tokens, current + 1)
                        if (terminator !== 'matrix-close') {
                            throw new ParserError(getTokenPosition(current), getTokenPosition(last - 1), 'expectedSquareBracket', {})
                        }
                        if (values.length > 0 && values[0].length !== results.length) {
                            throw new ParserError(getTokenPosition(current), getTokenPosition(last), 'matrixMixedDimension', { lengthExpected: values[0].length, lengthReceived: results.length })
                        }
                        if (results.length === 0) {
                            throw new ParserError(getTokenPosition(current), getTokenPosition(last), 'matrixEmpty', {})
                        }
                        values.push(results)
                        current = last + 1
                    }
                    // The last vector-component should be followed by a closing bracket
                    if (getTokenType(current) !== 'matrix-close') {
                        throw new ParserError(getTokenPosition(i), getTokenPosition(current - 1), 'expectedSquareBracket', {})
                    }

                    output.push({ type: 'matrix', n: values[0].length, m: values.length, values })

                    // Advance parsing past closing bracket
                    i = current
                } else {
                    // Parsing single vector
                    // [a,b,c]

                    const { results, last, terminator } = parseListExpression(input, tokens, i + 1)
                    if (terminator !== 'matrix-close') {
                        throw new ParserError(getTokenPosition(i), getTokenPosition(last - 1), 'expectedSquareBracket', {})
                    }
                    if (results.length === 0) {
                        throw new ParserError(getTokenPosition(i), getTokenPosition(last), 'vectorEmpty', {})
                    }

                    output.push({ type: 'matrix', n: 1, m: results.length, values: results.map((value) => [value]) })
                    i = last
                }
                break

            case 'parens-open': {
                const { result, last, terminator } = parseSubexpression(input, tokens, i + 1)
                if (terminator !== 'parens-close') {
                    throw new ParserError(getTokenPosition(i), getTokenPosition(last - 1), 'expectedCloseParens', {})
                }
                if (result === null) {
                    throw new ParserError(getTokenPosition(i), getTokenPosition(last), 'emptyBlock', {})
                }
                output.push({ type: 'block', child: result })
                i = last
                break
            }
            case 'operator':
                while (operators.length > 0) {
                    const other = operators[operators.length - 1]
                    const tokenPrecedence = precedence[token.value]
                    const otherPrecedence = precedence[other.value]
                    if (otherPrecedence < tokenPrecedence || (rightAssociativeOperators.includes(other.value) && otherPrecedence === tokenPrecedence)) {
                        break
                    }

                    operators.pop()
                    addOperator(other)
                }
                operators.push(token)
                break

            case 'comma':
            case 'parens-close':
            case 'matrix-close':
                return prepareResult(token.type, i)

            default:
                throwUnknownType(token, (type) => `Equation render: cannot resolve type "${type}"`)
        }
    }

    return prepareResult('end', tokens.length)
}
