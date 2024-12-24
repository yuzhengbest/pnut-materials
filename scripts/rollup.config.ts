/**
 * 此配置是打包单个组件或方法的配置
 */
import path from 'path'
import fs from 'fs-extra'
import esbuild from 'rollup-plugin-esbuild'
import babel from '@rollup/plugin-babel'
import vuePlugin from 'rollup-plugin-vue'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import url from '@rollup/plugin-url'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import postcss from 'rollup-plugin-postcss'
import styles from 'rollup-plugin-styles'
import multiInput from 'rollup-plugin-multi-input'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import staticImport from 'rollup-plugin-static-import'
import ignoreImport from 'rollup-plugin-ignore-import'
import copy from 'rollup-plugin-copy'
import DefineOptions from 'unplugin-vue-define-options/rollup'
import { RollupOptions, RollupWarning, WarningHandler } from 'rollup'

const target = process.env.TARGET
const meta = process.env.META
const resolve = p => path.resolve(target, p)
const input = target + '/src/index.ts'
const inputList = [
  resolve('src/**/*.ts'),
  resolve('src/**/*.vue'),
  resolve('src/**/*.tsx'),
  `!${resolve('src/**/__demo__')}`,
  `!${resolve('src/**/__test__')}`,
]
const pkg = fs.readJsonSync(path.resolve(target, 'package.json'))
const externalDeps = [/@babel\/runtime/]
const externalPeerDeps = Object.keys(pkg.peerDependencies || {})

const getPlugins = ({ isProd = false, extractOneCss = false, extractMultiCss = false } = {}) => {
  const plugins = [
    DefineOptions(), // 自动为组件注入选项声明
    nodeResolve(), // 帮助rollup解析和打包node.js模块
    commonjs(), // 用于将commonjs模块转换为es6模块格式，以便rollup可以正确的处理和打包这些模块
    vuePlugin({
      target: 'browser',
      preprocessStyles: true,
      exposeFilename: false,
    }),
    esbuild({
      target: 'esnext',
      minify: false,
      jsx: 'preserve',
      tsconfig: 'tsconfig.build.json',
    }),
    postcss(
      extractOneCss
        ? {
            exclude: ['**/*.scss'],
            modules: false, // 使用 CSS Modules
            minimize: true, // 最小化 CSS
          }
        : {}
    ),
    babel({
      extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx', '.vue'],
      skipPreflightCheck: true,
      babelHelpers: 'runtime',
    }),
    json(),
    url(),
  ];

  if (extractOneCss) {
    plugins.push(
      postcss({
        include: ['**/*.scss'],
        exclude: ['**/*.vue'],
        extract: `${isProd ? `index.min` : 'index'}.css`,
        minimize: isProd,
        sourceMap: true,
        extensions: ['.sass', '.scss', '.css', '.less'],
      })
    );
  } else if (extractMultiCss) {
    plugins.push(
      staticImport({
        baseDir: resolve('src'),
        include: ['**/style/css.mjs'],
      }),
      ignoreImport({
        include: [resolve('*/style/*')],
        body: 'import "./style/css.mjs";',
      }),
      copy({
        targets: [
          {
            src: resolve('src/style/css.js'),
            dest: resolve('es/style'),
            rename: name => {
              return `${name}.mjs`;
            },
          },
        ],
        verbose: true,
      })
    );
  }

  plugins.push(
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    })
  );

  if (isProd) {
    plugins.push(
      terser({
        output: {
          /* eslint-disable */
          ascii_only: true,
          /* eslint-enable */
        },
      })
    );
  }

  return plugins
}

function rollupIgnoreWarnings(codes: string[]) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (warning: RollupWarning, handle: WarningHandler) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!codes.includes(warning.code!)) {
      console.warn(warning.message);
    }
  };
}

/** @type {import('rollup').RollupOptions} */
const cssConfig: RollupOptions = {
  input: [resolve('src/style/index.js')],
  plugins: [multiInput({ relative: resolve('src/') }), styles({ mode: 'extract' })],
  output: {
    dir: resolve('es/'),
    sourcemap: true, 
    assetFileNames: '[name].css',
  },
};

/** @type {import('rollup').RollupOptions} */
const esConfig: RollupOptions = {
  input, // input: inputList,
  treeshake: false,
  external: [...externalDeps, ...externalPeerDeps],
  onwarn: rollupIgnoreWarnings(['THIS_IS_UNDEFINED']),
  plugins: [...getPlugins({ extractMultiCss: true })], // multiInput({ relative: resolve('src/') }), 
  output: {
    dir: resolve('es/'),
    format: 'es',
    sourcemap: true,
    entryFileNames: '[name].mjs',
    chunkFileNames: '[name].mjs',
  },
};

/** @type {import('rollup').RollupOptions} */
const cjsConfig: RollupOptions = {
  input, // input: inputList,
  external: [...externalDeps, ...externalPeerDeps],
  onwarn: rollupIgnoreWarnings(['THIS_IS_UNDEFINED']),
  plugins: [...getPlugins()], // multiInput({ relative: resolve('src/') }), 
  output: {
    dir: resolve('lib/'),
    format: 'cjs',
    sourcemap: true,
    exports: 'named',
    entryFileNames: '[name].cjs',
    chunkFileNames: '[name].cjs',
  },
};


/** @type {import('rollup').RollupOptions} */
const umdConfig: RollupOptions = {
  input,
  external: externalPeerDeps,
  plugins: getPlugins({ isProd: true, extractOneCss: true }),
  output: {
    name: pkg[meta + 'Config'].name,
    format: 'umd',
    exports: 'named',
    globals: { vue: 'Vue' },
    file: `${target}/dist/index.iife.min.js`,
  },
};

const bundles: RollupOptions[] = [esConfig, cjsConfig, umdConfig]

if (fs.existsSync(resolve('src/style/index.js'))) {
  bundles.unshift(cssConfig)
}

export default bundles
