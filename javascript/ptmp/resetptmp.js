// This javascript file has the function which will reset the ptmp page
function resetptmp() {
  // restting the form for the ptmp page
  $("#resetPTMPPage").trigger("reset");

  //   removing sector if present
  if (sectorPolyline != undefined) {
    //   deleting sector
    sectorPolyline.setMap(null);
    reportsectorPolyline.setMap(null);
  }

  // removing all polylines polyline array starts from index 1
  for (let i = 1; i < polyLine.length; i++) {
    polyLine[i].setMap(null);
    reportPolyline[i].setMap(null);
  }

  //   removing all the Markers from the Map Master index-0 Slave index-1 to whatever
  for (let i = 0; i <= marker.length; i++) {
    if (marker[i] != undefined) {
      marker[i].setMap(null);
      reportmarker[i].setMap(null);
    }
  }
  // again centering the map as when it was when the country was selected
  map.setCenter({
    lat: parseFloat(eirparray[9]),
    lng: parseFloat(eirparray[10]),
  });
  map.setZoom(12);
  // reportMap.setCenter({
  //   lat: parseFloat(eirparray[9]),
  //   lng: parseFloat(eirparray[10]),
  // });
  reportMap.setZoom(12);
  // deleting the table for Master which is hidden
  var numOfCol = $("#masterTable tr:nth-child(1) th").length;
  if (numOfCol > 1) {
    $("#masterTable tr").each(function () {
      for (let i = 1; i < numOfCol; i++) {
        console.log("Deleted columns");
        this.cells[1].remove();

        // Removing columns of Slaves in Installation Report
        $(`#slave${i}Row1`).remove();
        $(`#slave${i}Row2`).remove();
      }
    });

    //   emptying the slave container and the report divs
    $("#slaveCoordSection").html("");
    $("#slavesInput").html("");
    // deactivating the report button
    $("#reportButton").prop("disabled", true);
    // disabling the add slave button
    $(`#addSlaveButton`).prop("disabled", true);

    //   get the lost data
    // frequency table
    createFreq(frequencyarray);
    // eirp value
    eirpcalculate();
    // gain value
  }
}

// restting the form for the ptmp page
function resetcountry() {
  $("#resetPTMPPage").trigger("reset");

  //   removing sector if present
  if (sectorPolyline != undefined) {
    //   deleting sector
    sectorPolyline.setMap(null);
  }

  // removing all polylines polyline array starts from index 1
  for (let i = 1; i < polyLine.length; i++) {
    polyLine[i].setMap(null);
  }
  // deleting the table for Master which is hidden
  var numOfCol = $("#masterTable tr:nth-child(1) th").length;
  if (numOfCol > 1) {
    $("#masterTable tr").each(function () {
      for (let i = 1; i < numOfCol; i++) {
        console.log("Deleted columns");
        this.cells[1].remove();
      }
    });

    //   removing all the Markers from the Map Master index-0 Slave index-1 to whatever
    for (let i = 0; i <= numOfCol; i++) {
      if (marker[i] != undefined) {
        marker[i].setMap(null);
      }
      // Removing columns of Slaves in Installation Report
      $(`#slave${i}Row1`).remove();
      $(`#slave${i}Row2`).remove();
    }

    //   emptying the slave container and the report divs
    $("#slaveCoordSection").html("");
    $("#slavesInput").html("");
    // deactivating the report button
    $("#reportButton").prop("disabled", true);
  }
}
