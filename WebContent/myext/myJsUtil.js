/**xuxin 返回一个form表单中输入类型的值 并封装成Object 
 *1.0
 *根据id
 * 缺点form中不能嵌套面板
 */
Ext.TAppUtil.getParams = function(_form) {
	var obj = new Object();
	for ( var i = 0; i < _form.items.length; i++) {
		var f = _form.items.items[i];
		alert(f.xtype);
		if (!f.allowBlank && ('textfield' == f.xtype || 'textarea' == f.xtype)) {
			var f_value = f.getValue();
			if ("" == f_value || null == f_value) {
				Ext.Msg.alert("提示", f.fieldLabel + "不能为空！");
				return;
			} else {
				obj[f.id] = f_value;
			}
		}
	}

	return obj;
}

/**xuxin 根据id返回表单中输入类型的值 并封装成Object 
 *2.0
 *只能根据id
 */
Ext.TAppUtil.getParams4Panel = function(_form, obj) {

	for ( var i = 0; i < _form.items.length; i++) {
		var f = _form.items.items[i];
		var xtype = f.getXType();
		/*alert(xtype);*/
		if ("panel" == xtype) {
			Ext.TAppUtil.getParams4Panel(f, obj);
		} else if ('textfield' == xtype || 'textarea' == xtype
				|| 'numberfield' == xtype || 'timefield' == xtype
				|| 'datefield' == xtype || 'combo' == xtype) {

			var value = f.getValue();

			if ('datefield' == xtype) {
				if (value instanceof Date) {
					value = new Date(value).format("Y-m-d");
				}
			} else if ('combo' == xtype) {
				if (f.tvalue != null) {
					value = f.tvalue;
				} else {
					continue;
				}
			}

			/*alert(f.getValue());*/
			if (null != f.id) {
				obj[f.id] = value;
			}

		} else {
			/*alert("其他类型" + xtype);*/
		}
	}

	return obj;
}

/**xuxin 根据name返回表单中输入类型的值 并封装成Object 
 *2.0
 *只能根据name
 */
Ext.TAppUtil.getParams4Panel_2 = function(_form, obj) {
	for ( var i = 0; i < _form.items.length; i++) {
		var f = _form.items.items[i];
		var xtype = f.getXType();
		if ("panel" == xtype) {
			Ext.TAppUtil.getParams4Panel_2(f, obj);
		} else if ('textfield' == xtype || 'textarea' == xtype
				|| 'numberfield' == xtype || 'timefield' == xtype
				|| 'datefield' == xtype || 'combo' == xtype) {
			var value = f.getValue();

			if ('datefield' == xtype) {
				if (value instanceof Date) {
					value = new Date(value).format("Y-m-d");
				}
			} else if ('combo' == xtype) {
				if (f.tvalue != null) {
					value = f.tvalue;
				} else {
					continue;
				}
			}

			if (null != f.name) {
				obj[f.name] = value;
			}
		}
	}
	return obj;
}

/**xuxin 验证表单1.0
 * 效率太低
 * @param {Object} _form
 * @return {TypeName} 
 */
Ext.TAppUtil.checkForm = function(_form) {
	for ( var i = 0; i < _form.items.length; i++) {
		var f = _form.items.items[i];
		var xtype = f.getXType();
		if ("panel" == xtype) {
			Ext.TAppUtil.checkForm(f);
		} else if ('textfield' == xtype || 'textarea' == xtype
				|| 'numberfield' == xtype || 'timefield' == xtype
				|| 'datefield' == xtype || 'combo' == xtype) {
			if (f.getActiveError().length > 1) {
				Ext.Msg.alert("提示", "<font color='blue'>" + f.fieldLabel
						+ "</font><font color='red'>[" + f.getActiveError()
						+ "]</font>");
				f.focus();
				break;
				return;
			}

		}
	}
}

/**xuxin 验证表单2.0
 * 效率稍快
 * @param {Object} _form
 * @return {TypeName} 
 */
