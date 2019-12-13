import { parse } from '../src'

import toNumber from './helpers/toNumber'

test('stand-alone', () => {
    expect(parse('+5')).toEqual({
        type: 'positive',
        value: toNumber(5),
    })
    expect(parse('-5')).toEqual({
        type: 'negative',
        value: toNumber(5),
    })
    expect(parse('±5')).toEqual({
        type: 'positive-negative',
        value: toNumber(5),
    })
})

test('by operators', () => {
    expect(parse('-5-5')).toEqual({
        type: 'minus',
        a: {
            type: 'negative',
            value: toNumber(5),
        },
        b: toNumber(5),
    })
    expect(parse('5--5')).toEqual({
        type: 'parser-error',
        errorType: 'adjecentOperator',
        equation: '5--5',
        start: 1,
        end: 2,
    })

    expect(parse('±5-5')).toEqual({
        type: 'minus',
        a: {
            type: 'positive-negative',
            value: toNumber(5),
        },
        b: toNumber(5),
    })
    expect(parse('5*±5')).toEqual({
        type: 'parser-error',
        errorType: 'adjecentOperator',
        equation: '5*±5',
        start: 1,
        end: 2,
    })
})

test('in block', () => {
    expect(parse('(-5)')).toEqual({
        type: 'block',
        child: {
            type: 'negative',
            value: toNumber(5),
        },
    })
    expect(parse('(±5)')).toEqual({
        type: 'block',
        child: {
            type: 'positive-negative',
            value: toNumber(5),
        },
    })
})

test('end of string', () => {
    expect(parse('5+')).toEqual({
        type: 'parser-error',
        errorType: 'operatorLast',
        equation: '5+',
        start: 1,
        end: 1,
    })
    expect(parse('5-')).toEqual({
        type: 'parser-error',
        errorType: 'operatorLast',
        equation: '5-',
        start: 1,
        end: 1,
    })
    expect(parse('5±')).toEqual({
        type: 'parser-error',
        errorType: 'operatorLast',
        equation: '5±',
        start: 1,
        end: 1,
    })
})

test('invalid unary operator', () => {
    expect(parse('*5')).toEqual({
        type: 'parser-error',
        errorType: 'invalidUnary',
        equation: '*5',
        start: 0,
        end: 0,
        symbol: '*',
    })
})

test('unary operator placeholder', () => {
    expect(parse(`? 3`)).toEqual({
        type: 'operator-unary-placeholder',
        value: toNumber(3),
    })
})
