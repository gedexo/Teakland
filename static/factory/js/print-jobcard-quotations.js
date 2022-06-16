$(document).ready(function(){
    $("#doorTableDiv").hide();
    $("#windowTableDiv").hide();
    $("#kattlaTableDiv").hide();
    $("#customKattlaTableDiv").hide();
    $("#qoutationTaxDiv").hide();
});

kattlaQty = []
customKattlaQty = []
doorQty = []
windowQty = []

var searchParams = new URLSearchParams(window.location.search)
var quotationNumber = searchParams.get('quotation_number')
var qtId = searchParams.get('qt_id')

if (quotationNumber != null) {
    quotatationDetails()
}

jobCardNumber(qtId)

function jobCardNumber(qtNo){
    $.ajax({
        url: "/factoryapi/router/quotation/"+qtNo+"/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#qoutationNo").html(response['jobcard'])
            }
        }
    });
}

// function total(doorTotal,kattlaTotal,windowTotal,customKattlaTotal,tax) {
//     var door
//     var kattla
//     var window
//     var customkattla

//     if(doorTotal != null){
//         door = doorTotal
//     }
//     else{
//         door = 0
//     }
//     if(kattlaTotal != null){
//         kattla = kattlaTotal
//     }
//     else{
//         kattla = 0
//     }
//     if(windowTotal != null){
//         window = windowTotal
//     }
//     else{
//         window = 0
//     }
//     if(customKattlaTotal != null){
//         customkattla = customKattlaTotal
//     }
//     else{
//         customkattla = 0
//     }


//     var a = parseInt(door) + parseInt(kattla) + parseInt(window) + parseInt(customkattla)
//     if (tax != 0 && tax != null){
//         taxAmount = tax/100*a
//         total = a + taxAmount
//         $("#qoutationTaxAmt").html(~~taxAmount+'.00')
//         $("#qoutationSubTotal").html(a+'.00')
//     }
//     else{
//         $("#qoutationSubTotal").html(a+'.00')
//         total = a
//     }

//     return ~~total
// }
var qtNo;
function quotatationDetails() {
    $.ajax({
        url: "/userapi/router/quotation/?quotation_number=" + quotationNumber,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                // t = total(response[0].doorsubtotal[0]['total'],response[0].kattlasubtotal[0]['total'],response[0].windowsubtotal[0]['total'],response[0].customkattlasubtotal[0]['total'],response[0].tax)
                qtNo = response[0].id
                // $("#qoutationTotal").html(t+'.00')
                $("#customerName").html(response[0].customer['name'])
                $("#customerAddress").html(response[0].customer['address'])
                $("#customerPhone").html(response[0].customer['contact_no'])
                $("#qoutationDate").html('Date: '+response[0]['date'])
                $("#qoutationUser").html('Branch: '+response[0].user['name'])
                $("#qoutationRemark").html(response[0]['remark'])
                salesman = response[0].created_by['first_name']+' '+ response[0].created_by['last_name']
                $("#qoutationSalesman").html(salesman)
                if (response[0]['tax'] != null && response[0]['tax'] != 0) {
                   $("#qoutationTaxDiv").show();
                   $("#qoutationTaxC").html(response[0]['tax']+'%'+' '+'tax is applicable for all Invoice')
                   $("#qoutationTaxPercentage").html('TAX '+ '('+response[0]['tax']+'%):')
                }

                doorQuotationExists(response[0].doorsubtotal[0]['total'])
                kattlaQuotationExists(response[0].kattlasubtotal[0]['total'])
                windowQuotationExists(response[0].windowsubtotal[0]['total'])
                customKattlaQuotationExists(response[0].customkattlasubtotal[0]['total'])
            },
            400: function () {
                window.location.href = "/quotations/"
            },
            500: function () {
                window.location.href = "/quotations/"
            }
        }
    });
}


