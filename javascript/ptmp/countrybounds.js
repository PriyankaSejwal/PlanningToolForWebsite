/* this javascript file contains functions whihc check whether a latitude longitude
 entered belongs to the country selected or not*/
function checkSlaveBounds(lat, long, i) {
  console.log(eirparray[7], eirparray[8]);
  var minLat = parseFloat(eirparray[5]);
  var maxLat = parseFloat(eirparray[6]);
  var minLong = parseFloat(eirparray[7]);
  var maxLong = parseFloat(eirparray[8]);

  if (lat >= minLat && lat <= maxLat && long >= minLong && long <= maxLong) {
    // Placing marker for each lat long of slave
    marker[i] = new google.maps.Marker({
      map: map,
      position: { lat: parseFloat(lat), lng: parseFloat(long) },
      icon: `images/${i}.png`,
    });
    reportmarker[i] = new google.maps.Marker({
      map: reportMap,
      position: { lat: parseFloat(lat), lng: parseFloat(long) },
      icon: `images/${i}.png`,
    });
    // bounds.extend({ lat: parseFloat(lat), lng: parseFloat(long) });
    // map.fitBounds(bounds);
    if (marker[0] != undefined) {
      // Polyline
      polyLine[i] = new google.maps.Polyline({
        map: map,
        path: [marker[0].getPosition(), marker[i].getPosition()],
        strokeOpacity: 0.8,
      });
      reportPolyline[i] = new google.maps.Polyline({
        map: reportMap,
        path: [marker[0].getPosition(), marker[i].getPosition()],
        strokeOpacity: 0.8,
      });

      // calling the function which calculates the parameters
      azimuth(parseFloat(lat), parseFloat(long), i);
      // function called for elevation
      getElevation(i);
    }
  } else {
    // emptying the slave table after we have got wrong slaves
    var allspan = document.querySelectorAll(`.slave${i}span`);
    for (let k = 0; k < allspan.length; k++) {
      allspan[k].innerHTML = "";
    }
    /*checking whether this field already had some data and a corresponding Marker to it
            if yes - we set Marker to null to be able to remove the last Marker and place a new one*/
    if (marker[i] != undefined) {
      marker[i].setMap(null);
      polyLine[i].setMap(null);
      reportmarker[i].setMap(null);
      reportPolyline[i].setMap(null);
    }
    // removing the elevation chart data from the elevation div
    $(`#slave${i}Elevation`).html("");
    window.alert("Site co-ordinates doesnot belong to the country selected.");
    // disabling the installation report button as now one of the slave coordinate field is empty.
    $(`#reportButton`).prop("disabled", true);
  }
}

// function to check MAster Bounds
function checkMasterBounds(latitude, longitude) {
  var minLat = parseFloat(eirparray[5]);
  var maxLat = parseFloat(eirparray[6]);
  var minLong = parseFloat(eirparray[7]);
  var maxLong = parseFloat(eirparray[8]);
  console.log(eirparray[7], eirparray[8]);
  if (
    latitude >= minLat &&
    latitude <= maxLat &&
    longitude >= minLong &&
    longitude <= maxLong
  ) {
    console.log("satisfies lat long bounds");
    const image = "images/0.png";
    var pos = {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
    };
    marker[0] = new google.maps.Marker({
      map: map,
      position: pos,
      icon: image,
    });
    reportmarker[0] = new google.maps.Marker({
      map: reportMap,
      position: pos,
      icon: image,
    });
    // bounds.extend(pos);
    // map.fitBounds(bounds);

    // reportbounds.extend(pos);
    // reportMap.fitBounds(reportbounds);

    // Sector formation using polyline with Marker of Master and the two lat long for the sector corners
    drawSector();

    // function which when called will check if slave co-ord details are there
    // then will recalculate everything with new master co-ordinates
    if ($("#slave1Co-ordinate").val() != "") {
      coordMasterChange();
    }
  } else {
    var numOfSlaves = $(`#numberOfSlaves`).val();
    if (sectorPolyline != undefined) {
      sectorPolyline.setMap(null);
      reportsectorPolyline.setMap(null);
    }
    for (let i = 1; i <= numOfSlaves; i++) {
      // remove slave markers, polyline
      if (marker[i] != undefined) {
        polyLine[i].setMap(null);
        // removing all ouput data in the slave tables
        var slavespan = document.querySelectorAll(`.slave${i}span`);
        for (let j = 0; j < slavespan.length; j++) {
          slavespan[j].innerHTML = "";
        }
        // removing the elevation chart data
        $(`#slave${i}Elevation`).html("");
      }
    }
    // disabling the installation report button
    $(`#reportButton`).prop("disabled", true);
    $(`#addAnotherSlave`).prop("disbaled", true);
    window.alert("Site co-ordinates doesnot belong to the country selected.");
  }
}
