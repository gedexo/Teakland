
$(document).ready(function () {
    $("#windowTableDiv").hide();
    $("#doorTableDiv").hide();
    $("#kattlaTableDiv").hide();
    $("#customKattlaTableDiv").hide();
});

var searchParams = new URLSearchParams(window.location.search)
var quotationNumber = searchParams.get('quotation_number')
var jobCardNo
var jobCardId
var invoiceNo
var categoryId

if (quotationNumber != null) {
    quotatationDetails()
}

var qtNo;
function quotatationDetails() {
    $.ajax({
        url: "/userapi/router/quotation/" + quotationNumber + "/",
        type: "GET",
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
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
                jobcardDeails()
                invoiceDetails()
                doorQuotationExists()
                kattlaQuotationExists()
                windowQuotationExists()
                customKattlaQuotationExists()
                othersQuotationExists()
            },
            400: function () {
                window.location.href = "/factory/jobcard/"
            },
            500: function () {
                window.location.href = "/factory/jobcard/"
            },

        }
    });
}


function jobcardDeails() {
    $.ajax({
        url: "/factoryapi/router/jobcard/?jobcard_number=" + jobCardNo,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                jobCardId = response[0]['id']
                var statusUpdate = ['open', 'onprocess', 'pending', 'partiallycompleted' ,'completed']
                var status
                if (response[0].status == 'open') {
                    status = '<label class="badge badge-info">open</label>'
                    var removeItem = ['open']
                    statusJcd = statusUpdate.filter(item => !removeItem.includes(item))
                }
                else if (response[0].status == 'onprocess') {
                    status = '<label class="badge badge-warning">onprocess</label>'
                    var removeItem = ['open']
                    statusUpdate = statusUpdate.filter(item => !removeItem.includes(item))
                }
                else if (response[0].status == 'pending') {
                    status = '<label class="badge badge-danger">pending</label>'
                    var removeItem = ['open', 'onprocess']
                    statusUpdate = statusUpdate.filter(item => !removeItem.includes(item))

                }
                else if (response[0].status == 'completed') {
                    status = '<label class="badge badge-primary">completed</label>'
                    var removeItem = ['open', 'onprocess', 'pending']
                    statusUpdate = statusUpdate.filter(item => !removeItem.includes(item))
                }
                else if (response[0].status == 'partiallycompleted') {
                    status = '<label class="badge badge-primary">partiallycompleted</label>'
                    $.ajax({
                        url:"/factoryapi/check-jobcard/"+jobCardId+"/",
                        type:"GET",
                        type: "GET",
                        async:false,
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader(
                                "Authorization",
                                "Bearer " + localStorage.getItem("factoryaccesstoken")
                            );
                        },
                        statusCode: {
                            200: function (response) {
                                if(response.data == true){
                                    var removeItem = ['open', 'onprocess', 'pending']
                                    statusUpdate = statusUpdate.filter(item => !removeItem.includes(item))
                                }
                                else{
                                    var removeItem = ['open', 'onprocess', 'pending','partiallycompleted','completed']
                                    statusUpdate = statusUpdate.filter(item => !removeItem.includes(item))
                                }
                            }
                        }
                    })
                }
                else if (response[0].status == 'delivered') {
                    status = '<label class="badge badge-success">delivered</label>'
                    var edit = ''
                }
                $("#createdDate").html(response[0]['created_date'])
                $("#expectedDate").html(response[0]['expected_delivery'])
                $("#status").html(status)
                var option = '';
                console.log(statusUpdate)
                for (var i = 0; i < statusUpdate.length; i++) {
                    option += '<option value="' + statusUpdate[i] + '">' + statusUpdate[i] + '</option>';
                }
                $('#jobcardStatus').append(option);
            },
            400: function () {
                window.location.href = "/factory/jobcard/"
            },
            500: function () {
                window.location.href = "/factory/jobcard/"
            },

        }
    });
}


