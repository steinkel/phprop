/*  
 *  PHProp v1.0
 *
 *  Copyright (c) 2010 Jorge Gonzalez and James Watts
 * 
 *  This is FREE software, licensed under the GPL
 *  http://www.gnu.org/licenses/gpl.html
 */

var phprop = {
	key  : null,
	node : null,
	data : null,
	actionURL : null,
	table: function table(data) {
		var info  = {
			headers: ['Key', 'Default Value', 'Is HTML', 'Is Translated', ''],
			sorting: ['string', 'string', 'checkbox', 'checkbox', null],
			paging : true,
			range  : 10
		};
		this.data = data || [];
		this.node = nano.datatable.create('phprop-table', info);
		this.node.load(this.data);
		return this;
	},
	editor: function editor(data) {
		if (nano.type(data) === 'object' && nano.isset(data.key)) {
			this.key = data.key || '';
			nano('key').set(this.key);
			nano('save').evt({click: this.save}).tooltip({content: 'Save changes'});
			nano('cancel').evt({click: this.cancel}).tooltip({content: 'Discard changes'});
			var tabs = [];
			tabs.push({
				hash   : 'default',
				text   : 'Default',
				content: '<textarea id="default">' + data.defaultValue + '</textarea>',
				onload : function() {
					var textarea = this.find('tag', 'textarea');
					if (textarea.length > 0 && textarea[0].hasClass('phprop-html')) textarea[0].ckeditor();
				}
			});
			if (data.isTranslated) {
				for (var i = 0; i < locales.length; i++) {
					tabs.push({
						hash   : locales[i].hash,
						text   : locales[i].text,
						content: '<textarea id="' + locales[i].locale + '">' + locales[i].value + '</textarea>',
						onload : function() {
							var textarea = this.find('tag', 'textarea');
							if (textarea.length > 0 && textarea[0].hasClass('phprop-html')) textarea[0].ckeditor();
						}
					});
				}
			}
			this.data = data || {id: 0};
			this.node = nano('phprop-editor-content').tabs({tabs: tabs, persist: true});
			if (data.isHtml) {
				nano('default').ckeditor();
				if (data.isTranslated) {
					for (var i = 0; i < locales.length; i++) {
						nano(locales[i].locale).ckeditor();
					}
				}
			}
		}
		return this;
	},
	dialog: function dialog(text) {
		nano.dialog({
			modal  : true,
			title  : 'Warning...',
			content: text,
			buttons: [{
				text    : 'Save',
				callback: function() {
					phprop.send();
					this.close();
				}
			}, {
				text    : 'Cancel',
				callback: function() { this.close(); }
			}]
		});
	},
	save: function save() {
		if (nano('key').get() != phprop.key) {
			return phprop.dialog('Key has changed from "' + phprop.key + '" to "' + nano('key').get() + '", are you sure you want to save data to a different key?');
		}
		phprop.send();
	},
	cancel: function cancel() {
		window.close();
	},
	send: function send() {
		var form = new nano({tag: 'form', parent: nano.body(), action: phprop.actionURL, method: 'post'});
		if (phprop.data.isHtml) {
			form.add({tag: 'input', name: 'default', text: CKEDITOR.instances['default'].getData()});
			if (phprop.data.isTranslated) {
				for (var i = 0; i < locales.length; i++) {
					form.add({tag: 'input', name: locales[i].locale, text: CKEDITOR.instances[locales[i].locale].getData()});
				}
			}
			
		} else {
			form.add({tag: 'input', name: 'default', text: nano('default').get()});
			if (phprop.data.isTranslated) {
				for (var i = 0; i < locales.length; i++) {
					form.add({tag: 'input', name: locales[i].locale, text: nano(locales[i].locale).get()});
				}
			}
		}
		form.submit();
		/*
		nano.dialog({
			modal  : true,
			title  : 'Warning...',
			content: 'Your changes have been saved. Would you like to close this window or continue editing?',
			buttons: [{
				text    : 'Close',
				callback: function() {
					window.close();
				}
			}, {
				text    : 'Continue',
				callback: function() { this.close(); }
			}]
		});
		*/
	}
};
