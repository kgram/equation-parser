# `equation-parser` – Parse math to an AST

Parses a plaintext string of unicode math to an AST.

## Installation

```
npm install -S equation-parser
```
or
```
yarn add equation-parser
```

## API

### `parse(input: string) => EquationNode | EquationParserError`

Parse the string into an `EquationNode`, or an `EquationParserError` if the string is invalid.

`parse` should never throw, any error should be considered a library error.

Example:

```js
parse('1+2*3+a(b)')
// returns {
//   type: 'plus',
//   a: {
//     type: 'plus',
//     a: { type: 'number', value: '1' },
//     b: {
//       type: 'multiply-dot',
//       a: { type: 'number', value: '2' },
//       b: { type: 'number', value: '3' }
//     }
//   },
//   b: {
//     type: 'function',
//     name: 'a',
//     args: [{ type: 'variable', name: 'b' }]
//   }
// }
```

### `renderTree(node: EquationNode | EquationParserError) => string`

Render the AST as a tree of nodes. Mostly useful for debugging and understanding the AST structure. This function should preferably be removed by a treeshaking build.

Example:

```js
renderTree(parse('1+2*3+a(b)'))
// returns
// '+
// ├─ +
// │  ├─ 1
// │  └─ *
// │     ├─ 2
// │     └─ 3
// └─ a()
//    └─ "b"'
```

### `stringify(node: EquationNode | EquationParserError) => string`

Reconstructs the original equation from the AST. Whitespace is not preserved, and operators with multiple symbols always output the same. This function should preferably be removed by a treeshaking build.

Example:

```js
stringify(parse('1+2*3+a(b)'))
// returns '1 + 2 * 3 + a(b)'
```

## CLI

The CLI is included mainly for testing. The first argument should be either `json` or `tree` and the second an equation string.

Example:

```bash
$ equation-parser json "1+2*3+a(b)"
{
  "type": "plus",
  "a": {
    "type": "plus",
    "a": {
      "type": "number",
      "value": "1"
    },
    "b": {
      "type": "multiply-dot",
      "a": {
        "type": "number",
        "value": "2"
      },
      "b": {
        "type": "number",
        "value": "3"
      }
    }
  },
  "b": {
    "type": "function",
    "name": "a",
    "args": [
      {
        "type": "variable",
        "name": "b"
      }
    ]
  }
}
$ equation-parser tree "1+2*3+a(b)"
+
├─ +
│  ├─ 1
│  └─ *
│     ├─ 2
│     └─ 3
└─ a()
   └─ "b"
```

## Parsing result
The result of the parsing should follow common math precedence, such as addition wrapping multiplication.

Whitespace is ignored, except when separating two numbers (`1 2`), two variables (`a b`) or a variable and a number (`a 2`). Two numbers results in an `numberWhitespace`-error. The others results in implicit multiplication.

Variables must start with a non-number. Leading numbers will instead be interpreted as implicit multiplication (`2x` is `2 * x`).

## AST – `EquationNode`
`EquationNode`s are plain objects, identified by their `type` property. To avoid stressing the type system, operator precedence is not enforced through the type system.

### `variable`
Represents a named variable. Subscripts should be separated with underscores.

Additional values:
- `name: string`

Example:
`a`, `%`, `a_2`

### `number`
Represents a number. Note that the value is not parsed as a number, but is guaranteed to be a number.

Additional values:
- `value: string`

Example:
`1`, `2.3`, `.4`

### `function`
Represents a function. Always has at least one argument.

Additional values:
- `name: string`
- `args: EquationNode[]`

Example:
`f(1)`, `g(a, b)`

### `block`
Represents a statement wrapped in parenthesis.

Additional values:
- `child: EquationNode`

Example:
`(1)`, `(1+2)`

### `matrix`
Represents a matrix. `n` is the amount of columns, `m` is the amount of rows, `values` is a list of rows.

Vectors can be represented by a single row. The data-structure is the same, it will simply be a 1-column matrix.

