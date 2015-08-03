TChartPanel = Ext.extend(Ext.Panel, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		TChartPanel.superclass.constructor.call(this, {
			iconCls : 'chart',
			frame: true,
			layout: 'fit'
		});
	}
});

/*
new Ext.Panel({
	
	title : 'ExtJS.com Visits and Pageviews, 2007/2008 (Full styling)',
	
	//renderTo : 'container',
	width : 500,
	height : 300,
	

	items : {
		xtype : 'columnchart',
		store : store,
		url : '../../resources/charts.swf',
		xField : 'name',
		yAxis : new Ext.chart.NumericAxis({
			displayName : 'Visits',
			labelRenderer : Ext.util.Format.numberRenderer('0,0')
		}),
		tipRenderer : function(chart, record, index, series) {
			if (series.yField == 'visits') {
				return Ext.util.Format.number(record.data.visits, '0,0')
						+ ' visits in ' + record.data.name;
			} else {
				return Ext.util.Format.number(record.data.views, '0,0')
						+ ' page views in ' + record.data.name;
			}
		},
		chartStyle : {
			padding : 10,
			animationEnabled : true,
			font : {
				name : 'Tahoma',
				color : 0x444444,
				size : 11
			},
			dataTip : {
				padding : 5,
				border : {
					color : 0x99bbe8,
					size : 1
				},
				background : {
					color : 0xDAE7F6,
					alpha : .9
				},
				font : {
					name : 'Tahoma',
					color : 0x15428B,
					size : 10,
					bold : true
				}
			},
			xAxis : {
				color : 0x69aBc8,
				majorTicks : {
					color : 0x69aBc8,
					length : 4
				},
				minorTicks : {
					color : 0x69aBc8,
					length : 2
				},
				majorGridLines : {
					size : 1,
					color : 0xeeeeee
				}
			},
			yAxis : {
				color : 0x69aBc8,
				majorTicks : {
					color : 0x69aBc8,
					length : 4
				},
				minorTicks : {
					color : 0x69aBc8,
					length : 2
				},
				majorGridLines : {
					size : 1,
					color : 0xdfe8f6
				}
			}
		},
		series : [{
			type : 'column',
			displayName : 'Page Views',
			yField : 'views',
			style : {
				image : 'bar.gif',
				mode : 'stretch',
				color : 0x99BBE8
			}
		}, {
			type : 'line',
			displayName : 'Visits',
			yField : 'visits',
			style : {
				color : 0x15428B
			}
		}]
	}
});*/