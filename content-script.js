for (row of document.querySelectorAll("table.WRD > tbody > tr")) {
  if (row.className === "langHeader" || row.className === "wrtopsection") {
    continue;
  }

  if(row.children.length != 3) {
    continue;
  }

  let translateeRow = row;
  while(translateeRow.id == "" || translateeRow.id == undefined) {
    translateeRow = translateeRow.previousSibling;
  }
  console.log(translateeRow);
  
  var saveButton = document.createElement("input");
  saveButton.type = "button";
  saveButton.value = "Save";
  saveButton.onclick = makeSaveWordFunction(translateeRow,row);
  row.appendChild(saveButton);
}

function makeSaveWordFunction(translateeRow, translatedRow) {
  return function() {
    let langString = translateeRow.id.split(":")[0];
    let fromLanguage = langString[0] + langString[1];
    let toLanguage = langString[2] + langString[3];

    let translatee = translateeRow.children[0].firstChild.textContent.trim().replace("⇒","");
    let translated = translatedRow.children[2].firstChild.textContent.trim().replace("⇒","");
    if (translatee.includes(", also UK")) {
      translatee = translatee.substring(0, translatee.indexOf(', also UK'));
    }
    console.log("Saving word");
    if (translated.includes(", also UK")) {
      translated = translated.substring(0, translated.indexOf(', also UK'));
    }

    console.log("Translated " + translatee + " to " + translated);
    browser.runtime.sendMessage(
      {
        "translatee": translatee,
        "translated": translated,
        "fromLanguage": fromLanguage,
        "toLanguage": toLanguage
      }
    );
  }
}
