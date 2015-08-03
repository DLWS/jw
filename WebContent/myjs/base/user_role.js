var user_role = [ {
	name : 'id',
	header : 'id',
	type : 'string',
	required : true,
	hidden : true,
	editable : '0',
	width : 5
}, {
	name : 'role_name',
	header : '角色名称',
	type : 'string',
	required : true,
	width : .2
}, {
	name : 'role_describe',
	header : '角色描述',
	type : 'string',
	required : true,
	width : .7
},{
	name : 'role_fid',
	header : 'role_fid',
	type : 'string',
	hidden : true
}, {
	header : '查看',
	width : .1,
	renderer : function(v) {
		return "<a href='javaScript:roleDetailShow()'>查看</a>"
	}
} ];
function createUser_RolePanel() {
	var _grid = Ext.getCmp('user_role');
	// var _toolBar = _guid.
	if (_grid == null) {
		_grid = new TSuperGrid( {
			id : 'user_role',
			title : '角色管理',
			region : 'center',
			closable : true,
			p_closed : true,
			win_width : 500,
			win_height : 500,
			autoLoadData : false,
			crud_visible : false,
			isSearch : false,
			waitUrl : './jsp/wait.jsp',
			tablename : 'GWSJ_ROLE',
			// findField : 'depart_name',
			defaultSortField : 'no',
			keyTitle : '角色名称',
			keyField : 'id',
			structure : user_role,
			url : './jsp/user_role.jsp',
			doFailure : function(form, action) {
				Ext.Msg.alert('请求错误', action.result.message);
			},
			doClick2 : function(_g, _r, _e) {
			}
		});

		//var ds = _grid.store;
		//Ext.apply(ds.baseParams, {
		//			action : 'show'
		//		})
		//_grid.loadData()

		//_tab.add(_grid);
	}

	//_tab.setActiveTab(_grid);
	return _grid;
}
function roleDetailShow() {
	showUser_Role_showWin('view');
}
function changeAddBtn_RolePanel(tabpanel) {
	var _grid = createUser_RolePanel();
	var addBtn = {
		text : '新增',
		xtype : 'splitbutton',
		iconCls : 'table_add',
		minWidth : 65,
		handler : function() {
			showUser_Role_showWin('new');
		}
	};
	var editBtn = {
		text : '编辑',
		xtype : 'splitbutton',
		iconCls : 'table_edit',
		minWidth : 65,
		handler : function() {
			showUser_Role_showWin('edit');
		}
	};
	var delBtn = {
		text : '删除',
		xtype : 'splitbutton',
		iconCls : 'table_delete',
		minWidth : 65,
		handler : function() {
			_grid.doDelete(_grid);
		}
	};
	//	_grid.topToolbar.removeAll();
	_grid.topToolbar.insert(0, addBtn);
	_grid.topToolbar.insert(1, editBtn);
	_grid.topToolbar.insert(2, delBtn);
	//	_grid.btn_del_visible = true;
	_grid.createExtBtn(_grid.topToolbar, _grid);

	var ds = _grid.store;
	Ext.apply(ds.baseParams, {
		action : 'show'
	})
	_grid.loadData();
	tabpanel.add(_grid);
	tabpanel.setActiveTab(_grid);
	return _grid;
}
function showUser_Role_showWin(doName) {
	var _grid = Ext.getCmp('user_role');
	var rid = '';
	var role_name = '';
	var role_desc = '';
	var tree_json = '';
	var disabled = false;
	var hidden = false;
	var doNameStr = '新增';
	if (doName == 'edit') {
		if (_grid.editable) {
			var record = _grid.getSelectionModel().getSelected();
			if (record == null) {
				Ext.Msg.alert('提示', '请先选择你要编辑的数据');
				return;
			}
			role_name = record.get('role_name');
			role_desc = record.get('role_describe');
			rid = record.get('id');
			doNameStr = '编辑';
		}
	} else if (doName == 'view') {
		var record = _grid.getSelectionModel().getSelected();
		role_name = record.get('role_name');
		role_desc = record.get('role_describe');
		rid = record.get('id');
		doNameStr = '查看';
		// disabled = true;
		hidden = true;
	}
	Ext.Ajax.request( {
		url : './jsp/user_role.jsp',
		params : {
			action : 'json',
			doName : doName,
			id : rid
		},
		method : 'post',
		success : function(response, opts) { // Ext.Msg.alert("成功","保存成功！");
			var boxItems = response.responseText.replace(/\s/ig, '');
			var _cboxg = '';
			if (boxItems == '[]') {
				_cboxg = new Ext.form.Label( {
					text : '角色具有的功能:',
					height : 300
				});
			} else {
				_cboxg = new Ext.form.CheckboxGroup( {
					fieldLabel : '角色具有的功能',
					columns : 2,
					autoScroll : true,
					// autoHeight:true,
					height : 310,
					width : 310,
					// autoWidth : true,
					focusClass : '',
					items : eval(boxItems)
				});
			}
			var _form = new Ext.form.FormPanel( {
				labelSeparator : ':',
				// labelWidth : 40,
				labelAlign : 'left',
				bodyStyle : 'padding:5px 5px 5px 5px',
				frame : true,
				// url : 'user_role.jsp?acrion=new',
				items : [ new Ext.form.TextField( {
					name : 'role_name',
					value : role_name,
					disabled : disabled,
					// style : 'margin-top:1px',
					width : 310,
					fieldLabel : '角色名称'
				}), new Ext.form.TextArea( {
					name : 'role_describe',
					value : role_desc,
					disabled : disabled,
					width : 310,
					fieldLabel : '角色描述'
				}), _cboxg ]
			});
			var _win = new Ext.Window( {
				id : 'user_role_addWindow',
				title : '角色管理<' + doNameStr + '>',
				resizable : false,
				width : 470,
				height : 480,
				items : _form,
				buttons : [ {
					text : '确定',
					hidden : hidden,
					handler : function() {
						var values = _form.getForm().getValues();
						var name = values.role_name;
						var desc = values.role_describe;
						var values = _cboxg.getValue();
						if (name == '') {
							Ext.Msg.alert('提示', '角色名称不能为空');
							return;
						}
						if (desc == '') {
							Ext.Msg.alert('提示', '角色描述不能为空');
							return;
						}
						if (values.length == 0) {
							Ext.Msg.alert('提示', '请选择该角色具有的权限');
							return;
						}
						var val = function(id) {
							this.id = id;
						}
						var list = new Array();
						for ( var i = 0; i < values.length; i++) {
							var a = new val(values[i].inputValue)
							list.push(a);
						}
						Ext.Ajax.request( {
							url : "./jsp/user_role.jsp",
							method : 'post',
							params : {
								action : doName,
								id : rid,
								role_name : name,
								role_describe : desc,
								juri_list : Ext.encode(list)
							},
							success : function(response, opts) { // Ext.Msg.alert("成功","保存成功！");
								var msg = Ext.decode(response.responseText);
								if (msg.success == false) {
									Ext.Msg.alert("失败", msg.message);
								} else {
									_grid.reload();
									_win.hide();
									_win.destroy();
								}
							},
							failure : function(editform, action) {
								Ext.Msg.alert("失败", "保存失败");
							}
						});

					}
				}, {
					text : '取消',
					handler : function() {
						_win.hide();
						_win.destroy();
					}
				} ]
			})
			_win.show();
		},
		failure : function(editform, action) {
			Ext.Msg.alert("失败", "获取失败");
		}
	});

}