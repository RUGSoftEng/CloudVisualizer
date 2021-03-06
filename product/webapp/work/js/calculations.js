var pricelist = [];

function VirtualMachine() {
    this.objectName = "VirtualMachine";
    this.type = (service === "google-cloud") ? "N1-STANDARD-4" : (service === "amazon-webservices") ? "m4-xlarge" : "B4MS"; /*user picked type*/ ;
    this.days = 1; /*days per week the VM is used*/ ;
    this.hours = 1; /*hours per day the VM is used*/ ;
    this.osType = (service === "google-cloud") ? "" : (service === "amazon-webservices") ? "Linux" : "SQL Server Web"; /*user picked OS*/ ;
    this.numGPU = 0; /*number of GPUs*/
    this.GPUType = ""; /*user picked GPU*/ ;
    this.localSSDSize = 0; /*user picked size*/ ;
    this.PDSSDSize = 0; /*user picked size*/ ;
    this.PDSize = 0; /*user picked size*/ ;
    this.PDSnapshot = 0; /*user picked size*/ ;
    this.numTPU = 0; /*user picked number of cloud TPUs. only available in US*/ ;
    this.TPUHours = 0; /*hours per day the TPUS are used*/ ;
    this.preemptible = false; /*true or false based on user input*/ ;
    this.committedUsage = "0"; /*1-YEAR,3-YEAR or 0 string depending on user input*/ ;
    this.rules = 0;
    this.nrInstances = 1;
    this.numId = -1;
    // Functions
    //this.instanceType=determineInstanceType(this.type);
    this.sustainedUsePerHour = sustainedUseHourly;
    this.osPerHour = osHourly;
    this.instancePerHour = instanceHourly;
    this.localSSDPerHour = localSSDHourly;
    this.GPUPerHour = GPUHourly;
    this.PDPerHour = PDHourly;
    this.LBPerHour = LBHourly;
    this.TPUPerHour = TPUHourly;
    this.costMonthly = VMCostMonthly[service];
    //this.costQuarter=VMCostMonthly; // Not correct
    this.costYear = VMCostYearly; // Not correct
}

function Storage() {
    this.objectName = "Storage";
    /*The variables that influence the price of storage*/
    this.multiRegional = 0; /*user picked size of multi-regional storage*/ ;
    this.regional = 0; /*user picked size of regional storage*/ ;
    this.nearline = 0; /*user picked size of nearline storage*/ ;
    this.coldline = 0; /*user picked size of coldline storage*/ ;
    this.classAOps = 0; /*millions of class A operations per month*/ ;
    this.classBOps = 0; /*millions of class B operations per month*/ ;
    this.nrInstances = 1;
    this.numId = -1;
    // Functions
    this.costHour = storageCostHourly;
    this.costDay = storageCostDaily;
    this.sustainedUsePerHour = sustainedUseHourly;
    this.costMonthly = storageCostMonthly;
    this.costYear = storageCostYearly;
}

function Database() {
    this.objectName = "Database";
    /*The variables that influence the price of databases*/
    this.dataSize = 0; /*user picked size of data storage*/ ;
    this.dataReads = 0; /*user picked number of entity reads per month*/ ;
    this.dataWrites = 0; /*user picked number of entity writes per month*/ ;
    this.dataDeletes = 0; /*user picked number of entity deletes per month*/ ;
    this.nrInstances = 1;
    this.numId = -1;
    // Functions
    this.costHour = dataStoreCostHourly;
    this.costDay = dataStoreCostDaily;
    this.costMonthly = dataStoreCostMonthly;
    this.costYear = dataStoreCostYearly;
    this.sustainedUsePerHour = sustainedUseHourly;
}

function determineInstanceType(type) {
    if (type == "custom") {
        return {
            "cores": 0 /*user input*/ ,
            "memory": 0 /*user input*/
        }
    } else {
        if (this.preemptible === true) {
            return pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-VMIMAGE-" + type + "-PREEMPTIBLE"]["properties"];
        } else {
            return pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-VMIMAGE-" + type]["properties"];
        }
    }
}

function resetAll() {
    region = "";
    type = "";
    days = 1;
    hours = 1;
    osType = "";
    numGPU = 0;
    GPUType = "";
    localSSDSize = 0;
    PDSSDSize = 0;
    PDSize = 0;
    PDSnapshot = 0;
    preemptible = false;
    committedUsage = "0";
}