function invoiceDetails() {
    $.ajax({
        url: "/userapi/router/invoice/?invoice_number=" + invoiceNo,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                var balance
                if (response[0].totalAmount == response[0].recievedAmount) {
                    balance = '<label class="badge badge-success">completed</label>'
                }
                else {
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
        url: "/userapi/router/door-quotatation/?quotation_no=" + quotationNumber + "&factory=true",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                if (response.length > 0) {
                    $("#doorTableDiv").show();
                    $("#doorTitle").html('Doors')
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
                    var sts = rowData['status']
                    var factoryAmount = rowData['quantity'] * rowData['factory_unitamount']
                    if(rowData.image['medium_square_crop'] != undefined){
                        url = rowData.image['medium_square_crop']
                    } 
                    else{
                        url = '#'
                    }
                    if (rowData.factory != null) {
                        factory = rowData.factory['place']
                    }
                    else {
                        factory = '<p class="error">Not Assigned</p>'
                    }
                    if (rowData['remark'] != null) {
                        remark = rowData['remark']
                    }
                    else {
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
                        <a href="'+ url + '"><img class="card-img-top jbc-img" src="' + rowData.image['medium_square_crop'] + '" alt="Card image cap" style="border-radius:20px"></a>\
                        <div class="card-body">\
                        <input type="text" value='+ rowData['remark'] + ' id="doorRemark' + rowData['id'] + '" hidden>\
                        <input type="text" value='+ rowData['status'] + ' id="doorStatus' + rowData['id'] + '" hidden>\
                           <h5 class="card-title"> <span id="doorFactory'+ rowData['id'] + '"></span><span class="btn-factory"><button onclick="JobcardUpdate(' + rowData['id'] + ',' + category + ')"  class="btn-factory-add" ><i class="icofont-ui-edit"></i></button><span></h5>\
                           <div class="row">\
                               <div class="col-6">\
                                   <p><b class="jb-b">Name:</b> <span id="doorName">'+ rowData["name"] + '</span></p>\
                               </div>\
                               <div class="col-6">\
                                <p><b class="jb-b">Type:</b> <span id="doorType">'+ rowData["type"] + '</span></p>\
                               </div>\
                           </div> \
                           <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Rawmaterial:</b> <span id="doorRawMaterial">'+ rowData.raw_material['name'] + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Joint:</b> <span id="doorJoint">'+ rowData["joint"] + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Height:</b> <span id="doorHeight">'+ rowData["dimention_height"] + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Width:</b> <span id="doorWidth">'+ rowData["dimention_width"] + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Quantity:</b> <span id="doorQty">'+ rowData["quantity"] + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Sqft:</b> <span id="doorSqft">'+ sqft + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Amount:</b> <span id="">'+ factoryAmount +'</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Status:</b> <span id="updateStatus'+ rowData['id'] + '">' + status + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Remark:</b> <span id="updateRemark'+ rowData['id'] + '">' + remark + '</span></p>\
                            </div>\
                        </div>\
                        </div>\
                      </div>\
                </div>\
                    ')
                }
            }
        }
    });

}

function kattlaQuotationExists() {
    $.ajax({
        url: "/userapi/router/kattla-quotatation/?quotation_no=" + qtNo + "&factory=true",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                if (response.length > 0) {
                    $("#kattlaTableDiv").show();
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
                    var factoryAmount = rowData['quantity'] * rowData['factory_unitamount']
                    var qubic = rowData['quantity'] * rowData['qubic']
                    if (rowData.image['medium_square_crop'] != undefined) {
                        url = rowData.image['medium_square_crop']
                    }
                    else {
                        url = '#'
                    }
                    if (rowData.factory != null) {
                        factory = rowData.factory['place']
                    }
                    else {
                        factory = '<p class="error">Not Assigned</p>'
                    }
                    if (rowData['remark'] != null) {
                        remark = rowData['remark']
                    }
                    else {
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
                        <a href="'+ url + '"><img class="card-img-top jbc-img" src="' + rowData.image['medium_square_crop'] + '" alt="No image" style="border-radius:20px"></a>\
                        <div class="card-body">\
                        <h5 class="card-title"><span id="kattlaFactory'+ rowData['id'] + '"></span><span class="btn-factory"><button onclick="JobcardUpdate(' + rowData['id'] + ',' + category + ')"  class="btn-factory-add" ><i class="icofont-ui-edit"></i></button><span></h5>\
                        <div class="row">\
                        <input type="text" value='+ rowData['remark'] + ' id="kattlaRemark' + rowData['id'] + '" hidden>\
                        <input type="text" value='+ rowData['status'] + ' id="kattlaStatus' + rowData['id'] + '" hidden>\
                               <div class="col-6">\
                                   <p><b class="jb-b">Name:</b> <span id="windowName">'+ rowData["name"] + '</span></p>\
                               </div>\
                               <div class="col-6">\
                                <p><b class="jb-b">Rawmaterial:</b> <span id="windowRawmaterial">'+ rowData.raw_material['name'] + '</span></p>\
                               </div>\
                           </div> \
                           <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Height:</b> <span id="windowHeight">'+ rowData["dimention_height"] + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Width:</b> <span id="windowWidth">'+ rowData["dimention_width"] + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Type:</b> <span id="windowShutter">'+ rowData["type"] + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Quantity:</b> <span id="windowDesign">'+ rowData["quantity"] + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Thicknex_x:</b> <span id="windowQty">'+ rowData["thickness_x"] + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Thicknex_y:</b> <span id="windowBox">'+ rowData["thickness_y"] + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Status:</b> <span id="updateKattlaStatus'+rowData['id']+'">'+ status + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Qubic:</b> <span id="windowSqft">'+ qubic + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                        <div class="col-6">\
                            <p><b class="jb-b">Amount:</b> <span>'+ factoryAmount + '</span></p>\
                        </div>\
                    </div>\
                        <div class="row">\
                        <div class="col-12">\
                         <p><b class="jb-b">Remark:</b> <span id="updateKattlaRemark'+rowData['id']+'">'+ remark + '</span></p>\
                        </div>\
                    </div>\
                        </div>\
                      </div>\
                </div>\
                    ')
                }
            }
        }
    });
}

