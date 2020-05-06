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

function processTranslateBox(translateBox) {

  if(translateBox.childNodes.length == 0) {
    return translateBox.textContent;
  } else {
    return Array.prototype.slice.call(translateBox.childNodes)
                .filter((node) => node.textContent != "" 
                               && node.className != "conjugate"
                               && node.className != "POS2"
                               && node.className != "tooltip POS2"
                               && node.localName != "span")
                .map((node) => node.textContent)
                .join("")
                .trim();
  }
}


function makeSaveWordFunction(translateeRow, translatedRow) {

  

  return function() {
    let langString = translateeRow.id.split(":")[0];
    let fromLanguage = langString[0] + langString[1];
    let toLanguage = langString[2] + langString[3];

    let translateeInfo = translateeRow.childNodes[0].querySelector(".POS2").childNodes[0].textContent;
    let translatedInfo = translatedRow.childNodes[2].querySelector(".POS2").childNodes[0].textContent;

    let translateeBox = translateeRow.children[0].firstChild;
    let translatedBox = translatedRow.children[2];

    let translatee = processWord(processTranslateBox(translateeBox), translateeInfo, fromLanguage);
    let translated = processWord(processTranslateBox(translatedBox), translatedInfo, toLanguage);

    console.log("Translated " + translatee + " to " + translated);
    if(typeof browser === 'undefined') {
      browser = chrome
    }
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
