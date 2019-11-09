import { parse } from '../src'

import toVariable from './helpers/toVariable'
import toNumber from './helpers/toNumber'

test('alone', () => {
    expect(parse('(a)')).toEqual({
        type: 'block',
        child: toVariable('a'),
    })
    expect(parse('( a + 2)')).toEqual({
        type: 'block',
        child: {
            type: 'plus',
            a: toVariable('a'),
            b: toNumber(2),
        },
    })
})

test('with operator', () => {
    expect(parse('(a)')).toEqual({
        type: 'block',
        child: toVariable('a'),
    })
    expect(parse('5 *( a + 2)')).toEqual({
        type: 'multiply-dot',
        a: toNumber(5),
        b: {
            type: 'block',
            child: {
                type: 'plus',
                a: toVariable('a'),
                b: toNumber(2),
            },
        },
    })
})

test('no close', () => {
    expect(parse('(a')).toEqual({
        type: 'parser-error',
        errorType: 'expectedCloseParens',
        equation: '(a',
        start: 0,
        end: 1,
        values: [],
    })
    expect(parse('(a]')).toEqual({
        type: 'parser-error',
        errorType: 'expectedCloseParens',
        equation: '(a]',
        start: 0,
        end: 1,
        values: [],
    })
    expect(parse('(a,')).toEqual({
        type: 'parser-error',
        errorType: 'expectedCloseParens',
        equation: '(a,',
        start: 0,
        end: 1,
        values: [],
    })
})

test('empty', () => {
    expect(parse('()')).toEqual({
        type: 'parser-error',
        errorType: 'emptyBlock',
        equation: '()',
        start: 0,
        end: 1,
        values: [],
    })
})

test('no open', () => {
    expect(parse('a)')).toEqual({
        type: 'parser-error',
        errorType: 'expectedEnd',
        equation: 'a)',
        start: 1,
        end: 1,
        values: [],
    })
})


