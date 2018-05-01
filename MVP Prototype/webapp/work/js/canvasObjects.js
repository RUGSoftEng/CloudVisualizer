var VirtualMachines=[];
var Databases=[];
var Storages=[];

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

function addVirtualMachine(newVM) {
	var newVMID = newObjectExists(newVM, VirtualMachines);
    if (newVMID != -1) {
        console.log("EXISTS");
		incrementVM(newVMID,newVM.nrInstances);
		changeVMHTML(newVMID);
    } else {
        console.log("New virtual machine!");
        VirtualMachines.push(newVM);
		addVMHtml(VirtualMachines.length-1,"VM.png",newVM.nrInstances);
    }
}

function addVMHtml(par1,par2,par3){
	var vmhtml="<div id='vm_"+par1+"' class='icons'><img src='images/"+par2+"'><p>"+par3+"</p></div>";
	$("#items").append(vmhtml);
}

function changeVMHTML(VMId){
	var curVM = VirtualMachines[VMId];
	$("#vm_"+VMId+" p").text(curVM.nrInstances);
}

function incrementVM(VMId,incr){
	var curVM = VirtualMachines[VMId];
	curVM.nrInstances = curVM.nrInstances + incr;
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