
totalDoor = []
totalWindow = []
totalKattla  = []
customKattlaTotal = []
otherProductTotal = []

$("#kattlaQuotationForm").validate({
    rules: {
        name: {
            required: true,
        },
        type: {
            required: true
        },
        raw_material: {
            required: true
        },
        dimention_height: {
            required: true
        },
        dimention_width: {
            required: true
        },
        thickness_x: {
            required: true
        },
        thickness_y: {
            required: true
        },
        qubic:{
            required:true
        },
        quantity:{
            min:1,
            required:true
        },
        aggregate:{
            required:true
        }
        
    },
    submitHandler: function (e) {
        var data = new FormData($("#kattlaQuotationForm")[0]);
        editId = $("#kattlaEditId").val()
        if( editId != 0){
            updateKattlaQuotation(data,editId)
        }
        else{
            kattlaQuotation(data)
        }
        return false
    }
});

function kattlaQuotation(data){
    checkUser()
    check = checkCustomer()
    if (check =! false){
        var quotation = $("#quotation").val()
        data.append("quotation", quotation)
        $.ajax({
            url: "/userapi/router/kattla-quotatation/",
            type: "POST",
            data: data,
            processData: false,
            contentType: false,
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
                    var rawMaterial =  $("#rowMaterialsKattla option:selected").text();
                    var edit = '<a href="#" id='+response['id']+' onClick=kattlaQuotationEditData('+response['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
                    var deleteQuotation = '<button type="button" id="btnDeleteKattla" value='+response['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
                    var images = '<button data-bs-toggle="modal" onclick="quotationKattlaImageModal('+response['id']+')" value='+response['id']+' data-bs-target="#ImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                    var row = $("<tr />")
                    $("#kattlaQuotatiionTable").append(row);
                    row.append($("<td>" + response["name"] + "</td>"));
                    row.append($("<td>" + response["dimention_height"] + "</td>"));
                    row.append($("<td>" + response["dimention_width"] + "</td>"));
                    row.append($("<td>" + response["quantity"] + "</td>"));
                    row.append($("<td>" + rawMaterial + "</td>"));
                    row.append($("<td>" + response["qubic"] + "</td>"));
                    row.append($("<td>" + response["unit_amount"] + "</td>"));
                    row.append($("<td>" + response["aggregate"] + "</td>"));
                    row.append($("<td>" + images + "</td>"));
                    row.append($("<td>" + edit + "</td>"));
                    row.append($("<td>" + deleteQuotation + "</td>"));
                    kattlaQuotationSubTotal()

                    
                },
                400: function (response) {
                },
               
            }
        });
    }
}

$("#doorQuotationForm").validate({
    rules: {
        name: {
            required: true,
        },
        type: {
            required: true
        },
        raw_material: {
            required: true
        },
        labour_charge: {
            required: true
        },
        unit_amount: {
            required: true
        },
        quantity: {
            required: true,
            min:1
        },
        joint: {
            required: true
        },
        dimention_height: {
            required: true
        },
        dimention_width: {
            required: true
        },
        squarfeet:{
            required:true
        },
        aggregate:{
            required:true
        }
        
    },
    submitHandler: function (e) {
        var data = new FormData($("#doorQuotationForm")[0]);
        editId = $("#doorEditId").val()
        if( editId != 0){
            updateDoorQuotation(data,editId)
        }
        else{
            doorQuotation(data)
        }
        return false
    }
});

function doorQuotation(data){
    checkUser()
    check = checkCustomer()
    if (check =! false){
        var quotation = $("#quotation").val()
        data.append("quotation", quotation)
        $.ajax({
            url: "/userapi/router/door-quotatation/",
            type: "POST",
            data: data,
            processData: false,
            contentType: false,
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
                    var rawMaterial =  $("#rowMaterialsDoor option:selected").text();
                    var edit = '<a href="#" id='+response['id']+' onClick=doorQuotationEditData('+response['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
                    var deleteQuotation = '<button type="button" id="btnDelete" onClick=deleteDoorQuotation('+response['id']+',this) value='+response['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
                    var images = '<button data-bs-toggle="modal" onclick="quotationDoorsImageModal('+response['id']+')" value='+response['id']+' data-bs-target="#ImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                    var row = $("<tr />")
                    $("#doorsQuotationTable").append(row);
                    row.append($("<td>" + response["name"] + "</td>"));
                    row.append($("<td>" + response["dimention_height"] + "</td>"));
                    row.append($("<td>" + response["dimention_width"] + "</td>"));
                    row.append($("<td>" + response["quantity"] + "</td>"));
                    row.append($("<td>" + rawMaterial + "</td>"));
                    row.append($("<td>" + response["squarfeet"] + "</td>"));
                    row.append($("<td>" + response["unit_amount"] + "</td>"));
                    row.append($("<td>" + response["aggregate"] + "</td>"));
                    row.append($("<td>" + images + "</td>"));
                    row.append($("<td>" + edit + "</td>"));
                    row.append($("<td>" + deleteQuotation + "</td>"));
                    doorQuotationSubTotal()
                },
                400: function (response) {
                },
               
            }
        });
    }
    
}


