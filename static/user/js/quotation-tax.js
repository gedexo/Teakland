$("#quotationTaxForm").submit(function(){
   updateTax();
   return false
});

function updateTax(){
    var quotation = $("#quotation").val()
    checkUser()
    data = {
        'tax':$("#taxPercentage").val(),
    }
    $.ajax({
        url: "/userapi/router/quotation/"+quotation+"/",
        type: "patch",
        data:data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#taxModal").modal('hide');
                $("#taxCDiv").empty();
                $("#taxCDiv").append('Tax: ','(',response['tax'],')%')
                $("#quotationTaxInput").val(response['tax'])
                quotatationTotal();
            }
        }
    });
    return false
}