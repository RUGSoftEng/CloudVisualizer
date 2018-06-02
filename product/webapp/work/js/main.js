/** Google cloud */
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

// Canvas
/** TODO: Maybe add these variables to the canvas object? */
var service;
// The list of all stored canvasses
var listOfCanvasses=[];
// Counter for id of canvasses
var idCanvas=0;
// Current canvas shown
var currentCanvas;

// Object canvas
function Canvas() {
    this.VirtualMachines=[];
    this.Databases=[];
    this.Storages=[];
    // Counter for the id of objects (storage, database, virtual machine)
    this.idCounter=0;
    // Personal unique id of canvas
    this.numId=0;
    this.graphColor='rgb(255, 99, 132)';
    this.region=(service==='google-cloud')?"us-central1":(service==='amazon-webservices')?"US East (N-Virginia)":"us-east";
    this.regionName=(service==='google-cloud')?"Iowa":(service==='amazon-webservices')?"Northern Virginia":"US East";
}

function setRegion(selectObject) {
    currentCanvas.region=selectObject.value;
    currentCanvas.regionTitle=selectObject.selectedOptions[0].text;
    console.log(selectObject.selectedOptions[0].text);
    console.log(currentCanvas.region);
}

function setupVMSliders() {
    /** Virtual Machine Sliders */
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

function setupStorageSliders() {
    /** Storage Sliders */
        // Instances
    var StorageInstancesSlider = document.getElementById("StorageInstancesSliderID");
    nrInstancesStorage = document.getElementById("StorageInstances");
    nrInstancesStorage.innerHTML = StorageInstancesSlider.value;
    StorageInstancesSlider.oninput = function() {
        nrInstancesStorage.innerHTML = this.value;
    }

    var multiRegionalStorageSlider = document.getElementById("multiRegionalStorageSliderID");
    multiRegionalStorage = document.getElementById("multiRegionalStorage");
    multiRegionalStorage.innerHTML = multiRegionalStorageSlider.value;
    multiRegionalStorageSlider.oninput = function() {
        multiRegionalStorage.innerHTML = this.value;
    }

    var regionalStorageSlider = document.getElementById("regionalStorageSliderID");
    regionalStorage = document.getElementById("regionalStorage");
    regionalStorage.innerHTML = regionalStorageSlider.value;
    regionalStorageSlider.oninput = function() {
        regionalStorage.innerHTML = this.value;
    }

    var coldlineStorageSlider = document.getElementById("coldlineStorageSliderID");
    coldlineStorage = document.getElementById("coldlineStorage");
    coldlineStorage.innerHTML = coldlineStorageSlider.value;
    coldlineStorageSlider.oninput = function() {
        coldlineStorage.innerHTML = this.value;
    }

    var nearlineStorageSlider = document.getElementById("nearlineStorageSliderID");
    nearlineStorage = document.getElementById("nearlineStorage");
    nearlineStorage.innerHTML = nearlineStorageSlider.value;
    nearlineStorageSlider.oninput = function() {
        nearlineStorage.innerHTML = this.value;
    }
}

function setupDBSliders() {
    /** Database Sliders */
        // Instances
    var DBInstancesSlider = document.getElementById("DBInstancesSliderID");
    nrInstancesDB = document.getElementById("DBInstances");
    nrInstancesDB.innerHTML = DBInstancesSlider.value;
    DBInstancesSlider.oninput = function() {
        nrInstancesDB.innerHTML = this.value;
    }

    var DBSlider = document.getElementById("DBGBSliderID");
    DBSize = document.getElementById("DBGB");
    DBSize.innerHTML = DBSlider.value;
    DBSlider.oninput = function() {
        DBSize.innerHTML = this.value;
    }
}

function setupWindow(){
    $("#myAccordion").accordion();
    $( document ).tooltip({
        track: true
    });

    $( document ).tooltip({
        track: true
    });

    currentCanvas=new Canvas();

    if(service == 'google-cloud'){
        setupVMSliders();
        setupStorageSliders();
        setupDBSliders();
    } else {
        setupVMSliders();
    }

    // Get the modal
    var modal = document.getElementById('exampleModal2');

    // When the user clicks the button, open the modal
    $('#provider').click( function() {
        $('#exampleModal2').show();
    });

    //When the user clicks on Save, close the modal
    $('#save-provider-modal').click( function() {
        // save current provider

        $("input:checked").parent().each(function(){
            service = this.innerText;
        })
        $('#exampleModal2').hide();
        localStorage.setItem('provider', service);
        location.reload();
    });
}

function loadDataFromMemory(){
    // load previous provider
    if( ! localStorage.getItem('provider') ){
        service = 'google-cloud';
    } else {
        service = localStorage.getItem('provider');

        // set the current provider checked in the pop up
        $('#providerForm').children('div').find('label').each(function(){
            this.children[0].removeAttribute('checked');

            if(service == this.innerText){
                this.children[0].setAttribute('checked', null);
            }

        });
    };

    // load previous canvasses
    if( ! JSON.parse(localStorage.getItem('listOfCanvasses') )){
        listOfCanvasses = [];
    } else {
        listOfCanvasses = JSON.parse(localStorage.getItem('listOfCanvasses'));
    }

    for(var i in listOfCanvasses){
        addCalculationToDiv(listOfCanvasses[i]);
        addCalculationMainGraph(listOfCanvasses[i].monthlyPrice, listOfCanvasses[i].timestamp, listOfCanvasses[i].graphColor, "graph_"+listOfCanvasses[i].numId);
    }
    showCalculationDiv();
    if (listOfCanvasses.length>0) {
        document.getElementById("mainGraph").style.display = "block";
    }
	
	isOverflown();
		
}

$(function() {
    loadDataFromMemory();

    // load accordion content from the corresponding file
    $("#myAccordion").load("accordion-" + service + ".html", function(){
        setupWindow();
    });
	
	$("#selectRegionID").load("region-" + service + ".html", function(){
    });
	

    //getCloudwatchData(service);
    getOfflineData(service);
    //calculate();
	isOverflown();
});

function isOverflown() {
	var element = document.getElementById("canvas-pop-up");
	if(element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth){
		element.style.borderTopLeftRadius="0.25rem";
		element.style.borderTop="1px solid rgba(0, 0, 0, 0.125)";
		element.style.borderBottomLeftRadius="0.25rem";
		element.style.borderBottom="1px solid rgba(0, 0, 0, 0.125)";
	}else{
		element.style.borderTop="none";
		element.style.borderBottom="none";
	}
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

//show the div when calculate is clicked
function showCalculationDiv() {
    var x = document.getElementById("canvas-pop-up");
    if (x.style.display = "none") {
        x.style.display = "block";
    }
}

function buildDescriptionOfCanvas(canvas){
    result = '';
    result += 'Virtual Machines (' + canvas.VirtualMachines.length + ')<br />';
    result += 'Storages (' + canvas.Storages.length + ')<br />';
    result += 'Databases (' + canvas.Databases.length + ')<br />';
    return result;
}


// set content of the calculationDiv
function addCalculationToDiv(canvas){
    // build new list item in HTML
    var newListItem = '<a  id='+"canvas_"+canvas.numId+' class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">';
    newListItem += '<h5 class="mb-1">' + canvas.service + ' calculation</h5>';
    newListItem += '<small>' + canvas.timestamp + '</small></div>';
    newListItem += '<p class="mb-1">' + canvas.description +  '</p>';
    newListItem += '<small>Cost per year: ' + "$" + canvas.yearlyPrice + '</small>';
    newListItem +=  '<div id="luc"><p id='+canvas.numId+' style="float:right" href="#" onclick="resetCanvas(id)" ><span class="glyphicon glyphicon-wrench"></span></p>';
    newListItem +=  '<p id='+"graph_"+canvas.numId+' style="float:right;color:red" class="glyphicon glyphicon-signal" href="#" onclick="showGraph(\'' + canvas.timestamp + '\')" >'+" &nbsp"+ '</p>';
    newListItem +=  '<p id='+canvas.numId+' style="float:right" class="glyphicon glyphicon-trash" href="#" onclick="removeCanvas(' + canvas.numId + ')">'+" &nbsp"+ '</p></div>';
    newListItem += '<br><small>Cost per month: ' + "$" + canvas.monthlyPrice+ '</small></a>';

    $('#canvas-pop-up').first().prepend(newListItem);
	isOverflown();
}

function deleteCalc(){

    $('#canvas-pop-up').first().html('');
	isOverflown();
    clearMainGraph();
    listOfCanvasses = [];
    localStorage.setItem('listOfCanvasses', JSON.stringify([]));
    document.getElementById("mainGraph").style.display = "none";
	
}

function getCloudwatchData(service){
    document.getElementById("calculate").disabled = true;
    var result = '';
    // send HTTP request to Node for cloudwatch data
    $.ajax({
        type: 'POST',
        url: '/cloudwatch',
        contentType: 'application/json',
        data: JSON.stringify({ "service": service }),
        success: function (res) {
            result += res;
        }
    })

    // callback function for when request is finished
        .done(function() {
            pricelist = JSON.parse(result);
            console.log(result);
            document.getElementById("calculate").disabled = false;
        });
}

function getOfflineData(service) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', service+'.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            //callback(xobj.responseText);
            var variable=JSON.parse(xobj.responseText);
            pricelist=variable;
        }
    };
    xobj.send(null);
}

function calculate (){
    /** Price calculation(s) */
    var monthPrice=0;
    var yearPrice=0;
    for (var i in currentCanvas.VirtualMachines) {
        if (service == 'google-cloud') {
            currentCanvas.VirtualMachines[i].instanceType = determineInstanceType(currentCanvas.VirtualMachines[i].type);
        }
        monthPrice+=currentCanvas.VirtualMachines[i].costMonthly();
        yearPrice+=currentCanvas.VirtualMachines[i].costYear();
    }
    for (var i in currentCanvas.Databases) {
        monthPrice+=currentCanvas.Databases[i].costMonthly();
        yearPrice+=currentCanvas.Databases[i].costYear();
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
    addCalculationMainGraph(currentCanvas.monthlyPrice, currentCanvas.timestamp, currentCanvas.graphColor, "graph_"+currentCanvas.numId);
    showCalculationDiv();

    // store/update data in localStorage
    localStorage.setItem('listOfCanvasses', JSON.stringify(listOfCanvasses));
    document.getElementById("mainGraph").style.display = "block";
}


// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("top").style.display = "block";
    } else {
        document.getElementById("top").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
