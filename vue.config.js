const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: ["./src/assets/styles/variable.scss"],
    },
  },
});
