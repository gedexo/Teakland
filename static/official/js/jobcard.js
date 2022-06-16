
jobCards()
countData()
factory()
var jobCardId

function jobCards(factory){
    var url
    if(factory != null){
        url = "/officialapi/router/jobcard/?factory="+factory
    }
    else{
        url= "/officialapi/router/jobcard/"
    }
    $.ajax({
        url: url,
        type: "GET",
        beforeSend: function (xhr) {
            $("#jobcardTable").addClass('table-loader');
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
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
                    var factorys = rowData['factories']
                    var invoice 
                    var jobcard                   
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
                    else if(rowData.status == 'delivered'){
                        status = '<label class="badge badge-success">delivered</label>'
                    }
                    var tableData = [];
                    createdBy = rowData.created_user['first_name'] +' ' +rowData.created_user['last_name']
                    if(rowData.created_user['first_name'] === ''){
                        createdBy = rowData.created_user['email']
                    }
                    table = $("#jobcardTable").DataTable();
                    var viewJobCard = '<a href="/official/view-job-card/?quotation_number='+rowData.quotation['id']+'&jobcard_number='+rowData['jobcardno']+'" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+',this) class=""><i class="icofont-eye"></i></a>'
                    tableData.push([rowData['created_date'],rowData['jobcardno'],rowData.quotation.customer['name'],factorys,rowData.quotation['quoation_number'],createdBy,status,viewJobCard])
                    table.rows.add(tableData).draw();
                }
                $("#jobcardTable").removeClass('table-loader');
            }

        }
    });
}

function countData(){
    $.ajax({
        url: "/officialapi/count/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#jobCardOpen").html(response.jobcard['open'])
                $("#jobCardOnProcess").html(response.jobcard['onprocess'])
                $("#jobCardPending").html(response.jobcard['pending'])
                $("#jobCardCompleted").html(response.jobcard['completed'])
                $("#jobCardDelivered").html(response.jobcard['delivered'])

            }
        }
    })
}


// function factoryUpdate(id,factoryId){
//     jobCardId = id
//     $("#factoryUpdateModal").modal('show')
//     $("select[name=factory]").val(factoryId)
// }


function factory() {
    $.ajax({
        url: "/officialapi/router/factory/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#myDropdown").append('<a onclick="filterFactory()" class="drop-a">All</a>')
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    $("#myDropdown").append('<a onclick="filterFactory('+rowData['id']+')" class="drop-a">'+rowData['place']+'</a>')
                }
            }
        }
    });
}


// $("#factoryUpdateForm").validate({
//     rules: {
//         factory: {
//             required: true,
//         },
//     },
//     submitHandler: function (e) {
//         var data = $(e).serializeArray();
//         $.ajax({
//             url: "/officialapi/router/jobcard/"+jobCardId+"/",
//             type: "patch",
//             data:data,
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader(
//                     "Authorization",
//                     "Bearer " + localStorage.getItem("adminaccesstoken")
//                 );
//             },
//             statusCode: {
//                 200: function (response) {
//                     $("#factoryUpdateModal").modal('hide')
//                     jobCards()
//                 }
//             }
    
//         });
//     }
// });


function showDropdown(){
    document.getElementById("myDropdown").classList.toggle("show");
};

function filterFactory(id){
   jobCards(id)
};