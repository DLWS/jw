/*******************************************************************************
 * 通过表格控件，支持crud操作，支持表格自动分组
 */

XPageSizePlugin = function() {
	XPageSizePlugin.superclass.constructor.call(this, {
		store : new Ext.data.SimpleStore({
			fields : [ 'text', 'value' ],
			data : [ [ '10', 10 ], [ '20', 20 ], [ '25', 25 ], [ '40', 40 ],
					[ '50', 50 ], [ '100', 100 ] ]
		}),
		mode : 'local',
		displayField : 'text',
		valueField : 'value',
		editable : false,
		allowBlank : false,
		triggerAction : 'all',
		width : 50,
		listWidth : 50
	});
};

Ext.extend(XPageSizePlugin, Ext.form.ComboBox, {
	init : function(paging) {
		paging.on('render', this.onInitView, this);
	},

	onInitView : function(paging) {
		// paging.add('-', '每页显示', ' ', ' ', ' ', this);
		var inputIndex = 10;

		paging.insert(++inputIndex, '-');
		paging.insert(++inputIndex, '每页显示');
		paging.insert(++inputIndex, this);
		paging.insert(++inputIndex, '条');

		this.setValue(paging.pageSize);
		this.on('select', this.onPageSizeChanged, paging);
	},

	onPageSizeChanged : function(combo) {
		this.pageSize = parseInt(combo.getValue());
		this.doLoad(0);
	}
});

