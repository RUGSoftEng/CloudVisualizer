/** This file contains everything related to the canvas part of the project*/
/** Memory sizes for the database and storage filters */
var memorySize = [0, 50, 100, 200, 300, 400, 500, 750, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7500, 10000, 20000, 30000, 40000, 50000, 75000, 100000, 200000, 500000, 750000];

/** Function that checks if a to be added object already exists.
 Returns the unique identifier of an object if it is the same
 If a similar object does not exist, it returns -1
 */
function newObjectExists(newObject, objectList) {
    // Get all object names of the given object
    var aProps = Object.getOwnPropertyNames(newObject);
    // Loop over each object in the given list
    for (var i = 0; i < objectList.length; i++) {
        var stop = false;
        // Get all object names of this object
        var bProps = Object.getOwnPropertyNames(objectList[i]);

        // If the number of properties is different, the objects are different
        if (aProps.length != bProps.length) {
            stop = true;
        }
        // Loop over all properties to see if they are different
        for (var j = 0; i < aProps.length; j++) {
            var propName = aProps[j];
            // Last comparable property is the number of instances
            if (propName == "nrInstances") {
                break;
            }
            // If we find one property that is not the same, we stop
            if (newObject[propName] !== objectList[i][propName]) {
                stop = true;
            }
            if (stop) {
                break;
            }
        }
        // If stop is still false, this object is the same. We return the unique identifier of this object.
        if (!stop) {
            return objectList[i].numId;
        }
    }
    // No object was found with the same properties as the given object
    return -1;
}

/** A basic virtual machine */
function createBasicVirtualMachine(nrInstances, days, hours) {
    var newVM = new VirtualMachine();
    newVM.nrInstances = nrInstances;
    newVM.days = days;
    newVM.hours = hours;
    // Only for google we want to determine the instance type
    if (service == 'google-cloud') {
        newVM.instanceType = determineInstanceType(newVM.type);
    }
    return newVM;
}

/** A basic database */
function createBasicDatabase(nrInstances, size) {
    var newDatabase = new Database();
    newDatabase.dataSize = size;
    newDatabase.nrInstances = nrInstances;
    return newDatabase;
}

/** A basic storage */
function createBasicStorage(nrInstances, multiRegionalSize, regionalSize, nearlineSize, coldlineSize) {
    var newStorage = new Storage();
    newStorage.nrInstances = nrInstances;
    newStorage.multiRegional = multiRegionalSize;
    newStorage.regional = regionalSize;
    newStorage.nearline = nearlineSize;
    newStorage.coldline = coldlineSize;
    return newStorage;
}

/** Function to process the new dropped Virtual machine */
function addVirtualMachine(newVM) {
    //Will contain the unique identifier of the duplicate virtual machine if it exists, else -1
    var newVMID = newObjectExists(newVM, currentCanvas.VirtualMachines);
    if (newVMID != -1) {
        // Find the index of the existing object
        var newVMIndex = getObjectById(newVMID, currentCanvas.VirtualMachines);
        //Increments the duplicate with the number of to be added instances
        incrementNrInstances(newVMIndex, newVM.nrInstances, currentCanvas.VirtualMachines);
        //Updates the HTML in the canvas
        changeHTML(newVMIndex, currentCanvas.VirtualMachines, "vm", newVMID);
        checkIcon(currentCanvas.VirtualMachines, "vm", newVMIndex);
    } else {
        //Adds new virtual machine to the canvas
        newVM.numId = currentCanvas.idCounter++;
        currentCanvas.VirtualMachines.push(newVM);
        //Adds HTML for the new VM to the canvas
        addHTML(newVM.nrInstances, "vm", newVM.numId, currentCanvas.VirtualMachines);
        checkIcon(currentCanvas.VirtualMachines, "vm", currentCanvas.VirtualMachines.length - 1);
    }
}

