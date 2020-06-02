let headerElements = Array.from(document.getElementsByClassName("mw-headline")).filter((element) => element.innerText === "Значение")

for (section of headerElements) {
  for (row of section.parentNode.nextElementSibling.childNodes) {
    if (row.localName != "li") {
      continue;
    }

    console.log(row);

    let translateeWord = decodeURI(document.URL.split('/').slice(-1)[0]); // Gets the last element of the url

    let ital = null;
    let nodesToKeep = [];
    let firstExampleNode = null
    for (node of row.childNodes) {
      if (node.title == "Викисловарь:Условные сокращения") {
        ital = node.childNodes[0].title;
      } else {
        if (node.classList === undefined || !node.classList.contains('example-fullblock')) {
          nodesToKeep.push(node)
        } else {
          if (firstExampleNode == null) {
            firstExampleNode = node;
          }
        }
      }
    }
    translatedWord = nodesToKeep.map(node => node.textContent).join("").trim().replace("  ", " ");

    if (ital != null) {
      translatedWord += " (" + ital + ")"
    }

    var saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = "Save";
    saveButton.onclick = makeSaveWordFunction(null, null, translateeWord, translatedWord, null, null);
    
    for (node of row.childNodes) {
      if (node.classList !== undefined && node.classList.contains('example-fullblock')) {
      }
    }

    row.insertBefore(saveButton, firstExampleNode);
  }
}

function makeSaveWordFunction(toLanguage, fromLanguage, translateeWord, translatedWord, partOfSpeech, gender) {
  return function() {

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
