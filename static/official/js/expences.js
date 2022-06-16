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
var expenceTotal = [];
expences()
categorys()
branches()
function expences(url) {
    $("#expenceDiv").show();
    if (url != null) {
        url = url
    }
    else {
        url = "/userapi/router/expences/"
    }
    $.ajax({
        url: url,
        type: "GET",
        beforeSend: function (xhr) {
            $("#incomeAndExpenceTable").addClass('table-loader');
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                expenceTotal = []
                table = $("#incomeAndExpenceTable").DataTable();
                table.clear()
                table.draw()
                    drawTable(response);
                    function drawTable(data) {
                        for (var i = 0; i < data.length; i++) {
                            drawRow(data[i]);
                        }
                    }
                    function drawRow(rowData) {
                        expenceTotal.push(rowData['amount'])
                        var category
                        if(rowData.category != null){
                            category = rowData.category['category']
                        }
                        else{
                            category = 'Not defined'
                        }
                        var tableData = [];
                        createdUser = rowData.created_user['first_name'] + rowData.created_user['last_name']
                        tableData.push([rowData['date'],category,rowData['description'],rowData.user['name'],createdUser,rowData['amount']])
                        table.rows.add(tableData).draw();
                    }
                    var expenseSum = expenceTotal.reduce(function(a, b){
                        return a + b;
                    }, 0);
                    $("#expenseTotal").html(expenseSum)
            }
        }
    });
    $("#incomeAndExpenceTable").removeClass('table-loader');
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
        url="/userapi/router/expences/?startdate="+startDate+"&enddate="+endDate+"&category="+expenseCategory+"&branch="+expenseBranches
        expences(url)
    }
});
