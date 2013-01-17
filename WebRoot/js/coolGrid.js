//Our coolGrid jquery plugins
//Author:Xuezi Zhang and Qiang Xu

(function($) { 
	// 
	// plugin definition 
	//
	$.fn.coolGrid = function(configuration) { 
		debug(this);
		
		$.extend($.fn.coolGrid.options,configuration);
		
		drawTableHeader(this);
		
		var pageParams = {currentPage:1,pageSize:5,totalPage:1};
		var queryParams = [{name:'MAIN_ID',value:'SQ20120903ADMI0002'}];
		var sortParams = {sortCol:'MAIN_ID',order:'asc'};
		loadTableData(pageParams,queryParams,sortParams);
		var data = {"dataSet":[{"ID":"CG001","STATUS":"N","AUDITOR":"李峰","REAL_AUDITOR":"许强","VERIFY_DESC":"审核不合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG002","STATUS":"N","AUDITOR":"李峰","REAL_AUDITOR":"许强","VERIFY_DESC":"审核不合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG003","STATUS":"N","AUDITOR":"李峰","REAL_AUDITOR":"许强","VERIFY_DESC":"审核不合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG004","STATUS":"N","AUDITOR":"李峰","REAL_AUDITOR":"许强","VERIFY_DESC":"审核不合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG005","STATUS":"N","AUDITOR":"李峰","REAL_AUDITOR":"许强","VERIFY_DESC":"审核不合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG006","STATUS":"Y","AUDITOR":"马建山","REAL_AUDITOR":"许强","VERIFY_DESC":"审核合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG007","STATUS":"Y","AUDITOR":"马建山","REAL_AUDITOR":"许强","VERIFY_DESC":"审核合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG008","STATUS":"Y","AUDITOR":"马建山","REAL_AUDITOR":"许强","VERIFY_DESC":"审核合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"},{"ID":"CG009","STATUS":"Y","AUDITOR":"马建山","REAL_AUDITOR":"许强","VERIFY_DESC":"审核合格","VERIFY_DATE":"2013-01-04","VERIFY_DEPART":"一车间","VERIFY_LEVEL":"部门经理","FIELD1":"1","FIELD2":"1"}],pageParams:{"currentPage":"1","totalPage":"2"}};
		
		addData2Table(data, this);
		
		bindEvents(this);
	};
	
	function bindEvents($obj){
		$obj.find(".add").bind("click",onAddClick);
		$obj.find(".delete").bind("click",onDeleteClick);
		$obj.find(".update").bind("click",onUpdateClick);
	}
	
	function onAddClick(event){
		var $firstTR = $(event.target).parents("tr").filter(":first");
		var colModel = $.fn.coolGrid.options.colModel;
		var subTableCount = colModel.length;
		if (subTableCount == 1){
			//如果是简单表
			var data = $firstTR.find(":input").serializeArray();
		}
		else{
			//如果是复杂表
			var firstData = $firstTR.find(":input:hidden").serializeArray();
			var param = {opParam:"delete"};
			param.dataTable = $.fn.coolGrid.options.databaseTableName;
		}
	}
	function onDeleteClick(){
		var $firstTR = $(event.target).parents("tr").filter(":first");
		var clickRowIndex =  $firstTR[0].rowIndex;
		var colModel = $.fn.coolGrid.options.colModel;
		var subTableCount = colModel.length;
		var data = [{"":""}];
		if (subTableCount == 1){
			//如果是简单表
			data = $firstTR.find(":input:hidden").serializeArray();
		}
		else{
			//如果是复杂表
			for (var j = 0; j < subTableCount; j++){
	    		var $tmpTR = $("#subTable" + j + " tr :eq(" + clickRowIndex + ")");
	    		var tmpData = $tmpTR.find(":input:hidden").serializeArray();
	    		for (var key in tmpData){
    				data.push({name:tmpData[key]["name"],value:tmpData[key]["value"]});
	    		}
			}
		}
		var param = {opParam:"delete"};
		param.dataTable = $.fn.coolGrid.options.databaseTableName;
		param.queryParams = data;
		alert(param);
		console.log(param);
	}
	function onUpdateClick(){
		
	}
	
	
	function debug($obj) { 
		if (window.console && window.console.log) 
		window.console.log('coolGrid selection count: ' + $obj.size()); 
	}

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
			    			var colName = table.data[k].name;
			    			if (table.data[k].key != undefined)
			    				$td.append("<input type='hidden' name='"+colName+"' value='"+data.dataSet[m][colName]+"'></input>");
			    			var types = table.data[k].type.split("|");
			    			for (var n = 0; n < types.length; n++){
			    				switch(types[n]){
			    				case "data":
			    					if(table.data[k].editable == undefined)
			    						$td.append("<input style='width:90%;' type='text' name='" + colName + "' value='"+ data.dataSet[m][colName] +"'>");
			    					else
			    						$td.append(data.dataSet[m][colName]);
			    					break;
			    				case "insert": $td.append("<a href='#' class='insert'><img src='images/add.gif' border='0' alt='添加记录'></a>");break;
			    				case "delete": $td.append("<a href='#' class='delete'><img src='images/delete.gif' border='0' alt='删除记录'></a>");break;
			    				case "update": $td.append("<a href='#' class='update'><img src='images/update.gif' border='0' alt='删除记录'></a>");break;
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
				    			var colName = subTable.data[k].name;
				    			if (subTable.data[k].key != undefined)
				    				$td.append("<input type='hidden' name='"+colName+"' value='"+data.dataSet[m][colName]+"'></input>");
				    			var types = subTable.data[k].type.split("|");
				    			for (var n = 0; n < types.length; n++){
				    				switch(types[n]){
				    				case "data":
				    					if(subTable.data[k].editable == undefined)
				    						$td.append("<input style='width:90%;' type='text' name='" + colName + "' value='"+ data.dataSet[m][colName] +"'>");
				    					else
				    						$td.append(data.dataSet[m][colName]);
				    					break;
				    				case "insert": $td.append("<a href='#' class='insert'><img src='images/add.gif' border='0' alt='添加记录'></a>");break;
				    				case "delete": $td.append("<a href='#' class='delete'><img src='images/delete.gif' border='0' alt='删除记录'></a>");break;
				    				case "update": $td.append("<a href='#' class='update'><img src='images/update.gif' border='0' alt='删除记录'></a>");break;
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
			//是否只是可添加数据
			if (subTableCount == 1){
				//如果是简单表
				var rowCount = $obj.children("tr").length;
				if (rowCount % 2 != 0)
					$obj.append("<tr class='tabtd1'></tr>");
				else
					$obj.append("<tr class='tabtd2'></tr>");
				$tr = $obj.find("tr :last");
				for (var k = 0; k < colModel[0].data.length; k++){
					$tr.append("<td></td>");
					$td = $tr.find("td :last");
					if (k == 0)
						$td.append("<a href='#' class='add'><img src='images/add.gif' border='0' alt='添加记录'></a>");
					else{
						$td.append("<input style='width:90%;' type='text' name='" + colModel[0].data[k].name + "'>");
					}
				}
			}
			else{
				//如果是复杂表
				var rowCount = $("subTable0 tr").length;
				if (rowCount % 2 != 0)
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
		    			var colName = subTable.data[k].name;
		    			if (k == 0 && j ==0)
							$td.append("<a href='#' class='add'><img src='images/add.gif' border='0' alt='添加记录'></a>");
						else{
							$td.append("<input style='width:90%;' type='text' name='" + colName + "'>");
						}
		    		}
		    	}
			}
		}
	}
	
	$.fn.coolGrid.options = { }; 
	function loadTableData(pageParams, queryParams, sortParams){
		var url = "./GridHandlerServlet";
		var dataTable = $.fn.coolGrid.options.databaseTableName;
		var queryCols = [];
		
		for(var i = 0; i < $.fn.coolGrid.options.colModel.length; i++){
			var eachCol = $.fn.coolGrid.options.colModel[i];

			for(var j = 0; j < eachCol.data.length; j++){
				if(eachCol.data[j].type.indexOf('data') != -1){
					var temp = {name:eachCol.data[j].name};
					queryCols.push(temp);
				}
			}
		}	
		var params = {opParam:'view',dataTable:dataTable,queryCols:queryCols,queryParams:queryParams,pageParams:pageParams,sortParams:sortParams};	
		var paramsString = JSON.stringify(params);
		var tmp = [{name:"params",value:paramsString}];
		alert(tmp[0].value);
		
		$.post(
			url,//发送请求地址
			tmp,
			function(data){
			}
		);
		
	}
	$.fn.coolGrid.options = {};
})(jQuery);