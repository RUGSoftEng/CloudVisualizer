//drag
var nrInstances;
var days;
var hours;
var calculate;
googlepricelist();
$(document).ready(function(){
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

function drag(ev) {
    jQuery.event.props.push('dataTransfer');
    ev.dataTransfer.setData("text", ev.target.id);
}

function dragStorage(ev) {
    jQuery.event.props.push('dataTransfer');
    ev.dataTransfer.setData("text", "Luc is super cool");
}

function dragVM(ev) {
    jQuery.event.props.push('dataTransfer');
    var newVM=createBasicVirtualMachine(parseInt(nrInstances.innerHTML),parseInt(days.innerHTML),parseInt(hours.innerHTML));
    var j = JSON.stringify(newVM);
    ev.dataTransfer.setData("foo", j);
}

function drop(ev) {
    ev.preventDefault();
	var obj = JSON.parse(ev.dataTransfer.getData("foo"));
	if (obj.objectName==="VirtualMachine") {
	    addVirtualMachine(obj);
    }
	console.log(obj.objectName);
	console.log(obj);
    console.log("Lebronjames");
}

  function clearBox(elementID){
    document.getElementById(elementID).innerHTML = "";
  }
   $(function(){
  var slider2 = document.getElementById("myRange2");
  nrInstances = document.getElementById("demo2");
  nrInstances.innerHTML = slider2.value;

  slider2.oninput = function() {
    nrInstances.innerHTML = this.value;
  }

  calculate=document.getElementById("calculate");
  calculate.onclick = function() {
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
  }

  var slider = document.getElementById("myRange");
  days = document.getElementById("demo");
  days.innerHTML = slider.value;

  slider.oninput = function() {
    days.innerHTML = this.value;
  }

  var slider3 = document.getElementById("myRange3");
  hours = document.getElementById("demo3");
  hours.innerHTML = slider3.value;

  slider3.oninput = function() {
    hours.innerHTML = this.value;
  }
  var slider4 = document.getElementById("myRange4");
  var output4 = document.getElementById("demo4");
  output4.innerHTML = slider4.value;

  slider4.oninput = function() {
    output4.innerHTML = this.value;
  }
  var slider5 = document.getElementById("myRange5");
  var output5 = document.getElementById("demo5");
  output5.innerHTML = slider5.value;
  slider5.oninput = function() {
    output5.innerHTML = this.value;
  }
  });


