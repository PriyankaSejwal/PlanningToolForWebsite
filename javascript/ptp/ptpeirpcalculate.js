/* this javascript file contains functions which will help know the 
EIRP value based on the country and the channel frequency  */

// Global variable
// var eirp;
var maxtx;
function ptpeirpcalculate() {
  var frequency = $("#ptpchannelFrequency").val();
  var selectedCountry = $("#ptpctryCode").val();
  var bandwidth = $("#ptpchannelBandwidth").val();
  if (frequency <= 5250) {
    eirp = ptpeirparray[0].split(":")[0];
    maxtx =
      ptpeirparray[0].split(":")[1] > 27 ? 27 : ptpeirparray[0].split(":")[1];
  } else if (frequency <= 5345) {
    eirp = ptpeirparray[1].split(":")[0];
    maxtx =
      ptpeirparray[1].split(":")[1] > 27 ? 27 : ptpeirparray[1].split(":")[1];
  } else if (frequency <= 5720) {
    eirp = ptpeirparray[2].split(":")[0];
    maxtx =
      ptpeirparray[2].split(":")[1] > 27 ? 27 : ptpeirparray[2].split(":")[1];
  } else if (frequency > 5730) {
    eirp = ptpeirparray[3].split(":")[0];
    maxtx =
      ptpeirparray[3].split(":")[1] > 27 ? 27 : ptpeirparray[3].split(":")[1];
    if (bandwidth == 10 && selectedCountry == "ng") {
      eirp = 33;
    }
  }
  $("#ptpeirpMax").val(eirp);

  calcTxPower();
}
