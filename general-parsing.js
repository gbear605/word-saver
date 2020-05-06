// From https://stackoverflow.com/a/26927463
function isVowel(x) {
  return /[aeiouAEIOU]/.test(x);
}

function processWord(word, translateInfo, language) {
  word = word.trim().replace("⇒","");

  if(language == "fr") {
    if(translateInfo == "nm") {
      word = "un ".concat(word)
    } else if(translateInfo == "nf") {
      word = "une ".concat(word)
    }
  }

  if(language == "en") {
    if(translateInfo.includes("vi") || translateInfo.includes("vtr")) {
      word = "to ".concat(word)
    }
    if(translateInfo == "n") {
      if(isVowel(word[0])) {
        return "an ".concat(word)
      } else {
        return "a ".concat(word)
      }
    }
  }

  if(language == "de") {
    if(translateInfo == "Nm") {
      word = "der ".concat(word)
    } else if(translateInfo == "Nn") {
      word = "das ".concat(word)
    } else if(translateInfo == "Nf") {
      word = "die ".concat(word)
    }
  }

  if(language == "es") {
    if(translateInfo == "nm") {
      word = "un ".concat(word)
    } else if(translateInfo == "nf") {
      word = "una ".concat(word)
    }
  }

  if (word.includes(", also UK")) {
    word = word.substring(0, word.indexOf(', also UK'));
  }

  return word;
}