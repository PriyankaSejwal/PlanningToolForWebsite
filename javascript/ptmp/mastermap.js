var map, reportMap, bounds, reportbounds, masterMarker;
var yelev, elevator;
function initMap() {
  var options = {
    zoom: 2,
    center: { lat: 28.776534, lng: 78.12354 },
  };
  // PTMP Tool Main Map
  map = new google.maps.Map(document.getElementById("map3d"), options);

  // Installation Report Map
  reportMap = new google.maps.Map(
    document.querySelector("#reportmap"),
    options
  );

  // Create an Elevation Service.
  elevator = new google.maps.ElevationService();
}

function placeMasterOnMap() {
  masterAzimuthArray = [];
  var masterVal = $("#masterCoord").val();
  if (masterVal.includes(",")) {
    var masterCoord = masterVal.split(",");
    if (masterCoord[1] != "") {
      if (marker[0] != null) {
        marker[0].setMap(null);
        reportmarker[0].setMap(null);
      }
      // function which confirms whether lat lng of Master belongs to the selected country
      checkMasterFormat(masterCoord[0], masterCoord[1]);
    }
  }
}

function coordMasterChange() {
  allElevation = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
  var numOfSlaves = document.querySelector("#numberOfSlaves").value;
  for (let i = 1; i <= numOfSlaves; i++) {
    if (document.querySelector(`#slave${i}Co-ordinate`).value != "") {
      polyLine[i].setMap(null);
      reportPolyline[i].setMap(null);
      $(`#obsUL${i}`).html("");
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
    }
  }
  if ($(`#slave` + numOfSlaves + `Co-ordinate`) != "") {
    for (i = 1; i <= numOfSlaves; i++) {
      if (document.querySelector(`#slave${i}Co-ordinate`).value != "") {
        var coordSlave = $(`#slave${i}Co-ordinate`).val().split(",");
        var [lat, long] = coordSlave;
        // function called for calculations
        azimuth(parseFloat(lat), parseFloat(long), i);
        // masterAzimuthArray[i - 1] = azimuthCal;
      } else {
        continue;
      }
      console.log(masterAzimuthArray);
    }
    // calling function which does elevation chart again
    createelevationAgain();
  }
}
