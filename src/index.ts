import { createParser } from './createParser'
import * as EquationNode from './EquationNode'
export type EquationNode = EquationNode.EquationNode
export type EquationNodeVariable = EquationNode.EquationNodeVariable
export type EquationNodeNumber = EquationNode.EquationNodeNumber
export type EquationNodeFunction = EquationNode.EquationNodeFunction
export type EquationNodeBlock = EquationNode.EquationNodeBlock
export type EquationNodePositive = EquationNode.EquationNodePositive
export type EquationNodeNegative = EquationNode.EquationNodeNegative
export type EquationNodePositiveNegative = EquationNode.EquationNodePositiveNegative
export type EquationNodePlus = EquationNode.EquationNodePlus
export type EquationNodeMinus = EquationNode.EquationNodeMinus
export type EquationNodePlusMinus = EquationNode.EquationNodePlusMinus
export type EquationNodeMultiplyImplicit = EquationNode.EquationNodeMultiplyImplicit
export type EquationNodeMultiplyDot = EquationNode.EquationNodeMultiplyDot
export type EquationNodeMultiplyCross = EquationNode.EquationNodeMultiplyCross
export type EquationNodeDivideFraction = EquationNode.EquationNodeDivideFraction
export type EquationNodeDivideInline = EquationNode.EquationNodeDivideInline
export type EquationNodePower = EquationNode.EquationNodePower
export type EquationNodeEquals = EquationNode.EquationNodeEquals
export type EquationNodeLessThan = EquationNode.EquationNodeLessThan
export type EquationNodeGreaterThan = EquationNode.EquationNodeGreaterThan
export type EquationNodeLessThanEquals = EquationNode.EquationNodeLessThanEquals
export type EquationNodeGreaterThanEquals = EquationNode.EquationNodeGreaterThanEquals
export type EquationNodeApproximates = EquationNode.EquationNodeApproximates
export type EquationNodeMatrix = EquationNode.EquationNodeMatrix
export type EquationNodeParserError = EquationNode.EquationNodeParserError

const parse = createParser()

export { parse, createParser }
