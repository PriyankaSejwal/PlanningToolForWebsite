// when the calculate button is clicked
$("#latLongBtn").click(function () {
  inputMarker();
});
for (let i = 1; i <= 2; i++) {
  $(`#radio${i}`).change(function () {
    var radioType1 = $("#radio1 option:selected").attr("class");
    var radioType2 = $("#radio2 option:selected").attr("class");
    var r = parseInt($(`#radio${i}`).val().split(",")[0]);
    // populating the value of the antenna gain in the gain field
    $(`#antgain${i}`).val(r);
    var gain = $(`#antgain${i}`);
    var cableloss = $(`#cableLoss${i}`);
    var optionGroup = $(`#radio${i} option:selected`).parent().prop("label");
    var gainalert = $(`.gain${i}Alert`);
    var empty = document.querySelectorAll(`.empty`);

    if (radioType1 == radioType2) {
      var currentClass = $(`#radio${i} option:selected`).attr("class");
      var previousClass = tablecontainer.split("-")[0];
      if (currentClass != previousClass) {
        /* function which checks the radios and gives the table to refer either ub22-table/ubax-table
       container*/
        checkRadios();
      }
      // hide the radio alert, if visible
      $(`.radioAlert`).hide();
    } else {
      $(`.radioAlert`).show();
    }
    // check whether the selected radio is an external radio or integrated
    if (optionGroup == "External Antenna") {
      extRadio(gain, cableloss, gainalert, empty);
    } else {
      otherRadio(gain, cableloss, gainalert);
      updateTransmitPower(i);
      deviceinfo();
    }
  });
}

function extRadio(gain, loss, gainAlert, empty) {
  gain.val("");
  gain.prop("disabled", false);
  gain.addClass("extAnt");
  loss.prop("disabled", false);
  loss.addClass("extAnt");
  ccode = $("#ptpctryCode").val();
  if (ccode == "nd") {
    gainAlert.hide();
  } else {
    gainAlert.show();
  }
  for (i in empty) {
    console.log(empty[i].innerHTML);
    empty[i].innerHTML = "";
  }
}
function otherRadio(gain, loss, gainAlert) {
  gain.prop("disabled", true);
  gain.removeClass("extAnt");
  loss.prop("disabled", true);
  loss.removeClass("extAnt");
  gainAlert.hide();
}

// function to convert the co-ordinates from degree to radian for calculations

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// function to convert radian to degree
// Converts from radians to degrees.
function rad2deg(rad) {
  return (rad * 180) / Math.PI;
}

