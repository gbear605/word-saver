/*
  context_menu_search: {
	site: String (one of "wiktionary", "wordreference")
	primaryLanguage: String (ISO language code, eg. "en" or "es")
	secondaryLanguage: String (ISO language code, eg. "en" or "es", 
							   or "" if none specified)
  }
*/

console.log("test")

// Based on https://stackoverflow.com/a/1026087
function capitalizeFirstLetter([ first, ...rest ], locale = navigator.language) {
  return [ first.toLocaleUpperCase(locale), ...rest ].join('');
}

browser.storage.sync.get({
	context_menus_searches: [{
		site: "wiktionary",
		primaryLanguage: "en",
		secondaryLanguage: ""
	}]
}).then(({context_menus_searches}) => {
	for(context_menu_search of context_menus_searches) {

		let url = "https://"
		let title = ""
		if(context_menu_search.site == "wiktionary") {
			url += context_menu_search.primaryLanguage
			url += ".wiktionary.org/w/index.php?search="

			title += isoLangs[context_menu_search.primaryLanguage].name
			title += " Wiktionary"
		}
		https://en.wiktionary.org/w/index.php?search=hello

		browser.contextMenus.create({
			id: context_menu_search.site + context_menu_search.primaryLanguage + context_menu_search.secondaryLanguage,
			type: "normal",
			title: title,
			contexts: ["all"],
			onclick: (info) => {
				browser.tabs.create({
					url: url + info.selectionText
				});
			}
		})
	}
})