var VMCostMonthly = {
    "google-cloud": function() {
        return (this.sustainedUsePerHour() * this.hours * this.days / 7 * 365 / 12 + this.TPUPerHour() * this.TPUHours * 365 / 12 + (this.PDPerHour() + this.LBPerHour()) * 24 * 365 / 12) * this.nrInstances;
    },
    "amazon-webservices": function() {
        return pricelist["data"][0]["data"]["services"][this.type + "-" + this.osType]["locales"][currentCanvas.region] * (this.days / 7 * this.hours / 24 * 24 * 365 / 12) * this.nrInstances;
    },
    "microsoft-azure": function() {
        return pricelist["data"][0]["data"]["services"][this.type + " SQL Server Web"]["locales"][currentCanvas.region] * (this.days / 7 * this.hours / 24 * 24 * 365 / 12) * this.nrInstances;
    }
}

//input the results of running the other functions into these:

function VMCostYearly() {
    return (this.costMonthly()) * 12;
}

function sustainedUseHourly() {

    var disc = 1;
    var cud = 1;
    if (this.committedUsage != "0") {
        cud = 0.7;
    } else {
        var k = 1;
        var f = (this.days / 7) * (this.hours / 24);
        disc = 0;
        while (f >= k * pricelist["data"][0]["data"]["meta"]["base"]) {
            switch (k - 1) {
                case 0:
                    disc += pricelist["data"][0]["data"]["meta"]["base"] * pricelist["data"][0]["data"]["meta"]["tiers"]["0,25"];
                    break;
                case 1:
                    disc += pricelist["data"][0]["data"]["meta"]["base"] * pricelist["data"][0]["data"]["meta"]["tiers"]["0,50"];
                    break;
                case 2:
                    disc += pricelist["data"][0]["data"]["meta"]["base"] * pricelist["data"][0]["data"]["meta"]["tiers"]["0,75"];
                    break;
                case 3:
                    disc += pricelist["data"][0]["data"]["meta"]["base"] * pricelist["data"][0]["data"]["meta"]["tiers"]["1,0"];
                    break;
            }
            k += 1;
        }
        switch (k - 1) {
            case 0:
                disc += f % pricelist["data"][0]["data"]["meta"]["base"] * pricelist["data"][0]["data"]["meta"]["tiers"]["0,25"];
                break;
            case 1:
                disc += f % pricelist["data"][0]["data"]["meta"]["base"] * pricelist["data"][0]["data"]["meta"]["tiers"]["0,50"];
                break;
            case 2:
                disc += f % pricelist["data"][0]["data"]["meta"]["base"] * pricelist["data"][0]["data"]["meta"]["tiers"]["0,75"];
                break;
            case 3:
                disc += f % pricelist["data"][0]["data"]["meta"]["base"] * pricelist["data"][0]["data"]["meta"]["tiers"]["1,0"];
                break;
        }
        disc /= f;
    }
    return disc * (this.osPerHour() + this.instancePerHour() +
        this.localSSDPerHour() + cud * this.GPUPerHour());
}

function osHourly() {
    if (this.osType === "") {
        return 0;
    }
    if (this.instanceType["cores"] == "shared") {
        return pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-OS"][this.osType]["low"];
    } else if (pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-OS"][this.osType]["cores"] == "shared") {
        var rate = "high";
    } else if (pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-OS"][this.osType]["cores"] > this.instanceType["cores"]) {
        var rate = "high";
    } else {
        var rate = "low";
    }
    if (pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-OS"][this.osType]["percore"]) {
        return pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-OS"][this.osType][rate] * this.instanceType["cores"];
    } else {
        return pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-OS"][this.osType][rate];
    }
}

function instanceHourly() {
    if (this.committedUsage != "0") {
        return pricelist["data"][0]["data"]["services"]["CP-CUD-" + this.committedUsage + "-CPU"]["locales"][currentCanvas.region] * this.instanceType["cores"] +
            pricelist["data"][0]["data"]["services"]["CP-CUD-" + this.committedUsage + "-RAM"]["locales"][currentCanvas.region] * this.instanceType["memory"];
    } else if (this.type == "custom") {
        if (this.preemptible) {
            var pre = "-PREEMPTIBLE";
        } else {
            var pre = "";
        }
        if (this.instanceType["memory"] > this.instanceType["cores"] * 6.5) {
            return pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-CUSTOM-VM-CORE" + pre]["locales"][currentCanvas.region] * this.instanceType["cores"] +
                (this.instanceType["memory"] - this.instanceType["cores"] * 6.5) * pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-CUSTOM-VM-EXTENDED-RAM" + pre]["locales"][currentCanvas.region] +
                this.instanceType["cores"] * 6.5 * pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-CUSTOM-VM-RAM" + pre]["locales"][currentCanvas.region];
        } else {
            return pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-CUSTOM-VM-CORE" + pre]["locales"][currentCanvas.region] * this.instanceType["cores"] +
                this.instanceType["memory"] * 6.5 * pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-CUSTOM-VM-RAM" + pre]["locales"][currentCanvas.region];
        }
    } else {
        if (this.preemptible === true) {
            return pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-VMIMAGE-" + this.type + "-PREEMPTIBLE"]["locales"][currentCanvas.region];
        }
        return pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-VMIMAGE-" + this.type]["locales"][currentCanvas.region];

    }
}

