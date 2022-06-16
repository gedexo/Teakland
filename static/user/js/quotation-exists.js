
var searchParams = new URLSearchParams(window.location.search)
var quotationNumber = searchParams.get('quotation_number')
if (quotationNumber != null) {
    quotatationDetails()
}

var qtNo;
function quotatationDetails() {
    $.ajax({
        url: "/userapi/router/quotation/?quotation_number=" + quotationNumber,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                qtNo = response[0]['id']
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
                $("#printDiv").append('<a href="/print-quotation/?quotation_number='+response[0]['quoation_number']+'" class="btn btn-info text-white">Print</a>')

                if (response[0]['tax'] != null && response[0]['tax'] != 0) {
                    $("#taxPercentage").val(response[0]['tax'])
                    $("#taxChk").prop('checked', true)
                }
                doorQuotationExists()
                kattlaQuotationExists()
                windowQuotationExists()
                customKattlaQuotationExists()
                otherQuotationExists()
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


function doorQuotationExists() {
    $.ajax({
        url: "/userapi/router/door-quotatation/?quotation_no=" + qtNo,
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
                    var edit = '<a href="#" id='+rowData['id']+' onClick=doorQuotationEditData('+rowData['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
                    var deleteQuotation = '<button type="button" id="btnDelete" onClick=deleteDoorQuotation('+rowData['id']+',this) value='+rowData['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
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
                    row.append($("<td>" + edit + "</td>"));
                    row.append($("<td>" + deleteQuotation + "</td>"));
                    doorQuotationSubTotal()
                }
            }
        }
    });

}

function kattlaQuotationExists() {
    $.ajax({
        url: "/userapi/router/kattla-quotatation/?quotation_no=" + qtNo,
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
                    var edit = '<a href="#" id='+rowData['id']+' onClick=kattlaQuotationEditData('+rowData['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
                    var deleteQuotation = '<button type="button" id="btnDeleteKattla" value='+rowData['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
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
                    row.append($("<td>" + edit + "</td>"));
                    row.append($("<td>" + deleteQuotation + "</td>"));
                    kattlaQuotationSubTotal()
                }
            }
        }
    });
}

function windowQuotationExists() {
    $.ajax({
        url: "/userapi/router/window-quotatation/?quotation_no=" + qtNo,
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
                    var row = $("<tr />")
                    var edit = '<a href="#" id='+rowData['id']+' onClick=windowQuotationEditData('+rowData['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
                    var deleteQuotation = '<button type="button" id="btnDelete" onClick=deleteWindowQuotation('+rowData['id']+',this) value='+rowData['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
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
                    row.append($("<td>" + edit + "</td>"));
                    row.append($("<td>" + deleteQuotation + "</td>"));
                    windowQuotationSubTotal()
                }

            }
        }
    });
}

function customKattlaQuotationExists() {
    $.ajax({
        url: "/userapi/router/custom-kattla-quotatation/?quotation_no=" + qtNo,
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
                    var row = $("<tr />")
                    var edit = '<a href="#" id='+rowData['id']+' onClick=customKattlaQuotationEditData('+rowData['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
                    var deleteQuotation = '<button type="button" id="btnDelete" onClick=deleteCustomKattlaQuotation('+rowData['id']+',this) value='+rowData['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
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
                    row.append($("<td>" + edit + "</td>"));
                    row.append($("<td>" + deleteQuotation + "</td>"));
                    customKattlaQuotationSubTotal()
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
                    var row = $("<tr />")
                    var edit = '<a href="#" id='+rowData['id']+' onClick=otherProductQuotationEditData('+rowData['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
                    var deleteQuotation = '<button type="button" id="btnDelete" onClick=deleteCustomKattlaQuotation('+rowData['id']+',this) value='+rowData['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
                    $("#otherProductQuotatiionTable").append(row);
                    row.append($("<td>" + rowData["name"] + "</td>"));
                    row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    row.append($("<td>" + rowData["price"] + "</td>"));
                    row.append($("<td>" + rowData["quantity"] + "</td>"));
                    row.append($("<td>" + rowData["aggregate"] + "</td>"));
                    row.append($("<td>" + edit + "</td>"));
                    row.append($("<td>" + deleteQuotation + "</td>"));
                    otherProductQuotationSubTotal()
                }
            }
        }
    });
}