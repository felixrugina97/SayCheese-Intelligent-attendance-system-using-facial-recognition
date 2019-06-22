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

$('#add-teacher-button').on('click', function() {
    $('.add-teacher-modal').show();
});

$('.add-teacher-modal-button.confirm').click(function(){
    let firstName = $('#teacher-first-name').val();
    let lastName = $("#teacher-last-name").val();
    let university = $("#teacher-select-university :selected").text();
    let email = $("#teacher-email").val();
    let password = $("#teacher-password").val();

    if (firstName == '') {
        let popup = $("#teacher-first-name-popup").text("Please enter first name")[0];
        popup.classList.toggle("show");
        logger.info("Admin didn't fill teacher first name field", fileName);
    }
    else if (lastName == '') {
        let popup = $("#teacher-last-name-popup").text("Please enter last name")[0];
        popup.classList.toggle("show");
        logger.info("Admin didn't fill teacher last name field", fileName);
    }
    else if (university == "Select university") {
        var popup = $("#teacher-university-popup").text("Please select university")[0];
        popup.classList.toggle("show");
        logger.info("Admin didn't select teacher university", fileName);
    }
    else if (email == '') {
        let popup = $("#teacher-email-popup").text("Please enter e-mail")[0];
        popup.classList.toggle("show");
        logger.info("Admin didn't fill teacher e-mail field", fileName);
    }
    else if (password == '') {
        let popup = $("#teacher-password-popup").text("Please enter password")[0];
        popup.classList.toggle("show");
        logger.info("Admin didn't fill teacher password field", fileName);
    }
    else {
        var email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(email_regex.test(email)){
            if(email.indexOf("@e-uvt.ro", email.length - "@e-uvt.ro".length) !== -1){
                sendTeacherData(firstName, lastName, university, email, password);
                $('.add-teacher-modal').hide();
                $('#teacher-first-name').val('');
                $('#teacher-last-name').val('');
                $("#teacher-select-university").prop('selectedIndex', 0);
                $('#teacher-email').val('');
                $('#teacher-password').val('');
                logger.debug("Admin sent teacher data with success to the server", fileName);
            }
            else {
                let popup = $("#teacher-wrong-domain-email-popup").text("Please enter correct domain")[0];
                popup.classList.toggle("show");
                logger.info("Admin didn't fill teacher e-mail field with correct domain", fileName);
            }
        }
        else {
            let popup = $("#teacher-wrong-format-email-popup").text("Please enter correct format")[0];
            popup.classList.toggle("show");
            logger.info("Admin didn't fill teacher e-mail field with correct format", fileName);
        }
    }
});

function sendTeacherData(firstName, lastName, university, email, password) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/addTeacher',
        data: {
            firstName : firstName,
            lastName: lastName,
            university: university,
            email: email,
            password: password
        },
        error : function(jqXHR, textStatus, err) {
            addTeacherErrorSnackbar();
            logger.error("Failed to add teacher. Text status: " + textStatus +
                " Error is: " + err, fileName);
        }
    }).done(function (data) {
        addTeacherSnackbar();
        $("#teachers tbody").empty();
        selectTeachers();
        logger.debug("Admin added with success teacher", fileName);
    });
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

function addTeacherSnackbar() {
    let snackbar = document.getElementById("add-teacher-snackbar");
    snackbar.className = "show";

    setTimeout(function() {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}

function addTeacherErrorSnackbar() {
    let snackbar = document.getElementById("add-error-teacher-snackbar");
    snackbar.className = "show";

    setTimeout(function() {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}

function deleteTeacherSnackbar() {
    let snackbar = document.getElementById("delete-teacher-snackbar");
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

$('.add-teacher-modal-button.cancel').click(function(){
    $('.add-teacher-modal').hide();
    logger.info("Admin left add teacher modal view by clicking cancel button", fileName);
});

$('.add-teacher-modal-header > div.x-button').click(function(){
    $('.add-teacher-modal').hide();
    logger.info("Admin left add teacher modal view by clicking X button", fileName);
});

