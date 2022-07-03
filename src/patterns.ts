export const whitespacePattern = /\s/
export const charNumberPattern = /[0-9.]/
export const numberPattern = /^([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/
// Ranges:
// U+00C0-U+00D6 Latin-1 supplement letters
// U+00D8-U+00F6 Latin-1 supplement letters
// U+00F8-U+00FF Latin-1 supplement letters
// U+0100-U+017F Latin extended-A
// U+0180-U+01BF Latin extended-B letters
// U+0391-U+03c9 Greek letters
// '"%‰°∞ various symbols used for units
// _ used for variable indexing
export const charNamePattern = /[0-9A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u01BF\u0391-\u03c9'"%‰°∞_]/
export const namePattern = /^(?![0-9])[0-9A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u01BF\u0391-\u03c9'"%‰°∞_]+$/
