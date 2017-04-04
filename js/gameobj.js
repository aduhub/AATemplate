//汎用オブジェクト
class gobj_class {
	//(id, {key:data})
	constructor(id, dat){
		this.id = id;
		this.tags = new Set();
		if(dat) {
			for(let key in dat){
				this[key] = dat[key];
			}
		}
	}
	set tag(val){
		this.tags.add(val);
	}
	get tag(){
		return this.tags;
	}
	deltag(...vals){
		for(var val of vals){
			this.tags.delete(val);
		}
	}
	//test
	linkfnc(){
		console.log("i'm "+this.id);
		return this;
	}
}
//オブジェクトコントローラー
class gobj_controller {
	constructor(){
		this.ids = new Set();
		this.objs = {}
	}
	//新規作成
	new(id, dat){
		if(this.ids.has(id) == false){
			this.ids.add(id);
			this.objs[id] = new gobj_class(id, dat);
		}
		return this.objs[id];
	}
	//id検索
	id(id){
		if(Array.isArray(id)){
			var rets = [];
			for(var i=0; i<=id.length-1; i++){
				if(this.ids.has(id[i])){
					rets.push(this.objs[id[i]]);
				}
			}
			return rets;
		}else{
			if(this.ids.has(id)){
				return this.objs[id];
			}else{
				return false;
			}
		}
	}
	//tag検索
	tag(...tags){
		var rets = [];
		for(let id in this.objs){
			let cnt = 0;
			for(let val of tags){
				if(this.objs[id].tag.has(val)){
					cnt++;
				}
			}
			if(tags.length == cnt){
				rets.push(this.objs[id]);
			}
		}
		return rets;
	}
}
var Gobj = new gobj_controller();