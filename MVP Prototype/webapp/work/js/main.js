//drag
var nrInstances;
var days;
var hours;
var storageSize;
var DBSize;
var calculate;
var service = 'google-cloud';

function Canvas() {
    this.VirtualMachines=[];
    this.Databases=[];
    this.Storages=[];
    this.idCounter=0;
    this.numId=0;
}

var listOfCanvasses=[];
var idCanvas=0;
var currentCanvas=new Canvas();
/*
// from canvasObject
var VirtualMachines=[];
var Databases=[];
var Storages=[];
var idCounter=0; */

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
    var newVMID = newObjectExists(newVM, currentCanvas.VirtualMachines);
    if (newVMID != -1) {
        var newVMIndex = getObjectById(newVMID, currentCanvas.VirtualMachines);
        console.log("EXISTS");
        //Increments the duplicate with the number of to be added instances
        incrementNrInstances(newVMIndex,newVM.nrInstances, currentCanvas.VirtualMachines);
        //Updates the HTML in the canvas
        changeHTML(newVMIndex, currentCanvas.VirtualMachines, "vm", newVMID);
        checkIcon(currentCanvas.VirtualMachines, "vm", newVMIndex);
    } else {
        console.log("New virtual machine!");
        //Creates new VM
        newVM.numId=currentCanvas.idCounter++;
        currentCanvas.VirtualMachines.push(newVM);
        //console.log(VirtualMachines[0]);
        //Adds HTML for the new VM to the canvas
        addHTML(currentCanvas.VirtualMachines.length-1, newVM.nrInstances, "vm", newVM.numId, currentCanvas.VirtualMachines);
        checkIcon(currentCanvas.VirtualMachines, "vm", currentCanvas.VirtualMachines.length-1);
        openPopup(newVM);
    }
}

//Processes the new dropped Database
function addDatabase(newDB) {
    //Will contain the index of the duplicate DB if it exists, else -1
    var newDBID = newObjectExists(newDB, currentCanvas.Databases);
    if (newDBID != -1) {
        var newDBIndex = getObjectById(newDBID, currentCanvas.Databases);
        console.log("EXISTS");
        //Increments the duplicate with the number of to be added instances
        incrementNrInstances(newDBIndex,newDB.nrInstances, currentCanvas.Databases);
        //Updates the HTML in the canvas
        changeHTML(newDBIndex, currentCanvas.Databases, "db", newDBID);
        checkIcon(currentCanvas.Databases, "db", newDBIndex);
    } else {
        console.log("New data base!");
        //Creates new DB
        newDB.numId=currentCanvas.idCounter++;
        currentCanvas.Databases.push(newDB);
        //Adds HTML for the new VM to the canvas
        addHTML(currentCanvas.Databases.length-1, newDB.nrInstances, "db", newDB.numId, currentCanvas.Databases);
        checkIcon(currentCanvas.Databases, "db", currentCanvas.Databases.length-1);
    }
}

