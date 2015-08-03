var tcjcsj_menu = new Ext.menu.Menu({
	id : 'tcjcsj_menu',
	items : [ {
		id : "tcjcsj_menu_1",
		text : '测试功能1',
		handler : function() {
			var grid = com.integration.connect.getConnectGrid();
			tabpanel.add(grid);
			tabpanel.setActiveTab(grid);
		},
		icon : Ext.TAppUtil.getImage('table.gif')
	}, {
		id : "tcjcsj_menu_2",
		text : '测试功能2',
		handler : function() {
			var grid = com.integration.driver.getDriverGrid();
			tabpanel.add(grid);
			tabpanel.setActiveTab(grid);
		},
		icon : Ext.TAppUtil.getImage('table.gif')
	} ]
});

var cspz_menu = new Ext.menu.Menu({
	id : 'cspz_menu',
	items : [ {
		id : "user_manager_id",
		text : '用户管理',
		handler : function() {
			CreateSysCompent(createUserPanel(tabpanel));
		},
		icon : Ext.TAppUtil.getImage('table.gif')
	}, {
		id : "user_role_tree_id",
		text : '角色管理',
		handler : function() {
			CreateSysCompent(changeAddBtn_RolePanel(tabpanel));
		},
		icon : Ext.TAppUtil.getImage('table.gif')
	}, {
		id : "user_jurisdiction_tree_id",
		text : '权限管理',
		handler : function() {
			createUser_JuriPanel(tabpanel);
			CreateSysCompent(changeAddBtn_JuriPanel(tabpanel));
		},
		icon : Ext.TAppUtil.getImage('table.gif')
	} ]
});

var dic_menu = new Ext.menu.Menu({
	id : 'dic_menu',
	items : [ {
		id : "createSgjdbzPanel_id",
		text : '施工进度标准',
		handler : function() {
			CreateSysCompent(x_createSgjdbzPanel(tabpanel));
		},
		icon : Ext.TAppUtil.getImage('table.gif')
	} ]
});