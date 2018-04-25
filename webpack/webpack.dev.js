const { join } = require('path');
const { smartStrategy } = require('webpack-merge');
const {
    HotModuleReplacementPlugin,
    NamedModulesPlugin,
    WatchIgnorePlugin,
    EnvironmentPlugin
} = require('webpack');
const paths = require('./paths');
const { typingsForCssModulesLoader, postCSSLoader, awesomeTypeScriptLoader } = require('./loaders');
const commonConfig = require('./webpack.common');

const DEV_SERVER_PORT = 9000;

const devConfig = {
    entry: [
        'react-hot-loader/patch',
        paths.app,
        `webpack-dev-server/client?http://localhost:${DEV_SERVER_PORT}`,
        'webpack/hot/only-dev-server'
    ],
    output: {
        path: paths.distDev
    },
    devtool: 'source-map',
    devServer: {
        contentBase: [join(__dirname, '../preview/src'), join(__dirname, '../assets')],
        compress: true,
        hot: true,
        port: DEV_SERVER_PORT,
        proxy: {
            '/assets/flows': {
                bypass: req => {
                    const { query: { uuid }, originalUrl } = req;
                    if (uuid) {
                        return `/flows/${uuid}.json`;
                    }
                    return originalUrl.replace('/assets', '');
                },
                changeOrigin: true,
                secure: false
            },
            '/local': {
                target: 'http://localhost.textit.in:8000/api/v2/',
                pathRewrite: { '^/local': '' },
                changeOrigin: true,
                secure: false
            },
            '/migrate': {
                target: 'http://localhost:8800'
            },
            '/flow/**': {
                target: 'http://localhost:8800'
            }
        }
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new EnvironmentPlugin({
            NODE_ENV: 'development'
        }),
        new NamedModulesPlugin(),
        new WatchIgnorePlugin([/scss\.d\.ts$/])
    ],
    module: {
        rules: [
            {
                test: /\.s?css$/,
                include: [paths.component],
                use: ['style-loader', typingsForCssModulesLoader(), postCSSLoader, 'sass-loader']
            },
            {
                test: /\.s?css$/,
                include: [paths.lib],
                exclude: [paths.component],
                use: ['style-loader', 'css-loader', postCSSLoader, 'sass-loader']
            },
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/],
                use: ['react-hot-loader/webpack', awesomeTypeScriptLoader()]
            }
        ]
    }
};

module.exports = {
    DEV_SERVER_PORT,
    config: smartStrategy({
        plugins: 'append',
        'module.rules': 'append'
    })(commonConfig, devConfig)
};
