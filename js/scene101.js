//SCENE FILE
//Scene毎に1ﾌｧｲﾙであらゆる雑用を全て含む
//Sceneファイルからは外部ライブラリの名称を利用するが逆はなし。
var scene101 = {}
scene101.v = {
	active:false,
	login:false,
	room:""
}
//共通関数
scene101.f = {
	init:function(){
		scene101.v.active = true;
		$("#scene101").css("display","block");
		//ネットワーク
		scene101.f.netstart();
	},
	netstart:function(){
		//Firebase
		fb.f.init();
		//menu
		$("#account_menu").css("discplay","block");
	},
	dummy:{}
}
//SIGNUP 処理
scene101.signup = {
	init:function(){
		$("#account_menu").css("display","none");
		$("#account_signup").css("display","block");
	},
	entry:function(){
		var mail = $("#signup_mail").val();
		var pass = $("#signup_pass").val();
		//Firebase Auth Create
		fb.f.authCreate({
			mail:mail, pass:pass, f:function(){
				scene101.e("signup", "fb_ok")
			}
		});
	},
	fb_ok:function(){
		var name = $("#signup_name").val();
		//名前更新
		fb.f.updName({name:name});
		console.log("name upd");
	},
	close:function(){
		$("#account_signup").css("display", "none");
	}
}
//LOGIN 処理
scene101.login = {
	init:function(){
		$("#account_menu").css("display","none");
		$("#account_login").css("display","block");
	},
	check:function(){
		var mail = $("#login_mail").val();
		var pass = $("#login_pass").val();
		//Firebase Auth Create
		fb.f.authLogin({
			mail:mail, pass:pass, f:function(){
				scene101.e("login", "fb_ok")
			}
		});
	},
	fb_ok:function(){
		console.log("login ok");
	},
	close:function(){
		$("#account_loginup").css("display", "none");
	}
}
//Room 処理
scene101.room = {
	init:function(){
		//ready Room 検索
		fb.q.SELECT({path:"rooms",where:[["status","ready"]],one:true,f:function(r){scene101.room.join(r)}});
	},
	join:function(result){
		var key;
		//Rooms(ready)存在チェック
		if(result){
			key = Object.keys(result)[0];
			if(oLen(result[key].chair) <= 3){
				//Room 参加
				fb.q.UPDATE({path:"rooms/"+key+"/chair/"+fb.U(), obj:"ready"});
			}
			if(oLen(result[key].chair) == 3){
				//Room 締切
				fb.q.UPDATE({path:"rooms/"+key+"/chair/status", obj:"close"});
			}
		}else{
			//Room 作成
			key = fb.q.INSERT({path:"rooms", obj:fb.J("{status:ready,chair:{"+fb.U()+":ready}}")});
		}
		//データ変更時取得
		fb.f.hookEvent({path:"rooms/"+key,f:function(json){scene101.room.check(json)}});
	},
	check:function(json){
		console.log(json);
	},
	dummy:{}
}
//外部イベント
scene101.e = function(id, type){
	switch(id){
	case "menu":
		switch(type){
		case "signup":
			scene101.signup.init();
			break;
		case "login":
			scene101.login.init();
			break;
		case "play":

			break;
		}
	case "signup":
		switch(type){
		case "button":
			scene101.signup.entry();
			break;
		case "fb_ok":
			scene101.signup.fb_ok();
		case "cancel":
			scene101.signup.close();
			break;
		}
		break;
	case "login":
		switch(type){
		case "button":
			scene101.login.check();
			break;
		case "fb_ok":
			scene101.login.fb_ok();
		case "cancel":
			scene101.login.close();
			break;
		}
		break;
	case "room":
		switch(type){
		case "change":
			scene101.room.check();
			break;
		}
		break;
	}
}