var myFlag;
Ext.TAppUtil.checkForm_2 = function(_form, time) {
	if (1 == time) {
		myFlag = 1;
	}

	for ( var i = 0; i < _form.items.length && myFlag == 1; i++) {
		var f = _form.items.items[i];
		var xtype = f.getXType();
		if ("panel" == xtype) {
			Ext.TAppUtil.checkForm_2(f, 2);
		} else if ('textfield' == xtype || 'textarea' == xtype
				|| 'numberfield' == xtype || 'timefield' == xtype
				|| 'datefield' == xtype || 'combo' == xtype) {

			if ('numberfield' == xtype) {
				var maxLen = f.maxLength;
				var pointLen = f.decimalPrecision;
				var val = f.getValue() + "";
				var p = ".";
				if (val.length > 0 && val.indexOf(p) <= 0) {
					var intLength = val.length;
					var standLen;
					if (pointLen > 0) {
						standLen = maxLen - pointLen - 1;
					} else {
						standLen = maxLen - pointLen;
					}

					if (intLength > standLen && !f.disabled) {
						Ext.Msg.alert("提示", "<font color='blue'>["
								+ f.fieldLabel
								+ "]</font>&nbsp;&nbsp;<font color='red'>["
								+ "最多只能输入" + standLen + "位整数]</font>");
						f.focus();
						myFlag = 0;
						break;
						return;

					}

				}

			}

			if (f.getActiveError().length > 1) {
				Ext.Msg.alert("提示", "<font color='blue'>[" + f.fieldLabel
						+ "]</font>&nbsp;&nbsp;<font color='red'>["
						+ f.getActiveError() + "]</font>");
				f.focus();
				myFlag = 0;
				return;
			}

		}
	}

	return myFlag;

}

/**
 * xuxin 通过取到的Obj对象参数，区分填写和未填写空间
 * @param {Object} obj2 getParams4Panel方法获取的参数
 * @param {Object} tid 模块ID
 * @return Obj
 */
Ext.TAppUtil.getDwrObj = function(obj, tid) {
	if (Ext.TAppUtil.isNull(tid)) {
		Ext.Msg.alert("提示", "缺失模块主键ID");
		return;
	}
	var result = new Object();
	result.fields = new Object();
	result.blankFields = new Array();

	for ( var key in obj) {

		if ((null != obj[key] && "" != obj[key]) || 0 == obj[key]) {
			var str = "";
			str = key + "--" + obj[key];
			/*alert(str);*/
			result.fields[key] = obj[key];

		} else if ((null == obj[key] || "" == obj[key]) && 0 != obj[key]) {
			/*alert(key + "--" + obj[key]);*/
			result.blankFields.push(key)
		}
	}
	result.fields.ID = tid;
	return result;
}

/**
 * xuxin 返回对象所属的类型
 * @param {Object} obj
 */
Ext.TAppUtil.getObjectClass = function(obj) {
	if (obj && obj.constructor && obj.constructor.toString) {
		var arr = obj.constructor.toString().match(/function\s*(\w+)/);
		if (arr && arr.length == 2) {
			return arr[1];
		}
	}

	return undefined;

}

/** xuxin 表单的增删改查
 * @param {Object} _form 表单
 * @param {Object} _grid 表格
 * @param {Object} tDction dwr
 * @param {Object} decodeStr 封装json字符串
 * @param {Object} action CRUD标示符
 * @return {TypeName} void
 */
