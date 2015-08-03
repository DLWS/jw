/**
 * 扩展grid designer: twz
 */
var App_user_id = '';
var App_user_name = '';
var App_user_true_name = '';
var App_user_ip = '';
var App_user_level = 0;
var App_user_level1 = 0;
var App_user_level2 = 0;
var App_user_level3 = 0;
var App_user_role_name = '';
var App_user_json = '';
var App_depart = '';
//var App_web_path = '';
var App_web_path = 'http://localhost:8080/rwpm/';

var user_id_def = '';
var user_pwd_def = '';

var skin_data = [ [ '默认风格', 'ext-all' ], [ '银白风格', 'xtheme-gray' ],
		[ '紫色风格', 'xtheme-purple' ], [ '绿色风格', 'xtheme-olive' ],
		[ '灰色风格', 'xtheme-darkgray' ], [ '黑色风格', 'xtheme-black' ],
		[ '深蓝风格', 'xtheme-slate' ], [ '靛蓝色风格', 'xtheme-indigo' ],
		[ '柔滑风格', 'xtheme-slickness' ], [ '珊瑚风格', 'xtheme-calista' ],
		[ '浅暗风格', 'xtheme-midnight' ], [ '淡绿色风格', 'xtheme-green' ],
		[ '粉红色风格', 'xtheme-pink' ] ];

/** **********TComboBox********************** */
TComboBox = Ext.extend(Ext.form.ComboBox, {
	needLoad : true,
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		TComboBox.superclass.constructor.call(this, {
			plain : true,
			autoLoad : false,
			mode : 'local',
			triggerAction : 'all',
			typeAhead : true,
			selectOnFocus : true
		});
		if (this.name != null && this.hiddenName == null) {
			this.hiddenName = this.name;
		}
		if (this.needLoad)
			this.store.load( {});
	},
	load : function(_params) {
		this.store.load(_params);
	}
});

/** *********RadioGroup扩展*********************** */
TRadioGroup = Ext.extend(Ext.form.RadioGroup, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		TRadioGroup.superclass.constructor.call(this, {
			itemCls : 'x-check-group-alt'
		});
		// Ext.apply(this, _cfg);

		if (this.items.length > 0) {// 自动为子项赋name
			// items子项中需设置inputValue值，返回值即为该inputValue
			var _name = this.name;
			for ( var i = 0; i < this.items.length; i++) {
				Ext.apply(this.items[i], {
					name : _name
				});
			}
		}
	}
});

TCheckBox = Ext.extend(Ext.form.Checkbox, {
	constructor : function(_cfg) {
		var _chk = this;
		Ext.apply(this, _cfg);
		TCheckBox.superclass.constructor.call(this, {
			inputValue : true
		});
		Ext.apply(this, _cfg);
	}
});

TCheckBoxGroup = Ext.extend(Ext.form.CheckboxGroup, {
	constructor : function(_cfg) {
		var _chk = this;
		Ext.apply(this, _cfg);
		TCheckBoxGroup.superclass.constructor.call(this, {
			getValue : function() {
				var out = [];
				this.eachItem(function(item) {
					if (item.getValue()) {
						out.push(item.getRawValue());
					}
				});
				return out;
			}
		});
		Ext.apply(this, _cfg);
	}
});

/** *********换肤类*************** */
TComboBox4Skin = Ext.extend(Ext.form.ComboBox, {
	collapseItem : function() {

	},
	expandItem : function() {

	},
	getCssFile : function(_url) {
		return Ext.TAppUtil.getCssFile(_url);
	},
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		TComboBox4Skin.superclass.constructor.call(this, {
			fieldLabel : '界面风格',
			displayField : 'title',
			valueField : 'title',
			value : '默认风格',
			readOnly : true,
			plain : true,
			width : 100,
			// autoLoad : false,
			mode : 'local',
			triggerAction : 'all',
			typeAhead : true,
			selectOnFocus : true,
			store : new Ext.data.SimpleStore( {
				fields : [ 'title', 'url' ],
				data : skin_data
			})
		});
	},
	listeners : {
		'render' : function(_c) {
			Ext.TAppUtil.changeSkin('');
		},
		'select' : function(_c, _r, _i) {
			Ext.TAppUtil.changeSkin(_r.get('url'));
		},
		'expand' : function(_c) {
			this.expandItem();
		},
		'collapse' : function(_c) {
			this.collapseItem();
		}
	}
});

/** ****************TTextField************************ */
TTextField = Ext.extend(Ext.form.TextField, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		TTextField.superclass.constructor.call(this, {
			plain : true,
			layout : 'form',
			allowBlank : false
		});
		if (!this.allowBlank) {
			var _msg = '[' + this.fieldLabel + ']不能为空！';
			Ext.apply(this, {
				blankText : _msg
			});
		}
		Ext.apply(this, _cfg);
	}
});

/** ****************用以显示图像的field************************** */
TImageField = Ext.extend(Ext.form.TextField, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		TImageField.superclass.constructor.call(this, {
			plain : true,
			disabled : true,
			hideLabel : true,
			autoCreate : {
				tag : 'input',
				type : 'image',
				src : this.url,
				autocomplete : 'off'
			}
		});
	}
});

/** ************NumberField扩展********************** */
TNumberField = Ext.extend(Ext.form.NumberField, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		TNumberField.superclass.constructor.call(this, {
			plain : true,
			layout : 'form',
			allowBlank : false
		});
		if (!this.allowBlank) {
			var _msg = '[' + this.fieldLabel + ']不能为空！';
			Ext.apply(this, {
				blankText : _msg
			});
		}
		Ext.apply(this, _cfg);
	}
});
/** ************只允许输入整数*********************** */
TIntField = Ext.extend(TNumberField, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		TIntField.superclass.constructor.call(this, {
			allowDecimals : false
		// 不允许输入小数点
				});
		Ext.apply(this, _cfg);
	}
});

/** *************TextArea扩展***************** */
TTextArea = Ext.extend(Ext.form.TextArea, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		TTextArea.superclass.constructor.call(this, {

		});
	}
});

/** ****************DateField扩展************************* */
TDateField = Ext.extend(Ext.form.DateField, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		TDateField.superclass.constructor.call(this, {
			format : 'Y年m月d日',
			width : 130,
			readOnly : false,
			value : new Date().add(Date.DAY, -1)
		});
		Ext.apply(this, _cfg);
	}
});

/** **********TimeField扩展************************** */
TTimeField = Ext.extend(Ext.form.TimeField, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		TTimeField.superclass.constructor.call(this, {
			format : 'G:i', // 格式为：12:32
			width : 100,
			increment : 1, // 间隔为1分钟
			invalidText : '时间格式无效'
		});
		Ext.apply(this, _cfg);
	}
});
/** ************FormPanel扩展************** */
TFormPanel = Ext.extend(Ext.form.FormPanel, {
	execute : function() {
	},
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		TFormPanel.superclass.constructor.call(this, {
			labelAlign : 'right',
			frame : true,
			border : false,
			hideBorders : true,
			autoHeight : true,
			keys : [ {
				key : [ 10, 13 ],
				fn : this.execute
			} ]
		});
	}
});

