//Node.jsに標準で入っている絶対パスを取得したり、ファイル名取得したりできるモジュール
const path = require("path");
//複数のpugファイルを自動でコンパイルするためのモジュール
const globule = require("globule");
//CSSをJSファイルにバンドルせずにCSSファイルとして出力して、<link>タグで読み込ませる
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//個々のファイルやディレクトリ全体をコピーするたのプラグイン
const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');

const StyleLintPlugin = require("stylelint-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

// ==============================================
// 設定
// ==============================================
const dir = {
  src: "src",
  dist: "public",
  assets: "assets",
};

const settings = {
  pug: true,
  sass: true,
  ts: false,
  php: false,
};

// ==============================================
// エントリーポイント設定
// ==============================================
const entryPoints = {
  main: [`./${dir.src}/${dir.assets}/js/main.js`, `./${dir.src}/${dir.assets}/css/common.css`],
};

if (settings.ts) {
  entryPoints.main[0] = `./${dir.src}/${dir.assets}/ts/main.ts`;
}
if (settings.sass) {
  entryPoints.main[1] = `./${dir.src}/${dir.assets}/sass/common.scss`;
}

// ==============================================
// Pug の設定
// ==============================================
const templates = [];
if (settings.pug) {
  const documents = globule.find([`./${dir.src}/html/**/*.html`, `./${dir.src}/pug/**/*.pug`], {
    ignore: [`./${dir.src}/html/**/_*.html`, `./${dir.src}/pug/**/_*.pug`],
  });

  documents.forEach((document) => {
    const fileName = document
      .replace(`./${dir.src}/pug/`, "")
      .replace(`./${dir.src}/html/`, "")
      .replace(".pug", ".html");
    templates.push(
      new HtmlWebpackPlugin({
        filename: `${fileName}`,//出力ファイル名
        template: document,//コンパイル対象ファイル
        inject: false,//バンドルしたjsファイルを読み込むscriptタグを自動出力しない。html・pugファイル側でscriptタグを記述する。
        minify: false,//htmlの圧縮しない
      })
    );
  });
}

// ==============================================
// BrowserSync の設定
// ==============================================
const browserOptions = {
  host: "localhost",//ホスト名
  port: 3000,//ポート番号
  online: true,//オンラインモード
  open: "external",//ブラウザを自動で開く
};

if (settings.php) {
  browserOptions.proxy = "http://localhost:8080/";//phpの起動時に使用するポート番号
} else {
  browserOptions.server = { baseDir: [`${dir.dist}`] };//ブラウザで表示するデフォルトディレクトリ
}

// ==============================================
// webpack モジュールエクスポート
// ==============================================
module.exports = {
  entry: {
    ...entryPoints,
  },
  output: {
    //第一引数に現在のディレクトリまでの絶対パスを補完してくれる特別な変数、第二引数に出力先のファイル名を指定
    path: path.resolve(__dirname, dir.dist),
    //[name]には、entry{}内で使用されているプロパティ名が入る。今回の場合、mainが入る
    filename: `./${dir.assets}/js/[name].bundle.js`,
    // assetModuleFilename: `${dir.assets}/img/[name][ext]`,
  },

  module: {
    //testに対象となるファイルを指定。
    //「[]」は[]内に含まれるいずれか1文字にマッチ
    //「｜」はOR条件を表す
    //「/〜/」の中で正規表現を書く
    //「$」は最後が$の前につけた文字で終わるやつ
    //useに利用するローダをかく
    //ローダを複数指定した場合、後ろに書いたローダから実行されるから書く順番に気をつける
    //excludeに除外するファイルの設定
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      // {
      //   test: /\.(js|ts|tsx)$/,
      //   enforce: "pre",
      //   exclude: /node_modules/,
      //   loader: "eslint-loader",
      //   options: {
      //     fix: true, //autofixモードの有効化
      //     failOnError: true, //エラー検出時にビルド中断
      //   },
      // },
      {
        test: /\.(css|s[ac]ss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              //CSS内のurl()を取り込まない
              //background-image:url(hoge/hoge.png);とかurlを指定したときにうまくいくようにする
              url: false,
              sourceMap: true,
            },
          },
          //sassまたはscssファイルの場合sass-loaderでSassをCSSに変換してからpostcss-loaderを実行
          //ベンダープレフィックスとかscssファイルにいらんから
          "postcss-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/,
        //ロードされる順番を指定。preは最優先で実行
        //sassファイルまたは、scssファイルがあるときは最優先に実行する
        enforce: "pre",
        use: [
          {
            //sass-loader・・scssをcssに変換
            loader: "sass-loader",
            options: {
              //Dart Sassを読み込むことを明示的にする
              implementation: require('sass'),
            }
          },
        ]
      },
      {
        test: /\.(pug|html)$/,
        use: [
          {
            loader: "html-loader",
            options: {
              //画像のバンドルをしない
              sources: false,
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        enforce: "pre",
        use: [
          {
            loader: "pug-html-loader",
            options: {
              pretty: true,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    //拡張機能の設定
    new BrowserSyncPlugin(browserOptions),
    new MiniCssExtractPlugin({
      //出力されるCSSファイルのパスと名前を指定
      filename: `./${dir.assets}/css/common.css`,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `${dir.src}/${dir.assets}/img`,//コピー元のディレクトリ
          to: `${dir.assets}/img`,//コピー先のディレクトリ(output.pathが基準)
          noErrorOnMissing: true,//ディレクトリがなくてもエラーを出さない
        },
        {
          from: `${dir.src}/${dir.assets}/font`,
          to: `${dir.assets}/font`,
          noErrorOnMissing: true,
        },
        {
          from: `${dir.src}/${dir.assets}/pdf`,
          to: `${dir.assets}/pdf`,
          noErrorOnMissing: true,
        },
        {
          from: `${dir.src}/${dir.assets}/media`,
          to: `${dir.assets}/media`,
          noErrorOnMissing: true,
        },
        {
          from: `${dir.src}/php`,
          noErrorOnMissing: true,
        },
        {
          from: "*.txt",
          context: `${dir.src}/`,
          noErrorOnMissing: true,
        },
        {
          from: "*.json",
          context: `${dir.src}/`,
          noErrorOnMissing: true,
        },
        {
          from: "*.xml",
          context: `${dir.src}/`,
          noErrorOnMissing: true,
        },
        {
          from: "*.png",
          context: `${dir.src}/`,
          noErrorOnMissing: true,
        },
        {
          from: "*.icon",
          context: `${dir.src}/`,
          noErrorOnMissing: true,
        },
        {
          from: ".htaccess",
          context: `${dir.src}/`,
          noErrorOnMissing: true,
        },
        {
          from: "style.css",
          context: `${dir.src}/`,//ここで指定したディレクトリ以下のstyle.cssをコピー。それ以外はコピーしない
          noErrorOnMissing: true,
        },
      ],
    }),
    new ESLintPlugin({
      extensions: ['.ts', '.js'],
      exclude: 'node_modules',
      fix: true
    }),

    new StyleLintPlugin({
      fix: true, // 自動修正可能なものは修正
      // failOnError: true, //エラー検出時にビルド中断
    }),
    ...templates,//配列の形ではなくて上記のStyleLintPluginと同じ形で書く。スプレッド構文
  ],
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  // ES5(IE11等)向けの指定
  target: ["web", "es5"],
};
