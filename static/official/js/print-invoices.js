$(document).ready(function(){
    $("#doorTableDiv").hide();
    $("#windowTableDiv").hide();
    $("#kattlaTableDiv").hide();
    $("#customKattlaTableDiv").hide();
    $("#qoutationTaxDiv").hide();
    $("#otherProductTableDiv").hide();
});
kattlaQty = []
customKattlaQty = []
doorQty = []
windowQty = []
doorSqft = []
windowSqft = []
kattlaQubic = []
sizesQubic = []
othersQty = []

var qtNo;
var searchParams = new URLSearchParams(window.location.search)
var quotationNumber = searchParams.get('quotation_number')
var invoiceNumber = searchParams.get('invoice_number')

if (quotationNumber != null) {
    quotatationDetails()
}
function total(doorTotal,kattlaTotal,windowTotal,customKattlaTotal,othersubtotal,tax) {
    var door
    var kattla
    var window
    var customkattla
    var others


    if(doorTotal != null){
        door = doorTotal
    }
    else{
        door = 0
    }
    if(kattlaTotal != null){
        kattla = kattlaTotal
    }
    else{
        kattla = 0
    }
    if(windowTotal != null){
        window = windowTotal
    }
    else{
        window = 0
    }
    if(customKattlaTotal != null){
        customkattla = customKattlaTotal
    }
    else{
        customkattla = 0
    }
    if(othersubtotal != null){
        others = othersubtotal
    }
    else{
        others = 0
    }


    var a = parseInt(door) + parseInt(kattla) + parseInt(window) + parseInt(customkattla) + parseInt(others)
    if (tax != 0 && tax != null){
        taxAmount = tax/100*a
        total = a + taxAmount
        $("#qoutationTaxAmt").html(~~taxAmount+'.00')
        $("#qoutationSubTotal").html(a+'.00')
    }
    else{
        $("#qoutationSubTotal").html(a+'.00')
        total = a
    }

    return ~~total
}
function quotatationDetails() {
    $.ajax({
        url: "/officialapi/router/qoutations/?quotation_number=" + quotationNumber,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                t = total(response[0].doorsubtotal[0]['total'],response[0].kattlasubtotal[0]['total'],response[0].windowsubtotal[0]['total'],response[0].customkattlasubtotal[0]['total'],response[0].othersubtotal[0]['total'],response[0].tax)
                qtNo = response[0].id
                var date =  response[0]['date']
                var dateQt = date.split(' ')[0];
                $("#qoutationTotal").html(t+'.00')
                $("#qoutationNo").html(invoiceNumber)
                $("#customerName").html(response[0].customer['name'])
                $("#customerAddress").html(response[0].customer['address'])
                $("#customerPhone").html(response[0].customer['contact_no'])
                $("#qoutationDate").html('Date: '+dateQt)
                $("#qoutationUser").html('Branch: '+response[0].user['name'])
                $("#qoutationRemark").html(response[0]['remark'])
                var salesman
                if(response[0].created_by['first_name'] != '')
                {
                    salesman = response[0].created_by['first_name']  +' ' +response[0].created_by['last_name'] 
                }
                else{
                    salesman=response[0].created_by['email'] ;
                }
                $("#qoutationSalesman").html(salesman)
                if (response[0].user['phonenumber'] != null){
                    $("#qoutationSalesmanContact").html(response[0].user['phonenumber'])
                }
                else{
                    $("#quotationSaleManCnt").html('')
                }
                if (response[0]['tax'] != null && response[0]['tax'] != 0) {
                   $("#qoutationTaxDiv").show();
                   $("#qoutationTaxC").html(response[0]['tax']+'%'+' '+'tax is applicable for all Invoi15ce')
                   $("#qoutationTaxPercentage").html('TAX '+ '('+response[0]['tax']+'%):')
                }

                doorQuotationExists(response[0].doorsubtotal[0]['total'])
                kattlaQuotationExists(response[0].kattlasubtotal[0]['total'])
                windowQuotationExists(response[0].windowsubtotal[0]['total'])
                customKattlaQuotationExists(response[0].customkattlasubtotal[0]['total'])
                otherQuotationExists(response[0].othersubtotal[0]['total'])
                quotationAmount()

            },
            400: function () {
                window.location.href = "/invoice/"
            },
            500: function () {
                window.location.href = "/invoice/"
            }
        }
    });
}


