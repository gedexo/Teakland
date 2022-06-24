$("#quatationsTable").DataTable({
    "columnDefs": [
        { "orderable": false, "targets": 0 },
        { "orderable": false, "targets": 1 },
        { "orderable": false, "targets": 2 },
        { "orderable": false, "targets": 3 },
        { "orderable": false, "targets": 4 },
        { "orderable": false, "targets": 5 },
        { "orderable": false, "targets": 6 },
        { "orderable": false, "targets": 7 },
        { "orderable": false, "targets": 8 },
        { "orderable": false, "targets": 9 },
        { "orderable": false, "targets": 10 },

      ]
});                                                             
var searchParams = new URLSearchParams(window.location.search)
var statusFromUrl = searchParams.get('status')
function total(doorTotal,kattlaTotal,windowTotal,customKattlaTotal,othersTotal,tax) {
    var door
    var kattla
    var window
    var total 
    var customkattla
    var others

    if(doorTotal != null){
        door = doorTotal
    }
    else{
        door = 0
    }
    if(kattlaTotal != null){
        kattla = kattlaTotal
    }
    else{
        kattla = 0
    }
    if(windowTotal != null){
        window = windowTotal
    }
    else{
        window = 0
    }
    if(othersTotal != null){
        others = othersTotal
    }
    else{
        others = 0
    }
    if(customKattlaTotal != null){
        customkattla = customKattlaTotal
    }
    else{
        customkattla = 0
    }

    var a = parseInt(door) + parseInt(kattla) + parseInt(window) + parseInt(customkattla) + parseInt(others)
    if (tax != 0 && tax != null){
        taxAmount = tax/100*a
        total = a + taxAmount
    }
    else{
        total = a
    }

    return ~~total
}

$(document).ready(function () {
    var url
    if(statusFromUrl != null){
        url = "/officialapi/router/qoutations/?status="+statusFromUrl
    }
    else{
        url = "/officialapi/router/qoutations/"
    }
    $.ajax({
        url: url,
        type: "GET",
        beforeSend: function (xhr) {
            $("#quatationsTable").addClass('table-loader');
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
                    console.log(rowData['quoation_number']) 
                    var tableData = [];
                    var status =  '<label class="badge badge-info">open</label>'
                    var invoice 
                    var jobcard
                    var quoatationNo =  rowData['quoation_number'] 
                    if(rowData.is_seen != true){
                        quoatationNo = '<p>'+rowData['quoation_number']+'<i class="icofont-star new-icon"></i></p>'
                    }
                    if(rowData.status == 'open'){                      
                        status = '<label class="badge badge-info">open</label>'
                    }
                    else if(rowData.status == 'onprocess'){
                        status = '<label class="badge badge-warning">onprocess</label>'
                    }
                    else if(rowData.status == 'pending'){
                        status = '<label class="badge badge-danger">pending</label>'
                    }
                    else if(rowData.status == 'completed'){
                        status = '<label class="badge badge-primary">completed</label>'
                    }
                    else if(rowData.status == 'partiallycompleted'){
                        status = '<label class="badge badge-primary">partiallycompleted</label>'
                    }
                    else if(rowData.status == 'delivered'){
                        status = '<label class="badge badge-success">delivered</label>'
                    }
                    if(rowData.jobcard != false){
                       
                        invoice='<a href="/official/print-invoice/?quotation_number='+ rowData['quoation_number'] + '&invoice_number=' + rowData['invoice'] + '"  id=' + rowData['id'] + ' class="">'+rowData.invoice+'</a>'
                        jobcard = '<a href="/official/view-job-card/?quotation_number='+rowData['id']+'" id=' + rowData['id'] + ' class="">'+rowData.jobcard+'</a>'
                    }
                    else{
                        jobcard = '<p class="error">Not created</p>'
                        invoice = '<p class="error">Not created</p>'
                    }
                    t = total(rowData.doorsubtotal[0]['total'],rowData.kattlasubtotal[0]['total'],rowData.windowsubtotal[0]['total'],rowData.customkattlasubtotal[0]['total'],rowData.othersubtotal[0]['total'],rowData['tax'])           
                    if(rowData.created_by)
                    {
                        createdBy = rowData.created_by['first_name'] +' ' +rowData.created_by['last_name']
                    }
                    else{
                        createdBy="Anonymous";
                    }
                    table = $("#quatationsTable").DataTable();
                    var view = '<a href="/official/add-quotation/?quotation_number='+rowData['quoation_number']+'" id=' + rowData['id'] + '  class=""><i class="icofont-eye"></i></a>'
                    tableData.push([rowData['date'],quoatationNo,rowData.user['name'],rowData.customer['name'],createdBy,rowData['tax'],t,status,jobcard,invoice,view])
                    table.rows.add(tableData).draw();
                }
                $("#quatationsTable").removeClass('table-loader');
            }
        }
        
    });
});