Ext.TAppUtil.postParams4Form = function(_form, _grid, tDction, decodeStr,
		action) {

	if ("add" == action) {
		tDction.add(decodeStr, {
			callback : function(data) {
				var result = Ext.decode(data);
				_form.window.close();
				_grid.store.load();
			},
			errorHandler : function(msg, exc) {
				Ext.MessageBox.alert("错误", "添加数据发生错误，原因:" + msg);
			}
		});
	} else if ("edit" == action) {
		tDction.update(decodeStr, {
			callback : function(data) {
				var result = Ext.decode(data);
				_form.window.close();
				_grid.store.load();
			},
			errorHandler : function(msg, exc) {
				Ext.MessageBox.alert("错误", "修改数据发生错误，原因:" + msg);
			}
		});
	} else if ("del" == action) {
		var record = _grid.getSelectionModel().getSelected();
		var delId = "";
		if (!record) {
			Ext.Msg.alert("提示", "请先选择要删除的数据!");
			return;
		} else {
			delId = record.get(_grid.keyField);
		}

		Ext.MessageBox.confirm('确认删除', '你真的要删除所选数据吗?', function(btn) {
			if (btn == 'yes') {
				Ext.TAppUtil.showMask('正在删除数据，请稍候...');
				tDction.del(delId, {
					callback : function(data) {
						var result = Ext.decode(data);
						Ext.TAppUtil.closeMask();
						_grid.store.remove(record);
						_grid.store.load();
					},
					errorHandler : function(msg, exc) {
						Ext.MessageBox.alert("错误", "修改数据发生错误，原因:" + msg);
					}
				});

			}
		});
	}
}

/**
 * 批量弹出窗口CRUD GwtzModifyService
 * @param {Object} _form 弹出window form
 * @param {Object} _grid 基础表grid
 * @param {Object} action CRUD标示符
 * @param {Object} jcbId 基础表id
 * @param {Object} tzlxId 台账类型id
 * @param {Object} wxxmtzId 维修项目台账id
 * @param {Object} dObj dwrObj
 * @param {Object} DctionName 台账表对应dction
 * @return {TypeName} 
 */
Ext.TAppUtil.postParams4Form_2 = function(_form, _grid,
		dObj,action,alertParam) {
	
	var jcbId=alertParam["jcbId"];
	var tzlxId=alertParam["tzlxId"];
	var wxxmtzId=alertParam["wxxmtzId"];
	var DctionName=	alertParam["DctionName"];
	var tzBm=alertParam["tzBm"];
	var tzId=alertParam["tzId"];
	var fushGrid=alertParam["fushGrid"];
	

	if ("add" == action) {
		GwtzModifyService.add(jcbId,tzlxId,wxxmtzId,dObj,DctionName, {
			callback : function(data) {
				var result = Ext.decode(data);
				_form.window.close();
				fushGrid.loadJsonData();
			},
			errorHandler : function(msg, exc) {
				Ext.MessageBox.alert("错误", "添加数据发生错误，原因:" + msg);
			}
		});
	} else if ("edit" == action) {
		GwtzModifyService.update(jcbId,tzlxId,wxxmtzId,tzBm,DctionName,dObj,{
			callback : function(data) {
				var result = Ext.decode(data);
				_form.window.close();
				fushGrid.loadJsonData();
			},
			errorHandler : function(msg, exc) {
				Ext.MessageBox.alert("错误", "修改数据发生错误，原因:" + msg);
			}
		});
	} else if ("del" == action) {
		var record = fushGrid.getSelectionModel().getSelected();
		if (record == null || '' == record) {
			Ext.Msg.alert('提示', '无法提取要删除的记录');
			return;
		}
		
		var tzId=record.get("ID");
		Ext.MessageBox.confirm('确认删除', '你真的要删除所选数据吗?', function(btn) {
			if (btn == 'yes') {
				Ext.TAppUtil.showMask('正在删除数据，请稍候...');
				GwtzModifyService.del(jcbId,tzId,tzBm,DctionName,tzlxId, {
					callback : function(data) {
						var result = Ext.decode(data);
						Ext.TAppUtil.closeMask();
						fushGrid.loadJsonData();
					},
					errorHandler : function(msg, exc) {
						Ext.MessageBox.alert("错误", "删除数据发生错误，原因:" + msg);
					}
				});

			}
		});
	}
}

