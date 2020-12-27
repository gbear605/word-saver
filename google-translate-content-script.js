let saveButton = document.createElement("button");
saveButton.textContent = "Save to Word Saver";
saveButton.value = "Save";
saveButton.onclick = () => {
  let originalWord = document.querySelector('[aria-label="Source text"]').value;
  let originalLanguage = document.querySelector('[aria-label="Source text"]').parentElement.parentElement.parentElement.lang;
  let definition = document.querySelector('[data-language-to-translate-into]').childNodes[0].textContent;
  let definitionLanguage = document.querySelector('[data-language-to-translate-into]').parentElement.lang;
  saveWord(originalWord, definition, originalLanguage, definitionLanguage);
}

let buttonRow = document.querySelectorAll('nav')[1];
saveButton.className = buttonRow.childNodes[2].childNodes[0].className;
buttonRow.appendChild(saveButton);

