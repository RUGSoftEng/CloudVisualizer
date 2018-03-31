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

var slider = document.getElementById("myRange2");
var output = document.getElementById("demo2");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}
