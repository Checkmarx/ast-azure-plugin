const path = require('path');

module.exports = { 
    entry:"./CxASTScan/src/index.js",
    devtool: "inline-source-map",
    devServer: {
        https: true,
        port: 8080
    },
    output: {
        filename:"index.js",
        path: path.resolve(__dirname,"src/")
    },
    watch: true
    // ...
  };