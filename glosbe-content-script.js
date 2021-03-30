let urlSplits = document.URL.split("/");
let originalLanguage = urlSplits[urlSplits.length-3];
let definitionLanguage = urlSplits[urlSplits.length-2];
let originalWord = urlSplits[urlSplits.length-1].replace("%20", " ");

for (translationArea of document.querySelectorAll(".phrase__translation")) {

  let originalGenderAndPhraseInformation = Array.from(translationArea.querySelectorAll(".phrase__summary__field")).map((x) => x.textContent);
  let originalGender = "";
  if (originalGenderAndPhraseInformation.includes("feminine")) {
    originalGender = "f";
  } else if (originalGenderAndPhraseInformation.includes("masculine")) {
    originalGender = "m";
  } else if (originalGenderAndPhraseInformation.includes("neuter")) {
    originalGender = "n";
  }

  for (row of translationArea.querySelectorAll(".translation__item")) {
    let definition = row.querySelector(".translation__item__phrase").textContent
    let definitionGender = "";
    let definitionGenderAndPhraseInformation = Array.from(row.querySelectorAll(".phrase__summary__field")).map((x) => x.textContent);
    if (definitionGenderAndPhraseInformation.includes("feminine")) {
      definitionGender = "f";
    } else if (definitionGenderAndPhraseInformation.includes("masculine")) {
      definitionGender = "m";
    } else if (definitionGenderAndPhraseInformation.includes("neuter")) {
      definitionGender = "n";
    }

    let definitionInfo = "";
    let definitionPartOfSpeech = "";
    if (definitionGenderAndPhraseInformation.includes("noun")) {
      definitionPartOfSpeech = "noun";
    }
    if (definitionLanguage == "de") {
      if (definitionPartOfSpeech == "noun") {
        definitionInfo = "N" + definitionGender;
      }
    }
    if (definitionLanguage == "es" || definitionLanguage == "fr") {
      if (definitionPartOfSpeech == "noun") {
        definitionInfo = "n" + definitionGender;
      }
    }

    let originalInfo = "";
    if (originalLanguage == "de") {
      if (definitionPartOfSpeech == "noun") {
        originalInfo = "N" + originalGender;
      }
    }
    if (originalLanguage == "es" || originalLanguage == "fr") {
      if (definitionPartOfSpeech == "noun") {
        originalInfo = "n" + originalGender;
      }
    }

    let originalWordWithInformation = processWord(originalWord, originalInfo, originalLanguage);
    definition = processWord(definition, definitionInfo, definitionLanguage);


    var saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = "Save to Word Saver";
    saveButton.className = "button-sm"
    saveButton.onclick = () => saveWord(originalWordWithInformation, definition, originalLanguage, definitionLanguage);
    row.appendChild(saveButton);
  }
}
