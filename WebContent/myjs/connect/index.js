/**
 * 连接管理
 */
Ext.namespace('com.integration.connect');

com.integration.connect.getConnectGrid = function() {

	var isView = true;

	var x_grid_st = [ {
		name : 'id',
		header : 'id',
		hidden : isView
	}, {
		name : 'connectName',
		header : '连接名称'
	}, {
		name : 'driverID',
		header : '驱动ID'
	}, {
		name : 'username',
		header : '用户名'
	}, {
		name : 'password',
		header : '密码'
	}, {
		name : 'connectConfig',
		header : '连接配置'
	}, {
		name : 'connectDesc',
		header : '连接描述'
	} ];

	var _grid = Ext.getCmp('getConnectGrid');
	if (_grid == null) {
		_grid = new XGrid({
			id : 'getConnectGrid',
			title : '连接管理',
			region : 'center',
			keyField : 'id',
			structure : x_grid_st,
			closable : true,
			selectType : 'check',
			url : project_path + '/connect/list.ctl',
			createExtBtn : function(_tbar, _grid) {
				var _btn_add = this.createBtn(this, '添加', 'table_add',
						this.addItem);
				var _btn_edit = this.createBtn(this, '修改', 'table_edit',
						this.editItem);
				var _btn_del = this.createBtn(this, '删除', 'table_delete',
						this.myDelete);

				_tbar.add(_btn_add);
				_tbar.add(_btn_edit);
				_tbar.add(_btn_del);

			},
			addItem : function() {
				com.integration.connect.addUI(_grid, "add");
			},
			editItem : function() {
				com.integration.connect.addUI(_grid, "edit");
			},
			doClick2 : function(_g, _r, _e) {
			},
			myDelete : function(_grid) {
				var url = project_path + '/connect/delete.ctl';
				_grid.doDelete(_grid, "删除吗", url);
			}
		});
	}
	return _grid;
};

com.integration.connect.addUI = function(_grid, action) {

	var my_width = 120;
	var my_height = 50;
	var my_out_width = 320;
	var my_out_hiegth = 240;

	var url = project_path + '/connect/add.ctl';
	var record = _grid.getSelectionModel().getSelected();

	if (action == "edit") {
		if (record == null || '' == record) {
			Ext.Msg.alert('提示', '请先选择你要修改的数据');
			return;
		}

		url = project_path + '/connect/update.ctl';
	}

	var _form = new XForm({
		region : 'center',
		layout : "form",
		labelAlign : "right",
		autoScroll : true,
		items : [ {
			name : 'id',
			fieldLabel : "id",
			xtype : "hidden",
			width : my_width
		}, {
			name : 'connectName',
			fieldLabel : "connectName",
			xtype : "textfield",
			width : my_width
		}, {
			xtype : "combo",
			name : 'driverID',
			hiddenName : 'driverID',
			// hiddenValue : 1,
			fieldLabel : "driverID",
			store : new Ext.data.JsonStore({
				autoLoad : true,
				root : 'list',
				url : project_path + '/driver/listAll.ctl',
				fields : [ '0', '1' ]
			}),
			valueField : '0',
			displayField : '1',
			mode : 'remote',
			triggerAction : 'all',
			editable : false,
			allowBlank : false,
			typeAhead : true,
			selectOnFocus : true,
			forceSelection : true,
			width : my_width
		}, {
			name : 'username',
			fieldLabel : "username",
			xtype : "textfield",
			width : my_width
		}, {
			name : 'password',
			fieldLabel : "password",
			xtype : "textfield",
			width : my_width
		}, {
			name : 'connectConfig',
			fieldLabel : "connectConfig",
			xtype : "textfield",
			width : my_width
		}, {
			name : 'connectDesc',
			fieldLabel : "connectDesc",
			xtype : "textfield",
			width : my_width
		} ],
		buttons : [ {
			text : "ok",
			handler : function() {
				_form.doSave();
			}
		}, {
			text : "close",
			handler : function() {
				_form.window.close();
			}
		} ],
		doSave : function() {
			_form.getForm().submit({
				url : url,
				method : 'POST',
				clientValidation : true,
				success : function(form, action) {
					_form.window.close();
					_grid.getStore().reload();
				},
				failure : function(form, action) {
					alert("faile");
				}

			});

		}
	});

	if ("edit" == action) {
		// _form.getForm().loadRecord(record);
		_form.getForm().load({
			waitMsg : '正在加载数据，请稍后...',
			waitTitle : '提示',
			url : project_path + '/connect/get.ctl',
			params : {
				id : record.get("id")
			},
			method : 'POST',
			failure : function(form, action) {
				Ext.Msg.alert('提示', '加载数据失败');
			}
		});

	}

	var win = new XWindow({
		height : my_out_hiegth,
		width : my_out_width,
		resizable : true,
		layout : 'border',
		items : _form
	});

	Ext.apply(_form, {
		window : win
	});

	if (action == 'edit') {
		win.setTitle("修改");
	} else if (action == 'add') {
		win.setTitle("添加");
	}

	win.show();
};
