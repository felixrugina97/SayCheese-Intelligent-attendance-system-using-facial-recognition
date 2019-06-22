var $ = jQuery = require('jquery');
var {app, dialog} = require('electron').remote;
var fs = require('fs');

var logger = require('../../config/logger').Logger;

var fileName = 'src::js::admin_manage_courses.js';

$(function() {
    selectStudents();
});

function selectStudents() {
    var $studentTable = $('#students tbody');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/students',
        success: function(data) {
            $.each(data, function(i, data) {
                $studentTable.append(
                    '<tr>' +
                        '<td>' + data.ID + '</td>' +
                        '<td>' + data.firstName + " " + data.lastName + '</td>' +
                        '<td>' + data.university + '</td>' +
                        '<td>' + data.profile + '</td>' +
                        '<td>' + data.specialization + '</td>' +
                        '<td>' + data.studyYear + '</td>' +
                        '<td>' + data.group + '</td>' +
                        '<td>' + data.subgroup + '</td>' +
                        '<td class="student-table-controls">' +
                            '<i class="fas fa-file-upload" id="upload-photo"></i>' +
                            '<i class="far fa-trash-alt" id="delete-student"></i>' +
                        '</td>' +
                    '<tr>'
                )
            });
        }
    });
    logger.debug("Table with students created with success", fileName);
}

$('#students tbody').on('click', '#upload-photo', function() {
    let currentRow = $(this).closest('tr');
    let studentID = currentRow.find('td:eq(0)').text();

    const filePath = dialog.showOpenDialog({ properties: ['openFile']})[0];
    const projectPath = app.getAppPath();

    fs.copyFile(filePath, projectPath + '/data/data_set/' + studentID + '.jpg', err => {
        if (err)
            logger.error("Failed to copy student photo with ID " + studentID +
                " Error is: " + err, fileName);
    });
});

$('#add-student-button').on('click', function() {
    $('.add-student-modal').show();
});

function searchStudents() {
    var input, filter, table, tr, td, i, txtValue;

    input = document.getElementById("search-students");
    filter = input.value.toUpperCase();
    table = document.getElementById("students");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
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

$('.add-student-modal-button.confirm').click(function(){
    let firstName = $('#student-first-name').val();
    let lastName = $("#student-last-name").val();
    let university = $("#select-university :selected").text();
    let profile = $("#select-profile :selected").text();
    let specialization = $("#select-specialization :selected").text();
    let studyYear = $("#select-study-year").val();
    let group = $("#select-group").val();
    let subgroup = $("#select-subgroup").val();

    if (firstName == '') {
        let popup = $("#first-name-popup").text("Please enter first name")[0];
        popup.classList.toggle("show");
        logger.info("Admin didn't fill student first name field" , fileName);
    }
    else if (lastName == '') {
        let popup = $("#last-name-popup").text("Please enter last name")[0];
        popup.classList.toggle("show");
        logger.info("Admin didn't fill student last name field" , fileName);
    }
    else if (university == null) {
        var popup = $("#university-popup").text("Please select university type")[0];
        popup.classList.toggle("show");
        logger.info("Admin didn't select university" , fileName);
    }
    else if (profile == null) {
        var popup = $("#profile-popup").text("Please select profile type")[0];
        popup.classList.toggle("show");
        logger.info("Admin didn't select profile" , fileName);
    }
    else if (specialization == null) {
        var popup = $("#specialization-popup").text("Please select specialization type")[0];
        popup.classList.toggle("show");
        logger.info("Admin didn't select specialization" , fileName);
    }
    else if (studyYear == null) {
        var popup = $("#study-year-popup").text("Please select study year")[0];
        popup.classList.toggle("show");
        logger.info("Admin didn't select study year" , fileName);
    }
    else if (group == null) {
        var popup = $("#group-popup").text("Please select group")[0];
        popup.classList.toggle("show");
        logger.info("Admin didn't select group" , fileName);
    }
    else if (subgroup == null) {
        var popup = $("#subgroup-popup").text("Please select subgroup")[0];
        popup.classList.toggle("show");
        logger.info("Admin didn't select subgroup" , fileName);
    }
    else {
        sendStudentData(firstName, lastName, university, profile, specialization, studyYear, group, subgroup);
        $('.add-student-modal').hide();
        $('#student-first-name').val('');
        $('#student-last-name').val('');
        $("#select-university").prop('selectedIndex', 0);
        $("#select-profile").prop('selectedIndex', 0);
        $("#select-specialization").prop('selectedIndex', 0);
        $("#select-study-year").prop('selectedIndex', 0);
        $("#select-group").prop('selectedIndex', 0);
        $("#select-subgroup").prop('selectedIndex', 0);
        logger.debug("Admin sent student data with success to the server", fileName);
    }
});

function sendStudentData(firstName, lastName, university, profile, specialization, studyYear, group, subgroup) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/addStudent',
        data: {
            firstName : firstName,
            lastName: lastName,
            university: university,
            profile: profile,
            specialization: specialization,
            studyYear: studyYear,
            group: group,
            subgroup: subgroup
        },
        error : function(jqXHR, textStatus, err) {
            logger.error("Failed to add student. Text status: " + textStatus +
                " Error is: " + err, fileName);
        }
    }).done(function (data) {
        addStudentSnackbar();
        $("#students tbody").empty();
        selectStudents();
        logger.debug("Admin added with success student", fileName);
    });
}

var deleteStudentID = null;
$('#students tbody').on('click', '#delete-student', function() {
    var currentRow = $(this).closest('tr');
    deleteStudentID = currentRow.find('td:eq(0)').text();
    var deleteStudentName = currentRow.find('td:eq(1)').text();

    $('#confirm-delete-student-text').empty();
    $('#confirm-delete-student-text').append("Are you sure you want to " +
        "<span style=\"color:#E74C3C\"><strong>REMOVE</strong></span> <strong>" +
        deleteStudentName + "</strong> student?" +
        "<br><br><span style=\"color:#f1c40f\"><strong>WARNING</strong></span><br> This will remove all data about him!");

    $('.confirm-delete-student-modal').show();
});

$('.confirm-delete-student-modal-button.confirm').click(function() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/deleteStudent',
        data: {
            studentID : deleteStudentID
        },
        success : function(data) {
            $("#students tbody").empty();
            selectStudents();
            deleteStudentSnackbar();
            logger.debug("Admin deleted with success student", fileName);
        },
        error : function(jqXHR, textStatus, err) {
            logger.error("Failed to delete student. Text status: " + textStatus + " Error is: " + err);
        }
    });
    $('.confirm-delete-student-modal').hide();
});

function addStudentSnackbar() {
    let snackbar = document.getElementById("add-student-snackbar");
    snackbar.className = "show";

    setTimeout(function() {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}

function deleteStudentSnackbar() {
    let snackbar = document.getElementById("delete-student-snackbar");
    snackbar.className = "show";

    setTimeout(function() {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}

$('.add-student-modal-button.cancel').click(function(){
    $('.add-student-modal').hide();
    logger.info("Admin left add student modal view by clicking cancel button", fileName);
});

$('.add-student-modal-header > div.x-button').click(function(){
    $('.add-student-modal').hide();
    logger.info("Admin left add student modal view by clicking X button", fileName);
});

$('.confirm-delete-student-modal-button.cancel').click(function(){
    $('.confirm-delete-student-modal').hide();
    logger.info("Admin left delete student modal view by clicking cancel button", fileName);
});

$('.confirm-delete-student-modal-header > div.x-button').click(function(){
    $('.confirm-delete-student-modal').hide();
    logger.info("Admin left delete student modal view by clicking X button", fileName);
});
