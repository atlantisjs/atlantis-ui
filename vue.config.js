const path = require('path');
const resolve = filePath => path.join(__dirname, './', filePath);

module.exports = {
  outputDir: 'docs',
  publicPath: '/atlantis-ui/',

  pages: {
    index: {
      entry: resolve('playground/main.ts'),
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch-index').delete('preload-index');
    config.resolve.alias.set('playground', resolve('playground'));
  }
};
