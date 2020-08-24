let toLanguage = "de";
let translateeWord = decodeURI(document.URL.split('/').slice(-1)[0]).split('#')[0]; // Gets the last element of the url
console.log(translateeWord)

for (section of document.querySelectorAll('[title="Sinn und Bezeichnetes (Semantik)"]')) {
  debugger;

  console.log("\n\n\n")
  let backSearchElement = section;
  while(backSearchElement != null && backSearchElement.tagName != "H3") {
    backSearchElement = backSearchElement.previousElementSibling;
  }
  let gender = null;
  let partOfSpeech = null;
  if(backSearchElement != null) {
    gender = backSearchElement.childNodes[1].children[1].textContent;
    console.log(gender);
    partOfSpeech = backSearchElement.childNodes[1].children[0].textContent;
    console.log(partOfSpeech);
  }

  while(backSearchElement != null && backSearchElement.tagName != "H2") {
    backSearchElement = backSearchElement.previousElementSibling;
  }
  let fromLanguage = null;
  if (backSearchElement != null) {
    fromLanguage = backSearchElement.childNodes[1].childNodes[1].textContent;
    if(fromLanguage == 'Deutsch') {
      fromLanguage = "de"
    }
  }
  console.log(fromLanguage);

  for (row of section.nextElementSibling.childNodes) {
    if (row.localName != "dd") {
      continue;
    }

    console.log(row);

    let translatedWord = row.textContent.split('] ')[1].replace("  ", " ");

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
      if(partOfSpeech == "Substantiv") {
        translateInfo = "N" + gender;
      }
    }

    if(fromLanguage == "es" || fromLanguage == "fr") {
      if(partOfSpeech == "Substantiv") {
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