/** ***************Button扩展**************************** */
TButton = Ext.extend(Ext.Button, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		TButton.superclass.constructor.call(this, {});
	}
});

/** **************标志面板**************************** */
TFlagPanel = Ext.extend(Ext.Panel, {
	constructor : function(_menu, _cfg) {
		Ext.apply(this, _cfg);
		TFlagPanel.superclass.constructor.call(this, {

		});
	}
});

/** ************TDatePanel 包括开始日期和结束日期**************************** */
TDateMenuItem = Ext.extend(Ext.menu.Item, {
	constructor : function(_menu, _cfg) {
		Ext.apply(this, _cfg);
		TDateMenuItem.superclass.constructor.call(this, {

		});
		Ext.apply(this, {
			ownerCt : _menu,
			pid : _menu.pid
		});
	},
	listeners : {
		'click' : function(_i, _e) {
			TDatePanel.changeDate(this.pid, this.value);
		}
	}
});

TDateMenu = Ext.extend(Ext.menu.Menu, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		var _menu = this;
		TDateMenu.superclass.constructor.call(this, {
			items : [ new TDateMenuItem(this, {
				text : '今日',
				value : 1
			}), new TDateMenuItem(this, {
				text : '明日',
				value : 2
			}), new TDateMenuItem(this, {
				text : '昨日',
				value : 3
			}), new TDateMenuItem(this, {
				text : '本周',
				value : 4
			}), new TDateMenuItem(this, {
				text : '下周',
				value : 5
			}), new TDateMenuItem(this, {
				text : '上周',
				value : 6
			}), new TDateMenuItem(this, {
				text : '本月',
				value : 7
			}), new TDateMenuItem(this, {
				text : '上月',
				value : 9
			}), new TDateMenuItem(this, {
				text : '起始月',
				value : 8
			}) ]
		});
	}
});

TDatePanel = Ext.extend(Ext.Panel, {
	beginDate : new Date(),
	endDate : new Date(),
	check : function() {// 检查日期范围
		if (this.getBeginValue() > this.getEndValue()) {
			Ext.Msg.alert('错误!', '起始日期不能大于结束日期，请重新选择！');
			this.getBeginCmp().focus();
			return false;
		}
		return true;
	},
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		var _id = this.id;
		TDatePanel.superclass.constructor.call(this, {
			// 上级的_cfg中必须定义id
			border : false,
			bodyBorder : false,
			layout : 'column',
			items : [ Ext.TAppUtil.createPanel(new TDateField( {
				fieldLabel : '起始日期',
				id : _id + 'begin_time',
				value : this.beginDate
			}), .4, 55), Ext.TAppUtil.createPanel(new TDateField( {
				fieldLabel : '结束日期',
				id : _id + 'end_time',
				value : this.endDate
			}), .4, 55), Ext.TAppUtil.createPanel(new TButton( {
				text : '特定日期',
				menu : new TDateMenu( {
					pid : _id
				})
			}), .2, 1) ]
		});
	},
	getBeginCmp : function() {
		return Ext.getCmp(this.id + 'begin_time');
	},
	getBeginValue : function() {
		return this.getBeginCmp().getValue();
	},
	getBeginTime : function(_format) {// 取开始时间
		if (_format != null)
			return this.getBeginValue().format(_format);
		return this.getBeginValue().format(this.getBeginCmp().format);
	},
	setBeginTime : function(_ndate) {// 设定开始时间
		return this.getBeginCmp().setValue(_ndate);
	},

	getEndCmp : function() {// 取结束时间
		return Ext.getCmp(this.id + 'end_time');
	},
	getEndValue : function() {// 取结束时间
		return this.getEndCmp().getValue();
	},
	getEndTime : function(_format) {// 取结束时间
		if (_format != null)
			return this.getEndValue().format(_format);
		return this.getEndValue().format(this.getEndCmp().format);
	},
	setEndTime : function(_ndate) {// 设置结束时间
		return this.getEndCmp().setValue(_ndate);
	}
});

TDatePanel.changeDate = function(_pid, _value) {
	var _btime, _etime;
	var value = _value;
	_dp = Ext.getCmp(_pid);
	if (value == 1) {
		_btime = new Date();
		_etime = _btime;
	} else if (value == 2) {
		_btime = new Date().add(Date.DAY, 1);
		_etime = _btime;
	} else if (value == 3) {
		_btime = new Date().add(Date.DAY, -1);
		_etime = _btime;
	} else if (value == 4) {// 本周
		var week = new Date().format('N');
		_btime = new Date().add(Date.DAY, -week + 1);
		_etime = new Date().add(Date.DAY, 7 - week);
	} else if (value == 5) {// 下周
		var week = new Date().format('N');
		_btime = new Date().add(Date.DAY, -week + 1 + 7);
		_etime = new Date().add(Date.DAY, 7 - week + 7);
	} else if (value == 6) {// 上周
		var week = new Date().format('N');
		_btime = new Date().add(Date.DAY, -week + 1 - 7);
		_etime = new Date().add(Date.DAY, 7 - week - 7);
	} else if (value == 7) {// 本月
		var day = new Date().format('j');
		_btime = new Date().add(Date.DAY, -day + 1);
		days = _btime.format('t');
		_etime = new Date().add(Date.DAY, -day + days);
	} else if (value == 8) {// 起始月
		var bdate = _dp.getBeginValue();
		var day = bdate.format('j');
		_btime = bdate.add(Date.DAY, -day + 1);
		days = _btime.format('t');
		_etime = bdate.add(Date.DAY, -day + days);
	} else if (value == 9) {// 上月
		var bdate = _dp.getBeginValue();
		var day = bdate.format('j');
		_etime = bdate.add(Date.DAY, -day);// 上月的最后一天
		days = _etime.format('t');
		_btime = _etime.add(Date.DAY, -days + 1);
	}

	_dp.setBeginTime(_btime);
	_dp.setEndTime(_etime);
};
/** ******************************************************* */
TFormEditor = Ext.extend(Ext.form.FormPanel, {
	save_url : '',
	window : null,
	doError : function(form, action) {

	},
	doSave : function() {// 保存数据
		var _form = this;
		if (_form.form.isValid()) {
			_form.form.submit( {
				method : 'POST',
				waitTitle : '系统提示',
				waitMsg : '正在保存数据,请稍候...',
				url : _form.save_url,
				success : function(form, action) {// 成功
					var _grid = _form.window.grid;
					_grid.getStore().reload();
					_form.window.close();
				},
				failure : function(form, action) {
					_form.doError(form, action);
				}
			});
		}
	},
	btnOk : '保存',
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		var _form = this;
		TFormEditor.superclass.constructor.call(this, {
			frame : true,
			buttons : [ {
				text : _form.btnOk,
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
			} ]
		});
	}
});

TWindowEditor = Ext.extend(Ext.Window, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		_window = this;
		TWindowEditor.superclass.constructor.call(this, {
			layout : 'fit',
			resizable : false,
			plain : true,
			border : false,
			modal : true,
			// 必须定义form
			items : this.form
		});

		Ext.apply(_window.form, {
			window : this
		});
	}
});

