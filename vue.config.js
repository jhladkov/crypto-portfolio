const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,
  lintOnSave: true,
  css: {
    sourceMap: true,
    loaderOptions: {
      sass: {
        additionalData: `
          @import "~@/assets/scss/main.scss";
        `,
      },
    },
  },
});