/**
 * 动态的变grid的表头
 * @param {Object} downGrid
 * @param {Object} obj
 */
Ext.TAppUtil.getAlertStore=function(downGrid,obj){
	var structure=obj.col;
	var len = structure.length;
	var oCM = new Array(); 
	var oRecord = new Array(); 
	
	for ( var i = 0; i < len; i++) {
		var c = structure[i];

		oCM[oCM.length] = {
			header : c.header,
			dataIndex : c.name,
			hidden : c.hidden || false,
			width : !c.hidden ? c.width : 50,
			align : c.type == 'numeric' ? 'right' : 'left',
			sortable : (c.sortable != null) ? c.sortable
					: true,
			renderer : c.renderer
		};
		oRecord[oRecord.length] = {
			name : c.name,
			type : c.type == 'date' ? 'date' : 'string',
			dateFormat : 'Y-m-d'
		};
	}

	var cm = new Ext.grid.ColumnModel(oCM);
	var record = Ext.data.Record.create(oRecord);
	
	var reader = new Ext.data.JsonReader( {
		totalProperty : "totalProperty",
		root : "list",
		id : 'ID'
			}, record);

	var ds = new Ext.data.GroupingStore( {
		proxy : new Ext.data.HttpProxy( {
			url : obj.url
		}),
		reader : reader,
		groupField : '',
		listeners : {
			'reload' : function() {
				alert('reload')
			}
		}
	});
	
	downGrid.reconfigure(ds, cm);
	downGrid.store.load();
	
}

/**
 * 加载处级联菜单回显项目对应的所有子项
 * @param {Object} lj_id 路局编号
 * @param {Object} GWD_combo 工务段控件
 * @param {Object} gwdbh 工务段编号
 * @param {Object} CJ_combo 车间控件
 * @param {Object} cjbh 车间编号
 * @param {Object} BZ_combo 班组控件
 * @param {Object} XM_combo 线名控件
 * @param {Object} QZ_combo1 开始区站
 * @param {Object} QZ_combo2 结束区站
 */
Ext.TAppUtil.viewEditUI=function(lj_id,GWD_combo,gwdbh,CJ_combo,cjbh,BZ_combo,XM_combo,QZ_combo1,QZ_combo2){
	
	if(""!=lj_id && null!=GWD_combo){
		GwdDction.findByLJBH(lj_id,function(data) {
			var gwdStore = GWD_combo.store;
			var jdata =Ext.util.JSON.decode(data);
			gwdStore.loadData(jdata);
		});
		
	}
	
	if(""!=gwdbh ){
		if(null !=XM_combo){
				XLDction.findXMbyGwd(gwdbh,function(data) {
				var xbhStore = XM_combo.store;
				var jdata =	Ext.util.JSON.decode(data);
				xbhStore.loadData(jdata);
			});
		}
		
		if(null != CJ_combo){
			CjAction.findByGWD(gwdbh,function(data) {
				var cjStore=CJ_combo.store;
				var jdata = Ext.util.JSON.decode(data);
				cjStore.loadData(jdata);
			});
		}
		
	}
	
	if(""!=cjbh && null !=BZ_combo){
		BzDction.fincbyCJ(cjbh,function(data) {
			var bzStore=BZ_combo.store;
			var jdata =	Ext.util.JSON.decode(data);
			bzStore.loadData(jdata);
		});
	}
}

/**
 * 计算两个时间控件的时长
 * @param {Object} time1第一个时间控件
 * @param {Object} time2第二个时间控件
 * @param {Object} text显示时长的控件
 */
