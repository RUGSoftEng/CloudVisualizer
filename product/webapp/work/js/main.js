/** Main file */
/** Basic values for filters */
// Database
var nrInstancesDB;
var DBSize;

// Storage
var nrInstancesStorage;
var multiRegionalStorage;
var regionalStorage;
var nearlineStorage;
var coldlineStorage;
var storageSize;

// Virtual machines
var nrInstancesVM;
var days;
var hours;

var calculate;

/** All variables for the canvas object */
// Current service/provider
var service;
// The list of all stored canvasses
var listOfCanvasses = [];
// Counter for id of canvasses, so that each canvas has a unique identifier
var idCanvas = 0;
// Current canvas shown
var currentCanvas;

// Memory values for the filters
var memoryValues = ["0GB", "50GB", "100GB", "200GB", "300GB", "400GB", "500GB", "750GB", "1TB", "1,5TB", "2TB", "2,5TB", "3TB", "4TB", "5TB", "7,5TB", "10TB", "20TB", "30TB", "40TB", "50TB", "75TB", "100TB", "200TB", "500TB", "750TB"];

/** Object canvas */
function Canvas() {
    this.VirtualMachines = [];
    this.Databases = [];
    this.Storages = [];
    // Counter for the id of objects (storage, database, virtual machine)
    this.idCounter = 0;
    // Personal unique id of canvas
    this.numId = 0;
    this.graphColor = 'rgb(255, 99, 132)';
    this.region = (service === 'google-cloud') ? "us" : (service === 'amazon-webservices') ? "AWS GovCloud (US)" : "us-central";
    this.regionTitle = (service === 'google-cloud') ? "United States" : (service === 'amazon-webservices') ? "United States" : "United States";
}

/** Function to change the current region of the canvas */
function setRegion(selectObject) {
    currentCanvas.region = selectObject.value;
    currentCanvas.regionTitle = selectObject.selectedOptions[0].text;
}

/** Function to initialize everything regarding the Virtual Machine sliders */
function setupVMSliders() {
    // Instances
    var VMInstancesSlider = document.getElementById("VMInstancesSliderID");
    nrInstancesVM = document.getElementById("VMInstances");
    nrInstancesVM.innerHTML = VMInstancesSlider.value;
    VMInstancesSlider.oninput = function() {
        nrInstancesVM.innerHTML = this.value;
    }

    // Days
    var VMDaysSlider = document.getElementById("VMDaysSliderID");
    days = document.getElementById("VMDays");
    days.innerHTML = VMDaysSlider.value;
    VMDaysSlider.oninput = function() {
        days.innerHTML = this.value;
    }

    // Hours
    var VMHoursSlider = document.getElementById("VMHoursSliderID");
    hours = document.getElementById("VMHours");
    hours.innerHTML = VMHoursSlider.value;
    VMHoursSlider.oninput = function() {
        hours.innerHTML = this.value;
    }
}

/** Function to initialize everything regarding the Storage sliders */
function setupStorageSliders() {
    // Instances
    var StorageInstancesSlider = document.getElementById("StorageInstancesSliderID");
    nrInstancesStorage = document.getElementById("StorageInstances");
    nrInstancesStorage.innerHTML = StorageInstancesSlider.value;
    StorageInstancesSlider.oninput = function() {
        nrInstancesStorage.innerHTML = this.value;
    }

    // Multiregional storage
    var multiRegionalStorageSlider = document.getElementById("multiRegionalStorageSliderID");
    multiRegionalStorage = document.getElementById("multiRegionalStorage");
    multiRegionalStorage.innerHTML = memoryValues[0];
    multiRegionalStorageSlider.oninput = function() {
        multiRegionalStorage.innerHTML = memoryValues[this.value];
    }

    // Regional storage
    var regionalStorageSlider = document.getElementById("regionalStorageSliderID");
    regionalStorage = document.getElementById("regionalStorage");
    regionalStorage.innerHTML = memoryValues[0];
    regionalStorageSlider.oninput = function() {
        regionalStorage.innerHTML = memoryValues[this.value];
    }

    // Coldline storage
    var coldlineStorageSlider = document.getElementById("coldlineStorageSliderID");
    coldlineStorage = document.getElementById("coldlineStorage");
    coldlineStorage.innerHTML = memoryValues[0];
    coldlineStorageSlider.oninput = function() {
        coldlineStorage.innerHTML = memoryValues[this.value];
    }

    // Nearline storage
    var nearlineStorageSlider = document.getElementById("nearlineStorageSliderID");
    nearlineStorage = document.getElementById("nearlineStorage");
    nearlineStorage.innerHTML = memoryValues[0];;
    nearlineStorageSlider.oninput = function() {
        nearlineStorage.innerHTML = memoryValues[this.value];
    }
}

