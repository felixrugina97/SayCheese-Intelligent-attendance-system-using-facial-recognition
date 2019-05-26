var $ = jQuery = require('jquery');
var path = require('path')

var fileName = 'src::js::teacher_dashboard.js';

$(function() {
    selectStudents();
})

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
            console.log(data);
            $.each(data, function(i, data) {
                $studentAttendance.append(
                    '<tr>' +
                        '<td>' + data.firstName + " " + data.lastName + '</td>' +
                        '<td>' + data.specialization + '</td>' +
                        '<td>' + data.studyYear + '</td>' +
                        '<td>' + data.group + '</td>' +
                        '<td>' + data.subgroup + '</td>' +
                        '<td>' + data.courseName + '</td>' +
                        '<td>' + data.week01 + '</td>' + '<td>' + data.week02 + '</td>' +
                        '<td>' + data.week03 + '</td>' + '<td>' + data.week04 + '</td>' +
                        '<td>' + data.week05 + '</td>' + '<td>' + data.week06 + '</td>' +
                        '<td>' + data.week07 + '</td>' + '<td>' + data.week08 + '</td>' +
                        '<td>' + data.week09 + '</td>' + '<td>' + data.week10 + '</td>' +
                        '<td>' + data.week11 + '</td>' + '<td>' + data.week12 + '</td>' +
                        '<td>' + data.week13 + '</td>' + '<td>' + data.week14 + '</td>' +
                        '<td>' + '</td>' +
                '<tr>'
                )
            });

            let table = document.getElementById("student-attendance-table");

            let currentRow = 1;
            let totalAttendance = 14
            while(row = table.rows[currentRow++]) {
                var currentCell = 6;
                var numberOfAttendances = 0;

                while(cell = row.cells[currentCell++]) {
                    if (cell.innerHTML == '-') {
                        numberOfAttendances++;
                    }
                    if (currentCell == 21) {
                        cell.innerHTML = totalAttendance - numberOfAttendances;
                    }
                }
            }
        }
    });
    logger.debug("Table with students attendance created with success", fileName);
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

var wb = XLSX.table_to_book(document.getElementById("student-attendance-table"),{sheet : "Sheet JS"});