Ext.TAppUtil.calcTimeLength=function(time1,time2,text){
	if(null != time1 && null != time2 && null != text){
		var time1_text=time1.getValue();
		var time2_text=time2.getValue();
		
		if(null !=time1_text && null != time2_text){
			var min1=time1_text.split(":")[0]*60+(time1_text.split(":")[1])*1;
			var min2=time2_text.split(":")[0]*60+time2_text.split(":")[1]*1;
		}
		
		text.setValue(min2-min1);
	}
	
}
/**
 * 将界面中的部分组件设置为只读
 * 若flag=enabel禁用comsArr的组件flag=disable禁用除comsArr之外的组件
 * @param {Object} _form form面板
 * @param {Object} comsArr 禁用的组件id数据
 * @param {Object} enabel 条件1
 * @param {Object} disable 条件2
 * @param {Object} flag 标示
 * 
 */
Ext.TAppUtil.setReadOnlyComs= function(_form, comsArr,enabel,disable,flag) {
	if(flag.indexOf(enabel) >= 0){
		for(var i =0;i< comsArr.length;i++){
			var com=Ext.getCmp(comsArr[i]);
			com.disable();
		}
	}else if(flag.indexOf(disable) >= 0){
		for ( var i = 0; i < _form.items.length; i++) {
			var f = _form.items.items[i];
			var xtype = f.getXType();
			if ("panel" == xtype) {
				Ext.TAppUtil.setReadOnlyComs(f, comsArr,enabel,disable,flag);
			} else if ('textfield' == xtype || 'textarea' == xtype
					|| 'numberfield' == xtype || 'timefield' == xtype
					|| 'datefield' == xtype || 'combo' == xtype
					|| 'button' == xtype) {
					if(f.id!= null){
						var id=f.id;
						var isDis=true;
						for(var i =0;i< comsArr.length;i++){
							if(id==comsArr[i]){
								isDis=false;
								break;
							}
						}
						f.allowBlank=isDis;
						f.setDisabled(isDis);
					}else{
						f.allowBlank=true;
						f.setDisabled(true);
					}
			}
		}	
	}
	
}

/**
 * 比较时间是否超过24个小时
 * @param {Object} ddsj调度时间
 * @param {Object} cjsj车间时间
 * @param {Object} dd 调度
 * @param {Object} cj 车间
 * @param {Object} flag 登录信息
 * @return {TypeName} 
 */
Ext.TAppUtil.compareTime= function(ddsj, cjsj,dd,cj,flag) {
	var today= new Date();
	var todaySeconds=today.getFullYear()*12*30*24;
	todaySeconds+=today.getMonth()*30*24;       
	todaySeconds+=today.getDate()*24;       
	todaySeconds+=today.getHours();       
	
	if(flag.indexOf(dd) >= 0){/*调度*/
		if(ddsj==null){
			return "ok";
		}else{
			var ddsjSeconds=ddsj.getFullYear()*12*30*24;
			ddsjSeconds+=ddsj.getMonth()*30*24;       
			ddsjSeconds+=ddsj.getDate()*24;       
			ddsjSeconds+=ddsj.getHours();
			
			if(todaySeconds-ddsjSeconds > 24){
				return "调度修改已经超过24小时";
			}else{
				return "ok";
			}
		}
		
	}else if(flag.indexOf(cj) >= 0){/*车间*/
		if(cjsj==null){
			return "ok";
		}else{
			var cjsjSeconds=cjsj.getFullYear()*12*30*24;
			cjsjSeconds+=cjsj.getMonth()*30*24;       
			cjsjSeconds+=cjsj.getDate()*24;       
			cjsjSeconds+=cjsj.getHours();
			
			if(todaySeconds-cjsjSeconds > 24){
				return "车修改已经超过24小时";
			}else{
				return "ok";
			}
		}
	}else{
		return "ok";
	}
	
}

/**
 * 帮助填写施工管理单位的窗口
 * @param {Object} sbgldwComo 施工管理单位空间
 * @param {Object} SBGLDW_TEXT 原有的施工管理单位字符串
 */
