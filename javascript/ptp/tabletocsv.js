function downloadExport() {
  var selected = document.getElementById("ptpexports");
  var val = selected.options[selected.selectedIndex].innerHTML;
  console.log("val");
  if (val == "Print / Download") {
    var isChrome =
      navigator.userAgent.toLowerCase().indexOf("chrome") >= 0 ? true : false;
    if (isChrome) {
      printMaps();
    } else {
      window.print();
    }
  } else if (val == "Export To Excel") {
    exportToExcel();
  }
  document.getElementById("ptpexports").selectedIndex = 0;
}

function exportToExcel() {
  var elt = document.getElementById("tbl1");
  var elt2 = document.getElementById("tbl2");
  var elt3 = document.getElementById("tbl3");
  var elt4 = document.getElementById("tbl4");
  var rows = [[], [], []];
  for (var i = 0; i < elt.rows.length; i++) {
    column1 = elt.rows[i].cells[0].innerText;
    column2 = elt.rows[i].cells[1].innerText;
    column3 = elt.rows[i].cells[2].innerText;
    //   column3 = elt.rows[i].cells[2].innerHTML;
    //   column4 = elt.rows[i].cells[3].innerHTML;
    if (column3 == "") {
      rows[0].push(column1);
      rows[1].push(column2);
      rows[2].push(column2);
    } else {
      rows[0].push(column1);
      rows[1].push(column2);
      rows[2].push(column3);
    }
  }
  for (var i = 1; i < elt2.rows.length; i++) {
    column1 = elt2.rows[i].cells[0].innerText;
    column2 = String(elt2.rows[i].cells[1].innerText);
    column3 = String(elt2.rows[i].cells[2].innerText);
    if (column3 == "") {
      rows[0].push(column1);
      rows[1].push(column2);
      rows[2].push(column2);
    } else {
      rows[0].push(column1);
      rows[1].push(column2);
      rows[2].push(column3);
    }
  }
  for (var i = 0; i < elt3.rows.length; i++) {
    column1 = elt3.rows[i].cells[0].innerText;
    column2 = elt3.rows[i].cells[1].innerText;

    rows[0].push(column1);
    rows[1].push(column2);
  }
  for (var i = 0; i < elt4.rows.length; i++) {
    column1 = elt4.rows[i].cells[0].innerText;
    column2 = elt4.rows[i].cells[1].innerText;

    rows[2].push(column2);
  }
  console.log(rows);
  csvContent = "data:text/csv;charset=utf-8,\uFEFF";
  rows.forEach(function (rowArray) {
    row = rowArray.join(",");
    csvContent += row + "\r\n";
  });
  /* create a hidden <a> DOM node and set its download attribute */
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "PTP_Report.csv");
  document.body.appendChild(link);
  /* download the data file named "Stock_Price_Report.csv" */
  link.click();
  // Removing the created child a in the body.
  document.body.removeChild(link);
}

function printMaps() {
  var body = $("body");
  var reporthead = $(".ptpreportheader");
  var appendMap1 = $(".content1");
  var appendMap2 = $(".content2");
  var prependMap1 = $(".content4");
  var prependMap2 = $(".content5");
  var prependMap3 = $(".content6");
  var mapContainer = $(".content3");
  var printContainer = $('<div style="position:relative;">');
  var reportheadParent = $(".ptpreportheader").parent();
  var content1Parent = $(".content1").parent();
  var content2Parent = $(".content2").parent();
  var content3Parent = $(".content3").parent();
  var content4Parent = $(".content4").parent();
  var content5Parent = $(".content5").parent();
  var content6Parent = $(".content6").parent();

  printContainer

    .prepend(appendMap1)
    .prepend(appendMap2)
    .prepend(reporthead)
    .addClass("print-container")
    .css("position", "relative")
    .height(mapContainer.height())
    .append(prependMap1)
    .append(mapContainer)
    .append(prependMap2)
    .append(prependMap3)
    .prependTo(body);

  // Patch for some Bootstrap 3.3.x `@media print` styles. :|
  var patchedStyle = $("<style>")
    .attr("media", "print")
    .text(
      "img { max-width: none !important; }" + 'a[href]:after { content: ""; }'
    )
    .appendTo("head");

  window.print();
  reportheadParent.prepend(reporthead);
  content1Parent.prepend(appendMap1);
  content2Parent.prepend(appendMap2);
  content3Parent.prepend(mapContainer);
  content4Parent.prepend(prependMap1);
  content5Parent.prepend(prependMap2);
  content6Parent.prepend(prependMap3);

  printContainer.remove();
  patchedStyle.remove();
}
