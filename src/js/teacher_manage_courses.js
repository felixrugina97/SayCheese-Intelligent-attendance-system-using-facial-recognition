var $ = jQuery = require('jquery');
var logger = require('../../config/logger').Logger;

var fileName = 'src::js::teacher_manage_courses.js';

$(function() {
    selectCourses();
})

function selectCourses() {
    var $courseTable = $('#courses tbody');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/course',
        success: function(data) {
            console.log(data);
            $.each(data, function(i, data) {
                var courseType;
                if (data.courseType == 0) {
                    courseType = "Weekly";
                }
                else if (data.courseType == 1) {
                    courseType = "Biweekly"
                }

                $courseTable.append(
                    '<tr>' +
                        '<td name="ID">' + data.ID + '</td>' +
                        '<td>' + data.courseName + '</td>' +
                        '<td>' + courseType + '</td>' +
                        '<td class="course-table-controls">' +
                            '<i class="far fa-edit" id="edit-course"></i>' +
                            '<i class="far fa-trash-alt" id="delete-course"></i>' +
                        '</td>' +
                    '<tr>'
                )
            });
        }
    });
    logger.debug("Table with courses created with success", fileName);
}

$('.add-course-modal-button.confirm').click(function(){
    var courseName = $('#course-name').val();
    var courseType = $("#select-course-type").val();

    if (courseName == '') {
        var popup = $("#name-popup").text("Please enter course name")[0];
        popup.classList.toggle("show");
        logger.info("User didn't fill course name field" , fileName);
    }
    else if (courseType == null) {
        var popup = $("#type-popup").text("Please select course type")[0];
        popup.classList.toggle("show");
        logger.info("User didn't select course type" , fileName);
    }
    else {
        sendCourseData(courseName, courseType);
        $('.add-course-modal').hide();
        $('#course-name').val('');
        $("#select-course-type").prop('selectedIndex', 0);
        logger.debug("User sent course data with success to the server", fileName);
    }
});

function sendCourseData(courseName, courseType) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/createCourse',
        data: {
            courseName : courseName,
            courseType: courseType
        },
        success : function(data) {
            $("#courses tbody").empty();
            selectCourses();
            logger.debug("Teacher created with success course", fileName);
        },
        error : function(jqXHR, textStatus, err) {
            logger.error("Failed to create course. Text status: " + textStatus + " Error is: " + err);
        }
    });
}

var deleteCourseID = null;
$('#courses tbody').on('click', '#delete-course', function() {
    var currentRow = $(this).closest('tr');
    deleteCourseID = currentRow.find('td:eq(0)').text();
    var deletCourseName = currentRow.find('td:eq(1)').text();

    $('#confirm-delete-course-text').empty();
    $('#confirm-delete-course-text').append("Are you sure you want to " +
        "<span style=\"color:#E74C3C\"><strong>DELETE</strong></span> <strong>" +
        deletCourseName + "</strong> course?" +
        "<br><br><span style=\"color:#f1c40f\"><strong>WARNING</strong></span><br> This also will remove attendances!");

    $('.confirm-delete-course-modal').show();
})

var assignedCourseID = null
$('#courses tbody').on('click', '#edit-course', function() {
    var currentRow = $(this).closest('tr');
    assignedCourseID = currentRow.find('td:eq(0)').text();
    var courseName = currentRow.find('td:eq(1)').text();

    $(".edit-course-page.header-view-courses-page h1").empty();
    $(".edit-course-page.header-view-courses-page h1").append("Course: " + courseName);

    $("#assigned-course-table tbody").empty();
    sendAssignedCourseID(assignedCourseID);
    selectAndFillAssignedCourseTable();

    $('.edit-course-modal').show();
    $('.edit-course-page.header-view-courses-page').show();
})

$('.header-page-link').click(function() {
    const pageToShow = this.dataset.page;

    $('.edit-course-page').hide();
    $('.' + pageToShow + '-page').show();

    logger.info("User enter on " + this.dataset.page + " page", fileName);
});

function sendAssignedCourseID(assignedCourseID) {
    console.log(assignedCourseID)
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/getAssignedCourseID',
        data: {assignedCourseID : assignedCourseID},
        success : function(data) {
            logger.debug("Course ID to get assigned courses sent with success", fileName);
        },
        error : function(jqXHR, textStatus, err) {
            logger.error("Failed to send course ID to get assigned courses. Text status: " + textStatus + " Error is: " + err);
        }
    });
}