$("#windowQuotationForm").validate({
    rules: {
        name: {
            required: true,
        },
        box: {
            required: true
        },
        raw_material: {
            required: true
        },
        dimention_height: {
            required: true
        },
        dimention_width: {
            required: true
        },
        shutter: {
            required: true
        },
        design: {
            required: true
        },
        labour_charge: {
            required: true
        },
        squarfeet:{
            required:true
        },
        quantity:{
            required:true,
            min:1
        },
        aggregate:{
            required:true
        }
        
    },
    submitHandler: function (e) {
        var data = new FormData($("#windowQuotationForm")[0]);
        editId = $("#windowEditId").val()
        if( editId != 0){
            updateWindowQuotation(data,editId)
        }
        else{
            windowQuotation(data)
        }
        
        return false
    }
});

function windowQuotation(data){
    checkUser()
    check = checkCustomer()
    if (check =! false){
        var quotation = $("#quotation").val()
        data.append("quotation", quotation)
        $.ajax({
            url: "/userapi/router/window-quotatation/",
            type: "POST",
            data: data,
            processData: false,
            contentType: false,
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
                    var rawMaterial =  $("#rowMaterialsWindow option:selected").text();
                    var row = $("<tr />")
                    var edit = '<a href="#" id='+response['id']+' onClick=windowQuotationEditData('+response['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
                    var deleteQuotation = '<button type="button" id="btnDelete" onClick=deleteWindowQuotation('+response['id']+',this) value='+response['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
                    var images = '<button data-bs-toggle="modal" onclick="quotationWindoImageModal('+response['id']+')" value='+response['id']+' data-bs-target="#ImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                    $("#windowQuotatiionTable").append(row);
                    row.append($("<td>" + response["name"] + "</td>"));
                    row.append($("<td>" + response["dimention_height"] + "</td>"));
                    row.append($("<td>" + response["dimention_width"] + "</td>"));
                    row.append($("<td>" + response["quantity"] + "</td>"));
                    row.append($("<td>" + rawMaterial + "</td>"));
                    row.append($("<td>" + response["squarfeet"] + "</td>"));
                    row.append($("<td>" + response["unit_amount"] + "</td>"));
                    row.append($("<td>" + response["aggregate"] + "</td>"));
                    row.append($("<td>" + images + "</td>"));
                    row.append($("<td>" + edit + "</td>"));
                    row.append($("<td>" + deleteQuotation + "</td>"));
                    windowQuotationSubTotal()
                },
                400: function (response) {
                },
               
            }
        });
    }
    
}

$("#customKattlaQuotationForm").validate({
    rules: {
        name: {
            required: true,
        },
        customKLbc: {
            required: true
        },
        raw_material: {
            required: true
        },
        length: {
            required: true
        },
        thickness_x: {
            required: true
        },
        thickness_y: {
            required: true
        },
        qubic:{
            required:true
        },
        unit_amount:{
            required:true,
        },
        quantity:{
            required:true,
            min:1
        },
        aggregate:{
            required:true
        }
        
    },
    submitHandler: function (e) {
        var data = new FormData($("#customKattlaQuotationForm")[0]);
        editId = $("#customKattlaEditId").val()
        if( editId != 0){
            updateCustomKattlaQuotation(data,editId)
        }
        else{
            customKattlaQuotation(data)
        }
        return false
    }
});

