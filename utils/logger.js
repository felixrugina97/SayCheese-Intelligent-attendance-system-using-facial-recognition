const fs = require('fs');

var Logger = (exports.Logger = {});

Logger.info = function(message, file) {
    var log = "[" + new Date().toISOString() + "]"+ " [INF]" + "[" + file + "] : " + message + "\n";

    fs.appendFile('./logs/saycheese.log', log, function (err) {
        if (err) {
            throw err;
        }
    });
}

Logger.debug = function(message, file) {
    var log = "[" + new Date().toISOString() + "]"+ " [DBG]" + "[" + file + "] : " + message + "\n";

    fs.appendFile('./logs/saycheese.log', log, function (err) {
        if (err) {
            throw err;
        }
    });
}

Logger.warning = function(message, file) {
    var log = "[" + new Date().toISOString() + "]"+ " [WRN]" + "[" + file + "] : " + message + "\n";

    fs.appendFile('./logs/saycheese.log', log, function (err) {
        if (err) {
            throw err;
        }
    });
}

Logger.error = function(message, file) {
    var log = "[" + new Date().toISOString() + "]"+ " [ERR]" + "[" + file + "] : " + message + "\n";

    fs.appendFile('./logs/saycheese.log', log, function (err) {
        if (err) {
            throw err;
        }
    });
}