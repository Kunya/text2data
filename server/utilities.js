var path = require("path");
var fileSystem = require('fs');

var myMkdirSync = function(dir) {
    if (fileSystem.existsSync(dir)) {
        return;
    }
    try {
        fileSystem.mkdirSync(dir);
    }
    catch (err) {
        if (err.code == 'ENOENT') {
            myMkdirSync(path.dirname(dir)); //create parent dir
            myMkdirSync(dir); //create dir
        }
    }
};

module.exports = myMkdirSync;
