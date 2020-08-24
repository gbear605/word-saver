let toLanguage = "pl";
let translateeWord = decodeURI(document.URL.split('/').slice(-1)[0]).split('#')[0]; // Gets the last element of the url
console.log(translateeWord)

for (section of document.querySelectorAll('[data-field="znaczenia"]')) {
  debugger;

  console.log("\n\n\n")
  let backSearchElement = section.parentNode.parentNode;

  while(backSearchElement != null && backSearchElement.tagName != "H2") {
    backSearchElement = backSearchElement.previousElementSibling;
  }
  let fromLanguage = null;
  if (backSearchElement != null) {
    fromLanguage = backSearchElement.childNodes[1].childNodes[1].textContent;
    if(fromLanguage == 'język polski') {
      fromLanguage = "pl"
    } else if(fromLanguage == 'język niemiecki') {
      fromLanguage = "de"
    } else if(fromLanguage == 'język francuski') {
      fromLanguage = "fr"
    } else if(fromLanguage == 'język rosyjski') {
      fromLanguage = "ru"
    } else if(fromLanguage == 'język hiszpański') {
      fromLanguage = "es"
    }
  }
  console.log(fromLanguage);

  let wordInfo = section.parentNode.parentNode.nextElementSibling.textContent;
  let gender = null;
  if (wordInfo.includes('rodzaj żeński')) {
    gender = 'f'
  } else if (wordInfo.includes('rodzaj męski')) {
    gender = 'm';
  } else if (wordInfo.includes('rodzaj nijaki')) {
    gender = 'n';
  }
  console.log(gender);
  let partOfSpeech = null;
  partOfSpeech = wordInfo.split(', ')[0];
  console.log(partOfSpeech);

  for (row of section.parentNode.parentNode.nextElementSibling.nextElementSibling.childNodes) {
    if (row.localName != "dd") {
      continue;
    }

    console.log(row);

    let translatedWord = Array.from(row.childNodes).filter((node) => node.tagName != "STYLE").map((node) => node.textContent).join('').split(') ')[1].replace("  ", " ");

    var saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = "Save";
    saveButton.onclick = makeSaveWordFunction(toLanguage, fromLanguage, translateeWord, translatedWord, partOfSpeech, gender);
    row.appendChild(saveButton);
  }
}

function makeSaveWordFunction(toLanguage, fromLanguage, translateeWord, translatedWord, partOfSpeech, gender) {
  return function() {

    let translateInfo;

    if(fromLanguage == "de") {
      if(partOfSpeech == "rzeczownik") {
        translateInfo = "N" + gender;
      }
    }

    if(fromLanguage == "es" || fromLanguage == "fr") {
      if(partOfSpeech == "rzeczownik") {
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
