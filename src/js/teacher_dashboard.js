var $ = jQuery = require('jquery');
var {dialog} = require('electron').remote;
var path = require('path');
var ps = require('python-shell');
var XLSX = require('xlsx');

var fileName = 'src::js::teacher_dashboard.js';

$(function() {
    selectStudents();
});

$('#dashboard').click(function() {
    selectStudents();
});

function selectStudents() {
    $("#student-attendance-table tbody").empty();
    let $studentAttendance = $('#student-attendance-table tbody');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/getStudents',
        success: function(data) {
            $.each(data, function(i, data) {
                var courseType;
                if (data.courseType == 0) {
                    courseType = "Weekly";
                }
                else if (data.courseType == 1) {
                    courseType = "Biweekly";
                }

                $studentAttendance.append(
                    '<tr>' +
                        '<td>' + data.firstName + " " + data.lastName + '</td>' +
                        '<td>' + data.specialization + '</td>' +
                        '<td>' + data.studyYear + '</td>' +
                        '<td>' + data.group + '</td>' +
                        '<td>' + data.subgroup + '</td>' +
                        '<td>' + data.courseName + '</td>' +
                        '<td>' + courseType + '</td>' +
                        '<td>' + data.week01 + '</td>' + '<td>' + data.week02 + '</td>' +
                        '<td>' + data.week03 + '</td>' + '<td>' + data.week04 + '</td>' +
                        '<td>' + data.week05 + '</td>' + '<td>' + data.week06 + '</td>' +
                        '<td>' + data.week07 + '</td>' + '<td>' + data.week08 + '</td>' +
                        '<td>' + data.week09 + '</td>' + '<td>' + data.week10 + '</td>' +
                        '<td>' + data.week11 + '</td>' + '<td>' + data.week12 + '</td>' +
                        '<td>' + data.week13 + '</td>' + '<td>' + data.week14 + '</td>' +
                        '<td>' + '</td>' +
                '<tr>'
                );
            });

            let table = document.getElementById("student-attendance-table");

            let currentRow = 1;
            let totalAttendance = 14
            while(row = table.rows[currentRow++]) {
                var currentCell = 7;
                var numberOfAttendances = 0;

                while(cell = row.cells[currentCell++]) {
                    if (cell.innerHTML == '-') {
                        numberOfAttendances++;
                    }
                    if (currentCell == 22) {
                        cell.innerHTML = totalAttendance - numberOfAttendances;
                    }
                }
            }
        }
    });
    logger.debug("Table with students attendance created with success", fileName);
}

$('#excel-raport-button').click(function() {
    var wb = XLSX.utils.table_to_book(document.getElementById('student-attendance-table'),
        {sheet: 'Sheet JS'});

    var XTENSION = "xls|xlsx|xlsm|xlsb|xml|csv|txt|dif|sylk|slk|prn|ods|fods|htm|html".split("|");

    const filePath = dialog.showSaveDialog({
        title: 'Save file as',
			filters: [{
				name: "Spreadsheets",
				extensions: XTENSION
			}]
    });

	XLSX.writeFile(wb, filePath);
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
                $dropdown.append($("<option />").val(this.ID).text("(" + this.ID + ") " +
                    this.courseName));
            });
        }
    });
}

$('#start-attendance-button').click(function() {
    getCoursesDropDown();
    $('.start-attendance-modal').show();
});

