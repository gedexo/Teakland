$('#userTable').DataTable();
var searchParams = new URLSearchParams(window.location.search)
var user = searchParams.get('user_id')
var editId
officialUsers();
function officialUsers() {
    $.ajax({
        url: "/officialapi/router/user-login-details/?is_admin=True",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                table = $("#userTable").DataTable();
                table.clear()
                table.draw()
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var status
                    if (rowData['is_active'] == true) {
                        status = '  <label class="switch"><input id=' + rowData['id'] + ' type="checkbox" onchange=updateStatus(' + rowData['id'] + ') id="activeChk"  checked/><div class="slider round"></div></label> '
                    }
                    else {
                        status = '  <label class="switch"><input id=' + rowData['id'] + ' type="checkbox" onchange=updateStatus(' + rowData['id'] + ') id="deactiveChk" /><div class="slider round"></div></label> '
                    }
                    var tableData = [];
                    table = $("#userTable").DataTable();
                    var fullName = rowData['first_name'] + ' ' + rowData['last_name']
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=getEditData(' + rowData['id'] + ') class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteUser = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    tableData.push([rowData['date'], fullName, rowData['email'], edit, deleteUser])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
};

$("#userForm").validate({
    rules: {
        email: {
            required: true,
            email: true,
        },
        password: {
            required: true,
        },
        first_name: {
            required: true,
        },
        last_name: {
            required: true,
        },
        confirmpassword: {
            required: true,
            equalTo: "#password"
        },
    },
    submitHandler: function (e) {
        var data = $(e).serializeArray();
        saveUser(data)
    }
});

function saveUser(data) {
    checkUser()
    $.ajax({
        url: "/officialapi/create-official-user-acccount/",
        type: "POST",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            400: function () {
                swal("Oops! Email already exists!", {
                    icon: "error",
                });
            },
            201: function (response) {
                $("[id=passwordDiv]").show();
                var status = '  <label class="switch"><input id=' + response['id'] + ' type="checkbox" onchange=updateStatus(' + response['id'] + ') id="activeChk"  checked/><div class="slider round"></div></label> '
                var tableData = [];
                $("#userForm").trigger("reset")
                swal("Oops! Saved Successfully!", {
                    icon: "success",
                });
                table = $("#userTable").DataTable();
                var fullName = response['first_name'] + ' ' + response['last_name']
                var deleteUser = '<button type="button" id="btnDelete" value=' + response['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                tableData.push([response['date'], fullName, response['email'], deleteUser])
                table.rows.add(tableData).draw();
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
                    url: "/officialapi/router/user-login-details/" + id + "/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + localStorage.getItem("adminaccesstoken")
                        );
                    },
                    statusCode: {
                        500: function () {
                            swal("Oops! This data cannot be deleted!", {
                                icon: "error",
                            });
                        },
                    },
                    success: function () {
                        $(rowIndex).closest('tr').remove();

                        swal("Oops! Deleted Successfully!", {
                            icon: "success",
                        });
                    }
                })

            } else {
                swal("Your imaginary file is safe!");
            }
        });
});


function getEditData(id) {
    $.ajax({
        url: "/officialapi/router/user-login-details/" + id + "/?is_admin=True",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                editId = response['id']
                $("#firstName").val(response['first_name'])
                $("#lastName").val(response['last_name'])
                $("#userEditModal").modal('show');
            }
        }
    });
}

$("#userDetailsUpdate").validate({
    rules: {
        first_name: {
            required: true,
        },
        last_name: {
            required: true,
        },
    },
    submitHandler: function (e) {
        var data = $(e).serializeArray();
        updateUser(data)
        return false;
    }
});


function updateUser(data) {
    $.ajax({
        url: "/officialapi/router/user-login-details/" + editId + "/?is_admin=True",
        type: "PATCH",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                officialUsers()
                $("#userEditModal").modal('hide');
            }
        }
    });
    return false;
}
