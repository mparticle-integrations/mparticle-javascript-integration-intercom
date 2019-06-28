import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
    {
        input: 'src/IntercomEventForwarder.js',
        output: {
            file: 'IntercomEventForwarder.js',
            format: 'iife',
            exports: 'named',
            name: 'mpIntercomKit',
            strict: false
        },
        plugins: [
            resolve({
                browser: true
            }),
            commonjs()
        ]
    },
    {
        input: 'src/IntercomEventForwarder.js',
        output: {
            file: 'dist/IntercomEventForwarder.js',
            format: 'iife',
            exports: 'named',
            name: 'mpIntercomKit',
            strict: false
        },
        plugins: [
            resolve({
                browser: true
            }),
            commonjs()
        ]
    },
    {
        input: 'src/IntercomEventForwarder.js',
        output: {
            file: 'npm/IntercomEventForwarder.js',
            format: 'cjs',
            exports: 'named',
            name: 'mpIntercomKit',
            strict: false
        },
        plugins: [
            resolve({
                browser: true
            }),
            commonjs()
        ]
    }
]