/** ***************Cell面板*************************** */
TCellPanel = Ext.extend(Ext.Panel, {
	getCell : function() {// 查找cell
		var cell = document.getElementById(this.cellId);
		return cell;
	},
	ftpUrl : '',
	ftpUser : '',
	ftpPwd : '',
	waitUrl : '',
	btn1 : true,
	btn2 : true,
	btn3 : true,
	btn4 : true,
	btn5 : true,
	btn6 : true,
	cellAutoLoad : true,
	createBtns : function() {
		var _parent = this;
		var list = new Array();
		if (_parent.btn1) {
			var item = {
				text : '缩放',
				visible : _parent.btn1,
				menu : new TCellMenu( {}),
				listeners : {
					'menushow' : function(_b, _m) {
						Ext.apply(_m, {
							cellId : _parent.cellId
						});
					}
				}
			};
			list.push(item);
		}
		if (_parent.btn2) {
			var item = {
				text : '打印预览',
				visible : _parent.btn2,
				handler : function() {
					var cell = _parent.getCell();
					if (cell != null) {
						cell.PrintPreview(1, cell.GetCurSheet);
					} else {
						Ext.Msg.alert('错误！', '找到相应的cell插件->' + cell.cellId);
					}
				}
			};
			list.push(item);
		}
		if (_parent.btn3) {
			var item = {
				text : '打印',
				visible : _parent.btn3,
				handler : function() {
					var cell = _parent.getCell();
					if (cell != null)
						cell.PrintSheet(1, 2);
				}
			};
			list.push(item);
		}
		if (_parent.btn4) {
			var item = {
				text : '另存为文件',
				visible : _parent.btn4,
				handler : function() {
					var cell = _parent.getCell();
					if (cell != null)
						cell.SaveFile();
				}
			};
			list.push(item);
		}
		if (_parent.btn5) {
			var item = {
				text : '复制到剪贴板',
				visible : _parent.btn5,
				handler : function() {
					var cell = _parent.getCell();
					if (cell != null) {
						Ext.TCellUtil.copyAll(cell, 0)
					}
					;
				}
			};
			list.push(item);
		}
		if (_parent.btn6) {
			var item = {
				text : '保存文件',
				visible : _parent.btn6,
				handler : function() {
					_parent.saveFtp();
				}
			};
			list.push(item);
		}
		return list;
	},
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		var _parent = this;
		TCellPanel.superclass.constructor.call(this, {
			listeners : {
				'activate' : function(_cmp) {

				},
				'render' : function(_cmp) {
					if (_parent.waitUrl != '') {
						Ext.TCellUtil.request(_parent.waitUrl, function(json) {
							_parent.loadcell();
						});
					} else {
						_parent.loadcell();
					}
				}
			},
			buttons : [ _parent.createBtns() ]
		});
		Ext.apply(_parent.cellStore, {
			ownerCt : this
		})

	},// 构造函数完毕
	loadFile : function() {
		var cell = this.getCell();
		if (cell != null) {
			/*Ext.Msg.alert("error",this.cellFile);*/
			var flag = cell.OpenFile(this.cellFile, "");
			//alert(flag);

			Ext.TCellUtil.setStyle(cell, 0);
		} else {
			alert('cell is null ' + this.cellId);
		}
	},

	/** 从ftp中打开cell文件 */
	openFtp : function(_ftpUrl, _username, _password) {
		var cell = this.getCell();
		if (cell != null && Ext.TCellUtil.init(cell)) {
			this.ftpUrl = _ftpUrl;
			this.ftpUser = _username;
			this.ftpPwd = _password;
			return Ext.TCellUtil.openFTPFile(cell, this.ftpUrl, this.ftpUser,
					this.ftpPwd);
		}
	},

	openFtp1 : function() {
		var cell = this.getCell();
		if (cell != null && Ext.TCellUtil.init(cell)) {
			Ext.TCellUtil.setStyle(cell, 0);
			return Ext.TCellUtil.openFTPFile(cell, this.ftpUrl, this.ftpUser,
					this.ftpPwd);
		}
	},

	saveFtp : function() {
		this.saveFtp1();
	},

	/** 保存cell文件到ftp */
	saveFtp1 : function() {
		var cell = this.getCell();
		if (cell != null && Ext.TCellUtil.init(cell)) {
			var v = Ext.TCellUtil.saveFTPFile(cell, this.ftpUrl, this.ftpUser,
					this.ftpPwd);
		}
	},

	loadcell : function() {// 读入数据
		var cell = this.getCell();
		if (cell != null && Ext.TCellUtil.init(cell)) {
			this.loadFile();
			if (this.cellAutoLoad) {
				this.cellStore.load();
			}
		}
	},
	getCurrentRow : function() {// 取当前行
		var cell = this.getCell();
		if (cell != null) {
			return Ext.TCellUtil.getCurrentRow(cell);
		}
		return -1;
	},
	setCellVisible : function(_v) {// 显示或不显示cell
		Ext.TCellUtil.setVisible(this.cellId, _v);
	}
});

/** *********Cell缩放菜单******************* */
TCellMenuItem = Ext.extend(Ext.menu.Item, {
	constructor : function(_menu, _cfg) {
		Ext.apply(this, _cfg);
		TCellMenuItem.superclass.constructor.call(this, {

		});
		Ext.apply(this, {
			ownerCt : _menu
		});
	},
	listeners : {
		'click' : function(_i, _e) {
			Ext.TCellUtil.zoom(this.ownerCt.cellId, this.value);
		}
	}
});

TCellMenu = Ext.extend(Ext.menu.Menu, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		TCellMenu.superclass.constructor.call(this, {
			items : [ new TCellMenuItem(this, {
				text : '50%',
				value : .5
			}), new TCellMenuItem(this, {
				text : '75%',
				value : .75
			}), new TCellMenuItem(this, {
				text : '100%',
				value : 1
			}), new TCellMenuItem(this, {
				text : '125%',
				value : 1.25
			}), new TCellMenuItem(this, {
				text : '150%',
				value : 1.5
			}), new TCellMenuItem(this, {
				text : '200%',
				value : 2
			}) ]
		});
	}
});

/** ***************TDateUtil工具类****************************** */
Ext.TDateUtil = Ext.emptyFn;

// 取当前日期、时间
Ext.TDateUtil.now = function() {
	return new Date();
}

Ext.TGridUtil = Ext.emptyFn;
// 设置指定行的背景色
Ext.TGridUtil.setRowBackground = function(_grid, _row, _color) {
	_grid.getView().getRow(_row).style.backgroundColor = _color;
}

Ext.TGridUtil.setRowForeground = function(_grid, _row, _color) {
	_grid.getView().getRow(_row).style.foregroundColor = _color;
}

// 设置指定单元格的背景色
Ext.TGridUtil.setCellBackground = function(_grid, _row, _col, _color) {
	_grid.getView().getCell(_row, _col).style.backgroundColor = _color;
}

