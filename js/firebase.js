//################################
//#  Firebase処理
//################################
var fb = {}
fb.f = {
	//初期処理
	init:function(){
		// Initialize Firebase
		var config = {
			apiKey: "AIzaSyA7L1uQ7MQHiyF6G2v2PXgKxao9RbVwiI4",
			authDomain: "testbase-4a5eb.firebaseapp.com",
			databaseURL: "https://testbase-4a5eb.firebaseio.com",
			storageBucket: "testbase-4a5eb.appspot.com",
			messagingSenderId: "3525282924"
		};
		firebase.initializeApp(config);
		//log
		console.log('Firebase_初期処理');
		//正常終了
		return true;
	},
	//アカウント作成
	authCreate:function(arg){
		var mail = arg.mail;
		var pass = arg.pass;
		//メールアドレス
		if(!mail.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
			return false;
		}
		//パスワード
		if(!pass.match(/^[a-z\d]{8,100}$/i)){
			return false;
		}
		//アカウント作成
		firebase.auth().createUserWithEmailAndPassword(mail, pass).then(function(e){
			if(typeof arg.f == "function"){
				arg.f();
			}
			console.log('fb_createAccount');
		}).catch(function(error) {
			console.log('fb_error:'+error.message);
		});
		//正常終了
		return true;
	},
	//認証処理
	authLogin:function(arg){
		var mail = arg.mail;
		var pass = arg.pass;
		//アカウント認証
		firebase.auth().signInWithEmailAndPassword(mail, pass).then(function(e){
			if(typeof arg.f == "function"){
				arg.f();
			}
			console.log('fb_login:'+e.uid);
		}).catch(function(error) {
			console.log('fb_error:'+error.message);
		});
	},
	//ディスプレイネーム設定
	updName:function(arg){
		var user = firebase.auth().currentUser;
		//ログイン済み
		if(user){
			user.updateProfile({displayName:arg.name}).then(function(){
				// Update successful.
			},function(error){
				console.log('fb_error:' + error.message);
			});
		}
	},
	//ID取得
	getUID:function(){
		var userId = firebase.auth().currentUser.uid;
		return userId;
	},
	//イベントフック
	//{path,[ev],f}
	hookEvent:function(arg){
		firebase.database().ref(arg.path).on((arg.ev || "value"), function(snapData){arg.f(snapData.val())});
	},
	dummy:{}
}
//Firebase Query
fb.q = {
	//データ取得
	//{path,where[],f()}
	SELECT:function(arg){
		var query = firebase.database().ref(arg.path);
		if(arg.where){
			for (var i=0; i<=arg.where.length-1; i++){
				if(arg.where[i].length == 2){
					query = query.orderByChild(arg.where[i][0]).equalTo(arg.where[i][1]);
				}
			}
		}
		query.once('value').then(function(arg, snap){fb.q.SELECT_EX(arg, snap)});
	},
	SELECT_EX:function(arg, snap){
		var where, item;
		var ret = {};
		var obj = snap.val();
		for(var key in obj){
			for (var i=0; i<=arg.where.length-1; i++){
				where = arg.where[i];
				item = (where[0] == "key") ? key : obj[key][where[0]];
				if(where.length == 3){
					//否定式
					if(where[1] == "not" && where[2].split(",").indexOf(item) >= 0){
						continue;
					}
				}
			}
			ret[key] = obj[key];
		}
		if(arg.f){
			arg.f(ret);
		}
	},
	//{path,obj}
	INSERT:function(arg){
		var ref = firebase.database().ref(arg.path).push(arg.obj);
		return ref.key;
	},
	//{path,obj}
	UPDATE:function(arg){
		firebase.database().ref(arg.path).set(arg.obj);
	},
	//{path}
	DELETE:function(arg){
		firebase.database().ref(arg.path).remove();
	},
	//更新項目作成
	//[]
	SET:function(arg){
		var str = '{rep}';
		for(var i=0; i<=arg.length-2; i++){
			if(i==arg.length-2){
				str = str.replace(/rep/g, '"'+arg[i]+'":"'+arg[i+1]+'"');
			}else{
				str = str.replace(/rep/g, '"'+arg[i]+'":{rep}');
			}
		}
		var obj = JSON.parse(str);
		return obj;
	},
	JSON:function(str){
		var formated = str.replace(/\{/g, "{\"").replace(/\}/g, "\"}").replace(/:/g, "\":\"").replace(/,/g, "\",\"").replace(/:"\{/g, ":{").replace(/\}"\}/g, "}}");
		var json = JSON.parse(formated);
		return json;
	},
	dummy:{}
}
//ショートカット
fb.J = fb.q.JSON;
fb.S = fb.q.SET;
fb.U = fb.f.getUID;