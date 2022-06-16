
$('#userTable').DataTable();

$(document).ready(function(){
    $.ajax({
        url: "/officialapi/router/users/",
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
                   table = $("#userTable").DataTable();
                   var user  = '<a onclick="userLgn('+rowData['id']+')" class="">'+rowData['name']+'</a>' 
                   var addUser = '<a href="/official/user-account/?user_id='+rowData['id']+'" class=""><i class="icofont-ui-add"></i></a>' 
                   var edit = '<a href="#" id='+rowData['id']+' class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
                   var deleteUser = '<button type="button" id="btnDelete" value='+rowData['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
                   tableData.push([rowData['date'],user,rowData['place'],rowData['branch_key'],rowData['phonenumber'],rowData['email'],rowData['address'],addUser,edit,deleteUser])
                   table.rows.add(tableData).draw();
                }
            }
        }
    });
});

$("#userForm").validate({
    rules:{
        name:{
            required:true,
        },
        place:{
            required:true,
        },
        phonenumber:{
            required:true
        },
        branch_key:{
            required:true,
        },
        email:{
            required:true,
            email:true
            },
        address:{
            required:true,
        }
        },
        messages:{
            name:{
                required:"This field is required",
            },
            place:{
                required:"This field is required",
            },
            phonenumber:{
                required:"This field is required"
            },
            email:{
                required:"This field is required",
                email:"Please enter a valid email"
            },
            address:{
                required:"This field is required",
            }
        },
        submitHandler: function (e) {
            var data = $(e).serializeArray();
            if($("#editId").val() != ""){
                editUser(data)
            }
            else{
                saveUser(data)
            }
        }
});

function saveUser(data){
    checkUser()
    $.ajax({
        url: "/officialapi/router/users/",
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
            var tableData = [];
               $("#userForm").trigger("reset")
               swal("Oops! Saved Successfully!", {
                icon: "success",
            });
            table = $("#userTable").DataTable();
            var user  = '<a onclick="userLgn('+response['id']+')" class="">'+response['name']+'</a>' 
            var addUser = '<a href="/official/user-account/?user_id='+response['id']+'" class=""><i class="icofont-ui-add"></i></a>' 
            var edit = '<a href="#" id='+response['id']+' class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
            var deleteUser = '<button type="button" id="btnDelete" value='+response['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
            tableData.push([response['date'],user,response['place'],response['branch_key'],response['phonenumber'],response['email'],response['address'],addUser,edit,deleteUser])
            table.rows.add(tableData).draw();
            },
            208: function (){
                swal("Oops! Branch already exists!", {
                    icon: "error",
                });
            },
        }
    });
}

function editUser(data){
    checkUser()
    var id=  $("#editId").val();
    $.ajax({
        url: "/officialapi/router/users/"+id+"/",
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
               $("#userForm").trigger("reset")
               swal("Oops! Updated Successfully!", {
                icon: "success",
            });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
            var rows = localStorage.getItem("rowNumber")
            var table = $('#userTable').DataTable()
            table.cell({row:parseInt(rows),column:1}).data(response['name']);
            table.cell({row:parseInt(rows),column:2}).data(response['place']);
            table.cell({row:parseInt(rows),column:3}).data(response['branch_key']);
            table.cell({row:parseInt(rows),column:4}).data(response['phonenumber']);
            table.cell({row:parseInt(rows),column:5}).data(response['email']);
            table.cell({row:parseInt(rows),column:6}).data(response['address']);
            },
            208: function (){
                swal("Oops! Branch already exists!", {
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
                    url: "/officialapi/router/users/" + id + "/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + localStorage.getItem("adminaccesstoken")
                        );
                    },
                    statusCode: {
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
                }
                   
                })
            }
        });
});

$(document).on('click', '.edit-edit', function () {
    var row = $(this).closest("tr").index();
    localStorage.setItem("rowNumber",row)
    checkUser()
    var id = $(this).attr('id')
    var name = $(this).closest('tr').find("td:eq(1)").html();
    var place = $(this).closest('tr').find("td:eq(2)").html();
    var branchKey = $(this).closest('tr').find("td:eq(3)").html();
    var phone = $(this).closest('tr').find("td:eq(4)").html();
    var email = $(this).closest('tr').find("td:eq(5)").html();
    var address = $(this).closest('tr').find("td:eq(6)").html();
    $("#editId").val(id);
    $("input[name=name]").val(name)
    $("input[name=place]").val(place)
    $("input[name=branch_key]").val(branchKey)
    $("input[name=phonenumber]").val(phone)
    $("input[name=email]").val(email)
    $("textarea[name=address]").val(address)
});


function userLgn(id){
    $.ajax({
        url: "/officialapi/update-user/" + id + "/"+'branch'+"/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
        200: function () {
            accesstoken = localStorage.getItem('adminaccesstoken')
            refreshtoken = localStorage.getItem('adminrefreshtoken')
            localStorage.setItem('useraccesstoken',accesstoken)
            localStorage.setItem('userrefreshtoken',refreshtoken)
            window.location.href="/dashboard/"
        },
        500: function () {
            swal("Oops! Something went wrong!", {
                icon: "error",
            });
        }
    }
       
    })

}