const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const { targets: allTargets, fuzzyMatchTarget } = require('./utils');

const args = require('minimist')(process.argv.slice(2));
const targets = args._;
const formats = args.formats || args.f;
const devOnly = args.devOnly || args.d;
const prodOnly = !devOnly && (args.prodOnly || args.p);
const sourceMap = args.sourcemap || args.s;
const isRelease = args.release;
const buildTypes = args.t || args.types || isRelease;
const buildAllMatching = args.all || args.a;

run();

async function run() {
  if (isRelease) {
    // remove build cache for release builds to avoid outdated enum values
    // rollup-plugin-typescript
    await fs.remove(path.resolve(__dirname, '../node_modules/.rts2_cache'));
  }

  if (!targets.length) {
    await buildAll(allTargets);
    // checkAllSizes(allTargets)
  } else {
    await buildAll(fuzzyMatchTarget(targets, buildAllMatching));
    // checkAllSizes(fuzzyMatchTarget(targets, buildAllMatching))
  }
}

async function buildAll(targets) {
  await runParallel(require('os').cpus().length, targets, build);
}

async function runParallel(maxConcurrency, source, iteratorFn) {
  const ret = [];
  const executing = [];

  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item, source));
    ret.push(p);

    if (maxConcurrency <= source.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);

      if (executing.length >= maxConcurrency) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(ret);
}

async function build(target) {
  const pkgDir = path.resolve(`packages/${target}`);
  const pkg = require(`${pkgDir}/package.json`);

  // only build published packages for release
  if (isRelease && pkg.private) {
    return;
  }

  // if building a specific format, do not remove dist.
  if (!formats) {
    await fs.remove(`${pkgDir}/dist`);
  }

  const env =
    (pkg.buildOptions && pkg.buildOptions.env) ||
    (devOnly ? 'development' : 'production');

  if (target === 'theme') {
    await execa(
      'postcss',
      [
        'src/**/*.css',
        path.resolve(pkgDir, 'src'),
        '-d',
        path.resolve(pkgDir, 'dist'),
        '--config',
        path.resolve(__dirname, 'postcss.config.js'),
        '--env',
        env,
      ],
      { stdio: 'inherit' }
    );
  } else {
    await execa(
      'rollup',
      [
        '-c',
        '--environment',
        [
          `NODE_ENV:${env}`,
          `TARGET:${target}`,
          formats ? `FORMATS:${formats}` : ``,
          buildTypes ? `TYPES:true` : ``,
          prodOnly ? `PROD_ONLY:true` : ``,
          sourceMap ? `SOURCE_MAP:true` : ``,
        ]
          .filter(Boolean)
          .join(','),
      ],
      { stdio: 'inherit' }
    );
  }
}