/** Function to initialize everything regarding the Database sliders */
function setupDBSliders() {
    // Instances
    var DBInstancesSlider = document.getElementById("DBInstancesSliderID");
    nrInstancesDB = document.getElementById("DBInstances");
    nrInstancesDB.innerHTML = DBInstancesSlider.value;
    DBInstancesSlider.oninput = function() {
        nrInstancesDB.innerHTML = this.value;
    }

    // Database size
    var DBSlider = document.getElementById("DBGBSliderID");
    DBSize = document.getElementById("DBGB");
    DBSize.innerHTML = memoryValues[0];
    DBSlider.oninput = function() {
        DBSize.innerHTML = memoryValues[this.value];
    }
}

/** Function to initialize the window */
function setupWindow() {
    $("#myAccordion").accordion({
        heightStyle: 'panel'
    });
    $(document).tooltip({
        track: true
    });

    $(document).tooltip({
        track: true
    });

    if (currentCanvas == null) {
        currentCanvas = new Canvas();
    }

    // Google-cloud currently only supports the storage and database types
    if (service == 'google-cloud') {
        setupVMSliders();
        setupStorageSliders();
        setupDBSliders();
    } else {
        setupVMSliders();
    }

    // Get the modal
    var modal = document.getElementById('exampleModal2');

    // When the user clicks the button, open the modal
    $('#provider').click(function() {
        $('#exampleModal2').show();
    });

    //When the user clicks on Save, close the modal
    $('#save-provider-modal').click(function() {
        // save current provider

        $("input:checked").parent().each(function() {
            service = this.innerText;
        })
        $('#exampleModal2').hide();
        localStorage.setItem('provider', service);
        location.reload();
    });
}

/** Function to represent data from memory, so that information is still available after refreshing/revisiting the page */
function loadDataFromMemory() {
    // load previous provider
    if (!localStorage.getItem('provider')) {
        service = 'google-cloud';
        $("#popupVMForm").load("popups.html #" + service + "VMPopup", function() {});
    } else {
        service = localStorage.getItem('provider');
        $("#popupVMForm").load("popups.html #" + service + "VMPopup", function() {});

        // set the current provider checked in the pop up
        $('#providerForm').children('div').find('label').each(function() {
            this.children[0].removeAttribute('checked');

            if (service == this.innerText) {
                this.children[0].setAttribute('checked', null);
            }

        });
    };

    // Adding everything to the canvas
    if (localStorage.getItem('curCanvas') && localStorage.getItem('curCanvas') != 'null') {
        currentCanvas = JSON.parse(localStorage.getItem('curCanvas'));
        reAssignCanvas(currentCanvas);
        for (var i = 0; i < currentCanvas.VirtualMachines.length; i++) {
            var VM = currentCanvas.VirtualMachines[i];
            addHTML(VM.nrInstances, "vm", VM.numId, currentCanvas.VirtualMachines);
            checkIcon(currentCanvas.VirtualMachines, "vm", i);
        }
        for (var i = 0; i < currentCanvas.Databases.length; i++) {
            var DB = currentCanvas.Databases[i];
            addHTML(DB.nrInstances, "db", DB.numId, currentCanvas.Databases);
            checkIcon(currentCanvas.Databases, "db", i);
        }
        for (var i = 0; i < currentCanvas.Storages.length; i++) {
            var storage = currentCanvas.Storages[i];
            addHTML(storage.nrInstances, "cs", storage.numId, currentCanvas.Storages);
            checkIcon(currentCanvas.Storages, "cs", i);
        }
        localStorage.setItem('curCanvas', null);
    }

    // Set the id counter back
    if (localStorage.getItem('idCanvas') && localStorage.getItem('idCanvas') != 'null') {
        idCanvas = localStorage.getItem('idCanvas');
    }

    // Load previous canvasses
    if (!JSON.parse(localStorage.getItem('listOfCanvasses'))) {
        listOfCanvasses = [];
    } else {
        listOfCanvasses = JSON.parse(localStorage.getItem('listOfCanvasses'));
        for (var i = 0; i < listOfCanvasses.length; i++) {
            reAssignCanvas(listOfCanvasses[i]);
        }
    }

    // Add all calculations back to the list
    for (var i in listOfCanvasses) {
        addCalculationToDiv(listOfCanvasses[i]);
        addCalculationMainGraph(listOfCanvasses[i].monthlyPrice, listOfCanvasses[i].timestamp, listOfCanvasses[i].graphColor, "graph_" + listOfCanvasses[i].numId);
    }
    showCalculationDiv();
    if (listOfCanvasses.length > 0) {
        document.getElementById("mainGraph").style.display = "block";
    }

    isOverflown();
}

