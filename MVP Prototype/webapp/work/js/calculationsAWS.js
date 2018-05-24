var pricelist = [];
function VirtualMachineAWS() {
    this.objectName = "VirtualMachine";
    this.region="US East (N-Virginia)";/*user picked region*/;
    this.type="t2-large";/*user picked type*/;
    this.days=1;/*days per week the VM is used*/;
    this.hours=1;/*hours per day the VM is used*/;
    this.osType="Linux";/*user picked OS*/;
    this.nrInstances=1;
    this.numId=-1;
}

