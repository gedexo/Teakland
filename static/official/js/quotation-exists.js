
$("#kattlaTableDiv").hide();
$("#doorTableDiv").hide();
$("#windowTableDiv").hide();
$("#customKattlaTableDiv").hide();
$("#quotatonTaxDiv").hide();
$("#otherProductTableDiv").hide();


var searchParams = new URLSearchParams(window.location.search)
var quotationNumber = searchParams.get('quotation_number')
if (quotationNumber != null) {
    quotatationDetails()
}

function total(doorTotal,kattlaTotal,windowTotal,customKattlaTotal,othersTotal,tax) {
    var door
    var kattla
    var window
    var total 
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
    if(othersTotal != null){
        others = othersTotal
    }
    else{
        others = 0
    }
    if(customKattlaTotal != null){
        customkattla = customKattlaTotal
    }
    else{
        customkattla = 0
    }

    var a = parseInt(door) + parseInt(kattla) + parseInt(window) + parseInt(customkattla) + parseInt(others)
    if (tax != 0 && tax != null) {
        taxAmount = tax / 100 * a
        total = a + taxAmount
        $("#taxCDiv").append('Tax:', '(' + tax + '%)')
        $("#taxTotal").html(~~taxAmount + '.00')
        $("#quotationSubTotal").html(a + '.00')
    }
    else {
        $("#qoutationSubTotal").html(a + '.00')
        total = a
    }

    return ~~total
}


var qtNo;
updateQuotationsIsSeen(qtNo)
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
                qtNo = response[0]['id']
                t = total(response[0].doorsubtotal[0]['total'], response[0].kattlasubtotal[0]['total'], response[0].windowsubtotal[0]['total'],response[0].customkattlasubtotal[0]['total'],response[0].othersubtotal[0]['total'],response[0]['tax'])
                $("#quotationTotal").html(t + '.00')
                $("#quotationSubTotal").html(t + '.00')
                $("#customer").val(response[0].customer['id'])
                $("#customer").prop('disabled', true)
                $("#btnCustomer").prop('disabled', true)
                $("#quatationNumber").html('Quotation Number : ' + response[0]['quoation_number'])
                $("#quotation").val(response[0]['id'])
                $("#phone").val(response[0].customer['contact_no'])
                $("#createdBy").val(response[0].customer.created_by['name'])
                $("#dealtBy").val(response[0].customer.dealt_by['name'])
                $("textarea[name=remark]").val(response[0]['remark'])
                $("textarea[name=remark]").prop('disabled', true)
                $("#windowTotal").html(response[0].windowsubtotal[0].total)
                $("#doorTotal").html(response[0].doorsubtotal[0].total)
                $("#kattlaTotal").html(response[0].kattlasubtotal[0].total)
                $("#customKattlaTotal").html(response[0].customkattlasubtotal[0].total)
                $("#othersTotal").html(response[0].othersubtotal[0].total)

                if (response[0]['tax'] != null && response[0]['tax'] != 0) {
                    $("#quotatonTaxDiv").show();
                    $("#taxPercentage").val(response[0]['tax'])
                    $("#taxChk").prop('checked', true)
                }
                $("#printDiv").append('<a href="/official/print-quotation/?quotation_number='+response[0]['quoation_number']+'" class="btn btn-info text-white">Print</a>')

                doorQuotationExists()
                kattlaQuotationExists()
                windowQuotationExists()
                customKattlaQuotationExists()
                otherQuotationExists()
                updateQuotationsIsSeen(qtNo)

            },
            400: function () {
                window.location.href = "/official/quotations/"
            },
            500: function () {
                window.location.href = "/official/quotations/"
            }
        }
    });
}


function doorQuotationExists() {
    $.ajax({
        url: "/officialapi/router/door-quotatation/?quotation_no=" + qtNo,
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
                    $("#doorTableDiv").show();
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=doorQuotationEditData(' + rowData['id'] + ',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteQuotation = '<button type="button" id="btnDelete" onClick=deleteDoorQuotation(' + rowData['id'] + ',this) value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    var images = '<button data-bs-toggle="modal" onclick="quotationDoorsImageModal('+rowData['id']+')" value='+rowData['id']+' data-bs-target="#ImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                    var row = $("<tr />")
                    $("#doorsQuotationTable").append(row);
                    row.append($("<td>" + rowData["name"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_height"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_width"] + "</td>"));
                    row.append($("<td>" + rowData["quantity"] + "</td>"));
                    row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    row.append($("<td>" + rowData["squarfeet"] + "</td>"));
                    row.append($("<td>" + rowData["unit_amount"] + "</td>"));
                    row.append($("<td>" + rowData["aggregate"] + "</td>"));
                    row.append($("<td>" + images + "</td>"));

                    // row.append($("<td>" + edit + "</td>"));
                    // row.append($("<td>" + deleteQuotation + "</td>"));
                }
            }
        }
    });

}

