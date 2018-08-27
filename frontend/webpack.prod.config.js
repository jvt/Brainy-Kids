"use strict";

// TODO: Get this on-par with the dev version, make sure to implement as many
// space-saving techniques as possible, this bundle is huge

const webpack = require("webpack");
const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
	entry: ["./frontend/index"],
	module: {
		rules: [
			{
				test: /\.js?$/,
				loader: "babel-loader",
				options: {
					// cacheDirectory: true
					presets: ["es2015", "react"],
					plugins: [["import", { libraryName: "antd", style: true }]]
				},
				exclude: /node_modules/
			},
			{ test: /\.less/, loader: "style-loader!css-loader!less-loader" },
			{ test: /\.css/, loader: "style-loader!css-loader" },
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 8192
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: [".js", ".less", ".css"]
	},
	output: {
		path: path.join(__dirname, "/public"),
		publicPath: "/",
		filename: "bundle.js"
	},
	plugins: [
		new Dotenv({ path: "./.env.frontend" }),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production")
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	]
};
