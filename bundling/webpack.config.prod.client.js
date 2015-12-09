var path = require('path')
var webpack = require('webpack')

var config = {
  devtool: 'source-map',
  entry: {
    vendor: ['moment'],
    react: ['react', 'react-dom'],
    app: path.resolve(__dirname, '..', 'modules', 'client.js'),
  },
  output: {
    path: path.resolve(__dirname, '..', 'build-prod', 'assets'),
    // filename: '[name].[chunkhash].js',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/assets/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, '..', 'modules')],
        loader: 'babel',
      },
      { test: /\.less$/, loader: 'style!css?modules!less' },
      { test: /\.css$/, loader: 'style!css?modules' },
      { test: /\.(png|jpg)$/, loader: 'url?limit=25000' },
      { test: /\.(woff)$/, loader: 'url?limit=1' },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      CLIENT: true,
      SERVER: false,
      DEVELOPMENT: false,
      PRODUCTION: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
    new webpack.optimize.OccurenceOrderPlugin(/* preferEntry */true),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['react', 'vendor'],
      minChunks: Infinity,
    }),
  ],
}

module.exports = config
