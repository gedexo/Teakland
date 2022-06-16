
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
                    var createdBy
                    var paymentType 
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