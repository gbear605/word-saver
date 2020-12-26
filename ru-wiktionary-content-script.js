let definitionLanguage = "ru";
let headerElements = Array.from(document.getElementsByClassName("mw-headline")).filter((element) => element.innerText === "Значение")
let originalWord = decodeURI(document.URL.split('/').slice(-1)[0]).split('#')[0]; // Gets the last element of the url

for (section of headerElements) {
  let originalLanguageFinderNode = section.parentNode;
  while(originalLanguageFinderNode != null && originalLanguageFinderNode.localName != "h1") {
    originalLanguageFinderNode = originalLanguageFinderNode.previousElementSibling;
  }
  let originalLanguage = originalLanguageFinderNode.querySelector(".mw-headline").textContent;
  console.log(originalLanguage);

  if (originalLanguage == "Русский") {
    originalLanguage = "ru";
  } else if (originalLanguage == "Английский") {
    originalLanguage = "en";
  } else if (originalLanguage == "Исландский") {
    originalLanguage = "fr";
  } else if (originalLanguage == "Польский") {
    originalLanguage = "pl";
  } else if (originalLanguage == "Украинский") {
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
      if (node.title == "Викисловарь:Условные сокращения") {
        ital = node.childNodes[0].title;
      } else {
        if (node.classList === undefined || !node.classList.contains('example-fullblock')) {
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

    if (ital != null) {
      definition += " (" + ital + ")"
    }

    if (definition === "") {
      continue;
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