Ext.TGridUtil.setCellForeground = function(_grid, _row, _col, _color) {
	_grid.getView().getCell(_row, _col).style.foregroundColor = _color;
}

/** ************TAppUtil工具类***************************** */
Ext.TAppUtil = Ext.emptyFn;

Ext.TAppUtil.getDateById = function(_id, _format) {
	var _date = Ext.getCmp(_id).getValue();
	return (_format != null) ? _date.format(_format) : _date.format('Y-m-d');
}

// 指定对象是否为空
Ext.TAppUtil.isNull = function(_obj) {
	if (_obj == null || _obj == 'undefined') {
		return true;
	}
	return false;
}

// 字符串替换
Ext.TAppUtil.replaceAll = function(_value, _s1, _s2) {
	if (_value != null) {
		return _value.replace(new RegExp(_s1, 'g'), _s2);
	}
	return _value;
}

// 回车符换为br，以支持自动换行
Ext.TAppUtil.enter2br = function(_value) {
	if (_value != null) {
		return Ext.TAppUtil.replaceAll(_value, "\n", "<br>");
	}
	return _v;
}

Ext.TAppUtil.getCssFile = function(_url) {
	return './ext/resources/css/' + _url + '.css';
}

// 页面中使用activeX控件
Ext.TAppUtil.useActiveX = function() {
	Ext.useShims = true;
}

// 初始化应用环境
Ext.TAppUtil.init = function(useActiveX, skin) {
	Ext.QuickTips.init();
	if (useActiveX) {
		Ext.TAppUtil.useActiveX();
	}
	skin = (skin != null) ? skin : '';
	Ext.TAppUtil.changeSkin(skin);
}

// 取图像文件路径
Ext.TAppUtil.getImage = function(_f) {
	return './images/' + _f;
}

Ext.TAppUtil.getUrlFile = function(_f) {
	var _v = App_web_path + _f;
	return _v;
}

// 录入数据
Ext.TAppUtil.inputBox = function(_title, _prompt, handler) {
	Ext.MessageBox.prompt(_title, _prompt, function(btn, text) {
				if (btn == 'ok') {// 点击了确定按钮
					handler(text);
				}
			});
}

// 取用户信息
Ext.TAppUtil.getUser = function(value) {
	var obj = Ext.decode(App_user_json);
	if (obj.hasOwnProperty(value)) {
		if (value == 'user_code') {
			return obj.user_code;
		} else if (value == 'dep_code') {
			return obj.dep_code;
		} else if (value == 'dep_name') {
			return obj.dep_name;
		} else if (value == 'dep_type') {
			return obj.dep_type;
		}
	}
	return value;
}

Ext.TAppUtil.createPanel = function(_items, _columnWidth, _labelWidth) {
	return new Ext.Panel({
				columnWidth : _columnWidth,
				layout : 'form',
				labelWidth : _labelWidth,
				labelAlign : 'right',
				items : [_items]
			});
}
//
Ext.TAppUtil.getGroupHtml = function() {
	return '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "项" : "项"]})';
}

Ext.TAppUtil.changeSkin = function(_skin) {
	if (_skin == '') {
		// Ext.util.CSS.swapStyleSheet('theme',
		// Ext.TAppUtil.getCssFile('xtheme-olive'));
	} else {
		Ext.util.CSS.swapStyleSheet('theme', Ext.TAppUtil.getCssFile(_skin));
	}
}

// 日期处理
Ext.TAppUtil.getFirstDayOfNextWeek = function(_time) {// 取下周一
	var week = new Date().format('N');
	var _date = new Date().add(Date.DAY, -week + 1 + 7);
	if (_time != null) {
		return Date.parseDate(_date.format('Y-m-d') + ' ' + _time,
				'Y-m-d G:i:s');
	}
	return Date.parseDate(_date.format('Y-m-d'), 'Y-m-d');
}

Ext.TAppUtil.getLastDayOfNextWeek = function(_time) {// 取下周日
	var week = new Date().format('N');
	var _date = new Date().add(Date.DAY, 7 - week + 7);
	if (_time != null) {
		return Date.parseDate(_date.format('Y-m-d') + ' ' + _time,
				'Y-m-d G:i:s');
	}
	return Date.parseDate(_date.format('Y-m-d'), 'Y-m-d');
}

// 字符串转换为整数
Ext.TAppUtil.str2int = function(_v) {
	return parseInt(_v);
}

// 执行指定的URL
Ext.TAppUtil.executeUrl = function(_url) {
	Ext.TAppUtil.showMask();
	Ext.Ajax.request({
				url : _url,
				success : function(response) {
					Ext.TAppUtil.closeMask();
				},
				failure : function() {
					Ext.TAppUtil.closeMask();
				}
			});
}

// 设置combox值
Ext.TAppUtil.setComboValue = function(comp, text, value) {
	comp.lastSelectionText = text;
	if (comp.hiddenField) {
		comp.hiddenField.value = value;
	}
	Ext.form.ComboBox.superclass.setValue.call(comp, text);
	comp.value = value;
}

// 添加cookie
Ext.TAppUtil.addCookie = function(objName, objValue, objHours) {
	var str = objName + "=" + escape(objValue);
	if (objHours > 0) {// 为0时不设定过期时间，浏览器关闭时cookie自动消失
		var date = new Date();
		var ms = objHours * 3600 * 1000;
		date.setTime(date.getTime() + ms);
		str += "; expires=" + date.toGMTString();
	}
	document.cookie = str;
}

// 删除指定名称的cookie
Ext.TAppUtil.removeCookie = function(name, hours) {
	var date = new Date();
	var ms = hours * 3600 * 1000;
	date.setTime(date.getTime() - hours);
	document.cookie = name + "=a; expires=" + date.toGMTString();
}

Ext.TAppUtil.createStatusBar1 = function(_height, _prompt) {
	return new TStatusBar({
				id : 'app_statusbar',
				region : "south",
				height : _height,
				defaultText : _prompt
			});
}

Ext.TAppUtil.createStatusBar = function() {
	var _prompt = '当前用户：' + App_user_name + '  IP：' + App_user_ip;
	return Ext.TAppUtil.createStatusBar1(16, _prompt);
}

// 删除登录的cookie信息
Ext.TAppUtil.removeLoginCookie = function() {
	Ext.TAppUtil.removeCookie(user_id_def, 24);
	Ext.TAppUtil.removeCookie(user_pwd_def, 24);
}

// 创建treenode
Ext.TAppUtil.createTreeNode = function(_id, _text, _leaf) {
	return new Ext.tree.TreeNode({
				id : _id,
				text : _text,
				leaf : _leaf
			});
};

// 获取指定名称的cookie的值
Ext.TAppUtil.getCookie = function(objName) {
	var list = document.cookie.split("; ");
	for (var i = 0; i < list.length; i++) {
		var temp = list[i].split("=");
		if (temp[0] == objName)
			return unescape(temp[1]);
	}
	return "";
}

// 比较两日期
Ext.TAppUtil.dateIsValid = function(_dt1, _dt2) {
	if (_dt1 > _dt2)
		return false;
	return true;
}

