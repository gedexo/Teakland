$(document).ready(function () {
    $("#windowTableDiv").hide();
    $("#doorTableDiv").hide();
    $("#kattlaTableDiv").hide();
    $("#customKattlaTableDiv").hide();
    
});
factory();
var searchParams = new URLSearchParams(window.location.search)
var quotationNumber = searchParams.get('quotation_number')
var jobCardNo 
var invoiceNo
var categoryId
var jobCardId

if (quotationNumber != null) {
    quotatationDetails()
}

var qtNo;
function quotatationDetails() {
    $.ajax({
        url: "/userapi/router/quotation/"+quotationNumber+"/",
        type: "GET",
        async:false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#quotationNo").html(response['quoation_number'])
                jobCardNo = response['jobcard']
                invoiceNo = response['invoice']
                $("#customerName").html(response.customer['name'])
                $("#customerAddress").html(response.customer['address'])
                $("#customerPhone").html(response.customer['contact_no'])
                $("#jobcardNo").html(response['jobcard'])
                if (response['remark'] != null) {
                    $("#quotationRemark").append('Remark:', response['remark'])
                }
                qtNo = response['id']
                invoiceDetails()
                doorQuotationExists()
                kattlaQuotationExists()
                windowQuotationExists()
                customKattlaQuotationExists()
                othersQuotationExists()
                jobcardDeails()

            },
            400: function () {
                window.location.href = "/jobcard/"
            },
            500: function () {
                window.location.href = "/jobcard/"
            },
            
        }
    });
}

function jobcardDeails(){
    
    $.ajax({
        url: "/userapi/router/jobcard/?jobcard_number="+jobCardNo,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                var status
                jobCardId = response[0].id
                if(response[0].status == 'open'){                      
                    status = '<label class="badge badge-info">open</label>'
                }
                else if(response[0].status == 'onprocess'){
                    status = '<label class="badge badge-warning">onprocess</label>'
                }
                else if(response[0].status == 'pending'){
                    status = '<label class="badge badge-danger">pending</label>'
                }
                else if(response[0].status == 'partiallycompleted'){
                    status = '<label class="badge badge-primary">partiallycompleted</label>'
                   
                }
                else if(response[0].status == 'completed'){
                    status = '<label class="badge badge-primary">completed</label>'
                    $('[id=btn-factoryps]').hide();
                    $("#deliveredCheckBoxDiv").append('<label>Delivered</label>\
                    <input id="deliveredCheckBox" type="checkbox">')
                }
                else if(response[0].status == 'delivered'){
                    status = '<label class="badge badge-success">delivered</label>'
                    $('[id=btn-factoryps]').hide();
                    var edit = ''
                }
                $("#createdDate").html(response[0]['created_date'])
                $("#expectedDate").html(response[0]['expected_delivery'])
                $("#status").html(status)
            },
            400: function () {
                window.location.href = "/jobcard/"
            },
            500: function () {
                window.location.href = "/jobcard/"
            },
            
        }
    });
}


