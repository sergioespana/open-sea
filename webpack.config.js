const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, 'src/index.js'),
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{ test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }
		]
	},
	resolve: {
		alias: {
			components: path.resolve(__dirname, 'src/components'),
			routes: path.resolve(__dirname, 'src/routes'),
			stores: path.resolve(__dirname, 'src/stores'),
			styles: path.resolve(__dirname, 'src/styles')
		}
	},
	plugins: [
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, 'src/assets'),
				to: path.resolve(__dirname, 'build/assets')
			}
		]),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/index.html'),
			minify: { collapseWhitespace: true }
		}),
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		contentBase: path.join(__dirname, 'src'),
		historyApiFallback: true,
		inline: true,
		hot: true
	}
};