const pkg = require('./package.json')

const {rollup} = require('rollup')
const {terser} = require('rollup-plugin-terser')
const commonjs = require('@rollup/plugin-commonjs')
const globals = require('rollup-plugin-node-globals')
const builtins = require('rollup-plugin-node-builtins')
const resolve = require('@rollup/plugin-node-resolve').default

const gulp = require('gulp')

const banner = `/*!
* ${pkg.name} ${pkg.version}
* ${pkg.homepage}
* license: ${pkg.license}
*
* ${pkg.description}
*
*/\n`

let cache = {};

// Creates a bundle with broad browser support, exposed
// as UMD
gulp.task('js-es5', () => {
    return rollup({
        cache: cache.umd,
        input: 'lib/index.js',
        plugins: [
            resolve({preferBuiltins: false}),
            commonjs(),
            globals(),
            builtins(),
            terser()
        ]
    }).then( bundle => {
        cache.umd = bundle.cache;
        return bundle.write({
            name: 'MediasoupClient',
            file: './dist/mediasoup-client.min.js',
            format: 'umd',
            banner: banner,
            sourcemap: true
        });
    });
})

// Creates an ES module bundle
gulp.task('js-es6', () => {
    return rollup({
        cache: cache.esm,
        input: 'lib/index.js',
        plugins: [
            resolve({preferBuiltins: false}),
            commonjs(),
            globals(),
            builtins(),
            terser()
        ]
    }).then( bundle => {
        cache.esm = bundle.cache;
        return bundle.write({
            file: './dist/mediasoup-client.esm.js',
            format: 'es',
            banner: banner,
            sourcemap: true
        });
    });
})
gulp.task('js', gulp.parallel('js-es5', 'js-es6'));
gulp.task('build', gulp.parallel('js'))