function invoiceDetails(){
    $.ajax({
        url: "/userapi/router/invoice/?invoice_number="+invoiceNo,
        type: "GET",
        async:false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                var balance 
                if(response[0].totalAmount == response[0].recievedAmount){
                    balance = '<label class="badge badge-success">completed</label>'
                }
                else{
                    balance = '<label class="badge badge-warning">Balance due</label>'
                }
                $("#paymentStatus").html(balance)
            },
            400: function () {
                window.location.href = "/jobcard/"
            },
            500: function () {
                window.location.href = "/jobcard/"
            },
            
        }
    });
}
function doorQuotationExists() {
    $.ajax({
        url: "/userapi/router/door-quotatation/?quotation_no=" + quotationNumber,
        type: "GET",
        async:false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                if (response.length > 0) {
                    $("#doorTableDiv").show();
                    $("#doorTitle").html('Doors');
                }
                else{
                    $("#doorTitleDiv").hide();
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var category = 1
                    var remark 
                    var factory
                    var url 
                    if(rowData.image['medium_square_crop'] != undefined){
                        url = rowData.image['medium_square_crop']
                    } 
                    else{
                        url = '#'
                    }
                    if(rowData.factory != null){
                        factory = rowData.factory['place']
                    }
                    else{
                        factory = '<p class="error">Not Assigned</p>'
                    }
                    if(rowData['remark'] != null){
                        remark = rowData['remark']
                    }
                    else{
                        remark = 'No remark'
                    }
                    var sqft = rowData["quantity"] * rowData["squarfeet"]
                    var status = '<label class="badge badge-info">open</label>'
                    if (rowData.status == 'open') {

                        status = '<label class="badge badge-info">open</label>'
                    }
                    else if (rowData.status == 'started') {
                        status = '<label class="badge badge-warning">started</label>'
                    }
                    else if (rowData.status == 'pending') {
                        status = '<label class="badge badge-danger">pending</label>'
                    }
                    else if (rowData.status == 'completed') {
                        status = '<label class="badge badge-success">completed</label>'
                    }
                    $("#doorJobCardDiv").append(' <div class="col-lg-4">\
                    <div class="card" style="border: 1px solid #e8e8e8; border-radius: none;margin: 5px;">\
                        <a href="'+url+'"><img class="card-img-top jbc-img" src="'+rowData.image['medium_square_crop']+'" alt="Card image cap" style="border-radius:20px"></a>\
                        <div class="card-body">\
                           <h5 class="card-title">Factory: <span id="doorFactory'+rowData['id']+'">'+factory+'</span><span class="btn-factory"><button id="btn-factoryps" onclick="JobcardUpdate('+rowData['id']+','+category+')"  class="btn-factory-add" ><i class="icofont-ui-add"></i></button><span></h5>\
                           <div class="row">\
                               <div class="col-6">\
                                   <p><b class="jb-b">Name:</b> <span id="doorName">'+rowData["name"]+'</span></p>\
                               </div>\
                               <div class="col-6">\
                                <p><b class="jb-b">Type:</b> <span id="doorType">'+rowData["type"]+'</span></p>\
                               </div>\
                           </div> \
                           <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Rawmaterial:</b> <span id="doorRawMaterial">'+rowData.raw_material['name']+'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Joint:</b> <span id="doorJoint">'+rowData["joint"]+'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Height:</b> <span id="doorHeight">'+rowData["dimention_height"]+'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Width:</b> <span id="doorWidth">'+rowData["dimention_width"]+'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Quantity:</b> <span id="doorQty">'+rowData["quantity"] +'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Sqft:</b> <span id="doorSqft">'+sqft+'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Status:</b> <span id="doorStatus">'+status+'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Remark:</b> <span id="doorRemark">'+remark+'</span></p>\
                            </div>\
                        </div>\
                        </div>\
                      </div>\
                </div>\
                    ')
                    // var row = $("<tr />")
                    // $("#doorsQuotationTable").append(row);
                    // row.append($("<td>" + rowData["name"] + "</td>"));
                    // row.append($("<td>" + rowData["type"] + "</td>"));
                    // row.append($("<td>" + rowData["joint"] + "</td>"));
                    // row.append($("<td>" + rowData["dimention_height"] + "</td>"));
                    // row.append($("<td>" + rowData["dimention_width"] + "</td>"));
                    // row.append($("<td>" + rowData["quantity"] + "</td>"));
                    // row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    // row.append($("<td>" + rowData["squarfeet"] + "</td>"));
                    // row.append($("<td>" + status + "</td>"));
                    // row.append($("<td>" + rowData["remark"] + "</td>"));

                }
            }
        }
    });

}

