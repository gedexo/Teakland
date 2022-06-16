doorimages()
kattlaimages()
Windowimages()
CustomKattlaimages()

function doorimages(){
    $.ajax({
        url: "/officialapi/router/door-gallery/",
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
                    if(rowData.image_one['medium_square_crop'] != undefined){
                        $("#doorGallery").append('<div class="gallery">\
                        <a target="_blank" href="/official/product-gallery/?gallery-id='+rowData['id']+'&category=door">\
                          <img class="img-gallery" src="'+rowData.image_one['medium_square_crop']+'" alt="Forest" width="600" height="400">\
                        </a>\
                        <div class="desc">'+rowData.rowmaterial['name']+'</div>\
                        <div class="desc">'+rowData.joint['joint_type']+''+rowData.joint['code']+'</div>\
                      </div>')
                    }
                    else if(rowData.image_two['medium_square_crop'] != undefined){
                        $("#doorGallery").append('<div class="gallery">\
                        <a target="_blank" href="/official/product-gallery/?gallery-id='+rowData['id']+'&category=door">\
                          <img class="img-gallery" src="'+rowData.image_two['medium_square_crop']+'" alt="Forest" width="600" height="400">\
                        </a>\
                        <div class="desc">'+rowData.rowmaterial['name']+'</div>\
                        <div class="desc">'+rowData.joint['joint_type']+''+rowData.joint['code']+'</div>\
                      </div>')
                    }
                    else if(rowData.image_three['medium_square_crop'] != undefined){
                        $("#doorGallery").append('<div class="gallery">\
                        <a target="_blank" href="/official/product-gallery/?gallery-id='+rowData['id']+'&category=door">\
                          <img class="img-gallery" src="'+rowData.image_three['medium_square_crop']+'" alt="Forest" width="600" height="400">\
                        </a>\
                        <div class="desc">'+rowData.rowmaterial['name']+'</div>\
                        <div class="desc">'+rowData.joint['joint_type']+''+rowData.joint['code']+'</div>\
                      </div>')
                    }
                }

            }
        }
    });
}

function kattlaimages(){
    $.ajax({
        url: "/officialapi/router/kattla-gallery/",
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
                    if(rowData.image_one['medium_square_crop'] != undefined){
                        $("#kattlaGallery").append('<div class="gallery">\
                        <a target="_blank" href="/official/product-gallery/?gallery-id='+rowData['id']+'&category=kattla">\
                          <img class="img-gallery" src="'+rowData.image_one['medium_square_crop']+'" alt="Forest" width="600" height="400">\
                        </a>\
                        <div class="desc">'+rowData.rowmaterial['name']+'</div>\
                      </div>')
                    }
                }

            }
        }
    });
}


function Windowimages(){
    $.ajax({
        url: "/officialapi/router/window-gallery/",
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
                    if(rowData.image_one['medium_square_crop'] != undefined){
                        $("#windowGallery").append('<div class="gallery">\
                        <a target="_blank" href="/official/product-gallery/?gallery-id='+rowData['id']+'&category=window">\
                          <img class="img-gallery" src="'+rowData.image_one['medium_square_crop']+'" alt="Forest" width="600" height="400">\
                        </a>\
                        <div class="desc">'+rowData.rowmaterial['name']+'</div>\
                      </div>')
                    }
                }

            }
        }
    });

}

function CustomKattlaimages(){
    $.ajax({
        url: "/officialapi/router/custom-kattla-gallery/",
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
                    if(rowData.image_one['medium_square_crop'] != undefined){
                        $("#customKattlaGallery").append('<div class="gallery">\
                        <a target="_blank" href="/official/product-gallery/?gallery-id='+rowData['id']+'&category=custom-product">\
                          <img class="img-gallery" src="'+rowData.image_one['medium_square_crop']+'" alt="Forest" width="600" height="400">\
                        </a>\
                        <div class="desc">'+rowData.rowmaterial['name']+'</div>\
                      </div>')
                    }
                }

            }
        }
    });
    
}