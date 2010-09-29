/*
 *  nano Tabs Plugin v1.0
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
		tabs: function tabs(obj) {
			return nano.tabs.create(this, obj);
		}
	},
	function() {
		this.reg({
			tabs: function tabs(obj) {
				return this.tabs(obj);
			}
		});
		this.tabs = {
			groups: {},
			create: function create(node, obj) {
				if (nano.type(obj.tabs) === 'array' && obj.tabs.length > 0) {
					node = nano(node);
					node.empty();
					var id    = nano.uniq(10);
					var ul    = node.add({tag: 'ul', id: id, css: 'nano-tabs'});
					var li    = null;
					var hash  = null;
					var index = obj.selected || 0;
					for (var i = 0; i < obj.tabs.length; i++) {
						li = ul.add({
							tag: 'li',
							css: 'nano-tabs-tab' + ((typeof obj.tabs[i].css === 'string')? ' ' + obj.tabs[i].css : '')
						}).add({
							tag : 'a',
							css : 'nano-tabs-link',
							href: '#' + ((typeof obj.tabs[i].hash === 'string')? obj.tabs[i].hash : ''),
							text: (typeof obj.tabs[i].text === 'string')? obj.tabs[i].text : '',
							attr: {nano_tabs_id: id, nano_tabs_tab: i, nano_tabs_disabled: obj.tabs[i].disabled || false},
							evt : {
								click: function() { return nano.tabs.change(this); }
							}
						});
						if (obj.tabs[i].disabled) li.parent().addClass('nano-tabs-disabled');
						if (obj.tabs[i].hide) li.parent().hide();
						if (location.hash && '#' + obj.tabs[i].hash === location.hash) hash = i;
					}
					obj.selected = obj.selected || 0;
					if (obj.persist) {
						for (var j = 0; j < obj.tabs.length; j++) {
							node.add({tag: 'div', id: id + '_' + j, css: 'nano-tabs-content', text: obj.tabs[j].content}).hide();
						}
						nano(id + '_' + obj.selected).show();
					} else {
						node.add({tag: 'div', css: 'nano-tabs-content'});
					}
					this.groups[id] = {node: ul, options: obj};
					if (nano.isset(hash)) index = hash;
					this.change(ul.children()[index || 0].find('tag', 'a')[0].node);
					return {
						node   : node,
						tabs   : ul,
						select : function select(index) {
							nano.tabs.select(this.tabs.get('id'), index);
							return this;
						},
						enable : function enable(index) {
							nano.tabs.enable(this.tabs.get('id'), index);
							return this;
						},
						disable: function disable(index) {
							nano.tabs.disable(this.tabs.get('id'), index);
							return this;
						},
						show   : function show(index) {
							nano.tabs.show(this.tabs.get('id'), index);
							return this;
						},
						hide   : function hide(index) {
							nano.tabs.hide(this.tabs.get('id'), index);
							return this;
						},
						toggle : function toggle(index) {
							nano.tabs.toggle(this.tabs.get('id'), index);
							return this;
						},
						add    : function add(obj) {
							nano.tabs.add(this.tabs.get('id'), obj);
							return this;
						},
						del    : function del(index) {
							nano.tabs.del(this.tabs.get('id'), index);
							return this;
						},
						load   : function(url, param) {
							nano.tabs.load(this.tabs.get('id'), url, param);
							return this;
						}
					};
				}
				return false;
			},
			tab: function tab(id, index) {
				return nano(id).find('tag', 'ul')[0].children()[index || 0].find('tag', 'a')[0];
			},
			change: function change(node) {
				node = (!node.nano)? nano(node) : node;
				if (!node.get('nano_tabs_disabled')) {
					var id    = node.get('nano_tabs_id');
					var index = node.get('nano_tabs_tab');
					var ul    = nano(id);
					var div   = ul.parent().find('tag', 'div')[0];
					ul.children()[nano.tabs.groups[id].options.selected].delClass('nano-tabs-selected');
					if (nano.tabs.groups[id].options.persist) {
						nano(id + '_' + nano.tabs.groups[id].options.selected).hide();
						nano(id + '_' + index).show();
						if (typeof nano.tabs.groups[id].options.tabs[index].onload === 'function') nano.tabs.groups[id].options.tabs[index].onload.call(div, {node: div, id: id, tab: index, options: nano.tabs.groups[id].options.tabs[index]});
					} else {
						if (typeof nano.tabs.groups[id].options.tabs[index].load === 'string' && nano.ajax) {
							if (typeof nano.tabs.groups[id].options.content === 'string') nano.tabs.groups[id].node.parent().find('tag', 'div')[0].set(nano.tabs.groups[id].options.content);
							nano.ajax.get(nano.tabs.groups[id].options.tabs[index].load, nano.tabs.groups[id].options.tabs[index].params || null, function() {
								this.data.node.set(this.response.text);
								if (typeof this.data.options.onload === 'function') this.data.options.onload.call(this.data.node, this.data);
							}, null, null, {node: div, id: id, tab: index, options: nano.tabs.groups[id].options.tabs[index]});
						} else {
							div.set(nano.tabs.groups[id].options.tabs[index].content);
							if (typeof nano.tabs.groups[id].options.tabs[index].onload === 'function') nano.tabs.groups[id].options.tabs[index].onload.call(div, {node: div, id: id, tab: index, options: nano.tabs.groups[id].options.tabs[index]});
						}
					}
					ul.children()[index].addClass('nano-tabs-selected');
					nano.tabs.groups[id].options.selected = index;
				}
				return this;
			},
			select: function select(id, index) {
				return this.change(this.tab(id, index).node);
			},
			enable: function enable(id, index) {
				var tab = this.tab(id, index);
				tab.attr({nano_tabs_disabled: false});
				tab.parent().addClass('nano-tabs-disabled');
				return this;
			},
			disable: function disable(id, index) {
				var tab = this.tab(id, index);
				tab.attr({nano_tabs_disabled: true});
				if (!tab.parent().hasClass('nano-tabs-disabled')) tab.parent().addClass('nano-tabs-disabled');
				return this;
			},
			show: function show(id, index) {
				this.tab(id, index).parent().show();
				return this;
			},
			hide: function hide(id, index) {
				this.tab(id, index).parent().hide();
				return this;
			},
			toggle: function toggle(id, index) {
				this.tab(id, index).parent().toggle();
				return this;
			},
			add: function add(id, tab) {
				var li = nano(id).find('tag', 'ul')[0].add({tag: 'li', css: 'nano-tabs-tab' + ((typeof tab.css === 'string')? ' ' + tab.css : '')}).add({tag: 'a', css: 'nano-tabs-link', href: '#' + ((typeof tab.hash === 'string')? tab.hash : ''), text: (typeof tab.text === 'string')? tab.text : '', attr: {nano_tabs_id: id, nano_tabs_tab: i, nano_tabs_disabled: tab.disabled || false}, evt: {click: function() { return nano.tabs.change(this); }}});
				if (tab.disabled) li.addClass('nano-tabs-disabled');
				if (tab.hide) li.hide();
				return li;
			},
			del: function del(id, index) {
				nano(id).find('tag', 'ul')[0].children()[index || 0].del();
				return this;
			},
			load: function load(id, url, param) {
				if (typeof nano.tabs.groups[id].options.content === 'string') nano.tabs.groups[id].node.parent().find('tag', 'div')[0].set(nano.tabs.groups[id].options.content);
				return nano.ajax.get(url, param, function() { nano(this.data.node).set(this.response.text); }, null, {node: nano(id).find('tag', 'div')[0]});
			}
		};
	});
}
