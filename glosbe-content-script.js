let urlSplits = document.URL.split('/');
let fromLanguage = urlSplits[urlSplits.length-3];
let toLanguage = urlSplits[urlSplits.length-2];
let translateeWord = urlSplits[urlSplits.length-1];

for (row of document.querySelectorAll("li.phraseMeaning")) {

  let metaInformationNode = row.parentNode.previousElementSibling;
  while (metaInformationNode != null && metaInformationNode.className != "defmetas") {
    metaInformationNode = metaInformationNode.previousElementSibling;
  }
  let partOfSpeech = null;
  let translateeGender = null;
  if (metaInformationNode != null) {
    for (metaInformationInnerNode of metaInformationNode.querySelectorAll('.defmeta')) {
      if (metaInformationInnerNode.textContent == 'Gender:') {
        translateeGender = metaInformationInnerNode.nextElementSibling.textContent.trim().replace(';', '');
        if (translateeGender == 'feminine') {
          translateeGender = 'f'
        } else if (translateeGender == 'masculine') {
          translateeGender = 'm'
        } else if (translateeGender == 'neuter') {
          translateeGender = 'n'
        }
      }
      if (metaInformationInnerNode.textContent == 'Type:') {
        partOfSpeech = metaInformationInnerNode.nextElementSibling.textContent.trim().replace(';', '');
      }
    }
  }

  let translatedWord = row.querySelector(".text-info strong").textContent;
  let translatedGender = null;
  let genderAndPhraseInformation = row.querySelector(".gender-n-phrase").textContent.replace('{', '').replace('}', '').trim()
  if (genderAndPhraseInformation == "noun feminine") {
    translatedGender = 'f'
  } else if (genderAndPhraseInformation == 'noun masculine') {
    translatedGender = 'm'
  } else if (genderAndPhraseInformation == 'noun neuter') {
    translatedGender = 'n'
  }
  
  var saveButton = document.createElement("input");
  saveButton.type = "button";
  saveButton.value = "Save";
  saveButton.onclick = makeSaveWordFunction(fromLanguage, toLanguage, translateeWord, translatedWord, partOfSpeech, translateeGender, translatedGender);
  row.appendChild(saveButton);
}


function makeSaveWordFunction(fromLanguage, toLanguage, translateeWord, translatedWord, partOfSpeech, translateeGender, translatedGender) {
  return function() {

    let translateeInfo = null;
    if(fromLanguage == "de") {
      if(partOfSpeech == "noun") {
        translateeInfo = "N" + translateeGender;
      }
    }
    if(fromLanguage == "es" || fromLanguage == "fr") {
      if(partOfSpeech == "noun") {
        translateeInfo = "n" + translateeGender;
      }
    }
    if(translateeInfo == null) {
      translateeInfo = partOfSpeech; // We haven't handled this case
    }

    let translatedInfo = null;
    if(toLanguage == "de") {
      if(partOfSpeech == "noun") {
        translatedInfo = "N" + translatedGender;
      }
    }
    if(toLanguage == "es" || toLanguage == "fr") {
      if(partOfSpeech == "noun") {
        translatedInfo = "n" + translatedGender;
      }
    }
    if(translatedInfo == null) {
      translatedInfo = partOfSpeech; // We haven't handled this case
    }

    translatee = processWord(translateeWord, translateeInfo, fromLanguage);
    translated = processWord(translatedWord, translatedInfo, toLanguage);

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
