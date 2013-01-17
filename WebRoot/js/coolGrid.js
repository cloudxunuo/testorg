//Our coolGrid jquery plugins
//Author:Xuezi Zhang and Qiang Xu

(function($) { 
	// 
	// plugin definition 
	//
	$.fn.coolGrid = function(configuration) { 
		
		$.fn.coolGrid.table = $(this);
		
		$.extend($.fn.coolGrid.options,configuration);
		
		drawTableHeader();
		
		var pageParams = {currentPage:1,pageSize:$.fn.coolGrid.options.pageSize,totalPage:1};
		var queryParams = $.fn.coolGrid.options.queryParams;
		var sortParams = {sortCol:$.fn.coolGrid.options.activeSortCol,order:$.fn.coolGrid.options.sortorder};
		loadTableData(pageParams,queryParams,sortParams);
	};
	
	function bindEvents(){
		$table = $.fn.coolGrid.table;
		$table.find(".add").bind("click",onAddClick);
		$table.find(".delete").bind("click",onDeleteClick);
		$table.find(".update").bind("click",onUpdateClick);
		$table.find(".sortAsc").bind("click",sortAscClick);
		$table.find(".sortDesc").bind("click",sortDescClick);
	}
	
	function sortAscClick(event){
		alert("asc");
	}
	
	function sortDescClick(event){
		alert("desc");
	}
	
	function onAddClick(event){
		alert("add");
	}
	function onDeleteClick(event){
		var $firstTR = $(event.target).parents("tr").filter(":first");
		var clickRowIndex =  $firstTR[0].rowIndex;
		var colModel = $.fn.coolGrid.options.colModel;
		var subTableCount = colModel.length;
		var data = [];
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
		var finalparam = [{name:"params",value:JSON.stringify(param)}];
		var url = "./GridHandlerServlet";
		$.post(
				url,//发送请求地址
				finalparam,
				function(data){
					if (data == "success"){
						alert("删除成功");
						var pageParams = {currentPage:1,pageSize:$.fn.coolGrid.options.pageSize,totalPage:1};
						var queryParams = $.fn.coolGrid.options.queryParams;
						var sortParams = {sortCol:$.fn.coolGrid.options.activeSortCol,order:$.fn.coolGrid.options.sortorder};
						loadTableData(pageParams,queryParams,sortParams);
					}else{
						alert("删除失败");
					}
				}
			);
		
	}
	function onUpdateClick(event){
		alert("update");
	}
	
	
	function debug() { 
		$table = $.fn.coolGrid.table;
		if (window.console && window.console.log) 
			window.console.log('coolGrid selection count: ' + $table.size()); 
	}

	function drawTableHeader($table){
		//最简单的table
		$table = $.fn.coolGrid.table;
		
		var colModel = $.fn.coolGrid.options.colModel;
		if (colModel.length == 1){
			
			$table.addClass("tabline");
			$table.attr("border",0);
			$table.attr("cellspacing",1);
			$table.attr("cellpadding",0);
			$table.css("text-align","center");
			$table.attr("width",$.fn.coolGrid.options.width);
			$table.append("<tr></tr>");
			var $tr = $table.find("tr :last");
			
			var colData = colModel[0].data;
			for (var i = 0; i < colData.length; i++){
				if(colData[i].sortable == true){
					$tr.append("<td class='tabtitletd' width='" + colData[i].width
							+ "'><table align='center'><tr><td class='tabtitletd'>"
							+ colData[i].display + "</td><td>"
							+ "<div style='overflow:false;clean:both'>" 
							+ "<a href='#' class='sortAsc'>"
							+ "<img alt='升序' src='images/asc.gif'></a></div>"
							+ "<div style='overflow:false;clean:both'>"
							+ "<a href='#' class='sortDesc'>"
							+ "<img alt='降序' src='images/desc.gif'></a></div></td></tr></table></td>"
					);
				}else{
					$tr.append("<td class='tabtitletd' width='" + colData[i].width
							+ "'>" + colData[i].display + "</td>");
				}
			}
		}
		else if (colModel.length > 1){
			$table.attr("border",0);
			$table.attr("cellspacing",0);
			$table.attr("cellpadding",0);
			$table.css("text-align","center");
			$table.attr("width",$.fn.coolGrid.options.width);
			$table.append("<tr></tr>");
			var $tr = $table.find("tr :last");
			
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
							" border='0' cellspacing='1' cellpadding='2' class='tabline' align='center' style='text-align: center;'></table>");
					$td.find("#subTable" + i).append("<tr></tr>");
					$subTR = $td.find("#subTable" + i).find("tr");
					for (var j = 0; j < colData.length; j++){
						if(colData[j].sortable == true){
							$subTR.append("<td class='tabtitletd' width='" + colData[j].width
									+ "'><table align='center'><tr><td class='tabtitletd'>"
									+ colData[j].display + "</td><td>"
									+ "<div style='overflow:false;clean:both'>" 								
									+ "<a href='#' class='sortAsc'>"
									+ "<img alt='升序' src='images/asc.gif'></a></div>"
									+ "<div style='overflow:false;clean:both'>"
									+ "<a href='#' class='sortDesc'>"
									+ "<img alt='降序' src='images/desc.gif'></a></div></td></tr></table></td>"
							);
						}else{
							$subTR.append("<td class='tabtitletd' width='" + colData[j].width
									+ "'>" + colData[j].display + "</td>");
						}
					}
				}
				else{
					var colData = colModel[i].data;
					
					$td.append("<table id='subTable" + i 
							+"' border='0'  cellspacing='1' cellpadding='2' class='tabline' align='center' style='text-align: center;'></table>");
					$td.find("#subTable" + i).append("<tr></tr>");
					$subTR = $td.find("#subTable" + i).find("tr");
					for (var j = 0; j < colData.length; j++){
						if(colData[j].sortable == true){
							$subTR.append("<td class='tabtitletd' width='" + colData[j].width
									+ "'><table align='center'><tr><td class='tabtitletd'>"
									+ colData[j].display + "</td><td>"
									+ "<div style='overflow:false;clean:both'>" 
									+ "<a href='#' class='sortAsc'>"
									+ "<img alt='升序' src='images/asc.gif'></a></div>"
									+ "<div style='overflow:false;clean:both'>"
									+ "<a href='#' class='sortDesc'>"
									+ "<img alt='降序' src='images/desc.gif'></a></div></td></tr></table></td>"
							);
						}else{
							$subTR.append("<td class='tabtitletd' width='" + colData[j].width
									+ "'>" + colData[j].display + "</td>");
						}
					}
				}
			}
		}
	}
	
	function addData2Table(data)
	{
		$table = $.fn.coolGrid.table;
		var subTableCount = $.fn.coolGrid.options.colModel.length;
		var colModel = $.fn.coolGrid.options.colModel;
		var i = 0;
		
		if (subTableCount == 1){
			//简单表
			$table.children("tr").filter(":gt(0)").remove();//如果该表有数据，除了列名tr全部移除
		}else{
			//复杂表
			for (var j = 0; j < subTableCount; j++){
				$("#subTable" + j).children("tr").filter(":gt(0)").remove();//如果该表有数据，除了列名tr全部移除
			}
		}
		for (var key in data)
		{
			if (key == "dataSet")
			{
				for (var m = 0; m < data.dataSet.length; m++)
			    {
					if (subTableCount == 1){
						//如果是简单表
						if (i % 2 == 0){
							$table.append("<tr class='tabtd1'></tr>");
						}
						else{
							$table.append("<tr class='tabtd2'></tr>");
						}
						var table = colModel[0];
			    		for (var k = 0; k < table.data.length; k++){
			    			$tr = $table.find("tr :last");
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
				var rowCount = $table.children("tr").length;
				if (rowCount % 2 != 0)
					$table.append("<tr class='tabtd1'></tr>");
				else
					$table.append("<tr class='tabtd2'></tr>");
				$tr = $table.find("tr :last");
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
		$table = $.fn.coolGrid.table;
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
		
		$.post(
			url,//发送请求地址
			tmp,
			function(data){
				addData2Table(data);
				bindEvents();
			}
		);
		
	}
	$.fn.coolGrid.options = {};
	$.fn.coolGrid.table;
})(jQuery);