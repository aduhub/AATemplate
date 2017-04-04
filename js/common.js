//イベント伝搬キャンセラー
function eventstop(e){
	console.log("stop");
	event.stopPropagation();
}
//オブジェクトプロパティ数
function oLen(obj){
	if(obj){
		return Object.keys(obj).length;
	}else{
		return 0;
	}
}
