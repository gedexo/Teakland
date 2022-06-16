quatationNumber()
customer()
rowMaterial()
jointType()
salesman()

function box() {
    $.ajax({
        url: "/userapi/router/window/",
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
                "Bearer " + localStorage.getItem("useraccesstoken")
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
                "Bearer " + localStorage.getItem("useraccesstoken")
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
            url: "/userapi/router/quotation/",
            type: "POST",
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("useraccesstoken")
                );
            },
            statusCode: {
                201: function (response) {
                    $("#btnCreateCustomer").prop('disabled', true)
                    $("#customer").prop('disabled', true)
                    $("#btnCustomer").prop('disabled', true)
                    $("#quatationNumber").html('Quotation Number : ' + response['quoation_number'])
                    $("#quotation").val(response['id'])
                    $("#customerModal").modal('hide')
                  
                    $("#printDiv").append(
                        '<div class="col-lg-2"><a href="/print-quotation/?quotation_number='+response['quoation_number']+'" class="btn btn-info text-white">Print</a></div>\
                        <div class="col-lg-2"><button id="btnCreateInvoice" value='+response['id']+' onclick="jobcardhelper('+response['id']+',this)" type="button" class="btn btn-success text-white">CreateJobcard</button></div>'
                    )
                    updateCustomer($("#customer").val())
                }
            }
        });
    }
});


function rowMaterial(){
    checkUser()
    $.ajax({
        url: "/userapi/router/rowmaterials/",
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
                    $("select[name=raw_material]").append($('<option>').text(rowData['name']).attr('value', rowData['id']));
                }
            }
        }
    });
}