/** Function to process the new dropped Database */
function addDatabase(newDB) {
    //Will contain the unique identifier of the duplicate database if it exists, else -1
    var newDBID = newObjectExists(newDB, currentCanvas.Databases);
    if (newDBID != -1) {
        // Find the index of the existing object
        var newDBIndex = getObjectById(newDBID, currentCanvas.Databases);
        //Increments the duplicate with the number of to be added instances
        incrementNrInstances(newDBIndex, newDB.nrInstances, currentCanvas.Databases);
        //Updates the HTML in the canvas
        changeHTML(newDBIndex, currentCanvas.Databases, "db", newDBID);
        checkIcon(currentCanvas.Databases, "db", newDBIndex);
    } else {
        //Adds new database to the canvas
        newDB.numId = currentCanvas.idCounter++;
        currentCanvas.Databases.push(newDB);
        //Adds HTML for the new database to the canvas
        addHTML(newDB.nrInstances, "db", newDB.numId, currentCanvas.Databases);
        checkIcon(currentCanvas.Databases, "db", currentCanvas.Databases.length - 1);
    }
}

/** Function to process the new dropped Storage */
function addStorage(newStorage) {
    //Will contain the unique identifier of the duplicate storage if it exists, else -1
    var newStorageID = newObjectExists(newStorage, currentCanvas.Storages);
    if (newStorageID != -1) {
        // Find the index of the existing object
        var newStorageIndex = getObjectById(newStorageID, currentCanvas.Storages);
        // Increments the duplicate with the number of to be added instances
        incrementNrInstances(newStorageIndex, newStorage.nrInstances, currentCanvas.Storages);
        // Updates the HTML in the canvas
        changeHTML(newStorageIndex, currentCanvas.Storages, "cs", newStorageID);
        checkIcon(currentCanvas.Storages, "cs", newStorageIndex);
    } else {
        // Adds new storage to the canvas
        newStorage.numId = currentCanvas.idCounter++;
        currentCanvas.Storages.push(newStorage);
        //Adds HTML for the new storage to the canvas
        addHTML(newStorage.nrInstances, "cs", newStorage.numId, currentCanvas.Storages);
        checkIcon(currentCanvas.Storages, "cs", currentCanvas.Storages.length - 1);
    }
}

/** Function to find the index of an object, in a list, by its unique identifier property*/
function getObjectById(id, listOfObjects) {
    for (var i = 0; i < listOfObjects.length; i++) {
        if (listOfObjects[i].numId == id) {
            return i;
        }
    }
    // Object couldn't be found
    console.error("Shouldn't reach here!");
    return null;
}

/** Function to reset a previous saved canvas */
function resetCanvas(canvasID) {
    // Clear all the items currently in the canvas
    clearBox('itemsvm', 'itemsst', 'itemsdb');
    // We use a copy to avoid problems
    currentCanvas = copyCanvas(listOfCanvasses[getObjectById(canvasID, listOfCanvasses)]);
    // If the service of the canvas is different, we reload the page to the right provider
    if (service != currentCanvas.service) {
        service = currentCanvas.service;
        localStorage.setItem('curCanvas', JSON.stringify(currentCanvas));
        localStorage.setItem('provider', service);
        location.reload();
    } else {
        document.getElementById("selectRegionID").value = currentCanvas.region;
    }

    // Loop over all virtual machines and add them to the canvas
    for (var i = 0; i < currentCanvas.VirtualMachines.length; i++) {
        var VM = currentCanvas.VirtualMachines[i];
        addHTML(VM.nrInstances, "vm", VM.numId, currentCanvas.VirtualMachines);
        checkIcon(currentCanvas.VirtualMachines, "vm", i);
    }
    // Loop over all databases and add them to the canvas
    for (var i = 0; i < currentCanvas.Databases.length; i++) {
        var DB = currentCanvas.Databases[i];
        addHTML(DB.nrInstances, "db", DB.numId, currentCanvas.Databases);
        checkIcon(currentCanvas.Databases, "db", i);
    }
    // Loop over all storages and add them to the canvas
    for (var i = 0; i < currentCanvas.Storages.length; i++) {
        var storage = currentCanvas.Storages[i];
        addHTML(storage.nrInstances, "cs", storage.numId, currentCanvas.Storages);
        checkIcon(currentCanvas.Storages, "cs", i);
    }
    document.getElementById("selectRegionID").value = currentCanvas.region;
    // Disable all regions that can't be used with the current objects in the canvas
    disableRegions();
    // TODO also change accordion

}

