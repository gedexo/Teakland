$(document).ready(function () {
    $.ajax({
        url: "/userapi/router/custom-kattla/",
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
                    var images = '<button data-bs-toggle="modal" onclick="customkattlaImageModal('+rowData['id']+')" value='+rowData['id']+' data-bs-target="#kattlaProductImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+','+rowData.rowmaterial['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteProduct = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    tableData.push([rowData['date'], rowData.rowmaterial['name'],rowData['labour_charge'],rowData['price'],images])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});
