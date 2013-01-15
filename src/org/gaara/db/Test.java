package org.gaara.db;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
public class Test {
/**
* @param args
*/
public static void main(String[] args) {
	
	//第一种情况

    String sql1="Select * From student";

    //第一步：查询

    ResultSet rs1 = DBHelper.executeQuery(sql1);

    //第二步：输出

    try {
		while(rs1.next()){

		    System.out.println("姓名："+rs1.getString(2));
		}
	} catch (SQLException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}

    //第三步：关闭

    DBHelper.free(rs1);
}
}
