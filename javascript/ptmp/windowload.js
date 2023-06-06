var coverageAreaMaster = [[], [], [], []];
var sectorBound = [[], [], [], [], []];
window.onload = function () {
  checkBandwidth();
  setMasterLimits();
  setSectorBounds();
};

// function to check the bandwidth and sleect the optarray
function checkBandwidth() {
  var bnwdth = parseInt(document.querySelector("#channelBW").value);
  // var optarray;
  switch (bnwdth) {
    case 10:
      // optarray = [5155, 5825];
      noisefloor = 89;
      refertable = document.querySelector("#throughput10MHz");
      break;
    case 20:
      // optarray = [5160, 5815];
      noisefloor = 89;
      refertable = document.querySelector("#throughput20MHz");
      break;
    case 40:
      // optarray = [5170, 5805];
      noisefloor = 86;
      refertable = document.querySelector("#throughput40MHz");
      break;
    case 80:
      // optarray = [5190, 5785];
      noisefloor = 83;
      refertable = document.querySelector("#throughput80MHz");
  }
  // console.log(optarray);
  // createFreq(optarray);
}

// function to create frequencies
function createFreq(optarray, size) {
  console.log(optarray);
  var selectElement = document.getElementById("channelFreq");
  selectElement.innerHTML = "";
  var array = [];
  for (let i = 0; i < optarray.length; i += 2) {
    for (let j = optarray[i]; j <= optarray[i + 1]; j += size) {
      array.push(j);
    }
  }
  console.log(array);
  for (opt in array) {
    var newoption = document.createElement("option");
    newoption.innerHTML = array[opt];
    newoption.value = array[opt];
    selectElement.options.add(newoption);
  }
}
// functin to set the Master upper and lower limits for calculation
function setMasterLimits() {
  var masterBeamwidth = parseFloat($("#masterRadio").val().split(",")[1]);
  var halfBeam = masterBeamwidth / 2;
  coverageAreaMaster[0] = halfBeam; //   upper right limit
  coverageAreaMaster[1] = 360; //   upper left limit
  coverageAreaMaster[2] = 0; // lower right limit
  coverageAreaMaster[3] = 360 - halfBeam; //   lower left limit
  console.log(coverageAreaMaster);
}
// function to set the upper and lower bounds for the Sector around Master in Map
function setSectorBounds() {
  var masterBeamwidth = parseFloat($("#masterRadio").val().split(",")[1]);
  var masterOrientationAngle = parseFloat($("#masterAngle").val());
  var halfBeam = masterBeamwidth / 2;
  var halfOfHalfBeam = halfBeam / 2;
  console.log(halfBeam);
  sectorBound[0] = (masterOrientationAngle - halfBeam + 360) % 360; // lower left limit
  sectorBound[1] = masterOrientationAngle; // center Pt
  sectorBound[2] = (halfBeam + masterOrientationAngle + 360) % 360; //   upper right limit
  sectorBound[3] = (masterOrientationAngle - halfOfHalfBeam + 360) % 360; // left To center
  sectorBound[4] = (halfOfHalfBeam + masterOrientationAngle + 360) % 360; // rightTocenter
  console.log(sectorBound);
}
