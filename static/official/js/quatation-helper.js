quatationNumber()
customer()
rowMaterial()
jointType()
box()
kattlaType()

function box() {
    $.ajax({
        url: "/officialapi/router/window/",
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
                    $("select[name=box]").append($('<option>').text(rowData['box']).attr('value', rowData['box']));
                }
            }
        }
    });
}

function quatationNumber() {
    checkUser()
    $.ajax({
        url: "/userapi/qutation-number/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#quatationNumber").html('Quotation Number : ' + response['quatation_number'])
            }
        }
    });
}

function customer() {
    checkUser()
    $.ajax({
        url: "/userapi/router/customer/",
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
                    $("#customer").append($('<option>').text(rowData['name']).attr('value', rowData['id']));
                }
            }
        }
    });
}


$("#customer").change(function () {
    checkUser()
    var id = $(this).val();
    getCustomerDetails(id)
});

function getCustomerDetails(id) {
    checkUser()
    $.ajax({
        url: "/userapi/router/customer/" + id + "/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#phone").val(response['contact_no'])
                $("#createdBy").val(response.created_by['name'])
                $("#dealtBy").val(response.dealt_by['name'])
            }
        }
    });
}

$("#customerForm").validate({
    rules: {
        customer: {
            required: true,
        },
    },
    messages: {
        customer: {
            required: "please select customer",
        },
    },
    submitHandler: function (e) {
        var data = $(e).serializeArray();
        checkUser()
        $.ajax({
            url: "/officialapi/router/qoutations/",
            type: "POST",
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("adminaccesstoken")
                );
            },
            statusCode: {
                201: function (response) {
                    $("#customer").prop('disabled', true)
                    $("#btnCustomer").prop('disabled', true)
                    $("#quatationNumber").html('Quotation Number : ' + response['quoation_number'])
                    $("#quotation").val(response['id'])
                    $("#customerModal").modal('hide')
                    $("#printDiv").append('<a href="/print-quotation/?quotation_number='+response['quoation_number']+'" class="btn btn-info text-white">Print</a>')
                }
            }
        });
    }
});


function rowMaterial(){
    checkUser()
    $.ajax({
        url: "/officialapi/router/rowmaterials/",
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
                    $("select[name=raw_material]").append($('<option>').text(rowData['name']).attr('value', rowData['id']));
                }
            }
        }
    });
}

function kattlaType(){
    checkUser()
    $.ajax({
        url: "/officialapi/router/kattla/",
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
                    $("#kattlaType").append($('<option>').text(rowData['kattlatype']).attr('value', rowData['kattlatype']));
                }
            }
        }
    });
}


function jointType(){
    $("[id=salesMan]").empty();
    checkUser()
    $.ajax({
        url: "/officialapi/router/joint-type/",
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
                    $("#jointType").append($('<option>').text(rowData['code']+'-'+rowData['joint_type']).attr('value', rowData['id']));
                } 
            }
        }
    });
}

function checkCustomer(){
    checkUser()
    var customer = $("#quotation").val()
    if(customer != 0 ){
        return true
    }
    else{
        $("#customerModal").modal('show')
    }
}

