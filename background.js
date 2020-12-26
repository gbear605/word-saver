let notifId = "wordreference";

function openExportPage() {
  browser.tabs.create({
    "url": "/export.html"
  });
}

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

function saveWord(originalWord, definition, originalLanguage, definitionLanguage, callback) {
  browser.storage.local.get({
    definitions: [] // the default value is an empty array
  }).then((obj) => {
    let definitions = obj.definitions;

    let toAdd = `${originalWord}\t${definition}\t${originalLanguage}\t${definitionLanguage}`;
    let toAddAlt = `${definition}\t${originalWord}\t${definitionLanguage}\t${originalLanguage}`;
    
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

function notify(message) {
  let originalWord = message.originalWord;
  let definition = message.definition;
  let originalLanguage = message.originalLanguage;
  let definitionLanguage = message.definitionLanguage;

  saveWord(originalWord, definition, originalLanguage, definitionLanguage);

  let randNum = Math.floor(Math.random() * 100000000) + 1;
  let customNotifId = notifId + randNum;

  let notifMessage;
  if (originalLanguage != null && definitionLanguage != null) {
    notifMessage = "Matched " + originalWord + " (" + originalLanguage + ") to " + definition + " (" + definitionLanguage + ")";
  } else {
    notifMessage = "Matched " + originalWord + " to " + definition;
  }
  browser.notifications.create(customNotifId, {
    "type": "basic",
    "iconUrl": "icons/page-48.png",
    "title": "WordReference",
    "message": notifMessage
  });

  window.setTimeout(() => {
    browser.notifications.clear(customNotifId);
  },2000);
}

browser.runtime.onMessage.addListener(notify);

browser.notifications.onClicked.addListener(openExportPage);
browser.browserAction.onClicked.addListener(openExportPage);
