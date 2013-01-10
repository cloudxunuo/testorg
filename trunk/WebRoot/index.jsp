<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<html>
  <head>
    <title>Demo</title>
    <link rel="stylesheet" type="text/css" href="css/divFrame.css" />
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/jquery.json-2.4.js"></script>
    <!-- <script type="text/javascript" src="js/util/selecttime.js"></script> -->
	<script type="text/javascript">
	$(document).ready(function(){
	  $("#dataTablesItem").click(function(){
	  	$("#content").load("jsp/dataTable.html");
	  });
	  $("#formValidatorItem").click(function(){
	  	$("#content").load("jsp/formValidatorTest.jsp");
	  });
	});
	</script>
  </head>
  
  <body>
  <div id="hd">
  	<jsp:include page ="head.jsp"/>
  </div>
  <div id="bd">
	  <div id="side">
	    <jsp:include page ="menu.jsp"/>
	  </div>
	  <div id="main">
		<div id="content">
		  <jsp:include page="welcome.jsp"/>
		</div>
	  </div>
	</div>
  </body>
</html>
