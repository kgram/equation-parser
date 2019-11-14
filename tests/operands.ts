import { parse } from '../src'

import toVariable from './helpers/toVariable'
import toNumber from './helpers/toNumber'

test('parses integers', () => {
    expect(parse('1')).toEqual(toNumber(1))
    expect(parse('123456')).toEqual(toNumber(123456))
})

test('parses floats', () => {
    expect(parse('0.5')).toEqual(toNumber(0.5))
    expect(parse('123.456')).toEqual(toNumber(123.456))
    expect(parse('.2')).toEqual(toNumber('.2'))
})

test('rejects invalid number formats', () => {
    expect(parse('2.3.5')).toEqual({
        type: 'parser-error',
        errorType: 'invalidNumber',
        equation: '2.3.5',
        start: 0,
        end: 4,
        values: [],
    })
    expect(parse('2.')).toEqual({
        type: 'parser-error',
        errorType: 'invalidNumber',
        equation: '2.',
        start: 0,
        end: 1,
        values: [],
    })
})

test('invalid whitespace', () => {
    expect(parse('1 2')).toEqual({
        type: 'parser-error',
        errorType: 'numberWhitespace',
        equation: '1 2',
        start: 0,
        end: 2,
        values: [],
    })
})

test('parses variables', () => {
    expect(parse('x')).toEqual(toVariable('x'))
    expect(parse('x2')).toEqual(toVariable('x2'))
    expect(parse('x_2')).toEqual(toVariable('x_2'))
    expect(parse('%')).toEqual(toVariable('%'))
    expect(parse('x_x_x_x_x_x')).toEqual(toVariable('x_x_x_x_x_x'))
})

test('invalid character', () => {
    expect(parse('#')).toEqual({
        type: 'parser-error',
        errorType: 'invalidChar',
        equation: '#',
        start: 0,
        end: 0,
        values: ['#'],
    })
})

test('operand placeholder', () => {
    expect(parse('_')).toEqual({ type: 'operand-placeholder' })
})
