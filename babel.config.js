module.exports = (api) => {
  //キャッシュを有効化してパフォーマンス向上
  api.cache(true);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: "usage",
          corejs: 3, // バージョンを指定
        },
      ],
    ],
  };
};
