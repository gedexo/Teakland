$('#feedbackTable').DataTable();
$(document).ready(function () {
    $.ajax({
        url: "/userapi/router/feedback/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var tableData = [];
                    table = $("#feedbackTable").DataTable();
                    var deletedUser = rowData.deleted_user['first_name'] + rowData.deleted_user['last_name']
                    tableData.push([rowData['date'], rowData.user['name'],rowData['customername'],rowData['customernumber'],rowData['feedback'],deletedUser])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});


