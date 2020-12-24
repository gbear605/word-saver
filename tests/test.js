const {Builder, By, Key, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const fs = require('fs')
const assert = require('assert').strict;

const id = '{389d5e14-b6b7-46c2-a379-e01f727e4d2b}'
const short_id = '389d5e14-b6b7-46c2-a379-e01f727e4d2b'

let firefoxOptions = new firefox.Options()
    .setBinary('/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox')
    .setPreference('xpinstall.signatures.required', false)
    .setPreference('extensions.webextensions.uuids', '{"' + id + '": "' + short_id + '"}');

const version = JSON.parse(fs.readFileSync('../manifest.json', 'utf8')).version;

(async function example() {
  let driver = await new Builder().forBrowser('firefox')
                                  .setFirefoxOptions(firefoxOptions)
                                  .build();
  driver.installAddon('../web-ext-artifacts/word_saver-' + version + '.zip');
  try {
    await driver.get('https://en.wiktionary.org/wiki/Test');
    await driver.wait(until.elementsLocated(By.css('[value="Save"]')), 1000)
    await driver.findElement(By.css('[value="Save"]')).click();
    await driver.get('moz-extension://' + short_id + '/exportPage.html')
    let text = await driver.findElement(By.id('editField')).getAttribute("value");
    console.log(text)
    assert.equal(text, 'Test\t(cricket) (sometimes test) a Test match')
  } finally {
    await driver.quit();
  }
})();
