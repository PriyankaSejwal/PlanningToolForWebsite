// Global Variable
var address;

// event listener on the coordinate fields
for (let i = 1; i <= 2; i++) {
  $(`#searchtower${i}`).change(function () {
    $(`#add${i}`).val("");
    dmsddCheck(i);
  });
}

function dmsddCheck(i) {
  coord = $(`#searchtower${i}`).val();
  if (coord != "") {
    if (coord.includes(",")) {
      var lat = coord.split(",")[0];
      var long = coord.split(",")[1];
      if (long != " ") {
        // Regular expression to match DMS format (e.g. 40°26'46.302"N)
        // const dmsPattern =
        //   /^\s?-?\d{1,3}[°]\d{1,2}[']\d{1,2}(\.\d+)?["][NSWE]\s?$/i;

        // dms pattern which assumes that there can or cannot be one or many space after the dms symbols \s*?
        const dmsPattern =
          /^\s?-?\d{1,3}[°]\s*?\d{1,2}[']\s*?\d{1,2}(\.\d+)?["]\s*?[NSWE]\s?$/i;

        // Regular expression to match DD format (e.g. 40.446195, -79.948862)
        const ddPattern = /^\s?-?\d+(\.\d+)?°?\s?$/;
        if (dmsPattern.test(lat) && dmsPattern.test(long)) {
          var splitlat = lat.split(/[^\d\w\.\-\ ]+/);
          var ddlat = dmsToDD(splitlat);
          var splitlong = long.split(/[^\d\w\.\-\ ]+/);
          var ddlong = dmsToDD(splitlong);
          $(`#decimal${i}`).val(ddlat + ", " + ddlong);
          // function to check the lat long bouds of the coutnry
          validatecoord(ddlat, ddlong, i);
        } else if (ddPattern.test(lat) && ddPattern.test(long)) {
          var ddlat = parseFloat(lat);
          var ddlong = parseFloat(long);
          $(`#decimal${i}`).val(ddlat + ", " + ddlong);
          // function calling which will check whether the lat long is in the bounding range of the country selected
          validatecoord(ddlat, ddlong, i);
        }
      } else {
        window.alert("Invalid coordinate format");
      }
    }
  }
}

function validatecoord(lat, long, i) {
  var selectedctry = $("#ptpctryCode option:selected").html();
  var latL = parseFloat(ptpeirparray[5]);
  var latU = parseFloat(ptpeirparray[6]);
  var longL = parseFloat(ptpeirparray[7]);
  var longU = parseFloat(ptpeirparray[8]);
  if (lat >= latL && lat <= latU && long >= longL && long <= longU) {
    // Geocoding the co-ordinates and adding address to Site A address field
    if ($(`#add${i}`).val() == "") {
      ptpgeocoder
        .geocode({
          location: { lat: parseFloat(lat), lng: parseFloat(long) },
        })
        .then((response) => {
          if (response.results[0]) {
            $(`#add${i}`).val(response.results[0].formatted_address);
            console.log(response.results[0]);
          }
        });
    }
    // calculate button to be enabled when the fields for lat long are both filled
    if ($(`#searchtowerB`).val() != "") {
      var buttonActivate = $("#latLongBtn");
      buttonActivate.prop("disabled", false);
    }
  } else {
    // removing the markers
    if (ptpmarkersarr[i - 1] != undefined) {
      ptpmarkersarr[i - 1].setMap(null);
    }

    // checking if polyline is not null
    if (ptppolyline != null) {
      ptppolyline.setMap(null);
    }
    // Clearing the calculation table and hiding the elevation
    var reset = document.querySelectorAll(".resetTable");
    for (var j in reset) {
      reset[j].innerHTML = "";
    }
    // document.querySelector(".elevation-chart").style.display = "none";
    $("#ptpchart").html("");
    // removing the coordinate input
    $(`#searchtower${i}`).val("");
    $(`#decimal${i}`).val("");
    $(`#add${i}`).val("");
    alert(`Lat long of Site ${i} does not belong to ${selectedctry}`);
  }
}
function validatePopulate() {
  var coordA = document.querySelector("#searchtower1").value;
  var coordB = document.querySelector("#searchtower2").value;
  var latA = coordA.split(",")[0];
  var longA = coordA.split(",")[1];
  var latB = coordB.split(",")[0];
  var longB = coordB.split(",")[1];

  // Regular expression to match DMS format (e.g. 40°26'46.302"N)
  /* this expression is updated and can now read the dms pattern where space is used to separate the 
  degree, min and sec sign */
  const dmsPattern =
    /^\s?-?\d{1,3}[°]\s*?|\s*\d{1,2}[']\s*?|\s*?\d{1,2}(\.\d+)?["]|['']|\s*?[NSWE]\s?$/i;

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
