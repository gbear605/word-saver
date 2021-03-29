/*
Examples:
Adjective: https://uk.wiktionary.org/wiki/гарний
Noun: https://uk.wiktionary.org/wiki/%D0%B2%D0%BE%D0%BB%D0%BE%D1%81%D1%82%D1%8C
Verb: https://uk.wiktionary.org/wiki/%D0%B3%D0%BE%D0%B2%D0%BE%D1%80%D0%B8%D1%82%D0%B8
Word in a non-Ukrainian language: https://uk.wiktionary.org/wiki/ask
*/

let definitionLanguage = "uk";
let headerElements = Array.from(document.getElementsByClassName("mw-headline")).filter((element) => element.innerText === "Значення")
let originalWord = decodeURI(document.URL.split('/').slice(-1)[0]).split('#')[0]; // Gets the last element of the url

debugger;

for (section of headerElements) {
  let originalLanguageFinderNode = section.parentNode;
  while(originalLanguageFinderNode != null && originalLanguageFinderNode.localName != "h1") {
    originalLanguageFinderNode = originalLanguageFinderNode.previousElementSibling;
  }
  let originalLanguage = originalLanguageFinderNode.querySelector(".mw-headline").textContent;
  console.log(originalLanguage);

  if (originalLanguage == "Російська") {
    originalLanguage = "ru";
  } else if (originalLanguage == "Англійська") {
    originalLanguage = "en";
  } else if (originalLanguage == "Французька") {
    originalLanguage = "fr";
  } else if (originalLanguage == "Українська") {
    originalLanguage = "uk";
  }

  for (row of section.parentNode.nextElementSibling.childNodes) {
    if (row.localName != "li") {
      continue;
    }

    let ital = null;
    let nodesToKeep = [];
    let firstExampleNode = null
    for (node of row.childNodes) {
      if (node.title == "Вікісловник:Умовні скорочення") {
        ital = node.querySelector('.abbrev').title;
      } else {
        if (node.classList === undefined || (!node.classList.contains('example-fullblock') && !node.classList.contains('reference') && node.localName != 'span' && node.localName != 'sup')) {
          console.log(node.textContent);
          nodesToKeep.push(node)
        } else {
          if (firstExampleNode == null) {
            firstExampleNode = node;
          }
        }
      }
    }
    let definition = nodesToKeep.map(node => node.textContent).join("").trim().replace("  ", " ");

    if (definition === "") {
      continue;
    }

    if (ital != null) {
      definition += " (" + ital + ")"
    }

    var saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = "Save";
    saveButton.onclick = () => saveWord(originalWord, definition, originalLanguage, definitionLanguage);
    
    for (node of row.childNodes) {
      if (node.classList !== undefined && node.classList.contains('example-fullblock')) {
      }
    }

    row.insertBefore(saveButton, firstExampleNode);
  }
}
