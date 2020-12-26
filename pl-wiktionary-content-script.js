let definitionLanguage = "pl";
let originalWord = decodeURI(document.URL.split('/').slice(-1)[0]).split('#')[0]; // Gets the last element of the url

for (section of document.querySelectorAll('[data-field="znaczenia"]')) {
  let backSearchElement = section.parentNode.parentNode;

  while(backSearchElement != null && backSearchElement.tagName != "H2") {
    backSearchElement = backSearchElement.previousElementSibling;
  }
  let originalLanguage = null;
  if (backSearchElement != null) {
    originalLanguage = backSearchElement.childNodes[1].childNodes[1].textContent;
    if(originalLanguage == 'język polski') {
      originalLanguage = "pl"
    } else if(originalLanguage == 'język niemiecki') {
      originalLanguage = "de"
    } else if(originalLanguage == 'język francuski') {
      originalLanguage = "fr"
    } else if(originalLanguage == 'język rosyjski') {
      originalLanguage = "ru"
    } else if(originalLanguage == 'język hiszpański') {
      originalLanguage = "es"
    } else if(originalLanguage == 'język angielski') {
      originalLanguage = "en"
    } else if(originalLanguage == 'język czeski') {
      originalLanguage = "cs"
    }
  }
  
  let wordInfo = section.parentNode.parentNode.nextElementSibling.textContent;
  let gender = null;
  if (wordInfo.includes('rodzaj żeński')) {
    gender = 'f'
  } else if (wordInfo.includes('rodzaj męski')) {
    gender = 'm';
  } else if (wordInfo.includes('rodzaj nijaki')) {
    gender = 'n';
  }
  let partOfSpeech = null;
  partOfSpeech = wordInfo.split(', ')[0];

  let translateInfo;
  if(originalLanguage == "de") {
    if(partOfSpeech == "rzeczownik") {
      translateInfo = "N" + gender;
    }
  }

  if(originalLanguage == "es" || originalLanguage == "fr") {
    if(partOfSpeech == "rzeczownik") {
      translateInfo = "n" + gender;
    }
  }

  if(typeof translateInfo === 'undefined') {
    translateInfo = partOfSpeech; // We haven't handled this case
  }

  let originalWordWithInformation = processWord(originalWord, translateInfo, originalLanguage);

  for (row of section.parentNode.parentNode.nextElementSibling.nextElementSibling.childNodes) {
    if (row.localName != "dd") {
      continue;
    }

    let definition = Array.from(row.childNodes).filter((node) => node.tagName != "STYLE").map((node) => node.textContent).join('').split(') ')[1].replace("  ", " ");

    definition = processWord(definition, partOfSpeech, definitionLanguage);

    var saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = "Save";
    saveButton.onclick = () => saveWord(originalWordWithInformation, definition, originalLanguage, definitionLanguage);
    row.appendChild(saveButton);
  }
}
