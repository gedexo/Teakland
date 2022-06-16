$(document).ready(function () {
    $.ajax({
        url: "/factoryapi/router/delivered-jobcard/?factory=true",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
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
                    var jobcard
                    if(rowData.is_seen != false){
                        jobcard = rowData['jobcardno']
                    }
                    else{
                        jobcard = '<p>JC01<i class="icofont-star new-icon"></i></p>'
                    }
                    var status =  '<label class="badge badge-success">completed</label>'
                    if(rowData.status == 'delivered'){
                        status = '<label class="badge badge-success">delivered</label>'
                    }
                    var tableData = [];
                    var delivered_user 
                    // if (rowData.delivered_user != null){
                    //     delivered_user =  rowData.delivered_user['first_name'] + rowData.delivered_user['last_name']
                    // }
                    // else{
                    //     delivered_user = 'Anonymous'
                    // }
                    table = $("#jobCardTable").DataTable();
                    var view = '<a href="/factory/view-job-card/?quotation_number='+rowData.quotation['id']+'&jobcard_number='+rowData['jobcardno']+'" id=' + rowData['id'] + ' class=""><i class="icofont-eye"></i></a>'
                    tableData.push([rowData['created_date'],jobcard,rowData.quotation['quoation_number'],rowData.user['name'],rowData['completed_date'],status,view])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});
