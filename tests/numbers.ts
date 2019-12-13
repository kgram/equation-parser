import { parse } from '../src'

import toNumber from './helpers/toNumber'

test('integer', () => {
    expect(parse('3')).toEqual(toNumber(3))
    expect(parse('123456')).toEqual(toNumber(123456))
})

test('decimal', () => {
    expect(parse('1.2')).toEqual(toNumber(1.2))
    expect(parse('0.1234')).toEqual(toNumber(0.1234))
    expect(parse('.2')).toEqual(toNumber('.2'))
})

test('invalid decimal', () => {
    expect(parse('2.')).toEqual({
        type: 'parser-error',
        errorType: 'invalidNumber',
        equation: '2.',
        start: 0,
        end: 1,
    })
    expect(parse('2..1')).toEqual({
        type: 'parser-error',
        errorType: 'invalidNumber',
        equation: '2..1',
        start: 0,
        end: 3,
    })
    expect(parse('1.2.3')).toEqual({
        type: 'parser-error',
        errorType: 'invalidNumber',
        equation: '1.2.3',
        start: 0,
        end: 4,
    })
})

test('invalid whitespace', () => {
    expect(parse('1 2')).toEqual({
        type: 'parser-error',
        errorType: 'numberWhitespace',
        equation: '1 2',
        start: 0,
        end: 2,
    })
})
