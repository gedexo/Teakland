
var searchParams = new URLSearchParams(window.location.search)
var branch = searchParams.get('branch')
var salesmanId = searchParams.get('salesman')
income()
function income() {
    $.ajax({
        url: "/officialapi/router/filter-payments/?branch="+branch+"&salesman="+salesmanId,
        type: "GET",
        cache:false,
        beforeSend: function (xhr) {
            $("#incomeTable").addClass('table-loader');
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                incomeTotal = []
                table = $("#incomeTable").DataTable();
                table.clear()
                table.draw()
                    drawTable(response);
                    function drawTable(data) {
                        for (var i = 0; i < data.length; i++) {
                            drawRow(data[i]);
                        }
                    }
                    function drawRow(rowData) {
                        incomeTotal.push(rowData['amount'])
                       
                        createdBy = rowData.created_user['first_name'] +' ' +rowData.created_user['last_name']
                        if(rowData.created_user['first_name'] === ''){
                            createdBy = rowData.created_user['email']
                        }
                        var tableData = [];
                        createdUser = rowData.created_user['first_name'] + rowData.created_user['last_name']
                        tableData.push([rowData['date'],rowData.quotation['quoation_number'],rowData.quotation.invoice['invoiceno'],createdBy,rowData['amount']])
                        table.rows.add(tableData).draw();
                    }
                    var incomeSum = incomeTotal.reduce(function(a, b){
                        return a + b;
                    }, 0);
                    $("#incomeTotal").html(incomeSum)
            }
        }
    });
    $("#incomeTable").removeClass('table-loader');
}
