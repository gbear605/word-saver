let languagePair = document.URL.split('/')[document.URL.split('/').length-2].split('-');
let firstLanguage = convertFullNameToISO(languagePair[0]);
let secondLanguage = convertFullNameToISO(languagePair[1]);

console.log('first language: ' + firstLanguage);

for (row of document.querySelectorAll(".dict-entry")) {

  let translationInformationRow = row.querySelector('.dict-translation');
  if (translationInformationRow == null) {
    continue;
  }

  let originalWord = translationInformationRow.querySelector('.dict-source strong').textContent;
  let definition = translationInformationRow.querySelector('.dict-result strong').textContent;

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
  saveButton.onclick = () => saveWord(originalWord, definition, firstLanguage, secondLanguage);
  translationInformationRow.appendChild(saveButton);
}
