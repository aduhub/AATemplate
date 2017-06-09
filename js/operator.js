var Operator = {}
Operator.v = {
	stack:[],
	trash:[],
	relay:false,
	lock:false
}
Operator.f = {
	init(){
		//Ticker
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", Operator.f.runStack);
	},
	//{fnc,arg|relay,next}
	addStack(arg){
		if(typeof arg == "function"){
			Operator.v.stack.push({fnc:arg, arg:true});
		}else{
			Operator.v.stack.push(arg);
		}
	},
	runStack(){
		//check stack
		if (!Operator.v.lock && Operator.v.stack.length > 0){
			//取り出し
			var cmd = Operator.v.stack.shift();
			//遅延動作
			new Promise(function(resolve, rej) {
				//Lock
				Operator.v.lock = true;
				//function check
				if(typeof cmd.fnc == "function"){
					//引数取得
					let arg = (cmd.relay) ? Operator.v.relay : cmd.arg;
					//引継用保持 = 関数実行
					Operator.v.relay = cmd.fnc(arg);
				}
				//Resolve
				resolve(true);
			}).then(function(){
				//UnLock
				Operator.v.lock = false;
				//debug
				console.log("resolve");
				//即時呼び出し
				if(cmd.next){
					Operator.f.runStack();
				}
			});
			//処理済み
			Operator.v.trash.push(cmd);
		}
	},
	dummy:{}
}