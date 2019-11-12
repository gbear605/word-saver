browser.storage.local.get({
  translatedWords: [] // the default value is an empty array
}).then((obj) => { 
  document.getElementsByTagName("textfield")[0].innerText = obj.translatedWords.join("\n");
});

window.onload = () => document.getElementsByTagName("button")[0].addEventListener("click", () => {
  browser.storage.local.clear();
  document.getElementsByTagName("textfield")[0].innerText = "";
});