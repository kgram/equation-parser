// Operators type map
export const operatorMap = {
    '=': 'equals',
    '<': 'less-than',
    '>': 'greater-than',
    '≤': 'less-than-equals',
    '≥': 'greater-than-equals',
    '≈': 'approximates',
    '+': 'plus',
    '-': 'minus',
    '−': 'minus', // Minus Sign (U+2212)
    '±': 'plus-minus',
    ' ': 'multiply-implicit',
    '*': 'multiply-dot',
    '∗': 'multiply-dot', // Asterisk Operator (U+2217)
    '⋅': 'multiply-dot', // Dot Operator (U+22C5)
    '×': 'multiply-cross', // Multiplication Sign (U+00D7)
    '✕': 'multiply-cross', // Multiplication X (U+2715)
    '/': 'divide-fraction',
    '∕': 'divide-fraction', // Division Slash (U+2215)
    '÷': 'divide-inline', // Division Sign (U+00F7)
    '^': 'power',
} as const