function windowQuotationExists() {
    $.ajax({
        url: "/userapi/router/window-quotatation/?quotation_no=" + qtNo + "&factory=true",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
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
                    var factoryAmount = rowData['quantity'] * rowData['factory_unitamount']
                    if (rowData.factory != null) {
                        factory = rowData.factory['place']
                    }
                    else {
                        factory = '<p class="error">Not Assigned</p>'
                    }
                    if (rowData.image['medium_square_crop'] != undefined) {
                        url = rowData.image['medium_square_crop']
                    }
                    else {
                        url = '#'
                    }
                    if (rowData['remark'] != null) {
                        remark = rowData['remark']
                    }
                    else {
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
                        <a href="'+ url + '"><img class="card-img-top jbc-img" src="' + rowData.image['medium_square_crop'] + '" alt="No image" style="border-radius:20px"></a>\
                        <div class="card-body">\
                        <h5 class="card-title"><span id="windowFactory'+ rowData['id'] + '"></span><span class="btn-factory"><button onclick="JobcardUpdate(' + rowData['id'] + ',' + category + ')"  class="btn-factory-add" ><i class="icofont-ui-edit"></i></button><span></h5>\
                        <div class="row">\
                        <input type="text" value='+ rowData['remark'] + ' id="windowRemark' + rowData['id'] + '" hidden>\
                        <input type="text" value='+ rowData['status'] + ' id="windowStatus' + rowData['id'] + '" hidden>\
                               <div class="col-6">\
                                   <p><b class="jb-b">Name:</b> <span id="windowName">'+ rowData["name"] + '</span></p>\
                               </div>\
                               <div class="col-6">\
                                <p><b class="jb-b">Rawmaterial:</b> <span id="windowRawmaterial">'+ rowData.raw_material['name'] + '</span></p>\
                               </div>\
                           </div> \
                           <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Height:</b> <span id="windowHeight">'+ rowData["dimention_height"] + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Width:</b> <span id="windowWidth">'+ rowData["dimention_width"] + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Shutter:</b> <span id="windowShutter">'+ shutter + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Design:</b> <span id="windowDesign">'+ design + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Quantity:</b> <span id="windowQty">'+ rowData["quantity"] + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Box:</b> <span id="windowBox">'+ rowData["box"] + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Status:</b> <span id="updateWindowStatus'+rowData['id']+'">'+ status + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Sqft:</b> <span id="windowSqft">'+ sqft + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                             <p><b class="jb-b">Amount:</b> <span id="windowSqft">'+ factoryAmount + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                        <div class="col-12">\
                         <p><b class="jb-b">Remark:</b> <span id="updateWindowRemark'+rowData['id']+'">'+ remark + '</span></p>\
                        </div>\
                    </div>\
                        </div>\
                      </div>\
                </div>\
                    ')
                }

            }
        }
    });
}

