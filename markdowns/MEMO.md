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

3. 2번의 내용이 webpack 버전을 올려서 동작을 안 하는 줄 알았지만 ip라는 라이브러리가 browser list를 의존하는 라이브러리라서 그런 것이었다.

```
ERROR in ./node_modules/ip/lib/ip.js 4:13-37
Module not found: Error: Can't resolve 'buffer' in 'C:\Users\yzzeee\Desktop\laboratory\node_modules\ip\lib'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.This is no longer the case. Verify if you need this module and configure a polyfill for it.
If you want to include a polyfill, you need to:
        - add a fallback 'resolve.fallback: { "buffer": require.resolve("buffer/") }'      
        - install 'buffer'
If you don't want to include a polyfill, you can use an empty module like this:
        resolve.fallback: { "buffer": false }
resolve 'buffer' in 'C:\Users\yzzeee\Desktop\laboratory\node_modules\ip\lib'
  Parsed request is a module
  using description file: C:\Users\yzzeee\Desktop\laboratory\node_modules\ip\package.json (relative path: ./lib)
    Field 'browser' doesn't contain a valid alias configuration
    resolve as module
      C:\Users\yzzeee\Desktop\laboratory\node_modules\ip\lib\node_modules doesn't exist or 
is not a directory
      C:\Users\yzzeee\Desktop\laboratory\node_modules\ip\node_modules doesn't exist or is not a directory
      C:\Users\yzzeee\Desktop\laboratory\node_modules\node_modules doesn't exist or is not 
a directory
      looking for modules in C:\Users\yzzeee\Desktop\laboratory\node_modules
        single file module
          using description file: C:\Users\yzzeee\Desktop\laboratory\package.json (relative path: ./node_modules/buffer)
            no extension
              Field 'browser' doesn't contain a valid alias configuration
              C:\Users\yzzeee\Desktop\laboratory\node_modules\buffer doesn't exist
            .js
              Field 'browser' doesn't contain a valid alias configuration
              C:\Users\yzzeee\Desktop\laboratory\node_modules\buffer.js doesn't exist      
            .json
              Field 'browser' doesn't contain a valid alias configuration
              C:\Users\yzzeee\Desktop\laboratory\node_modules\buffer.json doesn't exist    
            .wasm
              Field 'browser' doesn't contain a valid alias configuration
              C:\Users\yzzeee\Desktop\laboratory\node_modules\buffer.wasm doesn't exist    
        C:\Users\yzzeee\Desktop\laboratory\node_modules\buffer doesn't exist
      C:\Users\yzzeee\Desktop\node_modules doesn't exist or is not a directory
      C:\Users\yzzeee\node_modules doesn't exist or is not a directory
      C:\Users\node_modules doesn't exist or is not a directory
      C:\node_modules doesn't exist or is not a directory
 @ ./src/index.js 7:0-20 15:12-14

ERROR in ./node_modules/ip/lib/ip.js 5:9-22
Module not found: Error: Can't resolve 'os' in 'C:\Users\yzzeee\Desktop\laboratory\node_modules\ip\lib'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.This is no longer the case. Verify if you need this module and configure a polyfill for it.
If you want to include a polyfill, you need to:
        - add a fallback 'resolve.fallback: { "os": require.resolve("os-browserify/browser") }'
        - install 'os-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
        resolve.fallback: { "os": false }
resolve 'os' in 'C:\Users\yzzeee\Desktop\laboratory\node_modules\ip\lib'
  Parsed request is a module
  using description file: C:\Users\yzzeee\Desktop\laboratory\node_modules\ip\package.json (relative path: ./lib)
    Field 'browser' doesn't contain a valid alias configuration
    resolve as module
      C:\Users\yzzeee\Desktop\laboratory\node_modules\ip\lib\node_modules doesn't exist or 
is not a directory
      C:\Users\yzzeee\Desktop\laboratory\node_modules\ip\node_modules doesn't exist or is not a directory
      C:\Users\yzzeee\Desktop\laboratory\node_modules\node_modules doesn't exist or is not 
a directory
      looking for modules in C:\Users\yzzeee\Desktop\laboratory\node_modules
        single file module
          using description file: C:\Users\yzzeee\Desktop\laboratory\package.json (relative path: ./node_modules/os)
            no extension
              Field 'browser' doesn't contain a valid alias configuration
              C:\Users\yzzeee\Desktop\laboratory\node_modules\os doesn't exist
            .js
              Field 'browser' doesn't contain a valid alias configuration
              C:\Users\yzzeee\Desktop\laboratory\node_modules\os.js doesn't exist
            .json
              Field 'browser' doesn't contain a valid alias configuration
              C:\Users\yzzeee\Desktop\laboratory\node_modules\os.json doesn't exist        
            .wasm
              Field 'browser' doesn't contain a valid alias configuration
              C:\Users\yzzeee\Desktop\laboratory\node_modules\os.wasm doesn't exist        
        C:\Users\yzzeee\Desktop\laboratory\node_modules\os doesn't exist
      C:\Users\yzzeee\Desktop\node_modules doesn't exist or is not a directory
      C:\Users\yzzeee\node_modules doesn't exist or is not a directory
      C:\Users\node_modules doesn't exist or is not a directory
      C:\node_modules doesn't exist or is not a directory
 @ ./src/index.js 7:0-20 15:12-14

webpack 5.36.2 compiled with 2 errors in 2553 ms
i ｢wdm｣: Failed to compile.
```

# Yarn

1. offline 모드로 다운로드 시 tgz 파일이 같이 다운로드 되지만, 없는 경우 node_modules의 해당 라이브러리 경로로 진입하여 `yarn pack` 명령어를 실행한다.

# GIT

1. git commend에서 인코딩이 깨져서 나온다면 `set LC_ALL=ko_KR.UTF-8`

# VI EDITOR

gg : 첫째줄로 이동
dG : 전체 삭제
p : 붙여넣기