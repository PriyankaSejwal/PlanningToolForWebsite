// javascript file containing function which will be called when certain parameters:
//  tx power, antenna gain, channel bw, frequency, height undergo a change

// Checking the value of the Master angle : to lie in 0 to 360 range.

function checkAngle() {
  var masterAngle = document.getElementById("masterAngle").value;
  if (masterAngle < 0 || masterAngle > 360) {
    window.alert("Master Angle can be in range 0 to 360");
  } else {
    setSectorBounds();
    if (marker[0] != undefined) {
      drawSector();
      checkMasterRange();
    }
  }
}

function checkMasterRange() {
  var numOfSlaves = document.getElementById("numberOfSlaves").value;
  if (numOfSlaves != "") {
    var masterAngle = parseFloat(document.querySelector("#masterAngle").value);
    for (let i = 1; i <= numOfSlaves; i++) {
      $(`#azimuth${i}0`).val(masterAngle);
      $(`#reportSlave${i}Azimuth0`).html(masterAngle);
      $(`#reportMasterAzimuth`).html(masterAngle);
      if (document.getElementById(`slave${i}Co-ordinate`).value != "") {
        console.log("Called in checkMasterRange");
        var changedAngle = parseFloat(
          (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
        );
        var hopDist = $(`#Distance${i}1`).html();
        // checking if the changed angle will make a change to the txpower and the calculations followed

        // This one to check for the Range

        // upper and below vertical limit
        var upVerticalRange = Math.tan((5 * Math.PI) / 180) * hopDist;
        upVerticalRange = (upVerticalRange * 1000).toFixed(3);
        var belowVerticalRange = -upVerticalRange;

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
        // checking if lOS unclear then polyline has to be red
        if ($(`#LOS${i}1`).html() == "No") {
          polyLine[i].setOptions({ strokeColor: "Red" });
          reportPolyline[i].setOptions({ strokeColor: "Red" });
        }
        calculateTx(changedAngle, i);
        //  calling function to calculate SNR etc
        calcSNR(i);
        availability(i);
      }
    }
  }
}

// Master changes
// when Master Radio changes

function masterRadioChanged() {
  // slavesinput is the div which contains the slaves, will check if it is empty or not to prceed
  slavesinput = $("#slavesInput").html();
  // master radio changed so gain changes
  var masterGain = parseFloat($("#masterRadio").val().split(",")[0]);
  // populating the gain field with new gain
  $("#masterAntGain").val(masterGain);
  // function which will calculate the transmit power of the Mäster when Master Radio is changed
  masterTx();
  // function called which will set new upper lower bounds for calculaitons
  setMasterLimits();

  /*below all functins have dependency over Master co-ordinates so we will have 
  them run only when we are sure that Master co-ordinates are entered by the user*/
  if (marker[0] != undefined) {
    // function which will find the coordinates (to the left and right of the los)to draw the sector
    setSectorBounds();
    // functin which will draw the sector in the map
    drawSector();
    if (slavesinput != "") {
      var numOfSlaves = document.querySelector("#numberOfSlaves").value;
      var masterAngle = parseFloat($("#masterAngle").val());
      for (let i = 1; i <= numOfSlaves; i++) {
        // Before proceeding check if the co-ordinate field of the slave is not empty.
        if (document.querySelector(`#slave${i}Co-ordinate`).value != "") {
          changedAngle = parseFloat(
            (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
          );
          slaveInMasterRange(changedAngle, i);
          availability(i);
        } else {
          continue;
        }
      }
    }
  }
}

// function to be called when transmit power is changed
function masterTxChange() {
  var masterTx = $(`#masterTxPower`).val();
  var maxMasterTx = slaveMaxTxLimit[0];
  if (masterTx >= 3 && masterTx <= maxMasterTx) {
    var masterAngle = parseFloat($("#masterAngle").val());
    var slavesinput = document.querySelector("#slavesInput").innerHTML;
    if (slavesinput != "") {
      var numOfSlaves = document.querySelector("#numberOfSlaves").value;
      // var bandwidth = document.querySelector("#channelBW").value;
      // var frequency = document.querySelector("#channelFreq").value;
      for (let i = 1; i <= numOfSlaves; i++) {
        if (document.querySelector(`#slave${i}Co-ordinate`).value != "") {
          changedAngle = parseFloat(
            (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
          );
          calculateTx(changedAngle, i);
          calcSNR(i);
          availability(i);
        } else {
          continue;
        }
      }
    }
  } else {
    window.alert("Master Transmit power out of range");
    $(`#masterTxPower`).val("");
    $(`#masterTxPower`).focus();
  }
}

// function called when bandwidth changed
function bandwidthChange() {
  // var bw = document.querySelector("#channelBW").value;
  // var masterAngle = parseFloat($("#masterAngle").val());
  var frequency = document.querySelector("#channelFreq").value;
  // var masterGain = parseFloat(document.querySelector("#masterRadio").value);
  // var masterTx = parseFloat(document.querySelector("#masterTxPower").value);
  var masterAngle = parseFloat($("#masterAngle").val());
  var numOfSlaves = document.querySelector("#numberOfSlaves").value;
  if (numOfSlaves != null) {
    for (let i = 1; i <= numOfSlaves; i++) {
      // Check if value of slave co-ordinate is not empty before proceeding
      if (document.querySelector(`#slave${i}Co-ordinate`).value != "") {
        var hopDist = parseFloat($(`#Distance${i}1`).html());
        // fresnel radius calculation
        var fres = (
          17.32 * Math.sqrt(hopDist / ((4 * frequency) / 1000))
        ).toFixed(2);
        // populating fresnel radius
        document.getElementById(`Fresnel Radius${i}1`).innerHTML = fres;
        var changedAngle = parseFloat(
          (masterAzimuthArray[i - 1] - masterAngle + 360) % 360
        );
        console.log(masterAngle, changedAngle);
        calculateTx(changedAngle, i);

        calcSNR(i);
        availability(i);
      } else {
        continue;
      }
    }
  }
}

// function called when channel frequency is changed
function frequencyChanged() {}

// GENERAL FUNCTION
