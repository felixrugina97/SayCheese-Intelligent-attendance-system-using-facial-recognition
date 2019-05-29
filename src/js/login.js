var remote = require('electron').remote;
var main = remote.require('./main.js');
var sha256 = require('sha256');
var $ = require('jquery');

var logger = require('./../../config/logger').Logger;
var connection = require('./../../config/connection');

var fileName = 'src::js::login.js';
var EMPTY_PASSWORD = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

var userID = null;
var userType = {
    ADMIN: 0,
    TEACHER: 1
};

$('#login-button').click(function() {
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
        let sql = 'SELECT * FROM User WHERE email = ?';
        connection.query(sql, [email], function(err, result, fields) {
            if (result.length > 0) {
                if(result[0].password == password) {
                    userID = result[0].ID;
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
});

function checkUserType(currentUserType, email) {
    var window = remote.getCurrentWindow();
    if (currentUserType == userType.ADMIN) {
        logger.info("User " + email + " logged in as Admin with success", fileName);
        main.openWindow('admin_index');
        window.hide();
        logger.debug("Login window hidden with success", fileName);
    }
    else if (currentUserType == userType.TEACHER) {
        logger.info("User " + email + " logged in as Teacher with success", fileName);
        main.openWindow('teacher_index');
        window.hide();
        logger.debug("Login window hidden with success", fileName);
        sendTeacherID();
    }
}

function sendTeacherID() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/userID',
        data: {
            ID : userID
        },
        success : function(data) {
            $('#train-data-button').attr("disabled", "disabled");
            logger.debug("User ID sent with success", fileName);
        },
        error : function(jqXHR, textStatus, err) {
            logger.error("Failed to send userID. Text status: " + textStatus + " Error is: " + err);
        }
    });
}

addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("login-button").click();
        logger.info("User pressed enter key (13)", fileName);
    }
});
