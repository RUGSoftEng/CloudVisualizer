var VirtualMachines=[];
var Databases=[];
var Storages=[];

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
            return i;
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
}

//Processes the new dropped Virtual machine
function addVirtualMachine(newVM) {
    //Will contain the index of the duplicate VM if it exists, else -1
    var newVMID = newObjectExists(newVM, VirtualMachines);
    if (newVMID != -1) {
        console.log("EXISTS");
        //Increments the duplicate with the number of to be added instances
        incrementVM(newVMID,newVM.nrInstances);
        //Updates the HTML in the canvas
        changeVMHTML(newVMID);
    } else {
        console.log("New virtual machine!");
        //Creates new VM
        VirtualMachines.push(newVM);
        //Adds HTML for the new VM to the canvas
        addVMHtml(VirtualMachines.length-1,"VM.png",newVM.nrInstances);
    }
}

//Processes the new dropped Database
function addDatabase(newDB) {
    //Will contain the index of the duplicate VM if it exists, else -1
    var newVMID = newObjectExists(newDB, Databases);
    if (newVMID != -1) {
        console.log("EXISTS");
        //Increments the duplicate with the number of to be added instances
        incrementDB(newVMID,newVM.nrInstances);
        //Updates the HTML in the canvas
        changeDBHTML(newVMID);
    } else {
        console.log("New database!");
        //Creates new VM
        Databases.push(newDB);
        //Adds HTML for the new VM to the canvas
        addVMHtml(VirtualMachines.length-1,"VM.png",newVM.nrInstances);
    }
}



//We have a basic HTML structure, where we fill in the details for each VM
function addVMHtml(par1,par2,par3){
	var vmhtml="<div id='vm_"+par1+"' class='icons'><img src='images/"+par2+"'><p>"+par3+"</p> <a href='#' onclick='removeIcon(\"#vm_"+par1+"\");'>x</a></div>";
	$("#items").append(vmhtml);
}

//Since we incorperated the ID in the div of the VM, we can easily edit it now
function changeVMHTML(VMId){
	var curVM = VirtualMachines[VMId];
	$("#vm_"+VMId+" p").text(curVM.nrInstances);
}

//Since we incorperated the ID in the div of the DB, we can easily edit it now
function changeDBHTML(DBId){
    var curDB = Databases[DBId];
    $("#vm_"+DBId+" p").text(curDB.nrInstances);
}

//Takes the VM at index VMId, and adds incr to it
function incrementVM(VMId,incr){
	var curVM = VirtualMachines[VMId];
	curVM.nrInstances = curVM.nrInstances + incr;
}

//Takes the DB at index DBId, and adds incr to it
function incrementDB(DBId,incr){
    var curDB = Databases[DBId];
    curDB.nrInstances = curDB.nrInstances + incr;
}


function addDatabase(newDatabase) {
    if (newObjectExists(newDatabase, Databases)) {
        console.log("EXISTS");
    } else {
        console.log("New database!");
        VirtualMachines.push(newDatabase);
    }
}

function addStorage(newStorage) {
    if (newObjectExists(newStorage, Storages)) {
        console.log("EXISTS");
    } else {
        console.log("New storage!");
        VirtualMachines.push(newStorage);
    }
}