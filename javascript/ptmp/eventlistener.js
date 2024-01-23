// event listeners

$(`#resetptmpLink`).change(function () {
  resetptmp();
});

$(`#numberOfSlaves`).change(function () {
  createSlavesCoordinateField();
  createMasterTable();
});

$(`#channelBW`).change(function () {
  checkBandwidth();
  frequencydata();
  eirpcalculate();
  bandwidthChange();
});

$(`#channelFreq`).change(function () {
  eirpcalculate();
  bandwidthChange();
});

$(`#masterCo-ordinate`).change(function () {
  placeMasterOnMap();
});

$(`#masterAngle`).change(function () {
  checkAngle();
});

$(`#addSlaveButton`).change(function () {
  checkCurrentSlaveCount();
});
$(`#masterRadio`).change(function () {
  masterTx();
  masterRadioChanged();
});
$(`#masterTxPower`).change(function () {
  masterTxChange();
});
