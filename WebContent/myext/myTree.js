/**
 * 树控件封装
 */

Ext.tree.ColumnTree = Ext.extend(Ext.tree.TreePanel, {
	lines : false,
	borderWidth : Ext.isBorderBox ? 0 : 2, // the combined left/right border
	cls : 'x-column-tree',
	scrollOffset : 18,// 修复固定表头问题
	onRender : function() {
		Ext.tree.ColumnTree.superclass.onRender.apply(this, arguments);
		// 修复固定表头的问题
		this.headers = this.body.createChild({
			cls : 'x-tree-headers '
		}, this.body.dom);

		var cols = this.columns, c;
		var totalWidth = 0;

		for (var i = 0, len = cols.length; i < len; i++) {
			c = cols[i];
			if (c.hidden) {
				// 隐藏
			} else {
				totalWidth += c.width;
				this.headers.createChild({
					cls : 'x-tree-hd ' + (c.cls ? c.cls + '-hd' : ''),
					cn : {
						cls : 'x-tree-hd-text',
						html : c.header
					},
					style : 'width:' + (c.width - this.borderWidth) + 'px;'
				});
			}
		}
		this.headers.createChild({
			cls : 'x-clear'
		});
		// prevent floats from wrapping when clipped
		this.headers.setWidth(totalWidth);
		this.innerCt.setWidth(totalWidth);
	}
});

Ext.tree.ColumnNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
	focus : Ext.emptyFn, // prevent odd scrolling behavior

	renderElements : function(n, a, targetNode, bulkRender) {
		this.indentMarkup = n.parentNode
				? n.parentNode.ui.getChildIndent()
				: '';

		var t = n.getOwnerTree();
		var cols = t.columns;
		var bw = t.borderWidth;
		var c = cols[0];

		var buf = [
				'<li class="x-tree-node"><div ext:tree-node-id="',
				n.id,
				'" class="x-tree-node-el x-tree-node-leaf ',
				a.cls,
				'">',
				'<div class="x-tree-col" style="width:',
				c.width - bw,
				'px;">',
				'<span class="x-tree-node-indent">',
				this.indentMarkup,
				"</span>",
				'<img src="',
				this.emptyIcon,
				'" class="x-tree-ec-icon x-tree-elbow">',
				'<img src="',
				a.icon || this.emptyIcon,
				'" class="x-tree-node-icon',
				(a.icon ? " x-tree-node-inline-icon" : ""),
				(a.iconCls ? " " + a.iconCls : ""),
				'" unselectable="on">',
				'<a hidefocus="on" class="x-tree-node-anchor" href="',
				a.href ? a.href : "#",
				'" tabIndex="1" ',
				a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "",
				'>',
				'<span unselectable="on">',
				n.text
						|| (c.renderer
								? c.renderer(a[c.name], n, a)
								: a[c.name]), "</span></a>", "</div>"];
		for (var i = 1, len = cols.length; i < len; i++) {
			c = cols[i];
			if (c.hidden) {
				// 隐藏
			} else {
				buf.push('<div class="x-tree-col ', (c.cls ? c.cls : ''),
						'" style="width:', c.width - bw, 'px;">',
						'<div class="x-tree-col-text">', (c.renderer ? c
								.renderer(a[c.name], n, a) : a[c.name]),
						"</div>", "</div>");
			}
		}
		buf.push('<div class="x-clear"></div></div>',
				'<ul class="x-tree-node-ct" style="display:none;"></ul>',
				"</li>");

		if (bulkRender !== true && n.nextSibling && n.nextSibling.ui.getEl()) {
			this.wrap = Ext.DomHelper.insertHtml("beforeBegin",
					n.nextSibling.ui.getEl(), buf.join(""));
		} else {
			this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf
					.join(""));
		}

		this.elNode = this.wrap.childNodes[0];
		this.ctNode = this.wrap.childNodes[1];
		var cs = this.elNode.firstChild.childNodes;
		this.indentNode = cs[0];
		this.ecNode = cs[1];
		this.iconNode = cs[2];
		this.anchor = cs[3];
		this.textNode = cs[3].firstChild;
	}
});

