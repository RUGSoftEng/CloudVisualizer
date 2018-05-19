//drag
var nrInstances;
var days;
var hours;
var storageSize;
var DBSize;
var calculate;
var service = 'google-cloud';

// from canvasObject
var VirtualMachines=[];
var Databases=[];
var Storages=[];
var idCounter=0;

//Checks if the to be added object already exists.
//If it exists, it will return the index where the duplicate object is located
//If it doesn't exist already, it returns -1
function newObjectExists(newObject, objectList) {
    var aProps=Object.getOwnPropertyNames(newObject);
    for (var i=0; i<objectList.length; i++) {
        var stop=false;
        var bProps=Object.getOwnPropertyNames(objectList[i]);
        if (aProps.length!=bProps.length) {
            stop=true;
        }
        for (var j=0; i<aProps.length; j++) {
            var propName=aProps[j];
            if (propName=="nrInstances") {
                break;
            }
            if (newObject[propName]!==objectList[i][propName]) {
                stop=true;
            }
            if (stop) {
                break;
            }
        }
        if (!stop) {
            return objectList[i].numId;
        }
    }
    return -1;
}

function createBasicVirtualMachine(nrInstances, days, hours) {
    var newVM=new VirtualMachine();
    newVM.nrInstances=nrInstances;
    newVM.days=days;
    newVM.hours=hours;
    newVM.instanceType=determineInstanceType(newVM.type);
    return newVM;
}

function createBasicDatabase(size) {
    var newDatabase=new Database();
    newDatabase.dataSize=size;
    return newDatabase;
}

function createBasicStorage(size) {
    var newStorage=new Storage();
    newStorage.multiRegional=size;
    return newStorage;
}

//Processes the new dropped Virtual machine
function addVirtualMachine(newVM) {
    //Will contain the index of the duplicate VM if it exists, else -1
    var newVMID = newObjectExists(newVM, VirtualMachines);
    if (newVMID != -1) {
        var newVMIndex = getObjectById(newVMID, VirtualMachines);
        console.log("EXISTS");
        //Increments the duplicate with the number of to be added instances
        incrementNrInstances(newVMIndex,newVM.nrInstances, VirtualMachines);
        //Updates the HTML in the canvas
        changeHTML(newVMIndex, VirtualMachines, "vm", newVMID);
        checkIcon(VirtualMachines, "vm", newVMIndex);
    } else {
        console.log("New virtual machine!");
        //Creates new VM
        newVM.numId=idCounter++;
        VirtualMachines.push(newVM);
        //console.log(VirtualMachines[0]);
        //Adds HTML for the new VM to the canvas
        addHTML(VirtualMachines.length-1, newVM.nrInstances, "vm", newVM.numId, VirtualMachines);
        checkIcon(VirtualMachines, "vm", VirtualMachines.length-1);
        openPopup(newVM);
    }
}

//Processes the new dropped Database
function addDatabase(newDB) {
    //Will contain the index of the duplicate DB if it exists, else -1
    var newDBID = newObjectExists(newDB, Databases);
    if (newDBID != -1) {
        var newDBIndex = getObjectById(newDBID, Databases);
        console.log("EXISTS");
        //Increments the duplicate with the number of to be added instances
        incrementNrInstances(newDBIndex,newDB.nrInstances, Databases);
        //Updates the HTML in the canvas
        changeHTML(newDBIndex, Databases, "db", newDBID);
        checkIcon(Databases, "db", newDBIndex);
    } else {
        console.log("New data base!");
        //Creates new DB
        newDB.numId=idCounter++;
        Databases.push(newDB);
        //Adds HTML for the new VM to the canvas
        addHTML(Databases.length-1, newDB.nrInstances, "db", newDB.numId, Databases);
        checkIcon(Databases, "db", Databases.length-1);
    }
}

