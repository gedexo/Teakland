$(".errorClass").hide();
$("#kattlaQuotatiionDiv").hide();
$("#windowQuotatiionDiv").hide();
$("#customKattlaQuotationDiv").hide();
$("#otherQuotatiionDiv").hide();


function windowChk(prp) {
    if ($("#windowChk").prop('checked') == true) {
        $("#doorChk").prop('checked', false)
        $("#kattlaChk").prop('checked', false)
        $("#customKattlaChk").prop('checked', false)
        $("#othersChk").prop('checked', false)
        $("#kattlaQuotatiionDiv").fadeOut();
        $("#doorQuotatiionDiv").fadeOut();
        $("#customKattlaQuotationDiv").fadeOut();
        $("#otherQuotatiionDiv").fadeOut();
        $("#windowQuotatiionDiv").fadeIn();
        resetDoorForm()
        resetKattlaForm()
        resetCustomKattlaForm()
        resetOthersForm()
        $(".errorClass").hide()
    }
    else {
        $("#windowQuotatiionDiv").fadeOut();
        resetWindowForm()

    }
}

function doorChk() {
    if ($("#doorChk").prop('checked') == true) {
        $("#windowChk").prop('checked', false)
        $("#kattlaChk").prop('checked', false)
        $("#customKattlaChk").prop('checked', false)
        $("#othersChk").prop('checked', false)
        $("#kattlaQuotatiionDiv").fadeOut();
        $("#customKattlaQuotationDiv").fadeOut();
        $("#windowQuotatiionDiv").fadeOut();
        $("#otherQuotatiionDiv").fadeOut();
        $("#doorQuotatiionDiv").fadeIn();
        resetKattlaForm()
        resetWindowForm()
        resetCustomKattlaForm()
        resetOthersForm()
        $(".errorClass").hide()

    }
    else {
        $("#doorQuotatiionDiv").fadeOut();
        resetDoorForm()
    }
}

function kattlaChk(prp) {
    if ($("#kattlaChk").prop('checked') == true) {
        $("#windowChk").prop('checked', false)
        $("#doorChk").prop('checked', false)
        $("#customKattlaChk").prop('checked', false)
        $("#othersChk").prop('checked', false)
        $("#windowQuotatiionDiv").fadeOut();
        $("#doorQuotatiionDiv").fadeOut();
        $("#customKattlaQuotationDiv").fadeOut();
        $("#otherQuotatiionDiv").fadeOut();
        $("#kattlaQuotatiionDiv").fadeIn();
        $(".errorClass").hide()

        resetDoorForm()
        resetWindowForm()
        resetCustomKattlaForm()
        resetOthersForm()
    }
    else {
        $("#kattlaQuotatiionDiv").fadeOut();
        resetKattlaForm()
    }
}

function customKattlaChk(prp) {
    if ($("#customKattlaChk").prop('checked') == true) {
        $("#windowChk").prop('checked', false)
        $("#doorChk").prop('checked', false)
        $("#kattlaChk").prop('checked', false)
        $("#othersChk").prop('checked', false)
        $("#windowQuotatiionDiv").fadeOut();
        $("#doorQuotatiionDiv").fadeOut();
        $("#kattlaQuotatiionDiv").fadeOut();
        $("#customKattlaQuotationDiv").fadeIn();
        $("#otherQuotatiionDiv").fadeOut();
        $(".errorClass").hide()

        resetDoorForm()
        resetWindowForm()
        resetKattlaForm()
        resetOthersForm()
    }
    else {
        $("#customKattlaQuotationDiv").fadeOut();
        resetCustomKattlaForm()
    }
}

function othersChk(prp) {
    if ($("#othersChk").prop('checked') == true) {
        $("#windowChk").prop('checked', false)
        $("#doorChk").prop('checked', false)
        $("#kattlaChk").prop('checked', false)
        $("#customKattlaChk").prop('checked', false)
        $("#windowQuotatiionDiv").fadeOut();
        $("#doorQuotatiionDiv").fadeOut();
        $("#kattlaQuotatiionDiv").fadeOut();
        $("#customKattlaQuotationDiv").fadeOut();
        $("#otherQuotatiionDiv").fadeIn();
        $(".errorClass").hide()

        resetDoorForm()
        resetWindowForm()
        resetKattlaForm()
        resetCustomKattlaForm()
    }
    else {
        $("#otherQuotatiionDiv").fadeOut();
        resetOthersForm()
    }
}

function resetDoorForm() {
    $("#doorEditId").val(0)
    $("#btnSubmitDoor").html('Add')
    $("#doorQuotationForm").trigger("reset")
}

function resetKattlaForm() {
    $("#kattlaEditId").val(0)
    $("#btnSubmitKattla").html('Add')
    $("#kattlaQuotationForm").trigger("reset")
}

function resetWindowForm() {
    $("#windowEditId").val(0)
    $("#btnSubmitWindow").html('Add')
    $("#windowQuotationForm").trigger("reset")
}

function resetCustomKattlaForm() {
    $("#customKattlaEditId").val(0)
    $("#btnSubmitCustomKattla").html('Add')
    $("#customKattlaQuotationForm").trigger("reset")
}

function resetOthersForm() {
    $("#otherEditId").val(0)
    $("#btnSubmitOthers").html('Add')
    $("#otherQuotationForm").trigger("reset")
}

$("#btnReset").click(function () {
    resetDoorForm()
    resetKattlaForm()
    resetWindowForm()
});

$("#taxChk").change(function(){
    var quotation = $("#quotation").val()
    if($(this).prop('checked') == true){
        if(quotation != 0){
            $("#taxModal").modal('show')
        }
        else{
            $("#taxChk").prop('checked', false)
            $('.taxwarning').html('Quotation has not been created')
            setTimeout(function () {
                $('.taxwarning').html('');
            }, 2000);
        }
          
    }
    else{ 
        tax =$("#taxPercentage").val()
        if(quotation != 0 && tax != 0){
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this datas!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    $("#taxPercentage").val(0)
                    updateTax()
                }
            });
            
        }
        
    }
});


$("#taxPercentage").keyup(function(){
    if($(this).val() > 30){
        $(this).val(30)
    }
});


