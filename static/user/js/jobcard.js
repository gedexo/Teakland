
var searchParams = new URLSearchParams(window.location.search)
var statusFromUrl = searchParams.get('status')

jobcard(statusFromUrl)
function jobcard(sts){
    var url
    if(sts != null){
        url = "/userapi/router/jobcard/?status="+sts
    }
    else{
        url = "/userapi/router/jobcard/"
    }
    $.ajax({
        url: url,
        type: "GET",
        beforeSend: function (xhr) {
            $("#jobcardTable").addClass('table-loader');
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                table = $("#jobcardTable").DataTable();
                table.clear()
                table.draw()
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var status =  '<label class="badge badge-info">open</label>'
                    var invoice 
                    var jobcard
                    var createdBy
                    var factorys = rowData['factories']
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
                    else if(rowData.status == 'delivered'){
                        status = '<label class="badge badge-success">delivered</label>'
                    }
                    var tableData = [];
                    if(rowData.created_user['first_name'] != '')
                    {
                        createdBy = rowData.created_user['first_name']  +' ' +rowData.created_user['last_name'] 
                    }
                    else{
                        createdBy=rowData.created_user['email'] ;
                    }
                    table = $("#jobcardTable").DataTable();
                    var viewJobCard = '<a href="/jobcard-create/?quotation_number='+rowData.quotation['id']+'" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+',this) class=""><i class="icofont-eye"></i></a>'
                    tableData.push([rowData['created_date'],rowData['jobcardno'],rowData.quotation.customer['name'],factorys,rowData.quotation['quoation_number'],createdBy,status,viewJobCard])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
    $("#jobcardTable").removeClass('table-loader');
}


function jobCardStatus(sts){
    jobcard(sts)
}