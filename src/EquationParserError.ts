export type EquationParserError = {
    type: 'parser-error',
    errorType:
    | 'numberWhitespace'
    | 'invalidNumber'
    | 'adjecentOperator'
    | 'invalidChar'
    | 'invalidUnary'
    | 'noOperand'
    | 'multipleExpressions'
    | 'matrixMixedDimension'
    | 'matrixEmpty'
    | 'vectorEmpty'
    | 'expectedEnd'
    | 'expectedSquareBracket'
    | 'expectedCloseParens'
    | 'operatorLast'
    | 'emptyBlock',
    equation: string,
    start: number,
    end: number,
    values: any[],
}
