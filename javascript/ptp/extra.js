function buttonActive() {
  var inputCoord1 = document.getElementById("searchtower1").value;
  var inputCoord2 = document.getElementById("searchtower2").value;
  var buttonActivate = document.getElementById("latLongBtn");
  if (inputCoord1 == "" || inputCoord2 == "") {
    buttonActivate.disabled = true;
  } else {
    buttonActivate.disabled = false;
  }
}

// Second function Validate populate which is called whne the button is clicked to calculate further
function validatePopulate() {
  document.getElementById("latLongBtn").disabled = true;
  var coordA = document.querySelector("#searchtower1").value;
  var coordB = document.querySelector("#searchtower2").value;
  var latA = coordA.split(",")[0];
  var longA = coordA.split(",")[1];
  var latB = coordB.split(",")[0];
  var longB = coordB.split(",")[1];

  // Regular expression to match DMS format (e.g. 40°26'46.302"N)
  const dmsPattern = /^\s?-?\d{1,3}[°]\d{1,2}[']\d{1,2}(\.\d+)?["][NSWE]\s?$/i;

  // Regular expression to match DD format (e.g. 40.446195, -79.948862)
  const ddPattern = /^\s?-?\d+(\.\d+)?°?\s?$/;
  if (dmsPattern.test(latA) && dmsPattern.test(longA)) {
    var splitlat = latA.split(/[^\d\w\.\-\ ]+/);
    var ddlat = dmsToDD(splitlat);
    var splitlong = longA.split(/[^\d\w\.\-\ ]+/);
    var ddlong = dmsToDD(splitlong);
  } else if (ddPattern.test(latA) && ddPattern.test(longA)) {
    var ddlat = parseFloat(latA);
    var ddlong = parseFloat(longA);
    // function calling which will check whether the lat long is in the bounding range of the country selected
  } else {
    window.alert("Invalid coordinate format");
  }
  document.querySelector("#decimal1").value = ddlat + ", " + ddlong;
  // Geocoding the co-ordinates and adding address to Site A address field
  ptpgeocoder
    .geocode({
      location: { lat: parseFloat(ddlat), lng: parseFloat(ddlong) },
    })
    .then((response) => {
      if (response.results[0]) {
        add1.value = response.results[0].formatted_address;
        console.log(response.results[0]);
      }
    });

  if (dmsPattern.test(latB) && dmsPattern.test(longB)) {
    var splitlat = latB.split(/[^\d\w\.\-\ ]+/);
    var ddlat = dmsToDD(splitlat);
    var splitlong = longB.split(/[^\d\w\.\-\ ]+/);
    var ddlong = dmsToDD(splitlong);
  } else if (ddPattern.test(latB) && ddPattern.test(longB)) {
    var ddlat = parseFloat(latB);
    var ddlong = parseFloat(longB);
  } else {
    window.alert("Invalid coordinate format");
  }
  document.querySelector("#decimal2").value = ddlat + ", " + ddlong;
  // Geocoding the co-ordinates and adding address to Site A address field
  ptpgeocoder
    .geocode({
      location: { lat: parseFloat(ddlat), lng: parseFloat(ddlong) },
    })
    .then((response) => {
      if (response.results[0]) {
        add2.value = response.results[0].formatted_address;
        console.log(response.results[0]);
      }
    });
  inputMarker();
}

// function to convert dms to decimal
function dmsToDD(splitvalue) {
  var [deg, min, sec, direction] = splitvalue;
  var dd = Number(deg) + Number(min) / 60 + Number(sec) / (60 * 60);
  console.log(dd);
  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
}

/* validate address is called in the function inputMarker to check whether the 
  lat longs entered are in the bounds of the country*/
function validateAdd(lata, longa, latb, longb) {
  var selectedctry = $("#ptpctryCode option:selected").html();
  var latL = parseFloat(ptpeirparray[5]);
  var latU = parseFloat(ptpeirparray[6]);
  var longL = parseFloat(ptpeirparray[7]);
  var longU = parseFloat(ptpeirparray[8]);
  if (lata >= latL && lata <= latU && longa >= longL && longa <= longU) {
    if (latb >= latL && latb <= latU && longb >= longL && longb <= longU) {
      drawPolyline();
      console.log(`Lat long belongs to ${selectedctry}`);
    } else {
      // removing the markers
      if (ptpmarkersarr[0] != undefined) {
        ptpmarkersarr[0].setMap(null);
      }
      // checking if polyline is not null
      if (ptppolyline != null) {
        ptppolyline.setMap(null);
      }
      // Clearing the calculation table and hiding the elevation
      var reset = document.querySelectorAll(".resetTable");
      for (var i in reset) {
        reset[i].innerHTML = "";
      }
      // document.querySelector(".elevation-chart").style.display = "none";
      $("#ptpchart").html("");
      alert(`Lat long of Site 2 does not belong to ${selectedctry}`);
    }
  } else {
    // removing the markers
    if (ptpmarkersarr[0] != undefined) {
      ptpmarkersarr[0].setMap(null);
    }

    // checking if polyline is not null
    if (ptppolyline != null) {
      ptppolyline.setMap(null);
    }
    // Clearing the calculation table and hiding the elevation
    var reset = document.querySelectorAll(".resetTable");
    for (var i in reset) {
      reset[i].innerHTML = "";
    }
    // document.querySelector(".elevation-chart").style.display = "none";
    $("#ptpchart").html("");
    alert(`Lat long of Site 1 does not belong to ${selectedctry}`);
  }
}
