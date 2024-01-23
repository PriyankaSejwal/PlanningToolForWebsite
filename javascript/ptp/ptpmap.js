// Defining Global variables
var ptpmap;
var pos;
var ptpmarker;
var ptpmarkersarr = [];
var reportMarkerArr = [];
var ptppolyline = null;
var reportpolyline = null;
var latlongarr = [];
var ptpbounds;
var ptpreportbounds;
var ptpreportmap;
var yelevptp, elevationArr;
var ptpgeocoder;
var ptpchart;
var ptpjoinedData;
var ellipsearray2;

google.load("visualization", "1", { packages: ["corechart"] });

// Function which creates map
function ptpMap() {
  // Map options
  var options = {
    center: { lat: 28.7041, lng: 77.1025 },
    zoom: 2,
  };
  // New Map
  ptpmap = new google.maps.Map(document.getElementById("ptpmap"), options);
  ptpreportmap = new google.maps.Map(document.getElementById("ptpreportmap"), {
    center: { lat: 28.7041, lng: 77.1025 },
    zoom: 13,
  });
  // event listener on the map when map is clicked
  ptpmap.addListener("click", function (e) {
    if (ptpmarkersarr.length < 2) {
      addMarker(e.latLng);
    }
    if (ptpmarkersarr.length == 2) {
      addMarkerToReport();
      addAddress();
    }
  });

  // Create an ElevationService.
  ptpelevator = new google.maps.ElevationService();

  // Initializing Reverse Geocoding
  ptpgeocoder = new google.maps.Geocoder();
}

// Adding Markers on the map by clicking on the map
function addMarker(latLng) {
  document.getElementById("add1").value = "";
  document.getElementById("add2").value = "";
  ptpmarker = new google.maps.Marker({
    map: ptpmap,
    position: latLng,
    draggable: true,
    // icon can be added
  });
  // add listener to redraw the polyline when markers position change
  ptpmarker.addListener("dragend", function () {
    addMarkerToReport();
    addAddress();
    // drawPolyline();
  });
  //extend the bounds to include each marker's position
  ptpmarkersarr.push(ptpmarker);
  // reportMarkerArr.push(ptpmarker);
}

// Adding Markers to the report map
function addMarkerToReport() {
  // bounds
  ptpreportbounds = new google.maps.LatLngBounds();
  for (let j = 0; j <= 1; j++) {
    if (reportMarkerArr[j] != undefined) {
      reportMarkerArr[j].setMap(null);
    }
  }
  reportMarkerArr.length = 0;
  for (let j = 0; j < ptpmarkersarr.length; j++) {
    // Marker in the report map
    ptpreportmarker = new google.maps.Marker({
      map: ptpreportmap,
      position: ptpmarkersarr[j].getPosition(),
    });
    // extend the bounds to include the marker's position
    reportMarkerArr.push(ptpreportmarker);
    ptpreportbounds.extend(ptpreportmarker.getPosition());
  }
  ptpreportmap.setZoom(12);
  ptpreportmap.fitBounds(ptpreportbounds);
}

