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
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    fallback: {
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      buffer: require.resolve('buffer/'),
    },
  },
};