/** Remove a canvas from the list of canvasses/calculations */
function removeCanvas(canvasID) {
    var divId = "#canvas_" + canvasID;
    $(divId).remove();

    // Remove from main graph
    removeCalculationMainGraph(listOfCanvasses[getObjectById(canvasID, listOfCanvasses)].timestamp);
    // Remove from list of canvasses
    listOfCanvasses.splice(getObjectById(canvasID, listOfCanvasses), 1);
    // Remove from storage
    localStorage.setItem('listOfCanvasses', JSON.stringify(listOfCanvasses));
    // Remove graph if it is empty
    if (listOfCanvasses.length == 0) {
        document.getElementById("mainGraph").style.display = "none";
    }
    isOverflown();
}

/** Function to handle changing variables based upon input in settings window */
function attachVariable(variableName, variableObject) {
    var input;
    if (variableName === "nrInstances") {
        if (variableObject.objectName === "VirtualMachine") {
            input = document.getElementById(variableName);
        } else if (variableObject.objectName === "Storage") {
            input = document.getElementById(variableName + "Storage");
        } else {
            input = document.getElementById(variableName + "DB");
        }
    } else {
        input = document.getElementById(variableName);
    }
    if (variableName === "type" && input.options.length === 0) {
        var keys = Object.getOwnPropertyNames(pricelist["data"][0]["data"]["services"]);
        switch (service) {
            case "google-cloud":
                for (var i = 0; i < keys.length; i++) {
                    var typeName = (keys[i]).replace("CP-COMPUTEENGINE-VMIMAGE-", "");
                    if (keys[i] !== typeName && (keys[i]).match("PREEMPTIBLE") === null) {
                        var option = document.createElement("option");
                        option.text = typeName + " vCPUs: " + pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-VMIMAGE-" + typeName]["properties"]["cores"] + " RAM: " + pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-VMIMAGE-" + typeName]["properties"]["memory"] + " GB";
                        option.value = typeName;
                        input.add(option);
                    }
                }
                break;
            case "microsoft-azure":
                for (var i = 0; i < keys.length; i++) {
                    var typeName = (keys[i]).replace(" SQL Server Web", "");
                    if (Object.getOwnPropertyNames(pricelist["data"][0]["data"]["services"][keys[i]]).length != 0) {
                        var option = document.createElement("option");
                        option.text = typeName;
                        option.value = typeName;
                        input.add(option);
                    }
                }
                break;
            case "amazon-webservices":
                for (var i = 0; i < keys.length; i++) {
                    var typeName = (keys[i]).replace("-" + "Linux", "");
                    if (keys[i] !== typeName) {
                        var option = document.createElement("option");
                        option.text = typeName + " vCPUs: " + pricelist["data"][0]["data"]["services"][typeName + "-" + variableObject["osType"]]["properties"]["vCPU"] + " RAM: " + pricelist["data"][0]["data"]["services"][typeName + "-" + variableObject["osType"]]["properties"]["Memory (GiB)"] + " GB";
                        option.value = typeName;
                        input.add(option);
                    }
                }
                break;
        }
    }
    // Initiate the appropriate graph
    if (variableObject instanceof VirtualMachine) {
        initPopupGraphVM(variableObject);
    } else if (variableObject instanceof Storage) {
        initPopupGraphCS(variableObject);
    } else if (variableObject instanceof Database) {
        initPopupGraphDB(variableObject);
    } else {
        console.error("instance of object on the canvas is not right");
    }

    if (input != null) {
        input.value = variableObject[variableName];
        input.onchange = function() {
            if (variableName === "type" || variableName === "osType" || variableName === "GPUType" || variableName === "committedUsage") {
                variableObject[variableName] = this.value;
            } else if (variableName === "preemptible") {
                variableObject[variableName] = (this.value === "true")
            } else if (variableName == "days") {
                // Maximum number of days is 7 and minimum 1
                if (parseInt(this.value) > 7) {
                    variableObject[variableName] = 7;
                    this.value = 7;
                } else if (parseInt(this.value) < 1) {
                    variableObject[variableName] = 1;
                    this.value = 1;
                } else {
                    variableObject[variableName] = parseInt(this.value);
                }
            } else if (variableName == "hours") {
                // Maximum number of hours is 24 and minimum 1
                if (parseInt(this.value) > 24) {
                    variableObject[variableName] = 24;
                    this.value = 24;
                } else if (parseInt(this.value) < 1) {
                    variableObject[variableName] = 1;
                    this.value = 1;
                } else {
                    variableObject[variableName] = parseInt(this.value);
                }
            } else {
                variableObject[variableName] = parseInt(this.value);
            }
            if (variableName === "type") {
                if (service === 'google-cloud') {
                    variableObject.instanceType = determineInstanceType(variableObject.type);

                    if (pricelist["data"][0]["data"]["services"]["CP-COMPUTEENGINE-VMIMAGE-" + input.value]["properties"]["cores"] === "shared") {
                        variableObject.committedUsage = "0"
                        document.getElementById("committedUsage").disabled = true;
                        document.getElementById("committedUsage").value = "0";
                    } else {
                        document.getElementById("committedUsage").disabled = false;
                    }

                }
            }
            // Update graph based on new settings
            if (variableObject instanceof VirtualMachine) {
                updatePopupGraphVM(variableObject);
            } else if (variableObject instanceof Storage) {
                updatePopupGraphCS(variableObject);
            } else if (variableObject instanceof Database) {
                updatePopupGraphDB(variableObject);
            } else {
                console.error("instance of object on the canvas is not right");
            }
            //Make sure no option can be selected that would break the calculations by disabling them.
            disableInvalid(variableObject);
        }
    }
}

