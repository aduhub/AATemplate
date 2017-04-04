var Operator = {}
Operator.v = {
	stack:[],
	relay:false,
	relay_word:"#",
	lock:false
}
Operator.f = {
	init:function(){
		//Ticker
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", Operator.f.runStack);
	},
	addStack:function(fnc, arg=true){
		if(typeof fnc == "object"){
			Operator.v.stack.push(fnc);
		}else{
			Operator.v.stack.push({f:fnc, a:arg});
		}
	},
	runStack:function(){
		//check stack
		if (!Operator.lock && Operator.v.stack.length > 0){
			//取り出し
			var cmd = Operator.v.stack.shift();
			//遅延動作
			new Promise(function (res, rej) {
				//Lock
				Operator.lock = true;
				//function check
				if(typeof cmd.f == "function"){
					//引数取得
					let arg = (cmd.a==Operator.v.relay_word) ? Operator.v.relay : cmd.a;
					//引継用保持 = 関数実行
					Operator.v.relay = cmd.f(arg);
				}
				//Resolve
				res(true);
			}).then(function(){
				//UnLock
				Operator.lock = false;
				//debug
				console.log("resolve");
			});
		}
	},
	dummy:{}
}