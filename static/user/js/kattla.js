rowMaterial()
$(document).ready(function () {
    $.ajax({
        url: "/userapi/router/kattla/",
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
                    var doorType
                    if(rowData['open_closed'] != false){
                        doorType = 'closed'
                    }
                    else{
                        doorType = 'open'
                    }
                    var images = '<button data-bs-toggle="modal" onclick="kattlaImageModal('+rowData['id']+')" value='+rowData['id']+' data-bs-target="#kattlaProductImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+','+rowData.rowmaterial['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteProduct = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    tableData.push([rowData['date'], rowData.rowmaterial['name'],rowData['kattlatype'],rowData['labour_charge'],rowData['price'],rowData['noofboxes'],doorType,images])
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
    checkUser()
    $.ajax({
        url: "/userapi/router/kattla/",
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
                $("#kattlaAddForm").trigger("reset")
                swal("Oops! Saved Successfully!", {
                    icon: "success",
                });
                var tableData = [];
                table = $("#kattlaTable").DataTable();
                var edit = '<a href="#" id=' + response['id'] + ' onClick=getEditData('+response['id']+','+response['rowmaterial']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                var deleteProduct = '<button type="button" id="btnDelete" value=' + response['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                tableData.push([response['date'],rowMaterial,response['price'],response['labour_charge'],edit, deleteProduct])
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
    var id =  $("#editId").val();                                                
    checkUser()
    $.ajax({
        url: "/userapi/router/kattla/" + id + "/",
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
                $("#kattlaAddForm").trigger("reset")
                swal("Oops! Updated Successfully!", {
                    icon: "success",
                });
                
                var rows = localStorage.getItem("rowNumber")
                var table = $('#kattlaTable').DataTable()
                table.cell({ row: parseInt(rows), column: 1 }).data(rowMaterial);
                table.cell({ row: parseInt(rows), column: 2 }).data(response['price']);
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
                    url: "/userapi/router/kattla/" + id + "/",
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
    var price = $(rowIndex).closest('tr').find("td:eq(2)").html();
    $("select[name=rowmaterial]").val(rowMaterial)
    $("input[name=plane]").val(plane)
    $("input[name=price]").val(price)
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

