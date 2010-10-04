<?php
class PhpropsController extends AppController {

	var $name = 'Phprops';
	var $uses = array ();
	var $helpers = array (
		'Javascript'
	);

	var $debugProps = true; // use a mock object instead real json encoded data

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
	function add() {
	}
	function delete() {
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
			die('not implemented');
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