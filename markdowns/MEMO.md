# Webpack

1. package.json에 script에 작성한 명령어는 node_modules의 .bin을 실행한다. webpack script에 `webpack` 스크립트를 실행 시 했을 때 기본값으로 entry가 src/index.js로 output이 dist로 설정되어 있다. mode 옵션은 추가 해야한다.

2. webpack.config.js basic한 형태 `node_modules\.bin\webpack --mode development --entry .\src\app.js --output dist\main.js` 와 같이 작성하여 실행 할 수 있으나 매번 명령어를 작성하기 어려우므로 config를 작성한다.

```
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js"
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js"
  },
};
```

2. webpack을 버전 4 -> 5로 변경하면서 dev 서버를 실행하려고 하니 동작하지 않는다.
   webpack-config-js 다음과 같이 작성 후 라이브러리들을 추가 하니까 동작한다.

```
resolve: {
  fallback: {
    os: require.resolve("os-browserify/browser"),
    path: require.resolve("path-browserify"),
    buffer: require.resolve("buffer/"),
  },
},
```

# Yarn

1. offline 모드로 다운로드 시 tgz 파일이 같이 다운로드 되지만, 없는 경우 node_modules의 해당 라이브러리 경로로 진입하여 `yarn pack` 명령어를 실행한다.

# GIT

1. git commend에서 인코딩이 깨져서 나온다면 `set LC_ALL=ko_KR.UTF-8`
