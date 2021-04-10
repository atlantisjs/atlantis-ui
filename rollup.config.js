import ts from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
// import babel from '@rollup/plugin-babel';
import path from 'path';

// ensure TS checks only once for each build
let hasTSChecked = false;

/**
 * TARGET: 目标文件夹
 * FORMATS: 打包模块格式
 * PROD_ONLY: 是否只是生产打包
 * NODE_ENV: node env
 * SOURCE_MAP: 是否开启sourcemap
 */
const { TARGET, FORMATS, PROD_ONLY, NODE_ENV, SOURCE_MAP, TYPES } = process.env;

if (!TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.');
}

const packagesDir = path.resolve(__dirname, 'packages');
const packageDir = path.resolve(packagesDir, TARGET);
const resolve = p => path.resolve(packageDir, p);
const name = path.basename(packageDir);
const pkg = require(resolve(`package.json`));
const buildOptions = pkg.buildOptions || {};

const outputConfigs = {
  esm: {
    file: resolve(`dist/${name}.esm.js`),
    format: `es`,
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`,
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`,
  },
};

const defaultFormats = ['esm', 'cjs'];
const inlineFormats = FORMATS && FORMATS.split(',');
const packageFormats = inlineFormats || buildOptions.formats || defaultFormats;
const packageConfigs = PROD_ONLY
  ? []
  : packageFormats.map(format => createConfig(format, outputConfigs[format]));

if (NODE_ENV === 'production') {
  packageFormats.forEach(format => {
    if (buildOptions.prod === false) {
      return;
    }

    if (format === 'cjs') {
      packageConfigs.push(createProductionConfig(format));
    }
    if (/global/.test(format)) {
      packageConfigs.push(createMinifiedConfig(format));
    }
  });
}

export default packageConfigs;

function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`));
    process.exit(1);
  }

  output.sourcemap = !!SOURCE_MAP;
  output.externalLiveBindings = false;

  const isGlobalBuild = /global/.test(format);

  if (isGlobalBuild) {
    output.name = buildOptions.name;
  }

  const shouldEmitDeclarations = TYPES != null && !hasTSChecked;

  const tsPlugin = ts({
    check: NODE_ENV === 'production' && !hasTSChecked,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations,
      },
      exclude: ['**/__tests__', 'test-dts'],
    },
  });

  // we only need to check TS and generate declarations once for each build.
  // it also seems to run into weird issues when checking multiple times
  // during a single build.
  hasTSChecked = true;

  const external = isGlobalBuild
    ? []
    : // Node / esm-bundler builds. Externalize everything.
      [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ];

  // as a global (e.g. http://wzrd.in/standalone/postcss)
  output.globals = {
    postcss: 'postcss',
  };

  const nodePlugins =
    format !== 'cjs'
      ? [
          require('@rollup/plugin-commonjs')({
            sourceMap: false,
          }),
          require('rollup-plugin-node-polyfills')(),
          require('@rollup/plugin-node-resolve').nodeResolve(),
        ]
      : [];

  return {
    input: resolve(`src/index.ts`),
    external,
    plugins: [vue(), tsPlugin, ...nodePlugins, ...plugins],
    output,
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg);
      }
    },
    treeshake: {
      moduleSideEffects: false,
    },
  };
}

function createProductionConfig(format) {
  return createConfig(format, {
    file: outputConfigs[format].file.replace(/\.js$/, '.prod.js'),
    format: outputConfigs[format].format,
  });
}

function createMinifiedConfig(format) {
  const { terser } = require('rollup-plugin-terser');

  return createConfig(
    format,
    {
      file: outputConfigs[format].file.replace(/\.js$/, '.prod.js'),
      format: outputConfigs[format].format,
    },
    [
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true,
        },
        safari10: true,
      }),
    ]
  );
}
