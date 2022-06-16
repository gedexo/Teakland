function doorQuotationEditData(editId,rowIndex){
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("qtdnumber", row)
    checkUser()
    $.ajax({
        url: "/userapi/router/door-quotatation/"+editId+"/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#doorChk").prop('checked',true)
                $("#doorEditId").val(response['id'])
                $("#rowMaterialsDoor").val(response['raw_material'])
                $("#doorType").val(response['type'])
                $("#jointType").val(response['joint'])
                $("#doorHeight").val(response['dimention_height'])
                $("#doorWidth").val(response['dimention_width'])
                $("#doorName").val(response['name'])
                $("#doorLabourCharge").val(response['labour_charge'])
                $("#doorUnitAmount").val(response['unit_amount'])
                $("#doorQuantity").val(response['quantity'])
                $("#doorSubTotal").val(response['aggregate'])
                $("#doorSqft").val(response['squarfeet'])
                $("#btnSubmitDoor").html('update')
                doorChk()
            }
        }
    });
}

function updateDoorQuotation(data,editId){
    checkUser()
    var quotation = $("#quotation").val()
    data[data.length] = { name: "quotation", value: quotation };
    $.ajax({
        url: "/userapi/router/door-quotatation/"+editId+"/",
        type: "PUT",
        data:data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                var rawMaterial =  $("#rowMaterialsDoor option:selected").text();
                var rows = localStorage.getItem("qtdnumber")
                var arr = $('#doorsQuotationTable > tbody > tr').map(function ()
                {
                    return $(this).children().map(function ()
                    {
                        return $(this);
                    });
                });
                arr[rows][0].text(response['name']);
                arr[rows][1].text(response['dimention_height']);
                arr[rows][2].text(response['dimention_width']);
                arr[rows][3].text(response['quantity']);
                arr[rows][4].text(rawMaterial);
                arr[rows][5].text(response['squarfeet']);
                arr[rows][6].text(response['unit_amount']);
                arr[rows][7].text(response['aggregate']);
                doorQuotationSubTotal()
                $("#doorQuotationForm").trigger("reset")
                $("#doorEditId").val(0)
                $("#btnSubmitDoor").html('Add')
            }
        }
    });

}

// window


function windowQuotationEditData(editId,rowIndex){
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("qtwnumber", row)
    checkUser()
    $.ajax({
        url: "/userapi/router/window-quotatation/"+editId+"/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                var shutter
                var design
                if (response['shutter'] != false){
                    shutter = 1
                }
                else{
                    shutter = 0
                }
                if (response['design'] != false){
                    design = 1
                }
                else{
                    design = 0
                }
                $("#windowChk").prop('checked',true)
                $("#windowEditId").val(response['id'])
                $("#rowMaterialsWindow").val(response['raw_material'])
                $("#box").val(response['box'])
                $("#shutter").val(shutter)
                $("#design").val(design)
                $("#windowHeight").val(response['dimention_height'])
                $("#windowWidth").val(response['dimention_width'])
                $("#windowName").val(response['name'])
                $("#windowLabourCharge").val(response['labour_charge'])
                $("#windowUnitAmount").val(response['unit_amount'])
                $("#windowQuantity").val(response['quantity'])
                $("#windowSubTotal").val(response['aggregate'])
                $("#windowSqft").val(response['squarfeet'])
                $("#btnSubmitWindow").html('update')
                windowChk()
            }
        }
    });
}

function updateWindowQuotation(data,editId){
    checkUser()
    var quotation = $("#quotation").val()
    data[data.length] = { name: "quotation", value: quotation };
    $.ajax({
        url: "/userapi/router/window-quotatation/"+editId+"/",
        type: "PUT",
        data:data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                var rawMaterial =  $("#rowMaterialsWindow option:selected").text();
                var rows = localStorage.getItem("qtwnumber")
                var arr = $('#windowQuotatiionTable > tbody > tr').map(function ()
                {
                    return $(this).children().map(function ()
                    {
                        return $(this);
                    });
                });
                arr[rows][0].text(response['name']);
                arr[rows][1].text(response['dimention_height']);
                arr[rows][2].text(response['dimention_width']);
                arr[rows][3].text(response['quantity']);
                arr[rows][4].text(rawMaterial);
                arr[rows][5].text(response['squarfeet']);
                arr[rows][6].text(response['unit_amount']);
                arr[rows][7].text(response['aggregate']);
                windowQuotationSubTotal()
                $("#windowQuotationForm").trigger("reset")
                $("#windowEditId").val(0)
                $("#btnSubmitWindow").html('Add')
            }
        }
    });

}

