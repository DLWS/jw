var user_juri = [ {
	name : 'id',
	header : 'id',
	type : 'string',
	required : true,
	hidden : true,
	editable : '0',
	width : 5
}, {
	name : 'juri_name',
	header : '权限名称',
	type : 'string',
	required : true,
	width : .2
}, {
	name : 'juri_describe',
	header : '权限描述',
	type : 'string',
	required : true,
	width : .7
}, {
	header : '查看',
	width : .1,
	renderer : function(v) {
		return "<a href='javaScript:juriDetailShow()'>查看</a>"
	}
} ];
function createUser_JuriPanel(_tab) {
	var _grid = Ext.getCmp('user_jurisdiction');
	if (_grid == null) {
		_grid = new TSuperGrid( {
			id : 'user_jurisdiction',
			title : '权限管理',
			region : 'center',
			closable : true,
			p_closed : true,
			win_width : 500,
			win_height : 500,
			crud_visible : false,
			isSearch : false,
			waitUrl : './jsp/wait.jsp',
			tablename : 'gwjc_jurisdiction',
			defaultSortField : 'no',
			keyTitle : 'jurisdiction',
			keyField : 'id',
			structure : user_juri,
			url : './jsp/user_juri.jsp',
			doClick2 : function(_g, _r, _e) {
			},
			doFailure : function(form, action) {
				Ext.Msg.alert('请求错误', action.result.message);
			}
		});

		//_tab.add(_grid);
	}

	//_tab.setActiveTab(_grid);
	return _grid;
}
function changeAddBtn_JuriPanel(tabpanel) {
	var _grid = Ext.getCmp('user_jurisdiction');
	var addBtn = {
		text : '新增',
		xtype : 'splitbutton',
		iconCls : 'table_add',
		minWidth : 65,
		handler : function() {
			showUser_Turi_showWin('new');
		}
	};
	var editBtn = {
		text : '编辑',
		xtype : 'splitbutton',
		iconCls : 'table_edit',
		minWidth : 65,
		handler : function() {
			showUser_Turi_showWin('edit');
		}
	}
	var delBtn = {
		text : '删除',
		xtype : 'splitbutton',
		iconCls : 'table_delete',
		minWidth : 65,
		handler : function() {
			_grid.doDelete(_grid);
		}
	}
	//	_grid.topToolbar.removeAll(true);
	_grid.topToolbar.insert(0, addBtn);
	_grid.topToolbar.insert(1, editBtn);
	_grid.topToolbar.insert(2, delBtn);
	//	_grid.btn_del_visible = true;
	_grid.createExtBtn(_grid.topToolbar, _grid);

	tabpanel.add(_grid)
	tabpanel.setActiveTab(_grid);
	return _grid;
}

function showUser_Turi_showWin(doName) {
	var _grid = Ext.getCmp('user_jurisdiction');
	var jid = '';
	var juri_name = '';
	var juri_desc = '';
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
			juri_name = record.get('juri_name');
			juri_desc = record.get('juri_describe');
			jid = record.get('id');
			doNameStr = '编辑';
		}
	} else if (doName == 'view') {
		var record = _grid.getSelectionModel().getSelected();
		juri_name = record.get('juri_name');
		juri_desc = record.get('juri_describe');
		jid = record.get('id');
		doNameStr = '查看';
		// disabled = true;
		hidden = true;
	}
	var _tree = new Ext.tree.TreePanel( {
		id : 'user_jurisdiction_addTree',
		title : '权限具有功能',
		height : 340,
		autoScroll : true,
		rootVisible : false,
		tbar : [ {
			xtype : 'checkbox',
			boxLabel : '全选',
			disabled : disabled,
			handler : function(_checkbox, checked) {
				_tree.checkAllNodes(checked);
			}
		}, {
			xtype : 'button',
			text : '刷新',
			iconCls : 'table_reload',
			handler : function() {
				_tree.getLoader().load(_tree.getRootNode());
			}
		}, {
			xtype : 'button',
			text : '全部折叠',
			iconCls : 'collapse-all',
			handler : function() {
				if (this.text == '全部折叠') {
					_tree.collapseAll();
					this.setText('全部展开');
					this.setIconClass('expand-all');
				} else {
					_tree.expandAll();
					this.setText('全部折叠');
					this.setIconClass('collapse-all');
				}
			}
		} ],
		root : [ new Ext.tree.AsyncTreeNode( {
			text : 'root',
			id : 'root',
			expanded : true
		}) ],
		loader : new Ext.tree.TreeLoader( {
			dataUrl : './jsp/user_juri.jsp?action=json&doName=' + doName
					+ '&id=' + jid
		}),
		plugins : [ new Ext.plugin.tree.TreeNodeChecked( {
			// 级联选中
			cascadeCheck : true,

			// 级联父节点
			cascadeParent : true,

			// 级联子节点
			cascadeChild : true,

			// 连续选中
			linkedCheck : false,

			// 异步加载时，级联选中下级子节点
			asyncCheck : false,

			// 显示所有树节点checkbox
			displayAllCheckbox : true
		}) ]
	});
	var _form = new Ext.form.FormPanel( {
		labelSeparator : ':',
		labelWidth : 70,
		labelAlign : 'right',
		// frame:true,
		items : [ new Ext.form.TextField( {
			name : 'juri_name',
			value : juri_name,
			disabled : disabled,
			style : 'margin-top:1px',
			width : 310,
			fieldLabel : '权限名称'
		}), new Ext.form.TextArea( {
			name : 'juri_describe',
			value : juri_desc,
			disabled : disabled,
			width : 310,
			fieldLabel : '权限描述'
		}), _tree ]
	});
	var _win = new Ext.Window( {
		id : 'user_jurisdiction_addWindow',
		title : '权限管理<' + doNameStr + '>',
		resizable : false,
		width : 430,
		height : 500,
		items : _form,
		buttons : [ {
			text : '确定',
			hidden : hidden,
			handler : function() {
				var values = _form.getForm().getValues();
				var name = values.juri_name;
				var desc = values.juri_describe;
				var nodes = _tree.getChecked("id");
				if (name == '') {
					Ext.Msg.alert('提示', '权限名称不能为空');
					return;
				}
				if (desc == '') {
					Ext.Msg.alert('提示', '权限描述不能为空');
					return;
				}
				if (nodes.length == 0) {
					Ext.Msg.alert('提示', '请选择该权限具有的功能');
					return;
				}
				Ext.Ajax.request( {
					url : "./jsp/user_juri.jsp",
					method : 'post',
					params : {
						action : doName,
						id : jid,
						juri_name : name,
						juri_describe : desc,
						nodes : Ext.encode(nodes)
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
					failure : function(response, opts) {
						var msg = Ext.decode(response.responseText);
						Ext.Msg.alert("失败", msg.message);
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
	_tree.expandAll();
	_win.show();

}
function juriDetailShow() {
	showUser_Turi_showWin('view');
}