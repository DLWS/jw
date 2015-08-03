/*tabPanel*/
var tabpanel;
function createTabPanel() {
	tabpanel = new Ext.TabPanel( {
		region : 'center',
		items : [],
		listeners : {
			'tabchange' : function(_tabpanel, _panel) {
			}
		},
		activeTab : 0
	});
	return tabpanel;
}

// 程序入口
Ext.onReady(function() {
	Ext.QuickTips.init();
	/*Ext.form.Field.prototype.msgTarget = 'side';*/
	Ext.TAppUtil.useActiveX();
	/*Ext.TAppUtil.changeSkin('ext-all-xtheme-green');*/
	Ext.BLANK_IMAGE_URL = "./ext/resources/images/default/s.gif";

	tabpanel = createTabPanel();

	return new MainFrame();

		var win = new TLoginWindow( {
			url : './user/login.do',
			login : function() {
				Ext.TAppUtil.removeLoginCookie();
				getUserPerMissions(); /*获取用户权限*/
				tabpanel = createTabPanel();
				CreateSysCompent(new MainFrame());

			}
		});
		win.show();
	});