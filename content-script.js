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

// From https://stackoverflow.com/a/26927463
function isVowel(x) {
  return /[aeiouAEIOU]/.test(x);
}

function processWord(translateBox, translateInfo, language) {
  let word;

  if(translateBox.childNodes.length == 0) {
    word = translateBox.textContent;
  } else {
    word = Array.prototype.slice.call(translateBox.childNodes)
                .filter((node) => node.textContent != "" 
                               && node.className != "conjugate"
                               && node.className != "POS2"
                               && node.className != "tooltip POS2")
                .map((node) => node.textContent)
                .join("")
                .trim();
  }
  word = word.trim().replace("⇒","");

  if(language == "fr") {
    if(translateInfo == "nm") {
      word = "un ".concat(word)
    } else if(translateInfo == "nf") {
      word = "une ".concat(word)
    }
  }

  if(language == "en") {
    if(translateInfo.includes("vi") || translateInfo.includes("vtr")) {
      word = "to ".concat(word)
    }
    if(translateInfo == "n") {
      if(isVowel(word[0])) {
        return "an ".concat(word)
      } else {
        return "a ".concat(word)
      }
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
      word = "un ".concat(word)
    } else if(translateInfo == "nf") {
      word = "una ".concat(word)
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

    let translateeInfo = translateeRow.childNodes[0].querySelector(".POS2").childNodes[0].textContent;
    let translatedInfo = translatedRow.childNodes[2].querySelector(".POS2").childNodes[0].textContent;

    let translateeBox = translateeRow.children[0].firstChild;
    let translatedBox = translatedRow.children[2];

    let translatee = processWord(translateeBox, translateeInfo, fromLanguage);
    let translated = processWord(translatedBox, translatedInfo, toLanguage);

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
