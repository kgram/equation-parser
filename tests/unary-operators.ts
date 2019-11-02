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
    expect(() => parse('5--5')).toThrow()

    expect(parse('±5-5')).toEqual({
        type: 'minus',
        a: {
            type: 'positive-negative',
            value: toNumber(5),
        },
        b: toNumber(5),
    })
    expect(() => parse('5-±5')).toThrow()
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
