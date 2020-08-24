// TODO: use language information
/*
let languagePair = document.URL.split('/')[document.URL.split('/').length-2].split('-');
let firstLanguage = convertFullNameToISO(languagePair[0]);
let secondLanguage = convertFullNameToISO(languagePair[1]);
*/

for (row of document.querySelectorAll(".dict-entry")) {

  let translationInformationRow = row.querySelector('.dict-translation');
  if (translationInformationRow == null) {
    continue;
  }

  let translateeWord = translationInformationRow.querySelector('.dict-source strong').textContent;
  let translatedWord = translationInformationRow.querySelector('.dict-result strong').textContent;

  // TODO: use wordType information
  /*
  let wordTypeElement = row.parentElement.parentElement.querySelector('.suffix')
  let wordType = null;
  if (wordTypeElement != null) {
    wordType = wordTypeElement.textContent.replace('{', '').replace('}', '')
  }
  */
  
  var saveButton = document.createElement("input");
  saveButton.type = "button";
  saveButton.value = "Save";
  saveButton.onclick = makeSaveWordFunction(translateeWord, translatedWord);
  translationInformationRow.appendChild(saveButton);
}


function makeSaveWordFunction(translateeWord, translatedWord) {
  return function() {

    console.log("Translated " + translateeWord + " to " + translatedWord);
    if(typeof browser === 'undefined') {
      browser = chrome
    }
    browser.runtime.sendMessage(
      {
        "translatee": translateeWord,
        "translated": translatedWord,
        "fromLanguage": null,
        "toLanguage": null
      }
    );
  }
}
