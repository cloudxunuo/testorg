package org.gaara.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.*;
public class GridHandlerServlet extends HttpServlet{
	public GridHandlerServlet() {
		super();
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		
		System.out.println("GridHandlerServlet in------------------!");
		//String json = readJSONStringFromRequestBody(request);
		String json = request.getParameter("params");
		
		System.out.println(json);
		JSONObject jsonObject = null;
		try{
			jsonObject = new JSONObject(json);
			String opParam = jsonObject.getString("opParam");
			System.out.println(opParam);
			if(opParam.equals("view")){
				System.out.println("View in------------------!");
				
				String dataTable = jsonObject.getString("dataTable");
				JSONObject queryParams = jsonObject.getJSONObject("queryParams");

				String name = queryParams.getString("name");
				String value = queryParams.getString("value");
				System.out.println(value);
				System.out.println(name);
			}
		}catch(Exception pe){
			System.out.println("fail");
		}
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		this.doGet(request, response);
	}
}