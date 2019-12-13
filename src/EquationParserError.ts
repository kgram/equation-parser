export type EquationParserError = { type: 'parser-error', equation: string, start: number, end: number } & (
    | { errorType: 'numberWhitespace' }
    | { errorType: 'invalidNumber' }
    | { errorType: 'adjecentOperator' }
    | { errorType: 'invalidChar', character: string }
    | { errorType: 'invalidUnary', symbol: string }
    | { errorType: 'noOperand' }
    | { errorType: 'multipleExpressions' }
    | { errorType: 'matrixMixedDimension', lengthExpected: number, lengthReceived: number }
    | { errorType: 'matrixEmpty' }
    | { errorType: 'vectorEmpty' }
    | { errorType: 'expectedEnd' }
    | { errorType: 'expectedSquareBracket' }
    | { errorType: 'expectedCloseParens' }
    | { errorType: 'operatorLast' }
    | { errorType: 'emptyBlock' }
)