//Processes the new dropped Storage
function addStorage(newStorage) {
    //Will contain the index of the duplicate Storage if it exists, else -1
    var newStorageID = newObjectExists(newStorage, Storages);
    if (newStorageID != -1) {
        var newStorageIndex = getObjectById(newStorageID, Storages);
        console.log("EXISTS");
        //Increments the duplicate with the number of to be added instances
        incrementNrInstances(newStorageIndex,newStorage.nrInstances, Storages);
        //Updates the HTML in the canvas
        changeHTML(newStorageIndex, Storages, "cs", newStorageID);
        checkIcon(Storages, "cs", newStorageIndex);
    } else {
        console.log("New storage!");
        //Creates new storage
        newStorage.numId=idCounter++;
        Storages.push(newStorage);
        //Adds HTML for the new VM to the canvas
        addHTML(Storages.length-1, newStorage.nrInstances, "cs", newStorage.numId, Storages);
        checkIcon(Storages, "cs", Storages.length-1);
    }
}

function getObjectById(id, listOfObjects) {
    for (var i=0; i<listOfObjects.length; i++) {
        if (listOfObjects[i].numId==id) {
            return i;
        }
    }
    console.log("Shouldn't reach here!");
    return null;
}

function attachVariable (variableName,variableObject) {
    var input = document.getElementById(variableName);
    if (variableName === "type"){
		var keys = Object.keys(pricelist);
		for (var i=0;i<keys.length;i++){
			var typeName = (keys[i]).replace("CP-COMPUTEENGINE-VMIMAGE-","");
			if(keys[i] !== typeName && (keys[i]).match("PREEMPTIBLE")==null){
				var option = document.createElement("option");
				option.text = typeName + " vCPUs: " + pricelist["CP-COMPUTEENGINE-VMIMAGE-"+typeName]["cores"] + " RAM: " + pricelist["CP-COMPUTEENGINE-VMIMAGE-"+typeName]["memory"];
				option.value = typeName;
				input.add(option);
			}
		}
	}else if (variableName === "GPUType" /*&& pricelist["GPU_NVIDIA_TESLA_K80"][variableObject.region] != 0*/){
		var option = document.createElement("option");
		option.text = option.value = "NVIDIA_TESLA_K80";
		input.add(option);
		option = document.createElement("option");
		option.text = option.value = "NVIDIA_TESLA_P100";
		input.add(option);
    }
    if (input != null) {
        input.value = variableObject[variableName];
        input.onchange = function () {
            variableObject[variableName] = this.value;
            //console.log(variableObject[variableName]);
        }
    }
}

function openPopup(objectToEdit){
    /*Insert code that shows the html of the popup*/
    for (var property in objectToEdit) {
        if (objectToEdit.hasOwnProperty(property)) {
            //console.log(property);
            attachVariable(property,objectToEdit);
        }
    }
}


//We have a basic HTML structure, where we fill in the details for each Object
function addHTML(par1,par3, id, uniqueIdentifier, listOfObjects){
    var objectHTML="<div id='"+id+"_"+uniqueIdentifier+"' class='icons'><img src='images/"+id+".png'><p>"+par3+"</p> <a href='#' onclick='removeIcon(\""+id+"\", \""+uniqueIdentifier+"\", \""+listOfObjects+"\");'><span class='glyphicon glyphicon-trash'></span></a><a href='#' data-toggle='modal' data-target='#"+id+"Settings'	onclick='showSettings(\""+id+"\", "+uniqueIdentifier+");'> <span class='glyphicon glyphicon-wrench'></span> </a></div>";
    $("#items").append(objectHTML);
}

//Since we incorperated the ID in the div of the Object, we can easily edit it now
function changeHTML(index, listOfObjects, id, uniqueIdentifier){
    var curObject = listOfObjects[index];
    $("#"+id+"_"+uniqueIdentifier+" p").text(curObject.nrInstances);
}

function changeImage(id, index, image, uniqueIdentifier) {
    var divId = id + "_"+uniqueIdentifier;
    document.getElementById(divId).getElementsByTagName('img')[0].src=image;
}

function checkIcon(listOfObjects, id, index) {
    if (listOfObjects[index].nrInstances>1) {
        changeImage(id, index, "images/multiple"+id+".png", listOfObjects[index].numId);
    }
}

