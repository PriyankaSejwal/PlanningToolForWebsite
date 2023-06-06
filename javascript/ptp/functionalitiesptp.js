// Function to display the antenna gain column when ion4le is selected as the radio
//  gets called when radio is changed
// function selectedRadioA() {
//   // checking whether both the radios belong to the same family either UBAx or UB22
//   var radioType1 = $("#radio1 option:selected").html();
//   var radioType2 = $("#radio2 option:selected").html();
//   if (
//     (radioType1.includes("4l") && radioType2.includes("4l")) ||
//     (radioType1.includes("4xl") && radioType2.includes("4xl"))
//   ) {
//     var r1 = document.querySelector("#radio1");
//     var gain1 = document.querySelector("#antgain1");
//     var loss1 = document.getElementById("cableLoss1");
//     document.getElementById("antgain1").value = r1.value;
//     var radioA = r1.options[r1.selectedIndex];
//     var option_group = radioA.parentNode;
//     var gain1alert = document.querySelector(".gain1Alert");
//     var empty = document.querySelectorAll(".empty");
//     console.log(radioA.innerHTML);
//     // When external antenna selected then removing and adding certain functionalities.
//     if (option_group.label == "External Antenna") {
//       extRadio(gain1, loss1, gain1alert, empty);
//     } else {
//       otherRadio(gain1, loss1, gain1alert);
//       calcTxPower();
//     }
//   } else {
//     empty = document.querySelectorAll(".empty");
//     for (let i = 0; i < empty.length; i++) {
//       empty[i].innerHTML = "";
//     }
//     window.alert("Radios from same family required");
//   }
// }

// // Function to display the antenna gain column when ion4le is selected as the radio
// //  gets called when radio is changed
// function selectedRadioB() {
//   var radioType1 = $("#radio1 option:selected").html();
//   var radioType2 = $("#radio2 option:selected").html();
//   if (
//     (radioType1.includes("4l") && radioType2.includes("4l")) ||
//     (radioType1.includes("4xl") && radioType2.includes("4xl"))
//   ) {
//     var r2 = document.getElementById("radio2");
//     var gain2 = document.getElementById("antgain2");
//     var loss2 = document.getElementById("cableLoss2");
//     document.getElementById("antgain2").value = r2.value;
//     var radioB = r2.options[r2.selectedIndex];
//     var option_group = radioB.parentNode;
//     console.log(option_group.label);
//     var gain2alert = document.querySelector(".gain2Alert");
//     var empty = document.querySelectorAll(".empty");
//     // When ext antenna selected adding certain functionalities.
//     if (option_group.label == "External Antenna") {
//       extRadio(gain2, loss2, gain2alert, empty);
//     } else {
//       otherRadio(gain2, loss2, gain2alert);
//       calcTxPower();
//     }
//   } else {
//     empty = document.querySelectorAll(".empty");
//     for (let i = 0; i < empty.length; i++) {
//       empty[i].innerHTML = "";
//     }
//     window.alert("Radios from same family required");
//   }
// }

