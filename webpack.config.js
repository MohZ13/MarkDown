const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const webpackConfig = {
    entry: './src/index.js',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: "./src/favicon.ico"
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, './src/assets'), to: 'assets' },
                { from: path.resolve(__dirname, './src/manifest.json') }
            ]
        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        })
    ],
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'sass-loader'
            ]
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader',
            ],
        }]
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        moduleIds: 'hashed',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
};


module.exports = (env) => {

    if (env && env.prod) {
        webpackConfig.mode = 'production';
    } else {
        Object.assign(webpackConfig, {
            mode: 'development',
            devtool: 'eval-source-map',
            devServer: {
                contentBase: path.join(__dirname, 'dist'),
                host: '0.0.0.0',
                port: 4000
            }
        });
    }

    return webpackConfig;
};