var user_mamager = [ {
	name : 'XUHAO',
	header : '序号',
	type : 'string',
	hidden : false,
	editable : '0',
	width : 5
}, {
	name : 'ID',
	header : 'id',
	type : 'string',
	hidden : true,
	editable : '0',
	width : 5
}, {
	name : 'USERNAME',
	header : 'PASSWORD',
	type : 'string',
	hidden : true,
	editable : '0',
	width : 5
}, {
	name : 'USERPWD',
	header : '用户账号',
	type : 'string',
	required : true,
	width : 5
}, {
	name : 'USERXM',
	header : '用户姓名',
	type : 'string',
	required : true,
	width : 5
}, {
	name : 'GWD',
	header : 'GWD',
	hidden : true,
	type : 'string',
	required : true,
	editable : '0',
	width : 5
}, {
	name : 'GWDMC',
	header : '工务段名称',
	type : 'string',
	required : true,
	editable : '0',
	width : 5
}, {
	name : 'CJ',
	header : 'CJ',
	type : 'string',
	hidden : true,
	required : false,
	editable : '0',
	width : 5
}, {
	name : 'CJMC',
	header : '车间名称',
	type : 'string',
	required : false,
	editable : '0',
	width : 5
}, {
	name : 'CANLOGIN',
	header : '是否可以登录',
	type : 'string',
	required : true,
	width : 5,
	editable : '0',
	renderer : function(v) {
		if ("y" == v || "Y" == v) {
			return "是";
		} else if ("n" == v || "N" == v) {
			return "否";
		}
	}
} ];

function createUserPanel(_tab) {
	var _panel = Ext.getCmp('x_user_mgr');
	if (_panel == null) {
		var _panel = new TSuperGrid( {
			id : 'x_user_mgr',// user_mgr
			title : '用户管理',
			region : 'center',
			closable : true,
			isSearch : false,
			// tablename : 'gwjc_rwfj',
			defaultSortField : 'ID',
			keyField : 'ID',
			structure : user_mamager,
			url : './user/findAll.do',
			addItem : function() {
				var _grid = Ext.getCmp("x_user_mgr");
				adduserform(_grid, "add", null);
			},
			doClick2 : function(_g, _r, _e) {
			},
			editItem : function() {
				var _grid = Ext.getCmp("x_user_mgr");
				var record = _grid.getSelectionModel().getSelected();
				if (record == null || '' == record) {
					Ext.Msg.alert('提示', '请先选择你要修改的用户');
					return;
				} else {
					var tid = record.get(_grid.keyField);
					adduserform(_grid, "edit", tid);
				}
			},
			doDelete : function(_grid) {
				Ext.TAppUtil.postParams4Form("", _grid, UserDction, "", "del");
			},
			doFailure : function(form, action) {
				Ext.Msg.alert('请求错误', action.result.message);
			}
		});
		_tab.add(_panel);
	}

	_tab.setActiveTab(_panel);
	return _panel;

}

