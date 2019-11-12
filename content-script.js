let row = document.querySelector("table.WRD > tbody > tr.even");
if(row != null) {
  let fromLanguage = row.id.split(":")[0][0] + row.id.split(":")[0][1];
  let toLanguage = row.id.split(":")[0][2] + row.id.split(":")[0][3];

  let translatee = row.children[0].firstChild.textContent.trim()
  let translated = row.children[2].firstChild.textContent.trim()

  console.log("Translated " + translatee + " to " + translated);
  browser.runtime.sendMessage(
    {
      "translatee": translatee,
      "translated": translated,
      "fromLanguage": fromLanguage,
      "toLanguage": toLanguage
    }
  );
}