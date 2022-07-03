import { namePattern } from './patterns'

export const validateVariableName = (name: string) => (
    namePattern.test(name)
)
