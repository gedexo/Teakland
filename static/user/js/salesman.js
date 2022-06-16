$('#salesManTable').DataTable();

$(document).ready(function () {
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
                    var tableData = [];
                    table = $("#salesManTable").DataTable();
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=getEditData(' + rowData['id'] +',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteSalesMan = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    tableData.push([rowData['date'], rowData['name'],rowData['place'],rowData['email'],rowData['phone'],rowData['address'],edit, deleteSalesMan])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});

$("#salesManForm").validate({
    rules: {
        name: {
            required: true,
        },
        email: {
            required: true,
            email: true
        },
        phone: {
            required: true
        },
        address: {
            required: true
        }
    },
    submitHandler: function (e) {
        var data = $(e).serializeArray();
        if ($("#editId").val() != "") {
            updateSalesMan(data)
        }
        else {
            saveSalesMan(data)
        }
    }
});

function saveSalesMan(data) {
    checkUser()
    $.ajax({
        url: "/userapi/router/salesman/",
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
                var tableData = [];
                $("#salesManForm").trigger("reset")
                swal("Oops! Saved Successfully!", {
                    icon: "success",
                });
                table = $("#salesManTable").DataTable();
                var edit = '<a href="#" id=' + response['id'] + ' class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                var deleteSalesMan = '<button type="button" id="btnDelete" value=' + response['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                tableData.push([response['date'], response['name'],response['place'],response['email'],response['phone'],response['address'],edit, deleteSalesMan])
                table.rows.add(tableData).draw();
            },
            208: function () {
                swal("Oops!salesman already exists!", {
                    icon: "error",
                });
            },
        }
    });
}

function updateSalesMan(data) {
    checkUser()
    var id = $("#editId").val();
    $.ajax({
        url: "/userapi/router/salesman/" + id + "/",
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
                $("#salesManForm").trigger("reset")
                swal("Oops! Updated Successfully!", {
                    icon: "success",
                });

                var rows = localStorage.getItem("rowNumber")
                var table = $('#salesManTable').DataTable()
                table.cell({ row: parseInt(rows), column: 1 }).data(response['name']);
                table.cell({ row: parseInt(rows), column: 2 }).data(response['place']);
                table.cell({ row: parseInt(rows), column: 3 }).data(response['email']);
                table.cell({ row: parseInt(rows), column: 4 }).data(response['phone']);
                table.cell({ row: parseInt(rows), column: 5 }).data(response['address']);
                $("#btnSubmit").html('Add salesman')
            },
            208: function () {
                swal("Oops! salesman already exists!", {
                    icon: "error",
                });
            },
        }
    });
}

$(document).on('click', '#btnDelete', function () {
    rowIndex  = $(this)
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
                    url: "/userapi/router/salesman/" + id + "/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + localStorage.getItem("useraccesstoken")
                        );
                    },
                    statusCode: {
                        400: function () {
                            swal("Oops! Cannot delete this salesman!", {
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

function getEditData(salesmanId,rowIndex) {
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("rowNumber", row)
    var name = $(rowIndex).closest('tr').find("td:eq(1)").html();
    var place = $(rowIndex).closest('tr').find("td:eq(2)").html();
    var email = $(rowIndex).closest('tr').find("td:eq(3)").html();
    var phone = $(rowIndex).closest('tr').find("td:eq(4)").html();
    var address = $(rowIndex).closest('tr').find("td:eq(5)").html();
    $("#editId").val(salesmanId);
    $("input[name=name]").val(name)
    $("input[name=place]").val(place)
    $("input[name=email]").val(email)
    $("input[name=phone]").val(phone)
    $("textarea[name=address]").val(address)
    $("#btnSubmit").html('Update')
}

$('.btn-reset').click(function(){
    $("#salesManForm").trigger("reset")
    $("#btnSubmit").html('Add')
    $('.error').html('')
});