Ext.TAppUtil.writeSbgldwWindow= function(sbgldwComo,SBGLDW_TEXT) {
	var my_width = 120;
	var my_height = 50;
	var my_out_width = 500;
	var my_out_hiegth = 150;

	var ljbh = "";
	var ljmc = "";
	var gwd_id = ""

	var _form = new Ext.form.FormPanel( {
		id : 'x_writeSbgldwWindow',
		region : 'center',
		layout : "form",
		labelAlign : "right",
		autoScroll : true,
		frame : true,
		buttons : [ {
			text : '确定',
			iconCls : 'btn_ok',
			handler : function() {
				_form.doSave();
			}
		}, {
			text : '关闭',
			iconCls : 'btn_cancel',
			handler : function() {
				_form.window.close();
			}
		} ],
		items : [ {
			layout : "column",
			items : [ {
				columnWidth : .5,
				layout : "form",
				items : [ {
					xtype : 'combo',
					fieldLabel : '路局',
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
							var lj_id = _combobox.getValue();
							ljbh = lj_id;
							var gwdStore = Ext.getCmp("GWDBH2").store;
							Ext.getCmp("GWDBH2").setValue("");

							GwdDction.findByLJBH(lj_id, function(data) {
								var jdata = Ext.util.JSON.decode(data);
								gwdStore.loadData(jdata);
							});
						}

					}
				} ]
			}, {
				columnWidth : .5,
				layout : "form",
				items : [ {
					id : "GWDBH2",
					xtype : 'combo',
					fieldLabel : '工务段',
					valueField : 'DWBH',
					displayField : 'DWMC',
					editable : false,
					allowBlank : false,
					width : my_width,
					store : new Ext.data.JsonStore( {
						root : 'list',
						url : ' ',
						fields : [ 'DWBH', 'DWMC' ]
					}),
					mode : 'local',
					triggerAction : 'all',
					listeners : {
						select : function(_combobox) {
							gwd_id = _combobox.getValue();
							var gwdName=_combobox.getRawValue();
							var oldComboValue = Ext.getCmp("SBGLDW_TEXT").getValue();
							if (oldComboValue.indexOf(gwdName) < 0) {
								Ext.getCmp("SBGLDW_TEXT").setValue(oldComboValue + gwdName + ";");
							}

						}

					}
				} ]
			} ]
		} ,{
			layout : "column",
			items : [ {
				columnWidth : .5,
				layout : "form",
				items : [ {
					id : "SBGLDW_TEXT",
					fieldLabel : "设备管理单位",
					value : SBGLDW_TEXT,
					xtype : 'textfield',
					width : my_width
				} ]
			}, {
				columnWidth : .5,
				layout : "form",
				items : [ {
					xtype : "button",
					fieldLabel : "清空管理单位",
					text : "清空",
					width : my_width,
					handler : function() {
						var combo = Ext.getCmp("SBGLDW_TEXT");
						combo.setValue("");
					}
				} ]
			}]
		} ],
		doError : function(form, action) {

		},
		doSave : function() {
			sbgldwComo.setValue(Ext.getCmp("SBGLDW_TEXT").getValue());
			_form.window.close();
		}
	});

	/** ************************************************************************************************************************ */
	var win = new Ext.Window( {
		height : my_out_hiegth,
		width : my_out_width,
		resizable : true,
		modal : true,
		layout : 'border',
		items : _form
	})

	Ext.apply(_form, {
		window : win
	});
	win.setTitle("<center>添加/修改设备管理单位</center>")
	win.show();

}