function doorQuotationExists(total) {
    $.ajax({
        url: "/officialapi/router/door-quotatation/?quotation_no=" + qtNo,
        type: "GET",
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) { 
                var count = 1
                $("#doorTotal").html(total)
                if (response.length > 0){
                    $("#doorTableDiv").show();
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var sqft = rowData["quantity"] * rowData["squarfeet"].toFixed(2);
                    doorSqft.push(sqft)
                    doorQty.push(rowData['quantity'])
                    var row = $("<tr />")
                    $("#doorTable").append(row);
                    row.append($("<td>" + count + "</td>"));
                    row.append($("<td>" + rowData["name"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_height"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_width"] + "</td>"));
                    row.append($("<td>" + rowData["quantity"] + "</td>"));
                    row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    row.append($("<td>" + parseFloat(sqft).toFixed(2) + "</td>"));
                    row.append($("<td>" + rowData["unit_amount"] + "</td>"));
                    row.append($("<td>" + rowData["aggregate"] + "</td>"));
                    count =+ count + 1
                }
                var qty = doorQty.reduce(function(a, b){
                    return a + b;
                }, 0);
                $("#doorQty").html(qty)
                var sqftTotal = doorSqft.reduce(function(a, b){
                    return a + b;
                }, 0);
                a = sqftTotal.toFixed(2);
                $("#doorSqft").html(a)
            }
        }
    });

}

function kattlaQuotationExists(total) {
    $.ajax({
        url: "/officialapi/router/kattla-quotatation/?quotation_no=" + qtNo,
        type: "GET",
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                var count = 1
                $("#kattlaTotal").html(total)
                if(response.length > 0){
                    $("#kattlaTableDiv").show();
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var qubic = rowData["quantity"] * rowData["qubic"].toFixed(2);
                    kattlaQubic.push(qubic)
                    kattlaQty.push(rowData['quantity'])
                    var row = $("<tr />")
                    $("#kattlaTable").append(row);
                    row.append($("<td>" + count + "</td>"));
                    row.append($("<td>" + rowData["name"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_height"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_width"] + "</td>"));
                    row.append($("<td>" + rowData["quantity"] + "</td>"));
                    row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    row.append($("<td>" + parseFloat(qubic).toFixed(2)  + "</td>"));
                    row.append($("<td>" + rowData["unit_amount"] + "</td>"));
                    row.append($("<td>" + rowData["aggregate"] + "</td>"));
                    count =+ count + 1
                }
                var qty = kattlaQty.reduce(function(a, b){
                    return a + b;
                }, 0);
                $("#kattlaQty").html(qty)
                var qubicTotal = kattlaQubic.reduce(function(a, b){
                    return a + b;
                }, 0);
                a = qubicTotal.toFixed(2);
                $("#kattlaQubic").html(a)
            }
        }
    });
}

function windowQuotationExists(total) {
    $.ajax({
        url: "/officialapi/router/window-quotatation/?quotation_no=" + qtNo,
        type: "GET",
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                var count = 1
                $("#windowTotal").html(total)
                if(response.length > 0){
                    $("#windowTableDiv").show();
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var sqft = rowData["quantity"] * rowData["squarfeet"].toFixed(2); 
                    windowSqft.push(sqft)
                    windowQty.push(rowData['quantity'])
                    var row = $("<tr />")
                    $("#windowTable").append(row);
                    row.append($("<td>" + count + "</td>"));
                    row.append($("<td>" + rowData["name"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_height"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_width"] + "</td>"));
                    row.append($("<td>" + rowData["quantity"] + "</td>"));
                    row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    row.append($("<td>" + parseFloat(sqft).toFixed(2) + "</td>"));
                    row.append($("<td>" + rowData["unit_amount"] + "</td>"));
                    row.append($("<td>" + rowData["aggregate"] + "</td>"));
                    count =+ count + 1
                }
                var qty = windowQty.reduce(function(a, b){
                    return a + b;
                }, 0);
                $("#windowQty").html(qty)
                var sqftTotal = windowSqft.reduce(function(a, b){
                    return a + b;
                }, 0);
                a = sqftTotal.toFixed(2);
                $("#windowSqft").html(a)

            }
        }
    });
}


