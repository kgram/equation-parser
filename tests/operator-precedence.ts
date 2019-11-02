import { parse } from '../src'
import { operatorMap } from '../src/operatorMap'

import toVariable from './helpers/toVariable'

const firstNested = (op1, op2) => ({
    type: op2,
    a: {
        type: op1,
        a: toVariable('a'),
        b: toVariable('b'),
    },
    b: toVariable('c'),
})

const lastNested = (op1, op2) => ({
    type: op1,
    a: toVariable('a'),
    b: {
        type: op2,
        a: toVariable('b'),
        b: toVariable('c'),
    },
})

const testHigherPrecedence = (op1, op2) => {
    expect(parse(`a${op1}b${op2}c`)).toEqual(lastNested(operatorMap[op1], operatorMap[op2]))
    expect(parse(`a${op2}b${op1}c`)).toEqual(firstNested(operatorMap[op2], operatorMap[op1]))
}

const testLowerPrecedence = (op1, op2) => {
    expect(parse(`a${op1}b${op2}c`)).toEqual(firstNested(operatorMap[op1], operatorMap[op2]))
    expect(parse(`a${op2}b${op1}c`)).toEqual(lastNested(operatorMap[op2], operatorMap[op1]))
}

const testEqualPrecedence = (op1, op2) => {
    expect(parse(`a${op1}b${op2}c`)).toEqual(firstNested(operatorMap[op1], operatorMap[op2]))
    expect(parse(`a${op2}b${op1}c`)).toEqual(firstNested(operatorMap[op2], operatorMap[op1]))
}

test('plus', () => {
    testEqualPrecedence('+', '+')
    testEqualPrecedence('+', '-')
    testEqualPrecedence('+', '±')

    testHigherPrecedence('+', '*')
    testHigherPrecedence('+', ' ')
    testHigherPrecedence('+', '÷')
    testHigherPrecedence('+', '/')

    testHigherPrecedence('+', '^')
})

test('minus', () => {
    testEqualPrecedence('-', '+')
    testEqualPrecedence('-', '-')
    testEqualPrecedence('-', '±')

    testHigherPrecedence('-', '*')
    testHigherPrecedence('-', ' ')
    testHigherPrecedence('-', '÷')
    testHigherPrecedence('-', '/')

    testHigherPrecedence('-', '^')
})

test('plus-minus', () => {
    testEqualPrecedence('±', '+')
    testEqualPrecedence('±', '-')
    testEqualPrecedence('±', '±')

    testHigherPrecedence('±', '*')
    testHigherPrecedence('±', ' ')
    testHigherPrecedence('±', '÷')
    testHigherPrecedence('±', '/')

    testHigherPrecedence('±', '^')
})

test('multiplication', () => {
    testLowerPrecedence('*', '+')
    testLowerPrecedence('*', '-')
    testLowerPrecedence('*', '±')

    testEqualPrecedence('*', '*')
    testEqualPrecedence('*', ' ')
    testEqualPrecedence('*', '÷')
    testEqualPrecedence('*', '/')

    testHigherPrecedence('*', '^')
})

test('multiplication (implied)', () => {
    testLowerPrecedence(' ', '+')
    testLowerPrecedence(' ', '-')
    testLowerPrecedence(' ', '±')

    testEqualPrecedence(' ', '*')
    testEqualPrecedence(' ', ' ')
    testEqualPrecedence(' ', '÷')
    testEqualPrecedence(' ', '/')

    testHigherPrecedence(' ', '^')
})

test('division', () => {
    testLowerPrecedence('/', '+')
    testLowerPrecedence('/', '-')
    testLowerPrecedence('/', '±')

    testEqualPrecedence('/', '*')
    testEqualPrecedence('/', ' ')
    testEqualPrecedence('/', '÷')
    testEqualPrecedence('/', '/')

    testHigherPrecedence('/', '^')
})

test('division (inline)', () => {
    testLowerPrecedence('÷', '+')
    testLowerPrecedence('÷', '-')
    testLowerPrecedence('÷', '±')

    testEqualPrecedence('÷', '*')
    testEqualPrecedence('÷', ' ')
    testEqualPrecedence('÷', '÷')
    testEqualPrecedence('÷', '/')

    testHigherPrecedence('÷', '^')
})

test('exponentiation', () => {
    testLowerPrecedence('^', '+')
    testLowerPrecedence('^', '-')
    testLowerPrecedence('^', '±')

    testLowerPrecedence('^', '/')

    testLowerPrecedence('^', '*')
    testLowerPrecedence('^', ' ')
    testLowerPrecedence('^', '÷')

    // Exponentiation is right-associative
    // 1+2+3 is grouped as (1+2)+3 but 1^2^3 has to be grouped as 1^(2^3)
    expect(parse('a^b^c')).toEqual({
        type: 'power',
        a: toVariable('a'),
        b: {
            type: 'power',
            a: toVariable('b'),
            b: toVariable('c'),
        },
    })
})