function customKattlaQuotation(data){
    checkUser()
    check = checkCustomer()
    if (check =! false){
        var quotation = $("#quotation").val()
        data.append("quotation", quotation)
        $.ajax({
            url: "/userapi/router/custom-kattla-quotatation/",
            type: "POST",
            data: data,
            processData: false,
            contentType: false,
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
                    var rawMaterial =  $("#rowMaterialsCustomKattla option:selected").text();
                    var row = $("<tr />")
                    var edit = '<a href="#" id='+response['id']+' onClick=customKattlaQuotationEditData('+response['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
                    var deleteQuotation = '<button type="button" id="btnDelete" onClick=deleteCustomKattlaQuotation('+response['id']+',this) value='+response['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
                    var images = '<button data-bs-toggle="modal" onclick="quotationSizesImageModal('+response['id']+')" value='+response['id']+' data-bs-target="#ImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                    $("#customKattlaQuotatiionTable").append(row);
                    row.append($("<td>" + response["name"] + "</td>"));
                    row.append($("<td>" + response["length"] + "</td>"));
                    row.append($("<td>" + response["quantity"] + "</td>"));
                    row.append($("<td>" + rawMaterial + "</td>"));
                    row.append($("<td>" + response["qubic"] + "</td>"));
                    row.append($("<td>" + response["unit_amount"] + "</td>"));
                    row.append($("<td>" + response["aggregate"] + "</td>"));
                    row.append($("<td>" + images + "</td>"));
                    row.append($("<td>" + edit + "</td>"));
                    row.append($("<td>" + deleteQuotation + "</td>"));
                    customKattlaQuotationSubTotal()
                },
                400: function (response) {
                },
               
            }
        });
    }
    
}

// other product quotation section
$("#otherQuotationForm").validate({
    rules: {
        name: {
            required: true,
        },
        raw_material: {
            required: true
        },
        price:{
            required:true,
            min:1
        },
        quantity:{
            min:1,
            required:true
        },
        aggregate:{
            required:true
        }
        
    },
    submitHandler: function (e) {
        var data = $("#otherQuotationForm").serializeArray();
        editId = $("#otherEditId").val()
        if( editId != 0){
            updateOtherProductQuotation(data,editId)
        }
        else{
            otherProductQuotation(data)
        }
        return false
    }
});


function otherProductQuotation(data){
    checkUser()
    check = checkCustomer()
    if (check =! false){
        var quotation = $("#quotation").val()
        data[data.length] = { name: "quotation", value: quotation };
        $.ajax({
            url: "/userapi/router/other-product-quotation/",
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
                    var rawMaterial =  $("#rowMaterialsOthers option:selected").text();
                    var row = $("<tr />")
                    var edit = '<a href="#" id='+response['id']+' onClick=otherProductQuotationEditData('+response['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
                    var deleteQuotation = '<button type="button" id="btnDelete" onClick=deleteOtherProductQuotation('+response['id']+',this) value='+response['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
                    $("#otherProductQuotatiionTable").append(row);
                    row.append($("<td>" + response["name"] + "</td>"));
                    row.append($("<td>" + rawMaterial + "</td>"));
                    row.append($("<td>" + response["price"] + "</td>"));
                    row.append($("<td>" + response["quantity"] + "</td>"));
                    row.append($("<td>" + response["aggregate"] + "</td>"));
                    row.append($("<td>" + edit + "</td>"));
                    row.append($("<td>" + deleteQuotation + "</td>"));
                    otherProductQuotationSubTotal()
                },
                400: function (response) {
                },
               
            }
        });
    }
    
}



// end section

function doorSubTotal(){
    var sumCalc = totalDoor.reduce(function(a, b){
        return a + b;
    }, 0);
   
   $("#doorTotal").html(sumCalc+'.00')
   $('html, body').animate({
    scrollTop: $("#doorTableDiv").offset().top
    }, 100);
    $("#doorQuotationForm").trigger("reset")
    quotatationTotal()
    
}

function customKattlaSubTotal(){
    var sumCalc = customKattlaTotal.reduce(function(a, b){
        return a + b;
    }, 0);
   $("#customKattlaTotal").html(sumCalc+'.00')
   $('html, body').animate({
    scrollTop: $("#customKattlaTableDiv").offset().top
    }, 100);
    $("#customKattlaQuotationForm").trigger("reset")
    quotatationTotal()


}

function otherProductSubTotal(){
    var sumCalc = otherProductTotal.reduce(function(a, b){
        return a + b;
    }, 0);
   $("#othersTotal").html(sumCalc+'.00')
   $('html, body').animate({
    scrollTop: $("#otherProductTableDiv").offset().top
    }, 100);
    $("#otherQuotationForm").trigger("reset")
    quotatationTotal()


}


