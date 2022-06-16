income()
function income(id){
    $.ajax({
        url: "/userapi/router/payments/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                table = $("#incomeTable").DataTable();
                    drawTable(response);
                    function drawTable(data) {
                        for (var i = 0; i < data.length; i++) {
                            drawRow(data[i]);
                        }
                    }
                    function drawRow(rowData) {
                       var collectedBy 
                       if(rowData['created_user']['first_name'] != ''){
                           collectedBy = rowData['created_user']['first_name'] + rowData['created_user']['last_name']
                       }
                       else{
                           collectedBy = rowData['created_user']['email']
                       }
                       var tableData = [];
                       createdUser = rowData.created_user['first_name'] + rowData.created_user['last_name']
                       tableData.push([rowData['date'],rowData.quotation['quoation_number'],rowData.quotation['invoice'],collectedBy,rowData['amount']])
                       table.rows.add(tableData).draw();
                    }
                }
            }
    });
}