function customKattlaQuotationExists() {
    $.ajax({
        url: "/userapi/router/custom-kattla-quotatation/?quotation_no=" + qtNo + "&factory=true",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
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
                    var factoryAmount = rowData['quantity'] * rowData['factory_unitamount']
                    if (rowData.image['medium_square_crop'] != undefined) {
                        url = rowData.image['medium_square_crop']
                    }
                    else {
                        url = '#'
                    }
                    if (rowData.factory != null) {
                        factory = rowData.factory['place']
                    }
                    else {
                        factory = '<p class="error">Not Assigned</p>'
                    }
                    if (rowData['remark'] != null) {
                        remark = rowData['remark']
                    }
                    else {
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
                        <a href="'+ url + '"><img class="card-img-top jbc-img" src="' + rowData.image['medium_square_crop'] + '" alt="No image" style="border-radius:20px"></a>\
                        <div class="card-body">\
                        <h5 class="card-title"><span id="sizesFactory'+ rowData['id'] + '"></span><span class="btn-factory"><button onclick="JobcardUpdate(' + rowData['id'] + ',' + category + ')"  class="btn-factory-add" ><i class="icofont-ui-edit"></i></button><span></h5>\
                           <div class="row">\
                           <input type="text" value='+ rowData['remark'] + ' id="sizesRemark' + rowData['id'] + '" hidden>\
                           <input type="text" value='+ rowData['status'] + ' id="sizesStatus' + rowData['id'] + '" hidden>\
                               <div class="col-6">\
                                   <p><b class="jb-b">Name:</b> <span id="windowName">'+ rowData["name"] + '</span></p>\
                               </div>\
                               <div class="col-6">\
                                <p><b class="jb-b">Rawmaterial:</b> <span id="windowRawmaterial">'+ rowData.raw_material['name'] + '</span></p>\
                               </div>\
                           </div> \
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Length:</b> <span id="windowShutter">'+ rowData["length"] + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Quantity:</b> <span id="windowDesign">'+ rowData["quantity"] + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Thicknex_x:</b> <span id="windowQty">'+ rowData["thickness_x"] + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Thicknex_y:</b> <span id="windowBox">'+ rowData["thickness_y"] + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Status:</b> <span id="updateSizesStatus'+rowData['id']+'">'+ status + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Qubic:</b> <span id="windowSqft">'+ qubic + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                        <div class="col-6">\
                         <p><b class="jb-b">Amount:</b> <span id="windowSqft">'+ factoryAmount + '</span></p>\
                        </div>\
                    </div>\
                        <div class="row">\
                        <div class="col-12">\
                         <p><b class="jb-b">Remark:</b> <span id="updateSizesRemark'+rowData['id']+'">'+ remark + '</span></p>\
                        </div>\
                    </div>\
                        </div>\
                      </div>\
                </div>\
                    ')
                }
            }
        }
    });
}


function othersQuotationExists() {
    $.ajax({
        url: "/userapi/router/other-product-quotation/?quotation_no=" + qtNo + "&factory=true",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
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
                    if (rowData.factory != null) {
                        factory = rowData.factory['place']
                    }
                    else {
                        factory = '<p class="error">Not Assigned</p>'
                    }
                    if (rowData['remark'] != null) {
                        remark = rowData['remark']
                    }
                    else {
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
                        <h5 class="card-title"><span id="othersFactory'+ rowData['id'] + '"></span><span class="btn-factory"><button onclick="JobcardUpdate(' + rowData['id'] + ',' + category + ')"  class="btn-factory-add" ><i class="icofont-ui-edit"></i></button><span></h5>\
                           <div class="row">\
                           <input type="text" value='+ rowData['remark'] + ' id="othersRemark' + rowData['id'] + '" hidden>\
                           <input type="text" value='+ rowData['status'] + ' id="othersStatus' + rowData['id'] + '" hidden>\
                               <div class="col-6">\
                                   <p><b class="jb-b">Name:</b> <span id="windowName">'+ rowData["name"] + '</span></p>\
                               </div>\
                               <div class="col-6">\
                                <p><b class="jb-b">Rawmaterial:</b> <span id="windowRawmaterial">'+ rowData.raw_material['name'] + '</span></p>\
                               </div>\
                           </div> \
                        <div class="row">\
                            <div class="col-6">\
                                <p><b class="jb-b">Type:</b> <span id="windowShutter">'+ rowData["type"] + '</span></p>\
                            </div>\
                            <div class="col-6">\
                             <p><b class="jb-b">Quantity:</b> <span id="windowDesign">'+ rowData["quantity"] + '</span></p>\
                            </div>\
                        </div>\
                        <div class="row">\
                        <div class="col-6">\
                            <p><b class="jb-b">Status:</b> <span id="updateOthersStatus'+rowData['id']+'">'+ status + '</span></p>\
                        </div>\
                        <div class="col-6">\
                         <p><b class="jb-b">Remark:</b> <span id="updateOthersRemark'+rowData['id']+'">'+ remark + '</span></p>\
                        </div>\
                    </div>\
                        </div>\
                      </div>\
                </div>\
                    ')
                }
            }
        }
    });
}


