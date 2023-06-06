// Global Variables
var masterAzimuthArray = [];
var polyLine = [];
var reportPolyline = [];
var marker = [];
var reportmarker = [];
var refertable, noisefloor;
var throughputArr = [[], []];

/*Function to create the fields in which we will enter the slaves co-ordinate details
 based on the used input of number of slaves that he want*/

function createSlavesCoordinateField() {
  // $("#reportButton").prop("disabled", false);
  $("#disabled-section").removeClass("disabled-class");
  // disabling the add slave button
  $(`#addSlaveButton`).prop("disabled", true);
  // deactivating the report button
  $("#reportButton").prop("disabled", true);

  var coordContainer = $("#slaveCoordSection");
  coordContainer.html("");
  $("#slavesInput").html("");

  // clearing the columns of the Master Table created previously
  var numOfCoordFields = $("#numberOfSlaves").val();
  var numOfCol = $("#masterTable tr:nth-child(1) th").length;
  if (numOfCol > 1) {
    $("#masterTable tr").each(function () {
      for (let i = 1; i < numOfCol; i++) {
        console.log("Deleted columns");
        this.cells[1].remove();
      }
    });

    // clearing the Markers when number of slaves changed
    for (let i = 1; i < numOfCol; i++) {
      if (marker[i] != undefined) {
        marker[i].setMap(null);
        reportmarker[i].setMap(null);
        polyLine[i].setMap(null);
        reportPolyline[i].setMap(null);
      }
      // Removing columns of Slaves in Installation Report
      $(`#slave${i}Row1`).remove();
      $(`#slave${i}Row2`).remove();
    }
  }

  for (let i = 1; i <= numOfCoordFields; i++) {
    var item = $("<div>", { class: "col-4 sidebar-padding" });
    coordContainer.append(item);
    // label for coord field
    coordlabel = $("<label>", { class: "label", html: `Slave${i}` });
    // input field foir the coordinate
    coordinput = $("<input>", {
      type: "text",
      id: `slave${i}Co-ordinate`,
      placeholder: "lat,long",
      name: `slave${i}`,
      class: "input",
    });
    ddcoordinput = $("<input>", {
      id: `slave${i}DDCoord`,
      class: "input",
      type: "hidden",
    });
    item.append(coordlabel, coordinput, ddcoordinput);
    createSlavesField(i);
  }

  // Event Listener on each newly created slave coordinate field whihc will trigger when the fields data will change

  slavesCount = numOfCoordFields;
  for (let i = 1; i <= slavesCount; i++) {
    /* event listener which when slave site field is focussed do not let us
     enter the details if Master details are not present*/
    $(`#slave${i}Co-ordinate`).focus(function () {
      if (marker[0] == undefined) {
        window.alert("Enter Master site details first");
        $(`#slave${i}Co-ordinate`).blur();
      }
    });
    document
      .querySelector(`#slave${i}Co-ordinate`)
      .addEventListener("change", function () {
        if (this.value.includes(",")) {
          var coordSlave = this.value.split(",");
          if (coordSlave[1] != "") {
            var [lat, long] = coordSlave;

            /*checking whether this field already had some data and a corresponding Marker to it
            if yes - we set Marker to null to be able to remove the last Marker and place a new one*/
            if (marker[i] != undefined) {
              marker[i].setMap(null);
              polyLine[i].setMap(null);
              reportmarker[i].setMap(null);
              reportPolyline[i].setMap(null);
              $(`#obsUL${i}`).html("");
            }
            // function which will check the format dms/dd of the coordinates
            checkSlaveFormat(lat, long, i);

            // checking whether lat long are in the lat long bounds for the country
            // checkSlaveBounds(lat, long, i);
          }
        }
      });
  }
}

