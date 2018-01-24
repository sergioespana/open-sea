const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const WebpackBundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackChunkHash = require('webpack-chunk-hash');
const WebpackWorkboxPlugin = require('workbox-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
	entry: [
		'babel-polyfill',
		path.resolve(__dirname, 'src/index.js')
	],

	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: '/',
		filename: '[name].[hash:10].js',
		chunkFilename: '[name].[chunkhash:10].js'
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
								sourceMap: isProd,
								plugins: [autoprefixer({ browsers: ['last 2 versions'] })]
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
			filename: isProd ? 'style.[contenthash:10].css' : 'style.css',
			disable: !isProd,
			allChunks: true
		}),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: '[name].[hash:10].js',
			minChunks: ({ resource }) => /node_modules/.test(resource)
		}),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, 'src/assets'),
				to: path.resolve(__dirname, 'build/assets')
			},
			{
				from: path.resolve(__dirname, 'src/manifest.json'),
				to: path.resolve(__dirname, 'build/manifest.json')
			}
		]),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/index.html'),
			minify: { collapseWhitespace: true }
		})
	].concat(isProd ? [
		new webpack.HashedModuleIdsPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new WebpackChunkHash(),
		new UglifyJsWebpackPlugin({
			sourceMap: isProd,
			uglifyOptions: { ecma: 8 }
		}),
		new CopyWebpackPlugin([
			{
				from: require.resolve('workbox-sw'),
				to: path.resolve(__dirname, 'build/workbox-sw.prod.js')
			}
		]),
		new WebpackWorkboxPlugin({
			globDirectory: path.resolve(__dirname, 'build'),
			globPatterns: ['**/*.{html,css,js}'],
			swSrc: path.resolve(__dirname, 'src/sw.js'),
			swDest: path.resolve(__dirname, 'build/sw.js')
		})
	] : [
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new WebpackBundleAnalyzerPlugin()
	]),

	devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',

	devServer: {
		contentBase: path.join(__dirname, 'src'),
		historyApiFallback: true,
		inline: true,
		hot: true,
		open: true
	}
};