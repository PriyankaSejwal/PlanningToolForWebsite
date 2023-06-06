// When master height changed all the elevation charts would be affected

$("#masterHeight").change(function () {
  var numOfSlaves = $("#numberOfSlaves").val();
  for (let k = 1; k <= numOfSlaves; k++) {
    if ($(`#slave${i}Co-ordinate`).val() != "") {
      var elevationData = allElevation[k][0];
      console.log(elevationData);
      var dist = parseFloat($(`#Distance${k}1`).html());
      var rad = parseFloat(
        document.getElementById(`Fresnel Radius${k}1`).innerHTML
      );
      var htM = parseFloat($(`#masterHeight`).val());
      var htS = parseFloat($(`#slave${k}Height`).val());

      // x-ticks array
      var tickarr = [];
      var tickSize = dist / 4;
      for (var i = 0; i <= dist; i += tickSize) {
        tickarr.push(i.toFixed(2));
      }

      //   data array for the ellipse
      startX = 0;
      endX = dist * Math.pow(10, 3);
      startY = elevationData[0] + htM;
      endY = elevationData[99] + htS;
      console.log(elevationData[0], elevationData[99], startX, endX);

      ellipsearray1 = [];

      // steps for the angle to make the ellipse
      var step = (2 * Math.PI) / 198;
      // Radius of the major axis
      var a =
        Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) *
        0.5; // radius of major axis

      // angle of the rotation
      var w = Math.atan2(endY - startY, endX - startX);

      //for loop for 0 to 180 degree point of the ellipse
      for (i = 0; i <= Math.PI; i += step) {
        var xval = a * Math.cos(i);
        var yval = rad * Math.sin(i);
        var xnew =
          (startX + endX) / 2 + xval * Math.cos(w) - yval * Math.sin(w);
        var ynew =
          (startY + endY) / 2 + xval * Math.sin(w) + yval * Math.cos(w);
        ellipsearray1.push([xnew / 1000, ynew]);
      }
      //for loop for 180 to 360 degree point of the ellipse
      ellipsearray2 = [];
      for (i = Math.PI; i <= 2 * Math.PI; i += step) {
        var xval = a * Math.cos(i);
        var yval = rad * Math.sin(i);
        var xnew =
          (startX + endX) / 2 + xval * Math.cos(w) - yval * Math.sin(w);
        var ynew =
          (startY + endY) / 2 + xval * Math.sin(w) + yval * Math.cos(w);
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
        arr.push([distarray[i], elevationData[i]]);
      }

      // checking for clear line of sight

      for (let i = 0; i < elevationData.length; i++) {
        if (ellipsearray2[i][1] > elevationData[i]) {
          $(`#LOS${k}1`).html("Yes");
          $(`#reportSlave${k}LOS0`).html("Yes");
          $(`#reportSlave${k}LOS1`).html("Yes");
          $(`#LOS${k}1`).css({ color: "green" });
          // polyLine[k].setOptions({ strokeColor: "Green" });
          // reportPolyline[k].setOptions({ strokeColor: "Green" });
        } else {
          $(`#LOS${k}1`).html("No");
          $(`#LOS${k}1`).css({ color: "red" });
          $(`#reportSlave${k}LOS0`).html("No");
          $(`#reportSlave${k}LOS1`).html("No");
          // polyLine[k].setOptions({ strokeColor: "Red" });
          // reportPolyline[k].setOptions({ strokeColor: "Red" });
          break;
        }
      }
      // checking if slave is in range then only we proceed to change the color of the line based on los
      var slaverange = document.getElementById(`In Range${k}1`).innerHTML;
      if (slaverange == "Yes") {
        if ($(`#LOS${k}1`).html() == "No") {
          polyLine[k].setOptions({ strokeColor: "Red" });
          reportPolyline[k].setOptions({ strokeColor: "Red" });
          console.log("Red line after ht change");
        } else if ($(`#LOS${k}1`).html() == "Yes") {
          console.log("Green line after ht change");
          polyLine[k].setOptions({ strokeColor: "Green" });
          reportPolyline[k].setOptions({ strokeColor: "Green" });
        }
      }

      // data 1 for the elevation
      var data = new google.visualization.DataTable();
      data.addColumn("number", "distance");
      data.addColumn("number", "elevation");
      data.addRows(arr);

      // data 2 for half of the ellipse
      var data2 = new google.visualization.DataTable();
      data2.addColumn("number", "distance");
      data2.addColumn("number", "fresnel");
      data2.addRows(ellipsearray1);

      // data 3 for other half of the ellipse
      var data3 = new google.visualization.DataTable();
      data3.addColumn("number", "distance");
      data3.addColumn("number", "fresnel");
      data3.addRows(ellipsearray2);
      console.log(data, data2, data3);
      // joined data for elevation and first half of ellipse
      var joinedData1 = google.visualization.data.join(
        data,
        data2,
        "full",
        [[0, 0]],
        [1],
        [1]
      );

      // joined data for above and second half of ellipse
      joinedData2 = google.visualization.data.join(
        joinedData1,
        data3,
        "full",
        [[0, 0]],
        [1, 2],
        [1]
      );
      console.log(joinedData2);

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
          textStyle: { fontSize: 12 },
          viewWindowMode: "explicit",
        },
        legend: "none",
        seriesType: "line",
        series: { 0: { type: "area" } },
      };

      // Chart constructor for the main page of the website
      chart = new google.visualization.ComboChart(
        document.getElementById(`slave${k}Elevation`)
      );

      chart.draw(joinedData2, options);
    }
  }
});

