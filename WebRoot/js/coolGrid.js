//Our coolGrid jquery plugins
//Author:Xuezi Zhang and Qiang Xu
(function($) { 
	// 
	// plugin definition 
	//
	$.fn.coolGrid = function(configuration) { 
		//debug(this);
		
		$.extend($.fn.coolGrid.options,configuration);
		
		drawTableHeader(this);
		
		//fn.coolGrid.options = options
		var pageParams = {currentPage:1,pageSize:5,totalPage:1};
		var queryParams = {mainId:"SQ20120903ADMI0002"};
		var sortParams = {sortCol:"mainId",order:"asc"};
		loadTableData(pageParams,queryParams,sortParams);
		var data = {"dataSet":[{"ID":"CG001","STATUS":"N","AUDITOR":"李峰","REAL_AUDITOR":"许强","VERIFY_DESC":"审核不合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG002","STATUS":"N","AUDITOR":"李峰","REAL_AUDITOR":"许强","VERIFY_DESC":"审核不合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG003","STATUS":"N","AUDITOR":"李峰","REAL_AUDITOR":"许强","VERIFY_DESC":"审核不合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG004","STATUS":"N","AUDITOR":"李峰","REAL_AUDITOR":"许强","VERIFY_DESC":"审核不合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG005","STATUS":"N","AUDITOR":"李峰","REAL_AUDITOR":"许强","VERIFY_DESC":"审核不合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG006","STATUS":"Y","AUDITOR":"马建山","REAL_AUDITOR":"许强","VERIFY_DESC":"审核合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG007","STATUS":"Y","AUDITOR":"马建山","REAL_AUDITOR":"许强","VERIFY_DESC":"审核合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG008","STATUS":"Y","AUDITOR":"马建山","REAL_AUDITOR":"许强","VERIFY_DESC":"审核合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG009","STATUS":"Y","AUDITOR":"马建山","REAL_AUDITOR":"许强","VERIFY_DESC":"审核合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"}],pageParams:{"currentPage":"1","totalPage":"2"}};
		
		addData2Table(data, this);
	};
	
	
	
	function debug($obj) { 
		if (window.console && window.console.log) 
		window.console.log('coolGrid selection count: ' + $obj.size()); 
	};

	function drawTableHeader($obj){
		//最简单的table
		var colModel = $.fn.coolGrid.options.colModel;
		if (colModel.length == 1){
			
			$obj.addClass("tabline");
			$obj.attr("border",0);
			$obj.attr("cellspacing",1);
			$obj.attr("cellpadding",0);
			$obj.css("text-align","center");
			$obj.attr("width",$.fn.coolGrid.options.width);
			$obj.append("<tr></tr>");
			var $tr = $obj.find("tr :last");
			
			var colData = colModel[0].data;
			for (var i = 0; i < colData.length; i++){
				$tr.append("<td class='tabtitletd' width='" + colData[i].width
						+ "'>" + colData[i].display + "</td>");
			}
		}
		else if (colModel.length > 1){
			$obj.attr("border",0);
			$obj.attr("cellspacing",0);
			$obj.attr("cellpadding",0);
			$obj.css("text-align","center");
			$obj.attr("width",$.fn.coolGrid.options.width);
			$obj.append("<tr></tr>");
			var $tr = $obj.find("tr :last");
			
			var subTableCount = colModel.length;
			
			//添加子table
			for (var i = 0; i < subTableCount; i++){
				$tr.append("<td valign='top' width='" + colModel[i].width +"'></td>");
				var $td = $tr.find("td :last");
				if (colModel[i].xscrollable == true){
					var colData = colModel[i].data;
					
					var tableWidth = 0;//计算子table的宽度
					for (var j = 0; j < colData.length; j++){
						tableWidth += colData[j].width;
					}
					$td.append("<div style='overflow-x:auto;width:" + colModel[i].width + "'></div>");
					$td.find("div").append("<table id='subTable" + i + "' width=" + tableWidth +
							" border='0'  cellspacing='1' cellpadding='2' class='tabline' align='center' style='text-align: center;'></table>");
					$td.find("#subTable" + i).append("<tr></tr>");
					$subTR = $td.find("#subTable" + i).find("tr");
					for (var j = 0; j < colData.length; j++){
						$subTR.append("<td class='tabtitletd' width='" + colData[j].width
								+ "'>" + colData[j].display + "</td>");
					}
				}
				else{
					var colData = colModel[i].data;
					
					$td.append("<table id='subTable" + i 
							+"' border='0'  cellspacing='1' cellpadding='2' class='tabline' align='center' style='text-align: center;'></table>");
					$td.find("#subTable" + i).append("<tr></tr>");
					$subTR = $td.find("#subTable" + i).find("tr");
					for (var j = 0; j < colData.length; j++){
						$subTR.append("<td class='tabtitletd' width='" + colData[j].width
								+ "'>" + colData[j].display + "</td>");
					}
				}
			}
		}
	}
	
	function addData2Table(data, $obj)
	{
		var subTableCount = $.fn.coolGrid.options.colModel.length;
		var colModel = $.fn.coolGrid.options.colModel;
		var i = 0;
		for (var key in data)
		{
			if (key == "dataSet")
			{
				for (var m = 0; m < data.dataSet.length; m++)
			    {
					if (subTableCount == 1){
						//如果是简单表
						if (i % 2 == 0){
							$obj.append("<tr class='tabtd1'></tr>");
						}
						else{
							$obj.append("<tr class='tabtd2'></tr>");
						}
						var table = colModel[0];
			    		for (var k = 0; k < table.data.length; k++){
			    			$tr = $obj.find("tr :last");
			    			$tr.append("<td></td>");
			    			$td = $tr.find("td :last");
			    			if (table.data[k].key != undefined)
			    				$td.attr("key",table.data[k].name);
			    			var types = table.data[k].type.split("|");
			    			var colName = table.data[k].name;
			    			for (var n = 0; n < types.length; n++){
			    				switch(types[n]){
			    				case "data": ;$td.append(data.dataSet[m][colName]);break;
			    				case "insert": $td.append("<a href='javascript:insert(this)'><img src='images/add.gif' border='0' alt='添加记录'></a>");break;
			    				case "delete": $td.append("<a href='javascript:delete(this)'><img src='images/delete.gif' border='0' alt='删除记录'></a>");break;
			    				case "update": $td.append("<a href='javascript:update(this)'><img src='images/update.gif' border='0' alt='删除记录'></a>");break;
			    				}
			    			}
			    		}
					}
					else{
						//如果是复杂表
				    	if (i % 2 == 0)
				    	{
				    		for (var j = 0; j < subTableCount; j++){
				    			$("#subTable" + j).append("<tr class='tabtd1'></tr>");
				    		}
				    	}
				    	else
				    	{
				    		for (var j = 0; j < subTableCount; j++){
				    			$("#subTable" + j).append("<tr class='tabtd2'></tr>");
				    		}
				    	}
				    	
				    	for (var j = 0; j < subTableCount; j++){
				    		var subTable = colModel[j];
				    		for (var k = 0; k < subTable.data.length; k++){
				    			$("#subTable" + j + " tr :last").append("<td></td>");
				    			$td = $("#subTable" + j + " tr :last td :last");
				    			if (subTable.data[k].key != undefined)
				    				$td.attr("key",subTable.data[k].name);
				    			var types = subTable.data[k].type.split("|");
				    			var colName = subTable.data[k].name;
				    			for (var n = 0; n < types.length; n++){
				    				switch(types[n]){
				    				case "data": ;$td.append(data.dataSet[m][colName]);break;
				    				case "insert": $td.append("<a href='javascript:insert(this)'><img src='images/add.gif' border='0' alt='添加记录'></a>");break;
				    				case "delete": $td.append("<a href='javascript:delete(this)'><img src='images/delete.gif' border='0' alt='删除记录'></a>");break;
				    				case "update": $td.append("<a href='javascript:update(this)'><img src='images/update.gif' border='0' alt='删除记录'></a>");break;
				    				}
				    			}
				    		}
				    	}
					}
					i++;
			    }
			}
		}
		
		if ($.fn.coolGrid.options.insertable != undefined){
			if (subTableCount == 1){
				//如果是简单表
				$obj.append("<tr></tr>");
			}
			else{
				//如果是复杂表
			}
		}
	}
	
	$.fn.coolGrid.options = { }; 
	function loadTableData(pageParams, queryParams, sortParams){
		//var url = options.url;
		alert("in");
		var url = "./GridHandlerServlet";
		alert("before");
		var dataTable = options.databaseTableName;
		alert(dataTable);
		var params = {opParam:"view",dataTable:dataTable,queryParams:queryParams,pageParams:pageParams,sortParams:sortParams};
		
		$.ajax({
			url:url,//发送请求地址
			data:$.toJSON(params),
			type:'post',//请求方式
			dataType:'json',
			contentType: 'application/json;charset=utf-8',
			success:function(data){
				console.log(data);
				//addData2Table(data);
			},
			error: function(xhr) {alert(url + " handler got fucked up!");}
		});
	}
	
	function test(){
		alert("test");
	}
	
	function thisDelete(queryParams){
		var url = options.url;		
		var dataTable = options.databaseTableName;		
		var params = {opParam:"delete",dataTable:dataTable,queryParams:queryParams};
		
		$.ajax({
			url:url,//发送请求地址
			data:$.toJSON(params),
			type:'post',//请求方式
			dataType:'json',
			contentType: 'application/json;charset=utf-8',
			success:function(){
				loadTableData();
			},
			error: function(xhr) {alert(url + " handler got fucked up!");}
		});
	}
	
	function insertNew(){
		
	}
	
	function editThis(){
		
	}
	$.fn.coolGrid.options = {};
})(jQuery);