// function which were called when the bandwidth or the frequency is changed

$("#ptpchannelBandwidth").change(function () {
  checkBandwidth();
  ptpfrequencydata();
  calcFresnel();
  calcTxPower();
});

$("#ptpchannelFrequency").change(function () {
  ptpeirpcalculate();
  // calc fresenel runs only whenn the distance value is present
  calcFresnel();
  calcTxPower();
});