Additional values:
- `n: number`
- `m: number`
- `values: EquationNode[][]`

Example:
`[1,2,3]`, `[[1,2,3][4,5,6][7,8,9]]`

### Unary expressions
Multiple operators targeting a single value.

Types:
- `positive`: Plus-sign unary. Symbols: `+`
- `negative`: Minus-sign unary. Symbols: `-`, `−` (Minus Sign (U+2212))
- `positive-negative`: Plus/minus-sign unary. Symbols: `±` (Plus minus symbol (U+00B1))

Additional values:
- `value: EquationNode`

Example:
`-2`, `5*(±2)`

### Binary expressions
Multiple operators and comparisons targetting two values.

Types:
- `plus`: Addition. Symbols: `+`
- `minus`: Subtraction. Symbols: `-`, `−` (U+2212 Minus Sign)
- `plus-minus`: Addition/subtraction. Symbols: `±` (U+00B1 Plus minus symbol)
- `multiply-implicit`: Implicit multiplication. Symbols: ` ` (Space, special handling)
- `multiply-dot`: Multiply with dot. Symbols: `*`, `∗` (U+2217 Asterisk Operator), `⋅` (U+22C5 Dot Operator)
- `multiply-cross`: Multiplication with cross. Symbols: `×` (U+00D7 Multiplication Sign), `✕` (U+2715 Multiplication X)
- `divide-fraction`: Division as fraction. Symbols: `/`, `∕` (U+2215 Division Slash)
- `divide-inline`: Division as inline operator. Symbols: `÷` (U+00F7 Division Sign)
- `power`: Raise to power. Symbols: `^`
- `equals`: Comparison. Symbols: `=`
- `less-than`: Comparison. Symbols: `<`
- `greater-than`: Comparison. Symbols: `>`
- `less-than-equals`: Comparison. Symbols: `≤` (U+2264 Less-Than or Equal To)
- `greater-than-equals`: Comparison. Symbols: `≥` (U+2265 Greater-Than or Equal To)
- `approximates`: Comparison. Symbols: `≈` (U+2248 Almost Equal To)

Additional values:
- `a: EquationNode`
- `b: EquationNode`

Example:
`1+2`, `2/5`, `1+2=3`

### `operand-placeholder`
Represents a missing operand (number, variable, function, block).

Example:
`_`, `_+2`, `f(_)`

### `function-placeholder`
Represents a function without a name.

Additional values:
- `args: EquationNode[]`

Example:
`_(2)`, `_(a, b)`

### `operator-placeholder`
Represents a missing binary operator, such as `plus` or `equals`.

Additional values:
- `a: EquationNode`
- `b: EquationNode`

Example:
`2 ? 3`

### `operator-unary-placeholder`
Represents a missing unary operator, such as `negative` or `positive-negative`.

Additional values:
- `value: EquationNode`

Example:
`?2`, `2+(?3)`

### `parser-error`
Represents an error in parsing. Not technically an `EquationNode`, since it cannot be a subvalue of any other nodes, but it can be returned by the `parse` function.

The type of error is represented by the `errorType`-value, taking one of the following:

- `numberWhitespace`: Unexpected space in a number
- `invalidNumber`: Invalid number
- `adjecentOperator`: Two operators next to each other
- `invalidChar`: Unrecognized character
- `invalidUnary`: This operator cannot be used as a unary operator
- `multipleExpressions`: There are a few cases where the expression doesn't proberly terminate. This is generally the result of a library limitation.
- `matrixMixedDimension`: The rows of a matrix are different dimensions
- `matrixEmpty`: A matrix has no elements
- `vectorEmpty`: A vector has no elements
- `expectedEnd`: Expected end of equation, not a close parenthesis or similar
- `expectedSquareBracket`: Expected a closing square-bracket, not a different type of parenthesis or the end of the equation
- `expectedCloseParens`: Expected a closing parenthesis, not a diffent type of parenthesis or the end of the equation
- `operatorLast`: The equation ends on an operator
- `emptyBlock`: Parenthesis without content