function selectAndFillAssignedCourseTable() {
    var $assignedCourseTable = $('#assigned-course-table tbody');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/getAssignedCourses',
        success: function(data) {
            $.each(data, function(i, data) {
                $assignedCourseTable.append(
                    '<tr>' +
                        '<td>' + data.profile + '</td>' +
                        '<td>' + data.specialization + '</td>' +
                        '<td>' + data.studyYear + '</td>' +
                        '<td>' + data.group + '</td>' +
                        '<td>' + data.subgroup + '</td>' +
                        '<td class="course-table-controls">' +
                            '<i class="far fa-trash-alt" id="assigned-delete-course"></i>' +
                        '</td>' +
                    '<tr>'
                )
            });
        }
    });
    logger.debug("Table with assigned courses created with success", fileName);
}

var specialization = null;
var studyYear = null;
var group = null;
var subgroup = null;
$('.edit-course-modal-button.confirm').click(function(){
    specialization = $('#select-specialization-for-assigment').children("option:selected").text();;
    studyYear = $("#select-study-year-for-assigment").val();
    group = $("#select-group-for-assigment").val();
    subgroup = $("#select-subgroup-for-assigment").val();

    if (specialization == "Select specialization") {
        var popup = $("#assign-specialization").text("Please select specialization")[0];
        popup.classList.toggle("show");
        popup.classList.toggle("hide");
        logger.info("User didn't select specialization" , fileName);
    }
    else if (studyYear == null) {
        var popup = $("#assign-study-year").text("Please select study year")[0];
        popup.classList.toggle("show");
        logger.info("User didn't select study year" , fileName);
    }
    else if (group == null) {
        var popup = $("#assign-group").text("Please select group")[0];
        popup.classList.toggle("show");
        logger.info("User didn't select group" , fileName);
    }
    else if (subgroup == null) {
        var popup = $("#assign-subgroup").text("Please select subgroup")[0];
        popup.classList.toggle("show");
        logger.info("User didn't select subgroup" , fileName);
    }
    else {
        $('#confirm-assign-student-text').empty();
        $('#confirm-assign-student-text').append("Are you sure you want ASSIGN students from <br>" +
            specialization + "<br> Study year: " + studyYear + "<br> Group: " + group + "<br> Subgroup: " + subgroup +
            " to this course?"
        );
        $('.confirm-assign-student-modal').show();
    }
});

$('.confirm-assign-student-modal-button.confirm').click(function() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/assignStudentsToCourse',
        data: {
            assignedCourseID : assignedCourseID,
            specialization : specialization,
            studyYear : studyYear,
            group : group,
            subgroup : subgroup,
        },
        success : function(data) {
            $("#assigned-course-table tbody").empty();
            selectAndFillAssignedCourseTable()
            logger.debug("Teacher deleted with success assigned course", fileName);
        },
        error : function(jqXHR, textStatus, err) {
            logger.error("Failed to delete assigned course. Text status: " + textStatus + " Error is: " + err);
        }
    });
    $('.confirm-assign-student-modal').hide();
    $('#select-specialization-for-assigment').prop('selectedIndex', 0);
    $("#select-study-year-for-assigment").prop('selectedIndex', 0);
    $("#select-group-for-assigment").prop('selectedIndex', 0);
    $("#select-subgroup-for-assigment").prop('selectedIndex', 0);
    logger.debug("User sent assign data with success to the server", fileName);
});

$('.confirm-delete-course-modal-button.confirm').click(function() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/deleteCourse',
        data: {
            courseID : deleteCourseID
        },
        success : function(data) {
            $("#courses tbody").empty();
            selectCourses();
            logger.debug("Teacher deleted with success course", fileName);
        },
        error : function(jqXHR, textStatus, err) {
            logger.error("Failed to delete course. Text status: " + textStatus + " Error is: " + err);
        }
    });
    $('.confirm-delete-course-modal').hide();
});

