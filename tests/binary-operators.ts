import { parse } from '../src'

import toVariable from './helpers/toVariable'
import toNumber from './helpers/toNumber'

test('plus', () => {
    expect(parse(`3+a`)).toEqual({
        type: 'plus',
        a: toNumber(3),
        b: toVariable('a'),
    })
})

test('minus', () => {
    expect(parse(`3-a`)).toEqual({
        type: 'minus',
        a: toNumber(3),
        b: toVariable('a'),
    })
})

test('plus-minus', () => {
    expect(parse(`3±a`)).toEqual({
        type: 'plus-minus',
        a: toNumber(3),
        b: toVariable('a'),
    })
})

test('multiplication', () => {
    expect(parse(`3*a`)).toEqual({
        type: 'multiply-dot',
        a: toNumber(3),
        b: toVariable('a'),
    })
    expect(parse(`3a`)).toEqual({
        type: 'multiply-implicit',
        a: toNumber(3),
        b: toVariable('a'),
    })
    expect(parse(`3 a`)).toEqual({
        type: 'multiply-implicit',
        a: toNumber(3),
        b: toVariable('a'),
    })
})

test('division', () => {
    expect(parse(`3/a`)).toEqual({
        type: 'divide-fraction',
        a: toNumber(3),
        b: toVariable('a'),
    })
    expect(parse(`3÷a`)).toEqual({
        type: 'divide-inline',
        a: toNumber(3),
        b: toVariable('a'),
    })
})

test('exponentiation', () => {
    expect(parse(`3^a`)).toEqual({
        type: 'power',
        a: toNumber(3),
        b: toVariable('a'),
    })
})
