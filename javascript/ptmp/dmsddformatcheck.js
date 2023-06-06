// this javascript file contains functions whihc will help us check and validate the format of the lat long
function checkSlaveFormat(lat, long, i) {
  // Regular expression to match DMS format (e.g. 40°26'46.302"N)
  // const dmsPattern = /^\s?-?\d{1,3}[°]\d{1,2}[']\d{1,2}(\.\d+)?["][NSWE]\s?$/i;

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
    // entering the value of the lat long in the inout field for dd format
    $(`#slave${i}DDCoord`).val(`${ddlat}, ${ddlong}`);
    // function calling which will check whether the lat long is in the bounding range of the country selected
    checkSlaveBounds(ddlat, ddlong, i);
  } else if (ddPattern.test(lat) && ddPattern.test(long)) {
    var ddlat = parseFloat(lat);
    var ddlong = parseFloat(long);
    // entering the value of the lat long in the inout field for dd format
    $(`#slave${i}DDCoord`).val(`${ddlat}, ${ddlong}`);
    // function calling which will check whether the lat long is in the bounding range of the country selected
    checkSlaveBounds(ddlat, ddlong, i);
  } else {
    window.alert("Invalid coordinate format");
  }
}

// check Master format
function checkMasterFormat(lat, long) {
  // Regular expression to match DMS format (e.g. 40°26'46.302"N)
  // const dmsPattern = /^\s?-?\d{1,3}[°]\d{1,2}[']\d{1,2}(\.\d+)?["][NSWE]\s?$/i;

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
    // entering the decimal value in the Master field for decimal format coordinate
    $("#masterDDCoord").val(`${ddlat}, ${ddlong}`);
    // function which confirms whether lat lng of Master belongs to the selected country
    checkMasterBounds(ddlat, ddlong);
  } else if (ddPattern.test(lat) && ddPattern.test(long)) {
    var ddlat = parseFloat(lat);
    var ddlong = parseFloat(long);
    // entering the value of the lat long in the inout field for dd format
    $(`#masterDDCoord`).val(`${ddlat}, ${ddlong}`);
    // function calling which will check whether the lat long is in the bounding range of the country selected
    checkMasterBounds(ddlat, ddlong);
  } else {
    window.alert("Invalid coordinate format");
  }
}

// function which will take in the DMS coordinate which is split to get converted into the DD coordinate
function dmsToDD(splitvalue) {
  var [deg, min, sec, direction] = splitvalue;
  dd = Number(deg) + Number(min) / 60 + Number(sec) / (60 * 60);
  if (direction == "S" || direction == "W") {
    dd = -1 * dd;
  }
  return dd;
}
