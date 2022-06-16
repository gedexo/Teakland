
var accessToken;
var refreshToken;
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
        url: "/officialapi/check-user/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + accessToken
            );
        },
        statusCode: {
            200: function () {
                localStorage.setItem("adminaccesstoken",accessToken);
                localStorage.setItem("adminrefreshtoken",refreshToken);
                window.location = '/official/dashboard/'
            },
            401: function(){
                data = {
                    'refresh':localStorage.getItem("adminrefreshtoken")
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
                            localStorage.setItem("adminaccesstoken",response['accesstoken']);
                            window.location = '/official/dashboard/'
                        },
                        401: function (response){
                            window.location = '/official/'
                        }
                                 
                    }
                    });
                $(".error").html("Invalid username or password")

            }

        }
    });
}