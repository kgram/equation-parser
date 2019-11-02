import { operatorMap } from './operatorMap'

type ValuesOf<T> = T[keyof T]

export type TokenNumber = { type: 'number', value: string, position: number }
export type TokenName = { type: 'name', value: string, position: number }
export type TokenOperator = { type: 'operator', value: ValuesOf<typeof operatorMap>, position: number }
export type TokenParensOpen = { type: 'parens-open', position: number }
export type TokenParensClose = { type: 'parens-close', position: number }
export type TokenMatrixOpen = { type: 'matrix-open', position: number }
export type TokenMatrixClose = { type: 'matrix-close', position: number }
export type TokenComma = { type: 'comma', position: number }

export type Token =
    | TokenNumber
    | TokenName
    | TokenOperator
    | TokenParensOpen
    | TokenParensClose
    | TokenMatrixOpen
    | TokenMatrixClose
    | TokenComma
