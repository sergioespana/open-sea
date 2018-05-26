const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const WebpackStylish = require('webpack-stylish');
const WebpackWorkboxPlugin = require('workbox-webpack-plugin');

module.exports = (env, argv) => ({
	entry: path.resolve(__dirname, 'src/index.tsx'),

	output: {
		publicPath: '/',
		filename: '[name].[hash:10].js',
		chunkFilename: '[name].[chunkhash:10].js'
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
			// 	commons: {
			// 		chunks: 'all',
			// 		enforce: true,
			// 		minChunks: 2,
			// 		name: 'common'
			// 	},
				vendor: {
					chunks: 'all',
					enforce: true,
					name: 'vendor',
					test: /node_modules/
				}
			}
		}
	},

	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},

	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.(j|t)sx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		].concat(argv.mode === 'production' ? [
			{
				test: /\.(j|t)sx?$/,
				include: path.resolve(__dirname, 'src/routes'),
				use: {
					loader: path.resolve(__dirname, 'async-loader'),
					options: {
						nameContext: path.resolve(__dirname, 'src/routes'),
						reactLoadable: {
							timeout: 5000
						}
					}
				}
			}
		] : [])
	},

	plugins: [
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, 'src/assets'),
				to: path.resolve(__dirname, 'dist/assets')
			},
			{
				from: path.resolve(__dirname, 'src/manifest.json'),
				to: path.resolve(__dirname, 'dist/manifest.json')
			}
		]),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/index.html'),
			minify: { collapseWhitespace: true }
		}),
		new WebpackBar({
			name: 'build'
		}),
		new WebpackStylish()
	].concat(argv.mode === 'production' ? [
		new WebpackWorkboxPlugin.GenerateSW({
			clientsClaim: true,
			exclude: [/\.(?:png|jpg|jpeg|svg)$/],
			runtimeCaching: [
				{
					urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
					handler: 'cacheFirst'
				},
				{
					urlPattern: new RegExp('https://firebasestorage.googleapis.com'),
					handler: 'cacheFirst'
				}
			],
			skipWaiting: true,
			swDest: path.resolve(__dirname, 'dist/sw.js')
		})
	] : []),

	devServer: {
		contentBase: path.join(__dirname, 'src'),
		historyApiFallback: true,
		hot: true,
		inline: true,
		publicPath: '/',
		stats: 'none'
	},

	stats: 'none'
});
