<?php
class PhpropsController extends AppController {

	var $name = 'Phprops';
	var $uses = array();
	var $helpers = array('Javascript');
	
	function index(){}
	function edit($key = null, $editorType = 1){
		$this->set('id', '1');
		$this->set('defaultValue', 'default');
		$this->set('key', 'key');
		$this->set('htmlValue', 1);
		$this->set('translatedValue', 1);
	}
	function add(){}
	function delete(){}
	
}
?>