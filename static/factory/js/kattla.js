$(document).ready(function () {
    $.ajax({
        url: "/userapi/router/kattla/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
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
                    table = $("#kattlaTable").DataTable();
                    var doorType
                    if(rowData['open_closed'] != false){
                        doorType = 'closed'
                    }
                    else{
                        doorType = 'open'
                    }
                    var images = '<button data-bs-toggle="modal" onclick="kattlaImageModal('+rowData['id']+')" value='+rowData['id']+' data-bs-target="#kattlaProductImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                    tableData.push([rowData['date'], rowData.rowmaterial['name'],rowData['kattlatype'],rowData['labour_charge'],rowData['price'],rowData['noofboxes'],doorType,images])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});