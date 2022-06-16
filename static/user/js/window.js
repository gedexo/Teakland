
rowMaterial()
$(document).ready(function () {
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
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+','+rowData.rowmaterial['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteProduct = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    tableData.push([rowData['date'], rowData.rowmaterial['name'],rowData['box'],rowData['labour_charge'],rowData['price'],shutter,design,images])
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
        var data = $(e).serializeArray();
        if ($("#editId").val() != "") {
            updateData(data)
        }
        else {
            saveData(data)
        }
    }
});

function saveData(data) {
    var shutter  
    if($("#shutter").prop('checked')== true){
        shutter = "True"
    }
    else{
        shutter="False"
    }
    data[data.length] = { name: "shutter", value: shutter };  

    checkUser()
    $.ajax({
        url: "/userapi/router/window/",
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
                var rowMaterial = $("select[name=rowmaterial] option:selected").text();
                var tableData = [];
                $("#windowAddForm").trigger("reset")
                swal("Oops! Saved Successfully!", {
                    icon: "success",
                });
                var tableData = [];
                table = $("#windowTable").DataTable();
                var edit = '<a href="#" id=' + response['id'] + ' onClick=getEditData('+response['id']+','+response['rowmaterial']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                var deleteProduct = '<button type="button" id="btnDelete" value=' + response['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                tableData.push([response['date'],rowMaterial,response['box'],response['labour_charge'],response['price'],response['shutter'],edit, deleteProduct])
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
    if($("#shutter").prop('checked')== true){
        shutter = "True"
    }
    else{
        shutter = "False"
    }
    data[data.length] = { name: "shutter", value: shutter };                                                 
    checkUser()
    $.ajax({
        url: "/userapi/router/window/" + id + "/",
        type: "PUT",
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
            200: function (response) {
                var rowMaterial = $("select[name=rowmaterial] option:selected").text();
                $("#windowAddForm").trigger("reset")
                swal("Oops! Updated Successfully!", {
                    icon: "success",
                });
                
                var rows = localStorage.getItem("rowNumber")
                var table = $('#windowTable').DataTable()
                table.cell({ row: parseInt(rows), column: 1 }).data(rowMaterial);
                table.cell({ row: parseInt(rows), column: 2 }).data(response['box']);
                table.cell({ row: parseInt(rows), column: 3 }).data(response['labour_charge']);
                table.cell({ row: parseInt(rows), column: 4 }).data(response['price']);
                table.cell({ row: parseInt(rows), column: 5 }).data(response['shutter']);
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
                $(this).closest('tr').remove();
                $.ajax({
                    url: "/userapi/router/window/" + id + "/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + localStorage.getItem("useraccesstoken")
                        );
                    },
                    statusCode: {
                        400: function () {
                            swal("Oops! Cannot delete this customer!", {
                                icon: "error",
                            });
                        },
                        204: function () {
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

function getEditData(productId,rowMaterial,rowIndex){
   
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("rowNumber", row)
    var box = $(rowIndex).closest('tr').find("td:eq(2)").html();
    var labourCharge = $(rowIndex).closest('tr').find("td:eq(3)").html();
    var price = $(rowIndex).closest('tr').find("td:eq(4)").html();
    var shutter = $(rowIndex).closest('tr').find("td:eq(5)").html();
    $("select[name=rowmaterial]").val(rowMaterial)
    $("input[name=labour_charge]").val(labourCharge)
    $("input[name=box]").val(box)
    $("input[name=price]").val(price)
    $("#btnSubmit").html('Update')
    $("#editId").val(productId);
    if(shutter == 'true'){
        $("#shutter").prop('checked',true)
    }
    else{
        $("#shutter").prop('checked',false)
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
                    $("#rowMaterials").append($('<option>').text(rowData['name']).attr('value', rowData['id']));
                }
            }
        }
    });
}