function kattlaQuotationExists() {
    $.ajax({
        url: "/userapi/router/kattla-quotatation/?quotation_no=" + qtNo,
        type: "GET",
        async:false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                if (response.length > 0) {
                    $("#kattlaTableDiv").show()
                    $("#kattlaTitle").html('Kattla');
                }
                else{
                    $("#kattlaTitleDiv").hide();

                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    category = 2 
                    var url 
                    var remark 
                    var factory
                    var qubic = rowData['quantity'] * rowData['qubic']
                    if(rowData.image['medium_square_crop'] != undefined){
                        url = rowData.image['medium_square_crop']
                    } 
                    else{
                        url = '#'
                    }
                    if(rowData.factory != null){
                        factory = rowData.factory['place']
                    }
                    else{
                        factory = '<p class="error">Not Assigned</p>'
                    }
                    if(rowData['remark'] != null){
                        remark = rowData['remark']
                    }
                    else{
                        remark = 'No remark'
                    }
                    var status = '<label class="badge badge-info">open</label>'
                    if (rowData.status == 'open') {

                        status = '<label class="badge badge-info">open</label>'
                    }
                    else if (rowData.status == 'started') {
                        status = '<label class="badge badge-warning">started</label>'
                    }
                    else if (rowData.status == 'pending') {
                        status = '<label class="badge badge-danger">pending</label>'
                    }
                    else if (rowData.status == 'completed') {
                        status = '<label class="badge badge-success">completed</label>'
                    }
                    $("#kattlaJobCardDiv").append(' <div class="col-lg-4">\
                    <div class="card" style="border: 1px solid #e8e8e8; border-radius: none;margin: 5px;">\
                        <a href="'+url+'"><img class="card-img-top jbc-img" src="'+rowData.image['medium_square_crop']+'" alt="No image" style="border-radius:20px"></a>\
                        <div class="card-body">\
                        <h5 class="card-title">Factory: <span id="kattlaFactory'+rowData['id']+'">'+factory+'</span><span class="btn-factory"><button id="btn-factoryps" onclick="JobcardUpdate('+rowData['id']+','+category+')"  class="btn-factory-add" ><i class="icofont-ui-add"></i></button><span></h5>\
                        <div class="row">\
                               <div class="col-6">\
                                   <p><b class="jb-b">Name:</b> <span id="windowName">'+rowData["name"]+'</span></p>\
                               </div>\
                               <div class="col-6">\
                                <p><b class="jb-b">Rawmaterial:</b> <span id="windowRawmaterial">'+rowData.raw_material['name']+'</span></p>\
                               </div>\
                           </div> \
                           <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Height:</b> <span id="windowHeight">'+rowData["dimention_height"] +'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Width:</b> <span id="windowWidth">'+rowData["dimention_width"] +'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Type:</b> <span id="windowShutter">'+rowData["type"]+'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Quantity:</b> <span id="windowDesign">'+ rowData["quantity"]+'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Thicknex_x:</b> <span id="windowQty">'+rowData["thickness_x"]+'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Thicknex_y:</b> <span id="windowBox">'+rowData["thickness_y"] +'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Status:</b> <span id="windowStatus">'+status+'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Qubic:</b> <span id="windowSqft">'+qubic+'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                        <div class="col-12">\
                         <p><b class="jb-b">Remark:</b> <span id="windowReamrk">'+remark+'</span></p>\
                        </div>\
                    </div>\
                        </div>\
                      </div>\
                </div>\
                    ')
                    // var edit = '<a id=' + rowData['id'] + ' onClick=kattlaQuotationEditData(' + rowData['id'] + ',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    // var deleteQuotation = '<button type="button" id="btnDeleteKattla" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    // var row = $("<tr />")
                    // $("#kattlaQuotatiionTable").append(row);
                    // row.append($("<td>" + rowData["name"] + "</td>"));
                    // row.append($("<td>" + rowData["type"] + "</td>"));
                    // row.append($("<td>" + rowData["thickness_x"] + "</td>"));
                    // row.append($("<td>" + rowData["thickness_y"] + "</td>"));
                    // row.append($("<td>" + rowData["dimention_height"] + "</td>"));
                    // row.append($("<td>" + rowData["dimention_width"] + "</td>"));
                    // row.append($("<td>" + rowData["quantity"] + "</td>"));
                    // row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    // row.append($("<td>" + rowData["qubic"] + "</td>"));
                    // row.append($("<td>" + status + "</td>"));
                    // row.append($("<td>" + rowData["remark"] + "</td>"));

                }
            }
        }
    });
}

