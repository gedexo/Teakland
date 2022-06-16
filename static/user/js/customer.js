$('#customerTable').DataTable();
salesman()
var customerId 
var rowIndex
var searchParams = new URLSearchParams(window.location.search)
var isEnquiry = searchParams.get('category')
$(document).ready(function () {
    var url
    if(isEnquiry == 'enquiry'){
        url= "/userapi/router/customer/?is_enquiry=True"
        $("#remarkDiv").show();
    }
    else{
        $("#remarkDiv").hide();
        url= "/userapi/router/customer/?is_enquiry=False"
    }
    $.ajax({
        url: url,
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
                    var remark
                    if(rowData != null){
                        remark = rowData['remark']
                    }
                    else{
                        remark = 'No remark'
                    }
                    var tableData = [];
                    table = $("#customerTable").DataTable();
                    var deleteCustomer
                    if (rowData['customerstatus'] != false){
                        var deleteCustomer = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    } 
                    else{
                        var deleteCustomer = '<button type="button" id="btnDeletefalse" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    }
                    var edit = '<a id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+','+rowData.created_by['id']+','+rowData.dealt_by['id'] +',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    tableData.push([rowData['date'], rowData['name'],rowData['source'],rowData['type'], rowData.created_by['name'], rowData.dealt_by['name'],rowData['contact_no'],rowData['address'],remark,edit, deleteCustomer])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});

$("#customerAddForm").validate({
    rules: {
        name: {
            required: true,
        },
        contact_no: {
            required: true
        },
        created_by: {
            required: true
        },
        dealt_by: {
            required: true
        },
        createdby: {
            required: true
        }
    },
    submitHandler: function (e) {
        var data = $(e).serializeArray();
        if ($("#editId").val() != "") {
            updateCustmer(data)
        }
        else {
            saveCustomer(data)
        }
    }
});

function saveCustomer(data) {
    if(isEnquiry == 'enquiry'){
        data[data.length] = { name: "is_enquiry", value: 'True' };
    }
    checkUser()
    $.ajax({
        url: "/userapi/router/customer/",
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
                var created_by = $("select[name=created_by] option:selected").text();
                var dealt_by = $("select[name=dealt_by] option:selected").text();
                var tableData = [];
                $("#customerAddForm").trigger("reset")
                swal("Oops! Saved Successfully!", {
                    icon: "success",
                });
                table = $("#customerTable").DataTable();
                var edit = '<a href="#" id=' + response['id'] + ' onClick=getEditData('+response['id']+','+response['created_by']+','+response['dealt_by']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                var deleteCustomer = '<button type="button" id="btnDeletefalse" value=' + response['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                tableData.push([response['date'], response['name'],response['type'],response['source'],created_by,dealt_by,response['contact_no'],response['address'],response['remark'],edit, deleteCustomer])
                table.rows.add(tableData).draw();
            },
            208: function (){
                swal("Oops!Customer already exists!", {
                    icon: "error",
                });
            },
        }
    });
}

function updateCustmer(data) { 
    if(isEnquiry == 'enquiry'){
        data[data.length] = { name: "is_enquiry", value: 'True' };
    }                                                        
    checkUser()
    var id = $("#editId").val();
    $.ajax({
        url: "/userapi/router/customer/" + id + "/",
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
                var created_by = $("select[name=created_by] option:selected").text();
                var dealt_by = $("select[name=dealt_by] option:selected").text();
                $("#customerAddForm").trigger("reset")
                swal("Oops! Updated Successfully!", {
                    icon: "success",
                });
                var rows = localStorage.getItem("rowNumber")
                var table = $('#customerTable').DataTable()
                table.cell({ row: parseInt(rows), column: 1 }).data(response['name']);
                table.cell({ row: parseInt(rows), column: 2 }).data(response['type']);
                table.cell({ row: parseInt(rows), column: 3 }).data(response['source']);
                table.cell({ row: parseInt(rows), column: 4 }).data(created_by);
                table.cell({ row: parseInt(rows), column: 5 }).data(dealt_by);
                table.cell({ row: parseInt(rows), column: 6 }).data(response['contact_no']);
                table.cell({ row: parseInt(rows), column: 7 }).data(response['address']);
                table.cell({ row: parseInt(rows), column: 8 }).data(response['remark']);

                $("#btnSubmit").html('Add')
            },
            208: function (){
                swal("Oops!Customer already exists!", {
                    icon: "error",
                });
            },
        }
    });
}

$(document).on('click', '#btnDelete', function () {
    var rowIndex = $(this)
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
                    url: "/userapi/router/customer/" + id + "/",
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
                            $(rowIndex).closest('tr').remove();
                            swal("Oops! Deleted Successfully!", {
                                icon: "success",
                            });
                        },
                        500: function () {
                            swal("Oops! This data cannot be deleted", {
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

$(document).on('click', '#btnDeletefalse', function () {
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
                customerId =id
                $("#feedBackModal").modal('show');
            } else {
                swal("Your imaginary file is safe!");
            }
        });
});


function salesman() {
    $("[id=salesMan]").empty();
    checkUser()
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
                    $("[id=salesMan]").append($('<option>').text(rowData['name']).attr('value', rowData['id']));
                }
            }
        }
    });
}

function getEditData(customerId,createdBy,dealtBy,rowIndex){
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("rowNumber", row)
    var name = $(rowIndex).closest('tr').find("td:eq(1)").html();
    var type = $(rowIndex).closest('tr').find("td:eq(3)").html();
    var source = $(rowIndex).closest('tr').find("td:eq(2)").html();
    var phone = $(rowIndex).closest('tr').find("td:eq(6)").html();
    var address = $(rowIndex).closest('tr').find("td:eq(7)").html();
    var remark = $(rowIndex).closest('tr').find("td:eq(8)").html();
    $("#editId").val(customerId);
    $("input[name=name]").val(name)
    $("input[name=contact_no]").val(phone)
    $("textarea[name=address]").val(address)
    $("textarea[name=remark]").val(remark)
    $("select[name=created_by]").val(createdBy)
    $("select[name=dealt_by]").val(dealtBy)
    $("select[name=type]").val(type)
    $("select[name=source]").val(source)
    $("#btnSubmit").html('Update')
    $('html, body').animate({
        scrollTop: $("#formDiv").offset().top
    }, 100);
}

$('.btn-reset').click(function(){
    $("#customerAddForm").trigger("reset")
    $("#btnSubmit").html('Add')
    $('.error').html('')
    salesman()
});

$("#feedBackForm").validate({
    rules: {
        feedback: {
            required: true,
        },
    },
    submitHandler: function (e) {
        var data = $(e).serializeArray();
        customerFeedback(data)
    }
});

function customerFeedback(data){

    data[data.length] = { name: "customer_id", value: customerId };
    checkUser()
    $.ajax({
        url: "/userapi/router/feedback/",
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
                $("#feedBackForm").trigger("reset")
                $("#feedBackModal").modal('hide');
                $.ajax({
                    url: "/userapi/router/customer/" + customerId + "/",
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
                            $(rowIndex).closest('tr').remove();
                            swal("Oops! Deleted Successfully!", {
                                icon: "success",
                            });
                        },
                        500: function () {
                            swal("Oops! This data cannot be deleted", {
                                icon: "error",
                            });
                        }
                    },
                })
            }
        }
    });
    
}