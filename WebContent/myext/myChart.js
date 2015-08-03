Ext.chart.Chart.CHART_URL = './ext/resources/charts.swf';

function createSubChart(_chart, _store, _xtype, _yfield, _color, _title) {
	var _c = {
		type : _xtype,
		id : _chart.chart_id + _xtype,
		dataField : _chart.dataField,
		xField : _chart.categoryField,
		yField : _yfield,
		categoryField : _chart.categoryField
	}
	if (_color != null) {
		Ext.apply(_c, {
					style : {
						color : _color
					}
				});
	}
	if (_title != null) {
		Ext.apply(_c, {
					displayName: _title
				});
	}
	return _c;
};

function createMChart(_chart, _store) {
	var _series = new Array();
	var _stype = _chart.stype;
	var _sfield = _chart.sfield;
	var _scolor = _chart.scolor;
	var _stitle = _chart.stitle;
	if (_chart.xtype != 'piechart' && _stype != null && _stype.length > 0
			&& _sfield != null && _sfield.length == _stype.length) {
		for (var i = 0; i < _stype.length; i++) {
			var _color = null;
			var _title = null;
			if (_scolor != null && _scolor.length > i)
				_color = _scolor[i];
			if (_stitle != null && _stitle.length > i)
				_title = _stitle[i];
			_series.push(createSubChart(_chart, _store, _stype[i], _sfield[i],
					_color, _title));
		}
	}
	return _series;
}

// 饼图
TChart = Ext.extend(Ext.Panel, {
			chart_id : '',
			categoryField : 'category1',
			dataField : 'value1',
			display : 'bottom',
			fontName : 'Tahoma',
			xField : 'category1',
			yField : 'value',
			fontSize : 13,
			padding : 5,
			xtype : 'piechart',
			url : '',
			fields : null,
			stype : null,
			sfield : null,
			scolor : null,
			stitle : null,
			series : {},
			getColor : function(_r) {
				return '';
			},
			load : function(_chart, _store, _records, _options) {
				if (_chart.xtype == 'piechart') {
					var _c = Ext.getCmp(_chart.chart_id);
					if (_c != null) {
						var _list = new Array(_records.length);
						var _valid = false;
						for (var i = 0; i < _records.length; i++) {
							var _r = _records[i];
							var _color = _chart.getColor(_r);
							if (_color != null && _color != 'null') {
								_valid = true;
								_list[i] = _color;
							}
						}
						if (_valid) {
							_c.setSeriesStyles({
										colors : _list
									});
						}
					}
				}
			},

			click : function(_rec) {

			},
			constructor : function(_cfg) {
				Ext.apply(this, _cfg);
				var _chart = this;
				var _store = new Ext.data.JsonStore({
							autoLoad : true,
							url : _chart.url,
							root : 'list',
							fields : _chart.fields,
							listeners : {
								'beforeload' : function() {
									Ext.TAppUtil.showMask();
								},
								'load' : function(_store, _records, _options) {
									_chart.load(_chart, _store, _records,
											_options);
									Ext.TAppUtil.closeMask();
								}
							}
						});
				TChart.superclass.constructor.call(this, {
							items : {
								store : _store,
								xtype : _chart.xtype,
								id : _chart.chart_id,
								dataField : _chart.dataField,
								xField : _chart.categoryField,
								yField : _chart.dataField,
								categoryField : _chart.categoryField,
								// series : _chart.series,
								series : createMChart(_chart, _store),
								listeners : {
									'itemclick' : function(o) {
										var rec = _store.getAt(o.index);
										_chart.click(rec);
									}
								},
								extraStyle : (_chart.xtype != 'piechart' && _chart.stype==null)
										? null
										: {
											legend : {
												display : _chart.display,
												padding : _chart.padding,
												font : {
													family : _chart.fontName,
													size : _chart.fontSize
												}
											}
										}

							}

						});
			}
		});