function customKattlaQuotationExists(total) {
    $.ajax({
        url: "/officialapi/router/custom-kattla-quotatation/?quotation_no=" + qtNo,
        type: "GET",
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                var count = 1
                $("#customKattlaTotal").html(total)
                if(response.length > 0){
                    $("#customKattlaTableDiv").show();
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var qubic = rowData["quantity"] * rowData["qubic"].toFixed(2);
                    sizesQubic.push(qubic)
                    customKattlaQty.push(rowData["quantity"])
                    var row = $("<tr />")
                    $("#customKattlaQuotatiionTable").append(row);
                    row.append($("<td>" + count + "</td>"));
                    row.append($("<td>" + rowData["name"] + "</td>"));
                    row.append($("<td>" + rowData["length"] + "</td>"));
                    row.append($("<td>" + rowData["quantity"] + "</td>"));
                    row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    row.append($("<td>" + parseFloat(qubic).toFixed(2)  + "</td>"));
                    row.append($("<td>" + rowData["unit_amount"] + "</td>"));
                    row.append($("<td>" + rowData["aggregate"] + "</td>"));
                    count =+ count + 1
                }
                var qty = customKattlaQty.reduce(function(a, b){
                    return a + b;
                }, 0);
                $("#customKattlaQty").html(qty)
                var qubicTotal = sizesQubic.reduce(function(a, b){
                    return a + b;
                }, 0);
                a = qubicTotal.toFixed(2);
                $("#sizesQubic").html(a)
            }
        }
    });
}

function otherQuotationExists(total) {
    $.ajax({
        url: "/userapi/router/other-product-quotation/?quotation_no=" + qtNo,
        type: "GET",
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                var count = 1
                $("#otherProductTotal").html(total)
                if(response.length > 0){
                    $("#otherProductTableDiv").show();
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    othersQty.push(rowData["quantity"])
                    var row = $("<tr />")
                    $("#otherQuotationTable").append(row);
                    row.append($("<td>" + count + "</td>"));
                    row.append($("<td>" + rowData["name"] + "</td>"));
                    row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    row.append($("<td>" + rowData['quantity'] + "</td>"));
                    row.append($("<td>" + rowData["price"] + "</td>"));
                    row.append($("<td>" + rowData["aggregate"] + "</td>"));
                    count =+ count + 1
                }
                var qty = othersQty.reduce(function(a, b){
                    return a + b;
                }, 0);
                $("#otherProductQty").html(qty)

            }
        }
    });
}


function quotationAmount(){
    $.ajax({
        url: "/officialapi/router/invoice/?invoice_number="+invoiceNumber+"&quotation_number="+qtNo,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                var balance = response[0].totalAmount - response[0].recievedAmount
                if(response[0].totalAmount == response[0].recievedAmount){
                    $("#quotationBalanceAmountDiv").hide();
                    $("#quotationRecievedAmount").html(response[0].recievedAmount+'.00')

                }
                else{
                    $("#quotationRecievedAmount").html(response[0].recievedAmount+'.00')
                    $("#quotationBalanceAmount").html(balance+'.00')
                }
            },
            400: function (response) {
                window.location.href="/official/invoice/"
            }
        }
    })
}

$("#btnPrint").click(function(){
    window.print()
});

$("#btnBack").click(function(){
    window.location.href = "/official/invoice/"
});