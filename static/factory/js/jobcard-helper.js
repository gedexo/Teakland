function doorQuotationEditData(id,rowIndex){
    $("#doorEditId").val(id)
    $("#doorStatusModal").modal('show')
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("dfn", row)
    doorStatus(id)                                                                                                                                                                                                                                                             
}

function doorQtUpdate(id,category){
    checkUser()
    $.ajax({
        url: "/userapi/router/door-quotatation/" + id+"/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#reamarks").val(response['remark'])
                var status = ['open','started','pending','completed']

                if(response['status'] == 'started'){
                    var removeItem = ['open']
                    status =status.filter(item => !removeItem.includes(item))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                }
                if(response['status'] == 'pending'){
                    var removeItem = ['open','started']
                    status =status.filter(item => !removeItem.includes(item))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                }
                if(response['status'] == 'completed'){
                    var removeItem = ['open','started']
                    status =status.filter(item => !removeItem.includes(item))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                }
                var option = '';
                for (var i = 0; i < status.length; i++) {
                    option += '<option value="' + status[i] + '">' + status[i] + '</option>';
                }
                $("[id=quotationJobCardStatus]").empty();
                $("[id=quotationJobCardStatus]").append(option);

            }
        }
    });
}

// window

function windowQuotationEditData(id,rowIndex){
    $("#windowEditId").val(id)
    $("#windowStatusModal").modal('show')
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("wfn", row)
    windowStatus(id)                                                                                                                                                                                                                                                             
}

function windowStatus(id){
    checkUser()
    $.ajax({
        url: "/userapi/router/window-quotatation/" + id+"/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#windowRemarks").val(response['remark'])
                var status = ['open','started','pending','completed']

                if(response['status'] == 'started'){
                    var removeItem = ['open']
                    status =status.filter(item => !removeItem.includes(item))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                }
                if(response['status'] == 'pending'){
                    var removeItem = ['open','started']
                    status =status.filter(item => !removeItem.includes(item))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                }
                if(response['status'] == 'completed'){
                    var removeItem = ['open','started']
                    status =status.filter(item => !removeItem.includes(item))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                }
                var option = '';
                for (var i = 0; i < status.length; i++) {
                    option += '<option value="' + status[i] + '">' + status[i] + '</option>';
                }
                $("[id=windowStatus]").empty();
                $("[id=windowStatus]").append(option);

            }
        }
    });
}

// kattla

function kattlaQuotationEditData(id,rowIndex){
    $("#kattlaEditId").val(id)
    $("#kattlaStatusModal").modal('show')
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("kfn", row)
    kattlaStatus(id)                                                                                                                                                                                                                                                             
}

function kattlaStatus(id){
    checkUser()
    $.ajax({
        url: "/userapi/router/kattla-quotatation/" + id+"/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#kattlaRemarks").val(response['remark'])
                var status = ['open','started','pending','completed']

                if(response['status'] == 'started'){
                    var removeItem = ['open']
                    status =status.filter(item => !removeItem.includes(item))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                }
                if(response['status'] == 'pending'){
                    var removeItem = ['open','started']
                    status =status.filter(item => !removeItem.includes(item))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                }
                if(response['status'] == 'completed'){
                    var removeItem = ['open','started']
                    status =status.filter(item => !removeItem.includes(item))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                }
                var option = '';
                for (var i = 0; i < status.length; i++) {
                    option += '<option value="' + status[i] + '">' + status[i] + '</option>';
                }
                $("[id=kattlaStatus]").empty();
                $("[id=kattlaStatus]").append(option);

            }
        }
    });
}


// sizes


function customKattlaQuotationEditData(id,rowIndex){
    $("#sizesEditId").val(id)
    $("#sizesStatusModal").modal('show')
    var row = $(rowIndex).closest("tr").index();
    localStorage.setItem("sfn", row)
    sizesStatus(id)                                                                                                                                                                                                                                                             
}

function sizesStatus(id){
    checkUser()
    $.ajax({
        url: "/userapi/router/custom-kattla-quotatation/" + id+"/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#sizesRemarks").val(response['remark'])
                var status = ['open','started','pending','completed']

                if(response['status'] == 'started'){
                    var removeItem = ['open']
                    status =status.filter(item => !removeItem.includes(item))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                }
                if(response['status'] == 'pending'){
                    var removeItem = ['open','started']
                    status =status.filter(item => !removeItem.includes(item))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                }
                if(response['status'] == 'completed'){
                    var removeItem = ['open','started']
                    status =status.filter(item => !removeItem.includes(item))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                }
                var option = '';
                for (var i = 0; i < status.length; i++) {
                    option += '<option value="' + status[i] + '">' + status[i] + '</option>';
                }
                $("[id=sizesStatus]").empty();
                $("[id=sizesStatus]").append(option);

            }
        }
    });
}


