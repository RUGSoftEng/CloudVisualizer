//Checks if the to be added object already exists.
//If it exists, it will return the index where the duplicate object is located
//If it doesn't exist already, it returns -1
var memorySize = [0, 50, 100, 200, 300, 400, 500, 750, 1000, 1500, 2000 ,2500, 3000, 4000, 5000, 7500, 10000, 20000, 30000, 40000, 50000, 75000, 100000,200000,500000,750000];


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
    if (service == 'google-cloud') {
        newVM.instanceType = determineInstanceType(newVM.type);
    }
    return newVM;
}

function createBasicDatabase(nrInstances, size) {
    var newDatabase=new Database();
    newDatabase.dataSize=size;
    newDatabase.nrInstances=nrInstances;
    return newDatabase;
}

function createBasicStorage(nrInstances, multiRegionalSize, regionalSize, nearlineSize, coldlineSize) {
    var newStorage=new Storage();
    newStorage.multiRegional=multiRegionalSize;
    newStorage.regional=regionalSize;
    newStorage.nearline=nearlineSize;
    newStorage.coldline=coldlineSize;
    newStorage.nrInstances=nrInstances;
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


    service = currentCanvas.service;
    localStorage.setItem('provider', service);

    // TODO also change accordion

}

function removeCanvas(canvasID, documentID) {
    var divId = "#canvas_"+canvasID;
    $(divId).remove();
	
    // remove from main graph
    removeCalculationMainGraph(listOfCanvasses[getObjectById(canvasID, listOfCanvasses)].timestamp);
    // remove from list of canvasses
    listOfCanvasses.splice(getObjectById(canvasID, listOfCanvasses), 1);
    // remove from storage
    localStorage.setItem('listOfCanvasses', JSON.stringify(listOfCanvasses));
    if(listOfCanvasses.length == 0){
        document.getElementById("mainGraph").style.display = "none";
    }
	isOverflown();
}

