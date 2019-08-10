const path = require('path');   //https://nodejs.org/api/path.html

module.exports = {
    entry: './app-src/app.js',  //this is the first module to be loaded
    output: {
        filename: 'bundle.js',  //this is the generated output file with all dependencies resolved
        path: path.resolve(__dirname, 'dist')   //__dirname is the current directory, and dist is a subdirectory where filename will be generated
    },
    module: {
        rules: [                            //we can have many rules
            {
                test: /\.js$/,              //regular expression for js files; test indicates a condition where our loader will be applied
                exclude: /node_modules/,    //regular expression for excluding js files from node_modules directory
                use: {
                    loader: 'babel-loader'  //loader indicates the loader that will be used
                }
            }
        ]
    }
}