Ext.TAppUtil.downSGJH2CJWindow= function(sgjhids,gwd_default_id) {
	var my_width = 120;
	var my_height = 50;
	var my_out_width = 500;
	var my_out_hiegth = 150;

	var ljbh = "";
	var ljmc = "";
	var gwd_id = gwd_default_id;
	var cj_id= ""
		

	var _form = new Ext.form.FormPanel( {
		id : 'x_downSGJH2CJWindow',
		region : 'center',
		layout : "form",
		labelAlign : "right",
		autoScroll : true,
		frame : true,
		buttons : [ {
			text : '确定',
			iconCls : 'btn_ok',
			handler : function() {
				_form.doSave();
			}
		}, {
			text : '关闭',
			iconCls : 'btn_cancel',
			handler : function() {
				_form.window.close();
			}
		} ],
		items : [ {
			layout : "column",
			items : [
					{
						columnWidth : .5,
						layout : "form",
						items : [ {
							id : 'CJ2',
							fieldLabel : "车间",
							width : my_width,
							xtype : 'combo',
							valueField : 'ID',
							displayField : 'CJMC',
							editable : false,
							allowBlank : false,
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
						} ]
					}
					]
			}],
		doError : function(form, action) {

		},
		doSave : function() {
			SgtcjhDction.fpcj(sgjhids,cj_id, {
				callback : function(data) {
					_form.window.close();
				},
				errorHandler : function(msg, exc) {
					Ext.MessageBox.alert("错误", "发生错误，原因:" + msg);
				}
			});
			
			
			
			
		}
	});
	
		var cjStore = Ext
				.getCmp("CJ2").store;
		Ext.getCmp("CJ2")
				.setValue("");
		CjAction
				.findByGWD(
						gwd_id,
						function(
								data) {
							var jdata = Ext.util.JSON
									.decode(data);
							cjStore
									.loadData(jdata);
						});

	/** ************************************************************************************************************************ */
	var win = new Ext.Window( {
		height : my_out_hiegth,
		width : my_out_width,
		resizable : true,
		modal : true,
		layout : 'border',
		items : _form
	})

	Ext.apply(_form, {
		window : win
	});
	win.setTitle("<center>分配计划到车间</center>")
	win.show();

}

/**
 * 创建工具栏查询空间
 * @param {Object} _tbar 工具栏
 * @param {Object} _grid 数据grid 
 * @param {Object} queryText 查询表头
 */
Ext.TAppUtil.createQueryDateCom=function(_tbar, _grid,queryText){
	var x_StartTimeCom=new Ext.form.DateField( {
		name:'x_StartTimeCom',
		width : 100,
		xtype : 'datefield',
		format : 'Y-m-d'
	});
	
	var x_EndTimeCom=new Ext.form.DateField( {
		name:'x_EndTimeCom',
		width : 100,
		xtype : 'datefield',
		format : 'Y-m-d'
	});
	
	var queryBtn=_grid
					.createBtn(
							_grid,
							'查询',
		'table_query',
		function() {
			var StartTime=""; 
			var EndTime = "";
			StartTime= x_StartTimeCom
					.getValue();
			EndTime = x_EndTimeCom
					.getValue();

			if (null != StartTime
					&& "" != StartTime) {
				StartTime = new Date(
						StartTime)
						.format("Y-m-d");
			}
	
			if (null != EndTime
					&& "" != EndTime) {
				EndTime = new Date(
						EndTime)
						.format("Y-m-d");
			}
	
			var para = {
				StartTime : StartTime,
				EndTime : EndTime
			};
	
			var store = _grid.store;
			store.removeAll(false);
			Ext.apply(store.baseParams,
					para);
			
			store.load();
			
			StartTime=""; 
			EndTime = "";
	
		})
	
	_tbar.add("-");
	_tbar.add(queryText);
	_tbar.add(x_StartTimeCom);
	_tbar.add("至");
	_tbar.add(x_EndTimeCom);
	_tbar.add(queryBtn);
	
}

/**
 * 创建工具栏查询空间2
 * 相对1多了一个工务段的控件
 * @param {Object} _tbar 工具栏
 * @param {Object} _grid 数据grid 
 * @param {Object} queryText 查询表头
 */
