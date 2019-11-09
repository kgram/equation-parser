import { parse } from '../src'

import toVariable from './helpers/toVariable'

test('vector', () => {
    expect(parse('[a]')).toEqual({
        type: 'matrix',
        n: 1,
        m: 1,
        values: [[toVariable('a')]],
    })
    expect(parse('[a,b,  c  ]')).toEqual({
        type: 'matrix',
        n: 1,
        m: 3,
        values: [[toVariable('a')], [toVariable('b')], [toVariable('c')]],
    })
})

test('vector invalid with nested vector', () => {
    expect(parse('[[a], [b], [c]]')).toEqual({
        type: 'parser-error',
        errorType: 'expectedSquareBracket',
        equation: '[[a], [b], [c]]',
        start: 0,
        end: 3,
        values: [],
    })
})

test('vector empty', () => {
    expect(parse('[]')).toEqual({
        type: 'parser-error',
        errorType: 'vectorEmpty',
        equation: '[]',
        start: 0,
        end: 1,
        values: [],
    })
})