// 显示进度条
Ext.TAppUtil.showMask = function(_msg) {
	Ext.MessageBox.show({
				title : '请稍候',
				msg : _msg != null ? _msg : '正在加载数据...',
				progressText : '',
				width : 300,
				wait : true,
				progress : true,
				closable : false,
				waitConfig : {
					interval : 500
				}
			});
}

// 关闭进度条
Ext.TAppUtil.closeMask = function() {
	Ext.MessageBox.hide();
}
//my_radio
Ext.TAppUtil.createRadioGroup = function(_grid, _id, c, _labelWidth, record) {
	c.value = c.value || 'value';
	c.text = c.text || 'text';
	ds = _grid.initGrp(c, _id, record, 2);
	var _items = _grid.createRadioItem(ds, c.name);

	var item = {
		id : _id,
		xtype : c.type,// 'radiogroup',
		hiddenName : c.name,
		name : c.name,
		fieldLabel : c.header,
		anchor : '90%',
		store : ds,
		items : _items,
		displayField : c.text,
		valueField : c.value,
		typeAhead : true,
		triggerAction : 'all',
		selectOnFocus : true,
		mode : 'local',
		editable : c.editable == '2' ? true : false,
		forceSelection : false,
		allowBlank : c.required ? false : true,
		labelWidth : _labelWidth,

		listeners : {
			'blur' : function() {
				if (this.displayField != this.valueField) {
					this.setValue(this.getValue());
				} else {
					// /ert(this.value);
					this.setValue(this.value);
				}
			}
		}
	}
	return item;
}

//my_combox
Ext.TAppUtil.createComboBox = function(_grid, _id, c, _labelWidth, record) {
	// 初始化下拉列表数据
	c.value = c.value || 'value';
	c.text = c.text || 'text';
	var ds = _grid.initCombo(c, _id, record);

	var item = {
		id : _id,
		xtype : c.type,// 'combo',
		hiddenName : c.name,
		// fieldName : c.name,
		// where : list[j],
		name : c.name,
		fieldLabel : c.header,
		anchor : '90%',
		store : ds,
		displayField : c.text,
		valueField : c.value,
		typeAhead : true,
		triggerAction : 'all',
		selectOnFocus : true,
		mode : 'local',
		editable : c.editable == '2' ? true : false,
		forceSelection : false,
		allowBlank : c.required ? false : true,
		labelWidth : _labelWidth,
		// width : sw,

		listeners : {
			'blur' : function() {
				if (this.displayField != this.valueField) {
					this.setValue(this.getValue());
				} else {
					// /ert(this.value);
					this.setValue(this.value);
				}
			},
			'select' : function(_combobox) {
				if (!Ext.TAppUtil.isNull(c.select)) {// 定义了select函数
					c.select(_grid, _combobox);
				}
			}
		}
	}
	return item;
}

Ext.TAppUtil.createSearchBar = function(_grid, _bar, _labelWidth) {
	if (_grid.structure != null) {// 字段定义
		var st = _grid.structure;
		var items = new Array();
		for (var i = 0; i < st.length; i++) {
			var c = st[i];
			if (!Ext.TAppUtil.isNull(c.where)) {
				var where = c.where;
				var item = null;
				var list = where.split(','); // 多条件间用,分隔
				if (list.length > 0) {
					_bar.add(c.header);
					var sw = c.sw;
					if (sw <= 0)
						sw = 20;
					for (var j = 0; j < list.length; j++) {
						var _id = _grid.tablename + '_' + c.name + "_s" + j;
						_bar.add(list[j]);
						switch (c.type) {
							case 'date' :
								item = new TDateField({
											id : _id,
											name : c.name,
											fieldName : c.name,
											where : list[j],
											fieldLabel : c.header,
											format : 'Y-m-d',
											anchor : '90%',
											allowBlank : true,
											value : null,
											width : sw
										});
								break;
							case 'combo' :
							case 'multicombo' :
								var item = Ext.TAppUtil.createComboBox(_grid,
										_id, c, _labelWidth, null);
								break;
							case 'radiogroup' :
								var item = Ext.TAppUtil.createRadioGroup(_grid,
										_id, c, _labelWidth, null);
								break;
							default :
								item = new TTextField({
											id : _id,
											fieldLabel : c.header,
											fieldName : c.name,
											where : list[j],
											inputType : c.inputType != null
													? c.inputType
													: '',
											anchor : '90%',
											allowBlank : true,
											width : sw
										});
								break;
						}
						if (item != null) {
							Ext.apply(item, {
										fieldName : c.name,
										where : list[j],
										width : sw,
										editable : true
									});
							_bar.add(item);
							items.push(_id);
						}
					}
				}

			}
		}
		if (items.length > 0)
			return items;
	}
	return null;
}

