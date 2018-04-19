var VirtualMachines=[];
var Databases=[];
var Storages=[];

function VMExists(vm) {
    var oldNrInstances=vm.nrInstances;
    for (var i=0; i<VirtualMachines.length; i++) {
        // They can be equal but have different number of instances, so we make them equal.
        vm.nrInstances=VirtualMachines[i];
        if (vm===VirtualMachines[i]) {
            console.log(vm);
            console.log(VirtualMachines[i]);
            return true;
        }
    }
    vm.nrInstances=oldNrInstances;
    return false;
}

function DatabaseExists(d) {
    for (var i=0; i<Databases.length; i++) {
        if (d===Databases.get(i)) {
            return true;
        }
    }
    return false;
}

function StorageExists(s) {
    for (var i=0; i<Storages.length; i++) {
        if (s===Storages.get(i)) {
            return true;
        }
    }
    return false;
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

function addVirtualMachine(newVM) {
    if (VMExists(newVM)) {
        console.log("EXISTS");
    } else {
        console.log("NEW VM !");
        VirtualMachines.push(newVM);
    }
}