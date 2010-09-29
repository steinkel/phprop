/*
 *  nano CKEditor Plugin v1.0
 *  http://www.nanojs.org
 *
 *  Copyright (c) 2010 James Watts (SOLFENIX)
 *  http://www.solfenix.com
 *
 *  This is FREE software, licensed under the GPL
 *  http://www.gnu.org/licenses/gpl.html
 */

if (nano){
	nano.plugin({
		ckeditor: function ckeditor(obj) {
			if (nano.empty(this.node.id)) this.node.id = nano.uniq(10);
			obj = (nano.type(obj) === 'object')? obj : {};
			if (!nano.isset(CKEDITOR.instances[this.node.id])) CKEDITOR.replace(this.node.id, obj);
			return CKEDITOR.instances[this.node.id];
		},
		getInstance: function getInstance() {
			return CKEDITOR.instances[this.node.id];
		},
		updateElement: function updateElement() {
			return CKEDITOR.instances[this.node.id].updateElement();
		},
		setData: function setData(data, url, params, method) {
			if (nano.isset(data)) CKEDITOR.instances[this.node.id].setData(data);
			if (url && nano.ajax) return nano.ajax[method || 'get'](url, params, function() { CKEDITOR.instances[this.data.id].setData(this.response.text); }, null, null, {id: this.node.id});
			return true;
		},
		getData: function getData() {
			return CKEDITOR.instances[this.node.id].getData();
		},
		getSelection: function getSelection() {
			return CKEDITOR.instances[this.node.id].getSelection();
		},
		execCommand: function execCommand(cmd, data) {
			return CKEDITOR.instances[this.node.id].execCommand(cmd, data);
		}
	});
}
