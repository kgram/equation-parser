import { parse } from '../src'

import toVariable from './helpers/toVariable'

test('no arguments', () => {
    expect(parse('f()')).toEqual({
        type: 'function',
        name: 'f',
        args: [],
    })
    expect(parse('f2()')).toEqual({
        type: 'function',
        name: 'f2',
        args: [],
    })
})

test('single argument', () => {
    expect(parse('f(x)')).toEqual({
        type: 'function',
        name: 'f',
        args: [toVariable('x')],
    })
    expect(parse('f2(x)')).toEqual({
        type: 'function',
        name: 'f2',
        args: [toVariable('x')],
    })
    expect(parse('f_2(x)')).toEqual({
        type: 'function',
        name: 'f_2',
        args: [toVariable('x')],
    })
    expect(parse('%(x)')).toEqual({
        type: 'function',
        name: '%',
        args: [toVariable('x')],
    })
})

test('multiple arguments', () => {
    expect(parse('f(x,y,z)')).toEqual({
        type: 'function',
        name: 'f',
        args: [toVariable('x'),toVariable('y'),toVariable('z')],
    })
})

test('spacing', () => {
    expect(parse('f( x )')).toEqual({
        type: 'function',
        name: 'f',
        args: [toVariable('x')],
    })
    expect(parse('f(     x     ,    y    )')).toEqual({
        type: 'function',
        name: 'f',
        args: [toVariable('x'), toVariable('y')],
    })
    // Spacing is implicit multiplication
    expect(parse('f (x)')).toEqual({
        type: 'function',
        name: 'f',
        args: [toVariable('x')],
    })
})

test('operand placeholder', () => {
    expect(parse('_(x)')).toEqual({ type: 'function-placeholder', args: [toVariable('x')] })
})
