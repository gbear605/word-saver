let originalWord = document.querySelector(".AdresseDefinition").textContent.replace('\ue82c', '');

for (row of document.querySelectorAll(".Definitions .DivisionDefinition")) {
  let definition = row.textContent;
  
  var saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.value = "Save";
  saveButton.onclick = () => saveWord(originalWord, definition, "fr", "fr");
  row.appendChild(saveButton);
}
