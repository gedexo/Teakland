// $(document).ready(function(){
//     $("#incomeDiv").hide();
//     $("#expenceDiv").hide();
// });


// var searchParams = new URLSearchParams(window.location.search)
// var type = searchParams.get('type')
// alert(type)
// if (type == 'income'){
//     $("#incomeDiv").show();
//     income()
// }
// else if (type == 'expence'){
//     expences()
// }
var incomeTotal = [];
expences()
categorys()
branches()
function expences(url) {
    $("#expenceDiv").show();
    if (url != null) {
        url = url
    }
    else {
        url = "/officialapi/router/income/"
    }
    $.ajax({
        url: url,
        type: "GET",
        beforeSend: function (xhr) {
            $("#incomeTable").addClass('table-loader');
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                incomeTotal = []
                table = $("#incomeTable").DataTable();
                table.clear()
                table.draw()
                    drawTable(response);
                    function drawTable(data) {
                        for (var i = 0; i < data.length; i++) {
                            drawRow(data[i]);
                        }
                    }
                    function drawRow(rowData) {
                        incomeTotal.push(rowData['amount'])
                       
                        createdBy = rowData.created_user['first_name'] +' ' +rowData.created_user['last_name']
                        if(rowData.created_user['first_name'] === ''){
                            createdBy = rowData.created_user['email']
                        }
                        var tableData = [];
                        createdUser = rowData.created_user['first_name'] + rowData.created_user['last_name']
                        tableData.push([rowData['date'],rowData.quotation['quoation_number'],rowData.quotation.invoice['invoiceno'],rowData.quotation.user['name'],createdBy,rowData['amount']])
                        table.rows.add(tableData).draw();
                    }
                    var incomeSum = incomeTotal.reduce(function(a, b){
                        return a + b;
                    }, 0);
                    $("#incomeTotal").html(incomeSum)
            }
        }
    });
    $("#incomeTable").removeClass('table-loader');
}


function categorys(){
    $.ajax({
        url: "/officialapi/router/expence-category/",
        type: "GET",
        beforeSend: function (xhr) {
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
                    $("[id=category]").append($('<option>').text(rowData['category']).attr('value', rowData['id']));
                }
            }
        }
    });
}

function branches(){
    $.ajax({
        url: "/officialapi/router/users/",
        type: "GET",
        beforeSend: function (xhr) {
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
                    $("[id=branch]").append($('<option>').text(rowData['name']).attr('value', rowData['id']));
                }
            }
        }
    });
}


function showDropdown(){
    $("#filterModal").modal('show');
};


$("#expenceFilterForm").validate({
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
        $("#filterModal").modal('hide');
        var startDate = $("#startDate").val();
        var endDate   = $("#endDate").val();
        var category=[];
        var branch = []
        $('#category :selected').each(function(i, sel){ 
            category.push($(sel).val())        
        });
        $('#branch :selected').each(function(i, sel){ 
            branch.push($(sel).val())        
        });
        expenseCategory = JSON.stringify(category)
        expenseBranches = JSON.stringify(branch)
        url="/officialapi/router/income/?startdate="+startDate+"&enddate="+endDate+"&branch="+expenseBranches
        expences(url)
    }
});