// function to create slaves field
function createSlavesField(i) {
  // calling the main slave section in which slave 1,2 ,3 etc will be stored
  var slavecontainer = $("#slavesInput");
  // Main div for each slave section having border details
  var slaveSectionBody = $("<div>", { class: "slave-parameter-section" });

  // Div which carries the header and item div
  var slaveInputSection = $("<div>", {
    class: `slave${i}InputSection border-section`,
  });
  slaveInputSection.append(slaveSectionBody);

  // Input Header
  var inputHeader = $("<div>", {
    class: "sidebar-section-header",
    text: `Slave${i} Summary`,
  });
  slavecontainer.append(inputHeader, slaveInputSection);

  // div for each slave row INPUT
  var slavedivIn = $("<div>", { class: "row" }).appendTo(slaveSectionBody);
  inputArray = ["Radio", "Gain", "Tx Power", "Height"];
  var nameArray = ["Radio", "Gain", "Tx", "Height"];
  var unitArray = ["", "dBi", "dBm", "m"];
  for (let j = 0; j < inputArray.length; j++) {
    // creating a div with class item
    var slaveitem1 = $("<div>", { class: "col-3 sidebar-padding" }).appendTo(
      slavedivIn
    );
    // created a label for the slave name
    var slavelabel = $("<label>", {
      text: inputArray[j],
    });
    // created input field to enter the co-ordinates of the slaves
    switch (inputArray[j]) {
      case "Radio":
        var slaveinput = $("<select>", {
          class: "select",
          id: `slave${i}Radio`,
        });
        var optGroup1 = $("<optgroup>", {
          label: "Integrated Dish Antenna",
          class: "optGrp",
        }).appendTo(slaveinput);
        var optGroup2 = $("<optgroup>", {
          label: "Integrated Flat Panel Antenna",
          class: "optGrp",
        }).appendTo(slaveinput);
        var optGroup3 = $("<optgroup>", {
          label: "External Antenna",
        }).appendTo(slaveinput);

        radioList = {
          ion4l2: "23",
          ion4l2_CPE: "23",
          ion4l3: "25",
          ion4l3_CPE: "25",
          ion4l4: "27",
          ion4le: "",
          ion4le_CPE: "",
        };
        for (let [key, val] of Object.entries(radioList)) {
          var radioOption = document.createElement("option");
          radioOption.value = val;
          radioOption.innerHTML = key;
          if (key.includes("e")) {
            optGroup3.append(radioOption);
          } else if (key.includes("CPE")) {
            optGroup2.append(radioOption);
          } else {
            optGroup1.append(radioOption);
          }
          // slaveinput.add(radioOption);
        }
        // creating span for unit
        var span = $("<span>", { class: "unit", text: `${unitArray[j]}` });

        break;
      default:
        var slaveinput = $("<input>", {
          type: "number",
          id: `slave${i}` + nameArray[j],
          class: "input smallinput",
        });
        // creating span for unit
        var span = $("<span>", { class: "unit", text: `${unitArray[j]}` });
    }
    slaveitem1.append(slavelabel, slaveinput, span);
  }

  // Populating the value of antgain and txpower in the fields
  // $(`#slave${i}Radio`).prop("selectedIndex", 2);
  // $(`#slave${i}Gain`).prop({ disabled: true, value: 25 });
  // $(`#slave${i}Tx`).val(eirp - 25 + 2);
  $(`#slave${i}Height`).val(10);

  // function called to create slave output fields
  createOutputTables(slaveInputSection, slaveSectionBody, slavecontainer, i);
  // function to create the obstruction container
  addObstructionTable(slaveInputSection, i);
  // function to create the elevation div
  createElevationFields(slaveInputSection, i);
  // function to create divs for the current slave in Installation Report
  creatingReportDiv(i);

  /* gb i.e UK has an EIRP limit of 23 for the starting frequencies 
      whihc leaves us with a choice of only one device at slave end that 
      is ion4le as for other devices the antenna gain is higher than the eIRP value*/
  // calling functin which will make changes as per the EIRP limit needs
  var selectedCountry = $("#ctryCode").val();
  if (selectedCountry == "gb") {
    radiohidden(i);
  } else {
    radiovisible(i);
  }

  // event listener on Radio Fields of Slave and the Transmit Power Fields
  document
    .querySelector(`#slave${i}Radio`)
    .addEventListener("change", function () {
      var selection = $(`#slave${i}Radio option:selected`);
      var radioGain = parseInt(selection.val());
      // Changing the gain value
      document.getElementById(`slave${i}Gain`).value = radioGain;
      var radioType = selection.html();
      if (radioType.includes("le")) {
        $(`#slave${i}Gain`).prop("disabled", false);
        // emptying the entire calculation table
        var allspan = document.querySelectorAll(`.empty${i}`);
        for (let k = 0; k < allspan.length; k++) {
          allspan[k].innerHTML = "";
        }
        $(`#slave${i}Gain`).focus();
      } else {
        $(`#slave${i}Gain`).prop("disabled", true);
        // function which will calculate the tx power wrt the eirp
        slaveTx(i);
        if (document.getElementById(`slave${i}Co-ordinate`).value != "") {
          var masterAngle = parseFloat($("#masterAngle").val());
          var changedAngle = parseFloat(
            (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
          );
          calculateTx(changedAngle, i);
          calcSNR(i);
        }
      }
    });

  // Second event listener which gets fired when antenna gain for slave changes
  $(`#slave${i}Gain`).change(function () {
    var slaveGain = parseFloat($(`#slave${i}Gain`).val());
    var eirp = parseFloat($(`#eirpVal`).val());
    if (slaveGain >= eirp || slaveGain <= 0) {
      var allspan = document.querySelectorAll(`.empty${i}`);
      for (let k = 0; k < allspan.length; k++) {
        allspan[k].innerHTML = "";
      }
      $(`#slave${i}Gain`).focus();
      window.alert("Gain must be greater than 0 and less than EIRP. ");
    } else {
      // function which will calculate the tx power of the slave wrt the eirp
      slaveTx(i);
      if ($(`#slave${i}Co-ordinate`).val() != "") {
        var masterAngle = parseFloat($("#masterAngle").val());
        var changedAngle = parseFloat(
          (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
        );
        calculateTx(changedAngle, i);
        calcSNR(i);
        availability(i);
      }
    }
  });
  $(`#slave${i}Height`).change(function () {
    if ($(`#slave${i}Co-ordinate`).val() != "") {
      slaveHeightChange(i);
      availability(i);
    }
  });

  // Third event listener to change the parameters when tx power will change
  // This will not impact the calculations for the slave as slave tx power is used to calculate the rsl of Master
  $(`#slave${i}Tx`).change(function () {
    var slaveTx = parseFloat($(`#slave${i}Tx`).val());
    var maxTx = slaveMaxTxLimit[i];
    if (slaveTx >= 3 && slaveTx <= maxTx) {
      console.log(slaveTx, maxTx);
      if (document.getElementById(`slave${i}Co-ordinate`).value != "") {
        var masterAngle = parseFloat($("#masterAngle").val());
        var changedAngle = parseFloat(
          (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
        );
        calculateTx(changedAngle, i);
        calcSNR(i);
        availability(i);
      }
    } else {
      var allspan = document.querySelectorAll(`.empty${i}`);
      for (let k = 0; k < allspan.length; k++) {
        allspan[k].innerHTML = "";
      }
      $(`#slave${i}Tx`).val("");
      $(`#slave${i}Tx`).focus();
      window.alert(`Transmit Power for Slave ${i} is out of Range`);
    }
  });
}

function createOutputTables(
  slaveInputSection,
  slaveSectionBorder,
  slavecontainer,
  i
) {
  $("<div>", { id: `tableDiv${i}`, class: "table-responsive" }).appendTo(
    slaveInputSection
  );
  var labelArr = [
    ["Distance(Km)", "Fresnel Radius(m)"],
    ["Azimuth(°)", "RSL(dBm)"],
    ["SNR(dB)", "Fade Margin(dB)"],
    ["MCS", "Modulation"],
    ["FEC", "Link Rate(Mbps)"],
    ["Throughput(Mbps)", "LOS"],
    ["Link Availability(%)", "In Range"],
  ];
  var tableArr = [
    ["Distance", "Fresnel Radius"],
    ["Azimuth", "RSL"],
    ["SNR", "Fade Margin"],
    ["MCS", "Modulation"],
    ["FEC", "Link Rate"],
    ["Throughput", "LOS"],
    ["Link Availability", "In Range"],
  ];
  var unitsArray = [
    [" Km", " m"],
    ["°", " dBm"],
    [" dB", " dB"],
    ["", ""],
    ["", " Mbps"],
    [" Mbps", ""],
    ["%", ""],
  ];

  var classArray = [
    [`slave${i}span `, `slave${i}span `],
    [`slave${i}span `, `empty${i} slave${i}span `],
    [`empty${i} slave${i}span `, `empty${i} slave${i}span `],
    [`empty${i} slave${i}span `, `empty${i} slave${i}span `],
    [`empty${i} slave${i}span `, `empty${i} slave${i}span `],
    [`empty${i} slave${i}span `, `slave${i}span `],
    [`empty${i} slave${i}span `, `slave${i}span `],
  ];
  var tableArrLength = tableArr.length;
  $("<table>", { id: `slave${i}Table`, class: "link-summary table" }).appendTo(
    $(`#tableDiv${i}`)
  );
  $("<tbody>").appendTo(`#slave${i}Table`);
  for (let k = 0; k < tableArrLength; k++) {
    $("<tr>").appendTo($(`#slave${i}Table tbody`));
    for (let j = 0; j <= 1; j++) {
      $("<th>", { html: tableArr[k][j] }).appendTo(
        $(`#slave${i}Table tr:nth-child(${k + 1})`)
      );
      $("<span>", {
        id: tableArr[k][j] + `${i}1`,
        class: classArray[k][j],
      }).appendTo(
        $("<td>").appendTo($(`#slave${i}Table tr:nth-child(${k + 1})`))
      );
      $("<span>", { html: unitsArray[k][j] }).appendTo(
        $(`#slave${i}Table tr:nth-child(${k + 1}) td:nth-of-type(${j + 1})`)
      );
    }
  }
  // slaveSectionBorder.append(slaveInputSection);
  // slavecontainer.append(slaveSectionBorder);
}
function createElevationFields(slaveInputSection, i) {
  var elevationsection = $("<div>", { class: "slave-elevation-section" });
  var rowelevationsection = $("<div>", { class: "row me-0" });

  rowelevationsection.appendTo(elevationsection);
  var chartsection = $("<div>", {
    class: "ptmp-chart chart col-10 sidebar-padding",
    id: `slave${i}Elevation`,
  }).appendTo($("<div>", { class: "elevation-chart" }));

  var obstructionsection = $("<div>", {
    class: "editObstruction col-1 sidebar-padding",
    id: `slave${i}Obstruction`,
    html: "Edit",
  });

  rowelevationsection.append(chartsection, obstructionsection);

  slaveInputSection.append(elevationsection);

  // eventlistener to the edit div
  $(`#slave${i}Obstruction`).click(function () {
    console.log("hello");
    $(`#slave${i}ObsSection`).css("display", "block");
  });
}

// function to create output fields
function createOutputFields(
  slaveInputSection,
  slaveSectionBorder,
  slavecontainer,
  i
) {
  var outputheader = document.createElement("header");
  outputheader.innerHTML = "Outputs";
  // Slave Div for outputs/results
  var slaveDivOut = document.createElement("div");
  slaveDivOut.className = "outputsection";
  slaveDivOut.setAttribute("id", `slave${i}Outputs`);
  outputArray = [
    "HAngle",
    "Distance",
    "Fresnel",
    "RSL",
    "SNR",
    "Fade Margin",
    "MCS",
    "Modulation",
    "FEC",
    "Link Rate",
    "Throughput",
    "H Range",
    "V Range",
  ];
  for (let j = 0; j < outputArray.length; j++) {
    var slaveitem2 = document.createElement("div");
    slaveitem2.className = "item";
    // created a label for the slave name
    var slavelabel = document.createElement("LABEL");
    var text = document.createTextNode(outputArray[j]);
    slavelabel.appendChild(text);
    slavelabel.className = "label";
    var slaveoutput = document.createElement("span");
    slaveoutput.className = "slavespan";
    slaveoutput.setAttribute("id", `slave${i}` + outputArray[j]);

    slaveitem2.append(slavelabel, slaveoutput);
    slaveDivOut.append(slaveitem2);
  }
  slaveInputSection.append(slaveDivOut);
  slaveSectionBorder.append(slaveInputSection);
  slavecontainer.append(slaveSectionBorder);
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function rad2deg(rad) {
  return (rad * 180) / Math.PI;
}

// Function which will be called when the Button to calculate is clicked.
function masterChanged() {
  var numOfSlaves = $("#numberOfSlaves").val();
  if (numOfSlaves >= 2) {
    for (let i = 1; i <= numOfSlaves; i++) {
      if (marker[i] != null) {
        marker[i].setMap(null);
        polyLine[i].setMap(null);
        reportmarker[i].setMap(null);
        reportPolyline[i].setMap(null);
      }
      var slaveCoord = $(`#slave${i}Co-ordinate`).val();
      if (slaveCoord != "") {
        [lat, long] = slaveCoord.split(",");
        // Placing marker for each lat long of slave
        marker[i] = new google.maps.Marker({
          map: map,
          position: { lat: parseFloat(lat), lng: parseFloat(long) },
          icon: `images/${i}.png`,
        });
        reportmarker[i] = new google.maps.Marker({
          map: reportMap,
          position: { lat: parseFloat(lat), lng: parseFloat(long) },
          icon: `images/${i}.png`,
        });
        // bounds.extend({ lat: parseFloat(lat), lng: parseFloat(long) });
        // map.fitBounds(bounds);

        // Polyline
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
        // reportbounds.extend({ lat: parseFloat(lat), lng: parseFloat(long) });
        // reportMap.fitBounds(reportbounds);

        // calling the function which calculates the parameters
        azimuth(parseFloat(lat), parseFloat(long), i);
      }
    }
  }
}

// New function which only calculates azimuth angle dist and fresnel radius first
function azimuth(slavelat, slavelong, i) {
  // parameters required
  var masterAngle = parseFloat($("#masterAngle").val());
  /*checking whether we have Master co-ordinates or not, 
  as w/o master co-ordinates we cannot perfomr link budget calculations*/
  var master = document.querySelector("#masterDDCoord").value.split(",");
  var [masterlat, masterlong] = master;
  var cf = $("#channelFreq").val();

  // Degree to radian
  var masterLat = deg2rad(parseFloat(masterlat));
  var masterLong = deg2rad(parseFloat(masterlong));
  var slaveLat = deg2rad(slavelat);
  var slaveLong = deg2rad(slavelong);
  var diffLat = deg2rad(slavelat - parseFloat(masterlat));
  var diffLong = deg2rad(slavelong - parseFloat(masterlong));
  var R = 6371; //Radius of the earth in km

  // Hop Distance Calculation
  var a =
    Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
    Math.sin(diffLong / 2) *
      Math.sin(diffLong / 2) *
      Math.cos(masterLat) *
      Math.cos(slaveLat);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = Math.round(R * c * 100) / 100; // Distance in km
  // Populating the value of distance
  document.querySelector(`#Distance${i}1`).innerHTML = distance;
  $(`#reportSlave${i}Distance0`).html(distance);
  $(`#reportSlave${i}Distance1`).html(distance);

  // Azimuth Calculation
  var y = Math.sin(slaveLong - masterLong) * Math.cos(slaveLat);
  var x =
    Math.cos(masterLat) * Math.sin(slaveLat) -
    Math.sin(masterLat) * Math.cos(slaveLat) * Math.cos(slaveLong - masterLong);
  var bearing = Math.atan2(y, x);
  bearing = rad2deg(bearing);
  var anglea = ((bearing + 360) % 360).toFixed(2);
  var angleb = ((anglea - 180 + 360) % 360).toFixed(2);
  // converting master azimuth angle based on the master orientation angle
  var changedAngle = parseFloat((anglea - masterAngle + 360) % 360);
  masterAzimuthArray[i - 1] = anglea;

  // fresnel radius calculation
  var fres = (17.32 * Math.sqrt(distance / ((4 * cf) / 1000))).toFixed(2);

  //  Populating values if azimuth, hop distance and fresnel
  document.querySelector(`#Azimuth${i}1`).innerHTML = angleb;
  $(`#reportSlave${i}Azimuth1`).html(angleb);
  $(`#Azimuth${i}0`).html(masterAngle != 0 ? masterAngle : 0);
  $(`#reportSlave${i}Azimuth0`).html(masterAngle != 0 ? masterAngle : 0);
  $(`#reportMasterAzimuth`).html(masterAngle != 0 ? masterAngle : 0);

  document.getElementById(`Fresnel Radius${i}1`).innerHTML = fres;
  $(`#reportSlave${i}Fresnel0`).html(fres);
  $(`#reportSlave${i}Fresnel1`).html(fres);
  // document.querySelector(`#slave${i}RSL`).innerHTML = rsl;

  // function called to check whether slave is in Master Range
  slaveInMasterRange(changedAngle, i);

  // function called for elevation
  // getElevation(i);
}

function slaveInMasterRange(changedAngle, i) {
  var hopDist = document.querySelector(`#Distance${i}1`).innerHTML;
  // upper and below vertical limit
  var upVerticalRange = Math.tan((5 * Math.PI) / 180) * hopDist;
  upVerticalRange = (upVerticalRange * 1000).toFixed(3);
  var belowVerticalRange = -upVerticalRange;
  // document.getElementById(`slave${i}V Range`).innerHTML =
  //   upVerticalRange + "," + belowVerticalRange;
  // checking for the slave inclusion in the master beamwidth range

  if (
    (changedAngle < coverageAreaMaster[1] &&
      changedAngle > coverageAreaMaster[3]) ||
    (changedAngle > coverageAreaMaster[2] &&
      changedAngle < coverageAreaMaster[0])
  ) {
    document.querySelector(`#Azimuth${i}1`).style.color = "Green";
    if (hopDist <= 5) {
      document.getElementById(`In Range${i}1`).innerHTML = "Yes";
      document.getElementById(`In Range${i}1`).style.color = "Green";
      document.querySelector(`#Distance${i}1`).style.color = "Green";
      polyLine[i].setOptions({ strokeColor: "Green" });
      reportPolyline[i].setOptions({ strokeColor: "Green" });
      $(`#slave${i}Row1`).show();
      $(`#slave${i}Row2`).show();
    } else {
      document.getElementById(`In Range${i}1`).innerHTML = "No";
      document.getElementById(`In Range${i}1`).style.color = "Red";
      document.querySelector(`#Distance${i}1`).style.color = "Red";
      polyLine[i].setOptions({ strokeColor: "Red" });
      reportPolyline[i].setOptions({ strokeColor: "Red" });
      $(`#slave${i}Row1`).hide();
      $(`#slave${i}Row2`).hide();
    }
    // shift the calculateTx and calcSNR functions here if want calculations for only In RANGE slaves
  } else {
    document.querySelector(`#Azimuth${i}1`).style.color = "Red";
    document.getElementById(`In Range${i}1`).innerHTML = "No";
    document.getElementById(`In Range${i}1`).style.color = "Red";
    polyLine[i].setOptions({ strokeColor: "Red" });
    reportPolyline[i].setOptions({ strokeColor: "Red" });
    $(`#slave${i}Row1`).hide();
    $(`#slave${i}Row2`).hide();
    if (hopDist <= 5) {
      document.querySelector(`#Distance${i}1`).style.color = "Green";
    } else {
      document.querySelector(`#Distance${i}1`).style.color = "Red";
    }
  }

  // value of tx angle based on the master changed angle
  calculateTx(changedAngle, i);

  // calling function to calculate SNR and following parameters
  calcSNR(i);
}

// function which takes in the changed angle and gives the txpower based on the coverage of master
function calculateTx(angle, i) {
  var mRadio = parseFloat($("#masterRadio").val());
  var masterTx = parseFloat($("#masterTxPower").val());
  var slaveGain = parseFloat($(`#slave${i}Gain`).val());
  var slaveTx = parseFloat($(`#slave${i}Tx`).val());
  var hopDist = parseFloat($(`#Distance${i}1`).html());
  var cf = $("#channelFreq").val();
  var masterBeamwidth = parseInt($("#masterRadio").val().split(",")[1]);
  console.log(mRadio, masterTx, slaveGain, hopDist, cf);

  // upper lower limits of the angle on right and left side
  var halfBeam = masterBeamwidth / 2;
  var rightUpperLimit = halfBeam;
  var rightLowerLimit = halfBeam - 5;
  var leftLowerLimit = 360 - halfBeam;
  var leftUpperLimit = leftLowerLimit + 5;
  console.log(rightLowerLimit, rightUpperLimit, leftLowerLimit, leftUpperLimit);

  // Changing gain based on the angle
  if (
    (angle >= leftLowerLimit && angle <= leftUpperLimit) ||
    (angle >= rightLowerLimit && angle <= rightUpperLimit)
  ) {
    mRadio = mRadio * 0.2;
  }

  var eirpVal = [
    slaveTx + mRadio + slaveGain - 4,
    masterTx + mRadio + slaveGain - 4,
  ];
  console.log(eirpVal[0]);
  // Populating the values of RSL for Master and particular Slave
  var checkRange = document.getElementById(`In Range${i}1`).innerHTML;
  if (checkRange == "Yes") {
    for (let j = 0; j <= 1; j++) {
      var rsl =
        parseFloat(eirpVal[j]) -
        (20 * Math.log10(hopDist) + 20 * Math.log10(cf / 1000) + 92.45).toFixed(
          2
        );
      $(`#RSL${i}${j}`).html(rsl.toFixed(2));
      $(`#reportSlave${i}RSL${j}`).html(rsl.toFixed(2));
    }
  } else {
    for (let j = 0; j <= 1; j++) {
      $(`#RSL${i}${j}`).html("N/A");
      $(`#reportSlave${i}RSL${j}`).html("N/A");
    }
  }
}

// function to calculate snr, and calculations depending on snr.
function calcSNR(i) {
  var checkRange = document.getElementById(`In Range${i}1`).innerHTML;
  if (checkRange == "Yes") {
    for (let j = 0; j <= 1; j++) {
      var rsl = $(`#RSL${i}${j}`).html();
      // SNR
      snr = (parseFloat(rsl) + noisefloor).toFixed(2);

      // fademargin
      fademargin =
        parseFloat(rsl) -
        parseFloat(refertable.rows[2].cells.item(0).innerHTML);

      // mcs, modulation, etc
      var rowlength = document.getElementById("throughput20MHz").rows.length;
      for (let t = 1; t < rowlength; t++) {
        var min = refertable.rows[t].cells.item(0).innerHTML;
        var max = refertable.rows[t].cells.item(1).innerHTML;
        if (parseFloat(rsl) >= min && parseFloat(rsl) <= max) {
          var mcs = refertable.rows[t].cells.item(2).innerHTML;
          var modulation = refertable.rows[t].cells.item(3).innerHTML;
          var fec = refertable.rows[t].cells.item(4).innerHTML;
          var linkrate = refertable.rows[t].cells.item(5).innerHTML;
          var throughput = refertable.rows[t].cells.item(6).innerHTML;
        } else if (parseFloat(rsl) < min) {
          break;
        } else {
          continue;
        }
      }
      document.querySelector(`#SNR${i}${j}`).innerHTML = snr;
      $(`#reportSlave${i}SNR${j}`).html(snr);
      document.getElementById(`Fade Margin${i}${j}`).innerHTML =
        fademargin.toFixed(2);
      $(`#reportSlave${i}FadeMargin${j}`).html(fademargin.toFixed(2));
      document.querySelector(`#MCS${i}${j}`).innerHTML = mcs;
      $(`#reportSlave${i}MCS${j}`).html(mcs);
      document.querySelector(`#Modulation${i}${j}`).innerHTML = modulation;
      $(`#reportSlave${i}Modulation${j}`).html(modulation);
      document.querySelector(`#FEC${i}${j}`).innerHTML = fec;
      $(`#reportSlave${i}FEC${j}`).html(fec);
      document.getElementById(`Link Rate${i}${j}`).innerHTML = linkrate;
      $(`#reportSlave${i}LinkRate${j}`).html(linkrate);
      document.querySelector(`#Throughput${i}${j}`).innerHTML = throughput;
      $(`#reportSlave${i}Throughput${j}`).html(throughput);
      // Check for Radio if from CPE group
      // var actualthroughput = ($(`#slave${1}Radio option:selected`).html().includes("CPE")&& (throughput>300))? 300:throughput;
      if ($(`#slave${i}Radio option:selected`).html().includes("CPE")) {
        console.log("CPE Radio");
        if (throughput > 300) {
          $(`#Throughput${i}${j}`).html(300);
          $(`#reportSlave${i}Throughput${j}`).html(300);
        }
      }
      throughputArr[j][i - 1] =
        throughput == "N/A" ? 0 : parseInt(throughput) / 2;
    }
  } else {
    for (let j = 0; j <= 1; j++) {
      // Populating the value for out of Range slave
      document.querySelector(`#SNR${i}${j}`).innerHTML = "N/A";
      $(`#reportSlave${i}SNR${j}`).html("N/A");
      document.getElementById(`Fade Margin${i}${j}`).innerHTML = "N/A";
      $(`#reportSlave${i}FadeMargin${j}`).html("N/A");
      document.querySelector(`#MCS${i}${j}`).innerHTML = "N/A";
      $(`#reportSlave${i}MCS${j}`).html("N/A");
      document.querySelector(`#Modulation${i}${j}`).innerHTML = "N/A";
      $(`#reportSlave${i}Modulation${j}`).html("N/A");
      document.querySelector(`#FEC${i}${j}`).innerHTML = "N/A";
      $(`#reportSlave${i}FEC${j}`).html("N/A");
      document.getElementById(`Link Rate${i}${j}`).innerHTML = "N/A";
      $(`#reportSlave${i}LinkRate${j}`).html("N/A");
      document.querySelector(`#Throughput${i}${j}`).innerHTML = "N/A";
      $(`#reportSlave${i}Throughput${j}`).html("N/A");

      throughputArr[j][i - 1] = 0;
      console.log(throughputArr);
    }
  }

  // availability(i);
  // Elevation Chart
  // getElevation(i);

  // calling function which will calculate the ptmp throughput
  // throughputPTMP();
  var numOfSlaves = $(`#numberOfSlaves`).val();
  var lastSlaveThroughput = $(`#Throughput${eval(numOfSlaves)}1`).html();
  if (lastSlaveThroughput != "") {
    ptmpMasterThroughput();
    ptmpSlaveThroughput();
    ULDLThroughput();
  }
}

function availability(i) {
  numOfSlave = parseInt($("#numberOfSlaves").val());
  if (marker.length == numOfSlave + 1) {
    $("#reportButton").prop("disabled", false);
    $("#addSlaveButton").prop("disabled", false);
  }

  var checkRange = document.getElementById(`In Range${i}1`).innerHTML;
  var los = $(`#LOS${i}1`).html();
  if (checkRange == "Yes" && los == "Yes") {
    var masterHeight = parseFloat($("#masterHeight").val());
    var slaveHeight = parseFloat($(`slave${i}Height`).val());
    var linkDistance = parseFloat($(`#Distance${i}1`).html());
    var freq = parseFloat($("#channelFreq").val());
    var fadeMarginM = parseFloat(
      document.getElementById(`Fade Margin${i}0`).innerHTML
    );
    var fadeMarginS = parseFloat(
      document.getElementById(`Fade Margin${i}1`).innerHTML
    );
    var minFadeMargin = Math.min(fadeMarginM, fadeMarginS);
    var climateFactor = 0.5;
    var terrainFactor = 4;
    var outageDueToFading =
      terrainFactor *
      climateFactor *
      6 *
      Math.pow(10, -7) *
      (freq / 1000) *
      Math.pow(linkDistance, 3) *
      Math.pow(10, -(minFadeMargin / 10));
    var linkAvailability = (100 * (1 - 2 * outageDueToFading)).toFixed(4);
    console.log(linkAvailability);
    // here if MCS is N/A which can be because RSL is out of the accepted range then we cannot have link availaibility
    if ($(`#MCS${i}0`).html() == "N/A" || $(`#MCS${i}1`).html() == "N/A") {
      document.getElementById(`Link Availability${i}1`).innerHTML = "N/A";
      $(`#reportSlave${i}Availability0`).html("N/A");
      $(`#reportSlave${i}Availability1`).html("N/A");
      polyLine[i].setOptions({ strokeColor: "Red" });
      reportPolyline[i].setOptions({ strokeColor: "Red" });
      // hiding the sections for this slave in installation report
      $(`#slave${i}Row1`).hide();
      $(`#slave${i}Row2`).hide();
    } else {
      document.getElementById(`Link Availability${i}1`).innerHTML =
        linkAvailability;
      $(`#reportSlave${i}Availability0`).html(linkAvailability);
      $(`#reportSlave${i}Availability1`).html(linkAvailability);
      polyLine[i].setOptions({ strokeColor: "Green" });
      reportPolyline[i].setOptions({ strokeColor: "Green" });
      // hiding the sections for this slave in installation report
      $(`#slave${i}Row1`).show();
      $(`#slave${i}Row2`).show();
    }
  } else {
    document.getElementById(`Link Availability${i}1`).innerHTML = "N/A";
    $(`#reportSlave${i}Availability0`).html("N/A");
    $(`#reportSlave${i}Availability1`).html("N/A");
  }
}

//  function which will calculate the Master throughput based on weighted average method.
function ptmpMasterThroughput() {
  var masterSum = 0;
  throughputArr[0].forEach((x) => {
    masterSum += x;
  });
  var masterThroughputArrLength = throughputArr[0].length;
  for (let i = 1; i <= masterThroughputArrLength; i++) {
    var weightedPercent = throughputArr[0][i - 1] / masterSum;
    var weightedThroughput = (
      weightedPercent * throughputArr[0][i - 1]
    ).toFixed(2);
    var mThroughput = throughputArr[0][i - 1] != 0 ? weightedThroughput : "N/A";
    $(`#Throughput${i}0`).html(mThroughput);
  }
}
// function to calculte the Slave throughput based on weighted average method
function ptmpSlaveThroughput() {
  var slaveSum = 0;
  throughputArr[1].forEach((x) => {
    slaveSum += x;
  });
  var throughputArrLength = throughputArr[1].length;
  for (let i = 1; i <= throughputArrLength; i++) {
    var weightedPercent = throughputArr[1][i - 1] / slaveSum;
    var wtdThroughput = (weightedPercent * throughputArr[1][i - 1]).toFixed(2);
    var sThroughput = throughputArr[1][i - 1] != 0 ? wtdThroughput : "N/A";
    $(`#Throughput${i}1`).html(sThroughput);
  }
}
function ULDLThroughput() {
  var throughputArrLength = throughputArr[1].length;
  for (let i = 1; i <= throughputArrLength; i++) {
    // Master throughput as aggregate of Master slave throughput
    var masterThroughputDOM = $(`#Throughput${i}0`).html();
    var slaveThroughputDOM = $(`#Throughput${i}1`).html();
    if (masterThroughputDOM != "N/A" || slaveThroughputDOM != "N/A") {
      var totalThroughput = (
        parseFloat(masterThroughputDOM) + parseFloat(slaveThroughputDOM)
      ).toFixed(2);
      $(`#Throughput${i}1`).html(
        totalThroughput +
          "(" +
          masterThroughputDOM +
          "+" +
          slaveThroughputDOM +
          ")"
      );
      $(`#Throughput${i}0`).html(
        totalThroughput +
          "(" +
          masterThroughputDOM +
          "+" +
          slaveThroughputDOM +
          ")"
      );
      $(`#reportSlave${i}Throughput0`).html(masterThroughputDOM);
      $(`#reportSlave${i}Throughput1`).html(slaveThroughputDOM);
    }
  }
}
