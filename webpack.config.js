const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  target: 'web',
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
  },
  devServer: {
    open: true,
    port: 9999,
    hot: true,
    contentBase: path.resolve('dist'),
    clientLogLevel: 'error',
    stats: 'minimal',
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
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
  resolve: {
    fallback: {
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      buffer: require.resolve('buffer/'),
    },
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@components': path.resolve(__dirname, './src/components/'),
      '@dummys': path.resolve(__dirname, './src/dummys/'),
      '@utils': path.resolve(__dirname, './src/utils/'),
      '@exercises': path.resolve(__dirname, './src/exercises/'),
    },
  },
};
