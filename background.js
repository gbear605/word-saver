let notifId = "wordreference";

if(typeof browser === 'undefined') {
  browser = chrome
}

function openExportPage() {
  browser.tabs.create({
    "url": "/exportPage.html"
  });
}

function setStorage(translatedWords, callback) {
  let storageSetCall;
  if(typeof chrome !== 'undefined') {
    // Chrome
    storageSetCall = new Promise(function(resolve) {
      browser.storage.local.set({translatedWords}, (obj) => {
        resolve(obj);
      })
    });
  } else {
    // Firefox
    storageSetCall = browser.storage.local.set({translatedWords})
  }
    
  storageSetCall.then(() => {
    console.log(translatedWords);
    if(callback != null) {
      callback();
    }
  }, (error) => {
    console.log("Error: " + error);
  });
}

function saveWord(translatee, translated) {
  let translatedWordsCall;
  if(typeof chrome !== 'undefined') {
    // Chrome
    translatedWordsCall = new Promise(function(resolve) {
      browser.storage.local.get(['translatedWords'], (obj) => { 
        if(!obj.hasOwnProperty('translatedWords')) {
          obj = { translatedWords: [] };
        }
        resolve(obj);
      })
    });
  } else {
    // Firefox
    translatedWordsCall = browser.storage.local.get({
      translatedWords: [] // the default value is an empty array
    })
  }

  translatedWordsCall.then((obj) => {
    let translatedWords = obj.translatedWords;

    let toAdd = `${translatee}\t${translated}`;
    let toAddAlt = `${translated}\t${translatee}`;
    
    // Don't add duplicates, including the same word in the opposite language order
    if(!translatedWords.includes(toAdd) && !translatedWords.includes(toAddAlt)) {
      translatedWords.push(toAdd);
      console.log("Adding " + toAdd);
    
      setStorage(translatedWords)

    }
  }, (error) => {
    console.log("Error: " + error);
  });
}

function notify(message) {
  let translatee = message.translatee;
  let translated = message.translated;
  let fromLanguage = message.fromLanguage;
  let toLanguage = message.toLanguage;

  saveWord(translatee, translated);

  let randNum = Math.floor(Math.random() * 100000000) + 1;
  let customNotifId = notifId + randNum;

  browser.notifications.create(customNotifId, {
    "type": "basic",
    "iconUrl": "icons/page-48.png",
    "title": "WordReference",
    "message": "Translated " + translatee + " (" + fromLanguage + ") to " + translated + " (" + toLanguage + ")"
  });

  window.setTimeout(() => {
    browser.notifications.clear(customNotifId);
  },2000);
}

browser.runtime.onMessage.addListener(notify);

browser.notifications.onClicked.addListener(openExportPage);
browser.browserAction.onClicked.addListener(openExportPage);
