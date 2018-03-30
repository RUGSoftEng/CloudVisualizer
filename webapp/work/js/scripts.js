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

  //sliders
var slider = document.getElementById("myRange");
var output = document.getElementById("value");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}
