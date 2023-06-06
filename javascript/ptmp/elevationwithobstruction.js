// this javascript file contains code which updates the elevation chart with the obstruction data
var obsindexarray = [[], [], [], [], [], [], [], [], [], [], [], [], []];
var obsarray = [[], [], [], [], [], [], [], [], [], [], [], [], []];
function getdatafromobslist(i) {
  var obsarr = [];
  var index = [];
  // calling the correct list for the slave
  var obslist = document.querySelectorAll(`.obsli${i}`);
  Array.from(obslist).forEach(function (e) {
    var datasplit = e.textContent.split(",");
    var obsdist = datasplit[0];
    var obsheight = parseFloat(datasplit[1]);
    var diffarray = [];
    // elevation data
    var distelevationarr = distelevation[i];
    for (let j = 0; j < distelevationarr.length; j++) {
      var diff = (obsdist - distelevationarr[j][0]).toFixed(2);
      diffarray.push(Math.abs(diff));
    }
    /* index of the minimum difference between the distance entered by the
         user in obstruction and distance in elevation chart*/
    var indexmindiff = diffarray.indexOf(Math.min(...diffarray));
    console.log(
      `elevation at ${indexmindiff} is ${distelevationarr[indexmindiff]}`
    );
    var newobsheight = obsheight + distelevationarr[indexmindiff][1];
    obsarr.push([parseFloat(obsdist), parseFloat(newobsheight)]);
    index.push(indexmindiff);
  });
  obsarray[i] = obsarr;
  obsindexarray[i] = index;

  //   creating datatable so that we can plot the obstruction in chart
  obsdata = new google.visualization.DataTable();
  obsdata.addColumn("number", "distance");
  obsdata.addColumn("number", "obstruction");
  obsdata.addRows(obsarray[i]);

  return obsdata;
}

function updateElevationWithObstruction(i) {
  console.log("elevation after obstruction function");
  var data4 = getdatafromobslist(i);
  var lowerellipse = lowerellipsearray[i];
  obstructionjoined = google.visualization.data.join(
    alljoineddata[i],
    data4,
    "full",
    [[0, 0]],
    [1, 2, 3],
    [1]
  );
  // we have obstruction in the chart so checking if obstruction is clear of the fresnel zone
  for (let k = 0; k < obsindexarray[i].length; k++) {
    var obsdata = obsarray[i];
    var index = obsindexarray[i];
    if (obsdata[k][1] > lowerellipse[index[k]][1]) {
      $(`#LOS${i}1`).html("No");
      $(`#reportSlave${i}LOS0`).html("No");
      $(`#reportSlave${i}LOS1`).html("No");
      $(`#LOS${i}1`).css({ color: "red" });
      break;
    } else {
      $(`#LOS${i}1`).html("Yes");
      $(`#reportSlave${i}LOS0`).html("Yes");
      $(`#reportSlave${i}LOS1`).html("Yes");
      $(`#LOS${i}1`).css({ color: "green" });
    }
  }

  // checking if slave is in range then only we proceed to change the color of the line based on los
  var slaverange = document.getElementById(`In Range${i}1`).innerHTML;
  if (slaverange == "Yes") {
    if ($(`#LOS${i}1`).html() == "No") {
      polyLine[i].setOptions({ strokeColor: "Red" });
      reportPolyline[i].setOptions({ strokeColor: "Red" });
      console.log("Red line after ht change");
    } else if ($(`#LOS${i}1`).html() == "Yes") {
      console.log("Green line after ht change");
      polyLine[i].setOptions({ strokeColor: "Green" });
      reportPolyline[i].setOptions({ strokeColor: "Green" });
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
    document.getElementById(`slave${i}Elevation`)
  );

  chart.draw(obstructionjoined, options);
}
