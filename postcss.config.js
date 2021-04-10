module.exports = ctx => ({
  plugins: [
    require('postcss-nested')(),
    require('postcss-preset-env')({ stage: 0 }),
    require('autoprefixer')(),
  ],
});
