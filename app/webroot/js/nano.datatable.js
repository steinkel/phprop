/*
 *  nano DataTable plugin v1.0
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
		datatable: function datatable(data, obj) {
			return nano.datatable.create(this, obj).load(data);
		}
	},
	function() {
		this.datatable = {
			tables: {},
			create: function create(node, obj) {
				node   = (node.nano)? node : nano(node);
				obj    = (nano.type(obj) === 'object')? obj : {};
				var id = nano.uniq(10);
				node.empty();
				if (!nano('nano_datatable')) var store = new nano({tag: 'table', id: 'nano_datatable_' + id}).add({tag: 'tbody'});
				new nano();
				this.tables[id] = {
					id     : id,
					node   : node,
					store  : store,
					copy   : new nano({tag: 'table'}).add({tag: 'tbody'}),
					headers: (nano.type(obj.headers) === 'array')? obj.headers : [],
					sorting: (nano.type(obj.sorting) === 'array')? obj.sorting : [],
					paging : (obj.paging)? true : false,
					range  : obj.range || 10,
					page   : 0,
					evt    : (nano.type(obj.evt) === 'object')? obj.evt : {}
				};
				this.tables[id].table = this.tables[id].node.add({tag: 'table', id: id, css: 'nano-datatable'});
				this.tables[id].head  = this.tables[id].table.add({tag: 'thead', css: 'nano-datatable-head'});
				this.tables[id].body  = this.tables[id].table.add({tag: 'tbody', css: 'nano-datatable-body'});
				if (this.tables[id].headers.length > 0) {
					var tr   = this.tables[id].head.add({tag: 'tr'});
					var fn   = null;
					var sort = null;
					for (var i = 0; i < this.tables[id].headers.length; i++) {
						fn   = null;
						sort = null;
						if (this.tables[id].sorting.length > i) {
							fn = function() { this.nano_datatable.sort(this.nano_datatable_column, this.nano_datatable_sorting); };
							sort = this.tables[id].sorting[i];
						}
						tr.add({tag: 'th', css: 'nano-datatable-header', text: this.tables[id].headers[i], attr: {nano_datatable: this.tables[id], nano_datatable_column: i, nano_datatable_sorting: sort}, evt: {click: fn}});
					}
				}
				this.tables[id].load = function load(data) { return nano.datatable.load(this.id, data); };
				this.tables[id].append = function append(data) { return nano.datatable.append(this.id, data); };
				this.tables[id].clear = function clear() { return nano.datatable.clear(this.id); };
				this.tables[id].change = function change(page) { return nano.datatable.change(this.id, page); };
				this.tables[id].back = function back() { return nano.datatable.back(this.id); };
				this.tables[id].next = function next(page) { return nano.datatable.next(this.id); };
				this.tables[id].show = function show(col) { return nano.datatable.show(this.id, col); };
				this.tables[id].hide = function hide(col) { return nano.datatable.hide(this.id, col); };
				this.tables[id].toggle = function toggle(col) { return nano.datatable.toggle(this.id, col); };
				this.tables[id].filter = function filter(val, col) { return nano.datatable.filter(this.id, val, col); };
				this.tables[id].unfilter = function unfilter() { return nano.datatable.unfilter(this.id); };
				this.tables[id].sort = function sort(col, type) { return nano.datatable.sort(this.id, col, type); };
				return this.tables[id];
			},
			load: function load(id, data) {
				if (this.tables[id]) {
					this.tables[id].body.empty();
					this.tables[id].page = 0;
					var i, tr, j;
					for (i = 0; i < data.length; i++) {
						tr = this.tables[id].body.add({tag: 'tr', css: 'nano-datatable-row nano-datatable-row-' + ((i % 2)? 'odd' : 'even')});
						if (nano.type(data[i]) === 'array') {
							for (j = 0; j < data[i].length; j++) {
								tr.add({tag: 'td', css: 'nano-datatable-cell nano-datatable-cell-' + ((i % 2)? 'odd' : 'even'), text: '' + data[i][j], attr: {nano_datatable: this.tables[id], nano_datatable_filtered: false}, evt: this.tables[id].evt});
							}
						} else {
							for (j in data[i]) {
								tr.add({tag: 'td', css: 'nano-datatable-cell nano-datatable-cell-' + ((i % 2)? 'odd' : 'even'), text: '' + data[i][j], attr: {nano_datatable: this.tables[id], nano_datatable_filtered: false}, evt: this.tables[id].evt});
							}
						}
						this.tables[id].copy.add(tr.node.cloneNode(true));
					}
					if (this.tables[id].paging) {
						var rows = this.tables[id].body.find('tag', 'tr');
						rows.each(function() { this.hide(); });
						for (i = 0; i < this.tables[id].range; i++) {
							if (typeof rows[i] !== 'undefined') rows[i].show('table-row');
						}
						var current = nano('nano-datatable-current');
						var total   = nano('nano-datatable-total');
						if (current) current.set(this.tables[id].page+1);
						if (total) total.set(Math.ceil(rows.length/this.tables[id].range));
					}
					return this.tables[id];
				}
				return false;
			},
			append: function append(id, data) {
				if (this.tables[id]) {
					var tr, j;
					for (var i = 0; i < data.length; i++) {
						tr = this.tables[id].body.add({tag: 'tr', css: 'nano-datatable-row nano-datatable-row-' + ((i % 2)? 'odd' : 'even')});
						if (nano.type(data[i]) === 'array') {
							for (j = 0; j < data[i].length; j++) {
								tr.add({tag: 'td', css: 'nano-datatable-cell nano-datatable-cell-' + ((i % 2)? 'odd' : 'even'), text: '' + data[i][j], attr: {nano_datatable_filtered: false}});
							}
						} else {
							for (j in data[i]) {
								tr.add({tag: 'td', css: 'nano-datatable-cell nano-datatable-cell-' + ((i % 2)? 'odd' : 'even'), text: '' + data[i][j], attr: {nano_datatable_filtered: false}});
							}
						}
						this.tables[id].copy.add(tr.node.cloneNode(true));
					}
					if (this.tables[id].paging) {
						this.tables[id].page = 0;
						var rows = this.tables[id].body.find('tag', 'tr');
						rows.each(function() { this.hide(); });
						for (i = 0; i < this.tables[id].range; i++) {
							if (typeof rows[i] !== 'undefined') rows[i].show('table-row');
						}
						var current = nano('nano-datatable-current');
						var total   = nano('nano-datatable-total');
						if (current) current.set(this.tables[id].page+1);
						if (total) total.set(Math.ceil(rows.length/this.tables[id].range));
					}
					return this.tables[id];
				}
				return false;
			},
			clear: function clear(id) {
				if (this.tables[id]) {
					this.tables[id].body.empty();
					return this.tables[id];
				}
				return false;
			},
			change: function change(id, page) {
				if (this.tables[id] && this.tables[id].paging) {
					var rows = this.tables[id].body.find('tag', 'tr');
					if (rows.length > page*this.tables[id].range) {
						var length = (rows.length < (page*this.tables[id].range)+this.tables[id].range)? rows.length-(page*this.tables[id].range) : rows.length;
						rows.each(function() { this.hide(); });
						this.tables[id].page = page;
						for (var i = page*this.tables[id].range; i < length; i++) {
							if (typeof rows[i] !== 'undefined') rows[i].show('table-row');
						}
					}
					return this.tables[id];
				}
				return false;
			},
			back: function back(id) {
				if (this.tables[id] && this.tables[id].paging) {
					var rows = this.tables[id].body.find('tag', 'tr');
					rows.each(function() { this.hide(); });
					if (this.tables[id].page > 0) this.tables[id].page--;
					for (var i = this.tables[id].page*this.tables[id].range; i < (this.tables[id].page*this.tables[id].range)+this.tables[id].range; i++) {
						if (typeof rows[i] !== 'undefined') rows[i].show('table-row');
					}
					var current = nano('nano-datatable-current');
					var total   = nano('nano-datatable-total');
					if (current) current.set(this.tables[id].page+1);
					if (total) total.set(Math.ceil(rows.length/this.tables[id].range));
					return this.tables[id];
				}
				return false;
			},
			next: function next(id) {
				if (this.tables[id] && this.tables[id].paging) {
					var rows = this.tables[id].body.find('tag', 'tr');
					if (rows.length > (this.tables[id].page+1)*this.tables[id].range) {
						var length = ((this.tables[id].page+1)*this.tables[id].range)+this.tables[id].range;
						this.tables[id].page++;
						rows.each(function() { this.hide(); });
						for (var i = this.tables[id].page*this.tables[id].range; i < length; i++) {
							if (typeof rows[i] !== 'undefined') rows[i].show('table-row');
						}
					}
					var current = nano('nano-datatable-current');
					var total   = nano('nano-datatable-total');
					if (current) current.set(this.tables[id].page+1);
					if (total) total.set(Math.ceil(rows.length/this.tables[id].range));
					return this.tables[id];
				}
				return false;
			},
			show: function show(id, col) {
				if (this.tables[id]) {
					var row = this.tables[id].head.find('tag', 'tr');
					if (row.length > 0) {
						var headers = row[0].find('tag', 'th');
						if (headers[col]) headers[col].show('table-cell');
					}
					var rows = this.tables[id].body.find('tag', 'tr');
					for (var i = 0; i < rows.length; i++) {
						rows[i].find('tag', 'td')[col].show('table-cell');
					}
					return this.tables[id];
				}
				return false;
			},
			hide: function hide(id, col) {
				if (this.tables[id]) {
					var row = this.tables[id].head.find('tag', 'tr');
					if (row.length > 0) {
						var headers = row[0].find('tag', 'th');
						if (headers[col]) headers[col].hide();
					}
					var rows = this.tables[id].body.find('tag', 'tr');
					for (var i = 0; i < rows.length; i++) {
						rows[i].find('tag', 'td')[col].hide();
					}
					return this.tables[id];
				}
				return false;
			},
			toggle: function toggle(id, col) {
				if (this.tables[id]) {
					if (this.tables[id].body.find('tag', 'tr')[0].find('tag', 'td')[col].visible()) return this.hide(id, col);
					return this.show(id, col);
				}
				return false;
			},
			filter: function filter(id, val, col) {
				if (this.tables[id]) {
					var table = this.tables[id];
					var value = val;
					var td    = col;
					table.body.find('tag', 'tr').each(function() { table.store.add(this); });
					table.store.find('tag', 'tr').each(function() {
						var tds    = this.find('tag', 'td');
						var regexp = new RegExp(value, 'i');
						if (nano.isset(td)) {
							if (nano.type(col) === 'array') {
								for (var i = 0; i < col.length; i++) {
									if (regexp.test(tds[col[i]].get())) {
										table.body.add(this);
										break;
									}
								}
							} else {
								if (regexp.test(tds[td].get())) table.body.add(this);
							}
						} else {
							for (var i = 0; i < tds.length; i++) {
								if (regexp.test(tds[i].get())) {
									table.body.add(this);
									break;
								}
							}
						}
					});
					if (table.paging) {
						table.page = 0;
						var current = nano('nano-datatable-current');
						var total   = nano('nano-datatable-total');
						if (current) current.set(table.page+1);
						if (total) total.set(Math.ceil(table.body.find('tag', 'tr').length/table.range));
						table.back();
					}
					return table;
				}
				return false;
			},
			unfilter: function unfilter(id) {
				if (this.tables[id]) {
					var table = this.tables[id];
					table.body.empty();
					table.store.empty();
					table.copy.find('tag', 'tr').each(function() { table.body.add(this.node.cloneNode(true)); });
					if (table.paging) {
						table.page = 0;
						var rows = table.body.find('tag', 'tr');
						rows.each(function() { this.hide(); });
						for (i = 0; i < table.range; i++) {
							if (typeof rows[i] !== 'undefined') rows[i].show('table-row');
						}
						var current = nano('nano-datatable-current');
						var total   = nano('nano-datatable-total');
						if (current) current.set(table.page+1);
						if (total) total.set(Math.ceil(rows.length/table.range));
					}
					return table;
				}
				return false;
			},
			sort: function sort(id, col, type) {
				if (this.tables[id]) {
					var table   = this.tables[id].body.node;
					var rows    = table.rows;
					var cols    = table.rows[0].cells;
					var current = col || 0;
					function compareString(a, b) {
						if (a[current] < b[current]) return -1;
						if (a[current] > b[current]) return 1;
						return 0;
					}
					function compareStringIgnore(a, b) {
						var strA = a[current].toLowerCase();
						var strB = b[current].toLowerCase();
						if (strA < strB) return -1;
						return (strA > strB)? 1 : 0;
					}
					function compareNumber(a, b) {
						var numA = a[current];
						var numB = b[current];
						if (isNaN(numA)) return 0;
						return (isNaN(numB))? 0 : numA-numB;
					}
					function compareDate(a, b) {
						var dateA = null;
						var dateB = null;
						if (a[current].indexOf('.') != -1 || b[current].indexOf('.') != -1) {
							dateA = (a[current].indexOf('.') != -1)? a[current].split('.') : '';
							dateB = (b[current].indexOf('.') != -1)? b[current].split('.') : '';
							dateA = (a[current].indexOf('.') != -1)? new Date(dateA[2], dateA[1], dateA[0]) : new Date(1);
							dateB = (b[current].indexOf('.') != -1)? new Date(dateB[2], dateB[1], dateB[0]) : new Date(1);
						} else if (a[current].indexOf('-') != -1 || b[current].indexOf('-') != -1) {
							dateA = (a[current].indexOf('-') != -1)? a[current].split('-') : '';
							dateB = (b[current].indexOf('-') != -1)? b[current].split('-') : '';
							dateA = (a[current].indexOf('-') != -1)? new Date(dateA[2], dateA[1], dateA[0]) : new Date(1);
							dateB = (b[current].indexOf('-') != -1)? new Date(dateB[2], dateB[1], dateB[0]) : new Date(1);
						} else if (a[current].indexOf('/') != -1 || b[current].indexOf('/') != -1) {
							dateA = (a[current].indexOf('/') != -1)? a[current].split('/') : '';
							dateB = (b[current].indexOf('/') != -1)? b[current].split('/') : '';
							dateA = (a[current].indexOf('/') != -1)? new Date(dateA[2], dateA[1], dateA[0]) : new Date(1);
							dateB = (b[current].indexOf('/') != -1)? new Date(dateB[2], dateB[1], dateB[0]) : new Date(1);
						} else {
							dateA = (a[current].length == 8)? new Date(a[current].substring(4,8), a[current].substring(2,4), a[current].substring(0,2)) : new Date(1);
							dateB = (b[current].length == 8)? new Date(b[current].substring(4,8), b[current].substring(2,4), b[current].substring(0,2)) : new Date(1);
						}
						if (dateA < dateB) return -1;
						return (dateA > dateB)? 1 : 0;
					}
					function compareCheckbox(a, b) {
						var checkboxA = new nano({tag: 'div'}).set(a[current]).find('tag', 'input');
						var checkboxB = new nano({tag: 'div'}).set(b[current]).find('tag', 'input');
						if (checkboxA.length > 0 && checkboxB.length > 0) {
							if (!checkboxA[0].node.checked && checkboxB[0].node.checked) return -1;
							if (checkboxA[0].node.checked && !checkboxB[0].node.checked) return 1;
						}
						return 0;
					}
					function compareSelect(a, b) {
						var selectA = new nano({tag: 'div'}).set(a[current]).find('tag', 'select');
						var selectB = new nano({tag: 'div'}).set(b[current]).find('tag', 'select');
						if (selectA.length > 0 && selectB.length > 0) {
							if (selectA[0].node.options[selectA[0].node.selectedIndex].text < selectB[0].node.options[selectB[0].node.selectedIndex].text) return -1;
							if (selectA[0].node.options[selectA[0].node.selectedIndex].text > selectB[0].node.options[selectB[0].node.selectedIndex].text) return 1;
						}
						return 0;
					}
					function compareInput(a, b) {
						var inputA = new nano({tag: 'div'}).set(a[current]).find('tag', 'input');
						var inputB = new nano({tag: 'div'}).set(b[current]).find('tag', 'input');
						if (inputA.length > 0 && inputB.length > 0) {
							if (inputA[0].get() < inputB[0].get()) return -1;
							if (inputA[0].get() > inputB[0].get()) return 1;
						}
						return 0;
					}
					function compareTextarea(a, b) {
						var textareaA = new nano({tag: 'div'}).set(a[current]).find('tag', 'textarea');
						var textareaB = new nano({tag: 'div'}).set(b[current]).find('tag', 'textarea');
						if (textareaA.length > 0 && textareaB.length > 0) {
							if (textareaA[0].get() < textareaB[0].get()) return -1;
							if (textareaA[0].get() > textareaB[0].get()) return 1;
						}
						return 0;
					}
					var array  = new Array(rows);
					for (var i = 0; i < rows.length; i++) {
						array[i] = new Array(cols);
						for (var j = 0; j < cols.length; j++) {
							array[i][j] = rows[i].cells[j].innerHTML;
						}
					}
					if (col == this.tables[id].sorted) {
						array.reverse();
					} else {
						switch (type) {
							case 'string':
								array.sort(compareString);
								break;
							case 'istring':
								array.sort(compareStringIgnore);
								break;
							case 'number':
								array.sort(compareNumber);
								break;
							case 'date':
								array.sort(compareDate);
								break;
							case 'checkbox':
								array.sort(compareCheckbox);
								break;
							case 'select':
								array.sort(compareSelect);
								break;
							case 'input':
								array.sort(compareInput);
								break;
							case 'textarea':
								array.sort(compareTextarea);
								break;
						}
					}
					var i, j;
					for (i = 0; i < rows.length; i++) {
						for (j = 0; j < cols.length; j++) {
							rows[i].cells[j].innerHTML = array[i][j];
						}
					}
					this.tables[id].sorted = col;
					return this.tables[id];
				}
				return false;
			}
		}
	});
}
