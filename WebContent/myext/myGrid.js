/*******************************************************************************
 * 通过表格控件，支持crud操作，支持表格自动分组
 */
var MAX_ROWS = 500000; // 最大记录数
TPageSizePlugin = function() {
	TPageSizePlugin.superclass.constructor.call(this, {
		store : new Ext.data.SimpleStore( {
			fields : [ 'text', 'value' ],
			data : [ [ '10', 10 ], [ '15', 15 ], [ '20', 20 ], [ '25', 25 ],
					[ '30', 30 ], [ '50', 50 ], [ '100', 100 ],
					[ '全部', MAX_ROWS ] ]
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

Ext.extend(TPageSizePlugin, Ext.form.ComboBox, {
	init : function(paging) {
		paging.on('render', this.onInitView, this);
	},

	onInitView : function(paging) {
		paging.add('-', '每页记录数：', ' ', ' ', ' ', this);
		this.setValue(paging.pageSize);
		this.on('select', this.onPageSizeChanged, paging);
	},

	onPageSizeChanged : function(combo) {
		this.pageSize = parseInt(combo.getValue());
		this.doLoad(0);
	}
});
// =======================

TSuperGrid = Ext
		.extend(
				Ext.grid.GridPanel,
				{
					// 储存表格结构
					structure : '',
					// 表格绑定的表
					tablename : '',
					// 指定加载的列 默认为读取表上所有列数据
					fields : '',
					p_closed : false,
					searchItems : null,
					isSearch : true,
					waitUrl : '',
					// 每页显示条数
					pageSize : 20,
					// 表单里控件的默认宽
					fieldwidth : 200,
					// reader类型如果当为json的时候那么url不能空，当为array的时候dataObject不能为空
					readType : 'json',
					// 获取数据的URL
					url : '',
					p_id : '',
					p_state : '',
					user_id : 'user_id',
					// 数据对象
					dataObject : null,
					labelWidth : 80,
					keyTitle : '',
					// 是否可编辑
					editable : true,
					tbar_visible : true,
					crud_visible : true,
					// 表格主键
					keyField : '',
					// 绑定查询的列
					findField : null,
					autoFit : true, // 是否自动填充
					autoLoadData : true, // 是否自动加载数据
					// 是否需要分组，默认为false，如果设置为true须再设置两个参数一个为myGroupField和myGroupTextTpl
					needGroup : false,
					// 分组的字段名称
					myGroupField : '',
					// 分组显示的模板，eg：{text} ({[values.rs.length]} {[values.rs.length > 1 ?
					// "Items" : "Item"]})
					myGroupTextTpl : '',
					// 列模式的选择模式,默认为rowselectModel，如果相设置成check模式，就设置为check
					selectType : '',
					// 默认排序字段
					defaultSortField : 'id',
					// 是否需要分页工具栏，默认为true
					needPage : true,
					frame : false,
					// 是否带展开按钮，默认为false
					collapsible : false,
					animCollapse : true,
					loadMask : true,
					// 存储表头信息
					col : null,
					// private
					initComponent : function() {// 初始化组件
						if (this.structure != '') {
							this.initStructure();
						}
						TSuperGrid.superclass.initComponent.call(this);
						// 是否自动填充表格宽度
						Ext.apply(this, {
							viewConfig : {
								forceFit : this.autoFit
							}
						});
					},

					initEvents : function() {// 初始化事件
						TSuperGrid.superclass.initEvents.call(this);
						if (this.loadMask) {
							this.loadMask = new Ext.LoadMask(this.bwrap, Ext
									.apply( {
										store : this.store
									}, this.loadMask));
						}
					},

					changeCell : function(_grid, _row, _r) {
					},

					loadDone : function(_grid, _recs) {// 加载完毕
						var _row = 0;
						_recs.each(function(_r) {
							_grid.changeCell(_grid, _row, _r);
							_row++;
						});
					},

					initStructure : function() {// 初始化grid结构
						var _grid = this;
						var oDs = null;
						var oCM = new Array(); // 列模式数组
						var oRecord = new Array(); // 容器对数组
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
							if (c.type == 'date' && !c.renderer) {// 默认格式化日期列
								c.renderer = this.formatDate;
							}
							if (c.type == 'memo'
									&& Ext.TAppUtil.isNull(c.renderer)) {
								c.renderer = function(value) {
									return Ext.TAppUtil.enter2br(value);
								};
							}

							oCM[oCM.length] = {
								header : c.header,
								dataIndex : c.name,
								hidden : c.hidden || false,
								width : !c.hidden ? c.width : this.fieldwidth,
								// 类型为数字则右对齐
								align : c.type == 'numeric' ? 'right' : 'left',
								// 排序
								sortable : (c.sortable != null) ? c.sortable
										: true,
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
						var tablename = this.tablename;
						var pageSize = this.pageSize;
						var fields = this.fields;

						switch (this.readType) {
						case 'json':
							reader = new Ext.data.JsonReader( {
								totalProperty : "totalProperty",
								root : "list",
								id : this.keyField
							// 关键字段
									}, record);

							this.ds = new Ext.data.GroupingStore( {
								proxy : new Ext.data.HttpProxy( {
									url : this.url
								}),
								reader : reader,
								/*
								 * sortInfo : { field : this.defaultSortField,
								 * direction : 'ASC' }, remoteSort : false, // 本地排序
								 */
								groupField : this.myGroupField,
								listeners : {
									'reload' : function() {
										alert('reload')
									}
								}
							});

							break;

						case 'array':
							reader = new Ext.data.ArrayReader( {}, record);

							this.ds = new Ext.data.GroupingStore( {
								reader : reader,
								data : this.dataObject,

								/*
								 * sortInfo : { field : this.defaultSortField,
								 * direction : 'ASC' },
								 */
								groupField : this.myGroupField
							});

							break;

						default:
							break;

						}

						// 判断是否需要分组
						if (this.needGroup) {
							this.view = new Ext.grid.GroupingView( {
								forceFit : this.autoFit,
								groupTextTpl : this.myGroupTextTpl
							})
						}

						this.store = this.ds;
						// 生成分页工具栏
						if (this.needPage) {
							var pagingToolbar = new Ext.PagingToolbar(
									{
										pageSize : this.pageSize,
										displayInfo : true,
										displayMsg : '显示第【<b><font color=red>{0}</font></b>】条至第【<b><font color=red>{1}</font></b>】条 / 共【<b><font color=red>{2}</font></b>】条记录',
										emptyMsg : '没有符合条件的记录',
										plugins : [ new TPageSizePlugin() ],
										store : this.store
									});
							this.bbar = pagingToolbar;
							this.bottomToolbar = this.bbar;
						}

						var oSearch = new Ext.form.TextField( {
							id : 'search',
							xtype : 'textfield',
							align : 'right'
						});

						var _grid = this;

						var keyField = this.keyField;
						var keyTitle = this.keyTitle;

						if (this.tbar_visible) {
							// 生成顶部工具条
							this.tbar = this.createTopBar(_grid, oSearch);
							this.topToolbar = this.tbar;
						}

						// 将filter加入grid
						// this.plugins = filters;
						var findField = this.findField;

						this.store.on('beforeload', function() {
							var scondition = "";
							var si = _grid.searchItems;
							if (si != null && si.length > 0) {// 多条件搜索
									for ( var i = 0; i < si.length > 0; i++) {
										var cmp = Ext.getCmp(si[i]);
										if (cmp != null) {
											var v = cmp.getValue();
											if (!Ext.TAppUtil.isNull(v)
													&& v != "") {
												if (!Ext.TAppUtil
														.isNull(cmp.format)) {
													v = v.format(cmp.format);
												}
												if (scondition != "") {
													scondition += " and ";
												}
												if (cmp.where == 'like') {
													v = '%' + v + '%';
												} else if (cmp.where == 'in') {
													v = '(' + v + ')';
												}
												scondition += (cmp.fieldName
														+ ' ' + cmp.where + ' '
														+ '\'' + v + '\'');
											}
										}
									}
								} else if (oSearch.getValue()) {
									//一般的单条件查询都进入此处 xuxin
								scondition = findField + " like '%"
										+ oSearch.getValue() + "%'";
							}
							//			 alert("查询条件：" + scondition);

							var para = {
								action : 'show',
								p_id : _grid.p_id,
								p_state : _grid.p_state,
								pageSize : pageSize,
								tabname : tablename,
								// fields : fields,
								condition : scondition,
								finder : scondition,
								tmpId : '',
								tmpName : ''
							};

							Ext.apply(this.baseParams, para);
						});

						this.store.on('load', function(_res) {
							_grid.loadDone(_grid, _res);
						});

						if (this.autoLoadData) {
							this.loadData();
						}
					},

					loadData : function() {
						var _grid = this;
						this.store.load( {
							params : {
								start : 0,
								limit : _grid.pageSize
							}
						});
						// 加载完毕后

					},

					reload : function() {// 重新加载数据
						this.getStore().reload();
					},

					//创建单选
					createRadioItem : function(_ds, _name) {
						var _items = new Array();
						if (_ds.getCount() > 0) {
							for ( var i = 0; i < _ds.getCount(); i++) {
								var _rec = _ds.getAt(i);
								var _r = new Ext.form.Radio( {
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

					//创建复选
					createCheckboxItem : function(_ds, _name) {
						var _items = new Array();
						if (_ds.getCount() > 0) {
							for ( var i = 0; i < _ds.getCount(); i++) {
								var _rec = _ds.getAt(i);
								var _r = new Ext.form.Checkbox( {
									boxLabel : _rec.get('text'),
									name : _name,
									inputValue : _rec.get('value')
								});
								_items.push(_r);
							}
						}
						return _items;
					},

					createBtn : function(_grid, _text, _icon, _fun) {
						var _btn = {
							text : _text,
							xtype : 'splitbutton',
							iconCls : _icon,
							minWidth : 65,
							handler : function() {
								_fun(_grid);
							}
						};
						return _btn;
					},

					query : function(_grid) {
						_grid.loadData();
					},

					createCrudBtn : function(_tbar, _grid) {
						_tbar.add(_grid.createBtn(_grid, '新增', 'table_add',
								_grid.addItem));
						_tbar.add(_grid.createBtn(_grid, '编辑', 'table_edit',
								_grid.editItem));
						_tbar.add(_grid.createBtn(_grid, '删除', 'table_delete',
								_grid.doDelete));
						_tbar.add(TSuperGrid.createRefreshButton(_grid));
					},

					createExtBtn : function(_tbar, _grid) {// 扩展按键

					},

					createTopBar : function(_grid, _searchBar) {
						var bar = new Ext.Toolbar();
						if (_grid.editable && _grid.crud_visible) {
							_grid.createCrudBtn(bar, _grid);// 建立顶部工具按钮
						}
						_grid.createExtBtn(bar, _grid);
						//
						this.searchItems = Ext.TAppUtil.createSearchBar(_grid,
								bar, 30);
						if (_grid.searchItems != null && _grid.isSearch) {
							bar.add(_grid.createBtn(_grid, '搜索', 'table_query',
									_grid.query));
						} else if (_searchBar != null && _grid.isSearch) {
							bar.add('->');
							bar.add(_grid.keyTitle);
							bar.add(_searchBar);
							bar.add(_grid.createBtn(_grid, '搜索', 'table_query',
									_grid.query));
						}
						return bar;
					},
					createForm : function(_items, _record) {// 创建表单
						var _win = this;
						var _form = new TFormPanel( {
							items : _items,
							fileUpload : true,
							labelWidth : _win.labelWidth,
							buttons : [ {
								text : '保存',
								iconCls : 'btn_ok',
								handler : function() {
									_win.doSubmitFrom(_form, _record, _items)
								}
							}, {
								text : '关闭',
								iconCls : 'btn_cancel',
								handler : function() {
									_form.window.hide();
									_form.window.destroy();
								}
							} ]
						});
						return _form;
					},
					doSubmitFrom : function(_form, record, _items) {
						if (_form.form.isValid()) {
							var _where = '';
							var myparam = "{"
							if (record != null && record != '') {// 编辑
								//_where = '&id=' + record.get(this.keyField);
								myparam += " id : '"
										+ record.get(this.keyField) + "' ,";
							} else {// 新增
							}

							// 判断record是否为空 是：新增 否：修改

							var action = record ? 'edit' : 'new';
							myparam += " action : '" + action + "' ,";
							myparam += " tabname : '" + this.tablename + "' ,";
							myparam += " fieldkey : '" + this.keyField + "' ,";
							myparam += this.user_id + " : '" + App_user_id
									+ "' ,";

							_form.form.url = this.url + '?action=' + action
									+ '&tabname=' + this.tablename
									+ '&fieldkey=' + this.keyField + '&'
									+ this.user_id + '=' + App_user_id + _where;
							if (this.p_id + '9' != '9') {// 指定了p_id
								_form.form.url += ('&p_id=' + this.p_id);
								myparam += "p_id : '" + this.p_id + "',";
							}

							var _grid = this;
							if (this.p_state + '9' != '9') {// 指定了p_id
								_form.form.url += ('&p_state=' + this.p_state);
								myparam += "p_state : '" + this.p_state + "',";
							}

							for ( var i = 0; i < _items.length; i++) {
								var _item = _items[i];
								//此处进行传参
								//								alert(_item .name+"-"+_form.form.findField(_item.name)
								//											.getValue());
								if (_item.xtype == 'checkboxgroup') {
									var vv = _form.form.findField(_item.name)
											.getValue();
									//_form.form.url += ('&' + _item.name + '=' + vv);
									myparam += _item.name + ": '" + vv + "' ,";
								}
								//_form.form.url += ('&' + _item.name + '=' + _form.form
								//.findField(_item.name).getValue());
								myparam += _item.name
										+ ": '"
										+ _form.form.findField(_item.name)
												.getValue() + "',";
							}

							myparam += " a:'b' }"
							var jsonParam = Ext.decode(myparam);
							//alert(jsonParam.action);

							/*_form.form.submit({
								waitTitle : "请稍候",
								waitMsg : "正在提交表单数据，请稍候...",
								success : function() {
									_grid.getStore().reload();
									if (action == 'edit') { 编辑状态自动关闭									_form.window.close();  关闭窗口									} else { 新增状态												_form.window.close();  关闭窗口											if (_grid.p_closed)
												_form.window.close();  关闭窗口											else
												_form.form.reset();
										}
									},
									failure : _grid.doFailure
							});*/

							Ext.Ajax.request( {
								url : this.url,
								params : jsonParam,
								method : 'POST',
								success : function() {
									_grid.getStore().reload();
									if (action == 'edit') { //编辑状态自动关闭									
									_form.window.close(); //关闭窗口									
							} else { //新增状态												
									_form.window.close(); //关闭窗口											
								if (_grid.p_closed)
									_form.window.close(); //关闭窗口											
								else
									_form.form.reset();
							}
						},
						failure : _grid.doFailure
							});
						}
					},

					showEdit : function(record, _items, editForm, _grid) {
						var win = new Ext.Window( {
							title : _grid.title,
							labelWidth : 100,
							frame : true,
							autoHeight : true,
							height : this.win_height,
							width : this.win_width,
							items : editForm
						})
						Ext.apply(editForm, {
							window : win
						});
						win.show()

						// 从服务器初始化表单数据
						if (record != null && record != '') {
							win.setTitle(win.title + '<编辑>')
							editForm.form.loadRecord(record);
							_grid.setRecord(_grid, editForm, record, _items);
						} else {
							win.setTitle(win.title + '<新增>')
						}
					},

					/** 编辑选中的数据，record为空为新增，否则为修改 */
					doEdit : function(record) {
						var _items = Ext.TAppUtil.createFormItems(
								this.tablename, this.structure,
								this.labelWidth, record, this);
						var editForm = this.createForm(_items, record);
						var _grid = this;
						if (_grid.waitUrl != '') {
							Ext.TCellUtil.request(_grid.waitUrl,
									function(json) {
										_grid.showEdit(record, _items,
												editForm, _grid);
									});
						} else {
							_grid.showEdit(record, _items, editForm, _grid);
						}

					},

					getCmp : function(_name) {
						var _id = this.tablename + '_' + _name;
						return Ext.getCmp(_id);
					},

					getCmp_box : function(_name) {
						var _id = this.tablename + '_' + _name + '_box';
						return Ext.getCmp(_id);
					},

					/** 特殊处理 */
					setRecord : function(_grid, _form, _record, _items) {
						for ( var i = 0; i < _items.length; i++) {
							var _item = _items[i];
							if (_item.xtype == 'checkboxgroup') {
								_form.form.findField(_item.name).setValue(
										_record.get(_item.hiddenName));
							}
						}
					},

					/** 删除选中的数据 */
					doDelete : function(_grid) {
						var sSelId = "";
						var tablename = _grid.tablename;
						var keyField = _grid.keyField;
						var url = _grid.url;
						var aId = new Array();
						// 从GRID对象中获得Value
						var record = _grid.getSelectionModel().getSelected();
						if (!record) {
							Ext.Msg.alert("提示", "请先选择要删除的数据!");
							return;
						} else if (!_grid.canUpdate(record)) {// 不允许编辑
							return;
						} else {

							for ( var i = 0, j = _grid.store.getCount(); i < j; i++) {
								if (_grid.getSelectionModel().isSelected(i)) {
									sSelId += "'"
											+ _grid.store.getAt(i)
													.get(keyField) + "',";
									aId[aId.length] = _grid.store.getAt(i)
								}
							}
							if (sSelId.length > 0) {
								sSelId = sSelId.substr(0, sSelId.length - 1);
							}
						}

						Ext.MessageBox
								.confirm(
										'确认删除',
										'你真的要删除所选数据吗?',
										function(btn) {
											if (btn == 'yes') {
												Ext.TAppUtil
														.showMask('正在删除数据，请稍候...');
												Ext.Ajax
														.request( {
															url : url,
															success : function() {
																Ext.TAppUtil
																		.closeMask();
																for ( var i = 0; i < aId.length; i++) {
																	_grid.store
																			.remove(aId[i]);
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
					},

					/** 初始化combo控件数据 */
					initCombo : function(o, boxid, record) {
						var url = this.url;
						var fields = o.value + ',' + o.text;
						var ds = null;
						var _grid = this;

						if (o.fobj == 'json') {
							var reader = new Ext.data.JsonReader( {
								totalProperty : 'totalProperty',
								root : 'list'
							}, [ {
								name : o.value
							}, {
								name : o.text
							} ]);

							ds = new Ext.data.Store( {
								proxy : new Ext.data.HttpProxy( {
									url : url
								}),
								reader : reader
							});

							ds.on('beforeload', function() {
								var para = {
									action : 'show',
									pagesize : '999',
									p_id : _grid.p_id,
									name : o.fobj,
									fieldName : o.name, // 字段名
									fields : fields
								};
								Ext.apply(ds.baseParams, para);
							});
							ds
									.on(
											'load',
											function() {// 设置combobox初始值
												if (record != null) {
													if ((typeof record
															.get(o.name)) == 'string') {
														Ext
																.getCmp(boxid)
																.setValue(
																		record
																				.get(o.name));
													} else {
														Ext
																.getCmp(boxid)
																.setValue(
																		parseInt(record
																				.get(o.name)));
													}
												} else {
													Ext.getCmp(boxid).setValue(
															'');
												}

											});
						} else {
							ds = new Ext.data.Store( {
								proxy : new Ext.data.MemoryProxy(o.fobj),
								reader : new Ext.data.ArrayReader( {}, [ {
									name : 'value'
								}, {
									name : 'text'
								} ]),
								autoLoad : true
							});
						}
						ds.load( {
							params : {
								start : 0,
								limit : 20
							}
						});

						return ds;

					},

					initGrp : function(o, boxid, record, _type) {
						var url = this.url;
						var fields = o.value + ',' + o.text;
						var ds = null;
						var _grid = this;

						if (o.fobj == 'json') {
							var reader = new Ext.data.JsonReader( {
								totalProperty : 'totalProperty',
								root : 'list'
							}, [ {
								name : o.value
							}, {
								name : o.text
							} ]);

							ds = new Ext.data.Store( {
								proxy : new Ext.data.HttpProxy( {
									url : url
								}),
								reader : reader
							});

							ds.on('beforeload', function() {
								var para = {
									action : 'show',
									pagesize : '999',
									p_id : _grid.p_id,
									name : o.fobj,
									fieldName : o.name, // 字段名
									fields : fields
								};
								Ext.apply(ds.baseParams, para);
							});
							ds.on('load', function() {// 设置combobox初始值
										var cmp = Ext.getCmp(boxid);
										// cmp.setVisible(false);
									/*
									 * alert(cmp.items.length); for (var i =
									 * cmp.items.length - 1; i >= 0; i--) {
									 * cmp.items.removeAt(i); } alert(cmp.items.remove +
									 * '---' + cmp.items.set);
									 */
									var _items = null;
									if (_type == 1) {
										_items = _grid.createCheckboxItem(ds,
												o.name);//1  代表复选
									} else if (_type == 2) {
										_items = _grid.createRadioItem(ds,
												o.name);//2 代表单选
									}
									Ext.apply(cmp, {
										items : _items
									});

								});
						} else {
							ds = new Ext.data.Store( {
								proxy : new Ext.data.MemoryProxy(o.fobj),
								reader : new Ext.data.ArrayReader( {}, [ {
									name : 'value'
								}, {
									name : 'text'
								} ]),
								autoLoad : true
							});
						}
						ds.load( {
							params : {
								start : 0,
								limit : 20
							}
						});

						return ds;

					},

					/*
					 * @功能：请求成功显示信息
					 */
					doSuccess : function(action, form) {

						var ogrid = this;

						Ext.Msg.alert('提示', '操作成功');
						ogrid.getStore().reload();
					},

					/*
					 * @功能：请求失败显示信息
					 */
					doFailure : function(form, action) {
						Ext.Msg.alert('请求错误', '服务器未响应，请稍后再试');
					},

					/*
					 * @功能:默认的格式化日期函数 @返回格式：2008-09-21
					 */
					formatDate : function(v) {
						return v ? v.dateFormat('Y-m-d') : ''
					},

					addItem : function(_grid) {
						_grid.doEdit();
					},

					editItem : function(_grid) {
						if (_grid.editable) {
							var record = _grid.getSelectionModel()
									.getSelected();
							if (record == null) {
								Ext.Msg.alert('提示', '请先选择你要编辑的数据');
								return;
							}
							if (_grid.canUpdate(record)) {
								_grid.doEdit(record);
							}
						}
					},

					canUpdate : function(record) {
						return true;
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
						}
					}

				});

// 创建刷新按钮
TSuperGrid.createRefreshButton = function(_grid) {
	return new Ext.Button( {
		iconCls : 'table_reload',
		text : "刷新",
		minWidth : 65,
		handler : function() {
			_grid.reload();
		},
		scope : _grid
	});
};
