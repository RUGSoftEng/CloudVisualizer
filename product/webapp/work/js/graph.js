var MONTHS = [0,1,2,3,4,5,6,7,8,9,10,11,12];

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
            text: 'Click to hide/show line(s)'
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
            label: 'Price for this Virtual Machine configuration',
            backgroundColor: '#4dc9f6',
            borderColor: '#4dc9f6',
            data: [],
            fill: false
        },
		{
            label: 'Original price',
            backgroundColor: '#f67019',
            borderColor: '#f67019',
			borderDash: [10,5],
            data: [],
            fill: false
        }
        ]
    },
    options: {
        responsive: true,
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
                    labelString: 'Price ($)'
                }
            }]
        }
    }
};

var csConfig = {
    type: 'line',
    data: {
        labels: MONTHS,
        datasets: [{
            label: 'Price for this Cloud Storage configuration',
            backgroundColor: '#acc236',
            borderColor: '#acc236',
            data: [],
            fill: false
        },
		{
            label: 'Original price',
            backgroundColor: '#f67019',
            borderColor: '#f67019',
			borderDash: [10,5],
            data: [],
            fill: false
        }
        ]
    },
    options: {
        responsive: true,
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
                    labelString: 'Price ($)'
                }
            }]
        }
    }
};

var dbConfig = {
    type: 'line',
    data: {
        labels: MONTHS,
        datasets: [{
            label: 'Price for this Database configuration',
            backgroundColor: '#acc236',
            borderColor: '#acc236',
            data: [],
            fill: false
        },
		{
            label: 'Original price',
            backgroundColor: '#f67019',
            borderColor: '#f67019',
			borderDash: [10,5],
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
                    labelString: 'Price ($)'
                }
            }]
        }
    }
};

$(function() {
    // Initialize graph and add relevant onClick events to buttons
    var ctx = document.getElementById('graphCanvas').getContext('2d');
    window.myLine = new Chart(ctx, config);

    // initialize 'virtual machine' popup graph
    var ctx = document.getElementById('popupGraphVM').getContext('2d');
    window.popupGraphVM = new Chart(ctx, vmConfig);

    // initialize 'cloud storage' popup graph
    var ctx = document.getElementById('popupGraphCS').getContext('2d');
    window.popupGraphCS = new Chart(ctx, csConfig);

    // initialize 'database' popup graph
    var ctx = document.getElementById('popupGraphDB').getContext('2d');
    window.popupGraphDB = new Chart(ctx, dbConfig);

});


function initPopupGraphVM(virtualmachine){
    var monthPrice = virtualmachine.costMonthly();

    // add data points
    var newData = [];
    for (var x = 0; x <= 12; x++) {
        newData.push( (monthPrice*x).toFixed(2) );
    }
    vmConfig.data.datasets[1].data = newData;

    window.popupGraphVM.update();
}

function initPopupGraphDB(database){
    var monthPrice = database.costMonthly();

    // add data points
    var newData = [];
    for (var x = 0; x <= 12; x++) {
        newData.push( (monthPrice*x).toFixed(2) );
    }
    dbConfig.data.datasets[1].data = newData;

    window.popupGraphVM.update();
}

function initPopupGraphCS(storage){
    var monthPrice = storage.costMonthly();

    // add data points
    var newData = [];
    for (var x = 0; x <= 12; x++) {
        newData.push( (monthPrice*x).toFixed(2) );
    }
    csConfig.data.datasets[1].data = newData;

    window.popupGraphVM.update();
}

function updatePopupGraphVM(virtualmachine){
    var monthPrice = virtualmachine.costMonthly();

    // add data points
    var newData = [];
    for (var x = 0; x <= 12; x++) {
        newData.push( (monthPrice*x).toFixed(2) );
    }
    vmConfig.data.datasets[0].data = newData;

    window.popupGraphVM.update();
}

function updatePopupGraphDB(database){
    var monthPrice = database.costMonthly();
    // add data points
    var newData = [];
    for (var x = 0; x <= 12; x++) {
        newData.push((monthPrice*x).toFixed(2));
    }
    dbConfig.data.datasets[0].data = newData;

    window.popupGraphDB.update();
}

function updatePopupGraphCS(storage){
    var monthPrice = storage.costMonthly();

    // add data points
    var newData = [];
    for (var x = 0; x <= 12; x++) {
        newData.push((monthPrice*x).toFixed(2));
    }
    csConfig.data.datasets[0].data = newData;

    window.popupGraphCS.update();
}

function addCalculationMainGraph(monthPrice, timestamp, graphColor, graphId){
    // add dataset
    var colorNames = Object.keys(window.chartColors);
    var colorName = colorNames[config.data.datasets.length % colorNames.length];
    var newColor = window.chartColors[colorName];
    graphColor=newColor;
    document.getElementById(graphId).style.color=graphColor;

    var newDataset = {
        label:  timestamp,
        backgroundColor: newColor,
        borderColor: newColor,
        data: [],
        fill: false,
        hidden: true,
    };
    config.data.datasets.push(newDataset);

    // add data points
    var newData = [];
    for (var x = 0; x <= 12; x++) {
        newData.push((monthPrice*x).toFixed(2));
    }
    config.data.datasets[config.data.datasets.length - 1].data = newData;
    window.myLine.update();
}

function clearMainGraph(){
    config.data.datasets = [];
    window.myLine.update();
}

function removeCalculationMainGraph(timestamp){
    config.data.datasets.forEach(function(element, index){
        if(element.label == timestamp ){
            config.data.datasets.splice(index, 1);
        }
    });

    window.myLine.update();
}

function showGraph(timestamp){
    // hide all other plots
    config.data.datasets.forEach(function(element){
        if(element.label == timestamp ){
            element.hidden = false;
        } else {
            element.hidden = true;
        }
    });

    window.myLine.update();

    // animation
    $('html, body').animate({
        scrollTop: $("#graphCanvas").offset().top-100
    }, 1300);
}
