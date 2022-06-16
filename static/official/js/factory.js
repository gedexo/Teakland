
$('#factoryTable').DataTable();

$(document).ready(function(){
    $.ajax({
        url: "/officialapi/router/factory/",
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
                   table = $("#factoryTable").DataTable();
                   var place = '<a href="#" onclick="factoryLgn('+rowData['id']+')">'+rowData['place']+'</a>'
                   var addUser = '<a href="/official/factory-account/?factory_id='+rowData['id']+'" class=""><i class="icofont-ui-add"></i></a>' 
                   var edit = '<a href="#" id='+rowData['id']+' class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
                   var deleteUser = '<button type="button" id="btnDelete" value='+rowData['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
                   tableData.push([rowData['date'],place,rowData['contactno'],rowData['address'],addUser,edit,deleteUser])
                   table.rows.add(tableData).draw();
                }
            }
        }
    });
});

$("#factoryForm").validate({
    rules:{
        place:{
            required:true,
        },
        contactno:{
            required:true
        },
        address:{
            required:true,
        }
        },
        messages:{
            place:{
                required:"This field is required",
            },
            contactno:{
                required:"This field is required"
            },
            address:{
                required:"This field is required",
            }
        },
        submitHandler: function (e) {
            var data = $(e).serializeArray();
            if($("#editId").val() != ""){
                editFactory(data)
            }
            else{
                saveFactory(data)
            }
        }
});

function saveFactory(data){
    checkUser()
    $.ajax({
        url: "/officialapi/router/factory/",
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
               $("#factoryForm").trigger("reset")
               swal("Oops! Saved Successfully!", {
                icon: "success",
            });
            table = $("#factoryTable").DataTable();
            var place = '<a href="#" onclick="factoryLgn('+response['id']+')">'+response['place']+'</a>'
            var addUser = '<a href="/official/factory-account/?factory_id='+response['id']+'" class=""><i class="icofont-ui-add"></i></a>' 
            var edit = '<a href="#" class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
            var deleteUser = '<button type="button" id="btnDelete" value='+response['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
            tableData.push([response['date'],place,response['contactno'],response['address'],addUser,edit,deleteUser])
            table.rows.add(tableData).draw();
            },
            208: function (){
                swal("Oops! Factory already exists!", {
                    icon: "error",
                });
            },
        }
    });
}

function editFactory(data){
    checkUser()
    var id=  $("#editId").val();
    $.ajax({
        url: "/officialapi/router/factory/"+id+"/",
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
               $("#factoryForm").trigger("reset")
               swal("Oops! Updated Successfully!", {
                icon: "success",
            });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
            var rows = localStorage.getItem("rowNumber")
            var table = $('#factoryTable').DataTable()
            table.cell({row:parseInt(rows),column:1}).data(response['place']);
            table.cell({row:parseInt(rows),column:2}).data(response['contactno']);
            table.cell({row:parseInt(rows),column:3}).data(response['address']);
            },
            208: function (){
                swal("Oops! Factory already exists!", {
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
                $(this).closest('tr').remove();
                $.ajax({
                    url: "/officialapi/router/factory/" + id + "/",
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
    var place = $(this).closest('tr').find("td:eq(1)").html();
    var phone = $(this).closest('tr').find("td:eq(2)").html();
    var address = $(this).closest('tr').find("td:eq(3)").html();
    $("#editId").val(id);
    $("input[name=place]").val(place)
    $("input[name=contactno]").val(phone)
    $("textarea[name=address]").val(address)
});


function factoryLgn(id){
    $.ajax({
        url: "/officialapi/update-user/" + id + "/"+'factory'+"/",
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
            localStorage.setItem('factoryaccesstoken',accesstoken)
            localStorage.setItem('factoryrefreshtoken',refreshtoken)
            window.location.href="/factory/jobcard/"
        },
        500: function () {
            swal("Oops! Something went wrong!", {
                icon: "error",
            });
        }
    }
       
    })

}