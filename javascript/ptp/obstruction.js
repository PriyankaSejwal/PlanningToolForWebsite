// Opening the div containing table to update obstruction
document
  .querySelector("#editObstruction")
  .addEventListener("click", function () {
    document.querySelector(".obstructionPopUp").style.display = "block";
  });

// Obstruction close button closes the obstruction pop up and calls the function to update the elevation chart
document
  .querySelector("#obstruction-close-btn")
  .addEventListener("click", function () {
    document.querySelector(".obstructionPopUp").style.display = "none";

    updateElevationChart();
  });

// function which adds new obstruction data into the list on clickikg th ADD button in the obstruction table

function newObstructionData() {
  var obsList = document.querySelector("#obsUL");
  var li = document.createElement("li");
  li.className = "obsLi";
  var obstructionValue = document.querySelector("#obstructionDistance").value;
  var obstructionHt = document.querySelector("#obstructionMastHt").value;
  var hopdist = $(`#linkDistance`).html();
  if (obstructionValue <= hopdist) {
    var t = document.createTextNode(
      obstructionValue + "      |      " + obstructionHt
    );
    li.appendChild(t);
    if (obstructionValue === "") {
    } else {
      obsList.appendChild(li);
    }
    document.querySelector("#obstructionDistance").value = " ";
    document.querySelector("#obstructionMastHt").value = " ";
    document.querySelector("#obstructionDistance").style.background = "white";
    document.querySelector("#obstructionMastHt").style.background = "white";

    // adding a close button to the list item
    var span = document.createElement("span");
    var deletetxt = document.createTextNode("\u00D7");
    span.className = "deleteObs";
    span.appendChild(deletetxt);
    li.appendChild(span);

    // Click on the close button to hide the current list item
    var close = document.getElementsByClassName("deleteObs");
    for (var i = 0; i < close.length; i++) {
      close[i].addEventListener("click", function () {
        console.log("getting clicked not deleted");
        var div = this.parentElement;
        document.querySelector("#obsUL").removeChild(div);
      });
    }
  } else {
    document.querySelector("#obstructionDistance").value = " ";
    document.querySelector("#obstructionMastHt").value = " ";
    document.querySelector("#obstructionDistance").style.background = "white";
    document.querySelector("#obstructionMastHt").style.background = "white";
    window.alert(`Please enter obstruction till ${hopdist} Km.`);
  }
}

var obsArray, obsindex;
function gettingObsDataFromUL() {
  obsArray = [];
  obsindex = [];
  var obsData = document.getElementsByClassName("obsLi");
  Array.from(obsData).forEach(function (e) {
    var Obsdist = e.textContent.split("|")[0];
    var obsElevation = parseFloat(e.textContent.split("|")[1]);
    var differenceArray = [];
    for (let i = 0; i < elevationArr.length; i++) {
      var diff = (Obsdist - elevationArr[i][0]).toFixed(2);
      differenceArray.push(Math.abs(diff));
    }
    var indexMinDiff = differenceArray.indexOf(Math.min(...differenceArray));
    console.log("INDEX to consider: ", indexMinDiff);
    console.log(
      "elevation where the obstruction is added: ",
      elevationArr[indexMinDiff][1]
    );
    var newObsHt = obsElevation + elevationArr[indexMinDiff][1];
    obsArray.push([parseFloat(Obsdist), parseFloat(newObsHt)]);
    obsindex.push(indexMinDiff);
  });

  dataObs = new google.visualization.DataTable();
  dataObs.addColumn("number", "distance");
  dataObs.addColumn("number", "obstruction");
  dataObs.addRows(obsArray);

  return dataObs;
}

// adding obstruction data to the chart and displaying the chart
function updateElevationChart() {
  var data4 = gettingObsDataFromUL();

  obstructionJoined = google.visualization.data.join(
    ptpjoinedData,
    data4,
    "full",
    [[0, 0]],
    [1, 2, 3],
    [1]
  );
  console.log(obstructionJoined);

  // we have obstruction in the chart so checking if obstruction is clear of the fresnel zone
  for (let k = 0; k < obsArray.length; k++) {
    index = obsindex[k];
    if (obsArray[k][1] > ellipsearray2[index][1]) {
      document.getElementById("los").innerHTML = "No";
      document.getElementById("reportlos").innerHTML = "No";
      document.getElementById("los").style.color = "Red";
      ptppolyline.setOptions({ strokeColor: "Red" });
      document.querySelector("#availabilityValue").style.display = "none";
      document.querySelector("#msg").style.display = "table-cell";
      document.getElementById("reportlinkAvailability").innerHTML = "No";
      break;
    } else {
      document.getElementById("los").innerHTML = "Yes";
      document.getElementById("reportlos").innerHTML = "Yes";
      document.getElementById("los").style.color = "Green";
      ptppolyline.setOptions({ strokeColor: "Green" });
      document.querySelector("#availabilityValue").style.display = "table-cell";
      document.querySelector("#msg").style.display = "none";
    }
  }

  // chart options
  var options = {
    width: 400,
    height: 200,
    interpolateNulls: true,
    lineWidth: 1,
    colors: ["#037385", "#350964", "#350964", "#ff0000"],
    hAxis: {
      title: "Distance (in Km) ",
    },
    vAxis: {
      title: "Elevation (in m)",
    },
    legend: "none",
    seriesType: "line",
    series: { 0: { type: "area" }, 3: { type: "bars" } },
  };

  // Chart constructor for the main page of the website
  chart = new google.visualization.ComboChart(
    document.getElementById("ptpchart")
  );

  // drawing the Main chart
  chart.draw(obstructionJoined, options);
}

