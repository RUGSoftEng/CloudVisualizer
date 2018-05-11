//drag
var nrInstances;
var days;
var hours;
var calculate;

// from canvasObject
var VirtualMachines=[];
var Databases=[];
var Storages=[];

$(document).ready(function() {
    $("#myAccordion").accordion();
    /*$(".source li").draggable({helper:"clone"});
    $(".filters span").draggable({helper:"clone"});
	/*
    $("#canvas").droppable({drop:function(event,ui){
        $text = ui.draggable.html().replace(/(<in([^>]+)>)/ig,"");
  
        $("#items").append($("<li></li>").html($text).on("click",function() { $(this).remove()}));
    }});*/
});

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

function allowDrop(ev) {
    ev.preventDefault();
}

function dragDatabase(ev) {
    jQuery.event.props.push('dataTransfer');
    var newDB = createBasicDatabase(parseInt(dataSize.innerHTML));
    var j = JSON.stringify(newDB);
    ev.dataTransfer.setData("foo", j);
}

function dragStorage(ev) {
    jQuery.event.props.push('dataTransfer');
    ev.dataTransfer.setData("text", "Luc is super cool");
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

    var data ={'service' : 'google-cloud'};
    var result = '';

    // send HTTP request to Node so that it will receive from cloudwatch
    $.ajax({
        type: 'GET',
        url: '/cloudwatch',
        contentType: 'html/text',
        data: data,
        success: function (res) {
            result += res;
        }
    }).done(function(){
        console.log("Finished processing response of AJAX request to cloudwatch");
        console.log("calculating price...");

        // the actual calculation of the price
        var prices=[];
        var totalprice=0;
        for (var i in VirtualMachines) {
            prices.push(VirtualMachines[i].costMonthly()*VirtualMachines[i].nrInstances);
            totalprice=totalprice+VirtualMachines[i].costMonthly()*VirtualMachines[i].nrInstances;
        }
        var myString='';
        for ( var i in prices ){
            myString=myString+ '\n' + "Virtual machine " + i + "     " + Math.round(prices[i]*100)/100;
        }
        alert(myString + '\n' + "Total                          " + Math.round(totalprice*100)/100);
    });
}

$(function() {
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
    var StorageSize = document.getElementById("StorageGB");
    StorageSize.innerHTML = StorageSlider.value;
    StorageSlider.oninput = function() {
        StorageSize.innerHTML = this.value;
    }

    /** Database Sliders */
    var DBSlider = document.getElementById("DBGBSliderID");
    var DBSize = document.getElementById("DBGB");
    DBSize.innerHTML = DBSlider.value;
    DBSlider.oninput = function() {
        DBSize.innerHTML = this.value;
    }

    // calculate = document.getElementById("calculate");
    // calculate.onclick = function() {
    //     var prices = [];
    //     var totalprice = 0;
    //     for (var i in VirtualMachines) {
    //         prices.push(VirtualMachines[i].costMonthly() * VirtualMachines[i].nrInstances);
    //         totalprice = totalprice + VirtualMachines[i].costMonthly() * VirtualMachines[i].nrInstances;
    //     }
    //     var myString = '';
    //     for (var i in prices) {
    //         myString = myString + '\n' + "Virtual machine " + i + "     " + Math.round(prices[i] * 100) / 100;
    //     }
    //     alert(myString + '\n' + "Total                          " + Math.round(totalprice * 100) / 100);
    // }
});