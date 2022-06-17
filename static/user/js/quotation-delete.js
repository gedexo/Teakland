function deleteWindowQuotation(deleteId,rowIndex){
    checkUser()
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this datas!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "/userapi/router/window-quotatation/"+deleteId+"/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + localStorage.getItem("useraccesstoken")
                        );
                    },
                    statusCode: {
                        400: function () {
                            swal("Oops! Cannot delete this product!", {
                                icon: "error",
                            });
                        },
                        204: function () {
                            $(rowIndex).closest('tr').remove();
                            swal("Oops! Deleted Successfully!", {
                                icon: "success",
                            });
                            windowQuotationSubTotal();
                        },
                        406: function () {
                            swal("Oops! Cannot delete this product!", {
                                icon: "error",
                            });
                        },
                        403: function (response) {
                            swal("You don't have permission for this action");
                        }
                    },
                })

            } else {
                swal("Your imaginary file is safe!");
            }
        });
}
$(document).on('click', '#btnDeleteKattla', function () {
    deleteId = $(this).val();
    rowIndex = $(this)
    checkUser()
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this datas!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "/userapi/router/kattla-quotatation/"+deleteId+"/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + localStorage.getItem("useraccesstoken")
                        );
                    },
                    statusCode: {
                        400: function () {
                            swal("Oops! Cannot delete this product!", {
                                icon: "error",
                            });
                        },
                        204: function () {
                            $(rowIndex).closest('tr').remove();
                            swal("Oops! Deleted Successfully!", {
                                icon: "success",
                            });
                            kattlaQuotationSubTotal();
                        },
                        406: function () {
                            swal("Oops! Cannot delete this product!", {
                                icon: "error",
                            });
                        },
                        403: function (response) {
                            swal("You don't have permission for this action");
                        }
                    },
                })

            } else {
                swal("Your imaginary file is safe!");
            }
        });
});

function deleteDoorQuotation(deleteId,rowIndex){
    checkUser()
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this datas!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "/userapi/router/door-quotatation/"+deleteId+"/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + localStorage.getItem("useraccesstoken")
                        );
                    },
                    statusCode: {
                        400: function () {
                            swal("Oops! Cannot delete this product!", {
                                icon: "error",
                            });
                        },
                        204: function () {
                            $(rowIndex).closest('tr').remove();
                            swal("Oops! Deleted Successfully!", {
                                icon: "success",
                            });
                            doorQuotationSubTotal();
                        },
                        406: function () {
                            swal("Oops! Cannot delete this product!", {
                                icon: "error",
                            });
                        },
                        403: function (response) {
                            swal("You don't have permission for this action");
                        }
                    },
                })

            } else {
                swal("Your imaginary file is safe!");
            }
        });
}

function deleteCustomKattlaQuotation(deleteId,rowIndex){
    checkUser()
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this datas!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "/userapi/router/custom-kattla-quotatation/"+deleteId+"/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + localStorage.getItem("useraccesstoken")
                        );
                    },
                    statusCode: {
                        400: function () {
                            swal("Oops! Cannot delete this product!", {
                                icon: "error",
                            });
                        },
                        204: function () {
                            $(rowIndex).closest('tr').remove();
                            swal("Oops! Deleted Successfully!", {
                                icon: "success",
                            });
                            customKattlaQuotationSubTotal();
                        },
                        406: function () {
                            swal("Oops! Cannot delete this product!", {
                                icon: "error",
                            });
                        },
                        403: function (response) {
                            swal("You don't have permission for this action");
                        }
                    },
                })

            } else {
                swal("Your imaginary file is safe!");
            }
        });
}


function deleteOtherProductQuotation(deleteId,rowIndex){
    checkUser()
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this datas!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "/userapi/router/other-product-quotation/"+deleteId+"/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Bearer " + localStorage.getItem("useraccesstoken")
                        );
                    },
                    statusCode: {
                        400: function () {
                            swal("Oops! Cannot delete this product!", {
                                icon: "error",
                            });
                        },
                        204: function () {
                            $(rowIndex).closest('tr').remove();
                            swal("Oops! Deleted Successfully!", {
                                icon: "success",
                            });
                            otherProductQuotationSubTotal();
                        },
                        406: function () {
                            swal("Oops! Cannot delete this product!", {
                                icon: "error",
                            });
                        },
                        403: function (response) {
                            swal("You don't have permission for this action");
                        }
                    },
                })

            } else {
                swal("Your imaginary file is safe!");
            }
        });
}