function windowSubTotal(){
    var sumCalc = totalWindow.reduce(function(a, b){
        return a + b;
    }, 0);
   $("#windowTotal").html(sumCalc+'.00')
   $('html, body').animate({
    scrollTop: $("#windowTableDiv").offset().top
    }, 100);
    $("#windowQuotationForm").trigger("reset")
    quotatationTotal()


}

function kattlaSubTotal(){
    var sumCalc = totalKattla.reduce(function(a, b){
        return a + b;
    }, 0);

   $("#kattlaTotal").html(sumCalc+'.00')
   $('html, body').animate({
    scrollTop: $("#kattlaTableDiv").offset().top
    }, 100);
    $("#kattlaQuotationForm").trigger("reset")
    quotatationTotal()
}

// door quotation subtotal

function doorQuotationSubTotal(){
    checkUser()
    var quotationNumber = $("#quotation").val()
    $.ajax({
        url: "/userapi/router/door-quotatation/?quotation_no="+quotationNumber,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                totalDoor = []
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    subTotal = rowData['aggregate']
                    totalDoor.push(subTotal)
                }
                doorSubTotal()
            }
        }
    });
}

// custom kattla
function customKattlaQuotationSubTotal(){
    checkUser()
    var quotationNumber = $("#quotation").val()
    $.ajax({
        url: "/userapi/router/custom-kattla-quotatation/?quotation_no="+quotationNumber,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                customKattlaTotal = []
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    subTotal = rowData['aggregate']
                    customKattlaTotal.push(subTotal)
                }
                customKattlaSubTotal()
            }
        }
    });
}
// window

function windowQuotationSubTotal(){
    checkUser()
    var quotationNumber = $("#quotation").val()
    $.ajax({
        url: "/userapi/router/window-quotatation/?quotation_no="+quotationNumber,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                totalWindow = []
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    subTotal = rowData['aggregate']
                    totalWindow.push(subTotal)
                }
                windowSubTotal()
            }
        }
    });
}
// kattla

function kattlaQuotationSubTotal(){
    checkUser()
    var quotationNumber = $("#quotation").val()
    $.ajax({
        url: "/userapi/router/kattla-quotatation/?quotation_no="+quotationNumber,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                totalKattla = []
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    subTotal = rowData['aggregate']
                    totalKattla.push(subTotal)
                }
                kattlaSubTotal()
            }
        }
    });
}
// other products subtotal

function otherProductQuotationSubTotal(){
    checkUser()
    var quotationNumber = $("#quotation").val()
    $.ajax({
        url: "/userapi/router/other-product-quotation/?quotation_no="+quotationNumber,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                otherProductTotal = []
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    subTotal = rowData['aggregate']
                    otherProductTotal.push(subTotal)
                }
                otherProductSubTotal()
            }
        }
    });
}

function quotatationTotal(){
    var tax = $("#taxPercentage").val()
    var taxAMt 
   
    var kattla = totalKattla.reduce(function(a, b){
        return a + b;
    }, 0);
    var door = totalDoor.reduce(function(a, b){
        return a + b;
    }, 0);
    var window = totalWindow.reduce(function(a, b){
        return a + b;
    }, 0);
    var customkattla = customKattlaTotal.reduce(function(a, b){
        return a + b;
    }, 0);

    var otherProducts = otherProductTotal.reduce(function(a, b){
        return a + b;
    }, 0);

    total  = parseFloat(kattla) + parseFloat(door) + parseFloat(window) + parseFloat(customkattla) + parseFloat(otherProducts)
    
    if (tax != 0){
        var taxAMt = parseFloat(tax)/100 * parseFloat(total)
        taxAMt = ~~taxAMt
        quotationTotal = total + taxAMt
        $("#taxCDiv").empty();
        $("#taxCDiv").append('Tax: ','(',tax,')%')
        $("#taxTotal").html(taxAMt+'.00')
        $("#quotationSubTotal").html(~~total+'.00')
        $("#quotationTotal").html(~~quotationTotal+'.00')
    }
    else{
        $("#taxTotal").html('0.00')
        $("#quotationSubTotal").html(~~total+'.00')
        $("#quotationTotal").html(~~total+'.00')
    }
   

}