function adduserform(_grid, action, tid) {
	var my_width = 230;
	var my_out_width = 380;
	var my_out_hiegth = 460;

	var role_cbg;
	/*var isDept = 1;
	var deptCompDisabled = false;
	var duanCompDisabled = false;

	var isDeptFlag = true;
	if (null != App_user_level && null != App_user_level1) {
		if ("1" == App_user_level) {
			deptCompDisabled = false;
			duanCompDisabled = false;
		} else if ("1" != App_user_level1 && "null" != App_user_level1
				&& "" != App_user_level1) {
			deptCompDisabled = false;
			duanCompDisabled = true;
			isDept = 1;
		} else if ("null" == App_user_level1 || "" == App_user_level1) {
			deptCompDisabled = true;
			duanCompDisabled = false;
			isDeptFlag = false;
			isDept = 0;
		}
	}*/
	var canLoginChecked_yes=true;
	var canLoginChecked_no;

	var username_value = "";
	var name_value = "";
	var ljmc = "兰州局";
	var gwd_value = "";
	var cj_value = "";
	var dept_value = "";
	var canLogin_value = "";
	var password_value = "";

	var duan_id = "";
	var cj_id = "";

	if ("edit" == action) {
		var record = _grid.getSelectionModel().getSelected();
		if (null != record && "" != record) {

			duan_id = record.get("GWD");
			cj_id = record.get("CJ");

			username_value = record.get("USERNAME");
			password_value = record.get("USERPWD");
			name_value = record.get("USERXM");
			gwd_value = record.get("GWDMC");
			cj_value = record.get("CJMC");
			//			dept_value = record.get("KS_ID");
			canLogin_value = record.get("CANLOGIN");

			if (canLogin_value.toLowerCase() == 'y') {
				canLoginChecked_yes = true;
				canLoginChecked_no = false;
			} else {
				canLoginChecked_yes = false;
				canLoginChecked_no = true;
			}
			/*if (null != dept_value && "" != dept_value) {
				isDeptFlag = true;
			} else {
				isDeptFlag = false;
				isDept = 0;

			}*/

		}

	}

	Ext.Ajax
			.request( {
				url : './role/getAllRole4Json.do',
				method : 'post',
				success : function(response, opts) {
					var obj = response.responseText;
					role_cbg = new Ext.form.CheckboxGroup( {
						id : 'user_role',
						fieldLabel : '用户具有的角色',
						autoScroll : true,
						columns : 2,
						height : 'auto',
						focusClass : '',
						width : my_width,
						items : eval(obj)
					});

					var _form = new TFormEditor(
							{
								save_url : _grid.url,
								items : [
										{
											id : 'username',
											name : 'username',
											xtype : 'textfield',
											width : my_width,
											fieldLabel : '用户账号',
											value : username_value,
											allowBlank : false,
											blankText : '必须填写用户账号'
										},
										{
											id : 'password',
											name : 'password',
											xtype : 'textfield',
											inputType : 'password',
											value : password_value,
											width : my_width,
											fieldLabel : '登录密码',
											allowBlank : false,
											blankText : '必须填写登录密码'
										},
										{
											id : 'password2',
											name : 'password2',
											xtype : 'textfield',
											inputType : 'password',
											value : password_value,
											width : my_width,
											fieldLabel : '确认登录密码',
											allowBlank : false,
											blankText : '必须填写确认密码'
										},
										{
											id : 'name',
											name : 'name',
											xtype : 'textfield',
											width : my_width,
											fieldLabel : '用户姓名',
											value : name_value,
											allowBlank : false,
											blankText : '必须填用户姓名'
										},
										{

											xtype : 'combo',
											id : "lj_combo2",
											fieldLabel : '路局',
											value : ljmc,
											valueField : 'id',
											displayField : 'value',
											editable : false,
											allowBlank : false,
											width : my_width,
											store : new Ext.data.ArrayStore( {
												id : 0,
												fields : [ 'id', 'value' ],
												data : [ [ '11', '兰州局' ] ]
											}),
											mode : 'local',
											triggerAction : 'all',
											listeners : {
												select : function(_combobox) {
													var lj_id = _combobox
															.getValue();
													ljbh = lj_id;
													var gwdStore = Ext
															.getCmp("gwd_combo").store;
													Ext.getCmp("gwd_combo")
															.setValue("");
													GwdDction
															.findByLJBH(
																	lj_id,
																	function(
																			data) {
																		var jdata = Ext.util.JSON
																				.decode(data);
																		gwdStore
																				.loadData(jdata);
																	});
												}
											}
										},
										{
											xtype : 'combo',
											id : "gwd_combo",
											name : "gwd_combo",
											fieldLabel : '用户所在工务段',
											hiddenName : 'DWBH',
											displayField : 'DWMC',
											valueField : 'DWBH',
											value : gwd_value,
											editable : false,
											selectOnFocus : true,
											width : my_width,
											allowBlank : false,
											blankText : '必须选择所在段',
											store : new Ext.data.JsonStore( {
												autoLoad : true,
												root : 'list',
												url : ' ',
												fields : [ 'DWBH', 'DWMC' ]
											}),
											mode : 'local',
											triggerAction : 'all',
											listeners : {
												select : function(_c) {
													duan_id = _c.getValue();
													var ds = Ext
															.getCmp('cj_combo').store;
													Ext.getCmp('cj_combo')
															.setValue("");
													CjAction
															.findByGWD(
																	duan_id,
																	function(
																			data) {
																		var jdata = Ext.util.JSON
																				.decode(data);
																		ds
																				.loadData(jdata);
																	});
												}

											}
										},
										{
											xtype : 'combo',
											id : "cj_combo",
											fieldLabel : '用户所在车间',
											valueField : 'ID',
											displayField : 'CJMC',
											value : cj_value,
											editable : true,
											width : my_width,
											//							disabled : isDeptFlag,
											emptyText : "--请选择车间--",
											store : new Ext.data.JsonStore( {
												root : 'list',
												url : ' ',
												fields : [ 'ID', 'CJMC' ]
											}),
											mode : 'local',
											triggerAction : 'all',
											listeners : {
												select : function(_combobox) {
													cj_id = _combobox
															.getValue();
												}

											}
										}, role_cbg, {
											xtype : 'radiogroup',
											id : 'canLogin',
											name : 'canLogin',
											fieldLabel : "是否可以登录",
											width : my_width,
											items : [ {
												boxLabel : '可以登录',
												name : 'login',
												inputValue : 'y',
												checked : canLoginChecked_yes
											}, {
												boxLabel : '不可登录',
												name : 'login',
												inputValue : 'n',
												checked : canLoginChecked_no
											} ]
										} ],
								doError : function(form, action) {

								},
								doSave : function() {
									var _form = this;
									var username_value = Ext.getCmp("username")
											.getValue();
									var password_value = Ext.getCmp("password")
											.getValue();
									var password2_value = Ext.getCmp(
											"password2").getValue();
									var name_value = Ext.getCmp("name")
											.getValue();
									var canLogin_value = Ext.getCmp("canLogin")
											.getValue().inputValue;

									var gwd_value = Ext.getCmp("gwd_combo")
											.getValue();
									var cj_value = Ext.getCmp("cj_combo")
											.getValue();
									if (null == cj_value || "" == cj_value) {
										cj_id = "";
									}

									var role_chk_grp = Ext.getCmp("user_role");
									var role_id = "";
									var xmCount = "";
									for ( var i = 0; i < role_chk_grp
											.getValue().length; i++) {
										xmCount++;
										role_id += role_chk_grp.getValue()[i].inputValue
												+ ",";

									}

									if (password_value != password2_value) {
										Ext.Msg.alert("提示", "两次密码不一致！");
										return;
									}

									if (_form.form.isValid()) {
										var param = {
											fields : {
												"ID" : tid,
												"USERNAME" : username_value,
												"USERPWD" : password_value,
												"USERXM" : name_value,
												"GWD" : duan_id,
												"CJ" : cj_id,
												"ROLEID" : role_id,
												"CANLOGIN" : canLogin_value
											}
										};
										Ext.TAppUtil.postParams4Form(_form,
												_grid, UserDction, param,
												action);
									}

								}
							});

					var win = new TWindowEditor( {
						title : _grid.title,
						height : my_out_hiegth,
						width : my_out_width,
						frame : true,
						resizable : true,
						form : _form
					});

					Ext.apply(_form, {
						window : win
					});

					if (action == 'edit') {

						var username = Ext.getCmp("username");
						username.setDisabled(true);

						win.setTitle("修改用户")
					} else if (action == 'new') {
						win.setTitle("添加用户")
					}

					win.show();

				},
				failure : function() {
					alert("系统出错");
				},
				params : {
					action : 'showrole',
					"tid" : tid
				}
			});

}
