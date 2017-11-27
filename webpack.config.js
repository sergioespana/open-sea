const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, 'src/index.js'),
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{ test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
			{ test: /\.css$/, use: 'css-loader' }
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
				from: path.resolve(__dirname, 'src/manifest.json'),
				to: path.resolve(__dirname, 'build/manifest.json')
			}
		]),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/index.html'),
			minify: { collapseWhitespace: true }
		}),
		new webpack.optimize.CommonsChunkPlugin({
			children: true,
			async: false,
			minChunks: 3
		}),
		new webpack.HotModuleReplacementPlugin(),
		new ProgressBarWebpackPlugin({
			format: '\u001b[90m\u001b[44mBuild\u001b[49m\u001b[39m [:bar] \u001b[32m\u001b[1m:percent\u001b[22m\u001b[39m (:elapseds) \u001b[2m:msg\u001b[22m',
			renderThrottle: 100,
			summary: false,
			clear: true
		})
	],
	devServer: {
		contentBase: path.join(__dirname, 'src'),
		historyApiFallback: true,
		inline: true,
		hot: true
	}
};