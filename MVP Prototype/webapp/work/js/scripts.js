//drag
var nrInstances;
var days;
var hours;
var calculate;
googlepricelist();
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

    calculate = document.getElementById("calculate");
    calculate.onclick = function() {
        var prices = [];
        var totalprice = 0;
        for (var i in VirtualMachines) {
            prices.push(VirtualMachines[i].costMonthly() * VirtualMachines[i].nrInstances);
            totalprice = totalprice + VirtualMachines[i].costMonthly() * VirtualMachines[i].nrInstances;
        }
        var myString = '';
        for (var i in prices) {
            myString = myString + '\n' + "Virtual machine " + i + "     " + Math.round(prices[i] * 100) / 100;
        }
        alert(myString + '\n' + "Total                          " + Math.round(totalprice * 100) / 100);
    }
});