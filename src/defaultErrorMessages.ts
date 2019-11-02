export const defaultErrorMessages = {
    // Tokenizer errors
    'numberWhitespace': 'Invalid whitespace in number',
    'invalidNumber': 'Invalid number',
    'adjecentOperator': 'Cannot have adjecent operators',
    'invalidChar': 'Invalid character "{0}"',
    // Parser errors
    'invalidUnary': '"{0}" cannot be used as unary operator',
    'noOperand': '"{0}" has no operands',
    'multipleExpressions': 'Parsing must result in single expression',
    'matrixMixedDimension': `Matrix dimension mismatch, expected rows of {0}, not {1}`,
    'matrixEmpty': `Matrix cannot have rows of 0 elements`,
    'vectorEmpty': `Vector cannot have 0 elements`,
    'expectedEnd': 'Unexpected end of equation',
    'expectedSquareBracket': 'Expected right square-bracket',
    'expectedCloseParens': 'Expected right parenthesis',
} as const
