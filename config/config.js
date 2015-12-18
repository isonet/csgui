var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

var config = {
    root: rootPath,
    app: {
        name: 'csgogui'
    }
};

module.exports = config;