function jointType(){
    $("[id=salesMan]").empty();
    checkUser()
    $.ajax({
        url: "/userapi/router/joint-type/",
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
    var csrf_token = $("input[name=csrfmiddlewaretoken]").val()

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
            csrfmiddlewaretoken:csrf_token
        }
        $.ajax({
            url: "/userapi/get-unit-price-door/",
            type: "POST",
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("useraccesstoken")
                );
            },
            statusCode: {
                200: function (response) {
                   $("#doorLabourCharge").val(response['labourcharge'])
                   $("#doorUnitAmount").val(response['unitamount'])
                   $("#doorFactoryUnitAmount").val(response['factory_unitamount'])
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
                    $('html, body').animate({
                        scrollTop: $(".errorClass").offset().top
                        }, 100);
                    $(".errorClass").show();
                    $(".errorClass").html('No product matching found')
                    $("#doorLabourCharge").val(null)
                    $("#doorUnitAmount").val(null)
                    $("#doorFactoryUnitAmount").val(null)
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
    var csrf_token = $("input[name=csrfmiddlewaretoken]").val()

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
            'labour_charge':labourCharge,
            csrfmiddlewaretoken:csrf_token
        }
        $.ajax({
            url: "/userapi/get-unit-price-kattla/",
            type: "POST",
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("useraccesstoken")
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
                   $("#kattlaFactoryUnitAmount").val(response['factory_unit_amount'])
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
                    $('html, body').animate({
                        scrollTop: $(".errorClass").offset().top
                        }, 100);
                    $(".errorClass").show();
                    $(".errorClass").html('No product matching found')
                    $("#kattlaUnitAmount").val(null)
                    $("#kattlaFactoryUnitAmount").val(null)
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
    var labourCharge = $('#customKattlaLabourCharge').val()
    var thicknex_x = $('#customthicknex_x').val()
    var thicknex_y = $('#customthicknex_y').val()
    var length = $('#customKattlaLength').val()
    var csrf_token = $("input[name=csrfmiddlewaretoken]").val()

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
    if (labourCharge == ''){
        $("#customKattlaLabourCharge").addClass('error-input')
    }
    else{
        $("#customKattlaLabourCharge").removeClass('error-input')
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
        var data = {
            'raw_material_id':rowMaterial,
            'thickness_x':thicknex_x,
            'thickness_y':thicknex_y,
            'labour_charge':labourCharge,
            'length':length,
            csrfmiddlewaretoken:csrf_token
        }
        $.ajax({
            url: "/userapi/get-unit-price-customkattla/",
            type: "POST",
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("useraccesstoken")
                );
            },
            statusCode: {
                200: function (response) {
                   $("#customKattlaUnitAmount").val(response['unitamount'])
                   $("#customKattlaFactoryUnitAmount").val(response['factoryunitamount'])
                   var name = 'SIZE ' +'('+thicknex_x+'x'+thicknex_y+')'
                   $("#customKattlaName").val(name)
                   $("#customKattlaQubic").val(response['qubic'])
                   $("#customKattlaLabourCharge").val(response['labourcharge'])
                   $(".errorClass").hide();
                   $("#btnSubmitCustomKattla").prop('disabled',false)
                   var qty = $("#customKattlaQuantity").val()
                   if(qty == ''){
                       $("#customKattlaQuantity").val(1)
                   }
                   subTotalCustomKattla()
                },
                404: function(){
                    $('html, body').animate({
                        scrollTop: $(".errorClass").offset().top
                        }, 100);
                    $(".errorClass").show();
                    $(".errorClass").html('No product matching found')
                    $("#customKattlaUnitAmount").val(null)
                    $("#customKattlaFactoryUnitAmount").val(null)
                    $("#customKattlaName").val(null)
                    $("#customKattlaQuantity").val(null)
                    $("#customKattlaSubTotal").val(null)
                    $("#customKattlaQubic").val(null)
                    $("#customKattlaLabourCharge").val(null)
                    $("#btnSubmitCustomKattla").prop('disabled',true)
                    $('#customKattlaLabourCharge').val(0)
                    $("#customKattlaLength").val(null)
                    $("#customthicknex_x").val(null)
                    $("#customthicknex_y").val(null)


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
    var csrf_token = $("input[name=csrfmiddlewaretoken]").val()

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
            csrfmiddlewaretoken:csrf_token
        }
        $.ajax({
            url: "/userapi/get-unit-price-window/",
            type: "POST",
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("useraccesstoken")
                );
            },
            statusCode: {
                200: function (response) {
                   $("#windowLabourCharge").val(response['labourcharge'])
                   $("#windowUnitAmount").val(response['unitamount'])
                   $("#windowFactoryUnitAmount").val(response['factoryunitamount'])
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
                    $('html, body').animate({
                        scrollTop: $(".errorClass").offset().top
                        }, 100);
                    $(".errorClass").show();
                    $(".errorClass").html('No product matching found')
                    $("#windowLabourCharge").val(null)
                    $("#windowUnitAmount").val(null)
                    $("#windowFactoryUnitAmount").val(null)
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


// others
function othersUnitAmt(){
    checkUser()
    var rowMaterial = $("#rowMaterialsOthers").val()
    var type = $("#typeOthers").val()
    var csrf_token = $("input[name=csrfmiddlewaretoken]").val()

    if (rowMaterial == null){
        $("#rowMaterialsOthers").addClass('error-input')
    }
    else{
        $("#rowMaterialsOthers").removeClass('error-input')
    }
    if(type == null){
        $("#typeOthers").addClass('error-input')
    }
    else{
        $("#typeOthers").removeClass('error-input')
        var data = {
            'raw_material_id':rowMaterial,
            'type':type,
            csrfmiddlewaretoken:csrf_token

        }
        $.ajax({
            url: "/userapi/get-others-salesprice/",
            type: "POST",
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("useraccesstoken")
                );
            },
            statusCode: {
                200: function (response) {
                   $("#othersUnitAmount").val(response['sales_price'])
                   $("#othersSubTotal").val(response['sales_price'])
                   $("#othersQuantity").val(1)
                   $(".errorClass").hide();
                   subTotalWindow()
                   $("#btnSubmitOthers").prop('disabled',false)

                },
                404: function(response){
                    $('html, body').animate({
                        scrollTop: $(".errorClass").offset().top
                        }, 100);
                    $(".errorClass").show();
                    $(".errorClass").html('No product matching found')
                    $("#othersUnitAmount").val(null)
                    $("#othersSubTotal").val(null)
                    $("#othersQuantity").val(null)
                    $("#btnSubmitOthers").prop('disabled',true)
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

$("#othersQuantity").keyup(function(){
    checkUser()
    subTotalOthers()
})

function subTotalOthers(){
    var quantity = $("#othersQuantity").val();
    var unitAmount = $("#othersUnitAmount").val();
    total = parseInt(quantity) * parseFloat(unitAmount)
    subTotal = ~~total;
    $("#othersSubTotal").val(subTotal)
}

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



function updateCustomer(id){
    data = {
        'is_enquiry':'False'
    }
    $.ajax({
        url: "/userapi/router/customer/"+id+"/",
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
            }
        }

    });
}
// -----------------------------------------------------------
$("#rowMaterialsKattla").change(function(){
  kattlaType()
});

function kattlaType(){
    var rowMaterial = $("#rowMaterialsKattla").val();
    $.ajax({
        url: "/userapi/router/kattla/?row_material="+rowMaterial,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#kattlaType").empty();
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

$("#rowMaterialsOthers").change(function(){
    othersType()
  });


  function othersType(){
    var rowMaterial = $("#rowMaterialsOthers").val();
    $.ajax({
        url: "/officialapi/router/other-products/?row_material="+rowMaterial,
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
                $("#typeOthers").empty();
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    $("#typeOthers").append($('<option>').text(rowData['name']).attr('value', rowData['name']));
                }
            }
        }

    });
}

$("#rowMaterialsWindow").change(function(){
    windowBoxes();
});

function windowBoxes(){
    var rowMaterial = $("#rowMaterialsWindow").val();
    $.ajax({
        url: "/userapi/router/window/?rawmaterial="+rowMaterial,
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
                $("#box").empty();
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    $("#box").append($('<option>').text(rowData['box']).attr('value', rowData['box']));
                }
            }
        }

    });
}
// -----------------------------------------------------
$("#btnCreateCustomer").click(function(){
    // $("#customerModal").modal('hide');
    $("#customerCreateModal").modal('show');
});

$("#customerAddForm").validate({
    rules: {
        name: {
            required: true,
        },
        contact_no: {
            required: true
        },
        created_by: {
            required: true
        },
        dealt_by: {
            required: true
        },
        createdby: {
            required: true
        }
    },
    submitHandler: function (e) {
        var data = $(e).serializeArray();
        saveCustomer(data)
    }
});

function saveCustomer(data) {
    checkUser()
    $.ajax({
        url: "/userapi/router/customer/",
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
                swal("Oops! Something went wrong!", {
                    icon: "error",
                });
            },
            201: function (response) {
                $("#customer").append($('<option>').text(response['name']).attr('value', response['id']));
                $("#customerCreateModal").modal('hide');  
                $("#customerModal").modal('show');
                $('.cst-qty option[value='+response['id']+']').prop('selected', 'selected').change();         
            },
            208: function (){
                swal("Oops!Customer already exists!", {
                    icon: "error",
                });
            },
        }
    });
}


function salesman() {
    $("[id=salesMan]").empty();
    checkUser()
    $.ajax({
        url: "/userapi/router/salesman/",
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
                    $("[id=salesMan]").append($('<option>').text(rowData['name']).attr('value', rowData['id']));
                }
            }
        }
    });
}