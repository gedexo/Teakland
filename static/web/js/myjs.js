const $button  = document.querySelector('#sidebar-toggle');
const $wrapper = document.querySelector('#wrapper');

$button.addEventListener('click', (e) => {
  e.preventDefault();
  $wrapper.classList.toggle('toggled');
});

// ---------------table

// $('table').DataTable();



// ----------------Chart


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