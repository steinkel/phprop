/*
 *  nano Dialog Plugin v1.0
 *  http://www.nanojs.org
 *
 *  Copyright (c) 2010 James Watts (SOLFENIX)
 *  http://www.solfenix.com
 *
 *  This is FREE software, licensed under the GPL
 *  http://www.gnu.org/licenses/gpl.html
 */

if (nano) {
	nano.plugin({
		dialog: function dialog(obj) {
			return nano.dialog(obj || this.get('nano_dialog'));
		}
	}, function() {
		this.reg({
			dialog: function dialog(obj) {
				this.attr({nano_dialog: obj});
			}
		});
		this.dialog = function dialog(obj) {
			if (!nano('nano-dialog-node') && nano.type(obj) === 'object') {
				var attr = {
					dialog: function() {
						return nano(this).parent().parent();
					},
					close: function() {
						if (nano('nano-dialog-layer-node')) nano('nano-dialog-layer-node').del();
						nano(this).parent().parent().del();
					}
				};
				var w = document.documentElement.clientWidth;
				var h = document.body.offsetHeight;
				if (nano.isset(window.innerHeight) && nano.isset(window.scrollMaxY)) h = window.innerHeight+window.scrollMaxY;
				if (obj.modal) var modal = new nano({parent: nano.body(), tag: 'div', id: 'nano-dialog-layer-node', css: 'nano-dialog-layer'}).style({position: 'absolute', left: '0px', top: '0px', width: w + 'px', height: h + 'px'});
				var dialog = new nano({parent: nano.body(), tag: 'div', id: 'nano-dialog-node', css: 'nano-dialog' + ((typeof obj.css === 'string')? ' ' + obj.css : '')});
				if (obj.drag && nano.dragdrop) {
					dialog.evt({
						mousedown: function(e) { nano(this).drag(e); },
						mouseup: function(e) { nano(this).drop(e); }
					});
				}
				if (obj.fx && nano.fx) {
					var modalOpt  = {end: modal.opacity(), time: obj.time || 300, rate: obj.rate};
					var dialogOpt = {end: dialog.opacity(), time: obj.time || 300, rate: obj.rate};
					dialog.opacity(0);
					modal.opacity(0).fx('fade', modalOpt, function() { dialog.fx('fade', dialogOpt); });
				}
				var title = dialog.add({tag: 'div', css: 'nano-dialog-title'}).add({tag: 'span', text: obj.title || ''}), close;
				if (nano.type(obj.close) === 'object') {
					close = title.parent().add({tag: 'a', css: 'nano-dialog-close', href: 'javascript:void(0);', text: obj.close.text || 'X', attr: attr});
					close.evt({click: (typeof obj.close.callback === 'function')? obj.close.callback : function() { this.close(); }});
				} else {
					title.parent().add({tag: 'a', css: 'nano-dialog-close', href: 'javascript:void(0);', text: 'X', attr: attr, evt: {click: function() { this.close(); }}});
				}
				dialog.add({tag: 'div', id: 'nano-dialog-content-node', css: 'nano-dialog-content', text: (typeof obj.content === 'string' || typeof obj.content === 'number')? obj.content : ''});
				if (typeof obj.load === 'string' && nano.ajax) {
					nano.ajax.get(obj.load, (obj.cache)? null : {cache: nano.uniq(10)}, function() {
						if (nano.isset(nano('nano-dialog-content-node'))) {
							nano('nano-dialog-content-node').set(this.response.text);
							var w = document.documentElement.clientWidth;
							var h = document.body.offsetHeight;
							if (nano.isset(window.innerHeight) && nano.isset(window.scrollMaxY)) h = window.innerHeight+window.scrollMaxY;
							var x = (document.documentElement.clientWidth-dialog.w())/2;
							var y = (document.documentElement.clientHeight-dialog.h())/2;
							if (dialog.w() > document.documentElement.clientWidth) {
								dialog.resizeTo(document.documentElement.clientWidth, null);
								x = 0;
							}
							if (dialog.h() > document.documentElement.clientHeight) {
								dialog.resizeTo(null, document.documentElement.clientHeight);
								y = 0;
							}
							dialog.show().moveTo(x, y+((nano.isset(window.pageYOffset))? window.pageYOffset-30 : document.body.scrollTop-30));
							if (typeof this.data.onload === 'function') this.data.onload.call(dialog);
						}
					}, null, null, {onload: obj.onload});
				} else {
					if (typeof obj.onload === 'function') obj.onload.call(dialog);
				}
				if (nano.type(obj.buttons) === 'array') {
					var buttons = dialog.add({tag: 'div', css: 'nano-dialog-buttons'}), button;
					for (var i = 0; i < obj.buttons.length; i++) {
						button = buttons.add({tag: 'button', css: obj.buttons[i].css || 'nano-dialog-button', text: obj.buttons[i].text || ''}).attr(attr);
						if (typeof obj.buttons[i].callback === 'function') button.evt({click: obj.buttons[i].callback});
						if (obj.buttons[i].focus) button.focus();
					}
				}
				var x = (document.documentElement.clientWidth-dialog.w())/2;
				var y = (document.documentElement.clientHeight-dialog.h())/2;
				if (dialog.w() > document.documentElement.clientWidth) {
					dialog.resizeTo(document.documentElement.clientWidth, null);
					x = 0;
				}
				if (dialog.h() > document.documentElement.clientHeight) {
					dialog.resizeTo(null, document.documentElement.clientHeight);
					y = 0;
				}
				dialog.show().moveTo(x, y+((nano.isset(window.pageYOffset))? window.pageYOffset-30 : document.body.scrollTop-30));
				return {
					modal: modal,
					dialog: dialog,
					options: {modal: modalOpt, dialog: dialogOpt},
					fx: obj.fx,
					show: function() {
						if (!this.dialog.visible()) {
							if (this.modal) this.modal.show();
							this.dialog.show();
							if (this.fx && nano.fx) {
								if (this.modal) this.modal.fx('fade', this.options.modal);
								this.dialog.fx('fade', this.options.dialog);
							}
						}
						return this;
					},
					hide: function() {
						if (this.dialog.visible()) {
							if (this.fx && nano.fx) {
								if (this.modal) this.modal.fx('fadeout', {time: this.options.modal.time, rate: this.options.modal.rate}, function() { this.hide(); });
								this.dialog.fx('fadeout', {time: this.options.dialog.time, rate: this.options.dialog.rate}, function() { this.hide(); });
							} else {
								if (this.modal) this.modal.hide();
								this.dialog.hide();
							}
						}
						return this;
					},
					toggle: function() {
						this[(this.dialog.visible())? 'hide' : 'show']();
						return this;
					},
					close: function() {
						if (this.modal) this.modal.del();
						return this.dialog.del();
					}
				};
			}
			return false;
		};
		if (document.addEventListener) {
			window.addEventListener('resize', function() { if (nano('nano-dialog-layer-node')) { nano('nano-dialog-layer-node').resizeTo(document.documentElement.clientWidth, window.innerHeight+window.scrollMaxY); }
			}, true);
		} else if (document.attachEvent) {
			window.attachEvent('onresize', function() { if (nano('nano-dialog-layer-node')) { nano('nano-dialog-layer-node').resizeTo(document.documentElement.clientWidth, document.body.offsetHeight); } });
		}
	});
}