function windowQuotationExists() {
    $.ajax({
        url: "/userapi/router/window-quotatation/?quotation_no=" + qtNo,
        type: "GET",
        async:false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                if (response.length > 0) {
                    $("#windowTableDiv").show();
                    $("#windowTitle").html('Window')
                }
                else{
                    $("#windowTitleDiv").hide();
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var factory
                    var url 
                    var remark 
                    var category = 3
                    if(rowData.factory != null){
                        factory = rowData.factory['place']
                    }
                    else{
                        factory = '<p class="error">Not Assigned</p>'
                    }
                    if(rowData.image['medium_square_crop'] != undefined){
                        url = rowData.image['medium_square_crop']
                    } 
                    else{
                        url = '#'
                    }
                    if(rowData['remark'] != null){
                        remark = rowData['remark']
                    }
                    else{
                        remark = 'No remark'
                    }
                    var sqft = rowData['quantity'] * rowData['squarfeet']
                    var status = '<label class="badge badge-info">open</label>'
                    if (rowData.status == 'open') {

                        status = '<label class="badge badge-info">open</label>'
                    }
                    else if (rowData.status == 'started') {
                        status = '<label class="badge badge-warning">started</label>'
                    }
                    else if (rowData.status == 'pending') {
                        status = '<label class="badge badge-danger">pending</label>'
                    }
                    else if (rowData.status == 'completed') {
                        status = '<label class="badge badge-success">completed</label>'
                    }
                    var shutter
                    var design
                    if (rowData.shutter != false) {
                        shutter = 'Yes'
                    }
                    else {
                        shutter = 'no'
                    }
                    if (rowData.design != false) {
                        design = 'yes'
                    }
                    else {
                        design = 'No'
                    }
                    $("#windowJobCardDiv").append(' <div class="col-lg-4">\
                    <div class="card" style="border: 1px solid #e8e8e8; border-radius: none;margin: 5px;">\
                        <a href="'+url+'"><img class="card-img-top jbc-img" src="'+rowData.image['medium_square_crop']+'" alt="No image" style="border-radius:20px"></a>\
                        <div class="card-body">\
                        <h5 class="card-title">Factory: <span id="windowFactory'+rowData['id']+'">'+factory+'</span><span class="btn-factory"><button id="btn-factoryps" onclick="JobcardUpdate('+rowData['id']+','+category+')"  class="btn-factory-add" ><i class="icofont-ui-add"></i></button><span></h5>\
                        <div class="row">\
                               <div class="col-6">\
                                   <p><b class="jb-b">Name:</b> <span id="windowName">'+rowData["name"]+'</span></p>\
                               </div>\
                               <div class="col-6">\
                                <p><b class="jb-b">Rawmaterial:</b> <span id="windowRawmaterial">'+rowData.raw_material['name']+'</span></p>\
                               </div>\
                           </div> \
                           <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Height:</b> <span id="windowHeight">'+rowData["dimention_height"] +'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Width:</b> <span id="windowWidth">'+rowData["dimention_width"] +'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Shutter:</b> <span id="windowShutter">'+shutter+'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Design:</b> <span id="windowDesign">'+design+'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Quantity:</b> <span id="windowQty">'+rowData["quantity"] +'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Box:</b> <span id="windowBox">'+rowData["box"]+'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Status:</b> <span id="windowStatus">'+status+'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Sqft:</b> <span id="windowSqft">'+sqft+'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                        <div class="col-12">\
                         <p><b class="jb-b">Remark:</b> <span id="windowReamrk">'+remark+'</span></p>\
                        </div>\
                    </div>\
                        </div>\
                      </div>\
                </div>\
                    ')
                    // var row = $("<tr />")
                    // var edit = '<a id=' + rowData['id'] + ' onClick=windowQuotationEditData(' + rowData['id'] + ',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    // var deleteQuotation = '<button type="button" id="btnDelete" onClick=deleteWindowQuotation(' + rowData['id'] + ',this) value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    // $("#windowQuotatiionTable").append(row);
                    // row.append($("<td>" + rowData["name"] + "</td>"));
                    // row.append($("<td>" + rowData["box"] + "</td>"));
                    // row.append($("<td>" + shutter + "</td>"));
                    // row.append($("<td>" + design + "</td>"));
                    // row.append($("<td>" + rowData["dimention_height"] + "</td>"));
                    // row.append($("<td>" + rowData["dimention_width"] + "</td>"));
                    // row.append($("<td>" + rowData["quantity"] + "</td>"));
                    // row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    // row.append($("<td>" + rowData["squarfeet"] + "</td>"));
                    // row.append($("<td>" + status + "</td>"));
                    // row.append($("<td>" + rowData["remark"] + "</td>"));

                }

            }
        }
    });
}

