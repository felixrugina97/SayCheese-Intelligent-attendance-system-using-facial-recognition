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

app.get('/teachers', function(req, res){
    getTeachers().then(function(response){
        res.json(response);
    });
});

getTeachers = function() {
    let sqlSelectTeachers = 'SELECT Teacher.ID, Teacher.firstName, Teacher.lastName, Teacher.university, ' +
    'User.email FROM Teacher, User WHERE User.ID = Teacher.userID';
    return new Promise(function (resolve, reject){
        connection.query(sqlSelectTeachers, function(err, result, fields) {
            if (!err) {
                resolve(result);
                logger.debug("Teachers selected with success from database", fileName);
            }
            else {
                reject(err);
                logger.error("Failed to select teachers." + " Error is: " + err, fileName);
            }
        })
    });
}

app.post('/addStudent', (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let university = req.body.university;
    let profile = req.body.profile;
    let specialization = req.body.specialization;
    let studyYear = req.body.studyYear;
    let group = req.body.group;
    let subgroup = req.body.subgroup;

    let sqlInsertStudent = 'INSERT INTO Student (firstName, lastName, university, Student.profile, specialization, studyYear, ' +
    'Student.group, subgroup) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sqlInsertStudent, [firstName, lastName, university, profile, specialization, studyYear, group, subgroup], function(err, result) {
        if (err) {
            logger.error("Failed to insert student." + " Error is: " + err, fileName);
            res.status(500).send({error: true});
        }
        res.json({ok: true});
        logger.debug("Student inserted with success in database", fileName);
    })
});

app.post('/deleteStudent', (req, res) => {
    studentID = req.body.studentID;

    let sqlDeleteStudent = 'START TRANSACTION;' +
        'DELETE FROM Student_Courses_Assignment WHERE Student_Courses_Assignment.studentID = ?;' +
        'DELETE FROM Attendance WHERE Attendance.studentID = ?;' +
        'DELETE FROM Student WHERE Student.ID = ?;' +
        'COMMIT;';

    connection.query(sqlDeleteStudent, [studentID, studentID, studentID], function(err, result) {
        if (err) {
            logger.error("Failed to delete student" + " Error is: " + err);
            throw err;
        }
        res.json({ok: true});
        logger.debug("Student deleted with success from database", fileName);
    })
});

app.post('/deleteTeacher', (req, res) => {
    teacherID = req.body.teacherID;
    email = req.body.email;

    let sqlDeleteTeacher = 'START TRANSACTION;' +
        'DELETE FROM Course WHERE Course.teacherID = ?;' +
        'DELETE FROM Teacher WHERE Teacher.ID = ?;' +
        'DELETE FROM User WHERE User.email = ?;' +
        'COMMIT;';

    connection.query(sqlDeleteTeacher, [teacherID, teacherID, email], function(err, result) {
        if (err) {
            logger.error("Failed to delete teacher" + " Error is: " + err);
            throw err;
        }
        res.json({ok: true});
        logger.debug("Teacher deleted with success from database", fileName);
    })
});

app.listen(3000, function() {
    logger.debug("Server is running on port 3000", fileName);
});
