function imageModal(id) {
  checkUser()
  $.ajax({
    url: "/userapi/router/window/" + id + "/",
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("useraccesstoken")
      );
    },
    statusCode: {
      200: function (response) {
        $("#windowImageOneView").attr('src', '/static/official/assets/image/product-dummy.jpg/')
        $("#windowImageTwoView").attr('src', '/static/official/assets/image/product-dummy.jpg/')
        $("#windowImageThreeView").attr('src', '/static/official/assets/image/product-dummy.jpg/')
        $("#windowImageOneView").attr('src', response.image_one['medium_square_crop'])
        $("#windowImageTwoView").attr('src', response.image_two['medium_square_crop'])
        $("#windowImageThreeView").attr('src', response.image_three['medium_square_crop'])

      }
    }
  })
}

function doorImageModal(id) {
  checkUser()
  $.ajax({
    url: "/userapi/router/doors/" + id + "/",
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("useraccesstoken")
      );
    },
    statusCode: {
      200: function (response) {
        $("#doorImageOneView").attr('src', '/static/official/assets/image/product-dummy.jpg/')
        $("#doorImageTwoView").attr('src', '/static/official/assets/image/product-dummy.jpg/')
        $("#doorImageThreeView").attr('src', '/static/official/assets/image/product-dummy.jpg/')
        $("#doorImageOneView").attr('src', response.image_one['medium_square_crop'])
        $("#doorImageTwoView").attr('src', response.image_two['medium_square_crop'])
        $("#doorImageThreeView").attr('src', response.image_three['medium_square_crop'])

      }
    }
  })
}


function kattlaImageModal(id) {
  checkUser()
  $.ajax({
    url: "/userapi/router/kattla/" + id + "/",
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("useraccesstoken")
      );
    },
    statusCode: {
      200: function (response) {
        $("#kattlaImageOneView").attr('src', '/static/official/assets/image/product-dummy.jpg/')
        $("#kattlaImageTwoView").attr('src', '/static/official/assets/image/product-dummy.jpg/')
        $("#kattlaImageThreeView").attr('src', '/static/official/assets/image/product-dummy.jpg/')
        $("#kattlaImageOneView").attr('src', response.image_one['medium_square_crop'])
        $("#kattlaImageTwoView").attr('src', response.image_two['medium_square_crop'])
        $("#kattlaImageThreeView").attr('src', response.image_three['medium_square_crop'])

      }
    }
  })
}


function customkattlaImageModal(id) {
  checkUser()
  $.ajax({
    url: "/userapi/router/custom-kattla/" + id + "/",
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("useraccesstoken")
      );
    },
    statusCode: {
      200: function (response) {
        $("#kattlaImageOneView").attr('src', '/static/official/assets/image/product-dummy.jpg/')
        $("#kattlaImageTwoView").attr('src', '/static/official/assets/image/product-dummy.jpg/')
        $("#kattlaImageThreeView").attr('src', '/static/official/assets/image/product-dummy.jpg/')
        $("#kattlaImageOneView").attr('src', response.image_one['medium_square_crop'])
        $("#kattlaImageTwoView").attr('src', response.image_two['medium_square_crop'])
        $("#kattlaImageThreeView").attr('src', response.image_three['medium_square_crop'])

      }
    }
  })
}