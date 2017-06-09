//汎用オブジェクト
//Class定義
class gobj_class {
	//(id, {key:data})
	constructor(dat){
		this.id = (dat.id || Gobj._uniq());
		this.tag = {
			_dat:new Set(),
			add(val){
				this._dat.add(val);
			},
			del(val){
				this._dat.delete(val);
			},
			chk(tags){
				var res = true;
				for(let val of tags){
					res = (res && this._dat.has(val));
				}
				return res;
			}
		}
		for(let key in dat){
			if(!["id","tag"].includes(key)){
				this[key] = dat[key];
			}
			if(key == "tag"){
				for(let val of dat.tag){
					this.tag.add(val);
				}
			}
		}
	}
	//test
	linkfnc(){
		console.log("i'm "+this.id);
		return this;
	}
}
//オブジェクト検索ショートカット
//$G(#id,#id | tag,tag)
function $G(cmdstr){
	var cmdarr = cmdstr.split(",");
	if(cmdstr.includes("#")){
		if(cmdstr.includes(",")){
			return Gobj.searchId(cmdarr);
		}else{
			return Gobj.searchId(cmdstr);
		}
	}else{
		return Gobj.searchTag(cmdarr);
	}
}
//Object Controller
var Gobj = {
	ids:new Set(),
	objs:{},
	//新規作成
	new(dat){
		let gobj = new gobj_class(dat);
		if(dat.id){
			Gobj.ids.add(dat);
			Gobj.objs[gobj.id] = gobj;
		}
		return gobj;
	},
	//ID検索 (ID) > OBJ
	searchId(id){
		if(Array.isArray(id)){
			var rets = [];
			for(var i=0; i<=id.length-1; i++){
				if(Gobj.ids.has(id[i])){
					rets.push(Gobj.objs[id[i]]);
				}
			}
			return rets;
		}else{
			if(Gobj.ids.has(id)){
				return Gobj.objs[id];
			}else{
				return false;
			}
		}
	},
	//タグAND検索 (タグ[]) > OBJ[]
	searchTag(tags){
		var rets = [];
		for(let key in Gobj.objs){
			if(Gobj.objs[key].tag.chk(tags)){
				rets.push(Gobj.objs[key]);
			}
		}
		return rets;
	},
	//複製
	copy(id1, id2){
		let dat = {};
		for(let[key, val] of Gobj.ids[id1]){
			if(key!="id"){
				dat[key] = val;
			}
		}
		//
		Gobj.new(id2, dat);
	},
	//UniqueID生成(文字長さ)
	_uniq(){
		var res = "";
		for(let i=1; i<=8; i++){
			res += Math.random().toString(36).slice(-1);
		}
		return res;
	}
}