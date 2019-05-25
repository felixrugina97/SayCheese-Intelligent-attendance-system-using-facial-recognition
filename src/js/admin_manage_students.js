var $ = jQuery = require('jquery');
var logger = require('../../config/logger').Logger;
var $ = jQuery = require('jquery');
var path = require('path')
var fs = require('fs')
var {app, dialog} = require('electron').remote;

var fileName = 'src::js::admin_manage_courses.js';

$(function() {
    selectStudents();
})

function selectStudents() {
    var $studentTable = $('#students tbody');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/students',
        success: function(data) {
            console.log(data);
            $.each(data, function(i, data) {
                $studentTable.append(
                    '<tr>' +
                        '<td>' + data.ID + '</td>' +
                        '<td>' + data.firstName + '</td>' +
                        '<td>' + data.lastName + '</td>' +
                        '<td>' + data.university + '</td>' +
                        '<td>' + data.profile + '</td>' +
                        '<td>' + data.specialization + '</td>' +
                        '<td>' + data.studyYear + '</td>' +
                        '<td>' + data.group + '</td>' +
                        '<td>' + data.subgroup + '</td>' +
                        '<td class="student-table-controls">' +
                            '<i class="fas fa-file-upload" id="upload-photo"></i>' +
                            '<i class="far fa-trash-alt" id="delete-course"></i>' +
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
    const projectPath = app.getAppPath()

    fs.copyFile(filePath, projectPath + '/data/data_set/' + studentID + '.jpg', err => {
        if (err)
            throw err;
    });
})