/** ***************表格树************************** */
TColumnTree = Ext.extend(Ext.tree.ColumnTree, {
	labelWidth : 80,
	root : new Ext.tree.AsyncTreeNode({
		text : 'Tasks'
	}),
	reload : function() {// 重新加载数据
		this.getLoader().load(this.root);
	},
	canUpdate : function(node) {// 指定节点是否可
		if (node != null && node.isLeaf()) {
			return true;
		} else {
			Ext.Msg.alert('错误！', '您选定的数据不允许被修改或删除，请选择其它数据！');
			return false;
		}
	},
	doDelete : function() {// 删除节点
		var _node = this.getSelectionModel().getSelectedNode();
		if (this.canUpdate(_node)) {// 只能删除叶子节点
			var _tree = this;
			Ext.MessageBox.confirm('确认删除', '你真的要删除所选数据吗?', function(btn) {
				if (btn == 'yes') {// 选中了是按钮
					Ext.TAppUtil.showMask('正在删除数据，请稍候...');
					Ext.Ajax.request({
						url : _tree.url,
						success : function() {
							Ext.TAppUtil.closeMask();
							_node.remove();
						},
						failure : {},
						params : {
							action : 'delete',
							id : _node.id
						}
					});
				}
			});
		}

	},
	createForm : function(_items, node) {// 创建表单
		var _tree = this
		var _form = new TFormPanel({
			items : _items,
			labelWidth : 80,
			buttons : [{
				text : '保存',
				handler : function() {
					_tree.doSubmitFrom(_form, node, _form.edit_sub);
					// alert('dd');
				}
			}, {
				text : '关闭',
				handler : function() {
					_form.window.hide();
					_form.window.destroy();
				}
			}]
		});
		return _form;
	},

	doSubmitFrom : function(_form, node, sub) {
		if (_form.form.isValid()) {
			// 判断node是否为空 是：新增 否：修改
			var _action = (node && !sub) ? 'edit' : 'new';
			var _tree = this;
			var _id = (node && !sub) ? node.id : '';
			var _pid = (node && sub) ? node.id : '';
			_form.form.submit({
				waitTitle : "请稍候",
				waitMsg : "正在提交表单数据，请稍候。。。。。。",
				url : _tree.url,
				params : {
					action : _action,
					name : _tree.tablename,
					id : _id,
					pid : _pid
				},
				success : function(form, action) {
					_tree.reload();
					if (_action == 'edit') {// 编辑状态自动关闭
						_form.window.close(); // 关闭窗口
						_id = action.result.id;
						Ext.apply(_tree, {
							selId : _id
						});
					} else {// 新增状态
						_form.form.reset();
					}
				},
				failure : function() {
				}
			});
		}
	},

	doEdit : function(node, sub) {
		// if (node == null || sub || this.canUpdate(node)) {
		if (sub && node == null) {
			Ext.Msg.alert('错误！', '请先选择上级分类！');
			return;
		}
		var oField = Ext.TAppUtil.createFormItems('', this.columns,
				this.labelWidth, node, this);
		var editForm = this.createForm(oField, node);
		var win = new Ext.Window({
			title : '参数维护',
			labelWidth : 100,
			frame : true,
			autoHeight : true,
			height : this.win_height,
			width : this.win_width,
			items : editForm
		})
		Ext.apply(editForm, {
			window : win,
			edit_sub : sub
		});
		win.show();

		var _add = false;

		// 从服务器初始化表单数据
		if (node != null && node != '' && !sub) {
			_add = false;
			win.setTitle(win.title + '<编辑>')
		} else {
			_add = true;
			win.setTitle(win.title + '<新增>');
		}
		var _tree = this;
		var _id = (node && !sub) ? node.id : '';
		var _pid = (node && sub) ? node.id : '';
		if (!_add) {
			Ext.TAppUtil.showMask('正在数据加载,请稍后......', '请稍后');
			editForm.form.load({
				url : _tree.url,
				params : {
					action : 'load',
					name : _tree.tablename,
					id : _id,
					pid : _pid
				},
				method : 'post',
				success : function(action, form) {
					Ext.TAppUtil.closeMask();
					// 给combobox赋值
				},
				failure : function() {
					Ext.TAppUtil.closeMask();
					Ext.Msg.alert('错误！', '加载数据时出现了错误！');
				}
			});
			// }
		}
	},
	selId : '',
	btn_add_title : '新增分类',
	btn_add_sub_title : '新增子分类',
	btn_edit_title : '编辑',
	btn_delete_title : '删除',
	btn_reload_title : '刷新',
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		var _tree = this;
		TColumnTree.superclass.constructor.call(this, {
			rootVisible : false,
			autoScroll : true,
			listeners : {
				'dblclick' : function(_n, _e) {
					this.doEdit(this.getSelectionModel().getSelectedNode());
				},
				'expandnode' : function(_n) {
					if (_tree.selId != '') {
						var _node = _tree.getNodeById(_tree.selId);
						if (_node != null) {
							_tree.getSelectionModel().select(_node);
						}
						Ext.apply(_tree, {
							selId : ''
						});
					}
				}
			},
			loader : new Ext.tree.TreeLoader({
				dataUrl : this.url,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				},
				baseParams : {
					action : 'show',
					name : ''
				},
				listeners : {
					'load' : function() {
						if (_tree.selId != '') {
							_tree.expandAll();
							/*
							 * var _node = _tree.getNodeById(_tree.selId); if
							 * (_node != null) {
							 * _tree.getSelectionModel().select(_node); }
							 */
						}
					}
				}
			}),
			tbar : new Ext.Toolbar({
				items : [{
					text : _tree.btn_add_title,
					iconCls : 'table_add',
					minWidth : 65,
					handler : function() {
						_tree.doEdit();
					}
				}, {
					text : _tree.btn_add_sub_title,
					iconCls : 'table_add_sub',
					minWidth : 65,
					handler : function() {
						_tree.doEdit(_tree.getSelectionModel()
								.getSelectedNode(), true);
					}
				}, {
					iconCls : 'table_edit',
					minWidth : 65,
					text : _tree.btn_edit_title,
					handler : function() {
						_tree.doEdit(_tree.getSelectionModel()
								.getSelectedNode());
					}
				}, {
					iconCls : 'table_delete',
					text : _tree.btn_delete_title,
					minWidth : 65,
					handler : function() {
						_tree.doDelete();
					}
				}, {
					iconCls : 'table_reload',// 'x-btn-text x-tbar-loading',
					text : _tree.btn_reload_title,
					minWidth : 65,
					handler : function() {
						_tree.reload();
					},
					scope : this
				}]
			})
		});
	},
	/** 初始化combo控件数据 */
	initCombo : function(o, boxid, record) {
		var url = this.url;
		var fields = o.value + ',' + o.text;
		var ds = null;

		if (o.fobj == 'json') {
			var reader = new Ext.data.JsonReader({
				totalProperty : 'Count',
				root : 'list'
			}, [{
				name : o.value
			}, {
				name : o.text
			}]);

			ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : url
				}),
				reader : reader
			});

			ds.on('beforeload', function() {
				var para = {
					action : 'show',
					pagesize : '999',
					name : o.fobj,
					fieldName : o.name, // 字段名
					fields : fields
				};
				Ext.apply(ds.baseParams, para);
			});
			ds.on('load', function() {// 设置combobox初始值
						if (record != null) {
							if ((typeof record.name) == 'string') {
								Ext.getCmp(boxid).setValue(record.name);
							} else {
								Ext.getCmp(boxid)
										.setValue(parseInt(record.name));
							}
						} else {
							Ext.getCmp(boxid).setValue('');
						}

					});
		} else {
			ds = new Ext.data.Store({
				proxy : new Ext.data.MemoryProxy(o.fobj),
				reader : new Ext.data.ArrayReader({}, [{
					name : 'value'
				}, {
					name : 'text'
				}]),
				autoLoad : true
			});
		}

		ds.load({
			params : {
				start : 0,
				limit : 10
			}
		});

		return ds;

	}

});