/** Function to disable all variables that are not valid for a specific configuration */
function disableInvalid(objectToEdit) {
    for (var property in objectToEdit) {
        if (objectToEdit.hasOwnProperty(property)) {
            list = document.getElementById(property);
            if (list != null && list.nodeName === "SELECT") {
                prev = objectToEdit[property];
                for (var i = list.options.length - 1; i >= 0; i--) {
                    objectToEdit[property] = list.options[i].value;
                    try {
                        if (isNaN(objectToEdit.costMonthly())) throw "invalid"
                        list.options[i].disabled = false;
                    } catch (err) {
                        list.options[i].disabled = true;
                    }
                }
                objectToEdit[property] = prev;
            }
        }
    }
}

/** Function to disable all regions that are not valid for the objects currently in the canvas */
function disableRegions() {
    list = document.getElementById("selectRegionID");
    prev = currentCanvas.region;
    for (var i = list.options.length - 1; i >= 0; i--) {
        currentCanvas.region = list.options[i].value;
        try {
            // If it results in a NaN we don't want to use that region
            if (isNaN(simpleCalc())) throw "invalid"
            list.options[i].disabled = false;
        } catch (err) {
            list.options[i].disabled = true;
        }
    }
    currentCanvas.region = prev;

}

/** Function that does a simple price calculation on the objects currently in the canvas*/
function simpleCalc() {
    var monthPrice = 0;
    var yearPrice = 0;
    for (var i in currentCanvas.VirtualMachines) {
        if (service == 'google-cloud') {
            currentCanvas.VirtualMachines[i].instanceType = determineInstanceType(currentCanvas.VirtualMachines[i].type);
        }
        monthPrice += currentCanvas.VirtualMachines[i].costMonthly();
        yearPrice += currentCanvas.VirtualMachines[i].costYear();
    }
    for (var i in currentCanvas.Databases) {
        monthPrice += currentCanvas.Databases[i].costMonthly();
        yearPrice += currentCanvas.Databases[i].costYear();
    }
    for (var i in currentCanvas.Storages) {
        monthPrice += currentCanvas.Storages[i].costMonthly();
        yearPrice += currentCanvas.Storages[i].costYear();
    }
    return monthPrice;
}