function customKattlaQuotationExists() {
    $.ajax({
        url: "/userapi/router/custom-kattla-quotatation/?quotation_no=" + qtNo,
        type: "GET",
        async:false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                if (response.length > 0) {
                    $("#customKattlaTableDiv").show();
                    $("#sizesTitle").html('sizes')
                }
                else{
                    $("#sizesTitleDiv").hide();
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var url 
                    var remark 
                    var category = 4
                    if(rowData.image['medium_square_crop'] != undefined){
                        url = rowData.image['medium_square_crop']
                    } 
                    else{
                        url = '#'
                    }
                    if(rowData.factory != null){
                        factory = rowData.factory['place']
                    }
                    else{
                        factory = '<p class="error">Not Assigned</p>'
                    }
                    if(rowData['remark'] != null){
                        remark = rowData['remark']
                    }
                    else{
                        remark = 'No remark'
                    }
                    var qubic = rowData['quantity'] * rowData['qubic']
                    var status = '<label class="badge badge-info">open</label>'
                    if (rowData.status == 'open') {

                        status = '<label class="badge badge-info">open</label>'
                    }
                    else if (rowData.status == 'started') {
                        status = '<label class="badge badge-warning">started</label>'
                    }
                    else if (rowData.status == 'pending') {
                        status = '<label class="badge badge-danger">pending</label>'
                    }
                    else if (rowData.status == 'completed') {
                        status = '<label class="badge badge-success">completed</label>'
                    }
                    $("#sizesJobCardDiv").append(' <div class="col-lg-4">\
                    <div class="card" style="border: 1px solid #e8e8e8; border-radius: none;margin: 5px;">\
                        <a href="'+url+'"><img class="card-img-top jbc-img" src="'+rowData.image['medium_square_crop']+'" alt="No image" style="border-radius:20px"></a>\
                        <div class="card-body">\
                        <h5 class="card-title">Factory: <span id="sizesFactory'+rowData['id']+'">'+factory+'</span><span class="btn-factory"><button id="btn-factoryps" onclick="JobcardUpdate('+rowData['id']+','+category+')"  class="btn-factory-add" ><i class="icofont-ui-add"></i></button><span></h5>\
                           <div class="row">\
                               <div class="col-6">\
                                   <p><b class="jb-b">Name:</b> <span id="windowName">'+rowData["name"]+'</span></p>\
                               </div>\
                               <div class="col-6">\
                                <p><b class="jb-b">Rawmaterial:</b> <span id="windowRawmaterial">'+rowData.raw_material['name']+'</span></p>\
                               </div>\
                           </div> \
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Length:</b> <span id="windowShutter">'+rowData["length"]+'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Quantity:</b> <span id="windowDesign">'+ rowData["quantity"]+'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Thicknex_x:</b> <span id="windowQty">'+rowData["thickness_x"]+'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Thicknex_y:</b> <span id="windowBox">'+rowData["thickness_y"] +'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Status:</b> <span id="windowStatus">'+status+'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Qubic:</b> <span id="windowSqft">'+qubic+'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                        <div class="col-12">\
                         <p><b class="jb-b">Remark:</b> <span id="windowReamrk">'+remark+'</span></p>\
                        </div>\
                    </div>\
                        </div>\
                      </div>\
                </div>\
                    ')
                    // var row = $("<tr />")
                    // var edit = '<a id=' + rowData['id'] + ' onClick=customKattlaQuotationEditData(' + rowData['id'] + ',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    // var deleteQuotation = '<button type="button" id="btnDelete" onClick=deleteCustomKattlaQuotation(' + rowData['id'] + ',this) value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    // $("#customKattlaQuotatiionTable").append(row);
                    // row.append($("<td>" + rowData["name"] + "</td>"));
                    // row.append($("<td>" + rowData["length"] + "</td>"));
                    // row.append($("<td>" + rowData["thickness_x"] + "</td>"));
                    // row.append($("<td>" + rowData["thickness_y"] + "</td>"));
                    // row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    // row.append($("<td>" + rowData["quantity"] + "</td>"));
                    // row.append($("<td>" + rowData["qubic"] + "</td>"));
                    // row.append($("<td>" + status + "</td>"));
                    // row.append($("<td>" + rowData["remark"] + "</td>"));

                }
            }
        }
    });
}


