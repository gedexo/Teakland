
$(document).ready(function () {
    $.ajax({
        url: "/userapi/router/doors/",
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
                    table = $("#doorsTable").DataTable();
                    var images = '<button data-bs-toggle="modal" onclick="doorImageModal('+rowData['id']+')" value='+rowData['id']+' data-bs-target="#doorProductImageModal" class="image-button"><i class="icofont-eye"></i></button>'

                    var jointType = rowData.joint['joint_type'] +'-'+rowData.joint['code']
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+','+rowData.rowmaterial['id']+','+rowData.joint['id'] +',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteProduct = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    tableData.push([rowData['date'], rowData.rowmaterial['name'],rowData['doortype'], jointType, rowData['labour_charge'],rowData['price'],images])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});
