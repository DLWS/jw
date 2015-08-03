// 编制检查计划
var make_depart_plan_st = [ {
	name : 'ID',
	header : 'id',
	type : 'string',
	hidden : true,
	editable : '0'
}, {
	name : 'XD_DATE',
	header : '下达日期',
	type : 'string',
	required : true,
	editable : '0',
	width : 45
}, {
	name : 'XL_NAME',
	header : '检查处所',
	type : 'string',
	required : true,
	width : 45
}, {
	name : 'KS_ID',
	header : '检查科室',
	type : 'string',
	required : true,
	width : 45
}, {
	name : 'XMNR',
	header : '检查内容',
	type : 'string',
	editable : '0',
	required : true
}, {
	name : 'JCYQ',
	header : '检查要求',
	type : 'string',
	editable : '0',
	required : true
}, {
	name : 'WCZT',
	header : '检查计划执行情况',
	type : 'string',
	editable : '0',
	required : true,
	renderer : function(v) {
		if ("0" == v) {
			return "已下达";
		} else if (v > 0) {
			return "<font color='orange'>执行中</font>";
		} else {
			return v;
		}

	}
}, {
	name : 'WCZT',
	header : '检查计划执行情况',
	type : 'string',
	editable : '0',
	required : true,
	renderer : function(v) {
		if ("2" == v) {
			return "<font color='red'>发现问题</font>";
		} else if ("3" == v) {
			return "<font color='blue'>未发现问题</font>";
		} else if ("4" == v) {
			return "<font color='green'>整改完毕</font>";
		} else {
			return "<font color='pink'>未检查</font>";
		}

	}
}, {
	name : 'ID',
	header : '查看计划执行状况',
	type : 'string',
	required : true,
	renderer : function(v) {
		return "<a href='#'  onclick='x_c_plan_detil()'>查看计划执行状况</a>";
	}

} ];

function x_c_plan_detil() {
	var _grid = Ext.getCmp('tab_task_plan');
	var record = _grid.getSelectionModel().getSelected();
	if (null != record && "" != record) {
		var jcrw_id = record.get(_grid.keyField);
		if (null != jcrw_id) {
			x_show_info_detil(jcrw_id);
		}

	} else {
		Ext.Msg.alert("提示", "无法查看计划详细执行状态");
		return;
	}
}
function x_createPlanPanel(_tab) {
	var _grid = Ext.getCmp('tab_task_plan');
	if (_grid == null) {// 不存在
		_grid = new TSuperGrid( {
			id : 'tab_task_plan',
			title : '<center>安质科编制检查计划</center>',
			region : 'center',
			closable : true,
			win_width : 400,
			win_height : 400,
			tablename : 'gwjc_jcrw',
			defaultSortField : 'no',
			keyTitle : '检查处所',
			keyField : 'ID',
			crud_visible : false,
			structure : make_depart_plan_st,
			isSearch : false,
			url : './jsp/make_plan.jsp',
			/*createExtButton1 : function(_grid) {
				return new Ext.Button( {
					iconCls : 'table_reload',
					text : "发布检查计划",
					minWidth : 65,
					handler : function() {
						if (Ext.Msg.confirm('请确认?',
								'您是否确定真的要发布当前检查计划,发布后将不再允许进行修改操作?', function(
										_b, _t) {
									if (_b == 'yes') {
										Ext.TCellUtil.request(
												'./jsp/send_plan.jsp',
												function(json) {
													_grid.reload();
												});
									}
								}))
							;
					},
					scope : _grid
				});
			},*/
			doClick2 : function(_g, _r, _e) {
				c_plan_showEdit(_grid, "edit");
			},
			doDelete : function(_grid) {
				var sSelId = "";
				var tablename = _grid.tablename;
				var keyField = _grid.keyField;
				var url = _grid.url;
				var aId = new Array();
				var record = _grid.getSelectionModel().getSelected();
				if (!record) {
					Ext.Msg.alert("提示", "请先选择要删除的检查计划!");
					return;
				} else if (!_grid.canUpdate(record)) {// 不允许编辑
					return;
				} else {

					for ( var i = 0, j = _grid.store.getCount(); i < j; i++) {
						if (_grid.getSelectionModel().isSelected(i)) {
							sSelId += "'" + _grid.store.getAt(i).get(keyField)
									+ "',";
							aId[aId.length] = _grid.store.getAt(i)
						}
					}
					if (sSelId.length > 0) {
						sSelId = sSelId.substr(0, sSelId.length - 1);
					}
				}

				var zt = record.get("WCZT");
				var a_msg_1 = "确认删除"
				var a_msg_2 = "您是否要删除所选的检查任务?"

				if (null != zt && "" != zt && "0" != zt) {
					a_msg_2 = "检查任务正在流转中，是否强制删除检查任务?"
				}

				Ext.MessageBox.confirm(a_msg_1, a_msg_2, function(btn) {
					if (btn == 'yes') {// 选中了是按钮
							Ext.TAppUtil.showMask('正在删除数据，请稍候...');
							Ext.Ajax.request( {
								url : url,
								success : function() {
									Ext.TAppUtil.closeMask();
									for ( var i = 0; i < aId.length; i++) {
										_grid.store.remove(aId[i]);
									}
								},
								failure : _grid.doFailure,
								params : {
									action : 'delete',
									tabname : tablename,
									fieldkey : keyField,
									id : sSelId
								}
							});
						}
					});
			}
		});

		var addBtn = new Ext.Button( {
			text : '添加检查任务',
			id : 'c_plan_addBtn',
			xtype : 'splitbutton',
			iconCls : 'table_add',
			minWidth : 65,
			handler : function() {
				c_plan_showEdit(_grid, 'new');
			}
		});
		var editBtn = new Ext.Button( {
			text : '修改检查任务',
			id : 'c_plan_editBtn',
			xtype : 'splitbutton',
			iconCls : 'table_edit',
			minWidth : 65,
			handler : function() {
				c_plan_showEdit(_grid, 'edit');
			}
		});
		var delBtn = new Ext.Button( {
			text : '删除检查计划',
			id : 'c_plan_delBtn',
			xtype : 'splitbutton',
			iconCls : 'table_delete',
			minWidth : 65,
			handler : function() {
				_grid.doDelete(_grid);
			}
		});
		_grid.topToolbar.insert(0, addBtn);
		_grid.topToolbar.insert(1, editBtn);
		_grid.topToolbar.insert(2, delBtn);

		_tab.add(_grid);
	}
	_tab.setActiveTab(_grid);
	return _grid;
}