function reportMarker() {
  document.querySelector(".ptppopup").style.display = "block";
  // adjusting the bounds for the report map when installation report button is clicked
  ptpreportmap.fitBounds(ptpreportbounds);

  // populating the inner html of elevation chart to the report elevation chart
  document.querySelector("#report_elevation_profile").innerHTML =
    document.querySelector("#ptpchart").innerHTML;

  // Populating values in the Site A and Site B tables
  var nameA = document.getElementById("siteAName").value;
  var nameB = document.getElementById("siteBName").value;
  var adda = document.getElementById("add1").value.replaceAll(",", "");
  var addb = document.getElementById("add2").value.replaceAll(",", "");
  var hta = document.getElementById("aheight1").value;
  var htb = document.getElementById("aheight2").value;
  var coorda = document
    .getElementById("searchtower1")
    .value.replaceAll(",", " ");
  var coordb = document
    .getElementById("searchtower2")
    .value.replaceAll(",", " ");
  // Populating the details in the installation report.
  document.getElementById("reportSiteAName").innerHTML = nameA;
  document.getElementById("reportSiteBName").innerHTML = nameB;
  document.getElementById("reportAddressA").innerHTML = adda;
  document.getElementById("reportAddressB").innerHTML = addb;
  document.getElementById("reportCoordA").innerHTML = coorda;
  document.getElementById("reportCoordB").innerHTML = coordb;
  document.getElementById("reportHeightA").innerHTML = hta + " m";
  document.getElementById("reportHeightB").innerHTML = htb + " m";
  var htAddA = document.getElementById("reportAddressA").offsetHeight;
  var htAddB = document.getElementById("reportAddressB").offsetHeight;
  if (htAddA > htAddB) {
    var ht = (htAddA + 13.8).toString() + "px";
    console.log(typeof ht);
    document.getElementById("addHeightB").style.height = ht;
  } else {
    var ht = (htAddB + 13.8).toString() + "px";
    document.getElementById("addHeightA").style.height = ht;
  }
}

// Adding Markers on the map using the input values

function inputMarker() {
  // disable the button for calculating the budget calculation
  $(`#latLongBtn`).prop("disabled", true);

  // removing data from the obstruction list
  $(`#obsUL`).html("");

  clearOverlays();
  // markersarr = [];
  latlongarr = [];
  var site1 = document.getElementById("decimal1").value;
  var siteb = document.getElementById("decimal2").value;
  console.log("value of coord 1: ", site1);
  console.log("value of coord 2: ", siteb);
  if (site1 != "" && siteb != "") {
    var arr = document.getElementsByClassName("towerinput");
    if (arr.length == 2) {
      Array.from(arr).forEach(function (e) {
        latlongarr.push(e.value.split(","));
      });
      ptpbounds = new google.maps.LatLngBounds();
      ptpreportbounds = new google.maps.LatLngBounds();
      for (i = 0; i < latlongarr.length; i++) {
        // Marker in the main map
        ptpmarker = new google.maps.Marker({
          map: ptpmap,
          position: new google.maps.LatLng(latlongarr[i][0], latlongarr[i][1]),
          draggable: true,
        });
        ptpmap.setZoom(12);
        ptpbounds.extend(ptpmarker.getPosition());
        // Marker in the report map
        ptpreportmarker = new google.maps.Marker({
          map: ptpreportmap,
          position: new google.maps.LatLng(latlongarr[i][0], latlongarr[i][1]),
        });
        ptpreportbounds.extend(ptpreportmarker.getPosition());
        // updating the arrays for map and report map
        ptpmarkersarr.push(ptpmarker);
        reportMarkerArr.push(ptpreportmarker);
        // add listener to redraw the polyline when markers position change
        ptpmarker.addListener("dragend", function () {
          addMarkerToReport();
          addAddress();
        });
      }
      ptpmap.fitBounds(ptpbounds);
      drawPolyline();
    }
  }
}

// function to clear the markers on the map
function clearOverlays() {
  for (var i = 0; i < ptpmarkersarr.length; i++) {
    if (ptpmarkersarr[i] != undefined) {
      ptpmarkersarr[i].setMap(null);
      reportMarkerArr[i].setMap(null);
    }
  }
  ptpmarkersarr.length = 0;
  reportMarkerArr.length = 0;
}

function addAddress() {
  for (let i = 1; i <= 2; i++) {
    var selectedctry = $("#ptpctryCode option:selected").html();
    var latitude = parseFloat(
      ptpmarkersarr[i - 1].getPosition().lat().toFixed(6)
    );
    var longitude = parseFloat(
      ptpmarkersarr[i - 1].getPosition().lng().toFixed(6)
    );
    var coordinates = { lat: latitude, lng: longitude };
    // Populating the position of the markers in the input fields
    // Populating the input fields with the latitude longitude of the Marker.
    $(`#searchtower${i}`).val(latitude + "," + longitude);
    $(`#decimal${i}`).val(latitude + "," + longitude);
    // adding address to the address field
    ptpgeocoder.geocode({ location: coordinates }).then((response) => {
      if (response.results[0]) {
        $(`#add${i}`).val(response.results[0].formatted_address);
        if (i == 2) {
          drawPolyline();
        }
      } else {
        alert("Please try entering the co-ordinates of the location.");
      }
    });
  }
}

