// Event Listener for the address of the two sites
var lat, long, latL, latU, longL, longU, lat1, lat2, long1, long2;
var country = document.getElementById("ptpctryCode");
var selectedctry = country.options[country.selectedIndex].innerHTML;
var add1 = document.getElementById("add1");
var add2 = document.getElementById("add2");

// AUTOCOMPLETE FOR ADDRESS FIELD A and FIELD B
var autocomplete1 = new google.maps.places.Autocomplete(add1);
var autocomplete2 = new google.maps.places.Autocomplete(add2);

// Event listener on autocomplete
autocomplete1.addListener("place_changed", function () {
  lat1 = autocomplete1.getPlace().geometry["location"].lat().toFixed(6);
  long1 = autocomplete1.getPlace().geometry["location"].lng().toFixed(6);
  console.log("automplete A latlong:  ", lat1, long1);
  document.querySelector("#searchtower1").value = lat1 + ", " + long1;
  document.querySelector("#decimal1").value = lat1 + ", " + long1;
  if ($(`#searchtower1`).val() != "") {
    dmsddCheck(1);
  }
});

autocomplete2.addListener("place_changed", function () {
  lat2 = parseFloat(
    autocomplete2.getPlace().geometry["location"].lat().toFixed(6)
  );
  long2 = parseFloat(
    autocomplete2.getPlace().geometry["location"].lng().toFixed(6)
  );
  document.querySelector("#searchtower2").value = lat2 + ", " + long2;
  document.querySelector("#decimal2").value = lat2 + ", " + long2;
  dmsddCheck(2);
});
