
var northPanel = new Ext.Panel({
	region : 'north',
	layout : 'border',
	height : 90,
	items : [ {
		xtype : 'panel',
		region : 'center',
		bodyStyle : 'background-image:url(' + Ext.TAppUtil.getImage('logo.jpg')
				+ ') ',
		html : '<center><font size=18><b>XXXXXX系统</b></font></center>',
		bbar : new Ext.Toolbar({
			items : [ {
				xtype : 'button',
				text : '<B>测试功能</B>',
				menu : tcjcsj_menu
			}, "-", {
				xtype : 'button',
				text : '<B>系统数据字典</B>',
				menu : dic_menu
			}, "-", {
				id : 'm_cspz',
				xtype : 'button',
				text : '<B>参数配置</B>',
				menu : cspz_menu
			}, "-", {
				xtype : 'button',
				text : '<B>系统帮助</B>'
			} ]

		})

	} ]

})

/* 主框架 */
MainFrame = Ext.extend(Ext.Viewport, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		MainFrame.superclass.constructor.call(this, {
			id : "mainframe",
			layout : "border",
			items : [
					new TStatusBar({
						id : 'app_statusbar',
						region : "south",
						height : 25,
						defaultText : '<b>当前用户姓名：[' + App_user_true_name
								+ ']</b>&nbsp;&nbsp;&nbsp;   <b>登录计算机IP地址：['
								+ App_user_ip + ']</b>'
					}), northPanel, tabpanel /* , new LeftPanel() */]
		});
	}
});