function incrementNrInstances(index, incr, listOfObjects) {
    var curObject=listOfObjects[index];
    curObject.nrInstances=curObject.nrInstances+incr;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dragDatabase(ev) {
    jQuery.event.props.push('dataTransfer');
    var newDB = createBasicDatabase(parseInt(DBSize.innerHTML));
    var j = JSON.stringify(newDB);
    ev.dataTransfer.setData("foo", j);
}

function dragStorage(ev) {
    jQuery.event.props.push('dataTransfer');
    var newStorage = createBasicStorage(parseInt(storageSize.innerHTML));
    var j = JSON.stringify(newStorage);
    ev.dataTransfer.setData("foo", j);
}

function dragVM(ev) {
    jQuery.event.props.push('dataTransfer');
    var newVM = createBasicVirtualMachine(parseInt(nrInstances.innerHTML), parseInt(days.innerHTML), parseInt(hours.innerHTML));
    var j = JSON.stringify(newVM);
    ev.dataTransfer.setData("foo", j);
}

function drop(ev) {
    ev.preventDefault();
    var obj = JSON.parse(ev.dataTransfer.getData("foo"));
    if (obj.objectName === "VirtualMachine") {
        var instance = Object.assign(new VirtualMachine(), obj);
        console.log(instance);
        console.log(new VirtualMachine());
        addVirtualMachine(instance);
    }
    if (obj.objectName === "Database") {
        var instance = Object.assign(new Database(), obj);
        console.log(instance);
        console.log(new Database());
        addDatabase(instance);
    }
    if (obj.objectName === "Storage") {
        var instance = Object.assign(new Storage(), obj);
        console.log(instance);
        addStorage(instance);
    }
}

function refresh() {
    clearBox('items');
    for (var i in VirtualMachines) {
        var curVM  = VirtualMachines[i];
        $("#items").append($('<div class="test"></div>').html('<img src="images/VM.png">'));
        console.log(i.hours);
    }
}

function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = "";
    Databases = [];
    Storages = [];
    VirtualMachines = [];
}
function removeIcon(elementID, uniqueIdentifier){
    var divId = "#"+elementID + "_"+uniqueIdentifier;
    $(divId).remove();
    console.log(elementID);
    if (elementID=="vm") {
        VirtualMachines.splice(getObjectById(uniqueIdentifier, VirtualMachines), 1);
        return;
    }
    if (elementID=="db") {
        Databases.splice(getObjectById(uniqueIdentifier, Databases), 1);
        return;
    }
    if (elementID=="cs") {
        Storages.splice(getObjectById(uniqueIdentifier, Storages), 1);
        return;
    }
    console.log("NO THANKS");
}

//show the div when calculate is clicked
function showCaculationDiv() {
    var x = document.getElementById("canvas-pop-up");
    if (x.style.display = "none") {
        x.style.display = "block";
    }
}

// set content of the calculationDiv
function addCalculationToDiv(string, totalPrice){
    var date = new Date();

    // build new list item in HTML
    var newListItem = '<a  class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">';
    newListItem += '<h5 class="mb-1">Calculation for ' + service + '</h5>';
    newListItem += '<small>' + date.toTimeString() + '</small></div>';
    newListItem += '<p class="mb-1">' + string +  '</p>';
    newListItem += '<small>Totalprice: ' + totalPrice+ '</small></a>';

    var mainArea = document.getElementById("canvas-pop-up").children[0].innerHTML += newListItem;    
}