function ObsChartWithHt() {
  // getting Obstruction data from function
  var data4 = gettingObsDataFromUL();

  // calling the parameters required for the updation of chart after height change
  var dist = parseFloat(document.getElementById("linkDistance").innerHTML);
  var rad = parseFloat(document.getElementById("fresnelRadius").innerHTML); // minor axis radius fresnel radius
  var ht1 = parseFloat(document.getElementById("aheight1").value);
  var ht2 = parseFloat(document.getElementById("aheight2").value);

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
  arr = [];
  distarray = [];
  stepsize = (dist * Math.pow(10, 3)) / 99;
  for (i = 0; i < 100; i++) {
    distarray.push(ellipsearray2[i][0]);
  }

  //  Elevation data both x values and y values
  for (i = 0; i < 100; i++) {
    arr.push([distarray[i], yelevptp[i]]);
  }

  //  Checking for clear Line of Sight
  // for (i = 0; i < yelevptp.length; i++) {
  //   if (ellipsearray2[i][1] > yelevptp[i]) {
  //     document.getElementById("los").innerHTML = "Yes";
  //     document.getElementById("reportlos").innerHTML = "Yes";
  //     document.getElementById("los").style.color = "Green";
  //     ptppolyline.setOptions({ strokeColor: "Green" });
  //     document.querySelector("#availabilityValue").style.display = "table-cell";
  //     document.querySelector("#msg").style.display = "none";
  //   } else {
  //     document.getElementById("los").innerHTML = "No";
  //     document.getElementById("reportlos").innerHTML = "No";
  //     document.getElementById("los").style.color = "Red";
  //     ptppolyline.setOptions({ strokeColor: "Red" });
  //     document.querySelector("#availabilityValue").style.display = "none";
  //     document.querySelector("#msg").style.display = "table-cell";
  //     break;
  //   }
  // }
  // we have obstruction in the chart so checking if obstruction is clear of the fresnel zone
  for (let k = 0; k < obsArray.length; k++) {
    index = obsindex[k];
    if (obsArray[k][1] > ellipsearray2[index][1]) {
      document.getElementById("los").innerHTML = "No";
      document.getElementById("reportlos").innerHTML = "No";
      document.getElementById("los").style.color = "Red";
      ptppolyline.setOptions({ strokeColor: "Red" });
      document.querySelector("#availabilityValue").style.display = "none";
      document.querySelector("#msg").style.display = "table-cell";
      document.getElementById("reportlinkAvailability").innerHTML = "No";
      break;
    } else {
      document.getElementById("los").innerHTML = "Yes";
      document.getElementById("reportlos").innerHTML = "Yes";
      document.getElementById("los").style.color = "Green";
      ptppolyline.setOptions({ strokeColor: "Green" });
      document.querySelector("#availabilityValue").style.display = "table-cell";
      document.querySelector("#msg").style.display = "none";
    }
  }
  //  Calculating the Antenna Tilt / Vertical Angle and populating them in the Link Installation Report
  vertical_angle = Math.atan((startY - endY) / dist);
  document.getElementById("reportTiltA").innerHTML =
    vertical_angle.toFixed(2) + "°";
  document.getElementById("reportTiltB").innerHTML =
    -vertical_angle.toFixed(2) + "°";

  // data 1 for the elevation
  var data = new google.visualization.DataTable();
  data.addColumn("number", "distance");
  data.addColumn("number", "elevation");
  data.addRows(arr);

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
  // Obstruction added
  obstructionJoined = google.visualization.data.join(
    ptpjoinedData,
    data4,
    "full",
    [[0, 0]],
    [1, 2, 3],
    [1]
  );

  // chart options
  var options = {
    width: 400,
    height: 200,
    interpolateNulls: true,
    lineWidth: 1,
    colors: ["#037385", "#350964", "#350964", "#ff0000"],
    hAxis: {
      title: "Distance (in Km) ",
    },
    vAxis: {
      title: "Elevation (in m)",
    },
    legend: "none",
    seriesType: "line",
    series: { 0: { type: "area" }, 3: { type: "bars" } },
  };

  // Chart constructor for the main page of the website
  chart = new google.visualization.ComboChart(
    document.getElementById("ptpchart")
  );

  // drawing the Main chart
  chart.draw(obstructionJoined, options);

  // chart making visible, hidden when cancel ptp pressed
  //  document.querySelector(".elevation-chart").style.display = "block";
}
