
var searchParams = new URLSearchParams(window.location.search)
var branchId = searchParams.get('branch_id')
branchCounts()
salesman()

function branchCounts(urls) {
    var url 
    if(urls != null){
        url = urls
    }
    else{
        url = "/officialapi/get-branch-details/?branch_id=" + branchId
    }
    // console.log(url)
    $.ajax({
        url: url,
        type: "GET",
        beforeSend: function (xhr) {
            swal({
                title:"", 
                text:"Loading...",
                buttons: false,      
                closeOnClickOutside: false,
            });
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#branchDeatilname").html(response['branchname'])
                $("#totalQuotations").html(response['totalquotations'])
                $("#approvedQuotations").html(response['approved'])
                $("#totalIncome").html(response.totalincome['sum'])
                $("#totalExpense").html(response.totalexpence['sum'])
                $("#totalIncomeLastMonth").html(response.incomelastmont['sum'])
                $("#totalExpenseLastMonth").html(response.expencelastmont['sum'])
                $("#pendingAmount").html(response['pendingamount'])
                $("#pendingAmountLastMonth").html(response['pendingamountlastmonth'])

                var row = $("<tr />")
                $("#progressTable").append(row);
                row.append($("<td>quotations progress</td>"));
                row.append($("<td>" + response.progress["open"] + "</td>"));
                row.append($("<td>" + response.progress["onprocess"] + "</td>"));
                row.append($("<td>" + response.progress["pending"] + "</td>"));
                row.append($("<td>" + response.progress["completed"] + "</td>"));
                row.append($("<td>" + response.progress["partilallycompleted"] + "</td>"));
                row.append($("<td>" + response.progress["delivered"] + "</td>"));

                var row = $("<tr />")
                $("#progressTable").append(row);
                row.append($("<td>jobcard progress</td>"));
                row.append($("<td>" + response.jobcardProgress["open"] + "</td>"));
                row.append($("<td>" + response.jobcardProgress["onprocess"] + "</td>"));
                row.append($("<td>" + response.jobcardProgress["pending"] + "</td>"));
                row.append($("<td>" + response.jobcardProgress["completed"] + "</td>"));
                row.append($("<td>" + response.jobcardProgress["partilallycompleted"] + "</td>"));
                row.append($("<td>" + response.jobcardProgress["delivered"] + "</td>"));
                for (var i = 0;i<response.salesman.length; i++){
                    var income = 0
                    var expense = 0
                    if(response.salesman[i].income["sum"] != null){
                        income = response.salesman[i].income["sum"]
                    }
                    if(response.salesman[i].expence["sum"] != null){
                        expense = response.salesman[i].expence["sum"]
                    }
                    var row = $("<tr />")
                    $("#salesManTable").append(row);
                    row.append($("<td>" +  response.salesman[i]["name"] + "</td>"));
                    row.append($("<td>" + response.salesman[i]["quotations"] + "</td>"));
                    row.append($("<td>" + response.salesman[i]["approved"] + "</td>"));
                    row.append($("<td>" + income + "</td>"));
                    row.append($("<td>" + expense+ "</td>"));
                    row.append($("<td>" + response.salesman[i]["pendingamount"]+ "</td>"));

                }
            
                swal.close()
            }
        }
    
    });
}


function salesman() {
    $("[id=salesMan]").empty();
    checkUser()
    $.ajax({
        url: "/userapi/router/salesman/?branch="+branchId,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
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
                    $("#myDropdown").append('<a onclick="filterQuotations('+rowData['id']+')" class="drop-a">'+rowData['name']+'</a>')

                }
            }
        }
    });
}


function showDropdown(){
    $("#filterModal").modal('show')
};


$("#filterForm").validate({
    rules:{
        startdate:{
            required:true,
        },
        enddate:{
            required:true
        },
        branch:{
            required:true
        },
        category:{
            required:true
        }
        
    },
    submitHandler: function (e) {

        $(".swal-button").hide();
        $("#filterModal").modal('hide');
        var startDate = $("#startDate").val();
        var endDate   = $("#endDate").val();
        var url = "/officialapi/get-branch-details/?branch_id=" + branchId+"&startdate="+startDate+"&enddate="+endDate
        branchCounts(url)
        $("#progressTable tbody").remove();
        $("#salesManTable tbody").remove();
        // $.ajax({
        //     url: 
        //     type: "GET",
        //     beforeSend: function (xhr) {
        //         xhr.setRequestHeader(
        //             "Authorization",
        //             "Bearer " + localStorage.getItem("adminaccesstoken")
        //         );
        //     },
        //     statusCode: {
        //         200: function (response) {
        //             $("#progressTable tbody").remove();
        //             $("#salesManTable tbody").remove();
        //             $("#totalQuotations").html(response['totalquotations'])
        //             $("#approvedQuotations").html(response['approved'])
        //             $("#totalIncome").html(response.totalincome['sum'])
        //             $("#totalExpense").html(response.totalexpence['sum'])
        //             $("#totalIncomeLastMonth").html(response.incomelastmont['sum'])
        //             $("#totalExpenseLastMonth").html(response.expencelastmont['sum'])
                   
        //             var row = $("<tr />")
        //             $("#progressTable").append(row);
        //             row.append($("<td>quotations progress</td>"));
        //             row.append($("<td>" + response.progress["open"] + "</td>"));
        //             row.append($("<td>" + response.progress["onprocess"] + "</td>"));
        //             row.append($("<td>" + response.progress["pending"] + "</td>"));
        //             row.append($("<td>" + response.progress["completed"] + "</td>"));
        //             row.append($("<td>" + response.progress["partilallycompleted"] + "</td>"));
        //             row.append($("<td>" + response.progress["delivered"] + "</td>"));
    
        //             var row = $("<tr />")
        //             $("#progressTable").append(row);
        //             row.append($("<td>jobcard progress</td>"));
        //             row.append($("<td>" + response.jobcardProgress["open"] + "</td>"));
        //             row.append($("<td>" + response.jobcardProgress["onprocess"] + "</td>"));
        //             row.append($("<td>" + response.jobcardProgress["pending"] + "</td>"));
        //             row.append($("<td>" + response.jobcardProgress["completed"] + "</td>"));
        //             row.append($("<td>" + response.jobcardProgress["partilallycompleted"] + "</td>"));
        //             row.append($("<td>" + response.jobcardProgress["delivered"] + "</td>"));
        //             for (var i = 0;i<response.salesman.length; i++){
        //                 var income = 0
        //                 var expense = 0
        //                 if(response.salesman[i].income["sum"] != null){
        //                     income = response.salesman[i].income["sum"]
        //                 }
        //                 if(response.salesman[i].expence["sum"] != null){
        //                     expense = response.salesman[i].expence["sum"]
        //                 }
        //                 var row = $("<tr />")
        //                 $("#salesManTable").append(row);
        //                 row.append($("<td>" +  response.salesman[i]["name"] + "</td>"));
        //                 row.append($("<td>" + response.salesman[i]["quotations"] + "</td>"));
        //                 row.append($("<td>" + response.salesman[i]["approved"] + "</td>"));
        //                 row.append($("<td>" + income + "</td>"));
        //                 row.append($("<td>" + expense+ "</td>"));
        //             }
                
        //         }
        //     }
        // });       
    }
});
