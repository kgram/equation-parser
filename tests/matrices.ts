import { parse } from '../src'

import toVariable from './helpers/toVariable'

test('horizontal vector', () => {
    expect(parse('[[a]]')).toEqual({
        type: 'matrix',
        n: 1,
        m: 1,
        values: [[toVariable('a')]],
    })
    expect(parse('[[a,b,  c  ]]')).toEqual({
        type: 'matrix',
        n: 3,
        m: 1,
        values: [[toVariable('a'), toVariable('b'), toVariable('c')]],
    })
})

test('matrix', () => {
    expect(parse('[[a, b, c][d, e, f]]')).toEqual({
        type: 'matrix',
        n: 3,
        m: 2,
        values: [
            [toVariable('a'), toVariable('b'), toVariable('c')],
            [toVariable('d'), toVariable('e'), toVariable('f')],
        ],
    })
})

test('unclosed inner', () => {
    expect(parse('[[a,b')).toEqual({
        type: 'parser-error',
        errorType: 'expectedSquareBracket',
        equation: '[[a,b',
        start: 1,
        end: 4,
        values: [],
    })
})

test('unclosed outer', () => {
    expect(parse('[[a,b]')).toEqual({
        type: 'parser-error',
        errorType: 'expectedSquareBracket',
        equation: '[[a,b]',
        start: 0,
        end: 5,
        values: [],
    })
})

test('mixed dimensions', () => {
    expect(parse('[[a,b][c]]')).toEqual({
        type: 'parser-error',
        errorType: 'matrixMixedDimension',
        equation: '[[a,b][c]]',
        start: 6,
        end: 8,
        values: [2, 1],
    })
})

test('empty dimensions', () => {
    expect(parse('[[]]')).toEqual({
        type: 'parser-error',
        errorType: 'matrixEmpty',
        equation: '[[]]',
        start: 1,
        end: 2,
        values: [],
    })
})


