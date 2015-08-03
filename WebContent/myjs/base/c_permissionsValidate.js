/*统一的生成系统界面元素函数，该函数运行时，对界面中元素所对应的用户权限进行验证*/
var permission;
function CreateSysCompent(syscompent) {
	/*通过传递来的参数，确定在生成的容器组件中是否有相关的组件权限信息*/
	/*alert(Ext.query("[class*=x-btn-text]:contains(参数配置)", false).length);
	var text = Ext.select("[class=x-menu-list]", false);
	text.each(function(cmp) {
		alert("q");
	});*/
	/*Ext.getCmp("user_jurisdiction_tree_id").hide(false);*/
	var rootid = syscompent.id;
	var parentcontainerid;
	var cmpid;
	var postype;
	var el;
	Ext.each(permission, function(per) {
		/*在已构造的组件中进行查询*/
		if (per.formid == rootid) {
			/*直接根据ID定位*/
			if (per.postiontype == 'id') {
				cmpid = per.xt;
				el = Ext.getCmp(cmpid);
				el.hide(false);
				/*el.setVisibilityMode(Ext.Element.DISPLAY);*/
			} else {
				/*通过组件的文本定位*/
				/*无父容器时*/
				postype = per.xt;
				if (per.parentcontainerid == '') {
					el = Ext.select(postype, false, rootid);

				} else {
					/*有父容器的情况下*/
					parentcontainerid = per.parentcontainerid;
					el = Ext.select(postype, false, parentcontainerid);
				}

				/*alert(postype + "===" + el2.length);*/
				el.each(function(cmp) {
					/*alert(el.text);
					alert(el.id);
					 */
					cmp.setVisibilityMode(Ext.Element.DISPLAY);
					cmp.hide(false);
				});
			}
		}
	})

	/*
	var el=Ext.select("[class*=x-btn]:contains(刷新)",false,rootid);
	
	el.each(function(cmp){		
		cmp.setVisibilityMode(Ext.Element.DISPLAY);
		cmp.hide(false);
	});	
	
	splitButton，button类型CSS选择子（"[class*=x-btn]:contains(统计)"）
	树形节点选择子："[class=x-tree-node]:contains(统计)"	
	 */
}

//获取用户权限
function getUserPerMissions() {
	//从 App_user_json中获取用户权限,放入全局变量permission中	
	var obj = Ext.decode(App_user_json);
	permission = obj.permission.list;
}