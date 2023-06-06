function downloadExport() {
  var exportoption = $("#reportExport").val();
  if (exportoption == "print") {
    window.print();
  } else if (exportoption == "excel") {
    exportToExcel();
  }
  $("#reportExport").prop("selectedIndex", 0);
}

function exportToExcel() {
  var arr = [];
  var numSlaves = $("#numberOfSlaves").val();
  actualrows = parseInt(numSlaves) + 4;
  for (let i = 0; i <= actualrows; i++) {
    arr.push([]);
  }
  console.log(arr.length);

  // Master Summary Heading for Row 0
  arr[0].push("Master Summary");
  // Master data in table Row 1 and Row 2
  for (let i = 1; i <= $("#tbl1 tr").length; i++) {
    var column1 = $(`#tbl1 tr:nth-child(${i}) th`).text();
    var column2 = $(`#tbl1 tr:nth-child(${i}) td`).text();
    /* column 2 value is a table's td value, 
    sometimes the td has line breaks which is causing new lines in the excel, to remove that
     we are using ternary operastor to check the presence of new line in the td text*/
    var column2 = column2.includes("\n")
      ? column2.replaceAll(/[\n/ ]/g, "")
      : column2;
    arr[1].push(column1);
    arr[2].push(column2);
  }

  // Array 4 for the headers for Slave details
  arr[4] = [
    "Name",
    "Radio Type",
    "Latitude",
    "Longitude",
    "Antenna Gain",
    "Transmit Power",
    "Cable Loss",
    "Height",
    "Distance",
    "Fresnel Radius",
    "LOS",
    "DL Azimuth",
    "UL Azimuth",
    "DL RSL",
    "UL RSL",
    "DL SNR",
    "UL SNR",
    "DL Fade Margin",
    "UL Fade Margin",
    "DL MCS",
    "UL MCS",
    "DL Link Rate",
    "UL Link Rate",
    "DL Throughput",
    "UL Throughput",
    "Link Availability",
  ];
  var slaves = parseInt(numSlaves) + 5;
  for (let i = 5; i < slaves; i++) {
    arr[i].push(`Slave${i - 4}`);
    var checkRange = document.getElementById(`In Range${i - 4}1`).innerHTML;
    if (checkRange == "Yes") {
      for (let j = 1; j <= $(`#slave${i - 4}SummaryTable tr`).length; j++) {
        var column1 = $(
          `#slave${i - 4}SummaryTable tr:nth-child(${j}) th`
        ).text();
        var column2 = $(
          `#slave${i - 4}SummaryTable tr:nth-child(${j}) td`
        ).text();
        arr[i].push(column2);
      }
      // Stats Table
      for (let j = 2; j <= $(`#slave${i - 4}StatsTable tr`).length; j++) {
        var column1 = $(
          `#slave${i - 4}StatsTable tr:nth-child(${j}) th:nth-of-type(1)`
        ).text();
        var column2 = $(
          `#slave${i - 4}StatsTable tr:nth-child(${j}) td:nth-of-type(1)`
        ).text();
        var column3 = $(
          `#slave${i - 4}StatsTable tr:nth-child(${j}) th:nth-of-type(2)`
        ).text();
        var column4 = $(
          `#slave${i - 4}StatsTable tr:nth-child(${j}) td:nth-of-type(2)`
        ).text();

        // pushing into the array.
        if (j == 2 || j == 3 || j == 4 || j == 12) {
          arr[i].push(column2);
        } else {
          arr[i].push(column2, column4);
        }
      }
    } else {
      for (let j = 1; j < arr[4].length; j++) {
        arr[i].push("N/A");
      }
    }
  }
  console.log(arr);
  // Exporting to excel
  csvContent = "data:text/csv;charset=utf-8,\uFEFF";
  arr.forEach(function (rowArray) {
    row = rowArray.join(",");
    csvContent += row + "\r\n";
  });
  /* create a hidden <a> DOM node and set its download attribute */
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "P2MP_Report.csv");
  document.body.appendChild(link);
  /* download the data file named "P2MP_Report.csv" */
  link.click();
  // Removing the created child a in the body.
  document.body.removeChild(link);
}
