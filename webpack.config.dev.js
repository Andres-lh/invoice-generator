const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/index',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    resolve: {
        extensions: ['.js'], 
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test:/\.(css|sass|scss)$/,
                use:[MiniCssExtractPlugin.loader, 
                    'css-loader',
                    'sass-loader'
                ], 
            }, 
        ]
        
    },
    plugins: [
        new HtmlWebpackPlugin({ 
            inject: true, 
            template: './src/index.html', 
            filename: './index.html'
        }),
        new MiniCssExtractPlugin(),
    ],
    devServer: {
        historyApiFallback: true,
        port: 3000
    }
}