function c_plan_showEdit(_grid, action) {

	var my_width = 200;
	var my_out_width = 700;

	var record = _grid.getSelectionModel().getSelected();
	var tid = "";
	var zt = "";

	var txl = "";
	var tks = "";
	var txm = "";
	var tyq = "";
	xdrq_value = "";

	if (action == "edit") {
		if (record == null || '' == record) {
			Ext.Msg.alert('提示', '请先选择你要修改的检查计划');
			return;
		} else {
			zt = record.get("WCZT");

			if (null != zt && "" != zt && "0" != zt) {
				Ext.Msg.alert("提示", "检查任务执行中，不能修改！");
				return;
			}

			tid = record.get(_grid.keyField);
			txl = record.get("XL_NAME");
			tks = record.get("KS_ID");
			txm = record.get("XMNR");
			tyq = record.get("JCYQ");
			xdrq_value = record.get("XD_DATE");

		}
	}

	Ext.Ajax.request( {
		url : './jsp/c_dic.jsp',
		params : {
			dicName : 'jcbz',
			tid : tid
		},
		success : function(response, options) {
			var items = response.responseText;
			var _comboXm = new Ext.form.ComboBox( {
				id : "xl_combo",
				fieldLabel : '检查处所',
				valueField : 'ID',
				displayField : 'XL_NAME',
				editable : false,
				width : my_width,
				store : new Ext.data.JsonStore( {
					autoLoad : true,
					root : 'list',
					url : './jsp/c_dic.jsp?dicName=xm&tid=' + tid,
					fields : [ 'XL_NAME', 'ID' ]
				}),
				mode : 'local',
				triggerAction : 'all'
			});

			var _deptCombo = new Ext.form.ComboBox( {
				id : "dept_combo",
				fieldLabel : '科室/人员',
				valueField : 'KS_NAME',
				displayField : 'KS_NAME',
				editable : true,
				width : my_width,
				store : new Ext.data.JsonStore( {
					autoLoad : true,
					url : './jsp/c_dic.jsp?dicName=dept&tid=' + tid,
					fields : [ 'KS_ID', 'KS_NAME' ],
					root : 'list'
				}),
				mode : 'local',
				triggerAction : 'all'
			});

			var _jcyq = new Ext.form.TextArea( {
				id : "jcyq",
				fieldLabel : '检查要求',
				width : my_width,
				height : 150,
				allowBlank : false

			})

			var _jcbzChkgroup = new Ext.form.CheckboxGroup( {
				id : 'x_jcbzChkgroup',
				fieldLabel : '检查选项',
				autoScoll : true,
				columns : 2,
				width : my_width,
				focusClass : '',
				items : eval(items)
			});

			if (action == "edit") {
				_comboXm.setValue(txl);
				_deptCombo.setValue(tks);
				_jcyq.setValue(tyq);

				var items = _jcbzChkgroup.items;
				for ( var i = 0; i < items.length; i++) {
					var str = items[i].boxLabel;
					if (txm.indexOf(str) >= 0) {
						items[i].checked = true;
					}

				}
			}

			var _form = new TFormEditor( {
				region : 'west',
				save_url : _grid.url,
				items : [ {
					id : 'xdrq',
					name : 'xdrq',
					xtype : 'datefield',
					width : my_width,
					fieldLabel : '下达日期',
					allowBlank : false,
					blankText : '必须填写下达日期',
					format : 'Y-m-d',
					value : new Date()
				}, _comboXm, _deptCombo, _jcbzChkgroup, _jcyq ],
				labelWidth : 100,
				width : '350',
				doError : function(form, action) {

				},
				doSave : function() {// 保存数据
					var _form = this;
					var xl_id = _comboXm.getValue();
					if (null == xl_id || "" == xl_id) {
						alert("请选择线路！");
						return;
					}
					var ks_id = _deptCombo.getValue();
					if (null == ks_id || "" == ks_id) {
						alert("请选择科室！");
						return;
					}

					var jcyq = _jcyq.getValue();
					if (null == jcyq || "" == jcyq) {
						alert("请填写检查要求！");
						return;
					}

					xdrq_value = Ext.getCmp("xdrq").getValue();
					if (null == xdrq_value || "" == xdrq_value) {
						alert("请填写下达日期！");
						return;
					}

					var xmCount = 0;
					var xm_id = "";
					for ( var i = 0; i < _jcbzChkgroup.getValue().length; i++) {
						xmCount++;
						xm_id += _jcbzChkgroup.getValue()[i].inputValue + ";";

					}
					if (xmCount < 1) {
						alert("至少选择一个项目！");
						return;
					}

					if (action == "edit") {
						var xmStore = _comboXm.getStore();
						var deptStore = _deptCombo.getStore();

						var xmvalue = _comboXm.getValue();
						var deptvalue = _deptCombo.getValue();

						xmStore.each(function(s1) {
							var k = s1.get("XL_NAME");
							var v = s1.get("ID");

							if (xmvalue == k || xmvalue == v) {
								_comboXm.setValue(v);
							}
						});
						xl_id = _comboXm.getValue();
						ks_id = _deptCombo.getValue();

					}

					if (_form.form.isValid()) {
						_form.form.submit( {
							method : 'POST',
							waitTitle : '系统提示',
							waitMsg : '正在保存数据,请稍候...',
							url : _form.save_url,
							params : {
								"xl_id" : xl_id,
								"ks_id" : ks_id,
								"xm_id" : xm_id,
								"jcyq" : jcyq,
								"tid" : tid,
								"xdrq":xdrq_value,
								"action" : action

							},
							success : function(form, action) {// 成功
								_grid.getStore().reload();
								_form.window.close();
							},
							failure : function(form, action) {
								_form.doError(form, action);
							}
						});
					}
				}
			});

			if ("edit" == action) {
				var xdrq = Ext.getCmp("xdrq");
				xdrq.format = 'Y-m-d';
				xdrq.setValue(xdrq_value);
			}

			var _right_win = new TSuperGrid( {
				id : 'tab_cfg_lhbz_right',
				region : 'center',
				title : '线路量化标准',
				isSearch : false,
				region : 'center',
				closable : true,
				win_width : 300,
				win_height : 430,
				columnLines : true,
				waitUrl : './jsp/wait.jsp',
				tablename : 'A_LHBZ',
				defaultSortField : 'id',
				tbar_visible : false,
				keyField : 'ID',
				structure : x_lhbz_col_2,
				url : './jsp/lhbz_mgr.jsp?action=show4month',
				addItem : function() {
					var _grid = Ext.getCmp("tab_cfg_lhbz");
					addLhbzform(_grid, "new", null);
				},
				editItem : function() {
					var _grid = Ext.getCmp("tab_cfg_lhbz");
					var record = _grid.getSelectionModel().getSelected();
					if (record == null || '' == record) {
						Ext.Msg.alert('提示', '请先选择你要分配的相关任务');
						return;
					} else {
						var tid = record.get(_grid.keyField);
						addLhbzform(_grid, "edit", tid);
					}
				},
				doClick2 : function(_g, _r, _e) {
				}
			});

			var win = new Ext.Window( {
				title : _grid.title,
				height : 470,
				width : my_out_width,
				resizable : true,
				modal : true,
				frame : true,
				layout : 'border',
				items : [ _form, _right_win ]
			})
			Ext.apply(_form, {
				window : win
			});

			if (action == 'new') {
				win.setTitle("安质科添加检查计划");
			} else if (action == 'edit') {
				win.setTitle("安质科修改检查计划");
			}

			win.show();

		}
	});

}

// 量化标准
var x_lhbz_col_2 = [ {
	name : 'ID',
	header : 'ID',
	type : 'string',
	required : true,
	hidden : true,
	editable : '0'
}, {
	name : 'XL_ID',
	header : 'XL_ID',
	type : 'string',
	required : true,
	hidden : true,
	editable : '0'
}, {
	name : 'XUHAO',
	header : '序号',
	type : 'string',
	required : true
}, {
	name : 'XL_NAME',
	header : '线路名称',
	type : 'string',
	required : true
}, {
	name : 'XLLX',
	header : '干支线',
	type : 'string',
	required : true
}, {
	name : 'ZQ_NUM',
	header : '半月检查标准次数',
	type : 'string',
	required : true
}, {
	name : 'XL_COUNT',
	header : '已经检查次数',
	type : 'string',
	required : true,
	renderer : function(v, md, record) {
		var ZQ_NUM = record.get('ZQ_NUM');
		if (ZQ_NUM > v) {
			return "<font color='red'>" + v + "</font>";
		} else {
			return v;
		}

	}
}

];