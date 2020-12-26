const {Builder, By, Key, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const fs = require('fs');
const assert = require('assert').strict;

const id = '{389d5e14-b6b7-46c2-a379-e01f727e4d2b}'
const short_id = '389d5e14-b6b7-46c2-a379-e01f727e4d2b'

const binary = process.env.FIREFOX_BINARY || '/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox';

const use_headless = (process.env.USE_HEADLESS == 'true'); 

let firefoxOptions = new firefox.Options()
    .setBinary(binary)
    .setPreference('xpinstall.signatures.required', false)
    .setPreference('extensions.webextensions.uuids', '{"' + id + '": "' + short_id + '"}');

if (use_headless) {
  firefoxOptions = firefoxOptions.addArguments("--headless");
}

const version = JSON.parse(fs.readFileSync('../manifest.json', 'utf8')).version;

async function hideObscuringElement(driver) {
  let elements = await driver.findElements(By.className("cc-banner"));
  elements = elements.concat(await driver.findElements(By.id("onetrust-consent-sdk")));
  elements = elements.concat(await driver.findElements(By.className("nav-open")));
  for (element of elements) {
    await driver.executeScript("arguments[0].style.visibility='hidden'", element);
  }
}

async function testSite(driver, url, expectedText) {
  await driver.get(url);
  await driver.wait(until.elementsLocated(By.css('[value="Save"]')), 100000);
  let saveButton = await driver.findElement(By.css('[value="Save"]'));
  await hideObscuringElement(driver);
  await driver.executeScript("arguments[0].scrollIntoView(false);", saveButton);
  await saveButton.click();
  await driver.get('moz-extension://' + short_id + '/export.html')
  let text = await driver.findElement(By.id('editField')).getAttribute("value");
  text = text.replace(/\u00A0/g, ' ');
  console.log(text);
  assert.equal(text, expectedText);
  await driver.findElement(By.id('clearWords')).click();
}

(async function testSites() {
  let driver = await new Builder().forBrowser('firefox')
                                .setFirefoxOptions(firefoxOptions)
                                .build();
  try {
    await driver.installAddon('../web-ext-artifacts/word_saver-' + version + '.zip');
    await testSite(driver, 'https://en.bab.la/dictionary/spanish-english/hola', 'hola\thello\tes\ten');
    await testSite(driver, 'https://de.wiktionary.org/wiki/Test', 'der Test\tPrüfung einer Eigenschaft oder Fähigkeit (in schriftlicher, mündlicher oder sonstiger Form)\tde\tde');
    await testSite(driver, 'https://en.wiktionary.org/wiki/Test', 'Test\t(cricket) (sometimes test) a Test match\ten\ten');
    await testSite(driver, 'https://www.germaneveryday.com/der-weihnachtszauber/', 'der Weihnachtszauber (no pl.)\tChristmas magic\tde\ten');
    await testSite(driver, 'https://glosbe.com/en/de/hello', 'hello\thallo\ten\tde');
    await testSite(driver, 'https://www.larousse.fr/dictionnaires/francais/bonjour/10161', 'bonjour\tTerme de salutation dont on se sert pendant la journée quand on aborde quelqu\'un ou, moins souvent, quand on prend congé de quelqu\'un : Bonjour, comment allez-vous ?\tfr\tfr');
    await testSite(driver, 'https://pl.wiktionary.org/wiki/hello', 'hello\tcześć, witaj\ten\tpl');
    await testSite(driver, 'https://ru.wiktionary.org/wiki/hello', 'hello\tалло!\ten\tru');
    await testSite(driver, 'https://sv.wiktionary.org/wiki/hello', 'hello\thej, hallå\ten\tsv');
    await testSite(driver, 'https://www.wordreference.com/es/translation.asp?tranword=hello', 'hello\thola\ten\tes');
  } finally {
    await driver.quit()
  }
})();

async function addWord(driver, originalWord, definition, originalLanguage, definitionLanguage) {
  await driver.findElement(By.id('originalWord')).sendKeys(originalWord);
  await driver.findElement(By.id('definition')).sendKeys(definition);
  await driver.findElement(By.id('originalWordLanguage')).sendKeys(originalLanguage);
  await driver.findElement(By.id('definitionLanguage')).sendKeys(definitionLanguage);
  await driver.findElement(By.id('addWord')).click();
}

(async function testExportPage() {
  let driver = await new Builder().forBrowser('firefox')
                                .setFirefoxOptions(firefoxOptions)
                                .build();
  try {
    await driver.installAddon('../web-ext-artifacts/word_saver-' + version + '.zip');
    await driver.get('moz-extension://' + short_id + '/export.html')

    assert.equal(await driver.findElement(By.id('editField')).getAttribute("value"), "");

    await addWord(driver, "auf Wiedersehen", "goodbye", "de", "en");
    await addWord(driver, "au revoir", "goodbye", "fr", "en");
    await addWord(driver, "auf Wiedersehen", "au revoir", "de", "fr");

    const FULL_LIST = `auf Wiedersehen\tgoodbye\tde\ten
au revoir\tgoodbye\tfr\ten
auf Wiedersehen\tau revoir\tde\tfr`
    assert.equal(await driver.findElement(By.id('editField')).getAttribute("value"), FULL_LIST);

    await driver.findElement(By.id('clearWords')).click();
    assert.equal(await driver.findElement(By.id('editField')).getAttribute("value"), "");

    await driver.findElement(By.id('editField')).sendKeys(FULL_LIST);
    await driver.findElement(By.id('saveWords')).click();
    assert.equal(await driver.findElement(By.id('editField')).getAttribute("value"), FULL_LIST);

    // TODO: add testing for filtering words and clearing filtered words

  } finally {
    await driver.quit()
  }
})();