function calculate (){
    console.log("Querying cloudwatch for data from " + service);

    var result = '';


    // send HTTP request to Node so that it communicates with cloudwatch
    $.ajax({
        type: 'POST',
        url: '/cloudwatch',
        contentType: 'application/json',
        data: JSON.stringify({ "service": service }),
        success: function (res) {
            result += res;
        }
    })

    // callback function when request is finished
    .done(function(){
        console.log("Finished processing response of AJAX request to cloudwatch ");

        console.log(JSON.stringify("/google.json"));

        var totalprice=0;
        var myString='';


        // Monthly
        // console.log(VirtualMachines);
        // for (var i in VirtualMachines) {
        //     VirtualMachines[i].costMonthly=VMCostMonthly;
        //     console.log(VirtualMachines[i]);
        //     console.log(new VirtualMachine());
        //     console.log(new VirtualMachine().costMonthly());
        //     console.log(VirtualMachines[i].costMonthly()*VirtualMachines[i].nrInstances);
        //     console.log("Monthly costs: " + VirtualMachines[i].costMonthly());
        // }
        // for (var i in Databases) {
        //    // Databases[i].costMonthly=VMCostMonthly;
        //     console.log("Monthly costs: " + Databases[i].costMonthly());
        // }
        // for (var i in Storages) {
        //     console.log("Monthly costs: " + Storages[i].costMonthly());
        // }

        addCalculationToDiv(result.substring(0, 300), Math.round(totalprice*100)/100);
        showCaculationDiv();
    });
}
/* Wrote this function to work on the google json when the clouddata API is down */
function calculateTemp (){
    //console.log("Querying cloudwatch for data from " + service);

    var result = '';

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'google.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            //callback(xobj.responseText);
            var variable=JSON.parse(xobj.responseText);
            pricelist=variable["gcp_price_list"];

            /** Calculations */

            for (var i in VirtualMachines) {
                VirtualMachines[i].instanceType=determineInstanceType(VirtualMachines[i].type);
                console.log(VirtualMachines[i].costMonthly());
            }
            for (var i in Databases) {
                console.log("Monthly costs: " + Databases[i].costMonthly());
            }
            for (var i in Storages) {
                console.log("Monthly costs: " + Storages[i].costMonthly());
            }

            /** */
        }
    };
    xobj.send(null);
    var totalprice=0;
    var myString='';
    addCalculationToDiv(result.substring(0, 300), Math.round(totalprice*100)/100);
    showCaculationDiv();

}

$(function() {
    $("#myAccordion").accordion();

    /** Virtual Machine Sliders */

    // Instances
    var VMInstancesSlider = document.getElementById("VMInstancesSliderID");
    nrInstances = document.getElementById("VMInstances");
    nrInstances.innerHTML = VMInstancesSlider.value;
    VMInstancesSlider.oninput = function() {
        nrInstances.innerHTML = this.value;
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

    /** Storage Sliders */
    var StorageSlider = document.getElementById("StorageGBSliderID");
    storageSize = document.getElementById("StorageGB");
    storageSize.innerHTML = StorageSlider.value;
    StorageSlider.oninput = function() {
        storageSize.innerHTML = this.value;
        console.log(storageSize);
    }

    /** Database Sliders */
    var DBSlider = document.getElementById("DBGBSliderID");
    DBSize = document.getElementById("DBGB");
    DBSize.innerHTML = DBSlider.value;
    DBSlider.oninput = function() {
        DBSize.innerHTML = this.value;
    }

    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the button that opens the modal
    var btn = document.getElementById("provider");
    var btn1 = document.getElementById("save-modal");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }
    
    //When the user clicks on Save, close the modal
    btn1.onclick=function() {
        // save current provider
        $("input:checked").parent().each(function(){
            service = this.innerText;
        })
    
        modal.style.display = "none";
    }
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            $("input:checked").parent().each(function(){
                service = this.innerText;
            })
            modal.style.display = "none";
        }

    }
});

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

function showSettings(id, uniqueIdentifier){
    if (id=="vm") {
        openPopup(VirtualMachines[getObjectById(uniqueIdentifier, VirtualMachines)]);
        return;
    }
    if (id=="db") {
        openPopup(Databases[getObjectById(uniqueIdentifier, Databases)]);
        return;
    }
    if (id=="cs") {
        openPopup(Storages[getObjectById(uniqueIdentifier, Storages)]);
        return;
    }
    console.log("no reach here bitte");
}

function closeSettings(id){
	document.getElementById(id).style.display = "none";
}
