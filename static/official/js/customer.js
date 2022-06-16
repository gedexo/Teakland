$(window).on('load', function () {
    customerDatas();
    pieChartData();
    bank()
});
$('#customerTable').DataTable({
    dom: 'Bfrtip',
    buttons: [
        'excel', 'pdf',{
    }
    ]
});
var total 
customers()
function customers(type,isEnquiry) {
    var url
    if (type != null || isEnquiry != null) {
        url = "/officialapi/router/customer/?type=" + type+"&is_enquiry="+isEnquiry
    }
    else {
        url = "/officialapi/router/customer/"
    }
    $.ajax({
        url: url,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                table = $("#customerTable").DataTable();
                table.clear()
                table.draw()
                if (response.length === 0) {
                    table.clear()
                    table.draw()
                    swal("Oops! No data !", {
                        icon: "error",
                    });
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                
                    var quotation = '<p class="text-info" onmouseover="customerDetails(' + rowData['id'] + ')" >' + rowData['quotationCount'] + '</p>'
                    if(rowData['is_enquiry'] == true){
                        quotation = '<p class="text-success">Enquiry</p>'
                    }
                    var tableData = [];
                    table = $("#customerTable").DataTable();
                    tableData.push([rowData['date'], rowData['name'], quotation, rowData['source'], rowData['type'], rowData.created_by['name'], rowData.dealt_by['name'], rowData['contact_no'], rowData['address'],rowData.user['name'],rowData['remark']])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
}


$("#type").change(function () {
    var type = $(this).val();
    customers(type)
})

function customerDatas() {
    $.ajax({
        url: "/officialapi/customer-count/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#customerTotal").html(response['total_customer'])
                $("#lastMonthCustomer").css("width", response['last_month_customer_percentage'] + "%")
                $("#totalPayments").html(response['total_payments'])
                $("#lastMonthTotalPaymentsPercentage").css("width", response['last_month_payments_percentage'] + "%")
                $("#recievedPaymentsPercentage").css("width", response['recieved_payments_percentage'] + "%")
                $("#pendingPaymentsPercentage").css("width", response['pending_payments_percentage'] + "%")

                $("#recievedPayments").html(response['recieved_payments'])
                $("#pendingPayments").html(response['pending_amount'])


                // $("#recievedPaymentsPercentage").addClass('w-50')

            }
        }
    });
}

function customerDetails(id) {
    $('#customerInvoiceTable tr').slice(1).remove();
    $.ajax({
        url: "/officialapi/filter-customer-data/" + id + "/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                if (response.length > 0) {
                    $("#invoice-customermodal").modal('show')
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var invoice
                    var status
                    var update
                    if (rowData.status == 'open') {
                        status = '<label class="badge badge-info">open</label>'
                    }
                    else if (rowData.status == 'onprocess') {
                        status = '<label class="badge badge-warning">onprocess</label>'
                    }
                    else if (rowData.status == 'pending') {
                        status = '<label class="badge badge-danger">pending</label>'
                    }
                    else if (rowData.status == 'completed') {
                        status = '<label class="badge badge-primary">completed</label>'
                    }
                    else if (rowData.status == 'delivered') {
                        status = '<label class="badge badge-success">delivered</label>'
                    }

                    if (rowData.invoice != false) {
                        invoice = rowData.invoice['invoiceno']
                    }
                    else if (rowData.invoice == false) {
                        invoice = '<p class="text-danger">Not created</p>'
                        update = ''
                    }

                    var created_by = rowData.created_by["first_name"] + ' ' + rowData.created_by["last_name"]
                    var balance = rowData["totalAmount"] - rowData["recievedAmount"]
                    if (balance == 0) {
                        update = '<p class="text-sucess">Closed</p>'
                    }
                    else {

                    }

                    var totalAmount = rowData["totalAmount"] + rowData["recievedAmount"]
                    var row = $("<tr />")
                    $("#customerInvoiceTable").append(row);
                    row.append($("<td>" + rowData["date"] + "</td>"));
                    row.append($("<td>" + rowData["quoation_number"] + "</td>"));
                    row.append($("<td>" + invoice + "</td>"));
                    row.append($("<td>" + totalAmount + "</td>"));
                    row.append($("<td>" + balance + "</td>"));
                    row.append($("<td>" + created_by + "</td>"));
                    row.append($("<td>" + status + "</td>"));
                    // row.append($("<td>" + 'No update'+ "</td>"));
                }

            }
        }
    });
}