//Processes the new dropped Storage
function addStorage(newStorage) {
    //Will contain the index of the duplicate Storage if it exists, else -1
    var newStorageID = newObjectExists(newStorage, currentCanvas.Storages);
    if (newStorageID != -1) {
        var newStorageIndex = getObjectById(newStorageID, currentCanvas.Storages);
        console.log("EXISTS");
        //Increments the duplicate with the number of to be added instances
        incrementNrInstances(newStorageIndex,newStorage.nrInstances, currentCanvas.Storages);
        //Updates the HTML in the canvas
        changeHTML(newStorageIndex, currentCanvas.Storages, "cs", newStorageID);
        checkIcon(currentCanvas.Storages, "cs", newStorageIndex);
    } else {
        console.log("New storage!");
        //Creates new storage
        newStorage.numId=currentCanvas.idCounter++;
        currentCanvas.Storages.push(newStorage);
        //Adds HTML for the new VM to the canvas
        addHTML(currentCanvas.Storages.length-1, newStorage.nrInstances, "cs", newStorage.numId, currentCanvas.Storages);
        checkIcon(currentCanvas.Storages, "cs", currentCanvas.Storages.length-1);
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

function resetCanvas(canvasID) {
    clearBox('itemsvm','itemsst','itemsdb');
    console.log("id is:"+canvasID);
    currentCanvas=copyCanvas(listOfCanvasses[getObjectById(canvasID, listOfCanvasses)]);
    for (var i=0; i<currentCanvas.VirtualMachines.length; i++) {
        var VM=currentCanvas.VirtualMachines[i];
        addHTML(currentCanvas.VirtualMachines.length-1, VM.nrInstances, "vm", VM.numId, currentCanvas.VirtualMachines);
        checkIcon(currentCanvas.VirtualMachines, "vm", currentCanvas.VirtualMachines.length-1);
    }
    for (var i=0; i<currentCanvas.Databases.length; i++) {
        var DB=currentCanvas.Databases[i];
        addHTML(currentCanvas.Databases.length-1, DB.nrInstances, "db", DB.numId, currentCanvas.Databases);
        checkIcon(currentCanvas.Databases, "db", currentCanvas.Databases.length-1);
    }
    for (var i=0; i<currentCanvas.Storages.length; i++) {
        var storage=currentCanvas.Storages[i];
        addHTML(currentCanvas.Storages.length-1, storage.nrInstances, "cs", storage.numId, currentCanvas.Storages);
        checkIcon(currentCanvas.Storages, "cs", currentCanvas.Storages.length-1);
    }
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
    if(id==="vm")
      $("#itemsvm").append(objectHTML);
    else if(id==="db")
      $("#itemsdb").append(objectHTML);
    else {
        $("#itemsst").append(objectHTML);
    }

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
        addVirtualMachine(instance);
    }
    if (obj.objectName === "Database") {
        var instance = Object.assign(new Database(), obj);
        addDatabase(instance);
    }
    if (obj.objectName === "Storage") {
        var instance = Object.assign(new Storage(), obj);
        addStorage(instance);
    }
}

function refresh() {
    clearBox('itemsvm');
    for (var i in currentCanvas.VirtualMachines) {
        var curVM  = currentCanvas.VirtualMachines[i];
        $("#itemsvm").append($('<div class="test" ></div>').html('<img src="images/VM.png">'));
        console.log(i.hours);
    }
}

function clearBox(elementID1,elementID2,elementID3) {
    document.getElementById(elementID1).innerHTML = "";
    document.getElementById(elementID2).innerHTML = "";
    document.getElementById(elementID3).innerHTML = "";
    currentCanvas=new Canvas();
}
function removeIcon(elementID, uniqueIdentifier){
    var divId = "#"+elementID + "_"+uniqueIdentifier;
    $(divId).remove();
    console.log(elementID);
    if (elementID=="vm") {
        currentCanvas.VirtualMachines.splice(getObjectById(uniqueIdentifier, currentCanvas.VirtualMachines), 1);
        return;
    }
    if (elementID=="db") {
        currentCanvas.Databases.splice(getObjectById(uniqueIdentifier, currentCanvas.Databases), 1);
        return;
    }
    if (elementID=="cs") {
        currentCanvas.Storages.splice(getObjectById(uniqueIdentifier, currentCanvas.Storages), 1);
        return;
    }
    console.log("NO THANKS");
}

//show the div when calculate is clicked
function showCalculationDiv() {
    var x = document.getElementById("canvas-pop-up");
    if (x.style.display = "none") {
        x.style.display = "block";
    }
}

// set content of the calculationDiv
function addCalculationToDiv(string, totalPrice, canvasID){
    var date = new Date();

    // build new list item in HTML
    var newListItem = '<a  id="pizza" class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">';
    newListItem += '<h5 class="mb-1">Calculation for ' + service + '</h5>';
    newListItem += '<small>' + date.toTimeString() + '</small></div>';
    newListItem += '<p class="mb-1">' + string +  '</p>';
    newListItem += '<small>Totalprice: ' + totalPrice+ '</small>';
    newListItem +=  '<br><p id='+canvasID+' style="float:right" class="glyphicon glyphicon-share-alt" href="#" onclick="resetCanvas(id)" >'+ '</p>';
    newListItem +=  '<p style="float:right" class="glyphicon glyphicon-trash" href="#" onclick="console.log(0)">'+ '</p></a>';

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

function copyCanvas(canvas) {
    var listVirtualMachines=[];
    var listDatabases=[];
    var listStorages=[];
    var newCanvas=new Canvas();
    for (var i=0; i<canvas.VirtualMachines.length; i++) {
        listVirtualMachines.push(Object.assign(new VirtualMachine(), canvas.VirtualMachines[i]));
    }
    for (var i=0; i<canvas.Databases.length; i++) {
        listDatabases.push(Object.assign(new Database(), canvas.Databases[i]));
    }
    for (var i=0; i<canvas.Storages.length; i++) {
        listStorages.push(Object.assign(new Storage(), canvas.Storages[i]));
    }
    newCanvas.idCounter=canvas.idCounter;
    newCanvas.numId=canvas.numId;
    newCanvas.VirtualMachines=listVirtualMachines;
    newCanvas.Databases=listDatabases;
    newCanvas.Storages=listStorages;
    return newCanvas;

}
/* Wrote this function to work on the google json when the clouddata API is down */
function calculateTemp (){

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

            /** Add canvas to list of canvas, so we can set it back later */
            if (listOfCanvasses.length<5) {
                currentCanvas.numId = idCanvas++;
                console.log(idCanvas);
                console.log(currentCanvas);
                console.log(copyCanvas(currentCanvas));
                listOfCanvasses.push(copyCanvas(currentCanvas));
                console.log(listOfCanvasses);
                /** */

                /** Calculations */

                for (var i in currentCanvas.VirtualMachines) {
                    currentCanvas.VirtualMachines[i].instanceType = determineInstanceType(currentCanvas.VirtualMachines[i].type);
                    console.log(currentCanvas.VirtualMachines[i].costMonthly());
                }
                for (var i in currentCanvas.Databases) {
                    console.log("Monthly costs: " + currentCanvas.Databases[i].costMonthly());
                }
                for (var i in currentCanvas.Storages) {
                    console.log("Monthly costs: " + currentCanvas.Storages[i].costMonthly());
                }
                var totalprice = 0;
                var myString = '';
                addCalculationToDiv(result.substring(0, 300), Math.round(totalprice * 100) / 100, currentCanvas.numId);
                showCalculationDiv();
            }

            /** */
        }
    };
    xobj.send(null);

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
        openPopup(currentCanvas.VirtualMachines[getObjectById(uniqueIdentifier, currentCanvas.VirtualMachines)]);
        return;
    }
    if (id=="db") {
        openPopup(currentCanvas.Databases[getObjectById(uniqueIdentifier, currentCanvas.Databases)]);
        return;
    }
    if (id=="cs") {
        openPopup(currentCanvas.Storages[getObjectById(uniqueIdentifier, currentCanvas.Storages)]);
        return;
    }
    console.log("no reach here bitte");
}

function closeSettings(id){
	document.getElementById(id).style.display = "none";
}
