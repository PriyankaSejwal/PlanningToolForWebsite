// Master coordinate when changed for the second or higher times

// Get input fields for coordinates
var sets;
var elevArray;
var yelev;
function createelevationAgain() {
  const numSets = $("#numberOfSlaves").val(); // number of slaves for network planning
  sets = [];
  for (let i = 1; i <= numSets; i++) {
    var coords = [[marker[0].getPosition(), marker[i].getPosition()]];
    sets.push(coords);
  }

  // Create arrays of promises for each set of coordinates
  const promisesArray = [];
  for (let i = 1; i <= numSets; i++) {
    const promises = sets[i - 1].map((coord) => {
      console.log("Coords: ", coord);
      return new Promise((resolve, reject) => {
        elevator.getElevationAlongPath(
          {
            path: [marker[0].getPosition(), marker[i].getPosition()],
            samples: 100,
          },
          (results, status) => {
            console.log("elevation done");
            if (status === "OK" && results[0]) {
              resolve(results);
              console.log(results);
            } else {
              reject(status);
            }
          }
        );
      });
    });
    promisesArray.push(promises);
    console.log(promisesArray);
  }

  // Wait for all promises to resolve
  Promise.all(promisesArray.map((promises) => Promise.all(promises)))
    .then((elevations) => {
      yelev = [];
      elevArray = [];
      for (let k = 0; k < numSets; k++) {
        yelev.push(elevations[k]);
      }
      for (let k = 0; k < numSets; k++) {
        elevdata = [];
        for (let i = 0; i <= 99; i++) {
          elevdata.push(yelev[k][0][i].elevation);
        }
        elevArray.push(elevdata);
      }

      // Process each set of elevations separately
      for (let i = 1; i <= numSets; i++) {
        const elevationsForSet = elevArray[i - 1];
        vals = i;
        // Create chart using elevationsForSet
        drawChart(elevationsForSet);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
