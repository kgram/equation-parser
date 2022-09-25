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

const testLeftAssociativity = (op1, op2) => {
    expect(parse(`a${op1}b${op2}c`)).toEqual(firstNested(operatorMap[op1], operatorMap[op2]))
    expect(parse(`a${op2}b${op1}c`)).toEqual(firstNested(operatorMap[op2], operatorMap[op1]))
}

const testRightAssociativity = (op1, op2) => {
    expect(parse(`a${op1}b${op2}c`)).toEqual(lastNested(operatorMap[op1], operatorMap[op2]))
    expect(parse(`a${op2}b${op1}c`)).toEqual(lastNested(operatorMap[op2], operatorMap[op1]))
}

const testSubmmissiveAssociativity = (op1, op2) => {
    expect(parse(`a${op1}b${op2}c`)).toEqual(lastNested(operatorMap[op1], operatorMap[op2]))
    expect(parse(`a${op2}b${op1}c`)).toEqual(firstNested(operatorMap[op2], operatorMap[op1]))
}

const testDominantAssociativity = (op1, op2) => {
    expect(parse(`a${op1}b${op2}c`)).toEqual(firstNested(operatorMap[op1], operatorMap[op2]))
    expect(parse(`a${op2}b${op1}c`)).toEqual(lastNested(operatorMap[op2], operatorMap[op1]))
}

test('plus', () => {
    testRightAssociativity('+', '+')
    testSubmmissiveAssociativity('+', '-')
    testSubmmissiveAssociativity('+', '±')

    testSubmmissiveAssociativity('+', '*')
    testSubmmissiveAssociativity('+', ' ')
    testSubmmissiveAssociativity('+', '÷')
    testSubmmissiveAssociativity('+', '/')

    testSubmmissiveAssociativity('+', '^')
})

test('minus', () => {
    testDominantAssociativity('-', '+')
    testLeftAssociativity('-', '-')
    testLeftAssociativity('-', '±')

    testSubmmissiveAssociativity('-', '*')
    testSubmmissiveAssociativity('-', ' ')
    testSubmmissiveAssociativity('-', '÷')
    testSubmmissiveAssociativity('-', '/')

    testSubmmissiveAssociativity('-', '^')
})

test('plus-minus', () => {
    testDominantAssociativity('±', '+')
    testLeftAssociativity('±', '-')
    testLeftAssociativity('±', '±')

    testSubmmissiveAssociativity('±', '*')
    testSubmmissiveAssociativity('±', ' ')
    testSubmmissiveAssociativity('±', '÷')
    testSubmmissiveAssociativity('±', '/')

    testSubmmissiveAssociativity('±', '^')
})

test('multiplication', () => {
    testDominantAssociativity('*', '+')
    testDominantAssociativity('*', '-')
    testDominantAssociativity('*', '±')

    testRightAssociativity('*', '*')
    testRightAssociativity('*', ' ')
    testSubmmissiveAssociativity('*', '÷')
    testSubmmissiveAssociativity('*', '/')

    testSubmmissiveAssociativity('*', '^')
})

test('multiplication (implied)', () => {
    testDominantAssociativity(' ', '+')
    testDominantAssociativity(' ', '-')
    testDominantAssociativity(' ', '±')

    testRightAssociativity(' ', '*')
    testRightAssociativity(' ', ' ')
    testSubmmissiveAssociativity(' ', '÷')
    testSubmmissiveAssociativity(' ', '/')

    testSubmmissiveAssociativity(' ', '^')
})

test('division', () => {
    testDominantAssociativity('/', '+')
    testDominantAssociativity('/', '-')
    testDominantAssociativity('/', '±')

    testDominantAssociativity('/', '*')
    testDominantAssociativity('/', ' ')
    testLeftAssociativity('/', '÷')
    testLeftAssociativity('/', '/')

    testSubmmissiveAssociativity('/', '^')
})

test('division (inline)', () => {
    testDominantAssociativity('÷', '+')
    testDominantAssociativity('÷', '-')
    testDominantAssociativity('÷', '±')

    testDominantAssociativity('÷', '*')
    testDominantAssociativity('÷', ' ')
    testLeftAssociativity('÷', '÷')
    testLeftAssociativity('÷', '/')

    testSubmmissiveAssociativity('÷', '^')
})

test('exponentiation', () => {
    testDominantAssociativity('^', '+')
    testDominantAssociativity('^', '-')
    testDominantAssociativity('^', '±')

    testDominantAssociativity('^', '/')

    testDominantAssociativity('^', '*')
    testDominantAssociativity('^', ' ')
    testDominantAssociativity('^', '÷')

    testRightAssociativity('^', '^')
})
