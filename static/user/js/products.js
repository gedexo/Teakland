$('#productsTable').DataTable();
category()

$(document).ready(function () {
    $.ajax({
        url: "/userapi/router/products/",
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
                    table = $("#productsTable").DataTable();
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+','+rowData.category['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var addFeautures = '<a href="/add-features/?product_id='+rowData['id']+'" id=' + rowData['id'] + ' class="edit-edit icon-button"><i class="icofont-ui-add"></i></a>'
                    var deleteProduct = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    tableData.push([rowData['date'], rowData['name'], rowData.category['name'], rowData['type'], addFeautures, edit, deleteProduct])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});

$("#productsForm").validate({
    rules: {
        name: {
            required: true,
        },
        type: {
            required: true
        },
        category: {
            required: true
        }
    },
    messages: {
        name: {
            required: "This field is required",
        },
    },
    submitHandler: function (e) {
        var data = $(e).serializeArray();
        if ($("#editId").val() != "") {
            updateProduct(data)
        }
        else {
            saveProduct(data)
        }
    }
});

function saveProduct(data) {
    checkUser()
    $.ajax({
        url: "/userapi/router/products/",
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
                var category = $("select[name=category] option:selected").text();
                var tableData = [];
                $("#productsForm").trigger("reset")
                $("#productName").focus();
                swal("Oops! Saved Successfully!", {
                    icon: "success",
                });
                table = $("#productsTable").DataTable();
                var edit = '<a href="#" id=' + response['id'] + ' onClick=getEditData('+response['id']+','+response['category']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                var addFeautures = '<a href="/add-features/?product_id='+response['id']+'" id=' + response['id'] + ' class="edit-edit icon-button"><i class="icofont-ui-add"></i></a>'
                var deleteProduct = '<button type="button" id="btnDelete" value=' + response['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                tableData.push([response['date'], response['name'], category, response['type'], addFeautures, edit, deleteProduct])
                table.rows.add(tableData).draw();
            },
            208: function () {
                swal("Oops!product already exists!", {
                    icon: "error",
                });
            },
        }
    });
}

function updateProduct(data) {                                                         
    checkUser()
    var id = $("#editId").val();
    $.ajax({
        url: "/userapi/router/products/" + id + "/",
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
                var category = $("select[name=category] option:selected").text();
                $("#productsForm").trigger("reset")
                swal("Oops! Updated Successfully!", {
                    icon: "success",
                });
              
                var rows = localStorage.getItem("rowNumber")
                var table = $('#productsTable').DataTable()
                table.cell({ row: parseInt(rows), column: 1 }).data(response['name']);
                table.cell({ row: parseInt(rows), column: 2 }).data(category);
                table.cell({ row: parseInt(rows), column: 3 }).data(response['type']);
                $("#btnSubmit").html('Add Product')
            },
            208: function () {
                swal("Oops! Product already exists!", {
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
                    url: "/userapi/router/products/" + id + "/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + localStorage.getItem("useraccesstoken")
                        );
                    },
                    statusCode: {
                        400: function () {
                            swal("Oops! Cannot delete this product!", {
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


function category() {
    checkUser()
    $.ajax({
        url: "/userapi/router/category/",
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
                    $("[id=productCategory]").append($('<option>').text(rowData['name']).attr('value', rowData['id']));
                }
            }
        }
    });
}

function getEditData(productId,categoryId,rowIndex){
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("rowNumber", row)
    var name = $(rowIndex).closest('tr').find("td:eq(1)").html();
    var type = $(rowIndex).closest('tr').find("td:eq(3)").html();
    $("#editId").val(productId);
    $("input[name=name]").val(name)
    $("input[name=type]").val(type)
    $("select[name=category]").val(categoryId)
    $("#btnSubmit").html('Update Product')
}

