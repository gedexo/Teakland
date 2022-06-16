$('#jointTypeTable').DataTable();
$(document).ready(function () {
    $.ajax({
        url: "/userapi/router/joint-type/",
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
                    table = $("#jointTypeTable").DataTable();
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteJointType = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    tableData.push([rowData['date'], rowData['joint_type'],rowData['code'],edit, deleteJointType])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});

$("#jointTypeForm").validate({
    rules: {
        joint_type: {
            required: true,
        },
        code: {
            required: true
        },
    },
    submitHandler: function (e) {
        var data = $(e).serializeArray();
        if ($("#editId").val() != "") {
            updateJointType(data)
        }
        else {
            saveJointType(data)
        }
    }
});

function saveJointType(data) {
    checkUser()
    $.ajax({
        url: "/userapi/router/joint-type/",
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
                $("#jointTypeForm").trigger("reset")
                swal("Oops! Saved Successfully!", {
                    icon: "success",
                });
                table = $("#jointTypeTable").DataTable();
                var edit = '<a href="#" id=' + response['id'] + ' onClick=getEditData('+response['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                var deleteJointType = '<button type="button" id="btnDelete" value=' + response['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                tableData.push([response['date'],response['joint_type'],response['code'],edit, deleteJointType])
                table.rows.add(tableData).draw();
            },
            208: function (){
                swal("Oops!Joint type already exists!", {
                    icon: "error",
                });
            },
        }
    });
}

function updateJointType(data) {                                                         
    checkUser()
    var id = $("#editId").val();
    $.ajax({
        url: "/userapi/router/joint-type/" + id + "/",
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
                $("#jointTypeForm").trigger("reset")
                swal("Oops! Updated Successfully!", {
                    icon: "success",
                });
                var rows = localStorage.getItem("rowNumber")
                var table = $('#jointTypeTable').DataTable()
                table.cell({ row: parseInt(rows), column: 1 }).data(response['joint_type']);
                table.cell({ row: parseInt(rows), column: 2 }).data(response['code']);
                $("#btnSubmit").html('Add')
            },
            208: function (){
                swal("Oops!Joint type already exists!", {
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
                    url: "/userapi/router/joint-type/" + id + "/",
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


function getEditData(customerId,rowIndex){
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("rowNumber", row)
    var jointType = $(rowIndex).closest('tr').find("td:eq(1)").html();
    var code = $(rowIndex).closest('tr').find("td:eq(2)").html();
    $("#editId").val(customerId);
    $("input[name=joint_type]").val(jointType)
    $("input[name=code]").val(code)
    $("#btnSubmit").html('Update')
}

$('.btn-reset').click(function(){
    $("#jointTypeForm").trigger("reset")
    $("#btnSubmit").html('Add')
    $('.error').html('')
});