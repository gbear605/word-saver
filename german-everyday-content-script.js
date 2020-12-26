let content = document.querySelector(".entry-content").children[0].textContent.split(' : ');
let originalWord = content[0];
let definition = content[1];

let partOfSpeech = document.querySelector('[rel="category tag"]').textContent;

if(partOfSpeech == "Noun") {
  split = definition.split(' (');
  definition = split[0]
  plural = split[1];
  originalWord += ' (' + plural;
}

let saveButton = document.createElement("input");
saveButton.type = "button";
saveButton.value = "Save";
saveButton.onclick = () => saveWord(originalWord, definition, "de", "en");

document.querySelector(".sharedaddy").prepend(saveButton);
