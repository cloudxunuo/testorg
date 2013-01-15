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

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class GridHandlerServlet extends HttpServlet{
	public GridHandlerServlet() {
		super();
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		
		System.out.println("GridHandlerServlet in------------------!");
		String json = readJSONStringFromRequestBody(request);
		
		JSONObject jsonObject = null;
		try{
			jsonObject = JSONObject.fromObject(json);
			String pageParam = jsonObject.getString("opParam");
			
			if(pageParam.equals("view")){
				System.out.println("View in------------------!");
				
				//test();
			}
		}catch(Exception pe){
			
		}
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		this.doGet(request, response);
	}
	
	private String readJSONStringFromRequestBody(HttpServletRequest request) {  
	    StringBuffer json = new  StringBuffer();  
	    String line = null ;  
	    try{  
	        BufferedReader reader = request.getReader();  
	        while ((line = reader.readLine()) != null ){  
	            json.append(line);  
	        }   
	    }   
	      catch (Exception e){  
	        System.out.println( "Error reading JSON string:  "   +  e.toString());  
	    }   
	    return json.toString();  
	}  
}