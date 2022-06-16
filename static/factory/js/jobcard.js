jobcards()
function jobcards(status){
    var url
    if(status != null){
        url = "/factoryapi/router/jobcard/?status="+status
    }
    else{
        url= "/factoryapi/router/jobcard/"
    }
    $.ajax({
        url: url,
        type: "GET",
        beforeSend: function (xhr) {
            $("#jobCardTable").addClass('table-loader');
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                table = $("#jobCardTable").DataTable();
                table.clear()
                table.draw()
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var jobcard
                    if(rowData.is_seen != false){
                        jobcard = rowData['jobcardno']
                    }
                    else{
                        jobcard = '<p>'+rowData['jobcardno']+'<i class="icofont-star new-icon"></i></p>'
                    }
                    var status =  '<label class="badge badge-info">open</label>'
                    if(rowData.status == 'open'){
                        status = '<label class="badge badge-info">open</label>'
                    }
                    else if(rowData.status == 'onprocess'){
                        status = '<label class="badge badge-warning">onprocess</label>'
                    }
                    else if(rowData.status == 'pending'){
                        status = '<label class="badge badge-danger">pending</label>'
                    }
                    else if(rowData.status == 'partiallycompleted'){
                        status = '<label class="badge badge-primary">partiallycompleted</label>'
                    }
                    else if(rowData.status == 'completed'){
                        status = '<label class="badge badge-primary">completed</label>'
                    }
                    var tableData = [];
                    table = $("#jobCardTable").DataTable();
                    var view = '<a href="/factory/view-job-card/?quotation_number='+rowData.quotation['id']+'&jobcard_number='+rowData['jobcardno']+'" id=' + rowData['id'] + ' class=""><i class="icofont-eye"></i></a>'
                    tableData.push([rowData['created_date'],jobcard,rowData.quotation['quoation_number'],rowData['estimation_amount'],rowData.user['name'],rowData['expected_delivery'],status,view])
                    table.rows.add(tableData).draw();
                }
                $("#jobCardTable").removeClass('table-loader');

            }
        }
    });
}

function jobCardStatus(status){
    jobcards(status)
}