// 创建form窗体内容
Ext.TAppUtil.createFormItems = function(tablename, columns, _labelWidth,
		record, _grid) {
	var oField = new Array();
	var len = columns.length;
	var tablename = tablename;

	for (var i = 0; i < len; i++) {
		var c = columns[i];
		var type;
		var ds;
		// alert(i+'--'+c.name);
		if (c.name == '' || c.name == null || c.editable == '0') {// 未指定name的字段不显示
			continue;
		}

		c.type = c.type || 'string'; // 默认类型为string
		if (c.required == null && c.readonly == null) {// 默认为不能为空
			c.required = true;
		}

		if (Ext.TAppUtil.isNull(c.height)) {
			c.height = 22;
		}

		switch (c.type) {
			case 'string' :
				oField[oField.length] = new TTextField({
							id : tablename + '_' + c.name,
							name : c.name,
							fieldLabel : c.header,
							inputType : c.inputType != null ? c.inputType : '',
							anchor : '90%',
							allowBlank : c.required ? false : true,
							readOnly : (c.readonly == null)
									? false
									: c.readonly,
							labelWidth : _labelWidth
						});
				break;
			case 'file' :
				oField[oField.length] = {
					id : tablename + '_' + c.name,
					name : c.name,
					fieldLabel : c.header,
					xtype : 'fileuploadfield',
					inputType : c.inputType != null ? c.inputType : '',
					anchor : '90%',
					allowBlank : c.required ? false : true,
					buttonText : '浏览',
					readOnly : (c.readonly == null) ? false : c.readonly,
					labelWidth : _labelWidth
				};
				break;
			case 'memo' :
				oField[oField.length] = new TTextArea({
							id : tablename + '_' + c.name,
							name : c.name,
							height : c.height,
							fieldLabel : c.header,
							inputType : c.inputType != null ? c.inputType : '',
							anchor : '90%',
							allowBlank : c.required ? false : true,
							readOnly : (c.readonly == null)
									? false
									: c.readonly,
							labelWidth : _labelWidth
						});
				break;
			case 'number' :// 浮点型
				oField[oField.length] = new TNumberField({
							id : tablename + '_' + c.name,
							name : c.name,
							fieldLabel : c.header,
							anchor : '90%',
							allowBlank : c.required ? false : true,
							labelWidth : _labelWidth
						});
				break;
			case 'int' :// 整数
				oField[oField.length] = new TIntField({
							id : tablename + '_' + c.name,
							name : c.name,
							fieldLabel : c.header,
							anchor : '90%',
							allowBlank : c.required ? false : true,
							labelWidth : _labelWidth
						});
				break;
			case 'date' :
				oField[oField.length] = new TDateField({
							id : tablename + '_' + c.name,
							name : c.name,
							fieldLabel : c.header,
							format : 'Y-m-d',
							anchor : '90%',
							allowBlank : c.required ? false : true,
							labelWidth : _labelWidth
						});
				break;
			case 'time' :
				oField[oField.length] = new TTimeField({
							id : tablename + '_' + c.name,
							name : c.name,
							fieldLabel : c.header,
							anchor : '90%',
							invalidText : '时间格式错误！正确的格式如：[12:30]',
							allowBlank : c.required ? false : true,
							labelWidth : _labelWidth
						});
				break;
			case 'checkboxgroup' :
				// 初始化下拉列表数据
				c.value = c.value || 'value';
				c.text = c.text || 'text';
				var boxid = tablename + '_' + c.name + '_checkboxgrp';
				ds = _grid.initGrp(c, boxid, record, 1);
				var _items = _grid.createCheckboxItem(ds, c.name);
				oField[oField.length] = {
					id : boxid,
					xtype : c.type,// 'checkboxgroup',
					hiddenName : c.name,
					name : c.name + '_chkgrp',
					fieldLabel : c.header,
					anchor : '90%',
					store : ds,
					items : _items,
					displayField : c.text,
					valueField : c.value,
					typeAhead : true,
					triggerAction : 'all',
					selectOnFocus : true,
					mode : 'local',
					editable : c.editable == '2' ? true : false,
					forceSelection : false,
					allowBlank : c.required ? false : true,
					labelWidth : _labelWidth,
					getValue : function() {
						var v = [];
						this.items.each(function(item) {
									if (item.getValue()) {
										v.push(item.getRawValue());
									}
								});
						return v;
					},
					setValue : function(vals) {
						if (vals != null && vals != '') {
							var a = String(vals).split(',');
							this.items.each(function(item) {
										item.setValue(false); // reset value
										for (var i = 0; i < a.length; i++) {
											var val = a[i];
											if (val == item.getRawValue()) {
												item.setValue(true);
											}
										};
									});
						}
					},

					listeners : {
						'blur' : function() {
							if (this.displayField != this.valueField) {
								this.setValue(this.getValue());
							} else {
								// /ert(this.value);
								this.setValue(this.value);
							}
						}
					}
				}

				break;
			case 'checkbox' :
				oField[oField.length] = new TCheckBox({
							id : tablename + '_' + c.name,
							name : c.name,
							fieldLabel : c.header,
							anchor : '90%',
							invalidText : '',
							boxLabel : c.header,
							allowBlank : c.required ? false : true,
							labelWidth : _labelWidth
						});
				break;
			case 'combo' ://combox 另写了
			case 'multicombo' :
				var _id = tablename + '_' + c.name + '_box';
				oField[oField.length] = Ext.TAppUtil.createComboBox(_grid, _id,
						c, _labelWidth, record);
				break;
			case 'radiogroup' :
				// 初始化下拉列表数据
				var _id = tablename + '_' + c.name + '_radiogrp';
				oField[oField.length] = Ext.TAppUtil.createRadioGroup(_grid,
						_id, c, _labelWidth, record);
				break;
			case 'combotree' :
				// 初始化下拉列表数据
				c.value = c.value || 'value';
				c.text = c.text || 'text';
				var boxid = tablename + '_' + c.name + '_box';
				// ds = _grid.initCombo(c, boxid, record);
				var _selType = (c.selType != null && c.selType > 0)
						? c.selType
						: 1;
				var _selModel = (_selType == 1)
						? new Ext.tree.DefaultSelectionModel()
						: new Ext.tree.MultiSelectionModel();
				// var _tree = new Ext.ux.tree.CheckTreePanel({
				var _treecfg = {
					border : false,
					autoScroll : true,
					animate : true,
					autoWidth : true,
					autoHeight : true,
					rootVisible : false,
					selType : _selType,
					selModel : _selModel,
					root : new Ext.tree.TreeNode({
								id : 'root',
								text : 'root'
							}),
					loader : new Ext.tree.TreeLoader({
								dataUrl : _grid.url,
								baseParams : {
									action : 'show',
									name : 'json',
									p_id : _grid.p_id,
									fieldName : c.name
								}
							}),
					listeners : {
						'click' : function(_node) {
							var _combobox = this.combobox;
							if (_selType == 1) {// 单选
								Ext.TAppUtil.setComboValue(_combobox,
										_node.text, _node.id);
								// _combobox.setValue(_node.id);// 设置option值
								_combobox.collapse();// 隐藏option列表
							} else {// 多选
								Ext.TAppUtil.setComboValue(_combobox, this
												.getText(), this.getValue());
								// _combobox.setValue(this.getValue());
							}
						}
					}
				};
				if (_selType == 1) {
					var _tree = new Ext.tree.TreePanel(_treecfg);
				} else {
					var _tree = new Ext.tree.TCheckTreePanel(_treecfg);
				}
				_tree.getLoader().load(_tree.root);

				oField[oField.length] = {
					id : boxid,
					xtype : 'combo',
					hiddenName : c.name,
					name : c.name,
					fieldLabel : c.header,
					anchor : '90%',
					// store : ds,
					store : new Ext.data.SimpleStore({
								fields : [],
								data : [[]]
							}),
					displayField : c.text,
					valueField : c.value,
					typeAhead : true,
					triggerAction : 'all',
					selectOnFocus : true,
					mode : 'local',
					editable : false,
					allowBlank : c.required ? false : true,
					labelWidth : _labelWidth,
					tree_id : c.tree_id,
					tpl : '<div id="' + c.tree_id
							+ '" style="height:100px"></div>',
					listeners : {
						'expand' : function() {
							_tree.combobox = this;
							_tree.render(this.tree_id);
							if (_selType != 1) {
								_tree.setValue(this.getValue());
							}
							_tree.expandAll();// 自动展开树
						}
					}
				}

				break;
			case 'label' :
				oField[oField.length] = {
					xtype : 'textfield',
					disabled : true,
					id : tablename + '_' + c.name,
					name : c.name,
					fieldLabel : c.header,
					labelWidth : _labelWidth,
					anchor : '90%',
					value : '系统将自动生成'
				}
				break;
			default : // 其它未识别的
				if (!Ext.TAppUtil.isNull(c.create)) {// 如果定义了create函数
					var _id = tablename + '_' + c.name;
					var cmp = c.create(tablename, _id, c);
					Ext.apply(cmp, {
								name : c.name,
								fieldLabel : c.header,
								labelWidth : _labelWidth,
								anchor : '90%'
							});
					oField[oField.length] = cmp;
				}
		}
	}
	return oField;
};

