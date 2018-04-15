<script>
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
        console.log($text);
    }});
});
    function googlepricelist2(){
        console.log("starting new google pricelist");
        $.ajax({
            type: 'GET',
            url: '/users3',
            contentType: 'application/json',
            success: function (result) {
                pricelist=result[0].gcp_price_list;
                var VM= new VirtualMachine();
                VM.region="us-central1";
                VM.type="N1-STANDARD-1";
                VM.days=1;
                VM.hours=1;
                VM.osType="win";
                VM.GPUType="NVIDIA_TESLA_K80";
                VM.localSSDSize=1*375;
                VM.PDSSDSize=1;
                VM.PDSize=1;
                VM.PDSnapshot=1;
                VM.preemptible=false;
                VM.committedUsage="0";
                VM.numGPU=0;
                VM.instanceType=determineInstanceType(VM.type);
                //console.log(VM.costMonthly());
                /*var Stor=new Storage();
                Stor.region="us-central1";
                Stor.multiRegional=500;
                Stor.regional=300;
                Stor.nearline=30;
                Stor.coldline=20;
                Stor.classAOps=1;
                Stor.classBOps=1;
                console.log(24*Stor.storageCostPerHour()); */
                var Data=new Database();
                Data.region="us-central1";
                Data.dataSize=50;
                Data.dataReads=10;
                Data.dataWrites=20;
                Data.dataDeletes=5;
                console.log(Data.dataStorePerHour()*24);
            }
        });
    }
    function getCol(matrix, col){
        var column = [];
        for(var i=0; i<matrix.length; i++){
            column.push(matrix[i][col]);
        }
        return column;
    }
    // global variable to hold the graph
    var chart;
    function createGraph(){
        // create graph in canvas area
        var ctx = document.getElementById("graph");
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Price',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ], borderWidth: 1},
                ]
            },
            options: {
                title:{
                    display:true,
                    text: 'Price comparison'
                },
                responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    }
    function plotData(){
        var tableData = getTableData();
        chart.data.labels = getCol(tableData, 1);
        chart.data.datasets[0].data = getCol(tableData,2);
        chart.update();
    }
</script>