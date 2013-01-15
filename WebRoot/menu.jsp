<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<html>
  <head>
    <title>My JSP 'head.jsp' starting page</title>
    <style type="text/css">
    #navigation {
		position:absolute;
		width:190px;
		height:auto;
		z-index:1;
		background: #fff;
		left:0;
		top:34px;
		float:left;
	}
	#navigation ul
	{
		
		text-align:left;
		list-style:none;
		margin:0;
		padding:0;
		
	}
	#navigation ul li
	{
		
		margin:0;
		
		padding: 0px 0px; 
		height: 26px; 
		line-height: 26px;
		border-bottom: 1px solid #CCC;
	}
	#navigation ul li a
	{
		text-decoration:none;
		font-size:14px;
		padding-left:13px;
		/*记得将字体改为微软雅黑*/
		color:black;
	}
	#navigation ul li a:link
	{
		text-decoration:none;
		font-size:14px;
		
	}
	#navigation ul li a:hover
	{
		font-weight:bold;
	}
    </style>
  </head>
  <body>
  	<div id="menu">
  		<div id="navigation" align="left">
			<ul>
				<li>
					<a id="testItem" href="#">test</a>
				</li>
				<li>
					<a id="dataTablesItem" href="#">DataTables</a>
				</li>
				<li>
					<a id="formValidatorItem" herf="#">FormValidator</a>
				</li>
			</ul>
		</div>
  	</div>
  </body>
</html>
