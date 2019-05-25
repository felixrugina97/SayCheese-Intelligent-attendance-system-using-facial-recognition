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
    let sqlSelectCourses = 'SELECT * FROM Course WHERE teacherID = ? ORDER BY ID, courseName';
    return new Promise(function (resolve, reject){
        connection.query(sqlSelectCourses, [teacherID], function(err, result, fields) {
            if (!err) {
                resolve(result);
                logger.debug("Courses selected with success from database", fileName);
            }
            else {
                reject(err);
                logger.error("Failed to select courses." + " Error is: " + err, fileName);
            }
        })
    });
}

var assignedCourseID;
app.post('/getAssignedCourseID', (req, res) => {
    assignedCourseID = req.body.assignedCourseID;
    res.json({ok: true});
    logger.debug("Course ID to get assigned courses received with success", fileName);
});

app.get('/getAssignedCourses', function(req, res){
    getAssignedCourses().then(function(response){
        res.json(response);
    });
});

getAssignedCourses = function() {
    let sqlGetAssignedCourses = 'SELECT DISTINCT Student.profile, Student.specialization, Student.studyYear, ' +
        'Student.group, Student.subgroup FROM Student_Courses_Assignment ' +
        'JOIN Student ON Student_Courses_Assignment.studentID = Student.ID ' +
        'JOIN Course ON Student_Courses_Assignment.courseID = Course.ID WHERE Course.ID = ?;';
    return new Promise(function (resolve, reject){
        connection.query(sqlGetAssignedCourses, [assignedCourseID], function(err, result, fields) {
            if (!err) {
                resolve(result);
                logger.debug("Courses for a selected with success from database", fileName);
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
    courseID = req.body.courseID;

    let sqlDeleteCourseAndAttendance = 'START TRANSACTION;' +
        'DELETE FROM Student_Courses_Assignment WHERE Student_Courses_Assignment.CourseID = ?;' +
        'DELETE FROM Attendance WHERE Attendance.courseID = ?;' +
        'DELETE FROM Course WHERE Course.ID = ?;' +
        'COMMIT;';

    connection.query(sqlDeleteCourseAndAttendance, [courseID, courseID, courseID], function(err, result) {
        if (err)
        {
            logger.error("Failed to delete course and attendances" + " Error is: " + err);
            throw err;
        }
        res.json({ok: true});
        logger.debug("Course and attendances deleted with success from database", fileName);
    })
});

app.post('/assignStudentsToCourse', (req, res) => {
    let specialization = req.body.specialization;
    let studyYear = req.body.studyYear;
    let group = req.body.group;
    let subgroup = req.body.subgroup;
    let courseID = req.body.assignedCourseID;

    let sqlSelectStudentID = 'SELECT Student.ID FROM Student WHERE Student.specialization = ?' +
    'AND Student.studyYear = ? AND Student.group = ? AND Student.subgroup = ?;'

    connection.query(sqlSelectStudentID, [specialization, studyYear, group, subgroup], function(err, result) {
        if (err) {
            logger.error("Failed to select students for assigment" + " Error is: " + err);
            throw err;
        }
        logger.debug("Students selected with success from database for assigment", fileName);
        if (result && result.length > 0) {
            var sqlAssignStudentsToCourse = 'INSERT IGNORE INTO Student_Courses_Assignment (courseID, studentID) VALUES ?;'
            var values = [];
            for (var i = 0; i < result.length; i++) {
                values.push([courseID, result[i].ID]);
            }
            connection.query(sqlAssignStudentsToCourse, [values], function(err, result) {
                if (err) {
                    logger.error("Failed to assign students to course" + " Error is: " + err);
                    throw err;
                }
                res.json({ok: true});
                logger.debug("Students assigned with success to course", fileName);
            });
        }
        else {
            logger.debug("No students found for this query on assigment", fileName);
        }
    });
});

app.post('/deleteAssignedCourse', (req, res) => {
    let profile = req.body.deleteAssignedCourseProfile;
    let specialization = req.body.deleteAssignedCourseSpecialization;
    let studyYear = req.body.deleteAssignedCourseStudyYear;
    let group = req.body.deleteAssignedCourseGroup;
    let subgroup = req.body.deleteAssignedCourseSubgroup;
    let courseID = req.body.assignedCourseID;

    let sqlAssignedDeleteCourseAndAttendance =  'START TRANSACTION;' +
    'DELETE Student_Courses_Assignment FROM Student_Courses_Assignment ' +
    'JOIN Student ON Student_Courses_Assignment.studentID = Student.ID ' +
    'JOIN Course ON Student_Courses_Assignment.courseID = Course.ID ' +
    'WHERE Student.profile = ? AND Student.specialization = ? AND Student.studyYear = ? ' +
    'AND Student.group = ? AND Student.subgroup = ?;' +
    'DELETE FROM Attendance WHERE Attendance.courseID = ?;' +
    'COMMIT;'

    connection.query(sqlAssignedDeleteCourseAndAttendance, [profile, specialization, studyYear, group, subgroup, courseID], function(err, result) {
        if (err) {
            logger.error("Failed to delete assigned course and attendances" + " Error is: " + err);
            throw err;
        }
        res.json({ok: true});
        logger.debug("Assigned course and attendances deleted with success from database", fileName);
    })
});

app.listen(3000, function() {
    logger.debug("Server is running on port 3000", fileName);
});

