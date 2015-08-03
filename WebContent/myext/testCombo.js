MainFrame = Ext.extend(Ext.Viewport, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		var _name = 'test';
		var reader = new Ext.data.JsonReader( {
			totalProperty : 'totalProperty',
			root : 'list'
		}, [ {
			name : "value"
		}, {
			name : "text"
		} ]);

		var ds = new Ext.data.Store( {
			proxy : new Ext.data.HttpProxy( {
				url : "./jsp/test.jsp"
			}),
			reader : reader
		});
		ds.load();

		MainFrame.superclass.constructor.call(this, {
			layout : "border",
			items : [ {
				text : 'fdaf',
				xtype : 'textarea',
				region : 'west',
				width : 700,
				height : 100
			},//new Ext.ux.form.TMultiCombo(
					{
						id : 'boxid',
						xtype : 'multicombo',
						hiddenName : _name,
						name : _name,
						fieldLabel : "test",
						//	anchor : '90%',
						store : ds,
						region : 'center',
						displayField : "text",
						valueField : "value",
						//	typeAhead : true,
						//	triggerAction : 'all',
						//	selectOnFocus : true,
						mode : 'local',
						editable : true,
						//	forceSelection : false,
						allowBlank : true,
						//	labelWidth : 40,

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
			//	)
			]
		})

	}
})

Ext.onReady(function() {
	Ext.QuickTips.init();
	// Ext.form.Field.prototype.msgTarget='side';//验证

		// Ext.TAppUtil.changeSkin('');
		//	Ext.BLANK_IMAGE_URL = "./ext/resources/images/default/s.gif";

		new MainFrame();

	});
