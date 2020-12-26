let definitionLanguage = "de";
let originalWord = decodeURI(document.URL.split('/').slice(-1)[0]).split('#')[0]; // Gets the last element of the url

for (section of document.querySelectorAll('[title="Sinn und Bezeichnetes (Semantik)"]')) {
  let backSearchElement = section;
  while(backSearchElement != null && backSearchElement.tagName != "H3") {
    backSearchElement = backSearchElement.previousElementSibling;
  }
  let gender = null;
  let partOfSpeech = null;
  if(backSearchElement != null) {
    gender = backSearchElement.childNodes[1].children[1].textContent;
    partOfSpeech = backSearchElement.childNodes[1].children[0].textContent;
  }

  while(backSearchElement != null && backSearchElement.tagName != "H2") {
    backSearchElement = backSearchElement.previousElementSibling;
  }
  let originalLanguage = null;
  if (backSearchElement != null) {
    originalLanguage = backSearchElement.childNodes[1].childNodes[1].textContent;
    if(originalLanguage == 'Deutsch') {
      originalLanguage = "de"
    } else if(originalLanguage == 'Englisch') {
      originalLanguage = "en"
    } else if(originalLanguage == 'Italienisch') {
      originalLanguage = "it"
    } else if(originalLanguage == 'Spanisch') {
      originalLanguage = "es"
    }
  }

  let translateInfo;
  if(originalLanguage == "de") {
    if(partOfSpeech == "Substantiv") {
      translateInfo = "N" + gender;
    }
  }
  if(originalLanguage == "es" || originalLanguage == "fr") {
    if(partOfSpeech == "Substantiv") {
      translateInfo = "n" + gender;
    }
  }
  if(typeof translateInfo === 'undefined') {
    translateInfo = partOfSpeech; // We haven't handled this case
  }

  let originalWordWithInformation = processWord(originalWord, translateInfo, originalLanguage);

  for (row of section.nextElementSibling.childNodes) {
    if (row.localName != "dd") {
      continue;
    }

    let definition = row.textContent.split('] ')[1].replace("  ", " ");
    definition = processWord(definition, partOfSpeech, definitionLanguage);

    var saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = "Save";
    saveButton.onclick = () => saveWord(originalWordWithInformation, definition, originalLanguage, definitionLanguage);
    row.appendChild(saveButton);
  }
}
