const path = require('path');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin'); // css 分离

var website = {
    publicPath: "http://localhost:8888/"
    // publicPath:"http://192.168.1.103:8888/"
}

module.exports = {
    /**
     * webpack4.x下，压缩代码不在webpack.config.js中写plugins: [ new webpack.optimize.UglifyJsPlugin() ],而是在package.json中的script下面写：
     * "start": "webpack --mode production", 自动开启代码压缩
     * "build": "webpack --mode development"
     */
    // mode: 'production',

    // 入口文件的配置项
    entry: {
        // 里面的main是可以随便写的
        main: './src/main.js',
        main2: './src/main2.js' // 多个入口文件
    },
    // 出口文件的配置项
    output: {
        // 打包的路径
        path: path.resolve(__dirname, '../dist'),
        // 打包的文件名称
        filename: 'js/[name].js', // 这里面的[name]指入口进去的文件名是什么，打包出来的也同样是什么名
        publicPath: website.publicPath  //publicPath：主要作用就是处理静态文件路径的。
    },
    // 模块：例如解读css, 图片如何转换，压缩
    module: {
        rules: [
            // css loader
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        'postcss-loader'
                    ]
                }),
            },
            //图片 loader
            {
                test: /\.(png|jpg|gif|jpeg)/,  //是匹配图片文件后缀名称
                use: [{
                    loader: 'url-loader', //是指定使用的loader和loader的配置参数
                    options: {
                        limit: 500,  //是把小于500B的文件打成Base64的格式，写入JS
                        outputPath: 'images/',  //打包后的图片放到images文件夹下
                    }
                }]
            },
            // 打包后的图片放到指定的images文件夹下
            {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            },
            //less loader
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            //scss loader
            {
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            // es6 转换
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options:{
                        cacheDirectory:true //缓存
                    }
                }
            },
        ]
    },
    // 插件：用于生产模块和各项功能
    plugins: [
        new htmlPlugin({
            minify: { //是对html文件进行压缩
                removeAttributeQuotes: true  //removeAttrubuteQuotes是却掉属性的双引号。
            },
            hash: true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            template: './src/index.html' //是要打包的html模版路径和文件名称。

        }),
        new extractTextPlugin("css/index.css")  //这里的 /css/index.css 是分离后的路径
    ],
    // 配置webpack开发服务功能, 带有热更新的功能
    devServer: {
        // 设置基本目录结构
        contentBase: path.resolve(__dirname, '../dist'),
        // 服务器的Ip地址： 可以使用IP也可以是localhost
        host: 'localhost',
        // 服务器的压缩是否开启
        compress: true,
        // 配置服务端口号
        port: 8888
    }
}