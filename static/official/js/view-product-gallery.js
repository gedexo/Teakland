
$("#imageOneDiv").hide();
$("#imageTwoDiv").hide();
$("#imageThreeDiv").hide();
var searchParams = new URLSearchParams(window.location.search)
var galleriId = searchParams.get('gallery-id')
var category = searchParams.get('category')
productImages()
function productImages(){
    $.ajax({
        url: "/officialapi/image-gallery/"+galleriId+"/"+category+"/",
        type: "GET",
        statusCode: {
            200: function (response) {
                if(response.image_one['medium_square_crop'] != undefined){
                    $("#imageOneDiv").show();
                    $("#imageOne").attr('src',response.image_one['medium_square_crop'] );
                }
                if(response.image_two['medium_square_crop'] != undefined){
                    $("#imageTwoDiv").show();
                    $("#imageTwo").attr('src',response.image_two['medium_square_crop'] );
                }
                if(response.image_three['medium_square_crop'] != undefined){
                    $("#imageThreeDiv").show();
                    $("#imageThree").attr('src',response.image_three['medium_square_crop'] );
                }

            }
        }
    });
}

