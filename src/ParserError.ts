import { EquationParserError } from './EquationParserError'

type Error<T extends EquationParserError['errorType'], TError = EquationParserError> = TError extends { errorType: T }
    ? TError
    : never

type Values<T extends EquationParserError['errorType']> = Omit<Error<T>, 'type' | 'equation' | 'start' | 'end' | 'errorType'>

export class ParserError<T extends EquationParserError['errorType']> extends Error {
    start: number
    end: number
    type: T
    values: Values<T>
    constructor(start: number, end: number, type: T, values: Values<T>) {
        super(`Internal ${type} parse error`)
        this.type = type
        this.start = start
        this.end = end
        this.values = values
    }

    getParserError(equation: string) {
        return {
            type: 'parser-error',
            errorType: this.type,
            start: this.start,
            end: this.end,
            equation,
            ...this.values,
        } as Error<T>
    }
}
