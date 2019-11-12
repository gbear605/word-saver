function notify(message) {
  let translatee = message.translatee;
  let translated = message.translated;
  let fromLanguage = message.fromLanguage;
  let toLanguage = message.toLanguage;

  browser.storage.local.get({
    translatedWords: [] // the default value is an empty array
  }).then((obj) => {
    let translatedWords = obj.translatedWords;

    let toAdd = `${translatee}; ${translated}`;
    let toAddAlt = `${translated}; ${translatee}`;
    
    // Don't add duplicates, including the same word in the opposite language order
    if(!translatedWords.includes(toAdd) && !translatedWords.includes(toAddAlt)) {
      translatedWords.push(toAdd);
      console.log("Adding " + toAdd);
    
      browser.storage.local.set({translatedWords}).then(() => {
        console.log(translatedWords);
      }, (error) => {
        console.log("Error: " + error);
      });
    }
  }, (error) => {
    console.log("Error: " + error);
  });

  browser.notifications.create({
    "type": "basic",
    "iconUrl": "icons/page-48.png",
    "title": "WordReference",
    "message": "Translated " + translatee + " (" + fromLanguage + ") to " + translated + " (" + toLanguage + ")"
  });
}

browser.runtime.onMessage.addListener(notify);

function openExportPage() {
  browser.tabs.create({
    "url": "/exportPage.html"
  });
}

browser.browserAction.onClicked.addListener(openExportPage);
