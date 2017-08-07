# mysql触发器举例

	`delimiter ;;`  
	`drop trigger if exists del_user_with_userinfo;;`  
	`create trigger del_user_with_userinfo after delete on `userinfos` for each row`
	`begin`  
	    `delete from `users` where `users`.id=old.userid;`  
	`end;;`  
	`delimiter ; ` 

	`delimiter ;;`  
	`drop trigger if exists del_userinfo_with_user;;`  
	`create trigger del_userinfo_with_user after delete on `users` for each row`  
	`begin`  
	    `delete from `userinfos` where `userinfos`.userid=old.id;`  
	`end;;`  
	`delimiter ;`  

	`delimiter ||`      //mysql 
	`drop trigger if exists updatename||`    
	`create trigger updatename after update on user for each row`   
	`begin`  
		//old,new 
		`if new.name!=old.name then`   // 
		   `update comment set comment.name=new.name where comment.u_id=old.id;`  
		`end if;`  
	`end||`  
	`delimiter ;`
