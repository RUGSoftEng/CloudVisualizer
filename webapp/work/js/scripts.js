
  $(document).ready(function(){
       $("#myAccordion").accordion();
       $(".source li").draggable({helper:"clone"});
       $("#canvas").droppable({drop:function(event,ui){
           $("#items").append($("<li></li>").text(ui.draggable.text()));
       }});
  });
  
  function clearBox(elementID){
    document.getElementById(elementID).innerHTML = "";
  }

  
  