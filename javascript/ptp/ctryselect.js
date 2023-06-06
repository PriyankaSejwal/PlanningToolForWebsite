var ptpeirparray;
function ptpctryChange() {
  // reset button now visible
  $("#ptp-container").removeClass("disable");
  $("#ptpresetLink").removeClass("disable");
  //   country selected
  var selectedCountry = $("#ptpctryCode option:selected").html();
  var cCode = $("#ptpctryCode").val();
  // Resetting the previously entered information if any link was planned.
  document.querySelector("#resetForm").reset();
  clearOverlays();
  if (ptppolyline != null) {
    ptppolyline.setMap(null);
  }
  // Clearing the calculation table and hiding the elevation
  var reset = document.querySelectorAll(".resetTable");
  for (var i in reset) {
    reset[i].innerHTML = "";
  }

  // document.querySelector(".elevation-chart").style.display = "none";
  $(".editPencil").hide();
  document.getElementById("ptpchart").innerHTML = "";

  // Entering the Country details in the Installation Report
  document.getElementById("reportCountryA").innerHTML = document.getElementById(
    "reportCountryB"
  ).innerHTML = selectedCountry;

  // IF CTRY IS NO COUNTRY
  if (cCode == "nd") {
    ptpmap.setZoom(5);
    $("#eirplevel").hide();
  } else {
    $("#eirplevel").show();
  }
  // calculation start
  ptpeirparray = ptpeirplimits(cCode);
  console.log(ptpeirparray);
  /* calling function which gives us the array for the frequency range 
  and further calls a funciton which creates frequency array*/
  ptpfrequencydata();
}

/* function which takes in argument code which is the country code and matches that code with the dictionary
 key of the country and returns the eirp array value and centers the map in the selected country */
