let word = document.querySelector(".AdresseDefinition").textContent.replace('\ue82c', '');

for (row of document.querySelectorAll(".Definitions .DivisionDefinition")) {
  let definition = row.textContent;
  
  var saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.onclick = makeSaveWordFunction(definition);
  row.appendChild(saveButton);
}

function makeSaveWordFunction(definition) {
  return function() {

    if(typeof browser === 'undefined') {
      browser = chrome
    }
    browser.runtime.sendMessage(
      {
        "translatee": word,
        "translated": definition,
        "fromLanguage": "fr",
        "toLanguage": "fr"
      }
    );
  }
}
