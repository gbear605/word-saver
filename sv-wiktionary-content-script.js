let toLanguage = document.URL.split("://")[1].split('.')[0];

for (section of document.querySelectorAll("p ~ ol")) {

  // Find the word
  
  let node = section;
  while(node != null && node.localName != "p") {
    node = node.previousElementSibling;
  }

  let translateeWord = node.childNodes[0].textContent;
  let genderNode = node.querySelector(".gender");
  let translateeGender = null;
  if(genderNode != null) {
    translateeGender = genderNode.textContent;
  }

  console.log(translateeGender)

  while(node != null && node.localName != "h3") {
    node = node.previousElementSibling;
  }
  let partOfSpeech = node.querySelector(".mw-headline").textContent;

  console.log(partOfSpeech);

  while(node != null && node.localName != "h2") {
    node = node.previousElementSibling;
  }
  let fromLanguage = node.querySelector(".mw-headline").textContent;

  console.log(fromLanguage);

  for (row of section.childNodes) {

    if (row.localName != "li") {      
      continue;

    }

    console.log(row);

    let translatedWord = Array.prototype.slice.apply(row.childNodes).filter((node) => node.localName != "dl" && node.localName != "span" && node.localName != "ul").map(node => node.textContent).join("").trim().replace("  ", " ");

    debugger;

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
