let saveButton = document.createElement("button");
saveButton.textContent = "Save";
saveButton.value = "Save";
saveButton.onclick = () => {
  let originalWord = null;
  let originalLanguage = null;
  let definition = null;
  let definitionLanguage = null;

  saveWord(originalWord, definition, convertFullNameToISO(originalLanguage), convertFullNameToISO(definitionLanguage));
}

document.querySelector("[aria-labelledby=\"i4\"]").appendChild(saveButton);

