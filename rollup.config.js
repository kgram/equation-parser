// import path from 'path'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

import pkg from './package.json'

const makeConfig = (input, cjsOutput, esmOutput) =>  ({
    input,
    output: [
        {
            file: cjsOutput,
            format: 'cjs',
        },
        {
            file: esmOutput,
            format: 'esm',
        },
    ],
    plugins: [
        resolve({
            extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        }),
        babel({
            exclude: 'node_modules/**',
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
        }),
    ],
    watch: {
        chokidar: true,
    },
})

export default [
    makeConfig('src/index.ts', pkg.main, pkg.module),
    makeConfig('src/renderTree.ts', 'dist/renderTree.js', 'dist/renderTree.esm.js'),
    makeConfig('src/stringify.ts', 'dist/stringify.js', 'dist/stringify.esm.js'),
]