// slave height changed then single elevatin chart gets affected.
function slaveHeightChange(iter) {
  var elevationData = allElevation[iter][0];
  console.log(elevationData);
  var dist = parseFloat($(`#Distance${iter}1`).html());
  var rad = parseFloat(
    document.getElementById(`Fresnel Radius${iter}1`).innerHTML
  );
  var htM = parseFloat($(`#masterHeight`).val());
  var htS = parseFloat($(`#slave${iter}Height`).val());

  // x-ticks array
  var tickarr = [];
  var tickSize = dist / 4;
  for (var i = 0; i <= dist; i += tickSize) {
    tickarr.push(i.toFixed(2));
  }

  //   data array for the ellipse
  startX = 0;
  endX = dist * Math.pow(10, 3);
  startY = elevationData[0] + htM;
  endY = elevationData[99] + htS;
  console.log(elevationData[0], elevationData[99], startX, endX);

  ellipsearray1 = [];

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
    ellipsearray1.push([xnew / 1000, ynew]);
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
    arr.push([distarray[i], elevationData[i]]);
  }

  // checking for clear line of sight
  for (let i = 0; i < elevationData.length; i++) {
    if (ellipsearray2[i][1] > elevationData[i]) {
      $(`#LOS${iter}1`).html("Yes");
      $(`#reportSlave${iter}LOS0`).html("Yes");
      $(`#reportSlave${iter}LOS1`).html("Yes");
      $(`#LOS${iter}1`).css({ color: "green" });
    } else {
      $(`#LOS${iter}1`).html("No");
      $(`#reportSlave${iter}LOS0`).html("No");
      $(`#reportSlave${iter}LOS1`).html("No");
      $(`#LOS${iter}1`).css({ color: "red" });
      break;
    }
  }

  // checking if slave is in range then only we proceed to change the color of the line based on los
  var slaverange = document.getElementById(`In Range${iter}1`).innerHTML;
  if (slaverange == "Yes") {
    if ($(`#LOS${iter}1`).html() == "No") {
      polyLine[iter].setOptions({ strokeColor: "Red" });
      reportPolyline[iter].setOptions({ strokeColor: "Red" });
      console.log("Red line after ht change");
    } else if ($(`#LOS${iter}1`).html() == "Yes") {
      console.log("Green line after ht change");
      polyLine[iter].setOptions({ strokeColor: "Green" });
      reportPolyline[iter].setOptions({ strokeColor: "Green" });
    }
  }

  // data 1 for the elevation
  var data = new google.visualization.DataTable();
  data.addColumn("number", "distance");
  data.addColumn("number", "elevation");
  data.addRows(arr);

  // data 2 for half of the ellipse
  var data2 = new google.visualization.DataTable();
  data2.addColumn("number", "distance");
  data2.addColumn("number", "fresnel");
  data2.addRows(ellipsearray1);

  // data 3 for other half of the ellipse
  var data3 = new google.visualization.DataTable();
  data3.addColumn("number", "distance");
  data3.addColumn("number", "fresnel");
  data3.addRows(ellipsearray2);
  console.log(data, data2, data3);
  // joined data for elevation and first half of ellipse
  var joinedData1 = google.visualization.data.join(
    data,
    data2,
    "full",
    [[0, 0]],
    [1],
    [1]
  );

  // joined data for above and second half of ellipse
  joinedData2 = google.visualization.data.join(
    joinedData1,
    data3,
    "full",
    [[0, 0]],
    [1, 2],
    [1]
  );
  console.log(joinedData2);

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
      textStyle: { fontSize: 12 },
      viewWindowMode: "explicit",
    },
    legend: "none",
    seriesType: "line",
    series: { 0: { type: "area" } },
  };

  // Chart constructor for the main page of the website
  chart = new google.visualization.ComboChart(
    document.getElementById(`slave${iter}Elevation`)
  );

  chart.draw(joinedData2, options);
}
