let definitionLanguage = "en";

for (section of document.querySelectorAll(".headword")) {
  for (row of section.parentNode.nextElementSibling.childNodes) {
    if (row.localName != "li") {
      continue;
    }

    let originalLanguage = row.parentElement.previousElementSibling.childNodes[0].lang;

    let originalWord = row.parentElement.previousElementSibling.childNodes[0].textContent.replace("  ", " ");

    let partOfSpeech = row.parentElement.previousElementSibling.previousElementSibling.childNodes[0].textContent;

    let originalWordGender = null;
    if(partOfSpeech == "Noun" && row.parentElement.previousElementSibling.childNodes.length > 2) {
      originalWordGender = row.parentElement.previousElementSibling.childNodes[2].textContent;
    }
    let definition = Array.prototype.slice.apply(  row.childNodes).filter((node) => node.localName != "dl" && node.localName != "ul").map(node => node.textContent).join("").trim().replace("  ", " ");

    var saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = "Save";
    saveButton.onclick = makeSaveWordFunction(definitionLanguage, originalLanguage, originalWord, definition, partOfSpeech, originalWordGender);
    row.appendChild(saveButton);
  }
}

function makeSaveWordFunction(definitionLanguage, originalLanguage, originalWord, definition, partOfSpeech, gender) {
  return function() {

    let translateInfo;

    if(originalLanguage == "de") {
      if(partOfSpeech == "Noun") {
        translateInfo = "N" + gender;
      }
    }

    if(originalLanguage == "es" || originalLanguage == "fr") {
      if(partOfSpeech == "Noun") {
        translateInfo = "n" + gender;
      }
    }

    if(typeof translateInfo === 'undefined') {
      translateInfo = partOfSpeech; // We haven't handled this case
    }

    originalWord = processWord(originalWord, translateInfo, originalLanguage);
    definition = processWord(definition, partOfSpeech, definitionLanguage);

    saveWord(originalWord, definition, originalLanguage, definitionLanguage);
  }
}
