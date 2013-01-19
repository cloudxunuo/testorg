//Our coolGrid jquery plugins
//Author:Xuezi Zhang and Qiang Xu

(function($) { 
	// 
	// plugin definition 
	//
	$.fn.coolGrid = function(configuration) { 
		
		$.extend($.fn.coolGrid.options,configuration);
		
		$.fn.coolGrid.div = $(this);
		
		//给插件DIV添加属性
		addAttr2Div();
		
		if ($.fn.coolGrid.options.queryModel != undefined){
			//如果指定了查询框
			drawQueryForm();
		}
		
		drawTableHeader();
		
		var pageParams = {currentPage:1,pageSize:$.fn.coolGrid.options.pageSize,totalPage:1};
		var sortParams = {sortCol:$.fn.coolGrid.options.activeSortCol,order:$.fn.coolGrid.options.sortorder};
		loadTableData(pageParams,sortParams);
	};
	
	function addAttr2Div(){
		if ($.fn.coolGrid.options.width == undefined)
			$.fn.coolGrid.div.css("width",$.fn.coolGrid.defaultWidth);
		else
			$.fn.coolGrid.div.css("width",parseInt($.fn.coolGrid.options.width));
	}
	
	function bindEvents(){
		$table = $.fn.coolGrid.table;
		$table.find(".add").bind("click",onAddClick);
		$table.find(".delete").bind("click",onDeleteClick);
		$table.find(".update").bind("click",onUpdateClick);
	}
	
	function sortAscClick(event){
		var $tmp = $(event.target);
		while($tmp.parent("tr").length == 0)
			$tmp = $tmp.parent();
		var colName = $tmp.parent("tr").find("input:first").val();
		
		var pageParams = {currentPage:1,pageSize:$.fn.coolGrid.options.pageSize,totalPage:1};
		var sortParams = {sortCol:colName,order:"asc"};
		
		loadTableData(pageParams,sortParams);
	}
	
	
	function sortDescClick(event){
		var $tmp = $(event.target);
		while($tmp.parent("tr").length == 0)
			$tmp = $tmp.parent();
		var colName = $tmp.parent("tr").find("input:first").val();
		
		var pageParams = {currentPage:1,pageSize:$.fn.coolGrid.options.pageSize,totalPage:1};
		var sortParams = {sortCol:colName,order:"desc"};
		
		loadTableData(pageParams,sortParams);	
	}
	
	function onAddClick(event){
		var $firstTR = $(event.target).parents("tr").filter(":first");
		var clickRowIndex =  $firstTR[0].rowIndex;
		var colModel = $.fn.coolGrid.options.colModel;
		var subTableCount = colModel.length;
		var data = [];
		if (subTableCount == 1){
			//如果是简单表
			var tmpData = $firstTR.find(":input").serializeArray();
			for (var key in tmpData){
    			if (tmpData[key]["value"] != '')
    				data.push({name:tmpData[key]["name"],value:tmpData[key]["value"]});
    		}
		}
		else{
			//如果是复杂表
			for (var j = 0; j < subTableCount; j++){
	    		var $tmpTR = $("#subTable" + j).children("tbody").children("tr").filter(":eq("+ clickRowIndex + ")");
	    		var tmpData = $tmpTR.find(":input").serializeArray();
	    		for (var key in tmpData){
	    			if (tmpData[key]["value"] != '')
	    				data.push({name:tmpData[key]["name"],value:tmpData[key]["value"]});
	    		}
			}
		}
		var param = {opParam:"insert"};
		param.dataTable = $.fn.coolGrid.options.databaseTableName;
		var foreignKey = $table.children(":input").serializeArray();
		for (var i = 0; i < foreignKey.length; i++){//添加table里没显示出来的外键数据
			data.push(foreignKey[i]);
		}
		param.dataParams = data;
		var finalparam = [{name:"params",value:JSON.stringify(param)}];
		var url = $.fn.coolGrid.options.url;
		$.post(
				url,//发送请求地址
				finalparam,
				function(data){
					if (data == "success"){
						var currentPage =  parseInt($("#currentPage").val());
						var pageCount = parseInt($("#pageCount").val());
						var pageParams = {currentPage:currentPage,pageSize:$.fn.coolGrid.options.pageSize,totalPage:pageCount};
						var sortParams = {sortCol:$.fn.coolGrid.options.activeSortCol,order:$.fn.coolGrid.options.sortorder};
						loadTableData(pageParams,sortParams);
						alert("插入成功");
					}else{
						alert("插入失败");
					}
				}
		);
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
	    		var $tmpTR = $("#subTable" + j).children("tbody").children("tr").filter(":eq("+ clickRowIndex + ")");
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
		var url = $.fn.coolGrid.options.url;
		$.post(
				url,//发送请求地址
				finalparam,
				function(data){
					if (data == "success"){
						var currentPage =  parseInt($("#currentPage").val());
						var pageCount = parseInt($("#pageCount").val());
						var pageParams = {currentPage:currentPage,pageSize:$.fn.coolGrid.options.pageSize,totalPage:pageCount};
						var sortParams = {sortCol:$.fn.coolGrid.options.activeSortCol,order:$.fn.coolGrid.options.sortorder};
						loadTableData(pageParams,sortParams);
						alert("删除成功");
					}else{
						alert("删除失败");
					}
				}
			);
		
	}
	function onUpdateClick(event){
		var $tmp = $(event.target);
		while($tmp.parent("tr").length == 0)
			$tmp = $tmp.parent();
		
		var queryParams = $tmp.parent("tr").find("input:hidden").serializeArray();
		var clickRowIndex = $tmp.parent("tr").filter(":first")[0].rowIndex;
		var colModel = $.fn.coolGrid.options.colModel;
		var subTableCount = colModel.length;
		
		var data = [];
		if (subTableCount == 1){
			//如果是简单表
			var changeParams = $tmp.parent("tr").find(":input").serializeArray();
			for (var key in changeParams){
    			if (changeParams[key]["value"] != '')
    				data.push({name:changeParams[key]["name"],value:changeParams[key]["value"]});
    		}
		}else{
			//如果是复杂表
			for (var j = 0; j < subTableCount; j++){
	    		var $tmpTR = $("#subTable" + j).children("tbody").children("tr").filter(":eq("+ clickRowIndex + ")");
	    		var changeParams = $tmpTR.find(":input").serializeArray();
	    		for (var key in changeParams){
	    			if (changeParams[key]["value"] != 'null')
	    				data.push({name:changeParams[key]["name"],value:changeParams[key]["value"]});
	    		}
			}
		}
		
		var $obj = $.fn.coolGrid.options;
		var url = $obj.url;
		var dataTable = $obj.databaseTableName;
		//alert($obj.url);
		var param = {opParam:"update",dataTable:dataTable,changeParams:data,queryParams:queryParams};
		var params = [{name:'params',value:JSON.stringify(param)}];
		$.post(
				url,//发送请求地址
				params,
				function(data){
					if (data == "success"){
						alert("修改成功");
					}else{
						alert("修改失败");
					}
				}
		);
	}
	
	function pageQuery(currentPage, pageCount){
		var pageParams = {currentPage:currentPage,pageSize:$.fn.coolGrid.options.pageSize,totalPage:pageCount};
		var sortParams = {sortCol:$.fn.coolGrid.options.activeSortCol,order:$.fn.coolGrid.options.sortorder};
		loadTableData(pageParams,sortParams);
	}
	
	function drawQueryForm(){
		var infoCountPerRow  = 3;
		
		if ($.fn.coolGrid.options.width != undefined)
			$.fn.coolGrid.div.append("<fieldset id='coolGridFieldset' style='width:"+ (parseInt($.fn.coolGrid.options.width) - 30) +"px;border:solid 1px #aaa;position:relative;'></fieldset>");
		else
			$.fn.coolGrid.div.append("<fieldset id='coolGridFieldset' style='width:"+$.fn.coolGrid.defaultWidth+"px;border:solid 1px #aaa;position:relative;'></fieldset>");
		
		var $queryModel = $.fn.coolGrid.options.queryModel;
		var $queryFieldset = $("#coolGridFieldset");
		$queryFieldset.append("<legend>"+$queryModel.legend+"</legend>");
		$queryFieldset.append("<div id='coolGridQueryForm' style='padding:5px;'></div>");
		$("#coolGridQueryForm").append("<table style='width:100%;'></table>");
		var $tmpTable = $("#coolGridQueryForm").children("table");
		var $lastTR;
		for (var i = 0 ; i < $queryModel.data.length; i++){
			if (i % infoCountPerRow == 0){
				$tmpTable.append("<tr></tr>");
				$lastTR = $tmpTable.children("tbody").children("tr").filter(":last");
			}
			$lastTR.append("<td>"+$queryModel.data[i].display+": </td>");
			$lastTR.append("<td><input type='text' name='"+$queryModel.data[i].name+"'></td>");
		}
		$tmpTable.append("<tr><td style='text-align:right;padding-top:5px;padding-right:20px;' colspan='"+(infoCountPerRow * 2)+"'></td></tr>");
		$lastTR = $tmpTable.children("tbody").children("tr").filter(":last");
		$lastTR.children("td").append("<font face='Webdings' class='redcolor'>4</font><a id='coolGridSearch' href='#'>查询</a>&nbsp;&nbsp;");
		$lastTR.children("td").append("<font face='Webdings' class='redcolor'>4</font><a id='coolGridReset' href='#'>重置</a>&nbsp;&nbsp;");
		$.fn.coolGrid.div.append("<br>");
		
		//绑定查询和重置事件
		$("#coolGridSearch").bind("click",queryFormSearch);
		$("#coolGridReset").click(function(){$("#coolGridQueryForm :input").val("");});
	}
	
	function queryFormSearch(){
		var currentPage =  1;
		var pageCount = parseInt($("#pageCount").val());
		var pageParams = {currentPage:currentPage,pageSize:$.fn.coolGrid.options.pageSize,totalPage:pageCount};
		var sortParams = {sortCol:$.fn.coolGrid.options.activeSortCol,order:$.fn.coolGrid.options.sortorder};
		loadTableData(pageParams,sortParams);
	}

	function drawTableHeader(){
		//最简单的table
		$.fn.coolGrid.div.append("<table id='coolGridDataTable'></table>");
		$.fn.coolGrid.table = $.fn.coolGrid.div.find("#coolGridDataTable");
		$table = $.fn.coolGrid.table;
		
		if ($.fn.coolGrid.options.width == undefined){
			$table.attr("width",$.fn.coolGrid.defaultWidth);
		}else{
			$table.attr("width",$.fn.coolGrid.options.width);
		}
		$table.append("<tr></tr>");
		
		var colModel = $.fn.coolGrid.options.colModel;
		if (colModel.length == 1){
			
			$table.addClass("tabline");
			$table.attr("border",0);
			$table.attr("cellspacing",1);
			$table.attr("cellpadding",0);
			$table.css("text-align","center");
			var $tr = $table.find("tr :last");
			
			var colData = colModel[0].data;
			for (var i = 0; i < colData.length; i++){
				if(colData[i].sortable == true){
					$tr.append("<td class='tabtitletd' width='" + colData[i].width
							+ "'><table align='center'><tr><td class='tabtitletd'>"
							+ colData[i].display + "</td><td><input type='hidden' value='"
							+ colData[i].name + "'></input></td><td>"
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
									+ colData[j].display + "</td><td><input type='hidden' value='"
									+ colData[j].name + "'></input></td><td>"
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
									+ colData[j].display + "</td><td><input type='hidden' value='"
									+ colData[j].name + "'></input></td><td>"
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

		for (var i = 0; i < $.fn.coolGrid.options.queryParams.length; i++){
			//如果初始化配置的查询条件中有未在table里显示出来的列，那么该条件是外键，应该作为<input type="hidden">添加到表格里
			//在插入数据时需要用到该外键
			var show = false;
			for (var j = 0; j < colModel.length; j++){
				for (var k = 0; k < colModel[j].data.length; k++){
					if ($.fn.coolGrid.options.queryParams[i].name == colModel[j].data[k].name){
						show = true;
						break;
					}
				}
				if (show){break;}
			}
			if (!show){
				$table.append("<input type='hidden' name='"+ $.fn.coolGrid.options.queryParams[i].name +"' value='"+$.fn.coolGrid.options.queryParams[i].value +"'></input>");
			}
		}
		
		//如果定义了saveTableEnable，添加全表保存按钮
		if ($.fn.coolGrid.options.saveTableEnable != undefined){
			$.fn.coolGrid.div.append("<div style='width:70;float:right' id='coolGridSaveTableDiv'><font face='Webdings' class='redcolor'>4</font><a id='coolGridSaveTable' href='#'>全部保存</a></div>");
		}
		
		//添加翻页功能
		$.fn.coolGrid.div.append("<div id='pageDiv' style='width:200px;height:20px;'><a href='#'><font id='first' face='Webdings' style='color: #0000ff'>9</font></a>&nbsp;<a href='#'><font id='prev' face='Webdings' style='color: #0000ff'>3</font></a>&nbsp;<input type='text' id='currentPage' name='currentPage' value='1' style='width: 15px'/>/&nbsp;<input readonly type='text' id='pageCount' name='pageCount' value='1' style='width: 10px;border:0;background:transparent;'/><a href='#'><font id='next' face='Webdings' style='color: #0000ff'>4</font></a>&nbsp;<a href='#'><font id='last' face='Webdings' style='color: #0000ff'>:</font></a></div>");
		
		
		//画好header之后，绑定一些事件，这些事件只绑定一次，跟bindEvents函数不同
		bindEventsOnce();
	}
	
	function bindEventsOnce(){
		//绑定排序事件
		$table.find(".sortAsc").bind("click",sortAscClick);
		$table.find(".sortDesc").bind("click",sortDescClick);
		
		//翻页事件绑定
		$("#pageDiv").click(function(event){
			var currentPage =  1;
			var pageCount = parseInt($("#pageCount").val());
			if(event.target.id == "first")
			{
				pageQuery(1, $("#pageCount").val());
			}
			else if(event.target.id == "prev")
			{
				if (parseInt($("#currentPage").val()) - 1 > 0){
					currentPage = parseInt($("#currentPage").val()) - 1;
				}else{
					currentPage = pageCount;
				}
				pageQuery(currentPage, pageCount);
			}
			else if(event.target.id == "next")
			{
				if (parseInt($("#currentPage").val()) + 1 > pageCount){
					currentPage = 1;
				}else{
					currentPage = parseInt($("#currentPage").val()) + 1;
				}
				pageQuery(currentPage, pageCount);
			}
			else if(event.target.id == "last")
			{
				pageQuery(pageCount, pageCount);
			}
		});
		$("#currentPage").change(function(){
			var currentPage =  parseInt($("#currentPage").val());
			var pageCount = parseInt($("#pageCount").val());
			if (currentPage > pageCount){
				alert("超出范围！");
				currentPage = pageCount;
			}else if (currentPage < 1){
				alert("超出范围！");
				currentPage = 1;
			}
			pageQuery(currentPage, pageCount);
		});
		
		//跟全表保存有关的事件绑定
		if ($.fn.coolGrid.options.saveTableEnable != undefined){
			bindSaveTableEvents();
		}
	}
	
	function bindSaveTableEvents(){
		
		//绑定table的change事件，修改过的tr加上need2save属性
		$("#coolGridSaveTable").click(function(){
			var colModel = $.fn.coolGrid.options.colModel;
			var subTableCount = colModel.length;
			
			var queryParams = [];
			var changeParams = [];
			
			if (subTableCount == 1){
				//简单表
				var $table = $.fn.coolGrid.table;
				var tableRowCount = $table[0].rows.length;
				
				if ($.fn.coolGrid.options.insertable == undefined){
					//如果没有添加数据row
					var lastRow2Save = tableRowCount;
				}else{
					//如果有添加数据row
					var lastRow2Save = tableRowCount - 1;
				}
				
				for (var i = 1; i < lastRow2Save; i++){//第一行表头和最后一行不需要
					var rowChangeData = [];
					var rowQueryData = [];
					var $TR = $table.children("tbody").children("tr").filter(":eq("+i+")");
					var queryData = $TR.find(":input:hidden").serializeArray();
					for (var k = 0; k < queryData.length; k++){
						rowQueryData.push(queryData[k]);
					}
					
					var changeData = $TR.find(":input").filter(":not(:hidden)").serializeArray();
					for (var k = 0; k < changeData.length; k++){
						if (changeData[k].value != '' && changeData[k].value!= 'null')
							rowChangeData.push(changeData[k]);
					}
					changeParams.push({data:rowChangeData});
					queryParams.push({data:rowQueryData});
				}
				 
			}else{
				//复杂表
				var tableRowCount = $("#subTable0")[0].rows.length;
				
				if ($.fn.coolGrid.options.insertable == undefined){
					//如果没有添加数据row
					var lastRow2Save = tableRowCount;
				}else{
					//如果有添加数据row
					var lastRow2Save = tableRowCount - 1;
				}
				
				for (var i = 1; i < lastRow2Save; i++){//第一行表头和最后一行不需要
					var rowChangeData = [];
					var rowQueryData = [];
					for (var j = 0; j < subTableCount; j++){
						var $subTR = $("#subTable" + j).children("tbody").children("tr").filter(":eq("+i+")");
						var queryData = $subTR.find(":input:hidden").serializeArray();
						for (var k = 0; k < queryData.length; k++){
							rowQueryData.push(queryData[k]);
						}
						
						var changeData = $subTR.find(":input").filter(":not(:hidden)").serializeArray();
						for (var k = 0; k < changeData.length; k++){
							if (changeData[k].value != '' && changeData[k].value!= 'null')
								rowChangeData.push(changeData[k]);
						}
					}
					changeParams.push({data:rowChangeData});
					queryParams.push({data:rowQueryData});
				}
			}
			
			//获得数据之后向后台提交
			var $obj = $.fn.coolGrid.options;
			var url = $obj.url;
			var dataTable = $obj.databaseTableName;
			var param = {opParam:"saveTable",dataTable:dataTable,changeParams:changeParams,queryParams:queryParams};
			var params = [{name:'params',value:JSON.stringify(param)}];
			$.post(
					url,//发送请求地址
					params,
					function(data){
						if (data == "success"){
							alert("保存成功");
						}else{
							alert("保存失败");
						}
					}
			);
  		});
	}
	
	function addData2Table(data)
	{
		$table = $.fn.coolGrid.table;
		var subTableCount = $.fn.coolGrid.options.colModel.length;
		var colModel = $.fn.coolGrid.options.colModel;
		var i = 0;
		
		if (subTableCount == 1){
			//简单表
			$table.children("tbody").children("tr").filter(":gt(0)").remove();//如果该表有数据，除了列名tr全部移除
		}else{
			//复杂表
			for (var j = 0; j < subTableCount; j++){
				$("#subTable" + j).children("tbody").children("tr").filter(":gt(0)").remove();//如果该表有数据，除了列名tr全部移除
			}
		}
		
		//重新添加数据
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
				var rowCount = $table.children("tbody").children("tr").length;
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
				var rowCount = $("#subTable0").children("tbody").children("tr").length;
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

		//修改currentPage和pageCount的值
		$("#currentPage").val(data.pageParam.currentPage);
		$("#pageCount").val(data.pageParam.totalPage);
	}
	
	function loadTableData(pageParams, sortParams){
		$table = $.fn.coolGrid.table;
		var url = $.fn.coolGrid.options.url;
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
		
		var queryParams = [];
		if ($.fn.coolGrid.options.queryModel == undefined){
			queryParams = $.fn.coolGrid.options.queryParams;
		}else{
			for (var i = 0; i < $.fn.coolGrid.options.queryParams.length; i++){
				queryParams.push($.fn.coolGrid.options.queryParams[i]);
			}
			
			var formData = $("#coolGridQueryForm :input").serializeArray();
			for (var i = 0; i < formData.length; i++){
				if (formData[i].value != ''){
					queryParams.push(formData[i]);
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
	$.fn.coolGrid.div;
	$.fn.coolGrid.defaultWidth = 500;
})(jQuery);