var deleteAssignedCourseProfile = null;
var deleteAssignedCourseSpecialization = null;
var deleteAssignedCourseStudyYear = null;
var deleteAssignedCourseGroup = null;
var deleteAssignedCourseSubgroup = null;
$('#assigned-course-table tbody').on('click', '#assigned-delete-course', function() {
    var currentRow = $(this).closest('tr');
    deleteAssignedCourseProfile = currentRow.find('td:eq(0)').text();
    deleteAssignedCourseSpecialization = currentRow.find('td:eq(1)').text();
    deleteAssignedCourseStudyYear = currentRow.find('td:eq(2)').text();
    deleteAssignedCourseGroup = currentRow.find('td:eq(3)').text();
    deleteAssignedCourseSubgroup = currentRow.find('td:eq(4)').text();

    $('#confirm-delete-assigned-course-text').empty();
    $('#confirm-delete-assigned-course-text').append("Are you sure you want to " +
        "<span style=\"color:#E74C3C\"><strong>UNASSIGNE</strong></span> <strong>" +
        deleteAssignedCourseProfile + ", " + deleteAssignedCourseSpecialization + ", Year " +
        deleteAssignedCourseStudyYear + ", Group " + deleteAssignedCourseGroup + ", Subgroup " +
        + deleteAssignedCourseSubgroup + "</strong> from course?" +
        "<br><br><span style=\"color:#f1c40f\"><strong>WARNING</strong></span><br> This also will remove attendances!");

    $('.delete-assigned-course-modal').show();
});

$('.delete-assigned-course-modal-button.confirm').click(function() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/deleteAssignedCourse',
        data: {
            assignedCourseID : assignedCourseID,
            deleteAssignedCourseProfile : deleteAssignedCourseProfile,
            deleteAssignedCourseSpecialization : deleteAssignedCourseSpecialization,
            deleteAssignedCourseStudyYear : deleteAssignedCourseStudyYear,
            deleteAssignedCourseGroup : deleteAssignedCourseGroup,
            deleteAssignedCourseSubgroup : deleteAssignedCourseSubgroup
        },
        success : function(data) {
            $("#assigned-course-table tbody").empty();
            selectAndFillAssignedCourseTable()
            logger.debug("Teacher deleted with success assigned course", fileName);
        },
        error : function(jqXHR, textStatus, err) {
            logger.error("Failed to delete assigned course. Text status: " + textStatus + " Error is: " + err);
        }
    });
    $('.delete-assigned-course-modal').hide();
});

function searchCourse() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search-courses");
    filter = input.value.toUpperCase();
    table = document.getElementById("courses");
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

function searchAssigned() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search-assigned");
    filter = input.value.toUpperCase();
    table = document.getElementById("assigned-course-table");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2];
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

$('#add-course-button').click(function() {
    $('.add-course-modal').show();
    logger.info("User enter on add course modal view", fileName);
});

$('.add-course-modal-header > div.x-button').click(function(){
    $('.add-course-modal').hide();
    logger.info("User left add course modal view by clicking X button", fileName);
});

$('.edit-course-modal-header > div.x-button').click(function(){
    $('.edit-course-page.header-assign-courses-page').hide();
    $('.edit-course-modal').hide();
    logger.info("User left edit course modal view by clicking X button", fileName);
});

$('.confirm-delete-course-modal-header > div.x-button').click(function(){
    $('.confirm-delete-course-modal').hide();
    logger.info("User left delete course modal view by clicking X button", fileName);
});

$('.delete-assigned-course-modal-header > div.x-button').click(function(){
    $('.delete-assigned-course-modal').hide();
    logger.info("User left delete course modal view by clicking X button", fileName);
});

$('.confirm-delete-course-modal-button.cancel').click(function(){
    $('.confirm-delete-course-modal').hide();
    logger.info("User left delete assigned course modal view by clicking cancel button", fileName);
});

$('.delete-assigned-course-modal-button.cancel').click(function(){
    $('.delete-assigned-course-modal').hide();
    logger.info("User left delete assigned course modal view by clicking cancel button", fileName);
});

$('.confirm-assign-student-modal-button.cancel').click(function(){
    $('.confirm-assign-student-modal').hide();
    logger.info("User left assign students modal view by clicking cancel button", fileName);
});

$('.confirm-assign-student-modal-header > div.x-button').click(function(){
    $('.confirm-assign-student-modal').hide();
    logger.info("User left assign students modal view by clicking X button", fileName);
});

