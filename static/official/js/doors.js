
rowMaterial()
jointType()

$(document).ready(function () {
    $.ajax({
        url: "/officialapi/router/doors/",
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
                    table = $("#doorsTable").DataTable();
                    var images = '<button data-bs-toggle="modal" onclick="doorImageModal('+rowData['id']+')" value='+rowData['id']+' data-bs-target="#doorProductImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                    var jointType = rowData.joint['joint_type'] +'-'+rowData.joint['code']
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+','+rowData.rowmaterial['id']+','+rowData.joint['id'] +',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteProduct = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    tableData.push([rowData['date'], rowData.rowmaterial['name'],rowData['doortype'], jointType, rowData['labour_charge'],rowData['factory_price'],rowData['price'],images,edit, deleteProduct])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});

$("#doorsAddForm").validate({
    rules: {
        rowmaterial: {
            required: true,
        },
        doortype: {
            required: true
        },
        joint: {
            required: true
        },
        labour_charge: {
            required: true
        },
        price: {
            required: true
        },
    },
    submitHandler: function (e) {
        var data = new FormData($("#doorsAddForm")[0]);
        if ($("#editId").val() != "") {
            updateData(data)
        }
        else {
            saveData(data)
        }
    }

});

function saveData(data) {
    checkUser()
    $.ajax({
        url: "/officialapi/router/doors/",
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
                var jointType = $("select[name=joint] option:selected").text();
                var rowMaterial = $("select[name=rowmaterial] option:selected").text();
                var tableData = [];
                $("#doorsAddForm").trigger("reset")
                swal("Oops! Saved Successfully!", {
                    icon: "success",
                });
                var tableData = [];
                table = $("#doorsTable").DataTable();
                var images = '<button data-bs-toggle="modal" onclick="doorImageModal('+response['id']+')" value='+response['id']+' data-bs-target="#doorProductImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                var edit = '<a href="#" id=' + response['id'] + ' onClick=getEditData('+response['id']+','+response['rowmaterial']+','+response['joint'] +',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                var deleteProduct = '<button type="button" id="btnDelete" value=' + response['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                tableData.push([response['date'], rowMaterial,response['doortype'], jointType, response['labour_charge'],response['factory_price'],response['price'],images,edit,deleteProduct])
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
    checkUser()
    $.ajax({
        url: "/officialapi/router/doors/" + id + "/",
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
                var jointType = $("select[name=joint] option:selected").text();
                var rowMaterial = $("select[name=rowmaterial] option:selected").text();
                $("#doorsAddForm").trigger("reset")
                swal("Oops! Updated Successfully!", {
                    icon: "success",
                });
                var rows = localStorage.getItem("rowNumber")
                var table = $('#doorsTable').DataTable()
                table.cell({ row: parseInt(rows), column: 0 }).data(response['date']);
                table.cell({ row: parseInt(rows), column: 1 }).data(rowMaterial);
                table.cell({ row: parseInt(rows), column: 2 }).data(response['doortype']);
                table.cell({ row: parseInt(rows), column: 3 }).data(jointType);
                table.cell({ row: parseInt(rows), column: 4 }).data(response['labour_charge']);
                table.cell({ row: parseInt(rows), column: 5 }).data(response['factory_price']);
                table.cell({ row: parseInt(rows), column: 6 }).data(response['price']);

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
                    url: "/officialapi/router/doors/" + id + "/",
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
                        },
                        500: function () {
                            swal("Oops! This data canot be deleted!", {
                                icon: "error",
                            });
                        }
                    },
                })

            } else {
                swal("Your imaginary file is safe!");
            }
        });
});

function getEditData(productId,rowMaterial,jointType,rowIndex){
   
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("rowNumber", row)
    var doorType = $(rowIndex).closest('tr').find("td:eq(2)").html();
    var labourCharge = $(rowIndex).closest('tr').find("td:eq(4)").html();
    var factoryPrice = $(rowIndex).closest('tr').find("td:eq(5)").html();
    var price = $(rowIndex).closest('tr').find("td:eq(6)").html();

    $("#editId").val(productId);
    $("select[name=rowmaterial]").val(rowMaterial)
    $("select[name=doortype]").val(doorType)
    $("select[name=joint]").val(jointType)
    $("input[name=labour_charge]").val(labourCharge)
    $("input[name=price]").val(price)
    $("input[name=factory_price]").val(factoryPrice)
    $("#btnSubmit").html('Update')
}

$('.btn-reset').click(function(){
    $("#doorsAddForm").trigger("reset")
    $("#btnSubmit").html('Add')
    $('.error').html('')
});


function rowMaterial(){
    $("[id=salesMan]").empty();
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

function jointType(){
    $("[id=salesMan]").empty();
    checkUser()
    $.ajax({
        url: "/userapi/router/joint-type/",
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