function kattlaQuotationExists() {
    $.ajax({
        url: "/officialapi/router/kattla-quotatation/?quotation_no=" + qtNo,
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
                    $("#kattlaTableDiv").show();
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=kattlaQuotationEditData(' + rowData['id'] + ',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteQuotation = '<button type="button" id="btnDeleteKattla" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    var images = '<button data-bs-toggle="modal" onclick="quotationKattlaImageModal('+rowData['id']+')" value='+rowData['id']+' data-bs-target="#ImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                    var row = $("<tr />")
                    $("#kattlaQuotatiionTable").append(row);
                    row.append($("<td>" + rowData["name"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_height"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_width"] + "</td>"));
                    row.append($("<td>" + rowData["quantity"] + "</td>"));
                    row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    row.append($("<td>" + rowData["qubic"] + "</td>"));
                    row.append($("<td>" + rowData["unit_amount"] + "</td>"));
                    row.append($("<td>" + rowData["aggregate"] + "</td>"));
                    row.append($("<td>" + images + "</td>"));
                    // row.append($("<td>" + edit + "</td>"));
                    // row.append($("<td>" + deleteQuotation + "</td>"));
                }
            }
        }
    });
}

function windowQuotationExists() {
    $.ajax({
        url: "/officialapi/router/window-quotatation/?quotation_no=" + qtNo,
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
                    $("#windowTableDiv").show();
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var row = $("<tr />")
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=windowQuotationEditData(' + rowData['id'] + ',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteQuotation = '<button type="button" id="btnDelete" onClick=deleteWindowQuotation(' + rowData['id'] + ',this) value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    var images = '<button data-bs-toggle="modal" onclick="quotationWindoImageModal('+rowData['id']+')" value='+rowData['id']+' data-bs-target="#ImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                    $("#windowQuotatiionTable").append(row);
                    row.append($("<td>" + rowData["name"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_height"] + "</td>"));
                    row.append($("<td>" + rowData["dimention_width"] + "</td>"));
                    row.append($("<td>" + rowData["quantity"] + "</td>"));
                    row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    row.append($("<td>" + rowData["squarfeet"] + "</td>"));
                    row.append($("<td>" + rowData["unit_amount"] + "</td>"));
                    row.append($("<td>" + rowData["aggregate"] + "</td>"));
                    row.append($("<td>" + images + "</td>"));
                    // row.append($("<td>" + edit + "</td>"));
                    // row.append($("<td>" + deleteQuotation + "</td>"));
                }

            }
        }
    });
}

function customKattlaQuotationExists() {
    $.ajax({
        url: "/officialapi/router/custom-kattla-quotatation/?quotation_no=" + qtNo,
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
                    $("#customKattlaTableDiv").show();
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var row = $("<tr />")
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=customKattlaQuotationEditData(' + rowData['id'] + ',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteQuotation = '<button type="button" id="btnDelete" onClick=deleteCustomKattlaQuotation(' + rowData['id'] + ',this) value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    var images = '<button data-bs-toggle="modal" onclick="quotationSizesImageModal('+rowData['id']+')" value='+rowData['id']+' data-bs-target="#ImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                    $("#customKattlaQuotatiionTable").append(row);
                    row.append($("<td>" + rowData["name"] + "</td>"));
                    row.append($("<td>" + rowData["length"] + "</td>"));
                    row.append($("<td>" + rowData["quantity"] + "</td>"));
                    row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    row.append($("<td>" + rowData["qubic"] + "</td>"));
                    row.append($("<td>" + rowData["unit_amount"] + "</td>"));
                    row.append($("<td>" + rowData["aggregate"] + "</td>"));
                    row.append($("<td>" + images + "</td>"));
                    // row.append($("<td>" + edit + "</td>"));
                    // row.append($("<td>" + deleteQuotation + "</td>"));
                }
            }
        }
    });
}

function otherQuotationExists() {
    $.ajax({
        url: "/userapi/router/other-product-quotation/?quotation_no=" + qtNo,
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
                    $("#otherProductTableDiv").show();
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var row = $("<tr />")
                    $("#otherProductQuotatiionTable").append(row);
                    row.append($("<td>" + rowData["name"] + "</td>"));
                    row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    row.append($("<td>" + rowData["price"] + "</td>"));
                    row.append($("<td>" + rowData["quantity"] + "</td>"));
                    row.append($("<td>" + rowData["aggregate"] + "</td>"));
                }
            }
        }
    });
}

function updateQuotationsIsSeen(id){
    data = {
        'is_seen':'True'
    }
    $.ajax({
        url: "/officialapi/router/qoutations/"+id+"/",
        type: "patch",
        data:data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                countData()
            }
        }

    });
}


