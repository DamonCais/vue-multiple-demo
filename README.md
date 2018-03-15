# vue-multiple-demo
webpack 配置多页面应用
> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

通过修改webpack的配置实现vue多页面应用的开发和打包。
build 目录下，
webpack.base.conf 基础配置部分：
···
var glob = require('glob');
var entries = getEntry('./src/module/**/*.js'); // 获得入口js文件


function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname;

    glob.sync(globPath).forEach(function(entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        // pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
        pathname = basename; // 正确输出js和html的路径

        entries[pathname] = entry;
    });
    console.log("base-entrys:");
    console.log(entries);
    return entries;
}
···
···
entry: entries,
entry:{app: './src/main.js'},
原理很简单，其实就是修改入口文件的内容
glob扫描了 src/module目录下的文件。
···

webpack.dev.conf 开发环境下配置部分：
···
var glob = require('glob');
function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname;

    glob.sync(globPath).forEach(function(entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        // pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
        pathname = basename; // 正确输出js和html的路径
        entries[pathname] = entry;
    });
    console.log("dev-entrys:");
    console.log(entries);
    return entries;
}
var pages = getEntry('./src/module/**/*.html');
console.log("dev pages----------------------");
for (var pathname in pages) {
    console.log("filename:" + pathname + '.html');
    console.log("template:" + pages[pathname]);
    // 配置生成的html文件，定义路径等
    var conf = {
        filename: pathname + '.html',
        template: pages[pathname], // 模板路径
        minify: { //传递 html-minifier 选项给 minify 输出
            removeComments: true
        },
        inject: 'body', // js插入位置
        chunks: [pathname, "vendor", "manifest"] // 每个html引用的js模块，也可以在这里加上vendor等公用模块
    };
    // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
    devWebpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}
···
···
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
    可以发现，原来的HtmlWebpackPlugin插件配置被注释了，我使用了新的plugins.push的方法来实现多个plugin对象插入
···


webpack.prod.conf 生产环境下的配置部分：
···
var glob = require('glob');
function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname;

    glob.sync(globPath).forEach(function(entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        // pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
        pathname = basename; // 正确输出js和html的路径
        entries[pathname] = entry;
    });
    console.log("prod-entrys:");
    console.log(entries);
    return entries;
}

var pages = getEntry('./src/module/**/*.html');
console.log("prod pages-----");
for (var pathname in pages) {
    console.log("filename:" + pathname + '.html');
    console.log("template:" + pages[pathname]);
    // 配置生成的html文件，定义路径等
    var conf = {
        filename: pathname + '.html',
        template: pages[pathname], // 模板路径
        minify: { //
            removeComments: true,
            collapseWhitespace: false
        },
        inject: true, // js插入位置
        chunks: [pathname, "vendor", "manifest"] // 每个html引用的js模块，也可以在这里加上vendor等公用模块
    };
    // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
    webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}
···
···
    // new HtmlWebpackPlugin({
    //   filename: config.build.index,
    //   template: 'index.html',
    //   inject: true,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeAttributeQuotes: true
    //     // more options:
    //     // https://github.com/kangax/html-minifier#options-quick-reference
    //   },
    //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    //   chunksSortMode: 'dependency'
    // }),
    同样的，把HtmlWebpackPlugin插件配置被注释了
···

最后需要说明的是：我把不同的页面放到了module下，为了使最后生成的页面不带module/路径
我把所有的pathname做了一些简单的修改
    // pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
    pathname = basename; // 正确输出js和html的路径
    最后，通过npm run build 打包生成了多个页面，
    为了验证打包成功，可以在当前目录下node app，通过koa写的一个简单的静态服务器。
