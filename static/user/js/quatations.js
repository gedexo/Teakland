$(document).ready(function() {
    $('#quatationsTable').DataTable( {
        "order": [[ 2, "desc" ]],
    });
    
});

checkUser()

var rowIndex1
var qoutationNumber
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
  quotations()
});

function quotations(){
    $.ajax({
        url: "/userapi/router/quotation/",
        type: "GET",
         "processing": true,
        "language": {
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span> '
        },
        beforeSend: function (xhr) {
            $("#quatationsTable").addClass('table-loader');
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                table = $("#quatationsTable").DataTable();
                table.clear()
                table.draw()
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var deleteQuotation
                    var status =  '<label class="badge badge-info">open</label>'
                    var invoice 
                    var jobcard
                    var edit = '<a href="/add-quatation/?quotation_number='+rowData['quoation_number']+'" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'

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
                        var edit = ''
                    }
                    if(rowData.jobcard != false){
                       
                        invoice= '<a href="/print-invoice/?quotation_number='+ rowData['quoation_number'] + '&invoice_number=' + rowData['invoice'] + '" class="">'+rowData['invoice']+'</a>'

                        jobcard = '<a href="/view-job-card/?quotation_number='+rowData['quoation_number']+'&jobcard_number='+rowData['jobcard']+'" id=' + rowData['id'] + ' class="">'+rowData.jobcard+'</a>' 
                    }
                    else{
                        jobcard = '<button class="badge badge-success btn-rounded" id="btn'+rowData['id']+'" onclick="jobcardhelper('+rowData['id']+',this)" >create</button>'
                        invoice = '<p class="error">Not created</p>'
                    }
                    if (rowData.hasDeleteRequest != true && rowData.jobcard != false){
                        deleteQuotation = '<p class="error">Cannot delete</p>'
                    }
                    else if(rowData.jobcard == false && rowData.hasDeleteRequest == false){
                        deleteQuotation = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    }
                    else{
                        deleteQuotation = '<label class="badge badge-warning">pending</label>'
                    }
                    var tableData = [];
                    t = total(rowData.doorsubtotal[0]['total'],rowData.kattlasubtotal[0]['total'],rowData.windowsubtotal[0]['total'],rowData.customkattlasubtotal[0]['total'],rowData.othersubtotal[0]['total'],rowData['tax'])
                    if(rowData.created_by['first_name'] != '')
                    {
                        createdBy = rowData.created_by['first_name'] +' ' +rowData.created_by['last_name']
                    }
                    else{
                        createdBy=rowData.created_by['email'];
                    }
                    table = $("#quatationsTable").DataTable();
                    var print = '<a href="/print-quotation/?quotation_number='+rowData['quoation_number']+'" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+',this) class=""><i class="icofont-print printer-color"></i></a>'
                    tableData.push([rowData['date'], rowData['quoation_number'],rowData.customer['name'],createdBy,rowData['tax'],t,status,jobcard,invoice,print,edit, deleteQuotation])
                    table.rows.add(tableData).draw();
                }
                $("#quatationsTable").removeClass('table-loader ');
            }
        }
    });
}




$(document).on('click', '#btnDelete', function () {
    rowIndex1 = $(this).closest("tr").index();
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
                qoutationNumber =id
                $("#feedBackModal").modal('show');
            } else {
                swal("Your imaginary file is safe!");
            }
        });
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
    data[data.length] = { name: "qoutation_number", value: qoutationNumber };
    checkUser()
    $.ajax({
        url: "/userapi/router/qoutation-feedback/",
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

                swal("Success! Request sent successfully!", {
                    icon: "success",
                });
                quotations()
                // var table = $('#quatationsTable').DataTable()
                // var status = '<label class="badge badge-warning">pending</label>'
                // table.cell({ row: parseInt(rowIndex1), column: 11 }).data(status);
            }
        }
    });
    
}


