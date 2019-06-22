var $ = jQuery = require('jquery');

var logger = require('../../config/logger').Logger;

var fileName = 'src::js::admin_manage_courses.js';

$(function() {
    selectTeachers();
});

function selectTeachers() {
    var $studentTable = $('#teachers tbody');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/teachers',
        success: function(data) {
            $.each(data, function(i, data) {
                $studentTable.append(
                    '<tr>' +
                        '<td>' + data.ID + '</td>' +
                        '<td>' + data.firstName + " " + data.lastName + '</td>' +
                        '<td>' + data.university + '</td>' +
                        '<td>' + data.email + '</td>' +
                        '<td class="student-table-controls">' +
                            '<i class="far fa-trash-alt" id="delete-teacher"></i>' +
                        '</td>' +
                    '<tr>'
                )
            });
        }
    });
    logger.debug("Table with students created with success", fileName);
}

var deleteTeacherID = null;
var deleteEmailTeacher = null;
$('#teachers tbody').on('click', '#delete-teacher', function() {
    var currentRow = $(this).closest('tr');
    deleteTeacherID = currentRow.find('td:eq(0)').text();
    deleteEmailTeacher = currentRow.find('td:eq(3)').text();
    var deleteTeacherName = currentRow.find('td:eq(1)').text();

    $('#confirm-delete-teacher-text').empty();
    $('#confirm-delete-teacher-text').append("Are you sure you want to " +
        "<span style=\"color:#E74C3C\"><strong>REMOVE</strong></span> <strong>" +
        deleteTeacherName + "</strong> teacher?" +
        "<br><br><span style=\"color:#f1c40f\"><strong>WARNING</strong></span><br>" +
        "This will remove all data about him!");

    $('.confirm-delete-teacher-modal').show();
});

$('.confirm-delete-teacher-modal-button.confirm').click(function() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/deleteTeacher',
        data: {
            teacherID : deleteTeacherID,
            email : deleteEmailTeacher
        },
        success : function(data) {
            $("#teachers tbody").empty();
            selectTeachers();
            deleteTeacherSnackbar();
            logger.debug("Admin deleted with success teacher", fileName);
        },
        error : function(jqXHR, textStatus, err) {
            logger.error("Failed to delete teacher. Text status: " + textStatus +
                " Error is: " + err);
        }
    });
    $('.confirm-delete-teacher-modal').hide();
});

function searchTeacher() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search-teachers");
    filter = input.value.toUpperCase();
    table = document.getElementById("teachers");
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

function deleteTeacherSnackbar() {
    let snackbar = document.getElementById("delete-student-snackbar");
    snackbar.className = "show";

    setTimeout(function() {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}

$('.confirm-delete-teacher-modal-button.cancel').click(function(){
    $('.confirm-delete-teacher-modal').hide();
    logger.info("Admin left delete teacher modal view by clicking cancel button", fileName);
});

$('.confirm-delete-teacher-modal-header > div.x-button').click(function(){
    $('.confirm-delete-teacher-modal').hide();
    logger.info("Admin left delete teacher modal view by clicking X button", fileName);
});
