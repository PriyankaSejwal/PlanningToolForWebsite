/*This javascript file contains code which generates the obstruction table for each slave, 
which will help in entering information about the elevation along path*/

function addObstructionTable(slaveInputSection, i) {
  var obstructiondiv = $("<div>", {
    class: "obstruction-section",
    id: `slave${i}ObsSection`,
  });
  var obstructionheader = $("<i>", {
    class: "fa-solid fa-xmark",
    id: `slave${i}ObsClose`,
  });

  obstructionheader.appendTo(
    $("<div>", { class: "modal-control" }).appendTo(
      $("<div>", {
        class: "obstruction-modal-title",
        html: "Obstruction Details",
      }).appendTo(
        $("<div>", { class: "obstructionHeader" }).appendTo(obstructiondiv)
      )
    )
  );
  var obstructionfield = $("<div>", { class: "row" }).appendTo(
    $("<div>", { class: "obstructionfield" }).appendTo(obstructiondiv)
  );

  //   creating three input fields in for loop whihc will be kep in div with class row.
  var obsarray = ["Distance(Km)", "Obstruction(m)", ""];
  var obsid = ["obsDist", "obsHeight", "addobs"];
  var obstype = ["text", "text", "button"];
  var text = ["", "", "Add"];
  var obsclass = [
    "col-5 sidebar-padding",
    "col-5 sidebar-padding",
    "col-2 sidebar-padding",
  ];
  for (let j = 0; j <= 2; j++) {
    var obsitem = $("<div>", { class: obsclass[j] }).appendTo(obstructionfield);
    var obslabel = $("<label>", { text: obsarray[j] });
    var obsinput = $("<input>", {
      type: obstype[j],
      id: obsid[j] + `${i}`,
      class: "input",
      val: text[j],
    });

    obsitem.append(obslabel, obsinput);
    obstructionfield.append(obsitem);
  }
  //   creating div to store the added values as list
  $("<ul>", { id: `obsUL${i}`, class: "obsul" }).appendTo(
    $("<div>", { class: "obstructionData" }).appendTo(obstructiondiv)
  );

  slaveInputSection.append(obstructiondiv);

  //   event listener to input with type submit
  $(`#slave${i}ObsClose`).click(function () {
    // function which will add the obstruction data in the table
    $(`#slave${i}ObsSection`).css("display", "none");
    // function which updates the elevation chart after the addition of the obstruction data
    updateElevationWithObstruction(i);
  });

  //   event listener to the submit button
  $(`#addobs${i}`).click(function () {
    console.log("add button gets clicked");
    addobstructioninlist(i);
  });
}

// add obstruction data that is enterd in the input fields to the list
function addobstructioninlist(i) {
  var obslist = $(`#obsUL${i}`);
  var obsvalue = $(`#obsHeight${i}`).val();
  var obsdist = parseFloat($(`#obsDist${i}`).val());
  var hopdist = parseFloat($(`#Distance${i}1`).html());
  if (obsdist <= hopdist) {
    var textli = obsvalue + ",  " + obsdist;
    if (textli === "") {
      console.log("no data");
    } else {
      var listitem = $("<li>", {
        text: obsdist + `,  ` + obsvalue,
        class: `obsli${i}`,
      }).appendTo(obslist);
    }

    //   creating close buttong which can help in removing the data if needed
    $("<span>", {
      text: "\u00D7",
      class: `deletelistitem${i} deleteobs`,
    }).appendTo(listitem);

    //  emptying the fields where data can be entered again for obstruction
    $(`#obsHeight${i}`).val(" ");
    $(`#obsDist${i}`).val(" ");
    $(`#obsHeight${i}`).css("background-color", "white");
    $(`#obsDist${i}`).css("background-color", "white");

    // Click on the close button to hide the current list item
    var close = document.getElementsByClassName(`deletelistitem${i}`);
    for (var j = 0; j < close.length; j++) {
      close[j].addEventListener("click", function () {
        var div = this.parentElement;
        console.log(div);
        document.querySelector(`#obsUL${i}`).removeChild(div);
      });
    }
  } else {
    //  emptying the fields where data can be entered again for obstruction
    $(`#obsHeight${i}`).val(" ");
    $(`#obsDist${i}`).val(" ");
    $(`#obsHeight${i}`).css("background-color", "white");
    $(`#obsDist${i}`).css("background-color", "white");
    window.alert(`Please enter obstruction till ${hopdist} Km.`);
  }
}
