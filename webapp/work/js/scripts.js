//drag
  $(document).ready(function(){
       $("#myAccordion").accordion();
       $(".source li").draggable({helper:"clone"});
       $("#canvas").droppable({drop:function(event,ui){
           $("#items").append($("<li></li>").text(ui.draggable.text()).on("click",function() { $(this).remove()}));
       }});
  });

  function clearBox(elementID){
    document.getElementById(elementID).innerHTML = "";
  }
   $(function(){
  var slider2 = document.getElementById("myRange2");
  var output2 = document.getElementById("demo2");
  output2.innerHTML = slider2.value;

  slider2.oninput = function() {
    output2.innerHTML = this.value;
  }

  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");
  output.innerHTML = slider.value;

  slider.oninput = function() {
    output.innerHTML = this.value;
  }

  var slider3 = document.getElementById("myRange3");
  var output3 = document.getElementById("demo3");
  output3.innerHTML = slider3.value;

  slider3.oninput = function() {
    output3.innerHTML = this.value;
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
