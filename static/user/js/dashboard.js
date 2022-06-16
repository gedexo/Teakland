countQuotation()
function countQuotation() {
    $.ajax({
        url: "/userapi/dashboard/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#totalQuotation").html(response['quotation'])
                $("#quotationLastMonth").html(response['lastmonth'])
                $("#income").html(response['income']['sum'])
                $("#incomeLastMonth").html(response['income_lastmonth']['sum'])
                $("#expence").html(response['expence']['sum'])
                $("#expenceLastMonth").html(response['expence_lastmonth']['sum'])
            }
        }
    });
}