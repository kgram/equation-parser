import { eslint } from 'rollup-plugin-eslint'
import filesize from 'rollup-plugin-filesize'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import multiInput from 'rollup-plugin-multi-input'

import pkg from './package.json'

export default [
    {
        input: ['src/index.ts', 'src/renderTree.ts', 'src/stringify.ts'],
        output: [
            {
                file: pkg.main,
                format: 'umd',
                name: 'EquationParser',
            },
            {
                file: pkg.module,
                format: 'esm',
            },
        ],
        plugins: [
            multiInput(),
            resolve({
                extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
            }),
            eslint({
                throwOnError: true,
            }),
            babel({
                exclude: 'node_modules/**',
                extensions: ['.tsx', '.ts', '.jsx', '.js'],
            }),
            filesize(),
        ],
        watch: {
            chokidar: true,
        },
    },
]
