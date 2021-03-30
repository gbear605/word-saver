const {Builder, By, Key, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const assert = require('assert').strict;

const id = '{389d5e14-b6b7-46c2-a379-e01f727e4d2b}';
const firefoxId = '389d5e14-b6b7-46c2-a379-e01f727e4d2b';
const chromeId = 'koacabdknchnloklaoffjhadapifjgmf'; // Generated by Chrome - seems consistent

const use_headless = (process.env.USE_HEADLESS == 'true'); 

const firefoxBinary = process.env.FIREFOX_BINARY || '/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox';
let firefoxOptions = new firefox.Options()
    .setBinary(firefoxBinary)
    .setPreference('xpinstall.signatures.required', false)
    .setPreference('extensions.webextensions.uuids', '{"' + id + '": "' + firefoxId + '"}');
if (use_headless) {
  firefoxOptions = firefoxOptions.addArguments("--headless");
}

const version = JSON.parse(fs.readFileSync('../manifest.json', 'utf8')).version;

const chromeBinary = process.env.CHROME_BINARY || '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
let chromeOptions = new chrome.Options()
    .setChromeBinaryPath(chromeBinary)
    .addArguments("load-extension=..");

async function hideObscuringElement(driver) {
  let elements = await driver.findElements(By.className("cc-banner"));
  elements = elements.concat(await driver.findElements(By.id("onetrust-consent-sdk")));
  elements = elements.concat(await driver.findElements(By.id("ot-fade-in")));
  elements = elements.concat(await driver.findElements(By.className("nav-open")));
  for (element of elements) {
    await driver.executeScript("arguments[0].style.display='none'", element);
    await driver.executeScript("arguments[0].style.visibility='hidden'", element);
  }
}

async function testSite(driver, url, expectedText, extensionPath) {
  console.log("Running for", url)
  await driver.get(url);
  await driver.wait(until.elementsLocated(By.css('[value="Save"],[value="Save to Word Saver"]')), 100000);
  let saveButton = await driver.findElement(By.css('[value="Save"],[value="Save to Word Saver"]'));
  await hideObscuringElement(driver);
  await driver.executeScript("arguments[0].scrollIntoView(false);", saveButton);
  await saveButton.click();
  await driver.get(extensionPath + '/export.html')
  let text = await driver.findElement(By.id('editField')).getAttribute("value");
  text = text.replace(/\u00A0/g, ' ');
  console.log(text);
  assert.equal(text, expectedText);
  await driver.findElement(By.id('clearWords')).click();
}

async function testSites(driver, extensionPath) {
  await testSite(driver, 'https://en.bab.la/dictionary/spanish-english/hola', 'hola\thello\tes\ten', extensionPath);
  await testSite(driver, 'https://de.wiktionary.org/wiki/Test', 'der Test\tPrüfung einer Eigenschaft oder Fähigkeit (in schriftlicher, mündlicher oder sonstiger Form)\tde\tde', extensionPath);
  await testSite(driver, 'https://en.wiktionary.org/wiki/Test', 'Test\t(cricket) (sometimes test) a Test match\ten\ten', extensionPath);
  await testSite(driver, 'https://www.germaneveryday.com/der-weihnachtszauber/', 'der Weihnachtszauber (no pl.)\tChristmas magic\tde\ten', extensionPath);
  await testSite(driver, 'https://glosbe.com/en/de/hello', 'hello\thallo\ten\tde', extensionPath);
  if (!use_headless) {
    // Google Translate does not work from the automated test runner
    await testSite(driver, 'https://translate.google.com/?sl=auto&tl=es&text=Hallo&op=translate', 'Hallo\tHola\tde\tes', extensionPath);
  }
  await testSite(driver, 'https://www.larousse.fr/dictionnaires/francais/bonjour/10161', 'bonjour\tTerme de salutation dont on se sert pendant la journée quand on aborde quelqu\'un ou, moins souvent, quand on prend congé de quelqu\'un : Bonjour, comment allez-vous ?\tfr\tfr', extensionPath);
  await testSite(driver, 'https://pl.wiktionary.org/wiki/hello', 'hello\tcześć, witaj\ten\tpl', extensionPath);
  await testSite(driver, 'https://ru.wiktionary.org/wiki/hello', 'hello\tалло!\ten\tru', extensionPath);
  await testSite(driver, 'https://sv.wiktionary.org/wiki/hello', 'hello\thej, hallå\ten\tsv', extensionPath);
  await testSite(driver, 'https://uk.wiktionary.org/wiki/волость', 'волость\tУ Київській державі: територія, підпорядкована єдиній владі (князя, монастиря тощо). (Історичний термін)\tuk\tuk', extensionPath);
  await testSite(driver, 'https://www.wordreference.com/es/translation.asp?tranword=hello', 'hello\thola\ten\tes', extensionPath);
}

async function testSitesFirefox() {
  let driver = await new Builder().forBrowser('firefox')
                                .setFirefoxOptions(firefoxOptions)
                                .build();
  try {
    await driver.installAddon('../web-ext-artifacts/word_saver-' + version + '.zip');
    console.log("Running testSitesFirefox");
    await testSites(driver, 'moz-extension://' + firefoxId);
  } finally {
    await driver.quit()
  }
}

async function testSitesChrome() {
  let driver = await new Builder().forBrowser('chrome')
                                .setChromeOptions(chromeOptions)
                                .build();
  try {
    console.log("Running testSitesChrome");
    await testSites(driver, 'chrome-extension://' + chromeId);
  } finally {
    await driver.quit()
  }
}

async function addWord(driver, originalWord, definition, originalLanguage, definitionLanguage) {
  await driver.wait(until.elementsLocated(By.id('originalWord')), 100000);
  await driver.findElement(By.id('originalWord')).sendKeys(originalWord);
  await driver.findElement(By.id('definition')).sendKeys(definition);
  await driver.findElement(By.id('originalWordLanguage')).sendKeys(originalLanguage);
  await driver.findElement(By.id('definitionLanguage')).sendKeys(definitionLanguage);
  await driver.findElement(By.id('addWord')).click();
}

async function testExportPage(driver, extensionPath) {
  await driver.get(extensionPath + '/export.html')

  assert.equal(await driver.findElement(By.id('editField')).getAttribute("value"), "");

  await addWord(driver, "auf Wiedersehen", "goodbye", "de", "en");
  await addWord(driver, "au revoir", "goodbye", "fr", "en");
  await addWord(driver, "auf Wiedersehen", "au revoir", "de", "fr");
  await new Promise(resolve => setTimeout(resolve, 200));

  const FULL_LIST = `auf Wiedersehen\tgoodbye\tde\ten\nau revoir\tgoodbye\tfr\ten\nauf Wiedersehen\tau revoir\tde\tfr`
  assert.equal(await driver.findElement(By.id('editField')).getAttribute("value"), FULL_LIST);

  await driver.findElement(By.id('clearWords')).click();
  assert.equal(await driver.findElement(By.id('editField')).getAttribute("value"), "");

  await driver.executeScript('document.getElementById("editField").value = `' + FULL_LIST + '`');
  await driver.findElement(By.id('saveWords')).click();
  assert.equal(await driver.findElement(By.id('editField')).getAttribute("value"), FULL_LIST);

  // TODO: add testing for filtering words and clearing filtered words
}

async function testExportPageFirefox() {
  let driver = await new Builder().forBrowser('firefox')
                                .setFirefoxOptions(firefoxOptions)
                                .build();
  try {
    await driver.installAddon('../web-ext-artifacts/word_saver-' + version + '.zip');
    console.log("Running testExportPageFirefox");
    await testExportPage(driver, 'moz-extension://' + firefoxId );
  } catch(err) {

  } finally {
    await driver.quit()
  }
}

async function testExportPageChrome() {
  let driver = await new Builder().forBrowser('chrome')
                                .setChromeOptions(chromeOptions)
                                .build();
  try {
    console.log("Running testExportPageChrome");
    await testExportPage(driver, 'chrome-extension://' + chromeId);
  } finally {
    await driver.quit()
  }
}

(async function runTests() {
  try {
    await testExportPageFirefox();
    await testSitesFirefox();
    if (!use_headless) {
      // Chrome doesn't support headless extensions
      await testExportPageChrome();
      await testSitesChrome();
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

