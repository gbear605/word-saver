for (row of document.querySelectorAll("table.WRD > tbody > tr")) {
  if (row.className === "langHeader" || row.className === "wrtopsection") {
    continue;
  }

  if(row.children.length != 3) {
    continue;
  }

  let originalWordRow = row;
  while(originalWordRow.id == "" || originalWordRow.id == undefined) {
    originalWordRow = originalWordRow.previousSibling;
  }
  
  var saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.value = "Save"

  let langString = originalWordRow.id.split(":")[0];
  let originalLanguage = langString[0] + langString[1];
  let definitionLanguage = langString[2] + langString[3];

  let originalWordInfo = originalWordRow.childNodes[0].querySelector(".POS2").childNodes[0].textContent;
  let definitionInfo = row.childNodes[2].querySelector(".POS2").childNodes[0].textContent;

  let originalWordBox = originalWordRow.children[0].firstChild;
  let definitionBox = row.children[2];

  let originalWord = processWord(processTranslateBox(originalWordBox), originalWordInfo, originalLanguage);
  let definition = processWord(processTranslateBox(definitionBox), definitionInfo, definitionLanguage);

  saveButton.onclick = () => saveWord(originalWord, definition, originalLanguage, definitionLanguage);
  row.appendChild(saveButton);
}

function processTranslateBox(translateBox) {

  if(translateBox.childNodes.length == 0) {
    return translateBox.textContent;
  } else {
    return Array.prototype.slice.call(translateBox.childNodes)
                .filter((node) => node.textContent != "" 
                               && node.className != "conjugate"
                               && node.className != "POS2"
                               && node.className != "tooltip POS2"
                               && node.localName != "span")
                .map((node) => node.textContent)
                .join("")
                .trim();
  }
}
