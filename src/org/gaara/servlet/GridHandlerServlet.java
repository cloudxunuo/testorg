package org.gaara.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.gaara.db.DBHelper;
import org.json.*;

public class GridHandlerServlet extends HttpServlet{
	public GridHandlerServlet() {
		super();
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		
		System.out.println("GridHandlerServlet in------------------!");

		String json = request.getParameter("params");
		
		System.out.println(json);
		JSONObject jsonObject = null;
		try{
			jsonObject = new JSONObject(json);
			String opParam = jsonObject.getString("opParam");
			System.out.println(opParam);
			
			if(opParam.equals("view")){
				response.setContentType("text/json;charset=UTF-8");        		
				PrintWriter out = response.getWriter();
				out.print(loadTableData(jsonObject));
				out.close();
			}
			else if(opParam.equals("delete")){
				response.setContentType("text/html;charset=UTF-8");        		
				PrintWriter out = response.getWriter();
				out.print(deleteData(jsonObject));
				out.close();
			}
		}catch(Exception pe){
			pe.printStackTrace();
		}
	}
	private String deleteData(JSONObject jsonObject) throws JSONException{
		System.out.println("Delete in------------------!");
		String retString = "success";
		
		String dataTable = jsonObject.getString("dataTable");
		
		JSONArray queryParams = jsonObject.getJSONArray("queryParams");
		
		String sql = "delete from " + dataTable + " where 1=1 ";
		
		for (int i = 0; i < queryParams.length(); i ++)
		{
			String name = queryParams.getJSONObject(i).getString("name");
			String value = queryParams.getJSONObject(i).getString("value");
			sql = sql + "and " + name + "='" + value + "' ";
		}
		
		System.out.println(sql);
		
		if (DBHelper.executeNonQuery(sql) == 0){
			retString = "failed";
		}
		
		return retString;
	}
	
	private JSONObject loadTableData(JSONObject jsonObject)
	throws JSONException, SQLException{
		System.out.println("View in------------------!");
		
		String dataTable = jsonObject.getString("dataTable");
		
		JSONArray queryParams = jsonObject.getJSONArray("queryParams");
		
		JSONArray queryCols = jsonObject.getJSONArray("queryCols");
		
		JSONObject sortParams = jsonObject.getJSONObject("sortParams");
		String sortCol = sortParams.getString("sortCol");
		String order = sortParams.getString("order");
		
		JSONObject pageParams = jsonObject.getJSONObject("pageParams");				
		int currentPage = pageParams.getInt("currentPage");
		int pageSize = pageParams.getInt("pageSize");
		int totalPage = pageParams.getInt("totalPage");
		int startPos = (currentPage - 1) * pageSize;
		
		String pageSql = "select count(*) ";
		String sql = "select ";
		
		for(int i = 0; i < queryCols.length(); i++){
			if(i == (queryCols.length() - 1))
				sql = sql + queryCols.getJSONObject(i).getString("name") + " ";
			else
				sql = sql + queryCols.getJSONObject(i).getString("name") + ",";
		}
		
		sql = sql + "from " + dataTable + " where 1=1 ";
		pageSql = pageSql + "from " +dataTable + " where 1=1 ";
		
		for(int i = 0; i < queryParams.length(); i++){
			String name = queryParams.getJSONObject(i).getString("name");
			String value = queryParams.getJSONObject(i).getString("value");
			sql = sql + "and " + name + "='" + value + "' ";
			pageSql = pageSql + "and " + name + "='" + value + "' ";
		}
		
		sql = sql + "order by " + sortCol + " " + order + " limit " + startPos + "," + pageSize;
		System.out.println(sql);
		System.out.println(pageSql);
		
		
		ResultSet resultSet = DBHelper.executeQuery(sql);
		ResultSet temp = DBHelper.executeQuery(pageSql);
		temp.next();
		int recordsNum = temp.getInt(1);

		JSONArray records = new JSONArray();
		int i = 0;
		
		while(resultSet.next()){					
			Map map = new HashMap();
			for(int j = 0; j < queryCols.length(); j++){
				String colName = queryCols.getJSONObject(i).getString("name");
				map.put(colName, resultSet.getString(colName));
			}
			JSONObject record = new JSONObject(map);
			records.put(i, record);
			i++;
		}
		
		if (recordsNum % pageSize == 0){
			totalPage = recordsNum / pageSize;
		}else{
			totalPage = recordsNum / pageSize + 1;
		}
		resultSet.close();
		
		String tmpPageParams = "{currentPage:" + currentPage + ",totalPage:" + totalPage + "}";
		JSONObject returnPageParams = new JSONObject(tmpPageParams);
		
		JSONObject returnParams = new JSONObject();
		returnParams.put("dataSet", records);
		returnParams.put("pageParam", returnPageParams);
		System.out.println(returnParams);
		
		return returnParams;
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		this.doGet(request, response);
	}
}