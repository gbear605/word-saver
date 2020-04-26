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


function processWord(translateBox, translateInfo, language) {
  let word;
  if(translateBox.childNodes.length == 0) {
    word = translateBox.textContent;
  } else {
    word = Array.prototype.slice.call(translateBox.childNodes).filter((node) => node.textContent != "")[0].textContent;
  }
  word = word.trim().replace("⇒","");

  if(language == "fr") {
    if(translateInfo == "nm") {
      word = "un ".concat(word)
    } else if(translateInfo == "nf") {
      word = "une ".concat(word)
    }
  }

  if(language == "de") {
    if(translateInfo == "Nm") {
      word = "der ".concat(word)
    } else if(translateInfo == "Nn") {
      word = "das ".concat(word)
    } else if(translateInfo == "Nf") {
      word = "die ".concat(word)
    }
  }

  if(language == "es") {
    if(translateInfo == "nm") {
      word = "el ".concat(word)
    } else if(translateInfo == "nf") {
      word = "la ".concat(word)
    }
  }

  if (word.includes(", also UK")) {
    word = word.substring(0, word.indexOf(', also UK'));
  }

  return word;
}


function makeSaveWordFunction(translateeRow, translatedRow) {

  

  return function() {
    let langString = translateeRow.id.split(":")[0];
    let fromLanguage = langString[0] + langString[1];
    let toLanguage = langString[2] + langString[3];

    let translateeInfo = translateeRow.children[0].children[1].firstChild.textContent;
    let translatedInfo = translatedRow.children[2].children[0].firstChild.textContent;

    let translateeBox = translateeRow.children[0].firstChild;
    let translatedBox = translatedRow.children[2].firstChild;

    let translatee = processWord(translateeBox, translateeInfo, fromLanguage);
    let translated = processWord(translatedBox, translatedInfo, toLanguage);

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