function pendingQuoations() {
    $('#invoicePendingTable tr').slice(1).remove();
    $("#invoice-pendingmodal").modal('show')
    $("#pendingInvoicesContent").html('Loading please wait...')
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
                    var balance = rowData['totalAmount'] - rowData['recievedAmount']
                    var created_by = rowData.created_user["first_name"] + ' ' + rowData.created_user["last_name"]
                    if(balance != 0){
                        var row = $("<tr />")
                        var edit = '<a href="#" id=' + rowData['id'] + ' onClick=updateInvoiceData('+rowData['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                        $("#invoicePendingTable").append(row);
                        row.append($("<td>" + rowData["invoiceno"] + "</td>"));
                        row.append($("<td>" + rowData.user["name"] + "</td>"));
                        row.append($("<td>" + rowData.quotation.customer["name"] + "</td>"));
                        row.append($("<td>" + rowData["totalAmount"] + "</td>"));
                        row.append($("<td>" + rowData["recievedAmount"] + "</td>"));
                        row.append($("<td>" + balance+ "</td>"));
                        row.append($("<td>" + created_by+ "</td>"));
                        row.append($("<td>" + edit+ "</td>"));
                    }
                }
                $("#pendingInvoicesContent").html('Invoices')

            }
        }
    });
}


$("[id=btnClose]").click(function () {
    $("#invoice-customermodal").modal('hide')
    $("#invoice-pendingmodal").modal('hide')
});

function pieChartData(){
    data1 = []
    data2 = []
    $.ajax({
        url: "/officialapi/customer-count/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                for(var i = 0; i<response.branch_based_customer.length; i++){
                    data1.push({'y':response.branch_based_customer[i]['customers'],'label':response.branch_based_customer[i]['name']})
                    data2.push({'y':response.branch_based_customer[i]['customersEnquiry'],'label':response.branch_based_customer[i]['name']})

                }
                var chart = new CanvasJS.Chart("chartContainer", {
                    animationEnabled: true,
                    title: {
                        text: "Customers divided by branch based"
                    },
                    data: [{
                        type: "pie",
                        startAngle: 240,
                        yValueFormatString: "##0",
                        indexLabel: "{label} {y}",
                        dataPoints:data1
                    }]
                });
                chart.render()
                
                var chartTwo = new CanvasJS.Chart("enquiryChart", {
                    animationEnabled: true,
                    title: {
                        text: "Enquiry customers"
                    },
                    data: [{
                        type: "pie",
                        startAngle: 240,
                        yValueFormatString: "##0",
                        indexLabel: "{label} {y}",
                        dataPoints:data2
                    }]
                });
                chartTwo.render()
            }
        }
    })
  
}

$("#customer").click(function(){
    customers('','False')
    $('html, body').animate({
        scrollTop: $("#customerTable").offset().top
        }, 100);
});
$("#enquiryCustomer").click(function(){
    customers('','True')
    $('html, body').animate({
        scrollTop: $("#customerTable").offset().top
        }, 100);
});


function updateInvoiceData(id,rIndex){
    invoiceId = id
    $("#bankDiv").hide();
    $.ajax({
        url: "/officialapi/router/invoice/"+id+"/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
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
                "Bearer " + localStorage.getItem("adminaccesstoken")
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
                pendingQuoations()
                customerDatas()
                
            },
            
        }
    })
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