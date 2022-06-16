
$(document).ready(function () {
    $.ajax({
        url: "/userapi/router/window/",
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
                    var shutter
                    var design
                    if(rowData.shutter != false){
                        shutter = '<div class="check"></div>'
                    }
                    else{
                        shutter = ''
                    }
                    if(rowData.design != false){
                        design = '<div class="check"></div>'
                    }
                    else{
                        design = ''
                    }
                    table = $("#windowTable").DataTable();
                    var images = '<button data-bs-toggle="modal" onclick="imageModal('+rowData['id']+')" value='+rowData['id']+' data-bs-target="#windowProductImageModal" class="image-button"><i class="icofont-eye"></i></button>'
                    var edit = '<a href="#" id=' + rowData['id'] + ' onClick=getEditData('+rowData['id']+','+rowData.rowmaterial['id']+',this) class="edit-edit icon-button"><i class="icofont-ui-edit"></i></a>'
                    var deleteProduct = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="delete-delete icon-button"><i class="icofont-ui-delete"></i></button>'
                    tableData.push([rowData['date'], rowData.rowmaterial['name'],rowData['box'],rowData['labour_charge'],rowData['price'],shutter,design,images])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
});