$("#doorJobCardForm").validate({
    rules:{
        status:{
            required:true,
        }
    },
    submitHandler: function (e) {
        var id = $("#doorEditId").val();
        var data = $(e).serializeArray();
        $.ajax({
            url: "/userapi/router/door-quotatation/" +id+ "/",
            type: "PATCH",
            data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("factoryaccesstoken")
                );
            },
            statusCode: {
                200: function (response) {
                    var status = '<label class="badge badge-info">open</label>'
                    if (response.status == 'open') {

                        status = '<label class="badge badge-info">open</label>'
                    }
                    else if (response.status == 'started') {
                        status = '<label class="badge badge-warning">started</label>'
                    }
                    else if (response.status == 'pending') {
                        status = '<label class="badge badge-danger">pending</label>'
                    }
                    else if (response.status == 'completed') {
                        status = '<label class="badge badge-success">completed</label>'
                    }
                    $("#doorStatusModal").modal('hide');
                    swal("Success! Updated Successfully!", {
                        icon: "success",
                    });
                    var rows = localStorage.getItem("dfn")
                    var arr = $('#doorsQuotationTable > tbody > tr').map(function ()
                    {
                        return $(this).children().map(function ()
                        {
                            return $(this);
                        });
                    });
                arr[rows][8].html(status);
                },
                406: function (response){
                    swal("Oops!Bill Amount is due!", {
                        icon: "error",
                    });
                }
            }
        });
    }
    
});

// window

$("#windowJobCardForm").validate({
    rules:{
        status:{
            required:true,
        }
    },
    submitHandler: function (e) {
        var id = $("#windowEditId").val();
        var data = $(e).serializeArray();
        $.ajax({
            url: "/userapi/router/window-quotatation/" +id+ "/",
            type: "PATCH",
            data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("factoryaccesstoken")
                );
            },
            statusCode: {
                200: function (response) {
                    var status = '<label class="badge badge-info">open</label>'
                    if (response.status == 'open') {

                        status = '<label class="badge badge-info">open</label>'
                    }
                    else if (response.status == 'started') {
                        status = '<label class="badge badge-warning">started</label>'
                    }
                    else if (response.status == 'pending') {
                        status = '<label class="badge badge-danger">pending</label>'
                    }
                    else if (response.status == 'completed') {
                        status = '<label class="badge badge-success">completed</label>'
                    }
                    $("#windowStatusModal").modal('hide');
                    swal("Success! Updated Successfully!", {
                        icon: "success",
                    });
                    var rows = localStorage.getItem("wfn")
                    var arr = $('#windowQuotatiionTable > tbody > tr').map(function ()
                    {
                        return $(this).children().map(function ()
                        {
                            return $(this);
                        });
                    });
                arr[rows][9].html(status);
                },
            }
        });
    }
    
});

// kattla


$("#kattlaJobCardForm").validate({
    rules:{
        status:{
            required:true,
        }
    },
    submitHandler: function (e) {
        var id = $("#kattlaEditId").val();
        var data = $(e).serializeArray();
        $.ajax({
            url: "/userapi/router/kattla-quotatation/" +id+ "/",
            type: "PATCH",
            data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("factoryaccesstoken")
                );
            },
            statusCode: {
                200: function (response) {
                    var status = '<label class="badge badge-info">open</label>'
                    if (response.status == 'open') {

                        status = '<label class="badge badge-info">open</label>'
                    }
                    else if (response.status == 'started') {
                        status = '<label class="badge badge-warning">started</label>'
                    }
                    else if (response.status == 'pending') {
                        status = '<label class="badge badge-danger">pending</label>'
                    }
                    else if (response.status == 'completed') {
                        status = '<label class="badge badge-success">completed</label>'
                    }
                    $("#kattlaStatusModal").modal('hide');
                    swal("Success! Updated Successfully!", {
                        icon: "success",
                    });
                    var rows = localStorage.getItem("kfn")
                    var arr = $('#kattlaQuotatiionTable > tbody > tr').map(function ()
                    {
                        return $(this).children().map(function ()
                        {
                            return $(this);
                        });
                    });
                arr[rows][9].html(status);
                },
            }
        });
    }
    
});


// sizes

$("#sizesJobCardForm").validate({
    rules:{
        status:{
            required:true,
        }
    },
    submitHandler: function (e) {
        var id = $("#sizesEditId").val();
        var data = $(e).serializeArray();
        $.ajax({
            url: "/userapi/router/custom-kattla-quotatation/" +id+ "/",
            type: "PATCH",
            data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer " + localStorage.getItem("factoryaccesstoken")
                );
            },
            statusCode: {
                200: function (response) {
                    var status = '<label class="badge badge-info">open</label>'
                    if (response.status == 'open') {

                        status = '<label class="badge badge-info">open</label>'
                    }
                    else if (response.status == 'started') {
                        status = '<label class="badge badge-warning">started</label>'
                    }
                    else if (response.status == 'pending') {
                        status = '<label class="badge badge-danger">pending</label>'
                    }
                    else if (response.status == 'completed') {
                        status = '<label class="badge badge-success">completed</label>'
                    }
                    $("#sizesStatusModal").modal('hide');
                    swal("Success! Updated Successfully!", {
                        icon: "success",
                    });
                    var rows = localStorage.getItem("sfn")
                    var arr = $('#customKattlaQuotatiionTable > tbody > tr').map(function ()
                    {
                        return $(this).children().map(function ()
                        {
                            return $(this);
                        });
                    });
                arr[rows][7].html(status);
                },
            }
        });
    }
    
});
