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

var vmConfig = {
    type: 'line',
    data: {
        labels: MONTHS,
        datasets: [{
            label: 'Price for VM ',
            backgroundColor: '#4dc9f6',
            borderColor: '#4dc9f6',
            data: [],
            fill: false
        }
        ]
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

$(function() {
    // Initialize graph and add relevant onClick events to buttons
    var ctx = document.getElementById('graphCanvas').getContext('2d');
    window.myLine = new Chart(ctx, config);

    // initialize vm popup graph
    var ctx = document.getElementById('popupGraphvm').getContext('2d');
    window.popupGraphVM = new Chart(ctx, vmConfig);
 
   // intializePopupGraphVM();

 
 });

 function intializePopupGraphVM (){
    // add dataset
    var colorNames = Object.keys(window.chartColors);
    var colorName = colorNames[vmConfig.data.datasets.length % colorNames.length];
    var newColor = window.chartColors[colorName];
    var newDataset = {
        label: 'Price for VM ',
        backgroundColor: newColor,
        borderColor: newColor,
        data: [],
        fill: false
    };
    vmConfig.data.datasets.push(newDataset);
   
 }

 function updatePopupGraphVM(virtualmachine){
    var monthPrice = virtualmachine.costMonthly();

    // add data points
    var newData = [];
    for (var x = 0; x < 12; x++) {
        newData.push(monthPrice *x);
    }
    vmConfig.data.datasets[0].data = newData;
    
    window.popupGraphVM.update();
 }
 
 function plotGraph(monthPrice, canvasId){
    // add dataset
    var colorNames = Object.keys(window.chartColors);
    var colorName = colorNames[config.data.datasets.length % colorNames.length];
    var newColor = window.chartColors[colorName];
    var newDataset = {
        label: 'Price for canvas ' + (canvasId + 1),
        backgroundColor: newColor,
        borderColor: newColor,
        data: [],
        fill: false
    };
    config.data.datasets.push(newDataset);
    
    // add data points
    var newData = [];
    for (var x = 0; x < 12; x++) {
        newData.push(monthPrice *x);
    }
    config.data.datasets[config.data.datasets.length - 1].data = newData;

    window.myLine.update();

    // animation
    $('html, body').animate({
        scrollTop: $("#graphCanvas").offset().top-100
    }, 1300);
 }