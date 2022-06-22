$(window).on('load', function () {
    countQuotation()
    jobcardStatus()
    setTimeout(function () {
        swingData()
    }, 100);
});


function countQuotation() {
    $.ajax({
        url: "/officialapi/dashboard/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#totalQuotation").html(response['quotation'])
                $("[id=quotationLastMonth").html(response.countstatus['lastmonth'])
                $("[id=qtOpen]").html(response.countstatus['open'])
                $("[id=qtPending]").html(response.countstatus['pending'])
                $("[id=qtOnProcess]").html(response.countstatus['onprocess'])
                $("[id=qtCompleted]").html(response.countstatus['completed'])
                $("[id=qtDelivered]").html(response.countstatus['delivered'])
                $("#income").html(response['income']['sum'])
                $("#incomeLastMonth").html(response['income_lastmonth']['sum'])
                $("#expence").html(response['expence']['sum'])
                $("#expenceLastMonth").html(response['expence_lastmonth']['sum'])
            }
        }
    });
}

function jobcardStatus() {
    $.ajax({
        url: "/officialapi/dashboard-jobcard-count/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                drawTable(response)
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var name = '<a href="/official/branch-details/?branch_id='+rowData['id']+'">'+rowData['name']+'</a>'
                    var row = $("<tr />")
                    $("#jobCardStatusTable").append(row);
                    row.append($("<td>" + name + "</td>"));
                    row.append($("<td>" + rowData["open"] + "</td>"));
                    row.append($("<td>" + rowData["onprocess"] + "</td>"));
                    row.append($("<td>" + rowData["pending"] + "</td>"));
                    row.append($("<td>" + rowData["completed"] + "</td>"));
                    row.append($("<td>" + rowData["delivered"] + "</td>"));

                }
            }
        }
    });
}

function swingData() {
    $('.Single').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 1000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

}
