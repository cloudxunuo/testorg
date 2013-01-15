<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<html>
  <head>
    <title>My JSP 'head.jsp' starting page</title>
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/coolGrid.js"></script>
	<script type="text/javascript">
	$(document).ready(function(){
	  $("#test").coolGrid({
	  	url: './servlet',
		colModel :
		[
			{
				xscrollable:false, data:
				[
					{type:'view',display: '操作', name : 'operator', width : 40},
					{type:'data',display: '学号', name : 'id', width : 100},
					{type:'data',display: '姓名', name : 'id', width : 40},
					{type:'data',display: '年龄', name : 'id', width : 40},
					{type:'data',display: '分数', name : 'id', width : 40},
				]
			}
		],
		sortorder: 'asc',
		activeSortCol:'taskNum',
		title: '示范表格',
		width: 760,
		pageSize: 5,
		databaseTableName:'student',
		queryParams:[{name:'id',value:'123'}]
		}
	  	);
	});
	</script>
  </head>
  <body>
  	<table id="test">
  	</table>
  </body>
</html>
