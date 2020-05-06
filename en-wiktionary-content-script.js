for (section of document.querySelectorAll(".headword")) {
  for (row of section.parentNode.nextElementSibling.childNodes) {
    if (row.localName != "li") {
      continue;
    }

    debugger;

    console.log(row);

    let fromLanguage = row.parentElement.previousElementSibling.childNodes[0].lang;

    let toLanguage = document.URL.split("://")[1].split('.')[0];

    let translateeWord = row.parentElement.previousElementSibling.childNodes[0].textContent.replace("  ", " ");

    let partOfSpeech = row.parentElement.previousElementSibling.previousElementSibling.childNodes[0].textContent;

    let translateeGender = null;
    if(partOfSpeech == "Noun" && row.parentElement.previousElementSibling.childNodes.length > 2) {
      translateeGender = row.parentElement.previousElementSibling.childNodes[2].textContent;
    }
    let translatedWord = Array.prototype.slice.apply(  row.childNodes).filter((node) => node.localName != "dl" && node.localName != "ul").map(node => node.textContent).join("").trim().replace("  ", " ");

    console.log(partOfSpeech);

    var saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = "Save";
    saveButton.onclick = makeSaveWordFunction(toLanguage, fromLanguage, translateeWord, translatedWord, partOfSpeech, translateeGender);
    row.appendChild(saveButton);
  }
}

function makeSaveWordFunction(toLanguage, fromLanguage, translateeWord, translatedWord, partOfSpeech, gender) {
  return function() {

    let translateInfo;

    if(fromLanguage == "de") {
      if(partOfSpeech == "Noun") {
        translateInfo = "N" + gender;
      }
    }

    if(fromLanguage == "es" || fromLanguage == "fr") {
      if(partOfSpeech == "Noun") {
        translateInfo = "n" + gender;
      }
    }

    if(typeof translateInfo === 'undefined') {
      translateInfo = partOfSpeech; // We haven't handled this case
    }

    let translatee = processWord(translateeWord, translateInfo, fromLanguage);
    let translated = processWord(translatedWord, partOfSpeech, toLanguage);

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
