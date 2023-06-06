// this javascript file contains the code to create one more slave when already a number of slaves are created.

function checkCurrentSlaveCount() {
  // window.alert("i am read");
  /*this function will check the current number of slaves in the program 
    and will update that number by 1 to create another slave with index = current slaves + 1*/
  var numOfSlaves = $(`#numberOfSlaves`).val();
  if (numOfSlaves <= 11) {
    var updatedIndex = parseFloat(numOfSlaves) + 1;
    $(`#numberOfSlaves`).val(updatedIndex);
    console.log("number of slaves now are:", updatedIndex);
    createCoordFieldForSlave(updatedIndex);
  } else {
    window.alert("Cannot add another Slave.");
  }
}

function createCoordFieldForSlave(index) {
  var coordContainer = $("#slaveCoordSection");
  var item = $("<div>", { class: "col-4 sidebar-padding" });
  coordContainer.append(item);
  // label for coord field
  coordlabel = $("<label>", { class: "label", html: `Slave${index}` });
  // input field foir the coordinate
  coordinput = $("<input>", {
    type: "text",
    id: `slave${index}Co-ordinate`,
    placeholder: "lat,long",
    name: `slave${index}`,
    class: "input",
  });
  ddcoordinput = $("<input>", {
    id: `slave${index}DDCoord`,
    class: "input",
    type: "hidden",
  });
  item.append(coordlabel, coordinput, ddcoordinput);
  // calling function which will create parameter fields
  createSlavesField(index);
  //   creating additional fields in MAster table
  addInMasterTableAfterAdditionalSlave(index);

  // event listener on newly created slave coordinate field
  $(`#slave${index}Co-ordinate`).change(function () {
    if (this.value.includes(",")) {
      var coordSlave = this.value.split(",");
      if (coordSlave[1] != "") {
        var [lat, long] = coordSlave;

        /*checking whether this field already had some data and a corresponding Marker to it
            if yes - we set Marker to null to be able to remove the last Marker and place a new one*/
        if (marker[index] != undefined) {
          marker[index].setMap(null);
          polyLine[index].setMap(null);
          reportmarker[index].setMap(null);
          reportPolyline[index].setMap(null);
        }
        // function which will check the format dms/dd of the coordinates
        checkSlaveFormat(lat, long, index);

        // checking whether lat long are in the lat long bounds for the country
        // checkSlaveBounds(lat, long, i);
      }
    }
  });
}
