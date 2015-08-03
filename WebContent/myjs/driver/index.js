/**
 * 驱动管理
 */
Ext.namespace('com.integration.driver');

com.integration.driver.getDriverGrid = function() {

	var isView = true;

	var x_grid_st = [ {
		name : 'id',
		header : 'id',
		hidden : isView
	}, {
		name : 'driverName',
		header : '驱动名称'
	}, {
		name : 'driverClass',
		header : '驱动Class'
	}, {
		name : 'driverType',
		header : '驱动类型'
	}, {
		name : 'driverSupportClass',
		header : '驱动支持Class'
	}, {
		name : 'driverDesc',
		header : '驱动描述'
	} ];

	var _grid = Ext.getCmp('getDriverGrid');
	if (_grid == null) {
		_grid = new XGrid({
			id : 'getDriverGrid',
			title : '驱动管理',
			region : 'center',
			keyField : 'id',
			structure : x_grid_st,
			closable : true,
			selectType : 'check',
			url : project_path + '/driver/list.ctl',
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
				com.integration.driver.addUI(_grid, "add");
			},
			editItem : function() {
				com.integration.driver.addUI(_grid, "edit");
			},
			doClick2 : function(_g, _r, _e) {
			},
			myDelete : function(_grid) {
				var url = project_path + '/driver/delete.ctl';
				_grid.doDelete(_grid, "删除吗", url);
			}
		});
	}
	return _grid;
};

com.integration.driver.addUI = function(_grid, action) {

	var my_width = 120;
	var my_height = 50;
	var my_out_width = 320;
	var my_out_hiegth = 240;

	var url = project_path + '/driver/add.ctl';
	var record = _grid.getSelectionModel().getSelected();

	if (action == "edit") {
		if (record == null || '' == record) {
			Ext.Msg.alert('提示', '请先选择你要修改的数据');
			return;
		}

		url = project_path + '/driver/update.ctl';
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
			name : 'driverName',
			fieldLabel : "driverName",
			xtype : "textfield",
			width : my_width
		}, {
			name : 'driverClass',
			fieldLabel : "driverClass",
			xtype : "textfield",
			width : my_width
		}, {
			name : 'driverType',
			fieldLabel : "driverType",
			xtype : "textfield",
			width : my_width
		}, {
			name : 'driverSupportClass',
			fieldLabel : "driverSupportClass",
			xtype : "textfield",
			width : my_width
		}, {
			name : 'driverDesc',
			fieldLabel : "driverDesc",
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
		_form.getForm().loadRecord(record);
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
