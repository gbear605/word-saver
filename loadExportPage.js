function saveWords(words, callback) {

  browser.storage.local.get({
    definitions: [] // the default value is an empty array
  }).then((obj) => {
    let definitions = obj.definitions;

    for (word of words) {
      if(word === "") {
        continue;
      }
      let parts = word.split('\t');
      let toAdd = `${parts[0]}\t${parts[1]}\t${parts[2]}\t${parts[3]}`;
      definitions.push(toAdd);
      console.log("Adding " + toAdd);
    }

    setStorage(definitions, callback)
    
  }, (error) => {
    console.log("Error: " + error);
  });
}

function updateLanguageSelectors(languages, selectorId) {
  let element = document.querySelector(selectorId);
  let currentlySelected = element.value;
  for (i in element.options) {
    element.remove(i);
  }

  let allElement = document.createElement('option');
  allElement.text = "All";
  element.add(allElement);
  for (language of languages) {
    let languageElement = document.createElement('option');
    languageElement.text = language;
    element.add(languageElement);
  }

  if (languages.includes(currentlySelected)) {
    element.value = currentlySelected;
    return currentlySelected;
  } else {
    element.value = "All";
    return "All";
  }
}


function setPage(displayText, editText, numRows) {
  document.getElementById("displayArea").innerText = displayText;
  let textarea = document.getElementById("editField")
  textarea.value = editText;
  textarea.rows = numRows;
  textarea.cols = 80;
}

function loadNew() {
  browser.storage.local.get({
    definitions: [] // the default value is an empty array
  }).then((obj) => {
    let firstLanguages = [...new Set(obj.definitions.map((text) => text.split("\t")[2]))]
    let secondLanguages = [...new Set(obj.definitions.map((text) => text.split("\t")[3]))]

    let firstLanguage = updateLanguageSelectors(firstLanguages, "#firstLanguageSelector")
    let secondLanguage = updateLanguageSelectors(secondLanguages, "#secondLanguageSelector")

    let selectedDefinitions = []
    for (definition of obj.definitions) {
      let textSplit = definition.split("\t");
      let definitionFirstLanguage = textSplit[2];
      let definitionSecondLanguage = textSplit[3];
      let toShow = textSplit.splice(0,2).join("\t");
      if (firstLanguage != "All" && definitionFirstLanguage != firstLanguage) {
        continue;
      }
      if (secondLanguage != "All" && definitionSecondLanguage != secondLanguage) {
        continue;
      }
      selectedDefinitions.push(toShow);
    }
    let displayText = selectedDefinitions.join("\n");
    let editText = obj.definitions.join("\n");
    setPage(displayText, editText, obj.definitions.length + 3);
  });
  
}

function clearSelectedWords() {
  browser.storage.local.get({
    definitions: [] // the default value is an empty array
  }).then((obj) => {
    let currentFirstLanguage = document.querySelector("#firstLanguageSelector").value;
    let currentSecondLanguage = document.querySelector("#secondLanguageSelector").value;

    let notSelectedDefinitions = []
    for (definition of obj.definitions) {
      let textSplit = definition.split("\t");
      let definitionFirstLanguage = textSplit[2];
      let definitionSecondLanguage = textSplit[3];
      if ((currentFirstLanguage != "All" && definitionFirstLanguage != currentFirstLanguage) 
        || (currentSecondLanguage != "All" && definitionSecondLanguage != currentSecondLanguage)) {
        notSelectedDefinitions.push(definition);
      }
    }

    document.querySelector("#firstLanguageSelector").value = "All";
    document.querySelector("#secondLanguageSelector").value = "All";
    browser.storage.local.remove("definitions");
    saveWords(notSelectedDefinitions, loadNew);
  })
}

function clearAllWords() {
  browser.storage.local.remove("definitions");
  setPage("", "", 3);
}

function saveEditField() {
  browser.storage.local.remove("definitions");
  let textToSave = document.getElementById("editField").value;
  let words = textToSave.split('\n');
  saveWords(words, loadNew);
}

function addWord() {
  let originalWord = document.getElementById("originalWord").value;
  let originalWordLanguage = document.getElementById("originalWordLanguage").value;
  let definition = document.getElementById("definition").value;
  let definitionLanguage = document.getElementById("definitionLanguage").value;
  if(originalWord === "" || definition === "") {
    document.getElementsByClassName("addWordError")[0].removeAttribute("hidden");
    document.getElementsByClassName("addWordError")[0].removeAttribute("aria-hidden");
    if(originalWord === "") {
      document.getElementById("originalWord").classList.add("input-invalid")
    }
    if(originalWordLanguage === "") {
      document.getElementById("originalWordLanguage").classList.add("input-invalid")
    }
    if(definition === "") {
      document.getElementById("definition").classList.add("input-invalid")
    }
    if(definitionLanguage === "") {
      document.getElementById("definitionLanguage").classList.add("input-invalid")
    }
    return;
  } else {
    document.getElementsByClassName("addWordError")[0].setAttribute("hidden", true);
    document.getElementsByClassName("addWordError")[0].setAttribute("aria-hidden", true);
  }
  document.getElementById("originalWord").value = "";
  document.getElementById("originalWordLanguage").value = "";
  document.getElementById("definition").value = "";
  document.getElementById("definitionLanguage").value = "";
  saveWord(originalWord, definition, originalWordLanguage, definitionLanguage, loadNew);
}

window.onload = () => {
  document.getElementById("clearWords").addEventListener("click", clearAllWords);
  document.getElementById("clearSelectedWords").addEventListener("click", clearSelectedWords);
  document.getElementById("firstLanguageSelector").addEventListener("change", loadNew);
  document.getElementById("secondLanguageSelector").addEventListener("change", loadNew);

  document.getElementById("saveWords").addEventListener("click", () => {
    event.preventDefault();
    saveEditField()
  });

  document.getElementById("addWord").addEventListener("click", (event) => {
    event.preventDefault();
    addWord()
  });
}

loadNew();