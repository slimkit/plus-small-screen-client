/*
|--------------------------------------------------------
| ThinkSNS+ SPA 配置文件
|--------------------------------------------------------
|
| 配置文件使用 ES6 语法配置，这样能保证整个文档项目的语法统一性
| 修改配置文件请使用 ES6 语法对 webpack 进行配置。
|
| @author Seven Du <shiweidu@outlook.com>
|
*/

import path from 'path';
import webpack from 'webpack';

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin';
import WebpackLaravelMixManifest from 'webpack-laravel-mix-manifest';

import CleanWebpackPlugin from 'clean-webpack-plugin';

// 环境变量获取
const NODE_ENV = process.env.NODE_ENV || 'development';

// 是否是正式环境编译
const isProd = NODE_ENV === 'production';

// 各项资源地址定义
const assetsRoot = path.resolve(__dirname, 'src');
const assetsRoot2 = path.resolve(__dirname, 'src_v2');
const buildAssetsRoot = path.resolve(__dirname, 'dist');

// 入口配置
const entry = {
    // app: path.resolve(assetsRoot, 'index.js')
    app: path.resolve(assetsRoot2, 'index.js')
};

function cssLoaders(options = {}) {
    const cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: isProd,
            sourceMap: options.sourceMap
        }
    };

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        let loaders = [cssLoader];
        if(loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            });
        }

        return ExtractTextPlugin.extract({
            use: loaders,
            fallback: 'vue-style-loader'
        });
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
    };
};

function styleLoaders(options = {}) {
    let output = [];
    const loaders = cssLoaders(options);

    for(let extension in loaders) {
        let loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        });
    }

    return output;
};

// 环境插件～不同环境启用的不同插件.
const plugins = isProd ? [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        sourceMap: false
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
        cssProcessorOptions: {
            safe: true
        }
    })
] : [
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.NoEmitOnErrorsPlugin(),
];

const webpackConfig = {
    devtool: isProd ? false : 'source-map',
    entry: entry,
    output: {
        path: buildAssetsRoot,
        publicPath: '/assets/h5/',
        filename: isProd ? 'js/[chunkhash].js' : 'js/[name].js',
        chunkFilename: isProd ? 'js/[chunkhash].js' : 'js/[name].bundle.js',
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        modules: [
            assetsRoot,
            path.join(__dirname, 'node_modules'),
        ],
        alias: {
            'vue$': `vue/dist/vue.common.js`,
        }
    },
    module: {
        rules: [
            ...styleLoaders({ sourceMap: !isProd }),
            {
                test: /\.vue$/,
                use: [{
                        loader: 'vue-loader',
                        options: {
                            loaders: cssLoaders({
                                sourceMap: !isProd
                            })
                        }
                    },
                    {
                        loader: 'iview-loader',
                        options: {
                            prefix: false
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [assetsRoot]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'images/[name].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf|woff)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: isProd ? 'fonts/[hash].[ext]' : 'fonts/[name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(NODE_ENV),
            },
        }),
        new CleanWebpackPlugin(
            ['./*'], { root: buildAssetsRoot, verbose: true, dry: false }
        ),
        new ExtractTextPlugin({
            filename: isProd ? 'css/[chunkhash].css' : 'css/[name].css'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module) {
                // any required modules inside node_modules are extracted to vendor
                return(
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, './node_modules')
                    ) === 0
                )
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        ...plugins,

        new WebpackLaravelMixManifest(),
    ]
};

export default webpackConfig;