Ext.TAppUtil.createQueryDateCom2=function(_tbar, _grid,queryText){
	var gwd_id="";
	
	var x_StartTimeCom=new Ext.form.DateField( {
		name:'x_StartTimeCom',
		width : 100,
		xtype : 'datefield',
		format : 'Y-m-d'
	});
	
	var x_EndTimeCom=new Ext.form.DateField( {
		name:'x_EndTimeCom',
		width : 100,
		xtype : 'datefield',
		format : 'Y-m-d'
	});
	
	var x_GWDCom=new Ext.form.ComboBox( {
		id : "x_query_GWDBH",
		fieldLabel : '工务段',
		valueField : 'DWBH',
		displayField : 'DWMC',
		editable : false,
		width : 100,
		store : new Ext.data.JsonStore( {
			root : 'list',
			url : ' ',
			fields : [ 'DWBH', 'DWMC' ]
		}),
		mode : 'local',
		triggerAction : 'all',
		listeners : {
			select : function(_combobox) {
				gwd_id = _combobox.getValue();
				this.tvalue=gwd_id;
			}

		}
	
	});
	
	var queryBtn=_grid
					.createBtn(
							_grid,
							'查询',
		'table_query',
		function() {
			var StartTime=""; 
			var EndTime = "";
			StartTime= x_StartTimeCom
					.getValue();
			EndTime = x_EndTimeCom
					.getValue();

			if (null != StartTime
					&& "" != StartTime) {
				StartTime = new Date(
						StartTime)
						.format("Y-m-d");
			}
	
			if (null != EndTime
					&& "" != EndTime) {
				EndTime = new Date(
						EndTime)
						.format("Y-m-d");
			}
	
			var para = {
				StartTime : StartTime,
				GWDBH : gwd_id,
				EndTime : EndTime
			};
	
			var store = _grid.store;
			store.removeAll(false);
			Ext.apply(store.baseParams,
					para);
			
			store.load();
			
			StartTime=""; 
			EndTime = "";
	
		});
	
	var gwdStore = Ext.getCmp("x_query_GWDBH").store;
	Ext.getCmp("x_query_GWDBH").setValue("");

	GwdDction.findByLJBH(11, function(data) {
		var jdata = Ext.util.JSON.decode(data);
		gwdStore.loadData(jdata);
	});
	
	_tbar.add("-");
	_tbar.add(queryText);
	_tbar.add(x_StartTimeCom);
	_tbar.add("至");
	_tbar.add(x_EndTimeCom);
	_tbar.add("工务段");
	_tbar.add(x_GWDCom);
	_tbar.add(queryBtn);
	
}
/**xxl修改，请勿删除*/
function bean2Str(obj){
	/*var param2="{fields:"+param1.toString()+",blankFields:[]}";
	alert(param2);
	return Ext.decode(param2);*/
	var result = new Object();
	result.fields = new Object();
	result.blankFields = new Array();

	for ( var key in obj) {

		if ((null != obj[key] && "" != obj[key]) || 0 == obj[key]) {
			var str = "";
			str = key + ":" + obj[key];
			result.fields[key] = obj[key];

		} else if ((null == obj[key] || "" == obj[key]) && 0 != obj[key]) {
			alert(key + "--" + obj[key]);
			result.blankFields.push(key)
		}
	}
	return result;
}

/**cell 增加监听事件
 * _for cell的ID
 * _event 的事件名称，包含参数
 * _fun 处理函数
 * */
Ext.TCellUtil.bundEvent=function(_for,_fun){
	var index1=_fun.toString().indexOf("{");
	var index2=_fun.toString().indexOf("}");
	var funCode=_fun.toString().substring(index1+1,index2);
	var funName=_fun.toString().substring(9,index1);
	var html="<SCRIPT LANGUAGE=\"javascript\" FOR=\""+_for+"\" EVENT=\""+funName+"\">"+funCode+"</SCRIPT>"
	/*Ext.getBody().insertHtml('beforeEnd',html);*/
//	var js={ 
//		tag:''
//	}
	var textNode = document.createTextNode('test123');
	Ext.getBody().dom.appendChild(textNode);
	alert(Ext.getBody().id);
}