const path = require('path');   //https://nodejs.org/api/path.html
const babiliPlugin = require('babili-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let plugins = [];

plugins.push(new HtmlWebpackPlugin({
    hash: true,
    minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
    },    
    filename: 'index.html',
    template: __dirname + '/main.html'   //the main.html was renamed from index.html
}));

plugins.push(
    new extractTextPlugin("styles.css")
);

plugins.push(
    new webpack.ProvidePlugin({
           '$': 'jquery/dist/jquery.js',
           'jQuery': 'jquery/dist/jquery.js'
    })
);

plugins.push(
    new webpack.optimize.CommonsChunkPlugin(   //plugin to keep our code in one bundled file (ex: bundle.js) and the remaining libraries in another bundled file (ex: vendor.bundle.js)
        { 
            name: 'vendor',  //this is the name of the module. It has to be the same name as in entry: {vendor: ...}, in module.exports configuration below
            filename: 'vendor.bundle.js'
        }
    )
);

let SERVICE_URL = JSON.stringify('http://localhost:3000'); //do not forget the JSON.stringify()

if (process.env.NODE_ENV == 'production') {

    SERVICE_URL = JSON.stringify('http://endereco-da-sua-api-em-PRD');

    plugins.push(new webpack.optimize.ModuleConcatenationPlugin()); //this command is for fast processing (from webpack version 3); allows our code to run faster in browsers
    plugins.push(new babiliPlugin());

    plugins.push(new optimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { 
            discardComments: {
                removeAll: true 
            }
        },
        canPrint: true
    }));
}

plugins.push(new webpack.DefinePlugin({ SERVICE_URL })); //this is a shorthand of SERVICE_URL: SERVICE_URL

module.exports = {
    entry: {
        app: './app-src/app.js',  //this is the first module to be loaded
        vendor: ['jquery', 'bootstrap', 'reflect-metadata']  //configuring the libraries that will be part of the vendor.bundle.js
    },
    output: {
        filename: 'bundle.js',  //this is the generated output file with all dependencies resolved
        path: path.resolve(__dirname, 'dist')   //__dirname is the current directory, and dist is a subdirectory where filename will be generated
        //publicPath: 'dist'   //this is the directory where the bundle.js will be created by webpack-dev-server
    },
    module: {
        rules: [                            //we can have many rules
            {
                test: /\.js$/,              //regular expression for js files; test indicates a condition where our loader will be applied
                exclude: /node_modules/,    //regular expression for excluding js files from node_modules directory
                use: {
                    loader: 'babel-loader'  //loader indicates the loader that will be used
                }
            },
            {
                test: /\.css$/,    //"exclude: /node_modules/": not necessary as the css files are in this directory (as they were installed via npm)
                //loader: 'style-loader!css-loader'    //! indicates that one loader will be applied after the other, from Right to Left
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/font-woff' 
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'file-loader' 
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml' 
            }
        ]
    },
    plugins: plugins
}
