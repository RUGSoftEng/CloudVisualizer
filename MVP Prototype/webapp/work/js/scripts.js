//drag
var nrInstances;
var days;
var hours;
googlepricelist();
$(document).ready(function(){
    $("#myAccordion").accordion();
    $(".source li").draggable({helper:"clone"});
    $(".filters span").draggable({helper:"clone"});
    $("#canvas").droppable({drop:function(event,ui){
        $text = ui.draggable.html().replace(/(<in([^>]+)>)/ig,"");
        if($text.substr(0,3)=="<ul"){
            console.log("Virtual machine:");
        }
        $("#items").append($("<li></li>").html($text).on("click",function() { $(this).remove()}));
        console.log(days.innerHTML);
        console.log(nrInstances.innerHTML);
        console.log(hours.innerHTML);
        var testVM=new VirtualMachine();
        testVM.days=parseInt(days.innerHTML);
        testVM.hours=parseInt(hours.innerHTML);
        testVM.instanceType=determineInstanceType(testVM.type);
        console.log(testVM.costMonthly());
    }});
});

  function clearBox(elementID){
    document.getElementById(elementID).innerHTML = "";
  }
   $(function(){
  var slider2 = document.getElementById("myRange2");
  days = document.getElementById("demo2");
  days.innerHTML = slider2.value;

  slider2.oninput = function() {
    days.innerHTML = this.value;
  }

  var slider = document.getElementById("myRange");
  nrInstances = document.getElementById("demo");
  nrInstances.innerHTML = slider.value;

  slider.oninput = function() {
    nrInstances.innerHTML = this.value;
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
