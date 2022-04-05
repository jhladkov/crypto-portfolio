const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: true,
  runtimeCompiler: true,
  css: {
    sourceMap: true,
    loaderOptions: {
      sass: {
        additionalData: `
          @import "~@/assets/scss/variables.scss";
          @import "~@/assets/scss/helpers.scss";
        `,
      },
    },
  },
});