// This function adds the address for the co-ordinates

// function addAddress() {
//   var ctry = document.getElementById("ptpctryCode");
//   var selectedctry = ctry.options[ctry.selectedIndex].innerHTML;
//   var coordinates1 = {
//     lat: parseFloat(ptpmarkersarr[0].getPosition().lat().toFixed(6)),
//     lng: parseFloat(ptpmarkersarr[0].getPosition().lng().toFixed(6)),
//   };
//   var coordinates2 = {
//     lat: parseFloat(ptpmarkersarr[1].getPosition().lat().toFixed(6)),
//     lng: parseFloat(ptpmarkersarr[1].getPosition().lng().toFixed(6)),
//   };

//   // Populating the position of the markers in the input fields
//   // Populating the input fields with the latitude longitude of the Marker.
//   document.getElementById("searchtowerA").value =
//     ptpmarkersarr[0].getPosition().lat().toFixed(6) +
//     "," +
//     ptpmarkersarr[0].getPosition().lng().toFixed(6);
//   document.getElementById("searchtowerB").value =
//     ptpmarkersarr[1].getPosition().lat().toFixed(6) +
//     "," +
//     ptpmarkersarr[1].getPosition().lng().toFixed(6);
//   // value in the decimal hidden fields
//   document.getElementById("decimalA").value =
//     ptpmarkersarr[0].getPosition().lat().toFixed(6) +
//     "," +
//     ptpmarkersarr[0].getPosition().lng().toFixed(6);
//   document.getElementById("decimalB").value =
//     ptpmarkersarr[1].getPosition().lat().toFixed(6) +
//     "," +
//     ptpmarkersarr[1].getPosition().lng().toFixed(6);

//   // Adding address to address 1
//   ptpgeocoder.geocode({ location: coordinates1 }).then((response) => {
//     if (response.results[0]) {
//       if (ctry.value == "nd") {
//         document.getElementById("add0").value =
//           response.results[0].formatted_address;
//         drawPolyline();
//       } else {
//         if (response.results[0].formatted_address.includes(",")) {
//           // To check for the country name
//           if (response.results[0].formatted_address.includes(selectedctry)) {
//             // Populating address to the address field A
//             document.getElementById("add0").value =
//               response.results[0].formatted_address;

//             // drawPolyline();
//           } else {
//             alert(
//               "The entered co-ordinate doesnot belong to the selected country."
//             );
//             clearOverlays();
//             document.getElementById("searchtowerA").value = "";
//           }
//         } else {
//           alert("Please try entering the address of the location.");
//         }
//       }
//     }
//   });

//   // Adding address to address 2
//   ptpgeocoder.geocode({ location: coordinates2 }).then((response) => {
//     if (response.results[0]) {
//       if (ctry.value == "nd") {
//         document.getElementById("add1").value =
//           response.results[0].formatted_address;
//         drawPolyline();
//       } else {
//         // To check for the country name
//         if (response.results[0].formatted_address.includes(",")) {
//           if (response.results[0].formatted_address.includes(selectedctry)) {
//             // Populating address to the address field B
//             document.getElementById("add1").value =
//               response.results[0].formatted_address;
//             drawPolyline();
//           } else {
//             alert(
//               "The entered co-ordinate doesnot belong to the selected country."
//             );
//             clearOverlays();
//             document.getElementById("searchtowerB").value = "";
//           }
//         } else {
//           alert("Please try entering the address of the location.");
//         }
//       }
//     }
//   });
// }

