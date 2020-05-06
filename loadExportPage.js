function setStorage(translatedWords, callback) {
  browser.storage.local.set({translatedWords}).then(() => {
    console.log(translatedWords);
    if(callback != null) {
      callback();
    }
  }, (error) => {
    console.log("Error: " + error);
  });
}

function saveWords(words, callback) {

  browser.storage.local.get({
    translatedWords: [] // the default value is an empty array
  }).then((obj) => {
    let translatedWords = obj.translatedWords;

    for (word of words) {
      if(word === "") {
        continue;
      }
      let parts = word.split('\t');
      let toAdd = `${parts[0]}\t${parts[1]}`;
      translatedWords.push(toAdd);
      console.log("Adding " + toAdd);
    }

    setStorage(translatedWords, callback)
    
  }, (error) => {
    console.log("Error: " + error);
  });
}

function saveWord(translatee, translated, callback) {
  browser.storage.local.get({
    translatedWords: [] // the default value is an empty array
  }).then((obj) => {
    let translatedWords = obj.translatedWords;

    let toAdd = `${translatee}\t${translated}`;
    let toAddAlt = `${translated}\t${translatee}`;
    
    // Don't add duplicates, including the same word in the opposite language order
    if(!translatedWords.includes(toAdd) && !translatedWords.includes(toAddAlt)) {
      translatedWords.push(toAdd);
      console.log("Adding " + toAdd);

      setStorage(translatedWords, callback)
    }
  }, (error) => {
    console.log("Error: " + error);
  });
}

function setPage(text, numRows) {
  document.getElementById("displayArea").innerText = text;
  let textarea = document.getElementById("editField")
  textarea.value = text;
  textarea.rows = numRows;
  textarea.cols = 80;
}

function loadNew() {
  browser.storage.local.get({
    translatedWords: [] // the default value is an empty array
  }).then((obj) => {
    setPage(obj.translatedWords.join("\n"), obj.translatedWords.length + 3);
  });
  
}

window.onload = () => {
  document.getElementById("clearWords").addEventListener("click", () => {
    browser.storage.local.clear();
    setPage("", 3);
  });
  document.getElementById("saveWords").addEventListener("click", () => {
    browser.storage.local.clear();
    let textToSave = document.getElementById("editField").value;
    let words = textToSave.split('\n');
    saveWords(words, loadNew);
  });
  document.getElementById("addWord").addEventListener("click", (event) => {
    event.preventDefault();
    debugger;
    let translatee = document.getElementById("translatee").value;
    let translated = document.getElementById("translated").value;
    if(translatee === "" || translated === "") {
      document.getElementsByClassName("addWordError")[0].removeAttribute("hidden");
      document.getElementsByClassName("addWordError")[0].removeAttribute("aria-hidden");
      if(translatee === "") {
        document.getElementById("translatee").classList.add("input-invalid")
      }
      if(translated === "") {
        document.getElementById("translated").classList.add("input-invalid")
      }
      return;
    } else {
      document.getElementsByClassName("addWordError")[0].setAttribute("hidden", true);
      document.getElementsByClassName("addWordError")[0].setAttribute("aria-hidden", true);
    }
    document.getElementById("translatee").value = "";
    document.getElementById("translated").value = "";
    saveWord(translatee, translated, loadNew);
  });
}

loadNew();