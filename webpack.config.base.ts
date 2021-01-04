import { Configuration, DefinePlugin, ProvidePlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import * as path from "path";

const config: Configuration = {
	entry: "./src/index.tsx",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "public"),
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: "ts-loader",
					options: {
						transpileOnly: true,
					},
				},
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	plugins: [
		new DefinePlugin({
			"process.browser": "true",
		}),
		new ProvidePlugin({
			Buffer: ["buffer", "Buffer"],
		}),
		new HtmlWebpackPlugin({
			title: "オリジナルガチャメーカー",
			template: "./index.html",
			filename: "index.html",
		}),
		new CopyPlugin({
			patterns: [{ from: "assets", to: "." }],
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
		extensions: [".ts", ".tsx", ".js", ".jsx"],
		fallback: {
			crypto: require.resolve("crypto-browserify"),
			stream: require.resolve("stream-browserify"),
		},
	},
};

export default config;
