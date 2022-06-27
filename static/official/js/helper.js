countData();
loggedUser()

$(document).ready(function () {
    if (localStorage.getItem("adminaccesstoken") != null) {
        if (localStorage.getItem("adminrefreshtoken") != null) {
            checkUser()
        }
        else {
            window.location = '/official/'
        }
    }
    else {
        window.location = '/official/'
    }
});

function checkUser() {
    $.ajax({
        url: "/officialapi/check-user/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function () {
            },
            400: function () {

            },
            403: function () {
                recheckOfficialUser()
            },
            401: function () {
                data = {
                    'refresh': localStorage.getItem("adminrefreshtoken")
                }
                $.ajax({
                    url: "/officialapi/api/token/refresh/",
                    type: "POST",
                    data: data,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + localStorage.getItem("adminaccesstoken")
                        );
                    },
                    statusCode: {
                        200: function (response) {
                            localStorage.setItem("adminaccesstoken", response['access']);
                            recheckOfficialUser()
                        },
                        401: function (response) {
                            window.location = '/official/'
                        }
                    }
                });
                $(".error").html("Invalid username or password")

            }

        }
    });
}

function recheckOfficialUser() {
    $.ajax({
        url: "/officialapi/check-user/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function () {

            },
            400: function () {
                window.location = '/official/'
            },
            401: function (response) {
                window.location = '/official/'
            },
            403: function (response) {
                window.location = '/official/'
            }
        }
    })
}

function countData() {
    $.ajax({
        url: "/officialapi/count/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                if (response['feedback'] != 0) {
                    $("#feedbackCount").html(response['feedback'])
                }
                else {
                    $("#feedbackCount").hide();
                }
                if (response['quotation-delete-requests'] != 0) {
                    $("[id=quotationsRequestCount]").show();
                    $("[id=quotationsRequestCount]").html(response['quotation-delete-requests'])
                    $("[id=quotationsDeleteRequestCount]").html(response['quotation-delete-requests'])
                }
                else {
                    $("[id=quotationsRequestCount]").hide();
                    $("[id=quotationsDeleteRequestCount]").hide();
                }
                if (response['quotations'] != 0) {
                    var totalRequests = response['quotation-delete-requests'] + response['quotations']
                    $("[id=quotationCount]").html(response['quotations'])
                    $("[id=quotationsRequestCount]").show();
                    $("[id=quotationsRequestCount]").html(totalRequests)
                }
                else {
                    $("[id=quotationCount]").hide();
                }
                if (response['issues'] != 0) {
                    $("#issuesCount").html(response['issues'])
                }
                else {
                    $("#issuesCount").hide();
                }
            }
        }
    })
}


function loggedUser() {
    $.ajax({
        url: "/officialapi/get-login-user/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#userName").html(response['user'])
            }
        }
    })
}

$("#logout").click(function () {
    data = {
        'refresh_token': localStorage.getItem("adminrefreshtoken")
    }
    $.ajax({
        url: "/officialapi/logout/",
        type: "POST",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + localStorage.getItem("adminaccesstoken")
            );
        },
        statusCode: {
            205: function (response) {
                localStorage.removeItem("adminaccesstoken")
                localStorage.removeItem("adminrefreshtoken")
                window.location.href = "/official/"
            },
            405: function (response) {

            }
        }
    })
});


// document.addEventListener('contextmenu', function (e) {
//     e.preventDefault();
// });

// document.onkeydown = function (e) {
//     if (event.keyCode == 123) {
//         return false;
//     }
//     if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
//         return false;
//     }
//     if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
//         return false;
//     }
//     if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
//         return false;
//     }
//     if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
//         return false;
//     }
// }