var courseIDAttendance = null;
var weekAttendance = null;
var hourAttendance = null;
$('.start-attendance-modal-button.confirm').click(function() {
    courseIDAttendance = $("#select-course-for-attendance").val();
    weekAttendance = $("#select-week-for-attendance").val();
    hourAttendance = $("#select-hour-for-attendance").val();

    if (courseIDAttendance == null) {
        var popup = $("#attendance-course").text("Please select course")[0];
        popup.classList.toggle("show");
        logger.info("User didn't select course name field for attendance" , fileName);
    }
    else if (weekAttendance == null) {
        var popup = $("#attendance-week").text("Please select week")[0];
        popup.classList.toggle("show");
        logger.info("User didn't select week name field for attendance" , fileName);
    }
    else if (hourAttendance == null) {
        var popup = $("#attendance-hour").text("Please select hour")[0];
        popup.classList.toggle("show");
        logger.info("User didn't select hour name field for attendance" , fileName);
    }
    else {
        $('#start-attendance-button').attr("disabled", "disabled");
        $('#train-data-button').attr("disabled", "disabled");
        $("#select-week-for-attendance").prop('selectedIndex', 0);
        $("#select-hour-for-attendance").prop('selectedIndex', 0);

        attendanceStartedSnackbar();
        $('.start-attendance-modal').hide();

        var attendanceData = {
            'courseID' : courseIDAttendance,
            'week' : weekAttendance,
            'hour' : hourAttendance
        }

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
            if (err) {
                logger.error("Attendance failed. Error is: " + err, fileName);
            }
            attendanceFinishedSnackbar();
            selectStudents();
            logger.debug("Attendance finished with success", fileName);
            $('#start-attendance-button').removeAttr("disabled");
            $('#train-data-button').removeAttr("disabled");
        });
    }
});

function attendanceFinishedSnackbar() {
    let snackbar = document.getElementById("attendance-snackbar");
    snackbar.className = "show";

    setTimeout(function() {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}

function attendanceStartedSnackbar() {
    let snackbar = document.getElementById("attendance-started-snackbar");
    snackbar.className = "show";

    setTimeout(function() {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}

function searchStudents() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search-students");
    filter = input.value.toUpperCase();
    table = document.getElementById("student-attendance-table");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            }
            else {
                tr[i].style.display = "none";
            }
        }
    }
}

$('#train-data-button').click(function() {
    $('#confirm-start-train-text').empty();
    $('#confirm-start-train-text').append("Are you sure you want to " +
        "start to train data? <strong>This may take a wile!<strong>" +
        "<br><br><span style=\"color:#f1c40f\"><strong>WARNING</strong></span><br>" +
        "You will not be able to start attendance until training data is finished!");

    $('.confirm-start-train-modal').show();
});

$('.confirm-start-train-modal-button.confirm').click(function() {
    $('.confirm-start-train-modal').hide();
    $('#start-attendance-button').attr("disabled", "disabled");
    $('#train-data-button').attr("disabled", "disabled");

    var options = {
        scriptPath: path.join(__dirname, '../controller/'),
        pythonPath: '/usr/local/bin/python3'
    }

    trainingDataStart();
    logger.debug("Training data started", fileName);

    ps.PythonShell.run('data_trainer.py', options, function(err, results) {
        if (err) {
            logger.error("Training data failed. Error is: " + err, fileName);
        }
        logger.debug("Training data succeeded", fileName);
        trainingDataFinished();
        $('#start-attendance-button').removeAttr("disabled");
        $('#train-data-button').removeAttr("disabled");
    });
});

function trainingDataStart() {
    let snackbar = document.getElementById("training-started-snackbar");
    snackbar.className = "show";

    setTimeout(function() {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}

function trainingDataFinished() {
    let snackbar = document.getElementById("training-data-snackbar");
    snackbar.className = "show";

    setTimeout(function() {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}

$('.start-attendance-modal-button.cancel').click(function(){
    $('.start-attendance-modal').hide();
    logger.info("User left start attendance modal view by clicking cancel button", fileName);
});

$('.start-attendance-modal-header > div.x-button').click(function(){
    $('.start-attendance-modal').hide();
    logger.info("User left start attendance modal view by clicking X button", fileName);
});

$('.confirm-start-train-modal-button.cancel').click(function(){
    $('.confirm-start-train-modal').hide();
    logger.info("User left start training modal view by clicking cancel button", fileName);
});

$('.confirm-start-train-modal-header > div.x-button').click(function(){
    $('.confirm-start-train-modal').hide();
    logger.info("User left start training modal view by clicking X button", fileName);
});
