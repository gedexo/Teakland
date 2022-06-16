rowMaterial()
otherProducts()
function otherProducts(){
    $.ajax({
        url: "/officialapi/router/other-products/",
        type: "GET",
        beforeSend: function (xhr) {
            $("#othersTable").addClass('table-loader');
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                table = $("#othersTable").DataTable();
                table.clear()
                table.draw()
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var tableData = [];
                    table = $("#othersTable").DataTable();
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+','+rowData.rowmaterial['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteProduct = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    tableData.push([rowData['date'],rowData['name'],rowData.rowmaterial['name'],rowData['price_cost'],rowData['sales_rate'],edit, deleteProduct])
                    table.rows.add(tableData).draw();
                }
            }
        }
        
    });
    $("#othersTable").removeClass('table-loader');

}

$("#othersProductForm").validate({
    rules: {
        rowmaterial: {
            required: true,
        },
        name:{
            required:true,
        },
        sales_rate: {
            required: true
        },
    },
    submitHandler: function (e) {
        var data = $("#othersProductForm").serializeArray();
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
        url: "/officialapi/router/other-products/",
        type: "POST",
        data: data,
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
                $("#othersProductForm").trigger("reset")
                swal("Oops! Saved Successfully!", {
                    icon: "success",
                });
                var tableData = [];
                table = $("#othersTable").DataTable();
                var edit = '<a href="#" id=' + response['id'] + ' onClick=getEditData('+response['id']+','+response['rowmaterial']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                var deleteProduct = '<button type="button" id="btnDelete" value=' + response['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                tableData.push([response['date'],response['name'],rowMaterial,response['price_cost'],response['sales_rate'],edit, deleteProduct])
                table.rows.add(tableData).draw();
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
    var id=  $("#editId").val();  
    checkUser()
    $.ajax({
        url: "/officialapi/router/other-products/" + id + "/",
        type: "PUT",
        data: data,
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
                $("#btnSubmit").html('Add')
                var rowMaterial = $("select[name=rowmaterial] option:selected").text();
                var edit = '<a href="#" id=' + response['id'] + ' onClick=getEditData('+response['id']+','+response['rowmaterial']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                $("#othersProductForm").trigger("reset")
                swal("Oops! Updated Successfully!", {
                    icon: "success",
                });
               otherProducts()
                
            },
            400: function (){
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
                    url: "/officialapi/router/other-products/" + id + "/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + localStorage.getItem("adminaccesstoken")
                        );
                    },
                    statusCode: {
                        400: function () {
                            swal("Oops! Cannot delete this product!", {
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

function getEditData(productId,rowMaterial,rowIndex){
   
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("rowNumber", row)
    var name = $(rowIndex).closest('tr').find("td:eq(1)").html();
    var costPrice = $(rowIndex).closest('tr').find("td:eq(3)").html();
    var salesPrice = $(rowIndex).closest('tr').find("td:eq(4)").html();
    // var shutter = $(rowIndex).closest('tr').find("td:eq(5)").html();
    $("select[name=rowmaterial]").val(rowMaterial)
    $("input[name=price_cost]").val(costPrice)
    $("input[name=name]").val(name)
    $("input[name=sales_rate]").val(salesPrice)
    $("#btnSubmit").html('Update')
    $("#editId").val(productId);
}

$('.btn-reset').click(function(){
    $("#othersProductForm").trigger("reset")
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

