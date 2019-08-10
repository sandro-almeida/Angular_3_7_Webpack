const path = require('path');

module.exports = {
    entry: './app-src/app.js',  //this is the first module to be loaded
    output: {
        filename: 'bundle.js',  //this is the generated output file with all dependencies resolved
        path: path.resolve(__dirname, 'dist')   //__dirname is the current directory, and dist is a subdirectory where filename will be generated
    }
}