$("#jobcardStatus").change(function () {
    var status = $(this).val();
    data = {
        'status': status,
        'is_seen': 'True',
    }
    $.ajax({
        url: "/factoryapi/router/jobcard/" + jobCardId + "/",
        type: "PATCH",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                swal("Success! Updated Successfully!", {
                    icon: "success",
                });
                status(status)
                countData()

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
    });
});



function status(status) {
    var statusUpdate = status
    if (status == 'open') {
        statusUpdate = '<label class="badge badge-info">open</label>'
    }
    else if (status == 'onprocess') {
        statusUpdate = '<label class="badge badge-warning">onprocess</label>'
    }
    else if (status == 'pending') {
        statusUpdate = '<label class="badge badge-danger">pending</label>'
    }
    else if (status == 'partiallycompleted') {
        statusUpdate = '<label class="badge badge-danger">partiallycompleted</label>'
    }
    else if (status == 'completed') {
        statusUpdate = '<label class="badge badge-primary">completed</label>'
    }
    else if (status == 'delivered') {
        statusUpdate = '<label class="badge badge-success">delivered</label>'
    }
    $("#status").html(statusUpdate)

}



function JobcardUpdate(id, category) {
    var status = ['open', 'started', 'pending', 'completed']
    categoryId = category
    var sts
    if (category == 1) {
        sts = $("#doorStatus" + id).val();
    }
    else if(category == 2){
        sts = $("#kattlaStatus" + id).val();
    }
    else if(category == 3){
        sts = $("#windowStatus" + id).val();
    }
    else if(category == 4){
        sts = $("#sizesStatus" + id).val();
    }
    else if(category == 5){
        sts = $("#othersStatus" + id).val();
    }
    if (sts == 'started') {
        var removeItem = ['open']
        status = status.filter(item => !removeItem.includes(item))
    }
    else if (sts == 'pending') {
        var removeItem = ['open', 'started']
        status = status.filter(item => !removeItem.includes(item))
    }
    else if (sts == 'completed') {
        var removeItem = ['open', 'started' , 'pending']
        status = status.filter(item => !removeItem.includes(item))
    }
    var option = '';
    for (var i = 0; i < status.length; i++) {
        option += '<option value="' + status[i] + '">' + status[i] + '</option>';
    }
    $("[id=jobCardQtStatus]").empty();
    $("[id=jobCardQtStatus]").append(option);
    if (categoryId == 1) {
        var remark = $("#doorRemark" + id).val()
        $("#jobCardQtRemarks").val(remark)
    }
    else if (categoryId == 2) {
        var remark = $("#kattlaRemark" + id).val()
        $("#jobCardQtRemarks").val(remark)
    }
    else if (categoryId == 3) {
        var remark = $("#windowRemark" + id).val()
        $("#jobCardQtRemarks").val(remark)
    }
    else if (categoryId == 4) {
        var remark = $("#sizesRemark" + id).val()
        $("#jobCardQtRemarks").val(remark)
    }
    else if (categoryId == 5) {
        var remark = $("#othersRemark" + id).val()
        $("#jobCardQtRemarks").val(remark)
    }
    $("#jobCardModal").modal('show');
    $("#jobcardId").val(id)
    $("#jobCardQtStatus").val(sts)
    categoryId = category
}

$("#jobCardForm").submit(function () {
    data = $("#jobCardForm").serializeArray();
    if (categoryId == 1) {
        doorJobCardUpdate(data)
    }
    else if (categoryId == 2) {
        kattlaJobCardUpdate(data)
    }
    else if (categoryId == 3) {
        windowJobCardUpdate(data)
    }
    else if (categoryId == 4) {
        sizesJobCardUpdate(data)
    }
    else if (categoryId == 5) {
        othersJobCardUpdate(data)
    }
    return false;
});