/** ****************CheckTreePanel************************* */

Ext.override(Ext.tree.TreeNode, {
	bubbleExpand : function() {
		var root = this.getOwnerTree().root;
		var branch = [];
		var p = this;
		while (p !== root) {
			p = p.parentNode;
			branch.push(p);
		}
		branch.reverse();
		Ext.each(branch, function(n) {
			n.expand(false, false);
		});
	}
});

Ext.tree.TCheckTreePanel = Ext.extend(Ext.tree.TreePanel, {
	bubbleCheck : 'checked',
	cascadeCheck : 'unchecked',
	deepestOnly : false,
	expandOnCheck : true,
	filter : true,
	separator : ',',
	cls : 'ux-checktree',
	baseAttrs : {},
	initComponent : function() {
		Ext.tree.TCheckTreePanel.superclass.initComponent
				.apply(this, arguments);

		// pass this.baseAttrs and uiProvider down the line
		var baseAttrs = Ext.apply({
			uiProvider : Ext.tree.CheckTreeNodeUI
		}, this.baseAttrs);
		Ext.applyIf(this.loader, {
			baseAttrs : baseAttrs,
			preloadChildren : true
		});

		// make sure that nodes are deeply preloaded
		if (true === this.loader.preloadChildren) {
			this.loader.on('load', function(loader, node) {
				node.cascade(function(n) {
					loader.doPreload(n);
					n.loaded = true;
				});
			});
		}

		// use our event model
		this.eventModel = new Ext.tree.CheckTreeEventModel(this);

		// create tree filter
		if (true === this.filter) {
			var Filter = Ext.tree.TreeFilterX
					? Ext.tree.TreeFilterX
					: Ext.tree.TreeFilter;
			this.filter = new Filter(this, {
				autoClear : true
			});
		}

	},
	getValue : function() {// 取已选值
		var a = [];
		this.root.cascade(function(n) {
			if (true === n.attributes.checked) {
				if (false === this.deepestOnly || !this.isChildChecked(n)) {
					a.push(n.id);
				}
			}
		}, this);
		return a;
	},
	isChildChecked : function(node) {
		var checked = false;
		Ext.each(node.childNodes, function(child) {
			if (child.attributes.checked) {
				checked = true;
			}
		});
		return checked;
	},
	clearValue : function() {
		this.root.cascade(function(n) {
			var ui = n.getUI();
			if (ui && ui.setChecked) {
				ui.setChecked(false);
			}
		});
		this.value = [];
		return this;
	},
	convertValue : function(val) {
		// init return array
		var a = [];

		// calls itself recursively if necessary
		if (1 < arguments.length) {
			for (var i = 0; i < arguments.length; i++) {
				a.push(this.convertValue(arguments[i]));
			}
		}

		// nothing to do for arrays
		else if (Ext.isArray(val)) {
			a = val;
		}

		// just push numbers
		else if ('number' === typeof val) {
			a.push(val);
		}

		// split strings
		else if ('string' === typeof val) {
			a = val.split(this.separator);
		}

		return a;
	},
	setValue : function(val) {

		// uncheck all first
		this.clearValue();

		// process arguments
		this.value = this.convertValue.apply(this, arguments);

		// check nodes
		Ext.each(this.value, function(id) {
			var n = this.getNodeById(id);
			if (n) {
				var ui = n.getUI();
				if (ui && ui.setChecked) {
					ui.setChecked(true);

					// expand checked nodes
					if (true === this.expandOnCheck) {
						n.bubbleExpand();
					}
				}
			}
		}, this);

		return this.value;
	},
	serialize : function(attr) {
		attr = attr || 'text';
		var a = [];
		this.root.cascade(function(n) {
			if (true === n.attributes.checked) {
				a.push(n[attr]);
			}
		});
		return a.join(this.separator + ' ');
	},
	getText : function(attr) {
		return this.serialize(attr);
	}
})

