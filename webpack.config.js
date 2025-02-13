const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
  console.log(env.port);
  return {
    mode: 'development',
    entry: "./main.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
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
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true // Opzionale: velocizza la compilazione in development
              }
            }
          ],
          exclude: /node_modules/,
        },
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
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    devtool: 'source-map' // Aggiunto per migliore debugging
  };
};
