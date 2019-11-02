import { EquationNodeParserError } from './EquationNode'

export class ParserError extends Error {
    position: number
    type: EquationNodeParserError['errorType']
    values: any[]
    constructor(position: number, type: EquationNodeParserError['errorType'], ...values: any[]) {
        super(`Internal ${type} parse error`)
        this.type = type
        this.position = position
        this.values = values
    }
}