function doorJobCardUpdate(data) {
    var id = $("#jobcardId").val();
    var remark = $("#jobCardQtRemarks").val()
    var sts = $("#jobCardQtStatus").val()
    $.ajax({
        url: "/userapi/router/door-quotatation/" + id + "/",
        type: "patch",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#jobCardModal").modal('hide');
                $("#updateRemark" + id).html(remark)
                var status = '<label class="badge badge-info">open</label>'
                if (sts == 'open') {

                    status = '<label class="badge badge-info">open</label>'
                }
                else if (sts == 'started') {
                    status = '<label class="badge badge-warning">started</label>'
                }
                else if (sts == 'pending') {
                    status = '<label class="badge badge-danger">pending</label>'
                }
                else if (sts == 'completed') {
                    status = '<label class="badge badge-success">completed</label>'
                }
                $("#updateStatus" + id).html(status)

            }
        }

    });
}


function kattlaJobCardUpdate(data) {
    var remark = $("#jobCardQtRemarks").val()
    var sts = $("#jobCardQtStatus").val()
    var id = $("#jobcardId").val();
    $.ajax({
        url: "/userapi/router/kattla-quotatation/" + id + "/",
        type: "patch",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#jobCardModal").modal('hide');
                $("#updateKattlaRemark" + id).html(remark)
                var status = '<label class="badge badge-info">open</label>'
                if (sts == 'open') {

                    status = '<label class="badge badge-info">open</label>'
                }
                else if (sts == 'started') {
                    status = '<label class="badge badge-warning">started</label>'
                }
                else if (sts == 'pending') {
                    status = '<label class="badge badge-danger">pending</label>'
                }
                else if (sts == 'completed') {
                    status = '<label class="badge badge-success">completed</label>'
                }
                $("#updateKattlaStatus" + id).html(status)
            }
        }

    });
}

function windowJobCardUpdate(data) {
    var remark = $("#jobCardQtRemarks").val()
    var sts = $("#jobCardQtStatus").val()
    var id = $("#jobcardId").val();
    $.ajax({
        url: "/userapi/router/window-quotatation/" + id + "/",
        type: "patch",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#jobCardModal").modal('hide');
                $("#updateWindowRemark" + id).html(remark)
                var status = '<label class="badge badge-info">open</label>'
                if (sts == 'open') {

                    status = '<label class="badge badge-info">open</label>'
                }
                else if (sts == 'started') {
                    status = '<label class="badge badge-warning">started</label>'
                }
                else if (sts == 'pending') {
                    status = '<label class="badge badge-danger">pending</label>'
                }
                else if (sts == 'completed') {
                    status = '<label class="badge badge-success">completed</label>'
                }
                $("#updateWindowStatus" + id).html(status)
            }
        }

    });
}

function sizesJobCardUpdate(data) {
    var remark = $("#jobCardQtRemarks").val()
    var sts = $("#jobCardQtStatus").val()
    var id = $("#jobcardId").val();
    $.ajax({
        url: "/userapi/router/custom-kattla-quotatation/" + id + "/",
        type: "patch",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#jobCardModal").modal('hide');
                $("#updateSizesRemark" + id).html(remark)
                var status = '<label class="badge badge-info">open</label>'
                if (sts == 'open') {

                    status = '<label class="badge badge-info">open</label>'
                }
                else if (sts == 'started') {
                    status = '<label class="badge badge-warning">started</label>'
                }
                else if (sts == 'pending') {
                    status = '<label class="badge badge-danger">pending</label>'
                }
                else if (sts == 'completed') {
                    status = '<label class="badge badge-success">completed</label>'
                }
                $("#updateSizesStatus" + id).html(status)
            }
        }

    });
}

function othersJobCardUpdate(data) {
    var remark = $("#jobCardQtRemarks").val()
    var sts = $("#jobCardQtStatus").val()
    var id = $("#jobcardId").val();
    $.ajax({
        url: "/userapi/router/other-product-quotation/" + id + "/",
        type: "patch",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#jobCardModal").modal('hide');
                $("#updateOthersRemark" + id).html(remark)
                var status = '<label class="badge badge-info">open</label>'
                if (sts == 'open') {

                    status = '<label class="badge badge-info">open</label>'
                }
                else if (sts == 'started') {
                    status = '<label class="badge badge-warning">started</label>'
                }
                else if (sts == 'pending') {
                    status = '<label class="badge badge-danger">pending</label>'
                }
                else if (sts == 'completed') {
                    status = '<label class="badge badge-success">completed</label>'
                }
                $("#updateOthersStatus" + id).html(status)
            }
        }
    });
}