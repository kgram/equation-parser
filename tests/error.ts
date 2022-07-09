import { parse } from '../src'

test('error numberWhitespace', () => {
    expect(parse('10 234')).toEqual({
        type: 'parser-error',
        errorType: 'numberWhitespace',
        equation: '10 234',
        start: 0,
        end: 5,
    })
})

test('error invalidNumber', () => {
    expect(parse('1.2.3')).toEqual({
        type: 'parser-error',
        errorType: 'invalidNumber',
        equation: '1.2.3',
        start: 0,
        end: 4,
    })
})

test('error adjecentOperator', () => {
    expect(parse('2 * + 3')).toEqual({
        type: 'parser-error',
        errorType: 'adjecentOperator',
        equation: '2 * + 3',
        start: 3,
        end: 4,
    })
})

test('error invalidChar', () => {
    expect(parse('2 & 3')).toEqual({
        type: 'parser-error',
        errorType: 'invalidChar',
        equation: '2 & 3',
        start: 2,
        end: 2,
        character: '&',
    })
})

test('error invalidUnary', () => {
    expect(parse('2 + (* 3)')).toEqual({
        type: 'parser-error',
        errorType: 'invalidUnary',
        equation: '2 + (* 3)',
        start: 5,
        end: 5,
        symbol: '*',
    })
})

test('error multipleExpressions', () => {
    expect(parse('[1,2][3,4]')).toEqual({
        type: 'parser-error',
        errorType: 'multipleExpressions',
        equation: '[1,2][3,4]',
        start: 0,
        end: 9,
    })
})

test('error matrixMixedDimension', () => {
    expect(parse('[[1,2][1,2,3]]')).toEqual({
        type: 'parser-error',
        errorType: 'matrixMixedDimension',
        equation: '[[1,2][1,2,3]]',
        start: 6,
        end: 12,
        lengthExpected: 2,
        lengthReceived: 3,
    })
})

test('error matrixEmpty', () => {
    expect(parse('[[]]')).toEqual({
        type: 'parser-error',
        errorType: 'matrixEmpty',
        equation: '[[]]',
        start: 1,
        end: 2,
    })
})

test('error vectorEmpty', () => {
    expect(parse('[]')).toEqual({
        type: 'parser-error',
        errorType: 'vectorEmpty',
        equation: '[]',
        start: 0,
        end: 1,
    })
})

test('error expectedEnd', () => {
    expect(parse('1 + 2)')).toEqual({
        type: 'parser-error',
        errorType: 'expectedEnd',
        equation: '1 + 2)',
        start: 5,
        end: 5,
    })
})

test('error expectedEnd, empty', () => {
    expect(parse(')')).toEqual({
        type: 'parser-error',
        errorType: 'expectedEnd',
        equation: ')',
        start: 0,
        end: 0,
    })
})

test('error expectedSquareBracket', () => {
    expect(parse('[1, 2')).toEqual({
        type: 'parser-error',
        errorType: 'expectedSquareBracket',
        equation: '[1, 2',
        start: 0,
        end: 4,
    })
})

test('error expectedCloseParens', () => {
    expect(parse('f(x')).toEqual({
        type: 'parser-error',
        errorType: 'expectedCloseParens',
        equation: 'f(x',
        start: 1,
        end: 2,
    })
})

test('error operatorLast', () => {
    expect(parse('2 * 3 +')).toEqual({
        type: 'parser-error',
        errorType: 'operatorLast',
        equation: '2 * 3 +',
        start: 6,
        end: 6,
    })
})

test('error emptyBlock', () => {
    expect(parse('2 * 3 + ()')).toEqual({
        type: 'parser-error',
        errorType: 'emptyBlock',
        equation: '2 * 3 + ()',
        start: 8,
        end: 9,
    })
})
