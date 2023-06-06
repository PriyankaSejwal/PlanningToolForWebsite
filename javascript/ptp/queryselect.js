// Event Listener on the antenna gain at A input to read the change of value.

document.getElementById("antgain1").addEventListener("change", function () {
  var antgain1 = document.getElementById("antgain1").value;
  var eirp = parseInt(document.getElementById("ptpeirpMax").value);
  if (antgain1 > 0) {
    if (antgain1 < eirp) {
      var r1 = document.getElementById("radio1");
      r1.options[r1.selectedIndex].value = antgain1;
      // console.log(document.getElementById("radio1").value);
      document.querySelector(".gain1Alert").style.display = "none";
      calcTxPower();
    } else {
      antgain1 = 0;
      document.querySelector(".gain1Alert").style.display = "block";
    }
  } else {
    document.querySelector(".gain1Alert").style.display = "block";
  }
});

// Event Listener on the antenna gain at A input to read the change of value.

document.getElementById("antgain2").addEventListener("change", function () {
  var antgain2 = document.getElementById("antgain2").value;
  var eirp = parseInt(document.getElementById("ptpeirpMax").value);
  if (antgain2 > 0) {
    if (antgain2 < eirp) {
      var r2 = document.getElementById("radio2");
      r2.options[r2.selectedIndex].value = antgain2;
      document.querySelector(".gain2Alert").style.display = "none";
      calcTxPower();
    } else {
      antgain2 = 0;
      document.querySelector(".gain2Alert").style.display = "block";
    }
  } else {
    document.querySelector(".gain2Alert").style.display = "block";
  }

  // calculateRSL();
});

// Report Button
document.querySelector("#ptpreportbtn").addEventListener("click", function () {
  document.querySelector("#reportLinkName").value =
    document.querySelector("#linkName").value;

  //   document.querySelector(".ptpheader").style.display = "none";
});
// Report close button
document.getElementById("ptp-close-btn").addEventListener("click", function () {
  document.querySelector(".ptppopup").style.display = "none";
  //   document.querySelector(".ptpheader").style.display = "block";
});

// For reset button to reset the fields for another link planning iwthiun the same country.
document.getElementById("ptpresetLink").addEventListener("click", function () {
  document.querySelector("#resetForm").reset();
  clearOverlays();
  if (ptppolyline != null) {
    ptppolyline.setMap(null);
  }
  // again centering the map as when it was when the country was selected
  ptpmap.setCenter({
    lat: parseFloat(ptpeirparray[9]),
    lng: parseFloat(ptpeirparray[10]),
  });
  // Clearing the calculation table and hiding the elevation
  var reset = document.querySelectorAll(".resetTable");
  for (var i in reset) {
    reset[i].innerHTML = "";
  }

  document.getElementById("ptpreportbtn").disabled = true;

  //  Calling EIRP function to get the EIRP value lost during resetting the form.
  ptpfrequencydata();

  // document.querySelector(".elevation-chart").style.display = "none";
  $(".editPencil").hide();
  document.getElementById("ptpchart").innerHTML = "";

  /* if external antenna selected when planning extAnt class has been added to the 
  antenna gain and cable loss input, then need to remove the extAnt class*/
  for (let i = 1; i <= 2; i++) {
    $(`#antgain${i}`).removeClass("extAnt");
    $(`#cableLoss${i}`).removeClass("extAnt");
  }
});
