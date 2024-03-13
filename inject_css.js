const css_src = chrome.runtime.getURL(css_path);
const top_scope = 'nowcss-' + Math.floor(Math.random() * 1e6);

fetch(css_src)
	.then(response => response.text())
	.then(css_text => nowcss_injectsheet(top_scope, css_text));

function nowcss_injectsheet (scope, text) {
	const sheet = new CSSStyleSheet();
	sheet.replace(text);

	for (const rule of sheet.cssRules) {
		rule.selectorText = rule.selectorText.split(/,/).map(s => '.' + scope + ' ' + s).join(',');
	}
	document.adoptedStyleSheets.push(sheet);
	document.body.parentElement.className += ' ' + scope;
}
