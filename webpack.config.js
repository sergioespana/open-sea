const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
	entry: path.resolve(__dirname, 'src/index.js'),

	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: '/',
		filename: isProd ? '[name].[chunkhash:8].js' : '[name].js',
		chunkFilename: '[name].[chunkhash:8].js'
	},

	resolve: {
		modules: ['node_modules'],
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.less', '.scss', '.sass', '.styl', '.css'],
		alias: {
			components: path.resolve(__dirname, 'src/components'),
			mixins: path.resolve(__dirname, 'src/mixins'),
			navigation: path.resolve(__dirname, 'src/navigation'),
			routes: path.resolve(__dirname, 'src/routes'),
			stores: path.resolve(__dirname, 'src/stores')
		}
	},

	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.jsx?$/,
				use: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.jsx?$/,
				include: path.resolve(__dirname, 'src/routes'),
				loader: path.resolve(__dirname, 'async-component-loader')
			},
			{
				test: /\.(css|less|s[ac]ss|styl)$/,
				exclude: [
					path.resolve(__dirname, 'src/components'),
					path.resolve(__dirname, 'src/routes')
				],
				loader: ExtractTextWebpackPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: { sourceMap: isProd }
						},
						{
							loader: 'postcss-loader',
							options: {
								ident: 'postcss',
								sourceMap: true,
								plugins: [autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'IE >= 9'] })]
							}
						}
					]
				})
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
			{
				test: /\.(xml|html|txt|md)$/,
				loader: 'raw-loader'
			},
			{
				test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif|mp4|mov|ogg|webm)(\?.*)?$/i,
				loader: isProd ? 'file-loader' : 'url-loader'
			}
		]
	},

	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')
		}),
		new ExtractTextWebpackPlugin({
			filename: isProd ? 'style.[contenthash:8].css' : 'style.css',
			disable: !isProd,
			allChunks: true
		}),
		new webpack.optimize.CommonsChunkPlugin({
			children: true,
			async: false,
			minChunks: 2
		}),
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
		new ProgressBarWebpackPlugin({
			format: 'Build [:bar] \u001b[32m\u001b[1m:percent\u001b[22m\u001b[39m (:elapseds) \u001b[2m:msg\u001b[22m',
			renderThrottle: 100,
			summary: false,
			clear: true
		})
	].concat(isProd ? [
		new webpack.HashedModuleIdsPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new WebpackChunkHash(),
		new UglifyJsWebpackPlugin({ uglifyOptions: { ecma: 8 } }),
		new OfflinePlugin({
			externals: [
				'https://firebasestorage.googleapis.com'
			],
			ServiceWorker: {
				cacheName: 'open-sea-cache',
				navigateFallbackURL: '/',
				events: true,
				minify: true
			}
		})
	] : [
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
	]),

	devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',

	devServer: {
		contentBase: path.join(__dirname, 'src'),
		historyApiFallback: true,
		inline: true,
		hot: true
	}
};