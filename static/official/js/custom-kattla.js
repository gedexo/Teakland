rowMaterial()
$(document).ready(function () {
    $.ajax({
        url: "/officialapi/router/custom-kattla/",
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
                    table = $("#kattlaTable").DataTable();
                    var images = '<button data-bs-toggle="modal" onclick="customkattlaImageModal('+rowData['id']+')" value='+rowData['id']+' data-bs-target="#kattlaProductImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+','+rowData.rowmaterial['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteProduct = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    tableData.push([rowData['date'], rowData.rowmaterial['name'],rowData['labour_charge'],rowData['factory_price'],rowData['price'],images,edit, deleteProduct])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});

$("#kattlaAddForm").validate({
    rules: {
        rowmaterial: {
            required: true,
        },
        price: {
            required: true,
            min:1
        }
    },
    submitHandler: function (e) {
        var data = new FormData($("#kattlaAddForm")[0]);
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
    checkUser()
    $.ajax({
        url: "/officialapi/router/custom-kattla/",
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
                var tableData = [];
                $("#kattlaAddForm").trigger("reset")
                swal("Oops! Saved Successfully!", {
                    icon: "success",
                });
                var tableData = [];
                table = $("#kattlaTable").DataTable();
                var images = '<button data-bs-toggle="modal" onclick="customkattlaImageModal('+response['id']+')" value='+response['id']+' data-bs-target="#kattlaProductImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                var edit = '<a href="#" id=' + response['id'] + ' onClick=getEditData('+response['id']+','+response['rowmaterial']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                var deleteProduct = '<button type="button" id="btnDelete" value=' + response['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                tableData.push([response['date'],rowMaterial,response['labour_charge'],response['factory_price'],response['price'],images,edit, deleteProduct])
                table.rows.add(tableData).draw();
            },
            208: function (){
                swal("Oops!This Product already exists!", {
                    icon: "error",
                });
            },
            400: function (){
                swal("Oops!This Product already exists!", {
                    icon: "error",
                });
            },
        }
    });
}

function updateData(data) {    
    var id =  $("#editId").val();                                                
    checkUser()
    $.ajax({
        url: "/officialapi/router/custom-kattla/" + id + "/",
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
                $("#kattlaAddForm").trigger("reset")
                swal("Oops! Updated Successfully!", {
                    icon: "success",
                });
                
                var rows = localStorage.getItem("rowNumber")
                var table = $('#kattlaTable').DataTable()
                table.cell({ row: parseInt(rows), column: 1 }).data(rowMaterial);
                table.cell({ row: parseInt(rows), column: 2 }).data(response['labour_charge']);
                table.cell({ row: parseInt(rows), column: 3 }).data(response['factory_price']);
                table.cell({ row: parseInt(rows), column: 4 }).data(response['price']);
                $("#btnSubmit").html('Add')
            },
            208: function (){
                swal("Oops!This Product already exists!", {
                    icon: "error",
                });
            },
            400: function () {
                swal("Oops! This Product already exists!", {
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
                    url: "/officialapi/router/custom-kattla/" + id + "/",
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

function getEditData(productId,rowMaterial,rowIndex){
   
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("rowNumber", row)
    var labourcharge = $(rowIndex).closest('tr').find("td:eq(2)").html();
    var factoryPrice = $(rowIndex).closest('tr').find("td:eq(3)").html();
    var price = $(rowIndex).closest('tr').find("td:eq(4)").html();
    $("select[name=rowmaterial]").val(rowMaterial)
    $("input[name=price]").val(price)
    $("input[name=factory_price]").val(factoryPrice)
    $("input[name=labour_charge]").val(labourcharge)
    $("#btnSubmit").html('Update')
    $("#editId").val(productId);
}

$('.btn-reset').click(function(){
    $("#kattlaAddForm").trigger("reset")
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

