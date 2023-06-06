function heightUpdate() {
  var obstructionList = $("#obsUL").html();
  if (obstructionList == "") {
    availability();
    elevationchartptp();
    // present in map.js
  } else {
    availability();
    ObsChartWithHt();
    // present in obstruction.js
  }
}