//LINK DISTANCE AND AZIMUTH ANGLE
// function to calculate link distance, azimuth angle
function hopazimuth() {
  console.log("hopazimuth called");
  var arr = document.getElementsByClassName("towerinput");
  var latlongarr = [];
  Array.from(arr).forEach(function (e) {
    latlongarr.push(e.value.split(","));
  });
  var latA = latlongarr[0][0];
  var latB = latlongarr[1][0];
  var longA = latlongarr[0][1];
  var longB = latlongarr[1][1];
  var R = 6371; //Radius of the earth in km
  var deglat = deg2rad(latB - latA);
  var deglong = deg2rad(longB - longA);
  var deglat1 = deg2rad(latA);
  var deglat2 = deg2rad(latB);
  var deglong1 = deg2rad(longA);
  var deglong2 = deg2rad(longB);

  // Calculating hop distance/ link distance
  var a =
    Math.sin(deglat / 2) * Math.sin(deglat / 2) +
    Math.sin(deglong / 2) *
      Math.sin(deglong / 2) *
      Math.cos(deglat1) *
      Math.cos(deglat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = Math.round(R * c * 100) / 100; // Distance in km

  // Calculating azimuth angle
  var y = Math.sin(deglong2 - deglong1) * Math.cos(deglat2);
  var x =
    Math.cos(deglat1) * Math.sin(deglat2) -
    Math.sin(deglat1) * Math.cos(deglat2) * Math.cos(deglong2 - deglong1);
  var brng = Math.atan2(y, x);
  brng = rad2deg(brng);
  var anglea = Math.round((brng + 360) % 360);
  var angleb = Math.round((anglea - 180 + 360) % 360);
  // Populating the calculated values
  document.getElementById("linkDistance").innerHTML = distance;
  console.log(distance);
  document.getElementById("reportlinkdistance").innerHTML = distance;
  document.getElementById("reportHeadingA").innerHTML = anglea + "°";
  document.getElementById("reportHeadingB").innerHTML = angleb + "°";

  // fresneleirp();
}

// function to check the radio selected and update which table will be used
// const tablecontainerArray = [];
var tablecontainer;
function checkRadios() {
  var radioType1 = $("#radio1 option:selected").attr("class");
  // table for reference
  tablecontainer = radioType1 + "-table";
  // check bandwidth and the bandwidth based table
  checkBandwidth();
}

// function whihc will check the bandwidth and will give value of noise floor and table for UBAX and normal table
var referencetable, bandwidthLoss;
function checkBandwidth() {
  var bw = parseInt($("#ptpchannelBandwidth").val());
  $("#reportbandwidth").html(bw);

  switch (bw) {
    case 10:
      noisefloor = 89;
      referencetable = document.querySelector("#" + tablecontainer + "-10MHz");
      bandwidthLoss = 0;
      break;
    case 20:
      noisefloor = 89;
      referencetable = document.querySelector("#" + tablecontainer + "-20MHz");
      bandwidthLoss = 0;
      break;
    case 40:
      noisefloor = 86;
      referencetable = document.querySelector("#" + tablecontainer + "-40MHz");
      bandwidthLoss = 3;
      break;
    case 80:
      noisefloor = 83;
      referencetable = document.querySelector("#" + tablecontainer + "-80MHz");
      bandwidthLoss = 6;
  }
  console.log("Table used is:", referencetable);
}

function calcFresnel() {
  var f = document.getElementById("ptpchannelFrequency");
  var cf = parseFloat(f.options[f.selectedIndex].innerHTML);
  document.getElementById("reportfrequency").innerHTML = f.value;

  // Calculating fresnel zone radius
  var distance = document.getElementById("linkDistance").innerHTML;
  if (distance) {
    var fres = (17.32 * Math.sqrt(distance / ((4 * cf) / 1000))).toFixed(2);
    // var fres = (fres * 60) / 100;

    // Populating value of fresnel radius
    $(`#fresnelRadius`).html(fres);
    $(`#reportfresradius`).html(fres);
  }
}

// function to calculate the max transmit power based on eirp and antenna gain
var maxTxArray = [];
function calcTxPower() {
  var eirp = parseInt($("#ptpeirpMax").val());
  for (let i = 1; i <= 2; i++) {
    var [antgain, allowedTx] = $(`#radio${i}`).val().split(",");
    // allowed tx power as per the radio ubax-30 ub22-27
    allowedTx = parseFloat(allowedTx);
    antgain = parseFloat(antgain);
    var cableloss = parseInt($(`#cableLoss${i}`).val());

    // Calculated tx power for A B sites based on the eirp antenna gain and cable loss
    var txcalculated = eirp - antgain + cableloss;

    if (txcalculated < 3) {
      $(`.tx${i}Alert`).show();
    } else {
      $(".tx1Alert").hide();
      // tx power for calculation
      var maxtx = Math.min(txlimitctrybased, allowedTx, txcalculated);
      $(`#transmitPower${i}`).val(maxtx);
      $(`#transmitPower${i}`).prop("max", maxtx);
      maxTxArray[i] = maxtx;
    }
  }
  // device info is called but it will only run if the lat long details are there.
  deviceinfo();
}

// Query Selector for when user changes the tx power, checking whether tx falls in 3-27.

for (let i = 1; i <= 2; i++) {
  document
    .querySelector(`#transmitPower${i}`)
    .addEventListener("change", function () {
      var txpower = this.value;
      var maxtx = Number($(`#transmitPower${i}`).attr("max"));
      if (txpower < 3 || txpower > maxtx) {
        document.querySelector(`.tx${i}Alert2`).style.display = "block";
        empty = document.querySelectorAll(".empty");
        for (let j = 0; j < empty.length; j++) {
          empty[j].innerHTML = "";
        }
      } else {
        document.querySelector(`.tx${i}Alert2`).style.display = "none";
        deviceinfo();
      }
    });
  // event listener for cable loss change to check whether the entered value lies in the range of cable loss or not
  $(`#cableLoss${i}`).change(function () {
    var loss = Number($(`#cableLoss${i}`).val());
    if (loss < 0 || loss > 6) {
      $(`.cable${i}Alert`).show();
      // removing the calculations from the link summary table
      empty = document.querySelectorAll(".empty");
      for (let j = 0; j < empty.length; j++) {
        empty[j].innerHTML = "";
      }
    } else {
      $(`.cable${i}Alert`).hide();
      updateTransmitPower(i);
      deviceinfo();
    }
  });
}

// tx power after cable loss/ antenna gain or radio model changes
function updateTransmitPower(index) {
  var eirp = parseInt($("#ptpeirpMax").val());
  var antennaGain = parseInt($(`#antgain${index}`).val());
  var cableLoss = parseInt($(`#cableLoss${index}`).val());
  var radiobasedmaxtx = parseFloat($(`#radio${index}`).val().split(",")[1]);
  // var transmitPower = parseInt($(`#transmitPower${index}`).val());
  // calculate new transmit power based on the change in the cable loss/antenna gain or the radio model
  var txcalculated = eirp - antennaGain + cableLoss;
  var maxtxnew = Math.min(txlimitctrybased, radiobasedmaxtx, txcalculated);

  $(`#transmitPower${index}`).val(maxtxnew);
  // populate the changed value
  $(`#transmitPower${index}`).prop("max", maxtxnew);
  // maxTxArray[index] = tx;
  console.log(
    `when gain,loss or radio is changed, the transmit power limit now is: ${maxTxArray[i]}`
  );
}

// New deviceinfo function

function deviceinfo() {
  // calling function checkBandwidth
  var dist = parseFloat(document.getElementById("linkDistance").innerHTML);
  console.log("Function called but distance not there so cannot proceed");
  if (document.getElementById("linkDistance").innerHTML != "") {
    var f = document.getElementById("ptpchannelFrequency");
    var freq = parseFloat(f.options[f.selectedIndex].innerHTML);
    var loss1 = parseInt(document.getElementById("cableLoss1").value);
    var loss2 = parseInt(document.getElementById("cableLoss2").value);
    var gain1 = parseInt(document.getElementById("antgain1").value);
    var gain2 = parseInt(document.getElementById("antgain2").value);
    var tx1 = parseInt(document.getElementById("transmitPower1").value);
    var tx2 = parseInt(document.getElementById("transmitPower2").value);
    var radioName1 = $("#radio1 option:selected").attr("class");
    var radioName2 = $("#radio2 option:selected").attr("class");
    if (radioName1 == radioName2) {
      // populating the data

      $("#reporttx1").html(tx1);
      $("#reporttx2").html(tx2);
      $("#reportAntGain1").html(gain1);
      $("#reportAntGain2").html(gain2);
      $("#reportloss1").html(loss1);
      $("#reportloss2").html(loss2);

      // a loop which will forward for site A and Site B and put calculated value
      var snr = [],
        fademargin = [],
        mcs = [],
        modulation = [],
        fec = [],
        linkrate = [],
        throughput = [];

      var eirpVal = [
        gain1 + gain2 + tx2 - loss1 - loss2 - bandwidthLoss,
        gain1 + gain2 + tx1 - loss1 - loss2 - bandwidthLoss,
      ];

      var refertable = referencetable;
      var rowlength = refertable.rows.length;

      for (let i = 1; i <= 2; i++) {
        var rsl = (
          eirpVal[i - 1] -
          (20 * Math.log10(dist) + 20 * Math.log10(freq / 1000) + 92.45)
        ).toFixed(2);
        console.log(
          "Free space path loss is:",
          20 * Math.log10(dist) + 20 * Math.log10(freq / 1000) + 92.45
        );
        // update the value of rsl in the field
        $(`#rsl${i}`).html(rsl);
        $(`#reportrsl1`).html(rsl);
        $(`#reportrsl2`).html(rsl);
        snr.push((parseFloat(rsl) + parseFloat(noisefloor)).toFixed(2));

        for (let t = 1; t < rowlength; t++) {
          var sensitivity = parseFloat(
            refertable.rows[t].cells.item(0).innerHTML
          );
          console.log(
            `In loop ${i} Rsl calculated and sensitivity for row ${t} is ${rsl}, ${sensitivity}`
          );
          if (rsl < sensitivity) {
            console.log(
              `rsl calculated ${rsl} is smaller than sensitivity ${sensitivity}`
            );
            mcs.push(refertable.rows[t - 1].cells.item(1).innerHTML);
            modulation.push(refertable.rows[t - 1].cells.item(2).innerHTML);
            fec.push(refertable.rows[t - 1].cells.item(3).innerHTML);
            linkrate.push(refertable.rows[t - 1].cells.item(4).innerHTML);
            throughput.push(refertable.rows[t - 1].cells.item(5).innerHTML);
            fademargin.push(
              (
                parseFloat(rsl) -
                parseFloat(refertable.rows[t - 1].cells.item(0).innerHTML)
              ).toFixed(2)
            );
            break;
          } else if (rsl > 0 || rsl < -150) {
            console.log("The rsl didnot match sensitivity");
            mcs.push("N/A");
            modulation.push("N/A");
            fec.push("N/A");
            linkrate.push("N/A");
            throughput.push("N/A");
            break;
          }
        }
      }
      console.log("mcs array is:", mcs);

      if (mcs[0] == "N/A" || mcs[1] == "N/A") {
        for (let i = 1; i <= 2; i++) {
          $(`#snr${i}`).html("N/A");
          $(`#reportsnr${i}`).html("N/A");
          // Fade Margin
          $(`#fadeMargin${i}`).html("N/A");
          // MCS
          $(`#mcs${i}`).html("N/A");
          // Modulation
          $(`#modulation${i}`).html("N/A");
          // FEC
          $(`#fec${i}`).html("N/A");
          // Link Rate
          $(`#linkRate${i}`).html("N/A");
          // Throughput
          $(`#throughput${i}`).html("N/A");
          $(`#reportthroughput${i}`).html("N/A");
          // Link Availability
          $("#linkAvailability").html("N/A");
          $("#reportlinkAvailability").html("N/A");
        }
      } else {
        for (let i = 1; i <= 2; i++) {
          var radioName = $(`#radio${i} option:selected`).html();
          $(`#reportRadio${i}`).html(radioName);
          $(`#snr${i}`).html(snr[i - 1]);
          $(`#reportsnr${i}`).html(snr[i - 1]);
          // Fade Margin
          $(`#fadeMargin${i}`).html(fademargin[i - 1]);
          // MCS
          $(`#mcs${i}`).html(mcs[i - 1]);
          // Modulation
          $(`#modulation${i}`).html(modulation[i - 1]);
          // FEC
          $(`#fec${i}`).html("'" + fec[i - 1]);
          // Link Rate
          $(`#linkRate${i}`).html(linkrate[i - 1]);
          // Throughput
          $(`#throughput${i}`).html(throughput[i - 1] / 2);
          $(`#reportthroughput${i}`).html(throughput[i - 1] / 2);

          if (radioName.includes("CPE") && throughput > 300) {
            $(`#throughput${i}`).html(300 / 2);
            $(`#reportthroughput${i}`).html(300 / 2);
          }
        }
        availability();
      }
    }
  }
}

// A function to calculate the link throughtput based on the bandwidth selected by the user

function selectTable() {
  var r1 = document.getElementById("radio1");
  var radioName1 = r1.options[r1.selectedIndex].innerHTML;
  r2 = document.getElementById("radio2");
  var radioName2 = r2.options[r2.selectedIndex].innerHTML;
  var rsl1 = parseFloat(document.getElementById("rsl1").innerHTML);
  var rsl2 = parseFloat(document.getElementById("rsl2").innerHTML);

  var val = document.getElementById("ptpchannelBandwidth").value;
  var refertable;

  if (val == 10) {
    refertable = document.getElementById("throughput10MHz");
    var snr_1 = Math.round((rsl1 + 89) * 100) / 100;
    var snr_2 = Math.round((rsl2 + 89) * 100) / 100;
  } else if (val == 20) {
    refertable = document.getElementById("throughput20MHz");
    var snr_1 = Math.round((rsl1 + 89) * 100) / 100;
    var snr_2 = Math.round((rsl2 + 89) * 100) / 100;
  } else if (val == 40) {
    refertable = document.getElementById("throughput40MHz");
    var snr_1 = Math.round((rsl1 + 86) * 100) / 100;
    var snr_2 = Math.round((rsl2 + 86) * 100) / 100;
  } else if (val == 80) {
    refertable = document.getElementById("throughput80MHz");
    var snr_1 = Math.round((rsl1 + 83) * 100) / 100;
    var snr_2 = Math.round((rsl2 + 83) * 100) / 100;
  } else if (val == 160) {
    refertable = document.getElementById("throughput160MHz");
    var snr_1 = Math.round((rsl1 + 90) * 100) / 100;
    var snr_2 = Math.round((rsl2 + 90) * 100) / 100;
  }
  // Fade Margin Calculation
  var fademargin1 =
    Math.round((rsl1 - refertable.rows[1].cells.item(0).innerHTML) * 100) / 100;
  var fademargin2 =
    Math.round((rsl2 - refertable.rows[1].cells.item(0).innerHTML) * 100) / 100;

  document.getElementById("snr1").innerHTML = snr_1;
  document.getElementById("snr2").innerHTML = snr_2;
  // Populating the values in the Report
  document.getElementById("reportsnr1").innerHTML = snr_1;
  document.getElementById("reportsnr2").innerHTML = snr_2;
  document.getElementById("fadeMargin1").innerHTML = fademargin1;
  document.getElementById("fadeMargin2").innerHTML = fademargin2;
  document.getElementById("reportRadioA").innerHTML = radioName1;
  document.getElementById("reportRadioB").innerHTML = radioName2;

  var rowlength = refertable.rows.length;
  for (i = 1; i <= rowlength; i++) {
    var min = refertable.rows[i].cells.item(0).innerHTML;
    var max = refertable.rows[i].cells.item(1).innerHTML;
    if (rsl1 >= min && rsl1 <= max) {
      document.getElementById("mcs1").innerHTML =
        refertable.rows[i].cells.item(2).innerHTML + " ";
      document.getElementById("modulation1").innerHTML =
        refertable.rows[i].cells.item(3).innerHTML;
      refertable.rows[i].cells.item(3).innerHTML;
      document.getElementById("fec1").innerHTML =
        "FEC " + refertable.rows[i].cells.item(4).innerHTML;
      // form.fecA.value = refertable.rows[i].cells.item(4).innerHTML;
      // form.fecB.value = refertable.rows[i].cells.item(4).innerHTML;
      document.getElementById("linkRate1").innerHTML =
        refertable.rows[i].cells.item(5).innerHTML + " ";
      document.getElementById("throughput").innerHTML =
        refertable.rows[i].cells.item(6).innerHTML;
      if (radioName1.includes("CPE") || radioName2.includes("CPE")) {
        if (document.querySelector("#throughput").innerHTML > 300) {
          console.log("more than 300");
          document.querySelector("#throughput").innerHTML = 300;
        }
      }
      document.getElementById("reportthroughput").innerHTML =
        document.querySelector("#throughput").innerHTML;
      break;
    } else if (rsl1 < min) {
      break;
    } else {
      continue;
    }
  }
  for (i = 1; i <= rowlength; i++) {
    var min = refertable.rows[i].cells.item(0).innerHTML;
    var max = refertable.rows[i].cells.item(1).innerHTML;
    if (rsl2 >= min && rsl2 <= max) {
      document.getElementById("mcs2").innerHTML =
        refertable.rows[i].cells.item(2).innerHTML + " ";
      document.getElementById("modulation2").innerHTML =
        refertable.rows[i].cells.item(3).innerHTML;
      refertable.rows[i].cells.item(3).innerHTML;
      document.getElementById("fec2").innerHTML =
        "FEC " + refertable.rows[i].cells.item(4).innerHTML;
      // form.fecA.value = refertable.rows[i].cells.item(4).innerHTML;
      // form.fecB.value = refertable.rows[i].cells.item(4).innerHTML;
      document.getElementById("linkRate2").innerHTML =
        refertable.rows[i].cells.item(5).innerHTML + " ";
      document.getElementById("throughput").innerHTML =
        refertable.rows[i].cells.item(6).innerHTML;
      if (radioName1.includes("CPE") || radioName2.includes("CPE")) {
        if (document.querySelector("#throughput").innerHTML > 300) {
          console.log("more than 300");
          document.querySelector("#throughput").innerHTML = 300;
        }
      }
      document.getElementById("reportthroughput").innerHTML =
        document.querySelector("#throughput").innerHTML;
      break;
    } else if (rsl2 < min) {
      break;
    } else {
      continue;
    }
  }
  availability();
}

// Function to calculate LINK AVAILABILITY
function availability() {
  var anthta = parseFloat(document.getElementById("aheight1").value);
  var anthtb = parseFloat(document.getElementById("aheight2").value);
  var min_antht = Math.min(anthta, anthtb);
  var linkdist = parseFloat(document.getElementById("linkDistance").innerHTML);
  var path_inclination = Math.abs((anthta - anthtb) / linkdist);
  var f = document.getElementById("ptpchannelFrequency");
  var freq = parseFloat(f.options[f.selectedIndex].innerHTML);
  var flat_fade_margin1 = parseFloat(
    document.getElementById("fadeMargin1").innerHTML
  );
  var flat_fade_margin2 = parseFloat(
    document.getElementById("fadeMargin2").innerHTML
  );
  var flat_fade_margin = Math.min(flat_fade_margin1, flat_fade_margin2);
  // Availability as per Sir's Tool
  // var geoclimatic_factor = 0.00003647539;
  // var fading_occurance_factor =
  //   (geoclimatic_factor *
  //     linkdist ** 3.1 *
  //     (1 + path_inclination) ** -1.29 *
  //     (freq / 1000) ** 0.8 *
  //     10 ** (-0.00089 * min_antht - flat_fade_margin / 10)) /
  //   100;
  // var fade_depth = 25 + 1.2 * Math.log10(fading_occurance_factor);
  // var flat_fade_exceeded_in_WM = 1 - (1 - 2 * fading_occurance_factor);
  // var link_availability_due_to_multipath = (1 - flat_fade_exceeded_in_WM) * 100;

  // Availability as per ITU R P 530
  var terrain_fac = 4;
  var climate_fac = 0.5;
  var outageDueToFading =
    terrain_fac *
    climate_fac *
    6 *
    Math.pow(10, -7) *
    (freq / 1000) *
    Math.pow(linkdist, 3) *
    Math.pow(10, -(flat_fade_margin / 10));

  var linkAvailability = 100 * (1 - 2 * outageDueToFading);
  console.log("fading occurance factor", linkAvailability);

  //  populating the link availability column with the value calculated
  document.getElementById("reportlinkAvailability").innerHTML =
    linkAvailability.toFixed(4) + " ";
  document.getElementById("linkAvailability").innerHTML =
    linkAvailability.toFixed(4);
}
