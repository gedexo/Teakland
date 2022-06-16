$(".nav a").on("click", function() {
    $(".nav").find(".active").removeClass("active");
    $(this).parent().addClass("active");
  });



$('.dasboard-hover').mouseenter(function(){
    $('#dashboard-hover-image').attr('src','/static/official/assets/image/1-2.png')
})
$('.dasboard-hover').mouseleave(function(){
    $('#dashboard-hover-image').attr('src','/static/official/assets/image/1-1.png')
})



$('.customer-hover').mouseenter(function(){
    $('#customer-hover-image').attr('src','/static/official/assets/image/2-1.png')
})
$('.customer-hover').mouseleave(function(){
    $('#customer-hover-image').attr('src','/static/official/assets/image/2-2.png')
})



$('.product-hover').mouseenter(function(){
    $('#product-hover-image').attr('src','/static/official/assets/image/3-1.png')
})
$('.product-hover').mouseleave(function(){
    $('#product-hover-image').attr('src','/static/official/assets/image/3-2.png')
})



$('.quotation-hover').mouseenter(function(){
    $('#quotation-hover-image').attr('src','/static/official/assets/image/0-1.png')
})
$('.quotation-hover').mouseleave(function(){
    $('#quotation-hover-image').attr('src','/static/official/assets/image/4-2.png')
})



$('.jobcard-hover').mouseenter(function(){
    $('#jobcard-hover-image').attr('src','/static/official/assets/image/4-1.png')
})
$('.jobcard-hover').mouseleave(function(){
    $('#jobcard-hover-image').attr('src','/static/official/assets/image/5-2.png')
})



$('.invoice-hover').mouseenter(function(){
    $('#invoice-hover-image').attr('src','/static/official/assets/image/5-1.png')
})
$('.invoice-hover').mouseleave(function(){
    $('#invoice-hover-image').attr('src','/static/official/assets/image/6-2.png')
})



$('.expense-hover').mouseenter(function(){
    $('#expense-hover-image').attr('src','/static/official/assets/image/6-1.png')
})
$('.expense-hover').mouseleave(function(){
    $('#expense-hover-image').attr('src','/static/official/assets/image/7-2.png')
})



$('.income-hover').mouseenter(function(){
    $('#income-hover-image').attr('src','/static/official/assets/image/7-1.png')
})
$('.income-hover').mouseleave(function(){
    $('#income-hover-image').attr('src','/static/official/assets/image/8-2.png')
})



$('.reports-hover').mouseenter(function(){
    $('#reports-hover-image').attr('src','/static/official/assets/image/8-1.png')
})
$('.reports-hover').mouseleave(function(){
    $('#reports-hover-image').attr('src','/static/official/assets/image/9-2.png')
})



$('.users-hover').mouseenter(function(){
    $('#users-hover-image').attr('src','/static/official/assets/image/9-1.png')
})
$('.users-hover').mouseleave(function(){
    $('#users-hover-image').attr('src','/static/official/assets/image/9-1.png')
})



$('.salesman-hover').mouseenter(function(){
    $('#salesman-hover-image').attr('src','/static/official/assets/image/SALES-MAN.png')
})
$('.salesman-hover').mouseleave(function(){
    $('#salesman-hover-image').attr('src','/static/official/assets/image/SALES-MAN.png')
})



$('.factory-hover').mouseenter(function(){
    $('#factory-hover-image').attr('src','/static/official/assets/image/3.png')
})
$('.factory-hover').mouseleave(function(){
    $('#factory-hover-image').attr('src','/static/official/assets/image/3.png')
})


$('.feedback-hover').mouseenter(function(){
    $('#feedback-hover-image').attr('src','/static/official/assets/image/FEEDBACK.png')
})
$('.feedback-hover').mouseleave(function(){
    $('#feedback-hover-image').attr('src','/static/official/assets/image/FEEDBACK.png')
})



$('.gallery-hover').mouseenter(function(){
    $('#gallery-hover-image').attr('src','/static/official/assets/image/1.png')
})
$('.gallery-hover').mouseleave(function(){
    $('#gallery-hover-image').attr('src','/static/official/assets/image/1.png')
})


$('.issues-hover').mouseenter(function(){
    $('#issues-hover-image').attr('src','/static/official/assets/image/2.png')
})
$('.issues-hover').mouseleave(function(){
    $('#issues-hover-image').attr('src','/static/official/assets/image/2.png')
})
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

//   =======graph========

var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
            label: 'Expense',
            data: [12, 19, 3, 17, 28, 24, 7, 20, 50, 65, 55, 85],
            backgroundColor: "#94CEE0",
        }, {
            label: 'Income',
            data: [30, 29, 5, 5, 20, 3, 10, 15, 10, 6, 35, 60],
            backgroundColor: "rgba(82, 159, 5, 0.5)"
        }]
    },

    options: {
        legend: {
            display: true,
            position: 'right',
            maxSize: {
                height: 200
            },

            labels: {
                text: 'String',
                boxWidth: 50,
                boxHeight: '20',
                boxshadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                fontColor: '#000',
                fontFamily: '6px Montserrat',
                label: 'Expense',
                content: 'mureugan',

            },
        },
        scales: {
            xAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                },
                barPercentage: 0.7
            }],
            yAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }
            }],
        }
    },


});


$('[id=dropdown-arrow]').click(function(){
    $('#drop-down-list').fadeToggle()
})
