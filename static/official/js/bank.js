
$('#bankTable').DataTable();

$(document).ready(function(){
    $.ajax({
        url: "/officialapi/router/bank/",
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
                   table = $("#bankTable").DataTable();
                   var edit = '<a href="#" id='+rowData['id']+' class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
                   var deleteBank = '<button type="button" id="btnDelete" value='+rowData['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
                   tableData.push([rowData['date'],rowData['name'],rowData['ifsccode'],rowData['accountno'],edit,deleteBank])
                   table.rows.add(tableData).draw();
                }
            }
        }
    });
});

$("#bankForm").validate({
    rules:{
        name:{
            required:true,
        },
        ifsccode:{
            required:true,
        },
        accountno:{
            required:true
        },
        },
        messages:{
            name:{
                required:"This field is required",
            },
            ifsccode:{
                required:"This field is required",
            },
            accountno:{
                required:"This field is required"
            },
        },
        submitHandler: function (e) {
            var data = $(e).serializeArray();
            if($("#editId").val() != ""){
                editBank(data)
            }
            else{
                saveBank(data)
            }
        }
});

function saveBank(data){
    checkUser()
    $.ajax({
        url: "/officialapi/router/bank/",
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
               $("#bankForm").trigger("reset")
               swal("Oops! Saved Successfully!", {
                icon: "success",
            });
            table = $("#bankTable").DataTable();
            var edit = '<a href="#"  id='+response['id']+' class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>' 
            var deleteBank = '<button type="button" id="btnDelete" value='+response['id']+' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>' 
            tableData.push([response['date'],response['name'],response['ifsccode'],response['accountno'],edit,deleteBank])
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

function editBank(data){
    checkUser()
    var id=  $("#editId").val();
    $.ajax({
        url: "/officialapi/router/bank/"+id+"/",
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
               $("#bankForm").trigger("reset")
               swal("Oops! Updated Successfully!", {
                icon: "success",
            });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
            var rows = localStorage.getItem("rowNumber")
            var table = $('#bankTable').DataTable()
            table.cell({row:parseInt(rows),column:1}).data(response['name']);
            table.cell({row:parseInt(rows),column:2}).data(response['ifsccode']);
            table.cell({row:parseInt(rows),column:3}).data(response['accountno']);
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
                    url: "/officialapi/router/bank/" + id + "/",
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
    var ifsccode = $(this).closest('tr').find("td:eq(2)").html();
    var accountno = $(this).closest('tr').find("td:eq(3)").html();
    $("#editId").val(id);
    $("input[name=name]").val(name)
    $("input[name=ifsccode]").val(ifsccode)
    $("input[name=accountno]").val(accountno)

});