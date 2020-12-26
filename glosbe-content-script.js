let urlSplits = document.URL.split('/');
let originalLanguage = urlSplits[urlSplits.length-3];
let definitionLanguage = urlSplits[urlSplits.length-2];
let originalWord = urlSplits[urlSplits.length-1].replace("%20", " ");

for (row of document.querySelectorAll("li.phraseMeaning")) {

  let metaInformationNode = row.parentNode.previousElementSibling;
  while (metaInformationNode != null && metaInformationNode.className != "defmetas") {
    metaInformationNode = metaInformationNode.previousElementSibling;
  }
  let partOfSpeech = null;
  let originalWordGender = null;
  if (metaInformationNode != null) {
    for (metaInformationInnerNode of metaInformationNode.querySelectorAll('.defmeta')) {
      if (metaInformationInnerNode.textContent == 'Gender:') {
        originalWordGender = metaInformationInnerNode.nextElementSibling.textContent.trim().replace(';', '');
        if (originalWordGender == 'feminine') {
          originalWordGender = 'f'
        } else if (originalWordGender == 'masculine') {
          originalWordGender = 'm'
        } else if (originalWordGender == 'neuter') {
          originalWordGender = 'n'
        }
      }
      if (metaInformationInnerNode.textContent == 'Type:') {
        partOfSpeech = metaInformationInnerNode.nextElementSibling.textContent.trim().replace(';', '');
      }
    }
  }

  let definition = row.querySelector(".text-info strong").textContent;
  let definitionGender = null;
  let genderAndPhraseInformation = row.querySelector(".gender-n-phrase").textContent.replace('{', '').replace('}', '').trim()
  if (genderAndPhraseInformation == "noun feminine") {
    definitionGender = 'f'
  } else if (genderAndPhraseInformation == 'noun masculine') {
    definitionGender = 'm'
  } else if (genderAndPhraseInformation == 'noun neuter') {
    definitionGender = 'n'
  }
  
  let originalWordInfo = null;
  if(originalLanguage == "de") {
    if(partOfSpeech == "noun") {
      originalWordInfo = "N" + originalWordGender;
    }
  }
  if(originalLanguage == "es" || originalLanguage == "fr") {
    if(partOfSpeech == "noun") {
      originalWordInfo = "n" + originalWordGender;
    }
  }
  if(originalWordInfo == null) {
    originalWordInfo = partOfSpeech; // We haven't handled this case
  }

  let definitionInfo = null;
  if(definitionLanguage == "de") {
    if(partOfSpeech == "noun") {
      definitionInfo = "N" + definitionGender;
    }
  }
  if(definitionLanguage == "es" || definitionLanguage == "fr") {
    if(partOfSpeech == "noun") {
      definitionInfo = "n" + definitionGender;
    }
  }
  if(definitionInfo == null) {
    definitionInfo = partOfSpeech; // We haven't handled this case
  }

  let originalWordWithInformation = processWord(originalWord, originalWordInfo, originalLanguage);
  definition = processWord(definition, definitionInfo, definitionLanguage);


  var saveButton = document.createElement("input");
  saveButton.type = "button";
  saveButton.value = "Save";
  saveButton.onclick = () => saveWord(originalWordWithInformation, definition, originalLanguage, definitionLanguage);
  row.appendChild(saveButton);
}
