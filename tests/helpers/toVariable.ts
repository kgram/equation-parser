import {
    EquationNodeVariable,
} from '../../src/EquationNode'

export default function toVariable(name: string): EquationNodeVariable {
    return {
        type: 'variable',
        name,
    }
}
