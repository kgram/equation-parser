import { parse } from '../src'

import toVariable from './helpers/toVariable'
import toNumber from './helpers/toNumber'

test('equals (=)', () => {
    expect(parse('a = 10')).toEqual({
        type: 'equals',
        a: toVariable('a'),
        b: toNumber(10),
    })
})
test('less than (<)', () => {
    expect(parse('a < 10')).toEqual({
        type: 'less-than',
        a: toVariable('a'),
        b: toNumber(10),
    })
})
test('greater than (>)', () => {
    expect(parse('a > 10')).toEqual({
        type: 'greater-than',
        a: toVariable('a'),
        b: toNumber(10),
    })
})
test('less than or equal (≤)', () => {
    expect(parse('a ≤ 10')).toEqual({
        type: 'less-than-equals',
        a: toVariable('a'),
        b: toNumber(10),
    })
})
test('greater than or equal (≥)', () => {
    expect(parse('a ≥ 10')).toEqual({
        type: 'greater-than-equals',
        a: toVariable('a'),
        b: toNumber(10),
    })
})
test('aprox. equal (≈)', () => {
    expect(parse('a ≈ 10')).toEqual({
        type: 'approximates',
        a: toVariable('a'),
        b: toNumber(10),
    })
})






