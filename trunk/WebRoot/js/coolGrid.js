//Our coolGrid jquery plugins
//Author:Xuezi Zhang and Qiang Xu
(function($) { 
	// 
	// plugin definition 
	//
	function debug($obj) { 
		if (window.console && window.console.log) 
		window.console.log('hilight selection count: ' + $obj.size()); 
	}; 
	
	$.fn.coolGrid = function(configuration) { 
		debug(this);
	};
	
	
})(jQuery);