/** Function to reset all the objects, because their functions disappear after parsing*/
function reAssignCanvas(canvas) {
    for (var i = 0; i < canvas.VirtualMachines.length; i++) {
        canvas.VirtualMachines[i] = Object.assign(new VirtualMachine(), canvas.VirtualMachines[i]);
    }
    for (var i = 0; i < canvas.Databases.length; i++) {
        canvas.Databases[i] = Object.assign(new Database(), canvas.Databases[i]);
    }
    for (var i = 0; i < canvas.Storages.length; i++) {
        canvas.Storages[i] = Object.assign(new Storage(), canvas.Storages[i]);
    }
}

/** Function called upon loading the page */
$(function() {
    loadDataFromMemory();

    // load accordion content from the corresponding file
    $("#myAccordion").load("accordion-" + service + ".html", function() {
        setupWindow();
    });

    $("#selectRegionID").load("region-" + service + ".html", function() {
        if (currentCanvas != null) {
            document.getElementById("selectRegionID").value = currentCanvas.region;
        }
    });

    getCloudwatchData(service);

    // call for offline functionality
    //getOfflineData(service);

    var serviceName = (service === 'google-cloud') ? "Google Cloud" : (service === 'amazon-webservices') ? "Amazon Web Services" : "Microsoft Azure";
    document.getElementById("curProv").innerHTML = "<h6>" + serviceName + "</h6>";
    isOverflown();
});

