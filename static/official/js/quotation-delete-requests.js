$(document).ready(function () {
    $.ajax({
        url: "/userapi/router/qoutation-feedback/",
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

                    var tableData = [];
                    
                    table = $("#quatationsTable").DataTable();
                    var view = '<a href="/official/add-quotation/?quotation_number='+rowData.qoutation_number['quoation_number']+'" id=' + rowData['id'] + '  class="">'+rowData.qoutation_number['quoation_number']+'</a>'
                    var deleteQuotation = '<button type="button" onclick="acceptRequest('+rowData['id']+','+rowData.qoutation_number['id']+',this)" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'

                    tableData.push([rowData['date'],view,rowData.user['name'],rowData['feedback'],deleteQuotation])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});



function acceptRequest(feedbackId,quotation,rowIndex){

    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this datas!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "/officialapi/router/qoutations/" + quotation + "/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + localStorage.getItem("adminaccesstoken")
                        );
                    },
                    statusCode: {
                        400: function () {
                            swal("Oops! Cannot delete this customer!", {
                                icon: "error",
                            });
                        },
                        204: function () {
                            $(rowIndex).closest('tr').remove();
                            swal("Oops! Deleted Successfully!", {
                                icon: "success",
                            });
                            countData()
                        },
                        500: function () {
                            swal("Oops! This data canot be deleted!", {
                                icon: "error",
                            });
                        }
                    },
                })

            } else {
                swal("Your imaginary file is safe!");
            }
        });

}

