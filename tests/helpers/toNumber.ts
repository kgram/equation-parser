import {
    EquationNodeNumber,
    EquationNodeNegative,
} from '../../src/EquationNode'

export default function toNumber(number: number | string): EquationNodeNumber | EquationNodeNegative {
    if (number < 0 || number[0] === '-') {
        return {
            type: 'negative',
            value: toNumber(-number),
        }
    }
    return {
        type: 'number',
        value: number.toString(),
    }
}
