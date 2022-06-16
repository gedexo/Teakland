function quotationImageModal(category,id){
    var url 
    if(category == 'doors'){
        url = "/userapi/router/door-quotatation/"
    }
    else if(category == 'kattla'){
        url = "/userapi/router/kattla-quotatation/"
    }
    else if(category == 'window'){
        url = "/userapi/router/window-quotatation/"
    }
    else if(category == 'sizes'){
        url = "/userapi/router/custom-kattla-quotatation/"
    }
    $.ajax({
        url: url+id+"/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#imageModalDiv").append('<a id="imageLink" href="'+response.image['medium_square_crop']+'"><img id="quotationImage1" class="cr-img"  src="'+response.image['medium_square_crop']+'""></a>')               
            }
        }
    });
}


function quotationSizesImageModal(id){
    quotationImageModal('sizes',id)
}

function quotationWindoImageModal(id){
    quotationImageModal('window',id)
}
function quotationKattlaImageModal(id){
    quotationImageModal('kattla',id)
}
function quotationDoorsImageModal(id){
    quotationImageModal('doors',id)
}