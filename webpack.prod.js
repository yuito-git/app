//公開用のモード
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const ImageminMozjpeg = require("imagemin-mozjpeg");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: {
        quality: "95-100",//圧縮率
      },
      gifsicle: {
        interlaced: false,
        optimizationLevel: 1,
        colors: 256,
      },
      svgo: {},
      plugins: [
        ImageminMozjpeg({
          quality: 85,
          progressive: true,
        }),
      ],
    }),
    new ImageminWebpWebpackPlugin({
      config: [
        {
          test: /\.(jpe?g|png)$/i,
          options: {
            quality: 75,
          },
        },
      ],
      detailedLogs: true,//変換後のバイト数や変換に失敗したファイル数などを表示
      overrideExtension: false, // 拡張子の変換を行わない。image.png.webpというファイル名のように元の拡張子を残す。
    }),
  ],
});
