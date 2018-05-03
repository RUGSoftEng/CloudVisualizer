var pricelist=[];
function VirtualMachine() {
    this.objectName="VirtualMachine";
    this.region="us-central1";/*user picked region*/;
    this.type="F1-MICRO";/*user picked type*/;
    this.days=1;/*days per week the VM is used*/;
    this.hours=1;/*hours per day the VM is used*/;
    this.osType="win";/*user picked OS*/;
    this.numGPU=0;/*number of GPUs*/
    this.GPUType="";/*user picked GPU*/;
    this.localSSDSize=0;/*user picked size*/;
    this.PDSSDSize=0;/*user picked size*/;
    this.PDSize=0;/*user picked size*/;
    this.PDSnapshot=0;/*user picked size*/;
    this.numTPU=0;/*user picked number of cloud TPUs. only available in US*/;
    this.TPUHours=0;/*hours per day the TPUS are used*/;
    this.preemptible=false;/*true or false based on user input*/;
    this.committedUsage="0";/*1-YEAR,3-YEAR or 0 string depending on user input*/;
    this.rules=0;
    this.nrInstances=1;
    this.numId = -1;
    // Functions
    this.instanceType=determineInstanceType(this.type);
    this.sustainedUsePerHour=sustainedUseHourly;
    this.osPerHour=osHourly;
    this.instancePerHour=instanceHourly;
    this.localSSDPerHour=localSSDHourly;
    this.GPUPerHour=GPUHourly;
    this.PDPerHour=PDHourly;
    this.LBPerHour=LBHourly;
    this.TPUPerHour=TPUHourly;
    this.costMonthly=VMCostMonthly;
    this.costQuarter=VMCostMonthly;
    this.costYear=VMCostMonthly;
}
function Storage() {
    this.objectName="Storage";
    /*The variables that influence the price of storage*/
    this.region="";
    this.multiRegional=0;/*user picked size of multi-regional storage*/;
    this.regional=0;/*user picked size of regional storage*/;
    this.nearline=0;/*user picked size of nearline storage*/;
    this.coldline=0;/*user picked size of coldline storage*/;
    this.classAOps=0;/*millions of class A operations per month*/;
    this.classBOps=0;/*millions of class B operations per month*/;
    this.nrInstances=1;
    // Functions
    this.costHour=storageCostHourly;
    this.costDay=storageCostHourly*24;
    this.costMonthly=storageCostHourly*24*(365/12);
    this.costYear=storageCostHourly*24*365;
}
function Database() {
    this.objectName="Database";
    /*The variables that influence the price of databases*/
    this.region="";
    this.dataSize=0;/*user picked size of data storage*/;
    this.dataReads=0;/*user picked number of entity reads per month*/;
    this.dataWrites=0;/*user picked number of entity writes per month*/;
    this.dataDeletes=0;/*user picked number of entity deletes per month*/;
    this.nrInstances=1;
    // Functions
    this.costHour=dataStoreCostHourly;
    this.costDay=dataStoreCostHourly*24;
    this.costMonthly=dataStoreCostHourly*24*(365/12);
    this.costYear=dataStoreCostHourly*24*365;
}
function googlepricelist (){
    console.log("starting new google pricelist");
    $.ajax({
        type: 'GET',
        url: '/users3',
        contentType: 'application/json',
        success: function (result) {
            pricelist=result[0].gcp_price_list;
        }
    });
}
function determineInstanceType(type) {
    if (type == "custom") {
        return {
            "cores": 0/*user input*/,
            "memory": 0/*user input*/
        }
    } else {
        if (this.preemptible) {
            return pricelist["CP-COMPUTEENGINE-VMIMAGE-" + type + "-PREEMPTIBLE"];
        } else {
            return pricelist["CP-COMPUTEENGINE-VMIMAGE-" + type];
        }
    }
}
function resetAll() {
    region="";
    type="";
    days=1;
    hours=1;
    osType="";
    numGPU=0;
    GPUType="";
    localSSDSize=0;
    PDSSDSize=0;
    PDSize=0;
    PDSnapshot=0;
    preemptible=false;
    committedUsage="0";
}
//input the results of running the other functions into these:
function VMCostMonthly(){
    return this.sustainedUsePerHour()*this.hours*this.days/7*365/12+this.TPUPerHour()*this.hours*365/12+(this.PDPerHour()+this.LBPerHour())*24*365/12;
}
var totalCostMonthly=function(VMCostPerMonth,StoragePerHour,dataStorePerHour){
    return VMCostPerMonth+(StoragePerHour+dataStorePerHour)*24*365/12;
}
function sustainedUseHourly(){
    var disc=1;
    var cud=1;
    if(this.committedUsage!="0"){
        cud=0.7;
    }else{
        var k=1;
        var f=this.days/7*this.hours/24;
        disc=0;
        while(f>k*pricelist["sustained_use_base"]){
            disc+=pricelist["sustained_use_base"]*f>k*pricelist["sustained_use_tiers"][k-1];
            k+=1;
        }
        disc+=f%pricelist["sustained_use_base"]*pricelist["sustained_use_tiers"][k-1];
        disc/=f;
    }
    return disc*(this.osPerHour()+this.instancePerHour()
        +this.localSSDPerHour()+cud*this.GPUPerHour());
}
function osHourly(){
    if(this.instanceType["cores"]=="shared"){
        return pricelist["CP-COMPUTEENGINE-OS"][this.osType]["low"];
    }else if(pricelist["CP-COMPUTEENGINE-OS"][this.osType]["cores"]=="shared"){
        var rate="high";
    }else if(pricelist["CP-COMPUTEENGINE-OS"][this.osType]["cores"]>this.instanceType["cores"]){
        var rate="high";
    }else{
        var rate="low";
    }
    if(pricelist["CP-COMPUTEENGINE-OS"][this.osType]["percore"]){
        return pricelist["CP-COMPUTEENGINE-OS"][this.osType][rate]*this.instanceType["cores"];
    }else{
        return pricelist["CP-COMPUTEENGINE-OS"][this.osType][rate];
    }
}
function instanceHourly(){
    if(this.committedUsage!="0"){
        return pricelist["CP-CUD-"+this.committedUsage+"-CPU"][this.region]*this.instanceType["cores"]+
            pricelist["CP-CUD-"+this.committedUsage+"-RAM"][this.region]*this.instanceType["memory"];
    }else if(this.type=="custom"){
        if(this.preemptible){
            var pre="-PREEMPTIBLE";
        }else{
            var pre="";
        }
        if(this.instanceType["memory"]>this.instanceType["cores"]*6.5){
            return pricelist["CP-COMPUTEENGINE-CUSTOM-VM-CORE"+pre][this.region]*this.instanceType["cores"]
                +(this.instanceType["memory"]-this.instanceType["cores"]*6.5)*pricelist["CP-COMPUTEENGINE-CUSTOM-VM-EXTENDED-RAM"+pre][this.region]
                +this.instanceType["cores"]*6.5*pricelist["CP-COMPUTEENGINE-CUSTOM-VM-RAM"+pre][this.region];
        }else{
            return pricelist["CP-COMPUTEENGINE-CUSTOM-VM-CORE"+pre][this.region]*this.instanceType["cores"]
                +this.instanceType["memory"]*6.5*pricelist["CP-COMPUTEENGINE-CUSTOM-VM-RAM"+pre][this.region];
        }
    }else{
        return this.instanceType[this.region];
    }
}
function localSSDHourly(){
    if(this.preemptible){
        return this.localSSDSize*pricelist["CP-COMPUTEENGINE-LOCAL-SSD-PREEMPTIBLE"][this.region];
    }else{
        return this.localSSDSize*pricelist["CP-COMPUTEENGINE-LOCAL-SSD"][this.region];
    }
}
function GPUHourly(){
    if(this.preemptible){
        return this.numGPU*pricelist["GPU_"+this.GPUType+"-PREEMPTIBLE"][this.region];
    }else if (this.numGPU!=0){
        return this.numGPU*pricelist["GPU_"+this.GPUType][this.region];
    }
    return 0;
}
function PDHourly(){
    return (this.PDSSDSize*pricelist["CP-COMPUTEENGINE-STORAGE-PD-SSD"][this.region]+
        this.PDSize*pricelist["CP-COMPUTEENGINE-STORAGE-PD-CAPACITY"][this.region]+
        this.PDSnapshot*pricelist["CP-COMPUTEENGINE-STORAGE-PD-SNAPSHOT"][this.region])
        *12/365/24;
}
function LBHourly(){
    if(this.rules>5){
        return pricelist["FORWARDING_RULE_CHARGE_BASE"][this.region]
            +pricelist["FORWARDING_RULE_CHARGE_EXTRA"][this.region]*(this.rules-5);
    }else if(this.rules!=0){
        return pricelist["FORWARDING_RULE_CHARGE_BASE"][this.region];
    }
    return 0;
}
function TPUHourly(){
    return this.numTPU*this.TPUHours/24*pricelist["CP-CLOUD-TPU"]["us-central1"];
}
function storageCostHourly(){
    return (pricelist["CP-BIGSTORE-STORAGE-MULTI_REGIONAL"][this.region]*this.multiRegional
        +pricelist["CP-BIGSTORE-STORAGE-REGIONAL"][this.region]*this.regional
        +pricelist["CP-BIGSTORE-STORAGE-NEARLINE"][this.region]*this.nearline
        +pricelist["CP-BIGSTORE-STORAGE-COLDLINE"][this.region]*this.coldline
        +100*this.classAOps*pricelist["CP-BIGSTORE-CLASS-A-REQUEST"][this.region]
        +100*this.classBOps*pricelist["CP-BIGSTORE-CLASS-B-REQUEST"][this.region])*12/365/24;
}
function dataStoreCostHourly(){
    var cost=0;
    if(this.dataReads>pricelist["CP-CLOUD-DATASTORE-ENTITY-READ"]["freequota"]["quantity"]){
        cost+=(this.dataReads-pricelist["CP-CLOUD-DATASTORE-ENTITY-READ"]["freequota"]["quantity"])*pricelist["CP-CLOUD-DATASTORE-ENTITY-READ"]["us"]
    }
    if(this.dataWrites>pricelist["CP-CLOUD-DATASTORE-ENTITY-WRITE"]["freequota"]["quantity"]){
        cost+=(this.dataWrites-pricelist["CP-CLOUD-DATASTORE-ENTITY-WRITE"]["freequota"]["quantity"])*pricelist["CP-CLOUD-DATASTORE-ENTITY-WRITE"]["us"]
    }
    if(this.dataDeletes>pricelist["CP-CLOUD-DATASTORE-ENTITY-DELETE"]["freequota"]["quantity"]){
        cost+=(this.dataDeletes-pricelist["CP-CLOUD-DATASTORE-ENTITY-DELETE"]["freequota"]["quantity"])*pricelist["CP-CLOUD-DATASTORE-ENTITY-DELETE"]["us"]
    }
    if(this.dataSize>pricelist["CP-CLOUD-DATASTORE-INSTANCES"]["freequota"]["quantity"]){
        cost+=(this.dataSize-pricelist["CP-CLOUD-DATASTORE-INSTANCES"]["freequota"]["quantity"])*pricelist["CP-CLOUD-DATASTORE-INSTANCES"]["us"]
    }
    return cost*12/365/24;
}