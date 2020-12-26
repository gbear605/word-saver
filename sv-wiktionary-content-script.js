let definitionLanguage = "sv";

for (section of document.querySelectorAll("p ~ ol")) {

  // Find the word
  
  let node = section;
  while(node != null && node.localName != "p") {
    node = node.previousElementSibling;
  }

  let originalWord = node.childNodes[0].textContent;
  let genderNode = node.querySelector(".gender");
  let originalWordGender = null;
  if(genderNode != null) {
    originalWordGender = genderNode.textContent;
  }

  while(node != null && node.localName != "h3") {
    node = node.previousElementSibling;
  }
  let partOfSpeech = node.querySelector(".mw-headline").textContent;

  while(node != null && node.localName != "h2") {
    node = node.previousElementSibling;
  }
  let originalLanguage = node.querySelector(".mw-headline").textContent;

  if (originalLanguage == "Svenska") {
    originalLanguage = "sv";
  } else if (originalLanguage == "Engelska") {
    originalLanguage = "en";
  }

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

  let originalWordWithInformation = processWord(originalWord, translateInfo, originalLanguage);

  for (row of section.childNodes) {

    if (row.localName != "li") {      
      continue;
    }

    let definition = Array.prototype.slice.apply(row.childNodes).filter((node) => node.localName != "dl" && node.localName != "span" && node.localName != "ul").map(node => node.textContent).join("").trim().replace("  ", " ");
    definition = processWord(definition, partOfSpeech, definitionLanguage);

    var saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = "Save";
    saveButton.onclick = () => saveWord(originalWordWithInformation, definition, originalLanguage, definitionLanguage);
    row.appendChild(saveButton);
  }
}
