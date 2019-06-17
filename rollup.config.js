import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [{
    input: 'src/IntercomEventForwarder.js',
    output: {
        file: 'IntercomEventForwarder.js',
        format: 'umd',
        exports: 'named',
        name: 'mp-intercom-kit',
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
        format: 'umd',
        exports: 'named',
        name: 'mp-intercom-kit',
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