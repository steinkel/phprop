/*
 *  nano Tooltip Plugin v1.0
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
		tooltip: function tooltip(text) {
			this.attr({nano_tooltip: text});
			return nano.tooltip.create(this);
		}
	},
	function() {
		this.reg({
			tooltip: function tooltip(text) {
				return this.tooltip(text);
			}
		});
		this.tooltip = {
			active: true,
			x: 0,
			y: 0,
			left: 20,
			top: 10,
			node: null,
			update: function update(e) {
				nano.tooltip.x = e.clientX;
				nano.tooltip.y = e.clientY;
				var w = window.innerWidth || document.documentElement.clientWidth;
				var h = window.innerHeight || document.documentElement.clientHeight;
				if (nano.isset(nano.tooltip.node)) {
					nano.tooltip.node.moveTo(e.clientX+nano.tooltip.left, e.clientY+nano.tooltip.top);
					if ((nano.tooltip.node.x()+nano.tooltip.node.w()+20) > w) nano.tooltip.node.moveTo(e.clientX-nano.tooltip.node.w()-10, null);
					if ((nano.tooltip.node.y()+nano.tooltip.node.h()+20) > h) nano.tooltip.node.moveTo(null, e.clientY-nano.tooltip.node.h());
				}
			},
			create: function create(obj) {
				if (this.active) {
					if (obj.node.addEventListener) {
						obj.node.addEventListener('mouseover', nano.tooltip.show, true);
						obj.node.addEventListener('mouseout', nano.tooltip.hide, true);
					} else if (obj.node.attachEvent) {
						obj.node.attachEvent('onmouseover', nano.tooltip.show);
						obj.node.attachEvent('onmouseout', nano.tooltip.hide);
					}
				}
				return obj;
			},
			show: function show(e) {
				var node = nano(e.srcElement || this);
				nano.tooltip.node = node.add({tag: 'div', css: 'nano-tooltip', text: node.get('nano_tooltip').content || ''});
				if (node.get('nano_tooltip').fx && nano.fx) {
					var opt = {end: nano.tooltip.node.opacity(), time: node.get('nano_tooltip').time || 300, rate: node.get('nano_tooltip').rate};
					nano.tooltip.node.opacity(0).fx('fadein', opt);
				}
				if (typeof node.get('nano_tooltip').load === 'string' && nano.ajax) {
					nano.ajax.get(node.get('nano_tooltip').load, (node.get('nano_tooltip').cache)? null : {cache: nano.uniq(10)}, function() {
						if (nano.isset(nano.tooltip.node)) nano.tooltip.node.set(this.response.text);
					});
				}
				nano.tooltip.update(e);
			},
			hide: function hide() {
				if (nano.tooltip.node) {
					nano.tooltip.node.del();
					nano.tooltip.node = null;
				}
			}
		};
	});
	if (document.addEventListener) {
		document.addEventListener('mousemove', nano.tooltip.update, true);
	} else if (document.attachEvent) {
		document.attachEvent('onmousemove', nano.tooltip.update);
	} else {
		nano.tooltip.active = false;
	}
}
