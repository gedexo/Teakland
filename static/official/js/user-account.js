
$('#userTable').DataTable();
var searchParams = new URLSearchParams(window.location.search)
var user = searchParams.get('user_id')
var userId
users()
function users(){
    $.ajax({
        url: "/officialapi/router/user-login-details/?user_id=" + user,
        type: "GET",
        beforeSend: function (xhr) {
            $("#userTable").addClass('table-loader');
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
                    var phone
                    if (rowData['is_active'] == true) {
                        status = '  <label class="switch"><input id=' + rowData['id'] + ' type="checkbox" onchange=updateStatus(' + rowData['id'] + ') id="activeChk"  checked/><div class="slider round"></div></label> '
                    }
                    else {
                        status = '  <label class="switch"><input id=' + rowData['id'] + ' type="checkbox" onchange=updateStatus(' + rowData['id'] + ') id="deactiveChk" /><div class="slider round"></div></label> '
                    }
                    if(rowData['phone'] != null){
                        phone = rowData['phone']
                    }
                    else{
                        phone = '<a  value=' + rowData['id'] + ' onclick="userPhone('+rowData['id']+')"><i class="icofont-ui-add"></i></a>'
                    }
                    var tableData = [];
                    table = $("#userTable").DataTable();
                    var fullName = rowData['first_name'] + ' ' + rowData['last_name']
                    var deleteUser = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    tableData.push([rowData['date'], fullName,phone, rowData['email'], status, deleteUser])
                    table.rows.add(tableData).draw();
                }
                $("#userTable").removeClass('table-loader');
            }
        }
    });
}

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
        phone:{
            required:true,
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
    obj = { name: 'user', value: user }
    data.push(obj)
    $.ajax({
        url: "/officialapi/create-user-acccount/",
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
                var status = '  <label class="switch"><input id=' + response['id'] + ' type="checkbox" onchange=updateStatus(' + response['id'] + ') id="activeChk"  checked/><div class="slider round"></div></label> '
                var tableData = [];
                $("#userForm").trigger("reset")
                swal("Oops! Saved Successfully!", {
                    icon: "success",
                });
                table = $("#userTable").DataTable();
                var fullName = response['first_name'] + ' ' + response['last_name']
                var deleteUser = '<button type="button" id="btnDelete" value=' + response['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                tableData.push([response['date'], fullName,response['phone'], response['email'],status, deleteUser])
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

function updateStatus(id) {
    checkUser()
    var status
    if ($("#" + id).is(':checked')) {
        status = 'True'
    }
    else {
        status = 'False'
    }
    data = {
        'id': id,
        'status': status
    }
    $.ajax({
        url: "/officialapi/user-permission/",
        type: "PUT",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function () {
            },
            400:function(){
                swal("Oops! Something went wrong!", {
                    icon: "error",
                });
            }
        }
    });
}

function userPhone(id,contactNo){
    userId = id
    $("#userContactModal").modal('show')
}
$("#userContactForm").validate({
    rules: {
        phone: {
            required: true,
        },
    },
    submitHandler: function (e) {
        var data = $(e).serializeArray();
        $.ajax({
            url: "/officialapi/router/user-login-details/"+userId+"/",
            type: "patch",
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("adminaccesstoken")
                );
            },
            statusCode: {
                200: function (response) {
                    $("#userContactModal").modal('hide')
                    users()
                }
            }
    
        });
    }
});