var $ = jQuery = require('jquery');
var logger = require('../../config/logger').Logger;
var ps = require('python-shell')
var path = require('path')

var fileName = 'src::js::teacher_make_attendace.js';

$('.page-link').click(function() {
    if (this.dataset.page == "make-attendance") {
        getCoursesDropDown();
    }
});

function getCoursesDropDown() {
    var $dropdown = $('#select-course-for-attendance');
    $dropdown.empty();
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/course',
        success: function(data) {
            $dropdown.append('<option disabled selected value>Select course</option>');
            $.each(data, function() {
                $dropdown.append($("<option />").val(this.ID).text("(" + this.ID + ") " + this.courseName))
            })
        }
    });
}

$('#start-attendance-button').click(function() {
    var courseID = $("#select-course-for-attendance").val();
    var week = $("#select-week-for-attendance").val();
    var hour = $("#select-hour-for-attendance").val();

    if (courseID == null) {
        var popup = $("#attendance-course").text("Please select course")[0];
        popup.classList.toggle("show");
        logger.info("User didn't select course name field for attendance" , fileName);
    }
    else if (week == null) {
        var popup = $("#attendance-week").text("Please select week")[0];
        popup.classList.toggle("show");
        logger.info("User didn't select week name field for attendance" , fileName);
    }
    else if (hour == null) {
        var popup = $("#attendance-hour").text("Please select hour")[0];
        popup.classList.toggle("show");
        logger.info("User didn't select hour name field for attendance" , fileName);
    }
    else {
        $("#start-attendance-form").trigger('reset');
        var attendanceData = {
            'courseID' : courseID,
            'week' : week,
            'hour' : hour
        }

        $('#start-attendance-button').attr("disabled", true);

        startAttendance(attendanceData)
    }
});

function startAttendance(attendanceData) {
    $.ajax({
        type: "POST",
        url: 'http://127.0.0.1:5000/attendanceData',
        data: JSON.stringify(attendanceData),
        dataType: 'json'
    }).done(function() {
        logger.debug("Attendance data sent with success", fileName);
    });

    var options = {
        scriptPath: path.join(__dirname, '../controller/'),
        pythonPath: '/usr/local/bin/python3'
    }

    ps.PythonShell.run('recognizer.py', options, function(err, results) {
        if (err)
        {
            throw err;
        }
        $('#start-attendance-button').attr("disabled", false);
    });
}

$('#train-data-button').click(function() {
    var options = {
        scriptPath: path.join(__dirname, '../controller/'),
        pythonPath: '/usr/local/bin/python3'
    }

    ps.PythonShell.run('trainer.py', options, function(err, results) {
        if (err) {
            throw err;
        }
        $('#train-data-button').attr("disabled", false);
    });
});