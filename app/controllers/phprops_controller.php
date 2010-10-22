<?php
class PhpropsController extends AppController {

	var $name = 'Phprops';
	var $uses = array ();
	var $helpers = array (
		'Javascript'
	);

	var $debugProps = false; // use a mock object instead real json encoded data
	var $propsFileName = null;
	
	function beforeFilter(){
		$this->propsFileName = TMP . 'properties.json';
	}

	function index() {
		$props = $this->__readProps();
		$this->set('props', $props);
	}

	function edit($key = null, $htmlEditor = 0, $translatorEditor = 0) {
		//FIXME: para qué sirve el id ??
		$this->set('id', '1');
		$prop = $this->__readProps($key);
		$this->set('key', $key);
		$this->set('htmlValue', $htmlEditor);
		$this->set('translatedValue', $translatorEditor);
		$this->set('values', $prop[$key]['values']);
	}

	/**
	 * Updates existing key
	 */
	function update($key) {
		//TODO: $key = Sanitize :: clean($key);
		if ($this->params['form']) {
			// form processing (save)
			$prop = $this->__readProps($key);
			if (!empty ($prop)) {
				// updating the prop
				debug($prop);
				debug($this->params['form']);
				$prop[$key]['values'] = $this->params['form'];
				debug($prop);

			}
		}
	}

	/**
	 * Adds a new key with config
	 */
	function add() {
		if ($this->data) {
			$newKey = $this->data['Phprop']['key'];
			$isHTML = $this->data['Phprop']['isHTML'];
			$isTranslated = $this->data['Phprop']['isTranslated'];
			$defaultValue = $this->data['Phprop']['defaultValue'];
			
			$prop = $this->__readProps();
			if (@ !isset ($prop[$newKey])) {
				// saves the new key
				$this->__saveNewProp($newKey, $isHTML, $isTranslated, $defaultValue);
				$editURL = Router::url(array('action' => 'edit', $newKey, $isHTML, $isTranslated));
				$this->Session->setFlash("Key '$newKey' added, <a href='" . $editURL . "'>click here to edit the new key</a>");
			} else {
				//key exists, abort
				$this->Session->setFlash("Key '$newKey' is already defined, no key was added. Please type another key.");
			}

		}

	}
	function delete() {
	}

	function __saveNewProp($newKey, $isHTML, $isTranslated, $defaultValue) {
		$prop = $this->__readProps();
		$prop[$newKey] = array (
			'isTranslated' => $isTranslated,
			'isHTML' => $isHTML,
			'values' => array ('default' => $defaultValue)
		);
		if ($isTranslated){
			//TODO: This should be configured
			$prop[$newKey]['values']['es'] = "";
			$prop[$newKey]['values']['de'] = "";
			$prop[$newKey]['values']['en'] = "";
			
		}
		$this->__saveProps($prop);
	}

	function __saveProps($props) {
		$fh = fopen($this->propsFileName, "w");
		fwrite($fh, json_encode($props));
		fclose($fh);
	}

	function __readProps($key = null) {
		if ($this->debugProps) {
			if (!$key) {
				return $this->__getMockData();
			} else {
				$allProps = $this->__getMockData();
				if (isset ($allProps[$key])) {
					return array (
						$key => $allProps[$key]
					);
				} else {
					die("Key '$key' is not defined.");
				}
			}

		} else {
			$filecontent = file_get_contents($this->propsFileName);
			$props = json_decode($filecontent, true);
			//debug($props);
			return $props;
		}
	}

	function __getMockData() {
		$props = array (
			'Nombre del Hotel' => array (
				'isTranslated' => 0,
				'isHTML' => 0,
				'values' => array (
					'default' => 'este es el nombre del hotel'
				)
			),
			'Key2' => array (
				'isTranslated' => 1,
				'isHTML' => 1,
				'values' => array (
					'default' => '<h1>Value en HTML</h2>',
					'es' => '<h1>Valor en HTML</h1>',
					'de' => '<h1>gut und günstig</h1>',
					'en' => 'in english'
				)
			),
			'Key3' => array (
				'isTranslated' => 1,
				'isHTML' => 0,
				'values' => array (
					'default' => '<h1>Value en HTML</h2>',
					'es' => '<h1>Valor en HTML</h1>',
					'de' => '<h1>gut und günstig</h1>',
					'en' => 'in english'
				)
			),
			'Key4' => array (
				'isTranslated' => 0,
				'isHTML' => 1,
				'values' => array (
					'default' => '<h1>Value en HTML</h2>',
					'es' => '<h1>Valor en HTML</h1>',
					'de' => '<h1>gut und günstig</h1>',
					'en' => 'in english'
				)
			)
		);
		return $props;
	}

}
?>