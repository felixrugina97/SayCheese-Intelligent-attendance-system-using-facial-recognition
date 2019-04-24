var fs = require('fs');

var Logger = (exports.Logger = {});

Logger.info = function(message, file) {
    let log = "[" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "]"+ " [INF]" + 
        "[" + file + "] : " + message + "\n";

    fs.appendFile('./logs/saycheese.log', log, function (err) {
        if (err) {
            throw err;
        }
    });
};

Logger.debug = function(message, file) {
    let log = "[" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "]"+ " [DBG]" + 
        "[" + file + "] : " + message + "\n";

    fs.appendFile('./logs/saycheese.log', log, function (err) {
        if (err) {
            throw err;
        }
    });
};

Logger.warning = function(message, file) {
    let log = "[" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "]"+ " [WRN]" + 
        "[" + file + "] : " + message + "\n";

    fs.appendFile('./logs/saycheese.log', log, function (err) {
        if (err) {
            throw err;
        }
    });
};

Logger.error = function(message, file) {
    let log = "[" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "]"+ " [ERR]" + 
        "[" + file + "] : " + message + "\n";

    fs.appendFile('./logs/saycheese.log', log, function (err) {
        if (err) {
            throw err;
        }
    });
};
