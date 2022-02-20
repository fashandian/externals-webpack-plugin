const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExternalsWebpackPlugin = require('./src/index');

module.exports = {
    mode: 'development',
    entry: {
        main: path.resolve(__dirname, './example/index.js')
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    devtool: false,
    // externals: {
    //     lodash: '_'
    // },
    plugins: [
        new HtmlWebpackPlugin({
            template: './example/index.html'
        }),
        new ExternalsWebpackPlugin({
            lodash: {
                src: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/lodash.js/4.17.20/lodash.min.js',
                namespace: '_'
            },
            vue: {
                src: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/2.6.14/vue.min.js',
                namespace: 'Vue'
            }
        })
    ]
}