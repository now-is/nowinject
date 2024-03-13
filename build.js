const fs = require('fs');

/* All of the following can be summarized as:
 *
 * - start from manifest-base.json
 * - use _content_scripts* keys as hints and remove them
 * - scan the inject/ directory and build content_scripts stanzas
 * - write out manifest.json
 *
 * So looking at manifest-base.json and the resulting manifest.json
 * is an easy way to read this code.
 */

let manifest = require('./manifest-base.json'),
	resource_root = 'inject',
	resources = [],
	content_scripts = [];

let content_base_css = existingFiles(manifest._content_scripts_css);
manifest._content_scripts_css = undefined;

let content_base_js = existingFiles(manifest._content_scripts_js);
manifest._content_scripts_js = undefined;

fs.readdirSync(
	resource_root, { withFileTypes: true }
)
.filter(
	dirent => dirent.isDirectory()
		&& fileExists(dirent, 'matches.json')
		&& (fileExists(dirent, 'inject.css') || fileExists(dirent, 'inject.js'))
)
.forEach(dirent => {
	let dirpath = resource_root+'/'+dirent.name,
		matches = require('./'+dirpath+'/matches.json'),
		built_path_js = dirpath+'/built-path.js',
		content_script = {
			matches: matches,
			css: [],
			js: []
		};

	if (fileExists(dirent, 'inject.css')) {
		content_base_css.css.forEach(script => content_script.css.push(script));

		content_script.js.push(built_path_js)
		content_base_css.js.forEach(script => content_script.js.push(script));
	}

	if (fileExists(dirent, 'inject.js')) {
		content_base_js.js.forEach(script => content_script.js.push(script));
		content_script.js.push(dirpath+'/inject.js');
	}

	content_scripts.push(content_script);

	fs.writeFileSync(
		built_path_js,
		"const css_path = '" + dirpath + "/inject.css';"
	);

	resources.push({
		matches: matches,
		resources: [dirpath + '/inject.css']
	});
})

manifest.content_scripts = content_scripts;
manifest.web_accessible_resources = resources;

fs.writeFileSync('manifest.json', JSON.stringify(manifest));


function fileExists (dirent, filename) {
	return fs.statSync(
		resource_root+'/'+dirent.name+'/'+filename,
		{ throwIfNoEntry: false }
	)
}

function existingFiles (content_scripts) {
	let result = {};

	['css', 'js'].forEach(ft => {
		result[ft] = [];
		content_scripts[ft].forEach(path => {
			if (fs.statSync(path, { throwIfNoEntry: false })) {
				result[ft].push(path);
			}
		});
	})

	return result;
}
