
var searchParams = new URLSearchParams(window.location.search)
var branch = searchParams.get('branch')
var salesmanId = searchParams.get('salesman')
expences()
function expences() {
    $.ajax({
        url: "/officialapi/router/filter-expences/?branch="+branch+"&salesman="+salesmanId,
        type: "GET",
        beforeSend: function (xhr) {
            $("#incomeAndExpenceTable").addClass('table-loader');
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                expenceTotal = []
                table = $("#incomeAndExpenceTable").DataTable();
                table.clear()
                table.draw()
                    drawTable(response);
                    function drawTable(data) {
                        for (var i = 0; i < data.length; i++) {
                            drawRow(data[i]);
                        }
                    }
                    function drawRow(rowData) {
                        expenceTotal.push(rowData['amount'])
                        var category
                        if(rowData.category != null){
                            category = rowData.category['category']
                        }
                        else{
                            category = 'Not defined'
                        }
                        var tableData = [];
                        // createdUser = rowData.created_user['first_name'] + rowData.created_user['last_name']
                        tableData.push([rowData['date'],category,rowData['description'],rowData.user['name'],rowData['amount']])
                        table.rows.add(tableData).draw();
                    }
                    var expenseSum = expenceTotal.reduce(function(a, b){
                        return a + b;
                    }, 0);
                    $("#expenseTotal").html(expenseSum)
            }
        }
    });
    $("#incomeAndExpenceTable").removeClass('table-loader');
}