/** ********Cell工具类********************************************* */
Ext.TCellUtil = Ext.emptyFn;
Ext.TCellUtil.request = function(_url, fn) {
	var conn = new Ext.data.Connection();
	conn.request({
				url : _url,
				callback : function(options, success, response) {
					var _v = response.responseText.trim();
					var json = new Ext.util.JSON.decode(_v);
					fn(json);
				}
			});
}

// 生成cell串
Ext.TCellUtil.getHtml = function(_id, _cellUrl) {
	var _frame = '<iframe   src=\"about:blank\"   style=\"z-index:   100;   filter:   alpha(opacity=0);   left:   0px;   width:   100%;   position:   absolute;   top:   0px;   height:   650px;   background-color:transparent\"></iframe> ';
	var _html = "<OBJECT classid=clsid:3F166327-8030-4881-8BD2-EA25350E574A  id="
			+ _id
			+ " width=100% height=100% style=\"z-index:1000; LEFT: 0px; top: 0px; POSITION: relative;\" CODEBASE=\""
			+ _cellUrl
			+ "#Version=1,0,3,0\">	<param name=\"wmode\" value=\"transparent\"> <PARAM NAME=\"_Version\" VALUE=\"65536\">	<PARAM NAME=\"_ExtentX\" VALUE=\"25770\">	<PARAM NAME=\"_ExtentY\" VALUE=\"14800\"> <PARAM NAME=\"_StockProps\" VALUE=\"0\"> </OBJECT>";
	return _html;
}

// 是否显示cell
Ext.TCellUtil.setVisible = function(_id, _visible) {
	var cell = document.getElementById(_id);
	if (cell != null) {
		if (_visible) {
			cell.style.visibility = "visible";
		} else {
			cell.style.visibility = "hidden";
		}
	}
};

// 缩放cell
Ext.TCellUtil.zoom = function(_id, _v) {
	var cell = document.getElementById(_id);
	if (cell != null) {
		cell.SetScreenScale(0, _v);
	}
}

Ext.TCellUtil.setTop = function(_id, _value) {
	var cell = document.getElementById(_id);
	if (cell != null) {
		cell.style.top = _value;
	}
}

Ext.TCellUtil.setHeight = function(_id, _value) {
	var cell = document.getElementById(_id);
	if (cell != null) {
		cell.style.height = _value;
	}
}

// 初始化
Ext.TCellUtil.init = function(cell) {
/*	if (cell == null
			|| cell.Login("运输生产信息平台", "", "13040352", "1460-1706-0167-6005") == 0) {
		Ext.Msg.alert('注册失败！', '注册CELL插件失败！');
		return false;
	}*/
	
	if (cell == null) {
		Ext.Msg.alert('注册失败！', '注册CELL插件失败！');
		return false;
	}
	return true;
}

// 设置样式
Ext.TCellUtil.setStyle = function(cell, sheet) {
	cell.Readonly = true;
	cell.SetCurSheet(sheet); // 当前表页为sheet号
	// cell.ShowTopLabel(0, sheet); // 设置是否显示列标
	cell.ShowSideLabel(0, sheet); // 设置是否显示行标
	cell.ShowHScroll(1, sheet); // 设置是否显示水平滚动条
	cell.ShowVScroll(1, sheet); // 设置是否显示垂直滚动条
	cell.ShowSheetLabel(0, sheet); // 设置是否显示页签
	cell.SetSelectMode(sheet, 2);
	
}

// 在指定行后插入count行
Ext.TCellUtil.insertRows = function(cell, startRow, count, sheet) {
	cell.InsertRow(startRow, count, sheet);
}

// 在指定行后添加一行
Ext.TCellUtil.insertRow = function(cell, startRow, sheet) {
	Ext.TCellUtil.insertRows(cell, startRow, 1, sheet);
}

// 在最后一行添加一行
Ext.TCellUtil.appendRow = function(cell, sheet) {
	Ext.TCellUtil.insertRow(cell, cell.GetRows(0), sheet);
}

// 删除多行
Ext.TCellUtil.deleteRows = function(cell, startRow, count, sheet) {
	cell.DeleteRow(startRow, count, sheet);
}

Ext.TCellUtil.MergeCells = function(cell, sr, sc, er, ec) {
	cell.MergeCells(sc, sr, ec, er);
}
// 删除指定行
Ext.TCellUtil.deleteRow = function(cell, row, sheet) {
	Ext.TCellUtil.deleteRows(cell, row, 1, sheet);
}

// 设置不滚动行
Ext.TCellUtil.setFixedRow = function(cell, startRow, endRow) {
	cell.SetFixedRow(startRow, endRow);
}

// 选定指定行
Ext.TCellUtil.selectRow = function(cell, row) {
	cell.MoveToCell(1, row);
}

// 复制
Ext.TCellUtil.copyAll = function(cell, sheet) {
	cell.CopyRange(1, 1, cell.getCols(sheet), cell.getRows(sheet));
}

Ext.TCellUtil.openFTPFile = function(cell, fileurl, user, pwd) {
	return cell.ImportFTPFile(fileurl, 21, user, pwd);
}

Ext.TCellUtil.saveFTPFile = function(cell, fileurl, user, pwd) {
	return cell.ExportFTPFile(fileurl, 21, user, pwd);
}

// 设置某单元格的内容
Ext.TCellUtil.setText = function(cell, col, row, sheet, text) {
	cell.SetCellString(col, row, sheet, text);
}

// 取cell单元格内容
Ext.TCellUtil.getText = function(cell, col, row, sheet) {
	return cell.GetCellString(col, row, sheet);
}

//
Ext.TCellUtil.setCellNote = function(cell, col, row, sheet, note) {
	cell.SetCellNote(col, row, sheet, note);
}

//
Ext.TCellUtil.getCellNote = function(cell, col, row, sheet) {
	return cell.GetCellNote(col, row, sheet);
}

// 取当前选定的行
Ext.TCellUtil.getCurrentRow = function(cell) {
	return (cell != null) ? cell.GetCurrentRow() : -1;
}

// 设定指定行的背景色
Ext.TCellUtil.setRowBackColor = function(cell, row, sheet, color) {
	var colcount = cell.GetCols(sheet);
	for (var i = 1; i <= colcount; i++) {
		cell.SetCellBackColor(i, row, sheet, color);
	}
}

// 设定指定行的文字风格
Ext.TCellUtil.setRowFontStyle = function(cell, row, sheet, style) {
	var colcount = cell.GetCols(sheet);
	for (var i = 1; i <= colcount; i++) {
		cell.SetCellFontStyle(i, row, sheet, style);
	}
}