function attachVariable (variableName,variableObject) {
    var input = document.getElementById(variableName);
    if (variableName === "type"){
        var keys = Object.keys(pricelist["data"][0]["data"]["services"]);
        for (var i=0;i<keys.length;i++){
            var typeName = (keys[i]).replace("CP-COMPUTEENGINE-VMIMAGE-","");
            if(keys[i] !== typeName && (keys[i]).match("PREEMPTIBLE")==null){
                var option = document.createElement("option");
                option.text = typeName + " vCPUs: " + pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-VMIMAGE-"+typeName]["properties"]["cores"] + " RAM: " + pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-VMIMAGE-"+typeName]["properties"]["memory"] +" GB";
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
            if (variableName==="type" || variableName ==="osType" || variableName==="GPUType" || variableName==="committedUsage"){
                variableObject[variableName] = this.value;
            }else if (variableName==="preemptible"){
                console.log(this.value);
                variableObject[variableName] = (this.value==="true")
            } else {
                variableObject[variableName] = parseInt(this.value);
            }
            if(variableName === "type"){
                if (service == 'google-cloud') {
                    variableObject.instanceType = determineInstanceType(variableObject.type);
                }
                if(pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-VMIMAGE-"+input.value]["properties"]["cores"] === "shared"){
                    variableObject.committedUsage = "0"
                    document.getElementById("committedUsage").disabled = true;
                    document.getElementById("committedUsage").value = "0";
                }else{
                    document.getElementById("committedUsage").disabled = false;
                }
            }
            // change graph
            if(variableObject instanceof VirtualMachine){
                updatePopupGraphVM(variableObject);
            } else if (variableObject instanceof Storage){
                updatePopupGraphCS(variableObject);
            } else if (variableObject instanceof Database){
                updatePopupGraphDB(variableObject);
            } else {
                console.error("instance of object on the canvas is not right");
            }

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
    }else{
        changeImage(id, index, "images/"+id+".png", listOfObjects[index].numId);
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
	var DBSizeSlider = document.getElementById("DBGBSliderID");
    var newDB = createBasicDatabase(parseInt(nrInstancesDB.innerHTML), memorySize[DBSizeSlider.value]);
    var j = JSON.stringify(newDB);
    ev.dataTransfer.setData("foo", j);
}

function dragStorage(ev) {
    jQuery.event.props.push('dataTransfer');
	var multiRegSlider = document.getElementById("multiRegionalStorageSliderID");
	var regSlider = document.getElementById("regionalStorageSliderID");
	var nearlineSlider = document.getElementById("nearlineStorageSliderID");
	var coldlineSlider = document.getElementById("coldlineStorageSliderID");
    var newStorage = createBasicStorage(parseInt(nrInstancesStorage.innerHTML), memorySize[multiRegSlider.value], memorySize[regSlider.value], memorySize[nearlineSlider.value], memorySize[coldlineSlider.value]);
    var j = JSON.stringify(newStorage);
    ev.dataTransfer.setData("foo", j);
}

function dragVM(ev) {
    jQuery.event.props.push('dataTransfer');
    var newVM = createBasicVirtualMachine(parseInt(nrInstancesVM.innerHTML), parseInt(days.innerHTML), parseInt(hours.innerHTML));
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
    var index;
    if (elementID=="vm") {
        index=getObjectById(uniqueIdentifier, currentCanvas.VirtualMachines);
        console.log("Removing element with uniqueIdentifier: "+uniqueIdentifier +"and index "+index);
        currentCanvas.VirtualMachines.splice(index, 1);
        return;
    }
    if (elementID=="db") {
        index=getObjectById(uniqueIdentifier, currentCanvas.Databases);
        console.log("Removing element with uniqueIdentifier: "+uniqueIdentifier +"and index "+index);
        currentCanvas.Databases.splice(index, 1);
        return;
    }
    if (elementID=="cs") {
        index=getObjectById(uniqueIdentifier, currentCanvas.Storages);
        console.log("Removing element with uniqueIdentifier: "+uniqueIdentifier +"and index "+index);
        currentCanvas.Storages.splice(index, 1);
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
    var current, copy,index;
    if (id=="vm") {
        index = getObjectById(uniqueIdentifier, currentCanvas.VirtualMachines);
        current = currentCanvas.VirtualMachines[index];
        copy = Object.assign(new VirtualMachine(),current);

        openPopup(copy);

        $('#vmSettings').find('#save-modal').click(function(){
            //var newVMID=newObjectExists(copy, currentCanvas.VirtualMachines);
            /*if (newVMID!=-1 && newVMID!=index) {
                var newVMIndex=getObjectById(newVMID, currentCanvas.VirtualMachines);
                incrementNrInstances(newVMIndex, copy.nrInstances, currentCanvas.VirtualMachines);
                changeHTML(newVMIndex, currentCanvas.VirtualMachines, "vm", newVMID);
                checkIcon(currentCanvas.VirtualMachines, "vm", newVMIndex);
                removeIcon("vm", uniqueIdentifier);
            } else {*/
                currentCanvas.VirtualMachines[index] = copy;
                changeHTML(index, currentCanvas.VirtualMachines, id, uniqueIdentifier);
                checkIcon(currentCanvas.VirtualMachines, id, index);
            //}
        });

        if (service == 'google-cloud') {
            copy.instanceType = determineInstanceType(copy.type);
        }
        updatePopupGraphVM(copy);
        return;
    }
    if (id=="db") {
        index = getObjectById(uniqueIdentifier, currentCanvas.Databases);
        current = currentCanvas.Databases[index];
        copy = Object.assign(new Database(),current);

        openPopup(copy);

        $('#dbSettings').find('#save-modal').click(function(){
            /*var newDBID=newObjectExists(copy, currentCanvas.Databases);
            if (newDBID!=-1 && newDBID!=index) {
                var newDBIndex=getObjectById(newDBID, currentCanvas.Databases);
                incrementNrInstances(newDBIndex, copy.nrInstances, currentCanvas.Databases);
                changeHTML(newDBIndex, currentCanvas.Databases, "db", newDBID);
                checkIcon(currentCanvas.Databases, "db", newDBIndex);
                removeIcon("db", uniqueIdentifier);
            } else {*/
                currentCanvas.Databases[index] = copy;
                changeHTML(index, currentCanvas.Databases, id, uniqueIdentifier);
                checkIcon(currentCanvas.Databases, id, index);
            //}
        });


        updatePopupGraphDB(copy);
        return;
    }
    if (id=="cs") {
        index = getObjectById(uniqueIdentifier, currentCanvas.Storages);
        current = currentCanvas.Storages[index];
        copy = Object.assign(new Storage(),current);
        openPopup(copy);
        $('#csSettings').find('#save-modal').click(function(){
            //console.log("Showing item with identifier "+uniqueIdentifier);
            //var newStorageID=newObjectExists(copy, currentCanvas.Storages);
            //console.log("Showing item with identifier "+uniqueIdentifier);
            /*if (newStorageID!=-1 && newStorageID!=index) {
                console.log("Showing item with identifier "+uniqueIdentifier);
                var newStorageIndex=getObjectById(newStorageID, currentCanvas.Storages);
                console.log("Showing item with identifier "+uniqueIdentifier);
                console.log(newStorageIndex);
                incrementNrInstances(newStorageIndex, copy.nrInstances, currentCanvas.Storages);
                console.log("Showing item with identifier "+uniqueIdentifier);
                changeHTML(newStorageIndex, currentCanvas.Storages, "cs", newStorageID);
                console.log("Showing item with identifier "+uniqueIdentifier);
                checkIcon(currentCanvas.Storages, "cs", newStorageIndex);
                console.log("Showing item with identifier "+uniqueIdentifier);
                console.log(uniqueIdentifier);
                removeIcon("cs", uniqueIdentifier);
                console.log("zes");
            } else {*/
                console.log(uniqueIdentifier);
                currentCanvas.Storages[index] = copy;
                changeHTML(index, currentCanvas.Storages, id, uniqueIdentifier);
                checkIcon(currentCanvas.Storages, id, index);
            //}
        });

        updatePopupGraphCS(copy);
        return;
    }
    console.error("Error showing settings, not allowed to reach here");
}