function localSSDHourly() {
    if (this.preemptible === true) {
        return this.localSSDSize * pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-LOCAL-SSD-PREEMPTIBLE"]["locales"][currentCanvas.region];
    } else {
        return this.localSSDSize * pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-LOCAL-SSD"]["locales"][currentCanvas.region];
    }
}

function GPUHourly() {
    if (this.GPUType === "") {
        return 0;
    }
    if (parseFloat(pricelist["data"][0]["data"]["services"]["GPU_" + this.GPUType + "-PREEMPTIBLE"]["locales"][currentCanvas.region]) == parseFloat(0.00)) {
        return NaN;
    }
    if (this.preemptible === true) {
        return this.numGPU * pricelist["data"][0]["data"]["services"]["GPU_" + this.GPUType + "-PREEMPTIBLE"]["locales"][currentCanvas.region];
    } else if (this.numGPU != 0) {
        return this.numGPU * pricelist["data"][0]["data"]["services"]["GPU_" + this.GPUType]["locales"][currentCanvas.region];
    }
    return 0;
}

function PDHourly() {
    return (this.PDSSDSize * pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-STORAGE-PD-SSD"]["locales"][currentCanvas.region] +
        this.PDSize * pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-STORAGE-PD-CAPACITY"]["locales"][currentCanvas.region] +
        this.PDSnapshot * pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-STORAGE-PD-SNAPSHOT"]["locales"][currentCanvas.region]) *
        12 / 365 / 24;
}

function LBHourly() {
    if (this.rules == 0) {
        return 0;
    }
    if (this.rules > 5) {
        return pricelist["FORWARDING_RULE_CHARGE_BASE"]["locales"][currentCanvas.region] +
            pricelist["FORWARDING_RULE_CHARGE_EXTRA"]["locales"][currentCanvas.region] * (this.rules - 5);
    } else if (this.rules != 0) {
        return pricelist["FORWARDING_RULE_CHARGE_BASE"]["locales"][currentCanvas.region];
    }
    return 0;
}

function TPUHourly() {
    return this.numTPU * this.TPUHours / 24 * pricelist["data"][0]["data"]["services"]["CP-CLOUD-TPU"]["locales"]["us-central1"];
}

function storageCostHourly() {
    return ((pricelist["data"][0]["data"]["services"]["CP-BIGSTORE-STORAGE-MULTI_REGIONAL"]["locales"][currentCanvas.region] * this.multiRegional +
        pricelist["data"][0]["data"]["services"]["CP-BIGSTORE-STORAGE-REGIONAL"]["locales"][currentCanvas.region] * this.regional +
        pricelist["data"][0]["data"]["services"]["CP-BIGSTORE-STORAGE-NEARLINE"]["locales"][currentCanvas.region] * this.nearline +
        pricelist["data"][0]["data"]["services"]["CP-BIGSTORE-STORAGE-COLDLINE"]["locales"][currentCanvas.region] * this.coldline +
        100 * this.classAOps * pricelist["data"][0]["data"]["services"]["CP-BIGSTORE-CLASS-A-REQUEST"]["locales"][currentCanvas.region] +
        100 * this.classBOps * pricelist["data"][0]["data"]["services"]["CP-BIGSTORE-CLASS-B-REQUEST"]["locales"][currentCanvas.region]) * 12 / 365 / 24) * this.nrInstances;
}

function storageCostDaily() {
    return this.costHour() * 24;
}

function storageCostMonthly() {
    return this.costHour() * 24 * (365 / 12);
}

function storageCostYearly() {
    return this.costHour() * 24 * 365;
}


function dataStoreCostHourly() {

    var cost = 0;
    cost += (this.dataReads) * pricelist["data"][0]["data"]["services"]["CP-CLOUD-DATASTORE-ENTITY-READ"]["locales"]["us"];
    cost += (this.dataWrites) * pricelist["data"][0]["data"]["services"]["CP-CLOUD-DATASTORE-ENTITY-WRITE"]["locales"]["us"];
    cost += (this.dataDeletes) * pricelist["data"][0]["data"]["services"]["CP-CLOUD-DATASTORE-ENTITY-DELETE"]["locales"]["us"];
    cost += (this.dataSize) * pricelist["data"][0]["data"]["services"]["CP-CLOUD-DATASTORE-INSTANCES"]["locales"]["us"];
    return (cost * 12 / 365 / 24) * this.nrInstances;

}

function dataStoreCostDaily() {
    return this.costHour() * 24;
}

function dataStoreCostMonthly() {
    return this.costHour() * 24 * (365 / 12);
}

function dataStoreCostYearly() {
    return this.costHour() * 24 * 365
}