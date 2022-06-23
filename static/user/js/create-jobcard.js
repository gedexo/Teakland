$("#bankDiv").hide();
factory()
bank()
var subTotal
var rowIndex
var quotationNo
var quotationNumber
var currentUrl = window.location.pathname

$("#paymentType").change(function () {
    $("#error1").html('')
    var type = $(this).val();
    if (type == 'cash') {
        $("#bankDiv").hide();
        $("#bank").val(null)
    }
    if (type == 'bank') {
        $("#bankDiv").show();
    }
});

function totalQt(doorTotal, kattlaTotal, windowTotal, customKattlaTotal,othersTotal, tax) {
    var door
    var kattla
    var window
    var qttotal
    var customkattla
    var others
    if (doorTotal != null) {
        door = doorTotal
    }
    else {
        door = 0
    }
    if (kattlaTotal != null) {
        kattla = kattlaTotal
    }
    else {
        kattla = 0
    }
    if (windowTotal != null) {
        window = windowTotal
    }
    else {
        window = 0
    }
    if (customKattlaTotal != null) {
        customkattla = customKattlaTotal
    }
    else {
        customkattla = 0
    }
    if (othersTotal != null) {
        others = othersTotal
    }
    else {
        others = 0
    }

    var a = parseInt(door) + parseInt(kattla) + parseInt(window) + parseInt(customkattla) + others
    if (tax != 0 && tax != null) {
        taxAmount = tax / 100 * a
        qttotal = a + taxAmount
    }
    else {
        qttotal = a
    }

    return ~~qttotal
}


function quotationTotalForJobCard(id) {
    $.ajax({
        url: "/userapi/router/quotation/" + id + "/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                t = totalQt(response.doorsubtotal[0]['total'], response.kattlasubtotal[0]['total'], response.windowsubtotal[0]['total'], response.customkattlasubtotal[0]['total'],response.othersubtotal[0]['total'],response['tax'])
                subTotal = t
                quotationNumber = response['quoation_number']
                $("#totalBillAmount").html(subTotal)
                $("#balanceBillAmount").html(subTotal)
            }
        }
    })
}
$("#jobCardForm").validate({
    rules: {
        recievedcash: {
            required: true,
        },
        payment: {
            required: true
        },
    },
    submitHandler: function (e) {
        var data = $(e).serializeArray();
        saveJobCard(data)
    }
});


function jobcardhelper(id, ind) {
    quotationNo = id
    quotationTotalForJobCard(id)
    $("#quotationno").val(id)
    $("#jobcardmodal").modal('show')

}

$("#recievedCash").keyup(function () {
    var rc = $(this).val();
    balance = subTotal - rc
    $("#balanceBillAmount").html(balance)
    if (balance < 0) {
        $("#recievedCash").val(0)
        $("#totalBillAmount").html(subTotal)
        $("#balanceBillAmount").html(subTotal)
    }
})

function saveJobCard(data) {
    checkUser()
    $.ajax({
        url: "/userapi/jobcard-create/",
        type: "POST",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {

            406: function () {
                $("#jobcardmodal").modal('hide')
                swal("Oops! Something went wrong!", {
                    icon: "error",
                });
            },
            400: function () {
                $("#jobcardmodal").modal('hide')
                swal("Oops! Something went wrong!", {
                    icon: "error",
                });
            },
            403: function () {
                $("#jobcardmodal").modal('hide')
                swal("You don't have permission for this action");
            },
            201: function (response) {
                if (currentUrl == '/add-quatation/') {
                    $("#btnCreateInvoice").html('Created')
                    $("#btnCreateInvoice").prop('disabled', true)
                    $("#invoiceJobCardDiv").append(
                        '<div class="col-lg-2"> JobCard Number:<a href="/view-job-card/?quotation_number=' + quotationNumber + '&jobcard_number=' + response['jobcard'] + '" class="">'+response['jobcard']+'</a></div>\
                        <div class="col-lg-2"> Invoice Number:<a href="/print-invoice/?quotation_number='+ quotationNumber + '&invoice_number=' + response['invoice'] + '" class="">'+response['invoice']+'</a></div>'

                    )
                }
                else{
                    quotations()
                    // var status = '<label class="badge badge-warning">onprocess</label>'
                    // deleteQuotation = '<p class="error">Cannot delete</p>'
                    // const table = $("#quatationsTable").DataTable();
                    // table.cell(rowIndex, 6).data(status);
                    // table.cell(rowIndex, 7).data(response['jobcard']);
                    // table.cell(rowIndex, 8).data(response['invoice']);
                    // table.cell(rowIndex, 11).data(deleteQuotation);

                }
                payments()
               
            },
            409: function (response) {
                $("#erro1").html('Recieved amoun should be greater than 0')
            }
        }
    });
}


function payments() {
    data = {
        'type': $("#paymentType").val(),
        'amount': $("#recievedCash").val(),
        'quotation': $("#quotationno").val(),
        'bank': $("#bank").val(),
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    }
    $.ajax({
        url: "/userapi/router/payments/",
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
                $("#jobcardmodal").modal('hide')
                swal("Oops! Something went wrong!", {
                    icon: "error",
                });
            },
            201: function (response) {
                var quotationNo = $("#quotationno").val()
                $("#jobCardForm").trigger("reset")
                $("#jobcardmodal").modal('hide')
                swal("Success! Created Successfully! please update factory details", {
                    icon: "success",
                });
                setTimeout(function () {
                    window.location.href="/jobcard-create/?quotation_number="+quotationNo
                }, 1500);
                
            },

        }
    });
}

$('#quatationsTable').on('click', 'td', function () {
    var index = $('#quatationsTable').DataTable()
        .rows({ search: 'applied' })
        .nodes()
        .to$()
        .index($(this).closest('tr'));
    rowIndex = index
});



function factory() {
    $.ajax({
        url: "/officialapi/router/factory/",
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
                    $("select[name=factory]").append($('<option>').text(rowData['place']).attr('value', rowData['id']));
                }
            }
        }
    });
}

function bank() {
    $.ajax({
        url: "/officialapi/router/bank/",
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
                    $("select[name=bank]").append($('<option>').text(rowData['name']).attr('value', rowData['id']));
                }
            }
        }
    });
}
