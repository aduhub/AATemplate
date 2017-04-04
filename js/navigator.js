//Object
var Navi = {
	scene:{},
	status:"",
	fps:30,
	engine_id:0,
	stack:[]
}
//初期処理
Navi.init = function(){
	//start scene
	Navi.scene = scene101;
	//frame start
	Navi.engine();
}
//指示エンジン
Navi.engine = function(){
	//Navigation Stack
	if(Navi.stack.length > 0){

	}
	//Normal routine

	//1frame
	if(Navi.fps >= 1){
		Navi.engine_id = setTimeout(Navi.engine, Math.floor(1000 / Navi.fps));
	}
}