function ptpeirplimits(code) {
  for (var [key, value] of Object.entries(ptp_country_dict)) {
    if (key == code) {
      var valuesplit = value.split(",");
      var latitude = parseFloat(valuesplit[0]);
      var longitude = parseFloat(valuesplit[1]);
      ptpmap.setCenter({ lat: latitude, lng: longitude });
      ptpmap.setZoom(7);
      return [
        valuesplit[2],
        valuesplit[3],
        valuesplit[4],
        valuesplit[5],
        valuesplit[6],
        valuesplit[7],
        valuesplit[8],
        valuesplit[9],
        valuesplit[10],
        valuesplit[0],
        valuesplit[1],
      ];
    }
  }
}
/* function which will populate the frequency dropdown menu depending on the country selected */
var frequencyarray;
function ptpfrequencydata() {
  var stepsize = 5;
  var bandwidth = $("#ptpchannelBandwidth").val();
  // var frequency = $("#channelFreq");
  var frequencyCode = ptpeirparray[4];
  if (frequencyCode == " ind") {
    if (bandwidth == 10) {
      var arr = [5155, 5870];
    } else if (bandwidth == 20) {
      var arr = [5160, 5865];
    } else if (bandwidth == 40) {
      var arr = [5170, 5855];
    } else if (bandwidth == 80) {
      var arr = [5190, 5835];
    } else if (bandwidth == 160) {
      var arr = [5550, 5645];
    }
  } else if (frequencyCode == " usa") {
    $("#10mhz").prop("disabled", true);
    if (bandwidth == 20) {
      var arr = [5160, 5240, 5735, 5865];
    } else if (bandwidth == 40) {
      var arr = [5170, 5230, 5745, 5855];
    } else if (bandwidth == 80) {
      var arr = [5190, 5210, 5765, 5835];
    }
  } else if (frequencyCode == " ru") {
    $("#10mhz").prop("disabled", true);
    if (bandwidth == 20) {
      stepsize = 20;
      var arr = [5180, 5320, 5660, 5720, 5745, 5825];
    } else if (bandwidth == 40) {
      stepsize = 40;
      var arr = [5190, 5310, 5670, 5710, 5755, 5795];
    } else if (bandwidth == 80) {
      stepsize = 80;
      var arr = [5210, 5290, 5690, 5690, 5775, 5775];
    }
  } else if (frequencyCode == " nig") {
    if (bandwidth == 10) {
      var arr = [5255, 5345, 5635, 5655, 5730, 5845];
    } else if (bandwidth == 20) {
      var arr = [5260, 5340, 5735, 5840];
    } else if (bandwidth == 40) {
      var arr = [5270, 5330, 5745, 5830];
    } else if (bandwidth == 80) {
      var arr = [5290, 5310, 5765, 5810];
    }
  } else if (frequencyCode == " aus") {
    if (bandwidth == 10) {
      var arr = [5175, 5325, 5740, 5810];
    } else if (bandwidth == 20) {
      var arr = [5180, 5320, 5745, 5805];
    } else if (bandwidth == 40) {
      var arr = [5190, 5310, 5755, 5795];
    } else if (bandwidth == 80) {
      var arr = [5210, 5290, 5775, 5775];
    }
  } else if (frequencyCode == " fcc1") {
    if (bandwidth == 10) {
      var arr = [5175, 5325, 5740, 5830];
    } else if (bandwidth == 20) {
      var arr = [5180, 5320, 5745, 5825];
    } else if (bandwidth == 40) {
      var arr = [5190, 5310, 5755, 5815];
    } else if (bandwidth == 80) {
      var arr = [5210, 5290, 5775, 5795];
    }
  } else if (frequencyCode == " fcc17") {
    if (bandwidth == 10) {
      var arr = [5175, 5325, 5495, 5725, 5740, 5830];
    } else if (bandwidth == 20) {
      var arr = [5180, 5320, 5500, 5720, 5745, 5825];
    } else if (bandwidth == 40) {
      var arr = [5190, 5310, 5510, 5710, 5755, 5795];
    } else if (bandwidth == 80) {
      var arr = [5210, 5290, 5530, 5690, 5775, 5775];
    }
  } else if (frequencyCode == " fcc3") {
    if (bandwidth == 10) {
      var arr = [5175, 5325, 5495, 5725, 5740, 5890];
    } else if (bandwidth == 20) {
      var arr = [5180, 5320, 5500, 5720, 5745, 5885];
    } else if (bandwidth == 40) {
      var arr = [5190, 5310, 5510, 5710, 5755, 5875];
    } else if (bandwidth == 80) {
      var arr = [5210, 5290, 5530, 5690, 5775, 5855];
    }
  } else if (frequencyCode == " etsi13") {
    if (bandwidth == 10) {
      var arr = [5175, 5325, 5495, 5705, 5740, 5870];
    } else if (bandwidth == 20) {
      var arr = [5180, 5320, 5500, 5700, 5745, 5865];
    } else if (bandwidth == 40) {
      var arr = [5190, 5310, 5510, 5670, 5755, 5835];
    } else if (bandwidth == 80) {
      var arr = [5210, 5290, 5530, 5610, 5775, 5775];
    }
  } else if (frequencyCode == " etsi1") {
    if (bandwidth == 10) {
      var arr = [5175, 5325, 5495, 5705];
    } else if (bandwidth == 20) {
      var arr = [5180, 5320, 5500, 5700];
    } else if (bandwidth == 40) {
      var arr = [5190, 5310, 5510, 5670];
    } else if (bandwidth == 80) {
      var arr = [5210, 5290, 5530, 5610];
    }
  } else if (frequencyCode == " kor") {
    if (bandwidth == 10) {
      var arr = [5175, 5325, 5495, 5625, 5740, 5810];
    } else if (bandwidth == 20) {
      var arr = [5180, 5320, 5500, 5620, 5745, 5805];
    } else if (bandwidth == 40) {
      var arr = [5190, 5310, 5510, 5610, 5755, 5795];
    } else if (bandwidth == 80) {
      var arr = [5210, 5290, 5530, 5590, 5775, 5775];
    }
  }
  frequencyarray = arr;
  console.log(arr);
  // calling function which will create data for the frequency dropdown
  createFreq(arr, stepsize);

  // function to give the eirp value
  ptpeirpcalculate();
}

// function to create new options in for the frequency dropdown
function createFreq(optarr, size) {
  var cf = document.getElementById("ptpchannelFrequency");
  // cf.value = optarr[0];
  cf.innerHTML = "";
  var array = [];
  for (i = 0; i < optarr.length; i += 2) {
    for (j = optarr[i]; j <= optarr[i + 1]; j += size) {
      array.push(j);
    }
  }
  for (opt in array) {
    var newoption = document.createElement("option");
    newoption.innerHTML = array[opt];
    newoption.value = array[opt];
    cf.options.add(newoption);
  }
}