Ext.reg('checktreepanel', Ext.tree.TCheckTreePanel);

Ext.tree.CheckTreeNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
	renderElements : function(n, a, targetNode, bulkRender) {

		this.indentMarkup = n.parentNode
				? n.parentNode.ui.getChildIndent()
				: '';
		var checked = n.attributes.checked;
		var href = a.href ? a.href : Ext.isGecko ? "" : "#";
		var buf = [
				'<li class="x-tree-node"><div ext:tree-node-id="',
				n.id,
				'" class="x-tree-node-el x-tree-node-leaf x-unselectable ',
				a.cls,
				'" unselectable="on">',
				'<span class="x-tree-node-indent">',
				this.indentMarkup,
				"</span>",
				'<img src="',
				this.emptyIcon,
				'" class="x-tree-ec-icon x-tree-elbow" />',
				'<img src="',
				a.icon || this.emptyIcon,
				'" class="x-tree-node-icon',
				(a.icon ? " x-tree-node-inline-icon" : ""),
				(a.iconCls ? " " + a.iconCls : ""),
				'" unselectable="on" />',
				'<img src="' + this.emptyIcon + '" class="x-tree-checkbox'
						+ (true === checked ? ' x-tree-node-checked' : '')
						+ '" />',
				'<a hidefocus="on" class="x-tree-node-anchor" href="', href,
				'" tabIndex="1" ',
				a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "",
				'><span unselectable="on">', n.text, "</span></a></div>",
				'<ul class="x-tree-node-ct" style="display:none;"></ul>',
				"</li>"].join('');
		var nel;
		if (bulkRender !== true && n.nextSibling
				&& (nel = n.nextSibling.ui.getEl())) {
			this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel, buf);
		} else {
			this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf);
		}
		this.elNode = this.wrap.childNodes[0];
		this.ctNode = this.wrap.childNodes[1];
		var cs = this.elNode.childNodes;
		this.indentNode = cs[0];
		this.ecNode = cs[1];
		this.iconNode = cs[2];
		this.checkbox = cs[3];
		this.cbEl = Ext.get(this.checkbox);
		this.anchor = cs[4];
		this.textNode = cs[4].firstChild;
	},
	setIconCls : function(iconCls) {
		Ext.fly(this.iconNode).set({
			cls : 'x-tree-node-icon ' + iconCls
		});
	},
	isChecked : function() {
		return this.node.attributes.checked === true;
	},
	onCheckChange : function() {
		var checked = this.isChecked();
		var tree = this.node.getOwnerTree();
		var bubble = tree.bubbleCheck;
		var cascade = tree.cascadeCheck;

		if ('all' === bubble || (checked && 'checked' === bubble)
				|| (!checked && 'unchecked' === bubble)) {
			this.updateParent(checked);
		}
		if ('all' === cascade || (checked && 'checked' === cascade)
				|| (!checked && 'unchecked' === cascade)) {
			this.updateChildren(checked);
		}

		this.fireEvent('checkchange', this.node, checked);
	},
	setChecked : function(checked) {
		checked = true === checked ? checked : false;
		var cb = this.cbEl || false;
		if (cb) {
			true === checked ? cb.addClass('x-tree-node-checked') : cb
					.removeClass('x-tree-node-checked');
		}
		this.node.attributes.checked = checked;
		this.onCheckChange();
		return checked;
	},
	toggleCheck : function() {
		var checked = !this.isChecked();
		this.setChecked(checked);
		return checked;
	},
	updateParent : function(checked) {
		var p = this.node.parentNode;
		var ui = p ? p.getUI() : false;

		if (ui && ui.setChecked) {
			ui.setChecked(checked);
		}
	},
	updateChildren : function(checked) {
		this.node.eachChild(function(n) {
			var ui = n.getUI();
			if (ui && ui.setChecked) {
				ui.setChecked(checked);
			}
		});
	},
	onCheckboxClick : function() {
		if (!this.disabled) {
			this.toggleCheck();
		}
	},
	onCheckboxOver : function() {
		this.addClass('x-tree-checkbox-over');
	},
	onCheckboxOut : function() {
		this.removeClass('x-tree-checkbox-over');
	},
	onCheckboxDown : function() {
		this.addClass('x-tree-checkbox-down');
	},
	onCheckboxUp : function() {
		this.removeClass('x-tree-checkbox-down');
	}
});

