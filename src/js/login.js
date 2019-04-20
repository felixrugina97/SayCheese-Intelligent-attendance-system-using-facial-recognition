const remote = require('electron').remote;
const main = remote.require('./main.js');
const logger = require("./../../utils/logger").Logger;

const fileName = 'src::js::login.js';
const clientType = 0;

function login() {
    var window = remote.getCurrentWindow();
    if (clientType == 0) {
        logger.debug("User logged in as Admin", fileName);
        main.openWindow('admin_index');
        logger.debug("Admin Window opened", fileName);
    }
    else if (clientType == 1) {
        logger.debug("User logged in as Teacher", fileName);
        main.openWindow('teacher_index');
        logger.debug("Admin Window opened", fileName);
    }

    window.hide();
    logger.debug("Login window hidden with success", fileName);
}