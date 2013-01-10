$(document).ready(function() { 
		$(".tab span:first").addClass("current"); //为第一个SPAN添加当前效果样式 
		$(".tab div.tabChild:not(:first)").hide(); //隐藏其它的UL 
		$(".tab span").click(function() { 
			$(".tab span").removeClass("current"); //去掉所有SPAN的样式 
			$(this).addClass("current"); 
			$(".tab div.tabChild").hide();
			$("." + $(this).attr("id")).fadeIn('slow'); 
		});
	}); 