$(document).ready(function() { 
		$(".tab span:first").addClass("current"); //Ϊ��һ��SPAN��ӵ�ǰЧ����ʽ 
		$(".tab div.tabChild:not(:first)").hide(); //����������UL 
		$(".tab span").click(function() { 
			$(".tab span").removeClass("current"); //ȥ������SPAN����ʽ 
			$(this).addClass("current"); 
			$(".tab div.tabChild").hide();
			$("." + $(this).attr("id")).fadeIn('slow'); 
		});
	}); 