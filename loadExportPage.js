function setStorage(definitions, callback) {
  browser.storage.local.set({definitions}).then(() => {
    console.log(definitions);
    if(callback != null) {
      callback();
    }
  }, (error) => {
    console.log("Error: " + error);
  });
}

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
      let toAdd = `${parts[0]}\t${parts[1]}`;
      definitions.push(toAdd);
      console.log("Adding " + toAdd);
    }

    setStorage(definitions, callback)
    
  }, (error) => {
    console.log("Error: " + error);
  });
}

function saveWord(originalWord, definition, callback) {
  browser.storage.local.get({
    definitions: [] // the default value is an empty array
  }).then((obj) => {
    let definitions = obj.definitions;

    let toAdd = `${originalWord}\t${definition}`;
    let toAddAlt = `${definition}\t${originalWord}`;
    
    // Don't add duplicates, including the same word in the opposite language order
    if(!definitions.includes(toAdd) && !definitions.includes(toAddAlt)) {
      definitions.push(toAdd);
      console.log("Adding " + toAdd);

      setStorage(definitions, callback)
    }
  }, (error) => {
    console.log("Error: " + error);
  });
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
    let displayText = obj.definitions.map((text) => text.split("\t").splice(0,2).join("\t")).join("\n");
    let editText = obj.definitions.join("\n");
    setPage(displayText, editText, obj.definitions.length);
  });
  
}

window.onload = () => {
  document.getElementById("clearWords").addEventListener("click", () => {
    browser.storage.local.remove("definitions");
    setPage("", "", 0);
  });
  
  document.getElementById("saveWords").addEventListener("click", () => {
    event.preventDefault();
    browser.storage.local.remove("definitions");
    let textToSave = document.getElementById("editField").value;
    let words = textToSave.split('\n');
    saveWords(words, loadNew);
  });

  document.getElementById("addWord").addEventListener("click", (event) => {
    event.preventDefault();
    let originalWord = document.getElementById("originalWord").value;
    let definition = document.getElementById("definition").value;
    if(originalWord === "" || definition === "") {
      document.getElementsByClassName("addWordError")[0].removeAttribute("hidden");
      document.getElementsByClassName("addWordError")[0].removeAttribute("aria-hidden");
      if(originalWord === "") {
        document.getElementById("originalWord").classList.add("input-invalid")
      }
      if(definition === "") {
        document.getElementById("definition").classList.add("input-invalid")
      }
      return;
    } else {
      document.getElementsByClassName("addWordError")[0].setAttribute("hidden", true);
      document.getElementsByClassName("addWordError")[0].setAttribute("aria-hidden", true);
    }
    document.getElementById("originalWord").value = "";
    document.getElementById("definition").value = "";
    saveWord(originalWord, definition, loadNew);
  });
}

loadNew();