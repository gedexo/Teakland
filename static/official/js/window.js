rowMaterial()
$(document).ready(function () {
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
                    var tableData = [];
                    var shutter
                    var design
                    if(rowData.shutter != false){
                        shutter = '<div class="check"></div>'
                    }
                    else{
                        shutter = ''
                    }
                    if(rowData.design != false){
                        design = '<div class="check"></div>'
                    }
                    else{
                        design = ''
                    }
                    table = $("#windowTable").DataTable();
                    var images = '<button data-bs-toggle="modal" onclick="imageModal('+rowData['id']+')" value='+rowData['id']+' data-bs-target="#windowProductImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+','+rowData.rowmaterial['id']+','+rowData['shutter']+','+rowData['design']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteProduct = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    tableData.push([rowData['date'], rowData.rowmaterial['name'],rowData['box'],rowData['labour_charge'],rowData['factory_price'],rowData['price'],shutter,design,images,edit, deleteProduct])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});

$("#windowAddForm").validate({
    rules: {
        rowmaterial: {
            required: true,
        },
        labour_charge: {
            required: true
        },
        price: {
            required: true
        }
    },
    submitHandler: function (e) {
        var data = new FormData($("#windowAddForm")[0]);
        if ($("#editId").val() != "") {
            updateData(data)
        }
        else {
            saveData(data)
        }
        return false
    }
});

function saveData(data) {
    var shutter  
    var design
    if($("#shutter").prop('checked')== true){
        shutter = "True"
    }
    else{
        shutter = "False"
    }

    if($("#design").prop('checked')== true){
        design = "True"
    }
    else{
        design = "False"
    }
    data.append( "shutter",shutter);                                                
    data.append("design",design); 
    checkUser()
    $.ajax({
        url: "/officialapi/router/window/",
        type: "POST",
        data: data,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            401: function () {
                swal("Oops! Something went wrong!", {
                    icon: "error",
                });
            },
            201: function (response) {
                var rowMaterial = $("select[name=rowmaterial] option:selected").text();
                var shutter
                var design
                if(response.shutter != false){
                    shutter = '<div class="check"></div>'
                }
                else{
                    shutter = ''
                }
                if(response.design != false){
                    design = '<div class="check"></div>'
                }
                else{
                    design = ''
                }
                var tableData = [];
                $("#windowAddForm").trigger("reset")
                swal("Oops! Saved Successfully!", {
                    icon: "success",
                });
                var tableData = [];
                table = $("#windowTable").DataTable();
                var images = '<button data-bs-toggle="modal" onclick="imageModal('+ response['id']+')" value='+response['id']+' data-bs-target="#windowProductImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                var edit = '<a href="#" id=' + response['id'] + ' onClick=getEditData('+response['id']+','+response['rowmaterial']+','+response['shutter']+','+response['design']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                var deleteProduct = '<button type="button" id="btnDelete" value=' + response['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                tableData.push([response['date'],rowMaterial,response['box'],response['labour_charge'],response['factory_price'],response['price'],shutter,design,images,edit, deleteProduct])
                table.rows.add(tableData).draw();
            },
            208: function (){
                swal("Oops!This Product already exists!", {
                    icon: "error",
                });
            },
        }
    });
}

function updateData(data) {    
    var id=  $("#editId").val();  
    var shutter 
    var design

    if($("#shutter").prop('checked')== true){
        shutter = "True"
    }
    else{
        shutter = "False"
    }

    if($("#design").prop('checked')== true){
        design = "True"
    }
    else{
        design = "False"
    }
    data.append( "shutter",shutter);                                                
    data.append("design",design);  
    checkUser()
    $.ajax({
        url: "/officialapi/router/window/" + id + "/",
        type: "PUT",
        data: data,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            401: function () {
                swal("Oops! Something went wrong!", {
                    icon: "error",
                });
            },
            200: function (response) {
                var rowMaterial = $("select[name=rowmaterial] option:selected").text();
                var edit = '<a href="#" id=' + response['id'] + ' onClick=getEditData('+response['id']+','+response['rowmaterial']+','+response['shutter']+','+response['design']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                var shutter
                var design
                if(response.shutter != false){
                    shutter = '<div class="check"></div>'
                }
                else{
                    shutter = ''
                }
                if(response.design != false){
                    design = '<div class="check"></div>'
                }
                else{
                    design = ''
                }
                $("#windowAddForm").trigger("reset")
                swal("Oops! Updated Successfully!", {
                    icon: "success",
                });
                var rows = localStorage.getItem("rowNumber")
                var table = $('#windowTable').DataTable()
                table.cell({ row: parseInt(rows), column: 1 }).data(rowMaterial);
                table.cell({ row: parseInt(rows), column: 2 }).data(response['box']);
                table.cell({ row: parseInt(rows), column: 3 }).data(response['labour_charge']);
                table.cell({ row: parseInt(rows), column: 4 }).data(response['factory_price']);
                table.cell({ row: parseInt(rows), column: 5 }).data(response['price']);
                table.cell({ row: parseInt(rows), column: 6 }).data(shutter);
                table.cell({ row: parseInt(rows), column: 7 }).data(design);
                table.cell({ row: parseInt(rows), column: 8 }).data(edit);
                $("#btnSubmit").html('Add')
            },
            208: function (){
                swal("Oops!This Product already exists!", {
                    icon: "error",
                });
            },
        }
    });
}

$(document).on('click', '#btnDelete', function () {
    rowIndex = $(this)
    checkUser()
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this datas!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                var id = $(this).val();
                $.ajax({
                    url: "/officialapi/router/window/" + id + "/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + localStorage.getItem("adminaccesstoken")
                        );
                    },
                    statusCode: {
                        400: function () {
                            swal("Oops! Cannot delete this customer!", {
                                icon: "error",
                            });
                        },
                        204: function () {
                            $(rowIndex).closest('tr').remove();
                            swal("Oops! Deleted Successfully!", {
                                icon: "success",
                            });
                        }
                    },
                })

            } else {
                swal("Your imaginary file is safe!");
            }
        });
});

function getEditData(productId,rowMaterial,shutter,design,rowIndex){
   
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("rowNumber", row)
    var box = $(rowIndex).closest('tr').find("td:eq(2)").html();
    var labourCharge = $(rowIndex).closest('tr').find("td:eq(3)").html();
    var factoryPrice = $(rowIndex).closest('tr').find("td:eq(4)").html();
    var price = $(rowIndex).closest('tr').find("td:eq(5)").html();
    $("select[name=rowmaterial]").val(rowMaterial)
    $("input[name=labour_charge]").val(labourCharge)
    $("input[name=box]").val(box)
    $("input[name=factory_price]").val(factoryPrice)
    $("input[name=price]").val(price)
    $("#btnSubmit").html('Update')
    $("#editId").val(productId);
    if(shutter == true){
        $("#shutter").prop('checked',true)
    }
    else{
        $("#shutter").prop('checked',false)
    }
    if(design == true){
        $("#design").prop('checked',true)
    }
    else{
        $("#design").prop('checked',false)
    }
}

$('.btn-reset').click(function(){
    $("#windowAddForm").trigger("reset")
    $("#btnSubmit").html('Add')
    $('.error').html('')
});


function rowMaterial(){
    checkUser()
    $.ajax({
        url: "/userapi/router/rowmaterials/",
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
                    $("#rowMaterials").append($('<option>').text(rowData['name']).attr('value', rowData['id']));
                }
            }
        }
    });
}

