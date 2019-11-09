import { parse } from '../src'

import toVariable from './helpers/toVariable'
import toNumber from './helpers/toNumber'

test('number - variable', () => {
    expect(parse('2a')).toEqual({
        type: 'multiply-implicit',
        a: toNumber(2),
        b: toVariable('a'),
    })
})

test('variable - variable', () => {
    expect(parse('a b')).toEqual({
        type: 'multiply-implicit',
        a: toVariable('a'),
        b: toVariable('b'),
    })
})

test('block - block', () => {
    expect(parse('(a)(b)')).toEqual({
        type: 'multiply-implicit',
        a: { type: 'block', child: toVariable('a') },
        b: { type: 'block', child: toVariable('b') },
    })
})

test('block - variable', () => {
    expect(parse('(a) b')).toEqual({
        type: 'multiply-implicit',
        a: { type: 'block', child: toVariable('a') },
        b: toVariable('b'),
    })
})

test('vector - variable', () => {
    expect(parse('[a]b')).toEqual({
        type: 'multiply-implicit',
        a: { type: 'matrix', n: 1, m: 1, values: [[toVariable('a')]] },
        b: toVariable('b'),
    })
    expect(parse('a[b]')).toEqual({
        type: 'multiply-implicit',
        a: toVariable('a'),
        b: { type: 'matrix', n: 1, m: 1, values: [[toVariable('b')]] },
    })
})

test('vector - number', () => {
    expect(parse('[a]2')).toEqual({
        type: 'multiply-implicit',
        a: { type: 'matrix', n: 1, m: 1, values: [[toVariable('a')]] },
        b: toNumber(2),
    })
    expect(parse('2[b]')).toEqual({
        type: 'multiply-implicit',
        a: toNumber(2),
        b: { type: 'matrix', n: 1, m: 1, values: [[toVariable('b')]] },
    })
})

test('vector - block', () => {
    expect(parse('[a](b)')).toEqual({
        type: 'multiply-implicit',
        a: { type: 'matrix', n: 1, m: 1, values: [[toVariable('a')]] },
        b: { type: 'block', child: toVariable('b') },
    })
    expect(parse('(a)[b]')).toEqual({
        type: 'multiply-implicit',
        a: { type: 'block', child: toVariable('a') },
        b: { type: 'matrix', n: 1, m: 1, values: [[toVariable('b')]] },
    })
})
