var express = require('express');
var bodyParser = require('body-parser');

var connection = require('../../config/connection');
var logger = require('../../config/logger').Logger;

var fileName = 'src::js::admin_server.js';

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.get('/students', function(req, res){
    getStudents().then(function(response){
        res.json(response);
    });
});

getStudents = function() {
    let sqlSelectStudents = 'SELECT * FROM Student';
    return new Promise(function (resolve, reject){
        connection.query(sqlSelectStudents, function(err, result, fields) {
            if (!err) {
                resolve(result);
                logger.debug("Students selected with success from database", fileName);
            }
            else {
                reject(err);
                logger.error("Failed to select students." + " Error is: " + err, fileName);
            }
        })
    });
}

app.listen(3000, function() {
    logger.debug("Server is running on port 3000", fileName);
});