/** Function to open the popup of an object*/
function openPopup(objectToEdit) {
    //Insert code that shows the html of the popup
    for (var property in objectToEdit) {
        if (objectToEdit.hasOwnProperty(property)) {
            attachVariable(property, objectToEdit);
        }
    }
    disableInvalid(objectToEdit);
}


/** We have a basic HTML structure, where we fill in the details for each Object */
function addHTML(par3, id, uniqueIdentifier, listOfObjects) {
    var objectHTML = "<div id='" + id + "_" + uniqueIdentifier + "' class='icons'><img src='images/" + id + ".png'><p>" + par3 + "</p> <a href='#' onclick='removeIcon(\"" + id + "\", \"" + uniqueIdentifier + "\", \"" + listOfObjects + "\");'><span class='glyphicon glyphicon-trash'></span></a><a href='#' data-toggle='modal' data-target='#" + id + "Settings'	onclick='showSettings(\"" + id + "\", " + uniqueIdentifier + ");'> <span class='glyphicon glyphicon-wrench'></span> </a></div>";
    // Virtual machine
    if (id === "vm")
        $("#itemsvm").append(objectHTML);
    // Database
    else if (id === "db")
        $("#itemsdb").append(objectHTML);
    // Storage
    else {
        $("#itemsst").append(objectHTML);
    }

}

/** Function to update the html of an object.
 *  We use the unique identifier of the object, incorporated in the html, to easily edit it */
function changeHTML(index, listOfObjects, id, uniqueIdentifier) {
    var curObject = listOfObjects[index];
    $("#" + id + "_" + uniqueIdentifier + " p").text(curObject.nrInstances);
}

/** Function to change the image of an object*/
function changeImage(id, image, uniqueIdentifier) {
    var divId = id + "_" + uniqueIdentifier;
    document.getElementById(divId).getElementsByTagName('img')[0].src = image;
}

/** Function that checks the number of instances of an object
 *  And then possibly changes it */
function checkIcon(listOfObjects, id, index) {

    if (listOfObjects[index].nrInstances > 1) {
        changeImage(id, "images/multiple" + id + ".png", listOfObjects[index].numId);
    } else {
        changeImage(id, "images/" + id + ".png", listOfObjects[index].numId);
    }
}

/** Function to increment the number of instances of an object*/
function incrementNrInstances(index, incr, listOfObjects) {
    var curObject = listOfObjects[index];
    curObject.nrInstances = curObject.nrInstances + incr;
}

/** Allow drop of object on canvas */
function allowDrop(ev) {
    ev.preventDefault();
}

/** Function to initialize a virtual machine when being dragged */
function dragVM(ev) {
    jQuery.event.props.push('dataTransfer');
    var newVM = createBasicVirtualMachine(parseInt(nrInstancesVM.innerHTML), parseInt(days.innerHTML), parseInt(hours.innerHTML));
    var j = JSON.stringify(newVM);
    ev.dataTransfer.setData("foo", j);
}

/** Function to initialize a database when being dragged */
function dragDatabase(ev) {
    jQuery.event.props.push('dataTransfer');
    var DBSizeSlider = document.getElementById("DBGBSliderID");
    var newDB = createBasicDatabase(parseInt(nrInstancesDB.innerHTML), memorySize[DBSizeSlider.value]);
    var j = JSON.stringify(newDB);
    ev.dataTransfer.setData("foo", j);
}

