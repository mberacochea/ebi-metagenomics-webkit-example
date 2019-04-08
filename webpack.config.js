const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/app.js',
  mode: 'development',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    modules: ['node_modules'],
    alias: {
      jquery: path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
      underscore: path.resolve(__dirname, 'node_modules/underscore/underscore-min.js'),
      backbone: path.resolve(__dirname, 'node_modules/backbone/backbone-min.js'),
      handlebars: path.resolve(__dirname, 'node_modules/handlebars/dist/amd/handlebars.js'),
      mgnify: path.resolve(__dirname, 'node_modules/mgnify/mgnify.js')
    },
    extensions: ['.js']
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env.API_URL': '\'https://www.ebi.ac.uk/metagenomics/api/v1/\''
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080
  }
};