// Function to draw polyline on the map
function drawPolyline() {
  // polyline.setMap(null);
  let markersPositionArr = [];
  ptpmarkersarr.forEach(function (e) {
    markersPositionArr.push(e.getPosition());
  });

  // checking if polyline is not null
  if (ptppolyline != null) {
    ptppolyline.setMap(null);
    reportpolyline.setMap(null);
  }

  // adding polyline to the Map
  ptppolyline = new google.maps.Polyline({
    map: ptpmap,
    path: markersPositionArr,
    strokeOpacity: 0.8,
  });
  // adding polyline to the report Map
  reportpolyline = new google.maps.Polyline({
    map: ptpreportmap,
    path: markersPositionArr,
    strokeOpacity: 0.8,
  });
  document.getElementById("ptpreportbtn").disabled = false;
  document.getElementById("ptpreportbtn").style.cursor = "pointer";

  if (markersPositionArr.length == 2) {
    hopazimuth();
    calcFresnel();
    deviceinfo();
    // calcTxPower();
    // calceirp();

    ptpelevator
      .getElevationAlongPath({
        path: markersPositionArr,
        samples: 100,
      })
      .then(plotptpElevation)
      .catch((e) => {
        const chartDiv = document.getElementsByClassName("ptp-elevation-chart");
        // Show the error code inside the chartDiv.
        chartDiv.innerHTML =
          "Cannot show elevation: request failed because " + e;
      });
    console.log("elevation api called at 371");
  }
}

function plotptpElevation({ results }) {
  yelevptp = [];
  for (i = 0; i < results.length; i++) {
    yelevptp.push(results[i].elevation);
  }
  elevationchartptp();
}

