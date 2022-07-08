expences()
categorys()
var expenceTotal = []
function expences(id,startDate,endDate){
    var url
    if(id != null && id != 0){
        url = "/userapi/router/expences/"+id+"/"
    }
    else if(startDate != null && endDate != null){
        url = "/userapi/router/expences/?startdate="+startDate+"&enddate="+endDate
    }
    else{
        url = "/userapi/router/expences/?status=branch"
    }
    $.ajax({
        url: url,
        type: "GET",
        beforeSend: function (xhr) {
            $("#incomeAndExpenceTable").addClass('table-loader');
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                console.log(response)
                expenceTotal = []
                if(response.length == 0){
                    swal("Oops! There are no expences in this period!", {
                        icon: "error",
                    });
                }
                table = $("#incomeAndExpenceTable").DataTable();
                table.clear()
                table.draw()
                var category = $("select[name=category] option:selected").text();
                table = $("#incomeAndExpenceTable").DataTable();
                if (response.length == undefined){
                    expenceTotal.push(response['amount'])
                    var tableData1 = [];
                    createdUser = response.created_user['first_name'] + response.created_user['last_name']
                    tableData1.push([response['date'],category,response['description'],createdUser,response['amount']])
                    table.rows.add(tableData1).draw();
                }
                else{
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
                        var createdUser 
                        if(rowData.created_user['first_name'] == '')
                        {
                            createdUser = rowData.created_user['email'] ;
                        }
                        else{
                            createdUser = rowData.created_user['first_name']  +' ' +rowData.created_user['last_name'] 
                        }
                       var tableData = [];
                       tableData.push([rowData['date'],category ,rowData['description'],createdUser,rowData['amount']])
                       table.rows.add(tableData).draw();
                    }
                    
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

$("#expenceForm").validate({
    rules:{
        description:{
            required:true,
        },
        amount:{
            required:true,
        },
        },
        messages:{
            description:{
                required:"This field is required",
            },
            amount:{
                required:"This field is required",
            },
        },
        submitHandler: function (e) {
            var data = $(e).serializeArray();
            saveExpences(data)
        }
});

function saveExpences(data){
    checkUser()
    $.ajax({
        url: "/userapi/router/expences/",
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
                swal("success! Saved successfully!", {
                    icon: "success",
                });
               $("#expenceForm").trigger("reset")
               expences(response['id'])
        }
        }
            
    });
}

function categorys(){
    $.ajax({
        url: "/officialapi/router/expence-category/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
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
        }
        
    },
    submitHandler: function (e) {
        var startDate = $("#startDate").val();
        var endDate   = $("#endDate").val();
        expences(0,startDate,endDate);
        $("#filterModal").modal('hide');
    }
});