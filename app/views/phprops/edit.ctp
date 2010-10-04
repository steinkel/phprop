<?php
$codeBlock = "var data = {id: $id, key: '$key', defaultValue: '${values['default']}', isHtml: $htmlValue, isTranslated: $translatedValue};";
//FIXME: This should be configured
@$locales = <<<EOD
			var locales = [
				{id: 1, locale: 'es_ES', hash: 'español', text: 'Español <img src="es.png" alt="es_ES" />', value: '${values['es']}'},
				{id: 2, locale: 'de_DE', hash: 'deutsch', text: 'Deutsch <img src="de.png" alt="de_DE" />', value: '${values['de']}'},
				{id: 3, locale: 'en_UK', hash: 'english', text: 'English <img src="en.png" alt="en_UK" />', value: '${values['en']}'}
			];
			nano(function() { phprop.editor(data); });
EOD;

$javascript->codeBlock($codeBlock, array('inline' => false));
$javascript->codeBlock($locales, array('inline' => false));
?>
<div id="phprop-box">
<div id="phprop-editor">
<div id="phprop-editor-controls">
<label for="key">Key:</label>
<input id="key" type="text" name="key" value="" />
<button id="save">Save &amp; Close</button>
<button id="cancel">Cancel &amp; Close</button>
</div>
<div id="phprop-editor-content"></div>
</div>
</div>
	