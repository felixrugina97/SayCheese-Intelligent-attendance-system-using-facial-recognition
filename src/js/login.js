const remote = require('electron').remote;
const main = remote.require('./main.js');
const sha256 = require('sha256');

const logger = require("./../../config/logger").Logger;
const connection = require('./../../config/connection');

const fileName = 'src::js::login.js';
const EMPTY_PASSWORD = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

const userType = {
    ADMIN: 0,
    TEACHER: 1
};

function login() {
    var email = $('#email').val();
    var password = sha256($('#password').val()).toString('base64');

    if (email == '') {
        var popup = $("#email-popup").text("Please enter email")[0];
        popup.classList.toggle("show");
        logger.info("User didn't fill email field" , fileName);
    }
    else if (password == EMPTY_PASSWORD) {
        var popup = $("#password-popup").text("Please enter password")[0];
        popup.classList.toggle("show");
        logger.info("User didn't fill password field" , fileName);
    }
    else {
        connection.query('SELECT * FROM User WHERE email = ?', [email], function(err, result, fields) {
            if (result.length > 0) {
                if(result[0].password == password) {
                    checkUserType(result[0].userType, email);
                }
                else {
                    var popup = $("#password-popup").text("Password does not match")[0];
                    popup.classList.toggle("show");
                    logger.info("User " + email + " tryed to log in but password does not match", 
                        fileName);
                }
            }
            else {
                var popup = $("#email-popup").text("Email does not exists")[0];
                popup.classList.toggle("show");
                logger.info("User tryed to connect with " + email + " but this email does not exist", 
                    fileName);
            }
        });
    }
}

function checkUserType(result, email) {
    var window = remote.getCurrentWindow();
    
    if (result == userType.ADMIN) {
        logger.info("User " + email + " logged in as Admin with success", fileName);
        main.openWindow('admin_index');
        window.hide();
        logger.debug("Login window hidden with success", fileName);
    }
    else if (result == userType.TEACHER) {
        logger.info("User " + email + " logged in as Teacher with success", fileName);
        main.openWindow('teacher_index');
        window.hide();
        logger.debug("Login window hidden with success", fileName);
    }
}
