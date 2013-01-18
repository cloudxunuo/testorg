<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<html>
  <head>
    <title>My JSP 'head.jsp' starting page</title>
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/coolGrid.js"></script>
	<script type="text/javascript">
	$(document).ready(function(){
	  $("#test").coolGrid({
	  	url: './GridHandlerServlet',
		colModel :
		[
			{
				xscrollable:false, data:
				[
					{type:'delete|update',display: '操作', name : 'operator', width : 60},
					{type:'data',display: '序号', name : 'ID', width : 100, key:true, editable:false, sortable:true},
					{type:'data',display: '状态', name : 'STATUS', width : 40},
					{type:'data',display: '审核人', name : 'AUDITOR', width : 40}
				],
				width:260
			},
			{
				xscrollable:true, data:
				[
					{type:'data',display: '实际审核人', name : 'REAL_AUDITOR', width : 100},
					{type:'data',display: '审核意见', name : 'VERIFY_DESC', width : 100},
					{type:'data',display: '审核日期', name : 'VERIFY_DATE', width : 100, sortable:true},
					{type:'data',display: '审核部门', name : 'VERIFY_DEPART', width : 100},
					{type:'data',display: '审核岗位', name : 'VERIFY_LEVEL', width : 100},
					{type:'data',display: '字段一', name : 'FIELD1', width : 100},
					{type:'data',display: '字段二', name : 'FIELD2', width : 100}
				],
				width:500
			}
		],
		
		sortorder: 'asc',
		activeSortCol:'ID',
		pageSize: 5,
		insertable:true,
		databaseTableName:'detail',
		queryParams:[{name:'MAIN_ID',value:'SQ20120903ADMI0002'}]
		}
	  	);
	});
	</script>
  </head>
  <body>
  	<div id="test">
  	</div>
  </body>
</html>
