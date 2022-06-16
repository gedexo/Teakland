
$(document).ready(function () {
    $.ajax({
        url: "/officialapi/router/other-products/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
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
                    table = $("#othersTable").DataTable();
                    tableData.push([rowData['date'],rowData['name'],rowData.rowmaterial['name'],rowData['sales_rate']])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});