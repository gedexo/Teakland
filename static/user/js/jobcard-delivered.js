$(document).ready(function () {
        $.ajax({
        url: "/factoryapi/router/delivered-jobcard/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                console.log(response)
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
                    var status =  '<label class="badge badge-success">Delivered</label>'
                   
                    var tableData = [];

                    var delivered_user 
                    // if (rowData.delivered_user != null){
                    //     delivered_user =  rowData.delivered_user['first_name'] + rowData.delivered_user['last_name']
                    // }
                    // else{
                    //     delivered_user = rowData.delivered_user['first_name']
                    // }
                    table = $("#jobCardTable").DataTable();

                    var viewJobCard = '<a href="/jobcard-create/?quotation_number='+rowData.quotation['id']+'" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+',this) class=""><i class="icofont-eye"></i></a>'
                    tableData.push([rowData['created_date'],jobcard,rowData.quotation['quoation_number'],rowData.user['name'],rowData['completed_date'],status,viewJobCard])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});
