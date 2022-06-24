var accessToken;
var refreshToken;


$(document).ready(function () {
    if (localStorage.getItem("useraccesstoken") != null) {
        if (localStorage.getItem("userrefreshtoken") != null) {
            checkUserlgn()
        }
        else {
            
        }
    }
    else {
        
    }
});

function checkUserlgn() {
    $.ajax({
        url: "/userapi/check-user/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function () {
                window.location = "/dashboard/"

            },
            400: function () {
            },
            401: function (response) {
            }
        }
    })
}

$("#loginForm").validate({
    rules: {
        email: {
            required: true,
            email: true,
        },
        password: {
            required: true
        },
        messages: {
            email: {
                required: "This field is required",
            },
            password: {
                required: "This field is required"
            }
        }
    },
    submitHandler: function (e) {
        var email = $('input[name=email]').val();
        var password = $('input[name=password]').val();
        var csrftoken = $('[name="csrfmiddlewaretoken"]').val();
        data = {
            'email': email,
            'password': password,
            csrfmiddlewaretoken: csrftoken
        }
        $.ajax({
            url: "/officialapi/api/token/",
            type: "POST",
            data: data,
            statusCode: {
                401: function () {
                    $(".error").html("Invalid username or password")
                },
                200: function (response) {
                    accessToken = response['access']
                    refreshToken = response['refresh']
                    checkUser()
                }
            }
        });
    }
});

$("#email").keyup(function () {
    $('.error').html('')
});

function checkUser() {
    $.ajax({
        url: "/userapi/check-user/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + accessToken
            );
        },
        statusCode: {
            200: function (response) {
                localStorage.setItem("uid",response['id'])
                localStorage.setItem("useraccesstoken",accessToken);
                localStorage.setItem("userrefreshtoken",refreshToken);
                window.location = '/dashboard/'
            },
            401: function(){
                $(".error").html("Invalid username or password")

            }

        }
    });
}