function getDoorUnitPrice(){
    checkUser()
    var rowMaterial = $("#rowMaterialsDoor").val()
    var doorType = $('#doorType').val()
    var jointId = $('#jointType').val()
    var height = $('#doorHeight').val()
    var width = $('#doorWidth').val()
    if (rowMaterial == null){
        $("#rowMaterialsDoor").addClass('error-input')
    }
    else{
        $("#rowMaterialsDoor").removeClass('error-input')
    }
    if (doorType == null){
        $("#doorType").addClass('error-input')
    }
    else{
        $("#doorType").removeClass('error-input')
    }
    if (jointId == null){
        $("#jointType").addClass('error-input')
    }
    else{
        $("#jointType").removeClass('error-input')
    }
    if (height == ''){
        $("#doorHeight").addClass('error-input')
    }
    else{
        $("#doorHeight").removeClass('error-input')
    }
    if (width == ''){
        $("#doorWidth").addClass('error-input')
    }
    else{
        $("#doorWidth").removeClass('error-input')
        var data = {
            'raw_material_id':rowMaterial,
            'door_type':doorType,
            'joint_id':jointId,
            'height':height,
            'width':width,
        }
        $.ajax({
            url: "/userapi/get-unit-price-door/",
            type: "POST",
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("adminaccesstoken")
                );
            },
            statusCode: {
                200: function (response) {
                   $("#doorLabourCharge").val(response['labourcharge'])
                   $("#doorUnitAmount").val(response['unitamount'])
                   $("#doorSqft").val(response['sqft'])
                   var name = 'DOOR' +'('+height+'x'+width+')'
                   $("#doorName").val(name)
                   $(".errorClass").hide();
                   var qty = $("#doorQuantity").val()
                   $("#btnSubmitDoor").prop('disabled',false)
                   if(qty == ''){
                       $("#doorQuantity").val(1)
                   }
                   subTotalDoor()
                },
                404: function(response){
                    $(".errorClass").show();
                    $(".errorClass").html('No product matching found')
                    $("#doorLabourCharge").val(null)
                    $("#doorUnitAmount").val(null)
                    $("#doorName").val(null)
                    $("#doorQuantity").val(null)
                    $("#doorSubTotal").val(null)
                    $("#doorSqft").val(null)
                    $("#btnSubmitDoor").prop('disabled',true)
                    
                }
            }

        });
    }
   
}

function getKattlaUnitPrice(){
    checkUser()
    var rowMaterial = $("#rowMaterialsKattla").val()
    var type = $('#kattlaType').val()
    var height = $('#kattlaHeight').val()
    var width = $('#kattlaWidth').val()
    var thicknex_x = $('#thicknex_x').val()
    var thicknex_y = $('#thicknex_y').val()
    var labourCharge = $('#KattlaLabourChargeCheck').val()
    if (rowMaterial == null){
        $("#rowMaterialsKattla").addClass('error-input')
    }
    else{
        $("#rowMaterialsKattla").removeClass('error-input')
    }
    if (type == null){
        $("#kattlaType").addClass('error-input')
    }
    else{
        $("#kattlaType").removeClass('error-input')
    }
    if (thicknex_x == ''){
        $("#thicknex_x").addClass('error-input')
    }
    else{        
        $("#thicknex_x").removeClass('error-input')
    }
    if (thicknex_y == ''){
        $("#thicknex_y").addClass('error-input')
    }
    else{
        $("#thicknex_y").removeClass('error-input')
    }
    if (height == ''){
        $("#kattlaHeight").addClass('error-input')
    }
    else{
        $("#kattlaHeight").removeClass('error-input')
    }
    if (width == ''){
        $("#kattlaWidth").addClass('error-input')
    }
    else{
        $("#kattlaWidth").removeClass('error-input')
        var data = {
            'raw_material_id':rowMaterial,
            'type':type,
            'dimention_height':height,
            'dimention_width':width,
            'thickness_x':thicknex_x,
            'thickness_y':thicknex_y,
            'labour_charge':labourCharge
        }
        $.ajax({
            url: "/userapi/get-unit-price-kattla/",
            type: "POST",
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("adminaccesstoken")
                );
            },
            statusCode: {
                200: function (response) {
                   var typecp=type;
                   if(type=='open')
                   {
                      typecp='D Open';
                   }
                   else if(type=='closed')
                   {
                       typecp='D Close';
                   }
                   $("#kattlaUnitAmount").val(response['unitamount'])
                   var name = 'KATTILA ' +typecp+'('+thicknex_x+'x'+thicknex_y+')'
                   $("#kattlaName").val(name)
                   $("#kattlaQubic").val(response['qubic'])
                   $(".errorClass").hide();
                   $("#btnSubmitKattla").prop('disabled',false)
                   var qty = $("#kattlaQuantity").val()
                   if(qty == ''){
                       $("#kattlaQuantity").val(1)
                   }
                   subTotalKattla()
                },
                404: function(){
                    $(".errorClass").show();
                    $(".errorClass").html('No product matching found')
                    $("#kattlaUnitAmount").val(null)
                    $("#kattlaName").val(null)
                    $("#kattlaQuantity").val(null)
                    $("#kattlaSubTotal").val(null)
                    $("#kattlaQubic").val(null)
                    $("#btnSubmitKattla").prop('disabled',true)

                }
            }

        });
    }
}


