# Word Saver

[![builds.sr.ht status](https://builds.sr.ht/~gbear605/word-saver.svg)](https://builds.sr.ht/~gbear605/word-saver?)

This extension saves words visited on WordReference (wordreference.com), Wiktionary (wiktionary.org), bab.la, Glosbe (glosbe.com), German Everyday (germaneveryday.com), Larousse (larousse.fr), and Google Translate to a text list. Currently the only Wiktionary sites supported are English, German, Polish, Russian, and Swedish.

This extension is not in any way associated with any of the sites that it supports.

Some code from https://github.com/mdn/webextensions-examples/

## Usage

On a given supported page, the extension adds save buttons to various word definitions. Then, if you click the save button, the extension will add the word and its definition to the extension's list of saved words. 

Click on the extension's icon to see the list, which can then be copied and used for something else, such as making flashcards. From the extension page, you can also clear the list of words or edit it.

## Future Changes

* Add support for Hebrew Wiktionary, 
* Add support for extracting conjugations from Wiktionary pages

## Running builds and tests

- For configuring Chrome webstore upload, see https://github.com/DrewML/chrome-webstore-upload/blob/master/How%20to%20generate%20Google%20API%20keys.md
- Download chromedriver versions from http://chromedriver.storage.googleapis.com/index.html ; needs to match the version of Chrome