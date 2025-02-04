const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
  console.log(env.port);
  return {
    mode: 'development',
    entry: "./src/main.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "tracker.bundle.js",
      clean: true,
    },
    devServer: {
      static: path.join(__dirname, "dist"),
      compress: true,
      port: env.port,
      host: env.host,
      open: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html",
        filename: "index.html",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules|Worker\.js/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /Worker\.js$/,  // Match file che finiscono con Worker.js
          use: { loader: 'worker-loader' }, // Usa worker-loader per gestire questi file
        },
        {
          test: /\.html$/,
          use: ['html-loader'], // Aggiungi questo per gestire i file HTML
        }
      ],
    }
  };
};