Ext.tree.CheckTreeEventModel = Ext.extend(Ext.tree.TreeEventModel, {
	initEvents : function() {
		var el = this.tree.getTreeEl();
		el.on('click', this.delegateClick, this);
		if (this.tree.trackMouseOver !== false) {
			el.on('mouseover', this.delegateOver, this);
			el.on('mouseout', this.delegateOut, this);
		}
		el.on('mousedown', this.delegateDown, this);
		el.on('mouseup', this.delegateUp, this);
		el.on('dblclick', this.delegateDblClick, this);
		el.on('contextmenu', this.delegateContextMenu, this);
	},
	delegateOver : function(e, t) {
		if (!this.beforeEvent(e)) {
			return;
		}
		if (this.lastEcOver) {
			this.onIconOut(e, this.lastEcOver);
			delete this.lastEcOver;
		}
		if (this.lastCbOver) {
			this.onCheckboxOut(e, this.lastCbOver);
			delete this.lastCbOver;
		}
		if (e.getTarget('.x-tree-ec-icon', 1)) {
			this.lastEcOver = this.getNode(e);
			this.onIconOver(e, this.lastEcOver);
		} else if (e.getTarget('.x-tree-checkbox', 1)) {
			this.lastCbOver = this.getNode(e);
			this.onCheckboxOver(e, this.lastCbOver);
		}
		if (t = this.getNodeTarget(e)) {
			this.onNodeOver(e, this.getNode(e));
		}
	},
	delegateOut : function(e, t) {
		if (!this.beforeEvent(e)) {
			return;
		}
		if (e.getTarget('.x-tree-ec-icon', 1)) {
			var n = this.getNode(e);
			this.onIconOut(e, n);
			if (n == this.lastEcOver) {
				delete this.lastEcOver;
			}
		} else if (e.getTarget('.x-tree-checkbox', 1)) {
			var n = this.getNode(e);
			this.onCheckboxOut(e, n);
			if (n == this.lastCbOver) {
				delete this.lastCbOver;
			}
		}
		if ((t = this.getNodeTarget(e)) && !e.within(t, true)) {
			this.onNodeOut(e, this.getNode(e));
		}
	},
	delegateDown : function(e, t) {
		if (!this.beforeEvent(e)) {
			return;
		}
		if (e.getTarget('.x-tree-checkbox', 1)) {
			this.onCheckboxDown(e, this.getNode(e));
		}
	},
	delegateUp : function(e, t) {
		if (!this.beforeEvent(e)) {
			return;
		}
		if (e.getTarget('.x-tree-checkbox', 1)) {
			this.onCheckboxUp(e, this.getNode(e));
		}
	},
	delegateOut : function(e, t) {
		if (!this.beforeEvent(e)) {
			return;
		}
		if (e.getTarget('.x-tree-ec-icon', 1)) {
			var n = this.getNode(e);
			this.onIconOut(e, n);
			if (n == this.lastEcOver) {
				delete this.lastEcOver;
			}
		} else if (e.getTarget('.x-tree-checkbox', 1)) {
			var n = this.getNode(e);
			this.onCheckboxOut(e, n);
			if (n == this.lastCbOver) {
				delete this.lastCbOver;
			}
		}
		if ((t = this.getNodeTarget(e)) && !e.within(t, true)) {
			this.onNodeOut(e, this.getNode(e));
		}
	},
	delegateClick : function(e, t) {
		if (!this.beforeEvent(e)) {
			return;
		}
		if (e.getTarget('.x-tree-checkbox', 1)) {
			this.onCheckboxClick(e, this.getNode(e));
		} else if (e.getTarget('.x-tree-ec-icon', 1)) {
			this.onIconClick(e, this.getNode(e));
		} else if (this.getNodeTarget(e)) {
			this.onNodeClick(e, this.getNode(e));
		}
	},
	onCheckboxClick : function(e, node) {
		node.ui.onCheckboxClick();
	},
	onCheckboxOver : function(e, node) {
		node.ui.onCheckboxOver();
	},
	onCheckboxOut : function(e, node) {
		node.ui.onCheckboxOut();
	},
	onCheckboxDown : function(e, node) {
		node.ui.onCheckboxDown();
	},
	onCheckboxUp : function(e, node) {
		node.ui.onCheckboxUp();
	}
});
