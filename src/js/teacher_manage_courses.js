var $ = jQuery = require('jquery');

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
                            '<i class="far fa-edit"></i>' +
                            '<i class="far fa-trash-alt" id="delete-course"></i>' +
                        '</td>' +
                    '<tr>'
                )
            });
        }
    });
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
        deletCourseName + "</strong> course?");

    $('.confirm-delete-course-modal').show();    
})

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

$('#add-course-button').click(function() {
    $('.add-course-modal').show();
    logger.info("User enter on add course modal view", fileName);
});

$('.add-course-modal-header > div.x-button').click(function(){
    $('.add-course-modal').hide();
    logger.info("User left add course modal view by clicking X button", fileName);
});

$('.confirm-delete-course-modal-header > div.x-button').click(function(){
    $('.confirm-delete-course-modal').hide();
    logger.info("User left delete course modal view by clicking X button", fileName);
});

$('.confirm-delete-course-modal-button.cancel').click(function(){
    $('.confirm-delete-course-modal').hide();
    logger.info("User left delete course modal view by clicking cancel button", fileName);
});