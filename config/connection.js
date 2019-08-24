const mysql = require('mysql');
const env = require('custom-env').env(true);

var logger = require('./logger').Logger;

var fileName = 'config::connection.js';

var connection = mysql.createConnection({
	host     : process.env.DB_HOST,
	user     : process.env.DB_USER,
	password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    port     : process.env.DB_PORT,
    multipleStatements : process.env.DB_MULTIPLE_STATEMANTS
});

connection.connect((err) => {
    if (err) {
        logger.error("Connection with database failed", fileName);
        throw err;
    }
    
    logger.info("Connection with database succeeded", fileName);
});

module.exports = connection;