function othersQuotationExists() {
    $.ajax({
        url: "/userapi/router/other-product-quotation/?quotation_no=" + qtNo,
        type: "GET",
        async:false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                if (response.length > 0) {
                    $("#othersJobCardDiv").show();
                    $("#othersTitle").html('Other products')
                }
                else{
                    $("#othersTitleDiv").hide();
                }
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var factory
                    var remark
                    var category = 5
                    if(rowData.factory != null){
                        factory = rowData.factory['place']
                    }
                    else{
                        factory = '<p class="error">Not Assigned</p>'
                    }
                    if(rowData['remark'] != null){
                        remark = rowData['remark']
                    }
                    else{
                        remark = 'No remark'
                    }
                    var status = '<label class="badge badge-info">open</label>'
                    if (rowData.status == 'open') {

                        status = '<label class="badge badge-info">open</label>'
                    }
                    else if (rowData.status == 'started') {
                        status = '<label class="badge badge-warning">started</label>'
                    }
                    else if (rowData.status == 'pending') {
                        status = '<label class="badge badge-danger">pending</label>'
                    }
                    else if (rowData.status == 'completed') {
                        status = '<label class="badge badge-success">completed</label>'
                    }
                    $("#othersJobCardDiv").append(' <div class="col-lg-4">\
                    <div class="card" style="border: 1px solid #e8e8e8; border-radius: none;margin: 5px;">\
                        <div class="card-body">\
                        <h5 class="card-title">Factory: <span id="othersFactory'+rowData['id']+'">'+factory+'</span><span class="btn-factory"><button id="btn-factoryps" onclick="JobcardUpdate('+rowData['id']+','+category+')"  class="btn-factory-add" ><i class="icofont-ui-add"></i></button><span></h5>\
                           <div class="row">\
                               <div class="col-6">\
                                   <p><b class="jb-b">Name:</b> <span id="windowName">'+rowData["name"]+'</span></p>\
                               </div>\
                               <div class="col-6">\
                                <p><b class="jb-b">Rawmaterial:</b> <span id="windowRawmaterial">'+rowData.raw_material['name']+'</span></p>\
                               </div>\
                           </div> \
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Type:</b> <span id="windowShutter">'+rowData["type"]+'</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Quantity:</b> <span id="windowDesign">'+ rowData["quantity"]+'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                        <div class="col-6">\
                            <p><b class="jb-b">Status:</b> <span id="windowShutter">'+status+'</span></p>\
                        </div>\
                        <div class="col-6">\
                         <p><b class="jb-b">Remark:</b> <span id="windowDesign">'+remark+'</span></p>\
                        </div>\
                    </div>\
                        </div>\
                      </div>\
                </div>\
                    ')
                    // var row = $("<tr />")
                    // var edit = '<a id=' + rowData['id'] + ' onClick=customKattlaQuotationEditData(' + rowData['id'] + ',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    // var deleteQuotation = '<button type="button" id="btnDelete" onClick=deleteCustomKattlaQuotation(' + rowData['id'] + ',this) value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    // $("#customKattlaQuotatiionTable").append(row);
                    // row.append($("<td>" + rowData["name"] + "</td>"));
                    // row.append($("<td>" + rowData["length"] + "</td>"));
                    // row.append($("<td>" + rowData["thickness_x"] + "</td>"));
                    // row.append($("<td>" + rowData["thickness_y"] + "</td>"));
                    // row.append($("<td>" + rowData.raw_material['name'] + "</td>"));
                    // row.append($("<td>" + rowData["quantity"] + "</td>"));
                    // row.append($("<td>" + rowData["qubic"] + "</td>"));
                    // row.append($("<td>" + status + "</td>"));
                    // row.append($("<td>" + rowData["remark"] + "</td>"));

                }
            }
        }
    });
}

