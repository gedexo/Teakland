var accessToken;
var refreshToken;
checkUser()

$(document).ready(function () {
    if (localStorage.getItem("factoryaccesstoken") != null) {
        if (localStorage.getItem("factoryrefreshtoken") != null) {
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
        url: "/factoryapi/check-user/",
        type: "GET",
        cache:false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function () {
                window.location='/factory/jobcard/'
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
        url: "/factoryapi/check-user/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + accessToken
            );
        },
        statusCode: {
            200: function () {
                localStorage.setItem("factoryaccesstoken",accessToken);
                localStorage.setItem("factoryrefreshtoken",refreshToken);
                window.location = '/factory/jobcard/'
            },
            401: function(){
                data = {
                    'refresh':localStorage.getItem("factoryrefreshtoken")
                }
                $.ajax({
                    url: "/officialapi/api/token/refresh/",
                    type: "POST",
                    data:data,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + accessToken
                        );
                    },
                    statusCode: {
                        200: function (response) {
                            localStorage.setItem("factoryaccesstoken",response['accesstoken']);
                            window.location = '/factory/jobcard/'
                        },
                        401: function (response){
                            $(".error").html("Invalid username or password")
                        }
                                 
                    }
                    });
                $(".error").html("Invalid username or password")

            }

        }
    });
}