var express = require('express');
var bodyParser = require('body-parser');

var connection = require('../../config/connection');
var logger = require('../../config/logger').Logger;

var fileName = 'src::js::teacher_server.js';

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

var teacherID;

app.post('/userID', (req, res) => {
    teacherID = req.body.ID;
    res.json({ok: true});
    logger.debug("Teacher ID received with success", fileName);
});

app.get('/course', function(req, res){
    getCourses().then(function(response){
        res.json(response);
    });
});

getCourses = function() {
    let sql = 'SELECT * FROM Course WHERE teacherID = ? ORDER BY ID, courseName';
    return new Promise(function (resolve, reject){
        connection.query(sql, [teacherID], function(err, result, fields) {
            if (!err) {
                resolve(result);
                logger.debug("Courses selected with success from database", fileName);
            }
            else {
                reject(err);
                logger.error("Failed to select courses." + " Error is: " + err);
            }
        })
    });
}

app.post('/createCourse', (req, res) => {
    courseID = req.body.ID;
    courseName = req.body.courseName;
    courseType = req.body.courseType;
    let sql = 'INSERT INTO Course (ID, teacherID, courseName, courseType) VALUES (?, ?, ?, ?)';
    connection.query(sql, [courseID, teacherID, courseName, courseType], function(err, result) {
        if (err)
        {
            logger.error("Failed to insert course." + " Error is: " + err);
            throw err;
        }
        res.json({ok: true});
        logger.debug("Course inserted with success in database", fileName);
    })
});

app.post('/deleteCourse', (req, res) => {
    courseID= req.body.courseID;

    let sqlDeleteCourseAndAttendance = 'START TRANSACTION; DELETE FROM Course WHERE ID = ?; DELETE FROM Attendance WHERE courseID = ?; COMMIT;';

    connection.query(sqlDeleteCourseAndAttendance, [courseID, courseID], function(err, result) {
        if (err)
        {
            logger.error("Failed to delete course and attendances" + " Error is: " + err);
            throw err;
        }
        res.json({ok: true});
        logger.debug("Course and attendances deleted with success from database", fileName);
    })
});

app.listen(3000, function() {
    logger.debug("Server is running on port 3000", fileName);
});

