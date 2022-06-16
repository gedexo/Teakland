$('#invoiceTable').dataTable( {
    "processing": true
});

var rowIndex 
var invoiceId
var total
var billTotal
bank()
$(document).ready(function(){
    invoices()
});

function invoices(){
    $.ajax({
        url: "/userapi/router/invoice/",
        type: "GET",
        beforeSend: function (xhr) {
            $("#invoiceTable").addClass('table-loader');
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                table = $("#invoiceTable").DataTable();
                table.clear()
                table.draw()
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {

                    var tableData = [];
                    var billBalance 
                    var edit 
                    var createdBy
                    balance  = rowData['totalAmount'] - rowData['recievedAmount']
                    if(~~balance <= 0){
                        billBalance = '<p class="text-success">Closed</p>'
                        edit =  '' 
                    }
                    else{
                        billBalance = balance
                        edit = '<a id=' + rowData['id'] + ' onClick=updateInvoiceData('+rowData['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    }
                    if(rowData.created_user['first_name'] != '')
                    {
                        createdBy = rowData.created_user['first_name']  +' ' +rowData.created_user['last_name'] 
                    }
                    else{
                        createdBy=rowData.created_user['email'] ;
                    }
                    var invoiceNumber = '<a href="/print-invoice/?quotation_number='+ rowData.quotation['quoation_number'] + '&invoice_number=' + rowData['invoiceno'] + '" class="">'+rowData['invoiceno']+'</a>'
                    var recievedCash = '<a href="#" onmouseover="payments_recieved('+rowData.quotation['id']+')"  class="recieved-amount" id="recievedAmounts">'+rowData['recievedAmount']+'</a>'
                    table = $("#invoiceTable").DataTable();
                    var print = '<a href="/print-invoice/?quotation_number='+ rowData.quotation['quoation_number'] + '&invoice_number=' + rowData['invoiceno'] + '"  id=' + rowData['id'] + ' class=""><i class="icofont-print printer-color"></i></a>'
                    tableData.push([rowData['date'],rowData['invoiceno'],rowData.quotation['quoation_number'],createdBy,rowData['totalAmount'],recievedCash,billBalance,print,edit])
                    table.rows.add(tableData).draw();
                }
                $("#invoiceTable").removeClass('table-loader');
            }
        }
    });
}

function updateInvoiceData(id,rIndex){
    invoiceId = id
    $("#bankDiv").hide();
    $.ajax({
        url: "/userapi/router/invoice/"+id+"/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                balance  = response['totalAmount'] - response['recievedAmount']
                total = balance
                billTotal = response['totalAmount']
                $("[id=billBalance]").html(response['totalAmount'])
                $("#balanceBillAmount").html(balance)
                $("#recievedCash").attr('max', balance)
                $("#quotationno").val(response.quotation['id'])
            }
        }
    });
    $("#invoiceModal").modal('show')
}


$("#paymentType").change(function(){
    $("#error1").html('')
    var type = $(this).val();
    if(type == 'cash'){
        $("#bankDiv").hide();
        $("#bank").val(null)
    }
    if (type == 'bank'){
        $("#bankDiv").show();
    }
});

function bank(){
    $.ajax({
        url: "/officialapi/router/bank/",
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
                    $("select[name=bank]").append($('<option>').text(rowData['name']).attr('value', rowData['id']));
                }
            }
        }
    });
}

$("#invoiceUpdateForm").validate({
    rules: {
        amount: {
            required: true,
        },
        type: {
            required: true
        },
    
    },
    submitHandler: function (e) {
        var data = $(e).serializeArray();
        payments(data)
    }
});


function payments(data){
    checkUser()
    $.ajax({
        url: "/userapi/router/payments/",
        type: "POST",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            
            401: function () {
                $("#invoiceModal").modal('hide')
                swal("Oops! Something went wrong!", {
                    icon: "error",
                });
            },
            406: function () {
                $("#invoiceModal").modal('hide')
                swal("Oops! Something went wrong!", {
                    icon: "error",
                });
            },
            201: function (response) {
                $("#invoiceUpdateForm").trigger("reset")
                $("#invoiceModal").modal('hide')
                swal("Success! Updated Successfully!", {
                    icon: "success",
                });
                updateTable()
                
            },
            
        }
    });
}

function updateTable(){
    checkUser()
    $.ajax({
        url: "/userapi/router/invoice/"+invoiceId+"/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                balance  = response['totalAmount'] - response['recievedAmount']
                var recievedCash = '<a href="#" onmouseover="payments_recieved('+response.quotation['id']+')"  class="recieved-amount" id="recievedAmounts">'+response['recievedAmount']+'</a>'

                var rows = rowIndex
                invoices()
                // if(~~balance > 0){
                //     const table = $("#invoiceTable").DataTable();

                //     table.cell(rowIndex-1, 5).data(recievedCash);
                //     table.cell(rowIndex-1, 6).data(balance);                 
                // }
                // else{
                //     const table = $("#invoiceTable").DataTable();
                //     var closed = '<p class="text-success">Closed</p>'
                //     table.cell(rowIndex-1, 5).data(recievedCash);
                //     table.cell(rowIndex-1, 6).data(closed);
                // }
            }
        }
    });
}

$("#recievedCash").keyup(function(){
    var rc = $(this).val();
    balance = total - rc
    $("#balanceBillAmount").html(balance)
    if (balance < 0){
        $("#recievedCash").val(0)
        $("#billBalance").html(billTotal)
        $("#balanceBillAmount").html(~~total)
    }
});

$("[id=btnClose]").click(function(){
    $("#paymentsModal").modal('hide')
});

$('#invoiceTable').on('click', 'td', function(){
    var index = $('#invoiceTable').DataTable()
        .rows({ search: 'applied'})
        .nodes()
        .to$()
        .index($(this).closest('tr'));
    rowIndex = index     
 });