XGrid = Ext.extend(Ext.grid.GridPanel, {
	// 储存表格结构
	structure : '',
	// 等待地址
	waitUrl : '',
	// 每页显示条数
	pageSize : 20,
	// 表单里控件的默认宽
	fieldwidth : 200,
	// reader类型如果当为json的时候那么url不能空
	readType : 'json',
	// 获取数据的URL
	url : '',
	user_id : 'user_id',
	// 数据对象
	labelWidth : 80,
	// 是否显示工具条
	tbar_visible : true,
	// 表格主键
	keyField : '',
	// 是否自动填充
	autoFit : true,
	// 是否自动加载数据
	autoLoadData : true,
	// 列模式的选择模式,默认为rowselectModel，如果相设置成check模式，就设置为check
	selectType : '',
	// 是否需要分页工具栏，默认为true
	needPage : true,
	totalPropertyName : 'totalProperty',
	rootName : 'list',
	// window中禁用周围
	frame : false,
	loadMask : true,
	// 存储表头信息
	col : null,
	// 右键
	rightMenu : null,
	// 是否显示行号
	rowNumber : true,
	// 初始化组件
	initComponent : function() {
		if (this.structure != '') {
			this.initStructure();
		}
		XGrid.superclass.initComponent.call(this);
		// 是否自动填充表格宽度
		Ext.apply(this, {
			viewConfig : {
				forceFit : this.autoFit
			}
		});
	},
	// 初始化事件
	initEvents : function() {
		XGrid.superclass.initEvents.call(this);
		if (this.loadMask) {
			this.loadMask = new Ext.LoadMask(this.bwrap, Ext.apply({
				store : this.store
			}, this.loadMask));
		}
	},
	// 初始化grid结构
	initStructure : function() {
		var _grid = this;
		// 列模式数组
		var oCM = new Array();
		// 容器对数组
		var oRecord = new Array();

		var rowNum = new Ext.grid.RowNumberer({
			header : '序号',
			width : 35,
			align : 'left'
		});
		if (_grid.rowNumber) {
			oCM[oCM.length] = rowNum;
		}
		// 构成grid的两个必须组件: column和record，根据structure将这两个组件创建出来
		// 判断表格的选择模式
		if (this.selectType == 'check') {
			var sm = new Ext.grid.CheckboxSelectionModel();
			oCM[oCM.length] = sm;// 在列模式数组中添加checkbox模式按钮
			this.selModel = sm;// 并将selModel设置为check模式
		}

		var len = this.structure.length;// 得到结构的长度
		for ( var i = 0; i < len; i++) {
			var c = this.structure[i];

			oCM[oCM.length] = {
				header : c.header,
				dataIndex : c.name,
				hidden : c.hidden || false,
				width : !c.hidden ? c.width : this.fieldwidth,
				// 类型为数字则右对齐
				align : c.type == 'numeric' ? 'right' : 'left',
				// 排序
				sortable : (c.sortable != null) ? c.sortable : true,
				// 结构的渲染函数
				renderer : c.renderer
			};
			oRecord[oRecord.length] = {
				name : c.name,
				// 如果类型不是date型则全部为string型
				type : c.type == 'date' ? 'date' : 'string',
				dateFormat : 'Y-m-d'
			};
		}

		this.col = oCM;
		// 生成columnModel
		this.cm = new Ext.grid.ColumnModel(oCM);
		// this.colModel = this.cm;
		// 默认可排序
		this.cm.defaultSortable = true;
		// 生成表格数据容器
		var record = Ext.data.Record.create(oRecord);
		// 判断读取类别，目前只实现了，jsonreader和arrayReader
		var reader;
		var pageSize = this.pageSize;

		switch (this.readType) {
		case 'json':
			reader = new Ext.data.JsonReader({
				// totalProperty : "totalProperty",
				totalProperty : this.totalPropertyName,
				// root : "list",
				root : this.rootName,
				id : this.keyField
			// 关键字段
			}, record);

			this.ds = new Ext.data.GroupingStore({
				proxy : new Ext.data.HttpProxy({
					url : this.url
				}),
				reader : reader,
				groupField : this.myGroupField,
				listeners : {
					'reload' : function() {
						alert('reload')
					}
				}
			});
			break;
		default:
			break;

		}

		this.store = this.ds;
		// 生成分页工具栏
		if (this.needPage) {
			var pagingToolbar = new Ext.PagingToolbar({
				plugins : [ new XPageSizePlugin() ],
				pageSize : this.pageSize,
				emptyMsg : '没有符合条件的记录',
				displayInfo : true,
				displayMsg : '第{0}-{1}条,共{2}条',
				store : this.store
			});
			this.bbar = pagingToolbar;
			this.bottomToolbar = this.bbar;

			// var pagingToolbar = new Ext.PagingToolbar({
			// plugins : new Ext.ui.plugins.ComboPageSize(),
			// pageSize : 20,
			// emptyMsg : '没有数据',
			// displayInfo : true,
			// displayMsg : '第{0}-{1}条,共{2}条',
			// store : this.store
			// });
			// this.bbar = pagingToolbar;
			// this.bottomToolbar = this.bbar;
		}

		var _grid = this;

		var keyField = this.keyField;

		if (this.tbar_visible) {
			// 生成顶部工具条
			this.tbar = this.createTopBar(_grid);
			this.topToolbar = this.tbar;
		}

		this.store.on('beforeload', function() {

			var obj = _grid.getStore().lastOptions.params;

			for ( var k in obj) {
				// alert(k + "=" + obj[k]);
				_grid.getStore().setBaseParam(k, obj[k]);
			}

			Ext.apply(this.baseParams, {
				limit : pageSize
			});

		});

		this.store.on('load', function(_res) {
			_grid.loadDone(_grid, _res);
		});

		if (this.autoLoadData) {
			this.loadData();
		}
	},
	loadDone : function(_grid, _recs) {// 加载完毕
		var _row = 0;
		_recs.each(function(_r) {
			_grid.changeCell(_grid, _row, _r);
			_row++;
		});
	},
	changeCell : function(_grid, _row, _r) {// 改变背景等
	},
	loadData : function() {// 第一次回调用
		var _grid = this;

		this.store.load({
			params : {
				start : 0,
				limit : _grid.pageSize
			}
		});
	},
	reload : function() {// 重新加载数据
		this.getStore().reload();
	},
	createRadioItem : function(_ds, _name) {// 创建单选
		var _items = new Array();
		if (_ds.getCount() > 0) {
			for ( var i = 0; i < _ds.getCount(); i++) {
				var _rec = _ds.getAt(i);
				var _r = new Ext.form.Radio({
					boxLabel : _rec.get('text'),
					name : _name,
					inputValue : _rec.get('value'),
					checked : true
				});
				_items.push(_r);
			}
		}
		return _items;
	},
	createCheckboxItem : function(_ds, _name) {// 创建复选 com
		var _items = new Array();
		if (_ds.getCount() > 0) {
			for ( var i = 0; i < _ds.getCount(); i++) {
				var _rec = _ds.getAt(i);
				var _r = new Ext.form.Checkbox({
					boxLabel : _rec.get('text'),
					name : _name,
					inputValue : _rec.get('value')
				});
				_items.push(_r);
			}
		}
		return _items;
	},
	createBtn : function(_grid, _text, _icon, _fun) {// 创建按钮
		var _btn = {
			text : _text,
			// xtype : 'splitbutton',
			xtype : 'button',
			iconCls : _icon,
			minWidth : 65,
			handler : function() {
				_fun(_grid);
			}
		};
		return _btn;
	},
	createRefreshBtn : function(_grid) {// 刷新按钮
		return new Ext.Button({
			iconCls : 'table_reload',
			text : "刷新",
			minWidth : 65,
			handler : function() {
				_grid.reload();
			},
			scope : _grid
		});
	},
	createRightMenu : function(_g, _r, _e) {
		_e.preventDefault();
		var rightMenu = _g.rightMenu;
		if (null != rightMenu) {

			var rightMenu_Y = new Ext.menu.Menu({
				items : [ rightMenu ]
			});
			rightMenu_Y.showAt(_e.getXY());

		}
	},
	controlRightHandler : function(munu, _g, _r, _e) {

	},
	doDelete : function(_grid, Msg, url) {
		var sSelId = "";
		var tablename = _grid.tablename;
		var keyField = _grid.keyField;
		// var url = _grid.url;
		var aId = new Array();
		// 从GRID对象中获得Value
		var record = _grid.getSelectionModel().getSelected();
		if (!record) {
			Ext.Msg.alert("提示", "请先选择要删除的数据!");
			return;
		} else {

			for ( var i = 0, j = _grid.store.getCount(); i < j; i++) {
				if (_grid.getSelectionModel().isSelected(i)) {
					sSelId += _grid.store.getAt(i).get(keyField) + ",";
					aId[aId.length] = _grid.store.getAt(i);
				}
			}
			if (sSelId.length > 0) {
				sSelId = sSelId.substr(0, sSelId.length - 1);
			}
		}

		Ext.MessageBox.confirm('确认删除', Msg, function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url : url,
					success : function() {
						for ( var i = 0; i < aId.length; i++) {
							_grid.store.remove(aId[i]);
						}
					},
					failure : function() {
						alert("失败");
					},
					params : {
						action : 'delete',
						id : sSelId
					}
				});
			}
		});
	},

	query : function(_grid) {
		_grid.loadData();
	},

	createExtBtn : function(_tbar, _grid) {// 扩展按键
	},

	createTopBar : function(_grid) {// 工具栏tool
		var bar = new Ext.Toolbar();
		_grid.createExtBtn(bar, _grid);
		return bar;
	},
	doClick : function(_g, _r, _e) {

	},
	doClick2 : function(_g, _r, _e) {
		this.editItem(_g);
	},
	listeners : {
		'rowdblclick' : function(_g, _r, _e) {// 双击
			this.doClick2(_g, _r, _e);
		},
		'rowclick' : function(_g, _r, _e) {// 单击
			this.doClick(_g, _r, _e);
		},
		'rowcontextmenu' : function(_g, _r, _e) {
			this.createRightMenu(_g, _r, _e);
		}
	}

});

/** ******************************************************* */
XForm = Ext.extend(Ext.form.FormPanel, {
	window : null,
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		XForm.superclass.constructor.call(this, {
			frame : true
		// buttons : [ {
		// text : _form.btnOk,
		// iconCls : 'btn_ok',
		// handler : function() {
		// alert("come");
		// _form.doSave();
		// }
		// }, {
		// text : _form.btnClose,
		// iconCls : 'btn_cancel',
		// handler : function() {
		// _form.window.close();
		// }
		// } ]
		});
	}

});

XWindow = Ext.extend(Ext.Window, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		_window = this;
		XWindow.superclass.constructor.call(this, {
			plain : true,
			border : false,
			modal : true
		});

	}
});
