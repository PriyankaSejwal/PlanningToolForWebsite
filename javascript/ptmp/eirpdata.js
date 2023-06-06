/* this javascript file contains functions which will help know the 
EIRP value based on the country and the channel frequency  */

// Global variable
// var eirp;
var maxtx;
var slaveMaxTxLimit = [];
function eirpcalculate() {
  var frequency = $("#channelFreq").val();
  var selectedCountry = $("#ctryCode").val();
  var bandwidth = $("#channelBW").val();
  if (frequency <= 5250) {
    eirp = eirparray[0].split(":")[0];
    maxtx = eirparray[0].split(":")[1] > 27 ? 27 : eirparray[0].split(":")[1];
  } else if (frequency <= 5345) {
    eirp = eirparray[1].split(":")[0];
    maxtx = eirparray[1].split(":")[1] > 27 ? 27 : eirparray[1].split(":")[1];
  } else if (frequency <= 5720) {
    eirp = eirparray[2].split(":")[0];
    maxtx = eirparray[2].split(":")[1] > 27 ? 27 : eirparray[2].split(":")[1];
  } else if (frequency > 5730) {
    eirp = eirparray[3].split(":")[0];
    maxtx = eirparray[3].split(":")[1] > 27 ? 27 : eirparray[3].split(":")[1];
    if (bandwidth == 10 && selectedCountry == "ng") {
      eirp = 33;
    }
  }
  $("#eirpVal").val(eirp);
  // function to calculate the Master tx power
  masterTx();
  // slave transmit power
  var numOfSlaves = $("#numberOfSlaves").val();
  if (numOfSlaves >= 2) {
    for (let i = 1; i <= numOfSlaves; i++) {
      slaveTx(i);
    }
  }
}

// function which will calculate the master transmit power when eirp is known
function masterTx() {
  var eirp = parseFloat($("#eirpVal").val());
  var antennagain = parseFloat($("#masterRadio").val().split(",")[0]);
  // var mastertx = parseFloat($("#masterTxPower").val());
  var cableloss = 2;
  // tx power basis the eirp antenna gain and cable loss
  var maxmastertxPower = eirp - antennagain + cableloss;
  // checking whether the tx power value in the Master tx power field is less tahn maxtx or not
  // if tx power value in fied is less than the maxtx then we keep the field value as replace with maxtx
  // txPower = mastertx < maxmastertxPower ? mastertx : maxmastertxPower;
  // now we will check the txpower with mx tx power allowed in the selected country
  var mastertxPower = maxmastertxPower > maxtx ? maxtx : maxmastertxPower;

  $("#masterTxPower").val(mastertxPower);
  slaveMaxTxLimit[0] = mastertxPower;
}
// function which calculates transmit power for each slave when eirp is known

function slaveTx(i) {
  var eirp = parseFloat($("#eirpVal").val());
  var antennaGain = parseFloat($(`#slave${i}Gain`).val());
  antennaGain = antennaGain < eirp ? antennaGain : eirp - 1;
  $(`#slave${i}Gain`).val(antennaGain);
  var cableloss = 2;
  // var slavetx = parseFloat($(`#slave${i}Tx`).val());
  var slavemaxTxPower = eirp - antennaGain + cableloss;
  // checking if slave tx value is smaller than the one calculated usig eirp
  // txPower = slavetx < slavemaxTxPower ? slavetx : slavemaxTxPower;
  // comparing slavetx with maxtx allowed in country
  var slavetxpower = slavemaxTxPower > maxtx ? maxtx : slavemaxTxPower;
  $(`#slave${i}Tx`).val(slavetxpower);
  slaveMaxTxLimit[i] = slavetxpower;
}

function radiohidden(i) {
  window.alert(
    "EIRP limit for UK is 23, radio with external antenna is default selection at Slave end, antenna gain of 22 is considered default which can be changed in the Slave Gain fields for each Slave."
  );
  // disabling all the other radio options
  var radiooptions = document.getElementsByClassName("optGrp");
  for (let j = 0; j < radiooptions.length; j++) {
    radiooptions[j].hidden = true;
  }
  // selecting ion4le radio
  $(`#slave${i}Radio`).prop("selectedIndex", 5);
  $(`#slave${i}Gain`).prop({ disabled: false, value: "22" });

  // slave transmit power calculating function
  slaveTx(i);
}

function radiovisible(i) {
  // disabling all the other radio options
  var radiooptions = document.getElementsByClassName("optGrp");
  for (let j = 0; j < radiooptions.length; j++) {
    radiooptions[j].hidden = false;
  }
  // selecting ion4le radio
  $(`#slave${i}Radio`).prop("selectedIndex", 1);
  $(`#slave${i}Gain`).prop({ disabled: true, value: 25 });

  // Slave transmit power calculating function
  slaveTx(i);
}