// kattla
function kattlaQuotationEditData(editId,rowIndex){
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("qtknumber", row)
    checkUser()
    $.ajax({
        url: "/userapi/router/kattla-quotatation/"+editId+"/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                var shutter
                if (response['shutter'] != false){
                    shutter = 1
                }
                else{
                    shutter = 0
                }
                $("#kattlaChk").prop('checked',true)
                $("#kattlaEditId").val(response['id'])
                $("#rowMaterialsKattla").val(response['raw_material'])
                $("#kattlaType").val(response['type'])
                $("#kattlaHeight").val(response['dimention_height'])
                $("#kattlaWidth").val(response['dimention_width'])
                $("#thicknex_x").val(response['thickness_x'])
                $("#thicknex_y").val(response['thickness_y'])
                $("#kattlaName").val(response['name'])
                $("#kattlaUnitAmount").val(response['unit_amount'])
                $("#kattlaQuantity").val(response['quantity'])
                $("#kattlaSubTotal").val(response['aggregate'])
                $("#kattlaQubic").val(response['qubic'])
                $("#btnSubmitKattla").html('update')
                kattlaChk()
            }
        }
    });
}

function updateKattlaQuotation(data,editId){
    checkUser()
    var quotation = $("#quotation").val()
    data[data.length] = { name: "quotation", value: quotation };
    $.ajax({
        url: "/userapi/router/kattla-quotatation/"+editId+"/",
        type: "PUT",
        data:data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                var rawMaterial =  $("#rowMaterialsKattla option:selected").text();
                var rows = localStorage.getItem("qtknumber")
                var arr = $('#kattlaQuotatiionTable > tbody > tr').map(function ()
                {
                    return $(this).children().map(function ()
                    {
                        return $(this);
                    });
                });
                arr[rows][0].text(response['name']);
                arr[rows][1].text(response['dimention_height']);
                arr[rows][2].text(response['dimention_width']);
                arr[rows][3].text(response['quantity']);
                arr[rows][4].text(rawMaterial);
                arr[rows][5].text(response['qubic']);
                arr[rows][6].text(response['unit_amount']);
                arr[rows][7].text(response['aggregate']);
                kattlaQuotationSubTotal()
                $("#kattlaQuotationForm").trigger("reset")
                $("#kattlaEditId").val(0)
                $("#btnSubmitKattla").html('Add')
            }
        }
    });

}


// Custom kattla
function customKattlaQuotationEditData(editId,rowIndex){
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("qtkcnumber", row)
    checkUser()
    $.ajax({
        url: "/userapi/router/custom-kattla-quotatation/"+editId+"/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                var labourcharge
                if (response['labour_charge'] != 0){
                    labourcharge = 'true'
                }
                else{
                    labourcharge = 'false'
                }
                $("#customKattlaChk").prop('checked',true)
                $("#customKattlaEditId").val(response['id'])
                $("#rowMaterialsCustomKattla").val(response['raw_material'])
                $("#customKattlaLabourChargeCheck").val(labourcharge)
                $("#customKattlaLabourCharge").val(response['labour_charge'])
                $("#customKattlaLength").val(response['length'])
                $("#customthicknex_x").val(response['thickness_x'])
                $("#customthicknex_y").val(response['thickness_y'])
                $("#customKattlaQubic").val(response['qubic'])
                $("#customKattlaName").val(response['name'])
                $("#customKattlaUnitAmount").val(response['unit_amount'])
                $("#customKattlaQuantity").val(response['quantity'])
                $("#customKattlaSubTotal").val(response['aggregate'])
                $("#btnSubmitCustomKattla").html('update')
                customKattlaChk()
            }
        }
    });
}

function updateCustomKattlaQuotation(data,editId){
    checkUser()
    var quotation = $("#quotation").val()
    data[data.length] = { name: "quotation", value: quotation };
    $.ajax({
        url: "/userapi/router/custom-kattla-quotatation/"+editId+"/",
        type: "PUT",
        data:data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                var rawMaterial =  $("#rowMaterialsCustomKattla option:selected").text();
                var rows = localStorage.getItem("qtkcnumber")
                var arr = $('#customKattlaQuotatiionTable > tbody > tr').map(function ()
                {
                    return $(this).children().map(function ()
                    {
                        return $(this);
                    });
                });
                arr[rows][0].text(response['name']);
                arr[rows][1].text(response['length']);
                arr[rows][2].text(response['quantity']);
                arr[rows][3].text(rawMaterial);
                arr[rows][4].text(response['qubic']);
                arr[rows][5].text(response['unit_amount']);
                arr[rows][6].text(response['aggregate']);
                customKattlaQuotationSubTotal()
                $("#customKattlaQuotationForm").trigger("reset")
                $("#customKattlaEditId").val(0)
                $("#btnSubmitCustomKattla").html('Add')
            }
        }
    });

}

