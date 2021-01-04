import merge from "webpack-merge";
import baseConfig from "./webpack.config.base";

export default merge(baseConfig, {
	mode: "development",
	devtool: "inline-source-map",
});
