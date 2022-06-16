

$(document).ready(function () {
    $.ajax({
        url: "/officialapi/router/invoice/",
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
                    var billBalance 
                    balance  = rowData['totalAmount'] - rowData['recievedAmount']
                    if(~~balance <= 0){
                        billBalance = '<p class="text-success">Closed</p>'
                    }
                    else{
                        billBalance = balance

                    }
                    createdBy = rowData.created_user['first_name'] +' ' +rowData.created_user['last_name']
                    var recievedCash = '<a href="#" onmouseover="payments_recieved('+rowData.quotation['id']+')"  class="recieved-amount" id="recievedAmounts">'+rowData['recievedAmount']+'</a>'
                    balance  = rowData['totalAmount'] - rowData['recievedAmount']
                    table = $("#invoiceTable").DataTable();
                    var print = '<a href="/official/print-invoice/?quotation_number='+ rowData.quotation['quoation_number'] + '&invoice_number=' + rowData['invoiceno'] + '"  id=' + rowData['id'] + ' class=""><i class="icofont-print printer-color"></i></a>'
                    tableData.push([rowData['date'], rowData['invoiceno'],rowData.quotation['quoation_number'],createdBy,rowData['totalAmount'],recievedCash,billBalance,print])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});


function payments_recieved(qtNo){
    checkUser()
    
    $("#paymentsModal").modal('show')
    $('#paymentsTable tr').slice(1).remove();
    $.ajax({
        url: "/userapi/router/payments/?quotation_number="+qtNo,
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
                    var paymentType 
                    var createdBy
                    if(rowData['type'] == 'cash'){
                        paymentType = 'Cash'
                    }
                    else{
                        if(rowData.bank != null){
                            paymentType = 'Bank ('+rowData.bank['name']+')'
                        }
                        else{
                            paymentType = 'Bank'
                        }

                    }
                    if(rowData.created_user["first_name"] !="" || rowData.created_user["last_name"] != null){
                        createdBy = rowData.created_user["first_name"]+rowData.created_user["last_name"] 
                    }
                    else{
                        createdBy = rowData.created_user["email"]
                    }
                    var row = $("<tr />")
                    $("#paymentsTable").append(row);
                    row.append($("<td>" + rowData["date"] + "</td>"));
                    row.append($("<td>" + paymentType + "</td>"));
                    row.append($("<td>" + rowData['amount'] + "</td>"));
                    row.append($("<td>" + createdBy + "</td>"));
                 
            }
        }
    }
    });
}


$("[id=btnClose]").click(function(){
    $("#paymentsModal").modal('hide')
});