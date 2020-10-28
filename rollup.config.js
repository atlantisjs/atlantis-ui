import ts from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import resolvePlugin from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import path from 'path';

const name = 'atlantis-ui';
const resolve = p => path.resolve(__dirname, p);

const configs = {
  esm: {
    input: resolve('src/index.ts'),
    output: {
      file: resolve(`dist/${name}.esm.js`),
      format: `es`
    }
  },
  cjs: {
    input: resolve('src/index.ts'),
    output: {
      file: resolve(`dist/${name}.cjs.js`),
      format: `cjs`
    }
  },
  global: {
    input: resolve('src/index.ts'),
    output: {
      name: 'AtlantisUI',
      file: resolve(`dist/${name}.global.js`),
      format: `iife`,
      exports: 'named',
      globals: { vue: 'Vue' }
    },
    compress: true
  }
};

const packageConfigs = Object.entries(configs).map(([format, config]) => {
  const { input, output, compress } = config;
  const plugins = [
    resolvePlugin({
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    }),
    commonjs(),
    ts(),
    vue()
  ];

  const babelOptions = {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    babelHelpers: 'runtime',
    exclude: '**/node_modules/**',
    presets: ['@vue/cli-plugin-babel/preset']
  };

  plugins.push(babel(babelOptions));

  if (compress) {
    plugins.push(
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true
        }
      })
    );
  }

  return {
    input,
    output,
    external: ['vue'],
    plugins
  };
});

export default packageConfigs;
