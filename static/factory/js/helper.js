countData()
loggedUser()

$(document).ready(function () {
    if (localStorage.getItem("factoryaccesstoken") != null) {
        if (localStorage.getItem("factoryrefreshtoken") != null) {
            checkUser()
        }
        else {
            window.location = '/factory/'
        }
    }
    else {
        window.location = '/factory/'
    }
});

function checkUser() {
    $.ajax({
        url: "/factoryapi/check-user/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
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
                            window.location = '/factory/'
                        }
                    }

                });
            }
        }
    })
}

function updateToken() {
    data = {
        'refresh': localStorage.getItem("factoryrefreshtoken")
    }
    $.ajax({
        url: "/officialapi/api/token/refresh/",
        type: "POST",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                localStorage.setItem("factoryaccesstoken", response['access']);
                recheck()
            },
            401: function (response) {
                window.location = '/factory/'
            }
        }
    });
    $(".error").html("Invalid username or password")
}

function recheck() {
    $.ajax({
        url: "/factoryapi/check-user/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function () {

            },
            400: function () {
                window.location = '/factory/'
            },
            401: function (response) {
                window.location = '/factory/'
            }
        }
    })
}


function countData() {
    $.ajax({
        url: "/factoryapi/count-objects/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                if (response['jobcard'] != 0) {
                    $("#jobcardCount").html(response['jobcard'])
                }
                else {
                    $("#jobcardCount").hide();
                }
                if (response['quotation-delete-requests'] != 0) {
                    $("[id=quotationDeleteRequestCount]").html(response['quotation-delete-requests'])
                }
                else {
                    $("[id=quotationDeleteRequestCount]").hide();
                }
                $("#jobCardOpen").html(response.jobcard_status['open'])
                $("#jobCardOnProcess").html(response.jobcard_status['onprocess'])
                $("#jobCardPending").html(response.jobcard_status['pending'])
                $("#jobCardCompleted").html(response.jobcard_status['completed'])
                $("#jobCardDelivered").html(response.jobcard_status['delivered'])
            }

        }
    })
}

$("#logout").click(function () {
    data = {
        'refresh_token': localStorage.getItem("factoryrefreshtoken")
    }
    $.ajax({
        url: "/officialapi/logout/",
        type: "POST",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            205: function (response) {
                localStorage.removeItem("factoryaccesstoken")
                localStorage.removeItem("factoryrefreshtoken")
                window.location.href = "/factory/"
            },
            405: function (response) {

            }
        }
    })
});


function loggedUser() {
    $.ajax({
        url: "/officialapi/get-login-user/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("factoryaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#userName").html(response['user'])
                $("#factoryName").html(response['branch'])
            }
        }
    })
}


document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

document.onkeydown = function (e) {
    if (event.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}