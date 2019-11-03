export type EquationNodeVariable = {
    type: 'variable',
    name: string,
}

export type EquationNodeNumber = {
    type: 'number',
    value: string,
}

export type EquationNodeFunction = {
    type: 'function',
    name: string,
    args: EquationNode[],
}

export type EquationNodeBlock = {
    type: 'block',
    child: EquationNode,
}

type EquationNodeOneValue<Type> = {
    type: Type,
    value: EquationNode,
}

// Sign changers
export type EquationNodePositive = EquationNodeOneValue<'positive'>
export type EquationNodeNegative = EquationNodeOneValue<'negative'>
export type EquationNodePositiveNegative = EquationNodeOneValue<'positive-negative'>

type EquationNodeTwoValues<Type> = {
    type: Type,
    a: EquationNode,
    b: EquationNode,
}

// Operators
export type EquationNodePlus =EquationNodeTwoValues<'plus'>
export type EquationNodeMinus = EquationNodeTwoValues<'minus'>
export type EquationNodePlusMinus = EquationNodeTwoValues<'plus-minus'>
export type EquationNodeMultiplyImplicit = EquationNodeTwoValues<'multiply-implicit'>
export type EquationNodeMultiplyDot = EquationNodeTwoValues<'multiply-dot'>
export type EquationNodeMultiplyCross = EquationNodeTwoValues<'multiply-cross'>
export type EquationNodeDivideFraction = EquationNodeTwoValues<'divide-fraction'>
export type EquationNodeDivideInline = EquationNodeTwoValues<'divide-inline'>
export type EquationNodePower = EquationNodeTwoValues<'power'>

// Comparison
export type EquationNodeEquals = EquationNodeTwoValues<'equals'>
export type EquationNodeLessThan = EquationNodeTwoValues<'less-than'>
export type EquationNodeGreaterThan = EquationNodeTwoValues<'greater-than'>
export type EquationNodeLessThanEquals = EquationNodeTwoValues<'less-than-equals'>
export type EquationNodeGreaterThanEquals = EquationNodeTwoValues<'greater-than-equals'>
export type EquationNodeApproximates = EquationNodeTwoValues<'approximates'>

export type EquationNodeMatrix = {
    type: 'matrix',
    n: number,
    m: number,
    values: EquationNode[][],
}

export type EquationNodeParserError = {
    type: 'parser-error',
    errorType: 'numberWhitespace' | 'invalidNumber' | 'adjecentOperator' | 'invalidChar' | 'invalidUnary' | 'noOperand' | 'multipleExpressions' | 'matrixMixedDimension' | 'matrixEmpty' | 'vectorEmpty' | 'expectedEnd' | 'expectedSquareBracket' | 'expectedCloseParens' | 'operatorLast',
    equation: string,
    position: number,
    values: any[],
}

export type EquationNode =
    | EquationNodeVariable
    | EquationNodeNumber
    | EquationNodePositive
    | EquationNodeNegative
    | EquationNodePositiveNegative
    | EquationNodeFunction
    | EquationNodeBlock
    | EquationNodePlus
    | EquationNodeMinus
    | EquationNodePlusMinus
    | EquationNodeMultiplyImplicit
    | EquationNodeMultiplyDot
    | EquationNodeMultiplyCross
    | EquationNodeDivideFraction
    | EquationNodeDivideInline
    | EquationNodePower
    | EquationNodeEquals
    | EquationNodeLessThan
    | EquationNodeGreaterThan
    | EquationNodeLessThanEquals
    | EquationNodeGreaterThanEquals
    | EquationNodeApproximates
    | EquationNodeMatrix
    | EquationNodeParserError
