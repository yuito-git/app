module.exports = (api) => {
  //キャッシュを有効化してパフォーマンス向上
  api.cache(true);

  return {
    presets: [
      [
        //ES6の構文を古いブラウザに対応するために古い書き方にトランスパイル
        "@babel/preset-env",
        {
          useBuiltIns: "usage",//必要なポリフィルのみ読み込む
          corejs: 3, // バージョンを指定
        },
      ],
    ],
  };
};
