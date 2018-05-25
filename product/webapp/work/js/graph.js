var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var COLORS = [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba'
];

window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

var config = {
    type: 'line',
    data: {
        labels: MONTHS,
        datasets: []
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Cost over Time'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Price'
                }
            }]
        }
    }
};

// jQuery function that executes after when the page loads
$(function() {

    // Initialize graph and add relevant onClick events to buttons
    var ctx = document.getElementById('graphCanvas').getContext('2d');
    window.myLine = new Chart(ctx, config);

    document.getElementById('plotData').addEventListener('click', function() {
        var dataSetNumber = document.getElementById('datasetToPlotField').value;
            var a = parseInt(document.getElementById('aField').value);
            var b = parseInt(document.getElementById('bField').value);

            var newData = [];
            for (var x = 0; x < 12; x++) {
                newData.push(a * x + b);
            }

            config.data.datasets[dataSetNumber - 1].data = newData;
            window.myLine.update();
    });

    var colorNames = Object.keys(window.chartColors);
    //document.getElementById('addDataset').addEventListener('click', function() {
        var colorName = colorNames[config.data.datasets.length % colorNames.length];
        var newColor = window.chartColors[colorName];
        var newDataset = {
            label: 'Price' /*+ (config.data.datasets.length + 1)*/,
            backgroundColor: newColor,
            borderColor: newColor,
            data: [],
            fill: false
        };

        config.data.datasets.push(newDataset);
        window.myLine.update();
    //});

    document.getElementById('removeDataset').addEventListener('click', function() {
        var indexToDelete = document.getElementById('datasetNumberField').value - 1;
        config.data.datasets.splice(indexToDelete, 1);
        window.myLine.update();
    });

});

function plotGraph(monthPrice){
    if(typeof(monthPrice)!='undefined') {

        var newData = [];
        for (var x = 0; x < 12; x++) {
            newData.push(monthPrice *x);
        }

        config.data.datasets[0].data = newData;
        window.myLine.update();
        $('html, body').animate({
            scrollTop: $("#graphCanvas").offset().top-100
        }, 1300);
    }else{
        window.alert("No total price to plot");
    }
}