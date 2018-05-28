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
        //Increments the duplicate with the number of to be added instances
        incrementNrInstances(newVMIndex,newVM.nrInstances, currentCanvas.VirtualMachines);
        //Updates the HTML in the canvas
        changeHTML(newVMIndex, currentCanvas.VirtualMachines, "vm", newVMID);
        checkIcon(currentCanvas.VirtualMachines, "vm", newVMIndex);
    } else {
        //Creates new VM
        newVM.numId=currentCanvas.idCounter++;
        currentCanvas.VirtualMachines.push(newVM);
        //Adds HTML for the new VM to the canvas
        addHTML(newVM.nrInstances, "vm", newVM.numId, currentCanvas.VirtualMachines);
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
        //Increments the duplicate with the number of to be added instances
        incrementNrInstances(newDBIndex,newDB.nrInstances, currentCanvas.Databases);
        //Updates the HTML in the canvas
        changeHTML(newDBIndex, currentCanvas.Databases, "db", newDBID);
        checkIcon(currentCanvas.Databases, "db", newDBIndex);
    } else {
        //Creates new DB
        newDB.numId=currentCanvas.idCounter++;
        currentCanvas.Databases.push(newDB);
        //Adds HTML for the new VM to the canvas
        addHTML(newDB.nrInstances, "db", newDB.numId, currentCanvas.Databases);
        checkIcon(currentCanvas.Databases, "db", currentCanvas.Databases.length-1);
    }
}

//Processes the new dropped Storage
function addStorage(newStorage) {
    //Will contain the index of the duplicate Storage if it exists, else -1
    var newStorageID = newObjectExists(newStorage, currentCanvas.Storages);
    if (newStorageID != -1) {
        var newStorageIndex = getObjectById(newStorageID, currentCanvas.Storages);
        //Increments the duplicate with the number of to be added instances
        incrementNrInstances(newStorageIndex,newStorage.nrInstances, currentCanvas.Storages);
        //Updates the HTML in the canvas
        changeHTML(newStorageIndex, currentCanvas.Storages, "cs", newStorageID);
        checkIcon(currentCanvas.Storages, "cs", newStorageIndex);
    } else {
        //Creates new storage
        newStorage.numId=currentCanvas.idCounter++;
        currentCanvas.Storages.push(newStorage);
        //Adds HTML for the new VM to the canvas
        addHTML(newStorage.nrInstances, "cs", newStorage.numId, currentCanvas.Storages);
        checkIcon(currentCanvas.Storages, "cs", currentCanvas.Storages.length-1);
    }
}

function getObjectById(id, listOfObjects) {
    for (var i=0; i<listOfObjects.length; i++) {
        if (listOfObjects[i].numId==id) {
            return i;
        }
    }
    console.error("Shouldn't reach here!");
    return null;
}

function resetCanvas(canvasID) {
    clearBox('itemsvm','itemsst','itemsdb');
    currentCanvas=copyCanvas(listOfCanvasses[getObjectById(canvasID, listOfCanvasses)]);
    for (var i=0; i<currentCanvas.VirtualMachines.length; i++) {
        var VM=currentCanvas.VirtualMachines[i];
        addHTML(VM.nrInstances, "vm", VM.numId, currentCanvas.VirtualMachines);
        checkIcon(currentCanvas.VirtualMachines, "vm", i);
    }
    for (var i=0; i<currentCanvas.Databases.length; i++) {
        var DB=currentCanvas.Databases[i];
        addHTML(DB.nrInstances, "db", DB.numId, currentCanvas.Databases);
        checkIcon(currentCanvas.Databases, "db", i);
    }
    for (var i=0; i<currentCanvas.Storages.length; i++) {
        var storage=currentCanvas.Storages[i];
        addHTML(storage.nrInstances, "cs", storage.numId, currentCanvas.Storages);
        checkIcon(currentCanvas.Storages, "cs", i);
    }
}

function removeCanvas(canvasID, documentID) {
    var divId = "#canvas_"+canvasID;
    $(divId).remove();
    listOfCanvasses.splice(getObjectById(canvasID, listOfCanvasses), 1);
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
        }
    }
}

function openPopup(objectToEdit){
    /*Insert code that shows the html of the popup*/
    for (var property in objectToEdit) {
        if (objectToEdit.hasOwnProperty(property)) {
            attachVariable(property,objectToEdit);
        }
    }
}


//We have a basic HTML structure, where we fill in the details for each Object
function addHTML(par3, id, uniqueIdentifier, listOfObjects){
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
    console.error("Error removing icon");
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
    newCanvas.service = canvas.service;
    newCanvas.timestamp = canvas.timestamp;
    newCanvas.description = canvas.description;
    newCanvas.monthlyPrice = canvas.monthlyPrice;
    newCanvas.yearlyPrice = canvas.yearlyPrice;
    newCanvas.VirtualMachines=listVirtualMachines;
    newCanvas.Databases=listDatabases;
    newCanvas.Storages=listStorages;
    return newCanvas;
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
    console.error("Error showing settings, not allowed to reach here");
}

function closeSettings(id){
	document.getElementById(id).style.display = "none";
}