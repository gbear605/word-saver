let content = document.querySelector(".entry-content").children[0].textContent.split(' : ');
let translatee = content[0];
let translated = content[1];

let partOfSpeech = document.querySelector('[rel="category tag"]').textContent;

if(partOfSpeech == "Noun") {
  split = translated.split(' (');
  translated = split[0]
  plural = split[1];
  translatee += ' (' + plural;
}

let saveButton = document.createElement("input");
saveButton.type = "button";
saveButton.value = "Save";
saveButton.onclick = () => {
  console.log("Translated " + translatee + " to " + translated);
  if(typeof browser === 'undefined') {
    browser = chrome
  }
  browser.runtime.sendMessage(
    {
      "translatee": translatee,
      "translated": translated,
      "fromLanguage": "de",
      "toLanguage": "en"
    }
  );
};

document.querySelector(".sharedaddy").prepend(saveButton);
