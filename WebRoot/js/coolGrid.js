//Our coolGrid jquery plugins
//Author:Xuezi Zhang and Qiang Xu
(function($) { 
	// 
	// plugin definition 
	//
	$.fn.coolGrid = function(options) { 
		debug(this);
		
		drawTableHeader(options.colModel,this);
		
		
	};
	
	
	function debug($obj) { 
		if (window.console && window.console.log) 
		window.console.log('coolGrid selection count: ' + $obj.size()); 
	}; 
	
	function drawTableHeader(colModel,$obj){
		//最简单的table
		if (colModel.length == 1){
			var colData = colModel[0].data;
			$obj.addClass("tabline");
			$obj.attr("border",0);
			$obj.attr("cellspacing",1);
			$obj.attr("cellpadding",2);
			$obj.append("<thead></thead>");
			$obj.find("thead").append("<tr></tr>");
			var $tr = $obj.find("tr :last");
			for (var i = 0; i < colData.length; i++){
				$tr.append("<td class='tabtitletd' width='" + colData[i].width
						+ "'>" + colData[i].display + "</td>");
			}
		}
		else if (colModel.length > 1){
			var colData = colModel[0].data;
			$obj.addClass("tabline");
			$obj.attr("border",0);
			$obj.attr("cellspacing",1);
			$obj.attr("cellpadding",2);
			$obj.append("<tr></tr>");
			var $tr = $obj.find("tr :last");
			var subTableCount = colModel.length;
			for (var i = 0; i < subTableCount; i++){
				$tr.append("<td></td>");
			}
		}
	}
	
})(jQuery);