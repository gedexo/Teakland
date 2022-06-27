$(document).ready(function () {
    $.ajax({
        url: "/userapi/router/issues/",
        type: "GET",
        beforeSend: function (xhr) {
            $("#issuesTable").addClass('table-loader')
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
                    var createdUser
                    createdUser = rowData.created_user['first_name'] +' ' +rowData.created_user['last_name']
                    if(rowData.created_user['first_name'] === ''){
                        createdUser = rowData.created_user['email']
                    }
                    table = $("#issuesTable").DataTable();
                    tableData.push([rowData['date'],rowData.quotationno['quoation_number'],createdUser,rowData['issue']])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
    $("#issuesTable").removeClass('table-loader')
});