function getCustomKattlaUnitPrice(){
    checkUser()
    var rowMaterial = $("#rowMaterialsCustomKattla").val()
    var labourCharge = $('#customKattlaLabourChargeCheck').val()
    var thicknex_x = $('#customthicknex_x').val()
    var thicknex_y = $('#customthicknex_y').val()
    var length = $('#customKattlaLength').val()
    if (rowMaterial == null){
        $("#rowMaterialsCustomKattla").addClass('error-input')
    }
    else{
        $("#rowMaterialsCustomKattla").removeClass('error-input')
    }
    if (length == ''){
        $("#customKattlaLength").addClass('error-input')
    }
    else{
        $("#customKattlaLength").removeClass('error-input')
    }
    if (thicknex_x == ''){
        $("#customthicknex_x").addClass('error-input')
    }
    else{        
        $("#customthicknex_x").removeClass('error-input')
    }
    if (thicknex_y == ''){
        $("#customthicknex_y").addClass('error-input')
    }
    else{
        $("#customthicknex_y").removeClass('error-input')
    }
    if (labourCharge == null){
        $("#customKattlaLabourChargeCheck").addClass('error-input')
    }
    else{
        $("#customKattlaLabourChargeCheck").removeClass('error-input')
        var data = {
            'raw_material_id':rowMaterial,
            'thickness_x':thicknex_x,
            'thickness_y':thicknex_y,
            'labour_charge':labourCharge,
            'length':length,
        }
        $.ajax({
            url: "/userapi/get-unit-price-customkattla/",
            type: "POST",
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("adminaccesstoken")
                );
            },
            statusCode: {
                200: function (response) {
                   $("#customKattlaUnitAmount").val(response['unitamount'])
                   var name = 'SIZE KATTILA' +'('+thicknex_x+'x'+thicknex_y+')'
                   $("#customKattlaName").val(name)
                   $("#customKattlaQubic").val(response['qubic'])
                   $("#customKattlaLabourCharge").val(response['labour_charge'])
                   $(".errorClass").hide();
                   $("#btnSubmitCustomKattla").prop('disabled',false)
                   var qty = $("#customKattlaQuantity").val()
                   if(qty == ''){
                       $("#customKattlaQuantity").val(1)
                   }
                   subTotalCustomKattla()
                },
                404: function(){
                    $(".errorClass").show();
                    $(".errorClass").html('No product matching found')
                    $("#customKattlaUnitAmount").val(null)
                    $("#customKattlaName").val(null)
                    $("#customKattlaQuantity").val(null)
                    $("#customKattlaSubTotal").val(null)
                    $("#customKattlaQubic").val(null)
                    $("#customKattlaLabourCharge").val(null)
                    $("#btnSubmitCustomKattla").prop('disabled',true)

                }
            }

        });
    }
}


