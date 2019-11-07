import { EquationNodeParserError } from './EquationNode'

export class ParserError extends Error {
    start: number
    end: number
    type: EquationNodeParserError['errorType']
    values: any[]
    constructor(start: number, end: number, type: EquationNodeParserError['errorType'], ...values: any[]) {
        super(`Internal ${type} parse error`)
        this.type = type
        this.start = start
        this.end = end
        this.values = values
    }
}
