// Function which creates map
function initMap() {
  // Map options
  var options = {
    center: { lat: 28.7041, lng: 77.1025 },
    zoom: 3,
  };
  // New Map
  var map = new google.maps.Map(document.getElementById("indexmap"), options);
  //   ptpreportmap = new google.maps.Map(document.getElementById("ptpreportmap"), {
  //     center: { lat: 28.7041, lng: 77.1025 },
  //     zoom: 3,
  //   });
}