/** Function to initialize a storage when being dragged */
function dragStorage(ev) {
    jQuery.event.props.push('dataTransfer');
    var multiRegSlider = document.getElementById("multiRegionalStorageSliderID");
    var regSlider = document.getElementById("regionalStorageSliderID");
    var nearlineSlider = document.getElementById("nearlineStorageSliderID");
    var coldlineSlider = document.getElementById("coldlineStorageSliderID");
    var newStorage = createBasicStorage(parseInt(nrInstancesStorage.innerHTML), memorySize[multiRegSlider.value], memorySize[regSlider.value], memorySize[nearlineSlider.value], memorySize[coldlineSlider.value]);
    var j = JSON.stringify(newStorage);
    ev.dataTransfer.setData("foo", j);
}

/** Function to drop and add an object to the canvas */
function drop(ev) {
    ev.preventDefault();
    var obj = JSON.parse(ev.dataTransfer.getData("foo"));
    if (obj.objectName === "VirtualMachine") {
        var instance = Object.assign(new VirtualMachine(), obj);
        addVirtualMachine(instance);
    }
    if (obj.objectName === "Database") {
        var instance = Object.assign(new Database(), obj);
        addDatabase(instance);
    }
    if (obj.objectName === "Storage") {
        var instance = Object.assign(new Storage(), obj);
        addStorage(instance);
    }
    disableRegions();
}

/** Function that deletes every item currently in the canvas and resets the current canvas*/
function clearBox(elementID1, elementID2, elementID3) {
    document.getElementById(elementID1).innerHTML = "";
    document.getElementById(elementID2).innerHTML = "";
    document.getElementById(elementID3).innerHTML = "";
    currentCanvas = new Canvas();
    disableRegions();
}

/** Function to remove the html code of an object from the canvas */
function removeIcon(elementID, uniqueIdentifier) {
    var divId = "#" + elementID + "_" + uniqueIdentifier;
    $(divId).remove();
    var index;
    if (elementID == "vm") {
        index = getObjectById(uniqueIdentifier, currentCanvas.VirtualMachines);
        currentCanvas.VirtualMachines.splice(index, 1);
        // Enable/disable regions for current canvas
        disableRegions();
        return;
    }
    if (elementID == "db") {
        index = getObjectById(uniqueIdentifier, currentCanvas.Databases);
        currentCanvas.Databases.splice(index, 1);
        // Enable/disable regions for current canvas
        disableRegions();
        return;
    }
    if (elementID == "cs") {
        index = getObjectById(uniqueIdentifier, currentCanvas.Storages);
        currentCanvas.Storages.splice(index, 1);
        // Enable/disable regions for current canvas
        disableRegions();
        return;
    }
    console.error("Error removing icon");
}

/** Function that returns a copy of the given canvas */
function copyCanvas(canvas) {
    var listVirtualMachines = [];
    var listDatabases = [];
    var listStorages = [];
    var newCanvas = new Canvas();
    for (var i = 0; i < canvas.VirtualMachines.length; i++) {
        listVirtualMachines.push(Object.assign(new VirtualMachine(), canvas.VirtualMachines[i]));
    }
    for (var i = 0; i < canvas.Databases.length; i++) {
        listDatabases.push(Object.assign(new Database(), canvas.Databases[i]));
    }
    for (var i = 0; i < canvas.Storages.length; i++) {
        listStorages.push(Object.assign(new Storage(), canvas.Storages[i]));
    }
    // Copying all properties
    newCanvas.idCounter = canvas.idCounter;
    newCanvas.numId = canvas.numId;
    newCanvas.service = canvas.service;
    newCanvas.timestamp = canvas.timestamp;
    newCanvas.description = canvas.description;
    newCanvas.monthlyPrice = canvas.monthlyPrice;
    newCanvas.yearlyPrice = canvas.yearlyPrice;
    newCanvas.VirtualMachines = listVirtualMachines;
    newCanvas.Databases = listDatabases;
    newCanvas.Storages = listStorages;
    newCanvas.region = canvas.region;
    newCanvas.regionTitle = canvas.regionTitle;
    return newCanvas;
}