/** ************状态栏************ */
TStatusBar = Ext.extend(Ext.ux.StatusBar, {
	clock : new Ext.Toolbar.TextItem(''),
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		TStatusBar.superclass.constructor.call(this, {
					bodyStyle : 'padding:10px;',
					layout : 'form',
					items : [this.clock, {
								xtype : 'button',
								text : '安全退出',
								iconCls : 'table_delete',
								width : 30,
								handler : function() {
									if (confirm('安全退出后您之前的登录信息将被自动清除，您是否确认要安全退出本系统？')) {
										Ext.TAppUtil.removeLoginCookie();
										window.location.href = window.location.href;
									}
								}
							}]
				});
		Ext.apply(this, _cfg);
	},
	listeners : {
		'render' : function() {
			var _clock = this.clock;
			Ext.TaskMgr.start({
						run : function() {
							Ext.fly(_clock.getEl()).update(new Date()
									.format('Y-m-d H:i:s   '));
						},
						interval : 1000
					});
		}
	}
});

TWindow = Ext.extend(Ext.Window, {
			constructor : function(_cfg) {
				Ext.apply(this, _cfg);
				TWindow.superclass.constructor.call(this, {
							frame : true,
							modal : true,
							shadow : false,
							resizable : false,
							plain : false

						});
			}
		});

TLoginForm = Ext.extend(TFormPanel, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		var _form = this;
		TLoginForm.superclass.constructor.call(this, {
			id : 'main_loginform',
			labelWidth : 70,
			labelAlign : 'right',
			// frame : true,
			defaults : {
				labelWidth : 30,
				width : 160
			},
			// bodyStyle : 'padding:10px 5px 0',
			// border : false,
			defaultType : 'textfield',
			monitorValid : true,
			execute : function() {
				if (Ext.getCmp('main_userId').hasFocus) {
					Ext.getCmp('main_password').focus();
				} else if (Ext.getCmp('main_password').hasFocus) {// 登录
					Ext.getCmp('btn_login').handler();
				}
			},
			items : [new TImageField({
								// xtype : "textfield",
								id : 'login_gif',
								height : 45,
								width : 245,
								url : "./images/user_login.gif"
							}), new TTextField({
								fieldLabel : '用户帐号',
								id : 'main_userId',
								name : 'user_id',
								cls : 'user'
							}), new TTextField({
								fieldLabel : '用户密码',
								id : 'main_password',
								name : 'user_pwd',
								cls : 'key',
								inputType : 'password'
							})],
			buttonAlign : 'right',
			login_click : function() {
				var _win = this.window;
				var _form = this.getForm();
				_form.submit({
							method : 'POST',
							waitTitle : '系统提示',
							waitMsg : '正在登录,请稍候...',
							url : _win.url,
							success : function(form, action) {
								// 记录用户信息
								App_user_json = action.response.responseText
										.trim();
								App_user_id = action.result.user_id;
								App_depart = action.result.depart;
								App_user_name = action.result.user_name;
								App_user_true_name  = action.result.user_true_name;
								App_web_path = action.result.app_path;
								App_user_level = action.result.user_level;
								App_user_level1 = action.result.user_level1;
								App_user_level2 = action.result.user_level2;
								App_user_level3 = action.result.user_level3;
								App_user_role_name = action.result.user_role_name;//新增
								App_user_ip = action.result.user_ip;
								
								Ext.TAppUtil.addCookie(_win.cookie_user, _form
												.findField('user_id')
												.getValue(), 24);
								Ext.TAppUtil.addCookie(_win.cookie_pwd, _form
												.findField('user_pwd')
												.getValue(), 24);
								
								_win.close();
								_win.login();
							},
							failure : function(form, action) {
								if (_win.hidden) {
									_win.show();
								}
								if (action.failureType == 'server') {
									obj = Ext.util.JSON
											.decode(action.response.responseText);
									Ext.Msg.alert('登录失败',
											action.result.message, function() {
												form.findField('user_id')
														.focus();
											});
								} else {
									Ext.Msg.alert('警告', '用户登录验证出错 : '
													+ action.result.message);
								}
							}
						});
			},
			buttons : [{
						id : 'btn_login',
						text : '登录',
						iconCls : 'btn_login',
						formBind : true,
						handler : function() {
							if (!this.disabled) {
								_form.login_click();
							}
						}
					}, {
						text : '退出',
						handler : function() {
							Ext.Msg.confirm('退出？', '您确认要退出本系统吗？', function(_b,
											_t) {
										if (_b == 'yes') {
											window.opener = null;
											window.open('', '_self', '');
											window.close();
										}
									});
						}
					}],
			listeners : {
				'render' : function(_c) {
					var _win = this.window;
					// 读cookie信息
					var _userId = Ext.TAppUtil.getCookie(_win.cookie_user);
					var _password = Ext.TAppUtil.getCookie(_win.cookie_pwd);
					Ext.getCmp('main_userId').setValue(_userId);
					Ext.getCmp('main_password').setValue(_password);

					if (_userId != '' && _password != '') {
						this.login_click();
					}
				}
			}
		})
	}
});

/** **********登陆窗口******** */
TLoginWindow = Ext.extend(Ext.Window, {
			cookie_user : 'zx_user',
			cookie_pwd : 'zx_password',
			loginform : new TLoginForm(),
			constructor : function(_cfg) {
				Ext.apply(this, _cfg);
				user_id_def = this.cookie_user;
				user_pwd_def = this.cookie_pwd;
				TLoginWindow.superclass.constructor.call(this, {
							title : '用户登录',
							layout : 'fit',
							border : false,
							closable : false,
							resizable : false,
							plain : true,
							width : 280,
							height : 180,
							items : [this.loginform]
						});
				Ext.apply(this.loginform, {
							window : this
						});
			}
		});

/** ********导航面板*********** */
TAccordionPanel = Ext.extend(Ext.Panel, {
			constructor : function(_cfg) {
				Ext.apply(this, _cfg);
				TAccordionPanel.superclass.constructor.call(this, {
							layout : 'accordion',
							collapsible : true,
							shim : false,
							animCollapse : false,
							constrainHeader : true,
							layoutConfig : {
								animate : false
							},
							split : true
						});
			}
		});

/** **********TreePanel扩展****************** */
TTreePanel = Ext.extend(Ext.tree.TreePanel, {
			constructor : function(_cfg) {
				Ext.apply(this, _cfg);
				TTreePanel.superclass.constructor.call(this, {
							animate : true,
							enableDD : false,
							border : false,
							rootVisible : false,
							containerScroll : true
						});
			}
		});

/** ************主框架********************************** */
TMainFrame = Ext.extend(Ext.Viewport, {
			constructor : function(_cfg) {
				Ext.apply(this, _cfg);
				// 默认为border布局
				TMainFrame.superclass.constructor.call(this, {
							layout : "border"
						});
			}
		});

/** ********参数配置面板******************************** */
TConfigPanel = Ext.extend(Ext.Panel, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		var _cfgpanel = this;
		TConfigPanel.superclass.constructor.call(this, {
					tools : [{
						id : 'refresh',
						tooltip : '重新读入参数字典',
						handler : function() {
							if (Ext.Msg.confirm('请确认?',
									'您是否确定真的要重新读入参数字典?一般在更改了参数字典后需执行此操作.',
									function(_b, _t) {
										if (_b == 'yes') {
											Ext.TAppUtil
													.executeUrl(_cfgpanel.dic_url);
										}
									}))
								;
						}
					}]
				});
	}
});
