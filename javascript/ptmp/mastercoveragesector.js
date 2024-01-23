/* function to find the lat long for Right and Left point of the sector which will be made from three points:
 Master, Right side point, left side point*/
var sectorPolyline, reportsectorPolyline;
function findMarker(latlong, heading, distance) {
  var lat = parseFloat(latlong.split(",")[0]);
  var long = parseFloat(latlong.split(",")[1]);
  console.log(lat, long);
  heading = (heading + 360) % 360;
  console.log(heading);
  var rad = Math.PI / 180;
  radInv = 180 / Math.PI;
  R = 6378137; // approximation of Earth's radius
  lon1 = long * rad;
  lat1 = lat * rad;
  console.log(lat1, lon1);
  rheading = heading * rad;
  sinLat1 = Math.sin(lat1);
  cosLat1 = Math.cos(lat1);
  cosDistR = Math.cos(distance / R);
  sinDistR = Math.sin(distance / R);
  lat2 = Math.asin(
    sinLat1 * cosDistR + cosLat1 * sinDistR * Math.cos(rheading)
  );
  lon2 =
    lon1 +
    Math.atan2(
      Math.sin(rheading) * sinDistR * cosLat1,
      cosDistR - sinLat1 * Math.sin(lat2)
    );
  lon2 = lon2 * radInv;
  lon2 = lon2 > 180 ? lon2 - 360 : lon2 < -180 ? lon2 + 360 : lon2;
  return [lat2 * radInv, lon2];
}

function drawSector() {
  // function called to find left and right lat long for Sector around /master
  var masterCoord = $(`#masterDDCoord`).val();
  setSectorBounds();
  var leftSectorPt = findMarker(masterCoord, sectorBound[0], 5000);
  var centerPt = findMarker(masterCoord, sectorBound[1], 5000);
  var rightSectorPt = findMarker(masterCoord, sectorBound[2], 5000);
  var leftToCenterPt = findMarker(masterCoord, sectorBound[3], 5000);
  var rightToCenterPt = findMarker(masterCoord, sectorBound[4], 5000);
  // creating polygon using Master coord and other calculated points for the Sector
  var sectorCoordinates = [
    {
      lat: parseFloat(masterCoord.split(",")[0]),
      lng: parseFloat(masterCoord.split(",")[1]),
    },
    {
      lat: parseFloat(leftSectorPt[0]),
      lng: parseFloat(leftSectorPt[1]),
    },
    {
      lat: parseFloat(leftToCenterPt[0]),
      lng: parseFloat(leftToCenterPt[1]),
    },
    {
      lat: parseFloat(centerPt[0]),
      lng: parseFloat(centerPt[1]),
    },
    {
      lat: parseFloat(rightToCenterPt[0]),
      lng: parseFloat(rightToCenterPt[1]),
    },
    {
      lat: parseFloat(rightSectorPt[0]),
      lng: parseFloat(rightSectorPt[1]),
    },
  ];
  if (sectorPolyline != undefined) {
    sectorPolyline.setMap(null);
    reportsectorPolyline.setMap(null);
  }
  sectorPolyline = new google.maps.Polygon({
    map: map,
    path: sectorCoordinates,
    clickable: false,
    strokeColor: "green",
    strokeOpacity: 1,
    strokeWeight: 1,
    fillColor: "green",
    fillOpacity: 0.2,
  });
  reportsectorPolyline = new google.maps.Polygon({
    map: reportMap,
    path: sectorCoordinates,
    clickable: false,
    strokeColor: "green",
    strokeOpacity: 1,
    strokeWeight: 1,
    fillColor: "green",
    fillOpacity: 0.2,
  });
  bounds = new google.maps.LatLngBounds();
  reportbounds = new google.maps.LatLngBounds();
  // Extending bounds of the Map and report Map to include the Master and the coverage sector
  bounds.extend(marker[0].getPosition());
  bounds.extend({
    lat: parseFloat(leftSectorPt[0]),
    lng: parseFloat(leftSectorPt[1]),
  });
  bounds.extend({
    lat: parseFloat(rightSectorPt[0]),
    lng: parseFloat(rightSectorPt[1]),
  });
  bounds.extend({
    lat: parseFloat(centerPt[0]),
    lng: parseFloat(centerPt[1]),
  });
  // Report Map Bounds extension
  reportbounds.extend(marker[0].getPosition());
  reportbounds.extend({
    lat: parseFloat(leftSectorPt[0]),
    lng: parseFloat(leftSectorPt[1]),
  });
  reportbounds.extend({
    lat: parseFloat(rightSectorPt[0]),
    lng: parseFloat(rightSectorPt[1]),
  });
  reportbounds.extend({
    lat: parseFloat(centerPt[0]),
    lng: parseFloat(centerPt[1]),
  });
  reportMap.fitBounds(bounds);
  map.fitBounds(bounds);
}