/** Function to show the properties for an object in the settings popup */
function showSettings(id, uniqueIdentifier) {
    var current, copy, index;
    if (id == "vm") {
        index = getObjectById(uniqueIdentifier, currentCanvas.VirtualMachines);
        current = currentCanvas.VirtualMachines[index];
        copy = Object.assign(new VirtualMachine(), current);

        openPopup(copy);
        // To avoid multiple functions we unbind
        $('#vmSettings').find('#save-modal').unbind("click");
        $('#vmSettings').find('#save-modal').click(function() {
            var newVMID = newObjectExists(copy, currentCanvas.VirtualMachines);
            if (newVMID != -1 && newVMID != uniqueIdentifier) {
                var newVMIndex = getObjectById(newVMID, currentCanvas.VirtualMachines);
                incrementNrInstances(newVMIndex, copy.nrInstances, currentCanvas.VirtualMachines);
                changeHTML(newVMIndex, currentCanvas.VirtualMachines, id, newVMID);
                checkIcon(currentCanvas.VirtualMachines, id, newVMIndex);
                removeIcon(id, uniqueIdentifier);
            } else {
                currentCanvas.VirtualMachines[index] = copy;
                changeHTML(index, currentCanvas.VirtualMachines, id, uniqueIdentifier);
                checkIcon(currentCanvas.VirtualMachines, id, index);
                disableRegions();
            }
        });

        if (service == 'google-cloud') {
            copy.instanceType = determineInstanceType(copy.type);
        }
        // After editing we update the graph
        updatePopupGraphVM(copy);
        return;
    }
    if (id == "db") {
        index = getObjectById(uniqueIdentifier, currentCanvas.Databases);
        current = currentCanvas.Databases[index];
        copy = Object.assign(new Database(), current);

        openPopup(copy);
        // To avoid multiple functions we unbind
        $('#dbSettings').find('#save-modal').unbind("click");
        $('#dbSettings').find('#save-modal').click(function() {
            var newDBID = newObjectExists(copy, currentCanvas.Databases);
            if (newDBID != -1 && newDBID != uniqueIdentifier) {
                var newDBIndex = getObjectById(newDBID, currentCanvas.Databases);
                incrementNrInstances(newDBIndex, copy.nrInstances, currentCanvas.Databases);
                changeHTML(newDBIndex, currentCanvas.Databases, id, newDBID);
                checkIcon(currentCanvas.Databases, id, newDBIndex);
                removeIcon(id, uniqueIdentifier);
            } else {
                currentCanvas.Databases[index] = copy;
                changeHTML(index, currentCanvas.Databases, id, uniqueIdentifier);
                checkIcon(currentCanvas.Databases, id, index);
            }
        });
        // After editing we update the graph
        updatePopupGraphDB(copy);
        return;
    }
    if (id == "cs") {
        index = getObjectById(uniqueIdentifier, currentCanvas.Storages);
        current = currentCanvas.Storages[index];
        copy = Object.assign(new Storage(), current);
        openPopup(copy);
        // To avoid multiple functions we unbind
        $('#csSettings').find('#save-modal').unbind("click");
        $('#csSettings').find('#save-modal').click(function() {
            var newStorageID = newObjectExists(copy, currentCanvas.Storages);
            if (newStorageID != -1 && newStorageID != uniqueIdentifier) {
                var newStorageIndex = getObjectById(newStorageID, currentCanvas.Storages);
                incrementNrInstances(newStorageIndex, copy.nrInstances, currentCanvas.Storages);
                changeHTML(newStorageIndex, currentCanvas.Storages, id, newStorageID);
                checkIcon(currentCanvas.Storages, id, newStorageIndex);
                removeIcon(id, uniqueIdentifier);
            } else {
                currentCanvas.Storages[index] = copy;
                changeHTML(index, currentCanvas.Storages, id, uniqueIdentifier);
                checkIcon(currentCanvas.Storages, id, index);
            }
        });
        // After editing we update the graph
        updatePopupGraphCS(copy);
        return;
    }
    console.error("Error showing settings, not allowed to reach here");
}