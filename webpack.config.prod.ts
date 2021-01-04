import { DefinePlugin } from "webpack";
import merge from "webpack-merge";
import baseConfig from "./webpack.config.base";

export default merge(baseConfig, {
	mode: "none",
	optimization: {
		minimize: true,
	},
	plugins: [
		new DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify("production"),
		}),
	],
});