for (let i = 1; i <= 2; i++) {
  $(`#radio${i}`).change(function () {
    var radioType1 = $("#radio1 option:selected").html();
    var radioType2 = $("#radio2 option:selected").html();
    if (
      (radioType1.includes("4l") && radioType2.includes("4l")) ||
      (radioType1.includes("4xl") && radioType2.includes("4xl"))
    ) {
      $(`.radioAlert`).hide();
      var r = $(`#radio${i}`);
      var gain = $(`#antgain${i}`);
      var cableloss = $(`#cableLoss${i}`);
      $(`#antgain${i}`).val(r.val());
      var optionGroup = $(`#radio${i} option:selected`).parent().prop("label");
      var gainalert = $(`.gain${i}Alert`);
      var empty = document.querySelectorAll(`.empty`);
      if (optionGroup == "External Antenna") {
        extRadio(gain, cableloss, gainalert, empty);
      } else {
        otherRadio(gain, cableloss, gainalert);
        calcTxPower();
      }
    } else {
      empty = document.querySelectorAll(".empty");
      for (let i = 0; i < empty.length; i++) {
        empty[i].innerHTML = "";
      }
      $(`.radioAlert`).show();
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

// function whihc will check the bandwidth and will give value of noise floor and table for UBAX and normal table
var referencetable1, referencetable2;
function checkBandwidth() {
  var bw = parseInt($("#ptpchannelBandwidth").val());
  document.getElementById("reportbandwidth").innerHTML = bw;

  switch (bw) {
    case 10:
      noisefloor = 89;
      referencetable1 = document.getElementById("10MHz");
      referencetable2 = document.querySelector("#UBAX10MHz");
      break;
    case 20:
      noisefloor = 89;
      referencetable1 = document.getElementById("20MHz");
      referencetable2 = document.querySelector("#UBAX20MHz");
      break;
    case 40:
      noisefloor = 86;
      referencetable1 = document.getElementById("40MHz");
      referencetable2 = document.querySelector("#UBAX40MHz");
      break;
    case 80:
      noisefloor = 83;
      referencetable1 = document.getElementById("80MHz");
      referencetable2 = document.querySelector("#UBAX80MHz");
  }
}

function calcFresnel() {
  var f = document.getElementById("ptpchannelFrequency");
  var cf = parseFloat(f.options[f.selectedIndex].innerHTML);
  document.getElementById("reportfrequency").innerHTML = f.value;

  // Calculating fresnel zone radius
  var distance = parseFloat(document.getElementById("linkDistance").innerHTML);
  var fres = (17.32 * Math.sqrt(distance / ((4 * cf) / 1000))).toFixed(2);
  // var fres = (fres * 60) / 100;

  // Populating value of fresnel radius
  $(`#fresnelRadius`).html(fres);
  $(`#reportfresradius`).html(fres);
}

// Function to calculate the eirp using the eirp reference table

// function to calculate the max transmit power based on eirp and antenna gain
// function calcTxPower() {
//   var eirp = parseInt(document.getElementById("ptpeirpMax").value);
//   var antgainA = parseInt(document.getElementById("antgain1").value);
//   var antgainB = parseInt(document.getElementById("antgain2").value);
//   var cablelossA = parseInt(document.getElementById("cableLoss1").value);
//   var cablelossB = parseInt(document.getElementById("cableLoss2").value);
//   // var maxtxa = parseInt(document.getElementById("maxtransmitPower1").value);
//   // var maxtxb = parseInt(document.getElementById("maxtransmitPower2").value);

//   // Calculated tx power for A B sites
//   var txa = eirp - antgainA + cablelossA;
//   var txb = eirp - antgainB + cablelossB;

//   if (txa < 3) {
//     document.querySelector(".tx1Alert").style.display = "block";
//   } else {
//     document.querySelector(".tx1Alert").style.display = "none";
//     // tx power for calculation
//     if (maxtx < txa) {
//       txa = maxtx;
//     }
//     document.getElementById("transmitPower1").value = txa;
//     document.querySelector("#transmitPower1").max = txa;
//   }

//   if (txb < 3) {
//     document.querySelector(".tx2Alert").style.display = "block";
//   } else {
//     document.querySelector(".tx2Alert").style.display = "none";
//     if (maxtx < txb) {
//       txb = maxtx;
//     }
//     document.getElementById("transmitPower2").value = txb;
//     document.querySelector("#transmitPower2").max = txb;
//     deviceinfo();
//   }
// }

// function to calculate the max transmit power based on eirp and antenna gain
var maxTxArray = [];
function calcTxPower() {
  var eirp = parseInt($("#ptpeirpMax").val());
  for (let i = 1; i <= 2; i++) {
    var antgain = parseInt($(`#antgain${i}`).val());
    var cableloss = parseInt($(`#cableLoss${i}`).val());
    // var maxtxa = parseInt(document.getElementById("maxtransmitPower1").value);
    // var maxtxb = parseInt(document.getElementById("maxtransmitPower2").value);
    /* we will check whether antenna gain is lower than eirp or not if lower then we put 
    the same value else we update the antgain value according to eirp.*/
    antgain = antgain < eirp ? antgain : eirp - 1;
    $(`#antgain${i}`).val(antgain);

    // Calculated tx power for A B sites based on the eirp antenna gain and cable loss
    var tx = eirp - antgain + cableloss;

    if (tx < 3) {
      $(`.tx${i}Alert`).show();
    } else {
      $(".tx1Alert").hide();
      // tx power for calculation

      tx = tx > maxtx ? maxtx : tx;
      $(`#transmitPower${i}`).val(tx);
      $(`#transmitPower${i}`).prop("max", tx);
      maxTxArray[i] = tx;
    }
    deviceinfo();
  }
}

// Qeury Selector for when user changes the tx power, checking whether tx falls in 3-27.

for (let i = 1; i <= 2; i++) {
  document
    .querySelector(`#transmitPower${i}`)
    .addEventListener("change", function () {
      var txpower = this.value;
      if (txpower < 3 || txpower > maxTxArray[i]) {
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
      calcTxPower();
    }
  });
}

// New deviceinfo function

function deviceinfo() {
  // calling function checkBandwidth
  checkBandwidth();
  var dist = parseFloat(document.getElementById("linkDistance").innerHTML);
  if (document.getElementById("linkDistance").innerHTML != "") {
    var f = document.getElementById("ptpchannelFrequency");
    var freq = parseFloat(f.options[f.selectedIndex].innerHTML);
    var loss1 = parseInt(document.getElementById("cableLoss1").value);
    var loss2 = parseInt(document.getElementById("cableLoss2").value);
    var radio1 = parseInt(document.getElementById("radio1").value);
    var radio2 = parseInt(document.getElementById("radio2").value);
    var tx1 = parseInt(document.getElementById("transmitPower1").value);
    var tx2 = parseInt(document.getElementById("transmitPower2").value);
    // calculate EIRP value
    var eirpValue = [
      radio1 + radio2 + tx2 - loss1 - loss2,
      radio1 + radio2 + tx1 - loss1 - loss2,
    ];
    // a loop which will forward for site A and Site B and put calculated value
    for (let i = 1; i <= 2; i++) {
      var rsl = (
        eirpValue[i - 1] -
        (20 * Math.log10(dist) + 20 * Math.log10(freq / 1000) + 92.45)
      ).toFixed(2);

      console.log(
        "FSL: ",
        20 * Math.log10(dist) + 20 * Math.log10(freq / 1000) + 92.45
      );

      // SNR
      var snr = (parseFloat(rsl) + parseFloat(noisefloor)).toFixed(2);

      // checking the radio if ubax or not
      var radioName = $(`#radio${i} option:selected`).html();
      if (radioName.includes("x")) {
        var refertable = referencetable2;
        console.log("includes x", refertable);
      } else {
        var refertable = referencetable1;
      }

      // Fade Margin
      fademargin = (
        parseFloat(rsl) - parseFloat(refertable.rows[2].cells.item(0).innerHTML)
      ).toFixed(2);

      var rowlength = refertable.rows.length;
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

      // Populating the link setting values
      $(`#reportRadio${i}`).html(radioName);
      $(`#reportloss${i}`).html(eval("loss" + i));
      $(`#reporttx${i}`).html(eval("tx" + i));
      $(`#reportAntGain${i}`).html(eval("radio" + i));

      // Populating all the calculated value now in the fields
      // RSL
      document.getElementById(`rsl${i}`).innerHTML = rsl;
      document.getElementById(`reportrsl${i}`).innerHTML = rsl;
      // SNR
      $(`#snr${i}`).html(snr);
      $(`#reportsnr${i}`).html(snr);
      // Fade Margin
      $(`#fadeMargin${i}`).html(fademargin);
      // MCS
      $(`#mcs${i}`).html(mcs);
      // Modulation
      $(`#modulation${i}`).html(modulation);
      // FEC
      $(`#fec${i}`).html(fec);
      // Link Rate
      $(`#linkRate${i}`).html(linkrate);
      // Throughput
      $(`#throughput${i}`).html(throughput / 2);
      $(`#reportthroughput${i}`).html(throughput / 2);

      if (radioName.includes("CPE") && throughput > 300) {
        $(`#throughput${i}`).html(300 / 2);
        $(`#reportthroughput${i}`).html(300 / 2);
      }
    }
    availability();
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
  // console.log("link Availability: ", link_availability_due_to_multipath);

  // To be deleted
  // console.log(path_inclination);
  // console.log(flat_fade_margin);
  // console.log(fading_occurance_factor);
  // console.log(fade_depth);
  // console.log(flat_fade_exceeded_in_WM);
  // console.log(link_availability_due_to_multipath);

  //  populating the link availability column with the value calculated
  document.getElementById("reportlinkAvailability").innerHTML =
    linkAvailability.toFixed(4) + " ";
  document.getElementById("linkAvailability").innerHTML =
    linkAvailability.toFixed(4);
}