function getWindowUnitPrice(){
    checkUser()
    var rowMaterial = $("#rowMaterialsWindow").val()
    var box = $('#box').val()
    var shutter = $('#shutter').val()
    var height = $('#windowHeight').val()
    var width = $('#windowWidth').val()
    var design = $('#design').val()

    if (rowMaterial == null){
        $("#rowMaterialsWindow").addClass('error-input')
    }
    else{
        $("#rowMaterialsWindow").removeClass('error-input')
    }
    if (box == null){
        $("#box").addClass('error-input')
    }
    else{
        $("#box").removeClass('error-input')
    }
    if (shutter == null){
        $("#shutter").addClass('error-input')
    }
    else{
        $("#shutter").removeClass('error-input')
    }
    if (design == null){
        $("#design").addClass('error-input')
    }
    else{
        $("#design").removeClass('error-input')
    }
    if (height == ''){
        $("#windowHeight").addClass('error-input')
    }
    else{
        $("#windowHeight").removeClass('error-input')
    }
    if (width == ''){
        $("#windowWidth").addClass('error-input')
    }
    else{
        $("#windowWidth").removeClass('error-input')
        var data = {
            'raw_material_id':rowMaterial,
            'box':box,
            'design':design,
            'dimention_height':height,
            'dimention_width':width,
            'shutter':shutter,
        }
        $.ajax({
            url: "/userapi/get-unit-price-window/",
            type: "POST",
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("adminaccesstoken")
                );
            },
            statusCode: {
                200: function (response) {
                   $("#windowLabourCharge").val(response['labourcharge'])
                   $("#windowUnitAmount").val(response['unitamount'])
                   $("#windowSqft").val(response['sqft'])
                   var name = 'WINDOW' +'('+height+'x'+width+')'
                   $("#windowName").val(name)
                   $(".errorClass").hide();
                   var qty = $("#windowQuantity").val()
                   if(qty == ''){
                       $("#windowQuantity").val(1)
                   }
                   subTotalWindow()
                   $("#btnSubmitWindow").prop('disabled',false)

                },
                404: function(response){
                    $(".errorClass").show();
                    $(".errorClass").html('No product matching found')
                    $("#windowLabourCharge").val(null)
                    $("#windowUnitAmount").val(null)
                    $("#windowName").val(null)
                    $("#windowSqft").val(null)
                    $("#windowQuantity").val(null)
                    $("#windowSubTotal").val(null)
                    $("#btnSubmitWindow").prop('disabled',true)
                },
                400: function(response){
                }
            }

        });
    }
   
}


$("#kattlaQuantity").keyup(function(){
    checkUser()
    subTotalKattla()
})

$("#customKattlaQuantity").keyup(function(){
    checkUser()
    subTotalCustomKattla()
})

function subTotalCustomKattla(){
    checkUser()
    var quantity = $("#customKattlaQuantity").val();
    var unitAmount = $("#customKattlaUnitAmount").val();
    total = parseInt(quantity) * parseFloat(unitAmount)
    subTotal = ~~total;
    $("#customKattlaSubTotal").val(subTotal)
}

function subTotalKattla(){
    checkUser()
    var quantity = $("#kattlaQuantity").val();
    var unitAmount = $("#kattlaUnitAmount").val();
    total = parseInt(quantity) * parseFloat(unitAmount)
    subTotal = ~~total;
    $("#kattlaSubTotal").val(subTotal)
}


$("#doorQuantity").keyup(function(){
    checkUser()
    subTotalDoor()
})

function subTotalDoor(){
    var quantity = $("#doorQuantity").val();
    var unitAmount = $("#doorUnitAmount").val();
    total = parseInt(quantity) * parseFloat(unitAmount)
    subTotal = ~~total;
    $("#doorSubTotal").val(subTotal)
}

$("#windowQuantity").keyup(function(){
    checkUser()
    subTotalWindow()
})

function subTotalWindow(){
    var quantity = $("#windowQuantity").val();
    var unitAmount = $("#windowUnitAmount").val();
    total = parseInt(quantity) * parseFloat(unitAmount)
    subTotal = ~~total;
    $("#windowSubTotal").val(subTotal)
}

function kattlaUnitAmt(){
    var unitAmt = $("#kattlaUnitAmount").val();
    var qty = $("#kattlaQuantity").val();

    if(qty != null){
        subTotal = qty * unitAmt
        $("#kattlaSubTotal").val(subTotal)
    }
    
}

function windowUnitAmt(){
    var unitAmt = $("#windowUnitAmount").val();
    var qty = $("#windowQuantity").val();

    if(qty != null){
        subTotal = qty * unitAmt
        $("#windowSubTotal").val(subTotal)
    }
}

function doorUnitAmt(){
    var unitAmt = $("#doorUnitAmount").val();
    var qty = $("#doorQuantity").val();

    if(qty != null){
        subTotal = qty * unitAmt
        $("#doorSubTotal").val(subTotal)
    }
}