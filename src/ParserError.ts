import { EquationNodeParserError } from './EquationNode'

export class ParserError extends Error {
    values: any[]
    constructor(public position: number, public type: EquationNodeParserError['errorType'], ...values: any[]) {
        super(`Internal ${type} parse error`)
        this.values = values
    }
}
