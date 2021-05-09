const path = require('path');

module.exports = {
  mode: 'development',
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  devServer: {
    open: true,
    port: 9999,
    contentBase: './dist',
  },
};
