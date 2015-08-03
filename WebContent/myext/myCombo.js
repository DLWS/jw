if ('function' !== typeof RegExp.escape) {
	RegExp.escape = function(s) {
		if ('string' !== typeof s) {
			return s;
		}
		// Note: if pasting from forum, precede ]/\ with backslash manually
		return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
	}; // eo function escape
}

//定义package
Ext.ns('Ext.ux.form');

Ext.ux.form.TMultiCombo = Ext.extend(Ext.form.ComboBox, {
	checkField : 'checked',
	separator : ',',
	mvalue: '',
	initComponent : function() {
		if (!this.tpl) {
			this.tpl = '<tpl for=".">' + '<div class="x-combo-list-item">'
					+ '<img src="' + Ext.BLANK_IMAGE_URL + '" '
					+ 'class="ux-multicombo-icon ux-multicombo-icon-'
					+ '{[values.' + this.checkField + '?"checked":"unchecked"'
					+ ']}">' + '<div class="ux-multicombo-item-text">{'
					+ (this.displayField || 'text') + '}</div>' + '</div>'
					+ '</tpl>';
		}

		Ext.ux.form.TMultiCombo.superclass.initComponent.apply(this, arguments);

		this.on({
			scope : this,
			beforequery : this.onBeforeQuery,
			blur : this.onRealBlur
		});

		this.onLoad = this.onLoad.createSequence(function() {
			if (this.el) {
				var v = this.el.dom.value;
				this.el.dom.value = '';
				this.el.dom.value = v;
				this.mvalue = v;
			}
		});

	},
	
	initEvents : function() {
		Ext.ux.form.TMultiCombo.superclass.initEvents.apply(this, arguments);
		this.keyNav.tab = false;

	},
	
	clearValue : function() {
		this.value = '';
		this.setRawValue(this.value);
		this.store.clearFilter();
		this.store.each(function(r) {
			r.set(this.checkField, false);
		}, this);
		if (this.hiddenField) {
			this.hiddenField.value = '';
		}
		this.applyEmptyText();
	},
	
	getCheckedDisplay : function() {
		var re = new RegExp(this.separator, "g");
		return this.getCheckedValue(this.displayField).replace(re,
				this.separator + ' ');
	},
	
	getCheckedValue : function(field) {
		field = field || this.valueField;
		var c = [];
		var snapshot = this.store.snapshot || this.store.data;

		snapshot.each(function(r) {
			if (r.get(this.checkField)) {
				c.push(r.get(field));
			}
		}, this);

		return c.join(this.separator);
	},
	
	onBeforeQuery : function(qe) {
		qe.query = qe.query.replace(new RegExp(RegExp.escape(this
				.getCheckedDisplay())
				+ '[ ' + this.separator + ']*'), '');
	},
	
	getRawValue: function(){
		return this.mvalue;//'陈云峰,刘维平';
	},
	
	getValue: function(){
		return this.mvalue;//'陈云峰,刘维平';
	},
	
	onRealBlur : function() {
		this.list.hide();
		var rv = this.getRawValue();
	//	alert('----set row value---'+rv+'--'+this.value);
		var rva = rv.split(new RegExp(RegExp.escape(this.separator) + ' *'));
		var va = [];
		var snapshot = this.store.snapshot || this.store.data;
		Ext.each(rva, function(v) {
			snapshot.each(function(r) {
				if (v === r.get(this.displayField)) {
					va.push(r.get(this.valueField));
				}
			}, this);
		}, this);
		var _v = va.join(this.separator);
	//	alert('----set value---'+_v);
		this.setValue(_v);
		//alert('---'+getValue());
		this.store.clearFilter();
	},
	onSelect : function(record, index) {
		if (this.fireEvent('beforeselect', this, record, index) !== false) {
			record.set(this.checkField, !record.get(this.checkField));
			if (this.store.isFiltered()) {
				this.doQuery(this.allQuery);
			}
			this.setValue(this.getCheckedValue());
			this.fireEvent('select', this, record, index);
		}
	},
	
	setValue : function(v) {
		if (v) {
			v = '' + v;
			this.mvalue = v;
			if (this.valueField) {
				this.store.clearFilter();
				this.store.each(function(r) {
					var checked = !(!v.match('(^|' + this.separator + ')'
									+ RegExp.escape(r.get(this.valueField))
									+ '(' + this.separator + '|$)'));

					r.set(this.checkField, checked);
				}, this);
				this.value = this.getCheckedValue();
				this.setRawValue(this.getCheckedDisplay());
				if (this.hiddenField) {
					this.hiddenField.value = this.value;
				}
			} else {
				this.value = v;
				this.setRawValue(v);
				if (this.hiddenField) {
					this.hiddenField.value = v;
				}
			}
			if (this.el) {
				this.el.removeClass(this.emptyClass);
			}
		} else {
			this.clearValue();
		}
	},
	
	getValue1: function(){
		return getCheckedDisplay();
	},
	
	selectAll : function() {
		this.store.each(function(record) {
			record.set(this.checkField, true);
		}, this);
		this.doQuery(this.allQuery);
		this.setValue(this.getCheckedValue());
	},
	
	deselectAll : function() {
		this.clearValue();
	}
}); 

//注册 xtype
Ext.reg('multicombo', Ext.ux.form.TMultiCombo);

/*
case 'multicombo' :
				// 初始化下拉列表数据
				c.value = c.value || 'value';
				c.text = c.text || 'text';
				var boxid = tablename + '_' + c.name + '_box';
				ds = _grid.initCombo(c, boxid, record);

				oField[oField.length] = {
					id : boxid,
					xtype : c.type,// 'combo',
					hiddenName : c.name,
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
				}*/