function elevationchartptp() {
  $(".editPencil").show();
  var dist = parseFloat(document.getElementById("linkDistance").innerHTML);
  var rad = parseFloat(document.getElementById("fresnelRadius").innerHTML); // minor axis radius fresnel radius
  var ht1 = parseFloat(document.getElementById("aheight1").value);
  var ht2 = parseFloat(document.getElementById("aheight2").value);
  // rad = (rad * 60) / 100;
  // Populating report elevation for Site A and Site B
  document.getElementById("reportElevationA").innerHTML =
    yelevptp[0].toFixed(2);
  document.getElementById("reportElevationB").innerHTML =
    yelevptp[99].toFixed(2);

  // x-ticks array
  var tickarr = [];
  var tickSize = dist / 4;
  for (var i = 0; i <= dist; i += tickSize) {
    tickarr.push(i.toFixed(2));
  }

  //data array for the ellipse

  startX = 0;
  endX = dist * Math.pow(10, 3);
  startY = yelevptp[0] + ht1;
  endY = yelevptp[99] + ht2;
  // console.log(startY, endY);

  ellipsearray = [];

  // steps for the angle to make the ellipse
  var step = (2 * Math.PI) / 198;
  // Radius of the major axis
  var a =
    Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) * 0.5; // radius of major axis

  // angle of the rotation
  var w = Math.atan2(endY - startY, endX - startX);

  //for loop for 0 to 180 degree point of the ellipse
  for (i = 0; i <= Math.PI; i += step) {
    var xval = a * Math.cos(i);
    var yval = rad * Math.sin(i);
    var xnew = (startX + endX) / 2 + xval * Math.cos(w) - yval * Math.sin(w);
    var ynew = (startY + endY) / 2 + xval * Math.sin(w) + yval * Math.cos(w);
    ellipsearray.push([xnew / 1000, ynew]);
  }

  //for loop for 180 to 360 degree point of the ellipse
  ellipsearray2 = [];
  for (i = Math.PI; i <= 2 * Math.PI; i += step) {
    var xval = a * Math.cos(i);
    var yval = rad * Math.sin(i);
    var xnew = (startX + endX) / 2 + xval * Math.cos(w) - yval * Math.sin(w);
    var ynew = (startY + endY) / 2 + xval * Math.sin(w) + yval * Math.cos(w);
    ellipsearray2.push([xnew / 1000, ynew]);
  }

  // data array for the elevation
  elevationArr = [];
  distarray = [];
  stepsize = (dist * Math.pow(10, 3)) / 99;
  for (i = 0; i < 100; i++) {
    distarray.push(ellipsearray2[i][0]);
  }

  //  Elevation data both x values and y values
  for (i = 0; i < 100; i++) {
    elevationArr.push([distarray[i], yelevptp[i]]);
  }

  //  Checking for clear Line of Sight
  for (i = 0; i < yelevptp.length; i++) {
    if (ellipsearray2[i][1] > yelevptp[i]) {
      document.getElementById("los").innerHTML = "Yes";
      document.getElementById("reportlos").innerHTML = "Yes";
      document.getElementById("los").style.color = "Green";
      ptppolyline.setOptions({ strokeColor: "Green" });
      reportpolyline.setOptions({ strokeColor: "Green" });
      document.querySelector("#availabilityValue").style.display = "table-cell";
      document.querySelector("#msg").style.display = "none";
    } else {
      document.getElementById("los").innerHTML = "No";
      document.getElementById("reportlos").innerHTML = "No";
      document.getElementById("los").style.color = "Red";
      ptppolyline.setOptions({ strokeColor: "Red" });
      reportpolyline.setOptions({ strokeColor: "Red" });
      document.querySelector("#availabilityValue").style.display = "none";
      document.querySelector("#msg").style.display = "table-cell";
      document.getElementById("reportlinkAvailability").innerHTML = "No";
      break;
    }
  }

  //  Calculating the Antenna Tilt / Vertical Angle and populating them in the Link Installation Report
  vertical_angle = Math.atan((startY - endY) / (dist * 1000)) * (180 / Math.PI);
  document.getElementById("reportTiltA").innerHTML =
    vertical_angle.toFixed(2) + "°";
  document.getElementById("reportTiltB").innerHTML =
    -vertical_angle.toFixed(2) + "°";

  // data 1 for the elevation
  var data = new google.visualization.DataTable();
  data.addColumn("number", "distance");
  data.addColumn("number", "elevation");
  data.addRows(elevationArr);

  // data 2 for half of the ellipse
  var data2 = new google.visualization.DataTable();
  data2.addColumn("number", "distance");
  data2.addColumn("number", "fresnel zone");
  data2.addRows(ellipsearray);

  // data 3 for other half of the ellipse
  var data3 = new google.visualization.DataTable();
  data3.addColumn("number", "distance");
  data3.addColumn("number", "fresnel zone");
  data3.addRows(ellipsearray2);

  // joined data for elevation and first half of ellipse
  var joinedData = google.visualization.data.join(
    data,
    data2,
    "full",
    [[0, 0]],
    [1],
    [1]
  );

  // joined data for above and second half of ellipse
  ptpjoinedData = google.visualization.data.join(
    joinedData,
    data3,
    "full",
    [[0, 0]],
    [1, 2],
    [1]
  );

  console.log(ptpjoinedData);

  // console.log(joinedData2);

  // chart options
  var options = {
    width: 400,
    height: 200,
    interpolateNulls: true,
    lineWidth: 1,
    colors: ["#037385", "#350964", "#350964"],
    hAxis: {
      title: "Distance (in Km) ",
      ticks: tickarr,
    },
    vAxis: {
      title: "Elevation (in m)",
    },
    legend: "none",
    seriesType: "line",
    series: { 0: { type: "area" } },
  };

  // Chart constructor for the main page of the website
  chart = new google.visualization.ComboChart(
    document.getElementById("ptpchart")
  );

  // drawing the Main chart
  chart.draw(ptpjoinedData, options);

  // chart making visible, hidden when cancel ptp pressed
  document.querySelector(".ptp-elevation-chart").style.display = "block";
}
