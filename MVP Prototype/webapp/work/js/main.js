//drag
var nrInstances;
var days;
var hours;
var storageSize;
var DBSize;
var calculate;

// from canvasObject
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
    return newStorage;
}

//Processes the new dropped Virtual machine
function addVirtualMachine(newVM) {
    //Will contain the index of the duplicate VM if it exists, else -1
    var newVMID = newObjectExists(newVM, VirtualMachines);
    if (newVMID != -1) {
        console.log("EXISTS");
        //Increments the duplicate with the number of to be added instances
        incrementNrInstances(newVMID,newVM.nrInstances, VirtualMachines);
        //Updates the HTML in the canvas
        changeHTML(newVMID, VirtualMachines,"vm");
    } else {
        console.log("New virtual machine!");
        //Creates new VM
        VirtualMachines.push(newVM);
        //Adds HTML for the new VM to the canvas
        addHTML(VirtualMachines.length-1,newVM.nrInstances,"vm");
    }
}

//Processes the new dropped Database
function addDatabase(newDB) {
    //Will contain the index of the duplicate VM if it exists, else -1
    var newDBID = newObjectExists(newDB, Databases);
    if (newDBID != -1) {
        console.log("EXISTS");
        //Increments the duplicate with the number of to be added instances
        incrementNrInstances(newDBID,newDB.nrInstances, Databases);
        //Updates the HTML in the canvas
        changeHTML(newDBID, Databases, "db");
    } else {
        console.log("New database!");
        //Creates new VM
        Databases.push(newDB);
        //Adds HTML for the new VM to the canvas
        addHTML(Databases.length-1,newDB.nrInstances, "db");
    }
}

//Processes the new dropped Database
function addStorage(newStorage) {
    //Will contain the index of the duplicate VM if it exists, else -1
    var newStorageID = newObjectExists(newStorage, Storages);
    if (newStorageID != -1) {
        console.log("EXISTS");
        //Increments the duplicate with the number of to be added instances
        incrementNrInstances(newStorageID,newStorage.nrInstances, Storages);
        //Updates the HTML in the canvas
        changeHTML(newStorageID, Storages, "cs");
    } else {
        console.log("New storage!");
        //Creates new VM
        Storages.push(newStorage);
        //Adds HTML for the new VM to the canvas
        addHTML(Storages.length-1,newStorage.nrInstances,"cs");
    }
}

//We have a basic HTML structure, where we fill in the details for each Object
function addHTML(par1,par3, id){
    var objectHTML="<div id='"+id+"_"+par1+"' class='icons'><img src='images/"+id+".png'><p>"+par3+"</p> <a href='#' onclick='removeIcon(\"#"+id+"_"+par1+"\");'>x</a></div>";
    $("#items").append(objectHTML);
}

//Since we incorperated the ID in the div of the Object, we can easily edit it now
function changeHTML(index, listOfObjects, id){
    var curObject = listOfObjects[index];
    $("#"+id+"_"+index+" p").text(curObject.nrInstances);
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
    console.log(newDB);
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
        addVirtualMachine(obj);
    }
    if (obj.objectName === "Database") {
        console.log(obj.objectName);
        addDatabase(obj);
    }
    if (obj.objectName === "Storage") {
        console.log(obj.objectName);
        addStorage(obj);
    }
    //console.log(obj.objectName);
    console.log(obj);
    //refresh();
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
}
function removeIcon(elementID){
	$(elementID).remove();
}

function calculate (){
    console.log("Calculate button pressed..", "sending AJAX request to cloudwatch");

    var result = '';
    // placeholder for user's choice
    var data ={'service' : 'google-cloud'};

    // send HTTP request to Node so that it communicates with cloudwatch
    $.ajax({
        type: 'POST',
        url: '/cloudwatch',
        contentType: 'html/text',
        data: data,
        success: function (res) {
            result += res;
        }
    })
    // callback function when request is finished
    .done(function(){
        console.log("Finished processing response of AJAX request to cloudwatch");

        // Stringified JSON data received from Cloudwatch
        //console.log(result);

        var totalprice=0;
        var myString='';

        for (var i in VirtualMachines) {
            var value = VirtualMachines[i].costMonthly() * VirtualMachines[i].nrInstances;
            totalprice += value;
            myString += '\n' + "Virtual machine " + i + "     " + Math.round(value*100)/100;
        }

        console.log(myString + '\n' + "Total                          " + Math.round(totalprice*100)/100);
    });
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
});
