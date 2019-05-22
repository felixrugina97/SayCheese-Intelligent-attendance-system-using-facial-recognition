var $ = jQuery = require('jquery');
var logger = require('../../config/logger').Logger;

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

    var attendanceData = {
        'courseID' : courseID,
        'week' : week,
        'hour' : hour
    }

    $.ajax({
        type: "POST",
        url: 'http://127.0.0.1:5000/attendanceData',
        data: JSON.stringify(attendanceData),
        dataType: 'json'
    }).done(function() {
        logger.debug("Attendance data sent with success", fileName);
    });
});