/** Add a scroller when necessary */
function isOverflown() {
    var element = document.getElementById("canvas-pop-up");
    if (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
        element.style.borderTopLeftRadius = "0.25rem";
        element.style.borderTop = "1px solid rgba(0, 0, 0, 0.125)";
        element.style.borderBottomLeftRadius = "0.25rem";
        element.style.borderBottom = "1px solid rgba(0, 0, 0, 0.125)";
    } else {
        element.style.borderTop = "none";
        element.style.borderBottom = "none";
    }
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

/** Function the show the div when calculate is clicked */
function showCalculationDiv() {
    var x = document.getElementById("canvas-pop-up");
    if (x.style.display = "none") {
        x.style.display = "block";
    }
}

/** Function to add information to the calculation div */
function buildDescriptionOfCanvas(canvas) {
    result = '';
    result += 'Virtual Machines (' + canvas.VirtualMachines.length + ')<br />';
    result += 'Storages (' + canvas.Storages.length + ')<br />';
    result += 'Databases (' + canvas.Databases.length + ')<br />';
    result += 'Region: ' + canvas.regionTitle + '<br/>';
    return result;
}


/** Function to set the content of the calculation div */
function addCalculationToDiv(canvas) {
    // build new list item in HTML
    var serviceName = (canvas.service === 'google-cloud') ? "Google Cloud" : (canvas.service === 'amazon-webservices') ? "Amazon Web Services" : "Microsoft Azure";
    var newListItem = '<a  id=' + "canvas_" + canvas.numId + ' class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">';
    newListItem += '<h5 class="mb-1">' + serviceName + ' calculation</h5>';
    newListItem += '<small>' + canvas.timestamp + '</small></div>';
    newListItem += '<p class="mb-1">' + canvas.description + '</p>';
    newListItem += '<small>Cost per year: ' + "$" + canvas.yearlyPrice + '</small>';
    newListItem += '<div id="luc"><p id=' + canvas.numId + ' style="float:right" href="#" onclick="resetCanvas(id)" ><span class="glyphicon glyphicon-repeat"></span></p>';
    newListItem += '<p id=' + "graph_" + canvas.numId + ' style="float:right;color:red" class="glyphicon glyphicon-signal" href="#" onclick="showGraph(\'' + canvas.timestamp + '\')" >' + " &nbsp" + '</p>';
    newListItem += '<p id=' + canvas.numId + ' style="float:right" class="glyphicon glyphicon-trash" href="#" onclick="removeCanvas(' + canvas.numId + ')">' + " &nbsp" + '</p></div>';
    newListItem += '<br><small>Cost per month: ' + "$" + canvas.monthlyPrice + '</small></a>';

    $('#canvas-pop-up').first().prepend(newListItem);
    isOverflown();
}

/** Function to remove all calculation from the list of calculations*/
function deleteCalc() {
    $('#canvas-pop-up').first().html('');
    isOverflown();
    clearMainGraph();
    listOfCanvasses = [];
    localStorage.setItem('listOfCanvasses', JSON.stringify([]));
    localStorage.setItem('idCanvas', idCanvas);
    document.getElementById("mainGraph").style.display = "none";
}

/** Function to get the data from the cloudwatch API */
function getCloudwatchData(service) {
    document.getElementById("calculate").disabled = true;
    var result = '';
    // send HTTP request to Node for cloudwatch data
    $.ajax({
        type: 'POST',
        url: '/cloudwatch',
        contentType: 'application/json',
        data: JSON.stringify({
            "service": service
        }),
        success: function(res) {
            result += res;
        }
    })

    // callback function for when request is finished
        .done(function() {
            pricelist = JSON.parse(result);
            document.getElementById("calculate").disabled = false;
            disableRegions();
        });
}

/** Function that uses the offline JSON for all providers, for when the API is not working/running */
function getOfflineData(service) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', service + '.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            //callback(xobj.responseText);
            var variable = JSON.parse(xobj.responseText);
            pricelist = variable;
            disableRegions();

        }
    };
    xobj.send(null);
}

/** Function to calculate the price for the current canvas, and add it to the list of calculations */
function calculate() {
    /** Price calculation(s) */
    var monthPrice = 0;
    var yearPrice = 0;
    for (var i in currentCanvas.VirtualMachines) {
        if (service == 'google-cloud') {
            currentCanvas.VirtualMachines[i].instanceType = determineInstanceType(currentCanvas.VirtualMachines[i].type);
        }
        monthPrice += currentCanvas.VirtualMachines[i].costMonthly();
        yearPrice += currentCanvas.VirtualMachines[i].costYear();
    }
    for (var i in currentCanvas.Databases) {
        monthPrice += currentCanvas.Databases[i].costMonthly();
        yearPrice += currentCanvas.Databases[i].costYear();
    }
    for (var i in currentCanvas.Storages) {
        monthPrice += currentCanvas.Storages[i].costMonthly();
        yearPrice += currentCanvas.Storages[i].costYear();
    }

    // set properties of canvas used to (re)create list item
    currentCanvas.numId = idCanvas++;
    currentCanvas.service = service;
    currentCanvas.timestamp = new Date().toGMTString();
    currentCanvas.description = buildDescriptionOfCanvas(currentCanvas);
    currentCanvas.monthlyPrice = Math.round(monthPrice * 100) / 100;
    currentCanvas.yearlyPrice = Math.round(yearPrice * 100) / 100;

    // store the canvas
    listOfCanvasses.push(copyCanvas(currentCanvas));

    addCalculationToDiv(currentCanvas);
    addCalculationMainGraph(currentCanvas.monthlyPrice, currentCanvas.timestamp, currentCanvas.graphColor, "graph_" + currentCanvas.numId);
    showCalculationDiv();

    // store/update data in localStorage
    localStorage.setItem('idCanvas', idCanvas);
    localStorage.setItem('listOfCanvasses', JSON.stringify(listOfCanvasses));
    document.getElementById("mainGraph").style.display = "block";
}


/** When the user scrolls down 20px from the top of the document, show the button */
window.onscroll = function() {
    scrollFunction()
};

/** Function to let top button appear or disappear */
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("top").style.display = "block";
    } else {
        document.getElementById("top").style.display = "none";
    }
}

/** Function to scroll to the top of the document */
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}