function doorQuotationExists(total) {
    $.ajax({
        url: "/userapi/router/door-quotatation/?quotation_no=" + qtNo,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) { 
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
                    var sqft = rowData["quantity"] * rowData["squarfeet"]
                    var row = $("<tr />")
                    $("#doorTable").append(row);
                    doorQty.push(rowData['quantity'])
                    row.append($("<td>" + rowData["name"] + "</td>"));
                    row.append($("<td>" + rowData["type"] + "</td>"));
                    row.append($("<td>" + rowData["joint"] + "</td>"));

                    row.append($("<td>" + rowData["dimention_height"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_width"] + "</td>"));
                    row.append($("<td>" + rowData["quantity"] + "</td>"));
                    row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    row.append($("<td>" + sqft+ "</td>"));
                }
                var qty = doorQty.reduce(function(a, b){
                    return a + b;
                }, 0);
                $("#doorQty").html(qty)
            }
        }
    });

}

function kattlaQuotationExists(total) {
    $.ajax({
        url: "/userapi/router/kattla-quotatation/?quotation_no=" + qtNo,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
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
                    var qubic = rowData["quantity"] * rowData["qubic"]
                    kattlaQty.push(rowData['quantity'])
                    var row = $("<tr />")
                    $("#kattlaTable").append(row);
                    row.append($("<td>" + rowData["name"] + "</td>"));
                    row.append($("<td>" + rowData["type"] + "</td>"));
                    row.append($("<td>" + rowData["thickness_x"] + "</td>"));
                    row.append($("<td>" + rowData["thickness_y"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_height"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_width"] + "</td>"));
                    row.append($("<td>" + rowData["quantity"] + "</td>"));
                    row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    row.append($("<td>" + qubic + "</td>"));
                }
                var qty = kattlaQty.reduce(function(a, b){
                    return a + b;
                }, 0);
                $("#kattlaQty").html(qty)

            }
        }
    });
}

function windowQuotationExists(total) {
    $.ajax({
        url: "/userapi/router/window-quotatation/?quotation_no=" + qtNo,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
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
                    var sqft = rowData["quantity"] * rowData["squarfeet"] 
                    var row = $("<tr />")
                    $("#windowTable").append(row);
                    var design 
                    if(rowData.design ==true){
                        design = 'Yes'
                    }
                    else{
                        design = 'No'
                    }
                    var shutter 
                    if(rowData.shutter ==true){
                        shutter = 'Yes'
                    }
                    else{
                        shutter = 'No'
                    }
                    windowQty.push(rowData['quantity'])
                    row.append($("<td>" + rowData["name"] + "</td>"));
                    row.append($("<td>" + rowData["box"] + "</td>"));
                    row.append($("<td>" + shutter + "</td>"));
                    row.append($("<td>" + design+ "</td>"));
                    row.append($("<td>" + rowData["dimention_height"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_width"] + "</td>"));
                    row.append($("<td>" + rowData["quantity"] + "</td>"));
                    row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    row.append($("<td>" + sqft + "</td>"));
        
                }
                var qty = windowQty.reduce(function(a, b){
                    return a + b;
                }, 0);
                $("#windowQty").html(qty)

            }
        }
    });
}


function customKattlaQuotationExists(total) {
    $.ajax({
        url: "/userapi/router/custom-kattla-quotatation/?quotation_no=" + qtNo,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
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
                    var qubic = rowData["quantity"] * rowData["qubic"]
                    customKattlaQty.push(rowData["quantity"])
                    var row = $("<tr />")
                    $("#customKattlaQuotatiionTable").append(row);
                    row.append($("<td>" + rowData["name"] + "</td>"));
                    row.append($("<td>" + rowData["length"] + "</td>"));
                    row.append($("<td>" + rowData["thickness_x"] + "</td>"));
                    row.append($("<td>" + rowData["thickness_y"] + "</td>"));
                    row.append($("<td>" + rowData["quantity"] + "</td>"));
                    row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    row.append($("<td>" + qubic + "</td>"));
                }
                var qty = customKattlaQty.reduce(function(a, b){
                    return a + b;
                }, 0);
                $("#customKattlaQty").html(qty)
            }
        }
    });
}


$("#btnPrint").click(function(){
    window.print()
});

$("#btnBack").click(function(){
    window.location.href = "/factory/jobcard/"
});