function factory() {
    $.ajax({
        url: "/officialapi/router/factory/",
        type: "GET",
        async:false,
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
                    $("select[name=factory]").append($('<option>').text(rowData['place']).attr('value', rowData['id']));
                }
            }
        }
    });
}

function JobcardUpdate(id,category){
    $("#jobCardModal").modal('show');
    $("#jobcardId").val(id)
    categoryId = category
}

$("#jobCardForm").submit(function(){
    data = $("#jobCardForm").serializeArray();
    if(categoryId == 1){
        doorJobCardUpdate(data)
    }
    else if(categoryId == 2){
        kattlaJobCardUpdate(data)
    }
    else if(categoryId == 3){
        windowJobCardUpdate(data)
    }
    else if(categoryId == 4){
        sizesJobCardUpdate(data)
    }
    else if(categoryId == 5){
        othersJobCardUpdate(data)
    }
    return false;
});

function doorJobCardUpdate(data){
    var factory =  $("#factory option:selected").text();
    var id = $("#jobcardId").val();
    $.ajax({
        url: "/userapi/router/door-quotatation/"+id+"/",
        type: "patch",
        data:data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#jobCardModal").modal('hide');
                $("#doorFactory"+id).html(factory)
            }
        }

    });
}


function kattlaJobCardUpdate(data){
    var factory =  $("#factory option:selected").text();
    var id = $("#jobcardId").val();
    $.ajax({
        url: "/userapi/router/kattla-quotatation/"+id+"/",
        type: "patch",
        data:data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#jobCardModal").modal('hide');
                $("#kattlaFactory"+id).html(factory)
            }
        }

    });
}

function windowJobCardUpdate(data){
    var factory =  $("#factory option:selected").text();
    var id = $("#jobcardId").val();
    $.ajax({
        url: "/userapi/router/window-quotatation/"+id+"/",
        type: "patch",
        data:data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#jobCardModal").modal('hide');
                $("#windowFactory"+id).html(factory)
            }
        }

    });
}

function sizesJobCardUpdate(data){
    var factory =  $("#factory option:selected").text();
    var id = $("#jobcardId").val();
    $.ajax({
        url: "/userapi/router/custom-kattla-quotatation/"+id+"/",
        type: "patch",
        data:data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#jobCardModal").modal('hide');
                $("#sizesFactory"+id).html(factory)
            }
        }

    });
}

function othersJobCardUpdate(data){
    var factory =  $("#factory option:selected").text();
    var id = $("#jobcardId").val();
    $.ajax({
        url: "/userapi/router/other-product-quotation/"+id+"/",
        type: "patch",
        data:data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#jobCardModal").modal('hide');
                $("#othersFactory"+id).html(factory)
            }
        }

    });
}


$(document).on('change', '#deliveredCheckBox', function() {
    data = {
        'status': 'delivered',
    }
    $.ajax({
        url: "/factoryapi/router/jobcard/" + jobCardId + "/?is_delivered=true",
        type: "PATCH",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                swal("Success! Delivered Successfully!", {
                    icon: "success",
                });
            },
            406: function (response) {
                swal("Oops!Bill Amount is due!", {
                    icon: "error",
                });
            },
            208: function (response) {
                swal("Oops!Please update all status!", {
                    icon: "error",
                });
            }
        }
    })
});
