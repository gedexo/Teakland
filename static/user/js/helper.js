countDatas()
loggedUser()
$("#incomeViewDiv").hide();
$("#expenceViewDiv").hide();
$(document).ready(function () {
    if (localStorage.getItem("useraccesstoken") != null) {
        if (localStorage.getItem("userrefreshtoken") != null) {
            checkUser()
        }
        else {
            window.location = '/'
        }
    }
    else {
        window.location = '/'
    }
});

function checkUser() {
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

            },
            400: function () {
                window.location = '/'
            },
            401: function (response) {
                $.ajax({
                    url: "/userapi/user-permission/" + localStorage.getItem("uid") + "/",
                    type: "get",
                    statusCode: {
                        200: function (response) {
                            updateToken()
                        },
                        400: function (response) {
                            window.location = '/'
                        }
                    }

                });
            }
        }
    })
}

function updateToken() {
    data = {
        'refresh': localStorage.getItem("userrefreshtoken")
    }
    $.ajax({
        url: "/officialapi/api/token/refresh/",
        type: "POST",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                localStorage.setItem("useraccesstoken", response['access']);
                recheck()
            },
            401: function (response) {
                window.location = '/'
            }
        }
    });
    $(".error").html("Invalid username or password")
}


function recheck(){
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

            },
            400: function () {
                window.location = '/'
            },
            401: function (response) {
               window.location = '/'
            }
        }
    })
}
$('.previous-btn-div').append('<span><a  class="btn btn-back btn-sm btn-light bg-white back-btn-addcustomer" > <i class="btn-back fa-solid fa-left-long"></i> back</a></span>')

$('.btn-back').click(function () {
    history.back();
});

function countDatas(){
    $.ajax({
        url: "/userapi/jobcard-count/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#jobCardOpen").html(response.jobcard['open'])
                $("#jobCardOnProcess").html(response.jobcard['onprocess'])
                $("#jobCardPending").html(response.jobcard['pending'])
                $("#jobCardCompleted").html(response.jobcard['completed'])
                $("#jobCardDelivered").html(response.jobcard['delivered'])

            }
        }
    })
};


function loggedUser(){
    $.ajax({
        url: "/officialapi/get-login-user/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            200: function (response) {        
                console.log(response)
               $("#userName").html(response['user'])
               $("#branchName").html(response['branch'])
               if (response.is_admin == true || response.is_branchhead == true){
                   $("#incomeViewDiv").show();
                   $("#expenceViewDiv").show();
               }
            }
        }
    })
}

$("#logout").click(function(){
    data = {
        'refresh_token':localStorage.getItem("userrefreshtoken")
    }
    $.ajax({
        url: "/officialapi/logout/",
        type: "POST",
        data:data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("useraccesstoken")
            );
        },
        statusCode: {
            205: function (response) {              
               localStorage.removeItem("useraccesstoken")
               localStorage.removeItem("userrefreshtoken")
               window.location.href="/"
            },
            405: function (response) {              
                
            }
        }
    })
});