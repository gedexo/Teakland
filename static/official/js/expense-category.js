$('#categoryTable').DataTable();
$(document).ready(function(){
    $.ajax({
        url: "/officialapi/router/expence-category/",
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
                   table = $("#categoryTable").DataTable();
                   var edit = '<a href="#" id='+rowData['id']+' class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
                   var daleteCategory = '<button type="button" id="btnDelete" value='+rowData['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
                   tableData.push([rowData['category'],edit,daleteCategory])
                   table.rows.add(tableData).draw();
                }
            }
        }
    });
});

$("#categoryForm").validate({
    rules:{
        category:{
            required:true,
        },
        },
        messages:{
            category:{
                required:"This field is required",
            },
        },
        submitHandler: function (e) {
            var data = $(e).serializeArray();
            if($("#editId").val() != ""){
                updateData(data)
            }
            else{
                saveData(data)
            }
        }
});

function saveData(data){
    checkUser()
    $.ajax({
        url: "/officialapi/router/expence-category/",
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
               $("#categoryForm").trigger("reset")
               swal("Oops! Saved Successfully!", {
                icon: "success",
            });
            table = $("#categoryTable").DataTable();
            var edit = '<a href="#" class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
            var daleteCategory = '<button type="button" id="btnDelete" value='+response['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
            tableData.push([response['category'],edit,daleteCategory])
            table.rows.add(tableData).draw();
            },
            208: function (response){
                swal("Oops!",response['msg'], {
                    icon: "error", 
                });
            },
        }
    });
}

function updateData(data){
    checkUser()
    var id=  $("#editId").val();
    $.ajax({
        url: "/officialapi/router/expence-category/"+id+"/",
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
               $("#categoryForm").trigger("reset")
               swal("Oops! Updated Successfully!", {
                icon: "success",
            });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
            var rows = localStorage.getItem("rowNumber")
            var table = $('#categoryTable').DataTable()
            table.cell({row:parseInt(rows),column:0}).data(response['category']);
            },
            208: function (){
                swal("Oops!Rawmaterial already exists!", {
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
                var tableIndex =$(this)
                $.ajax({
                    url: "/officialapi/router/expence-category/" + id + "/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + localStorage.getItem("adminaccesstoken")
                        );
                    },
                    statusCode: {
                        400: function () {
                            swal("Oops! Cannot delete this category!", {
                                icon: "error",
                            });
                        },
                        204: function () {
                            $(tableIndex).closest('tr').remove();
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

$(document).on('click', '.edit-edit', function () {
    var row = $(this).closest("tr").index();
    localStorage.setItem("rowNumber",row)
    checkUser()
    var id = $(this).attr('id')
    var category = $(this).closest('tr').find("td:eq(0)").html();
    $("#editId").val(id);
    $("input[name=category]").val(category)
    $("#btnSubmit").html('Update')
});