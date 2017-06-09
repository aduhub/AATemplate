//描画関連ライブラリ ※EaselJSを使用
var Art = {}
Art.cvss = {} //Canvas記憶
Art.containers = {} //Image
Art.ssheets = new Map();
Art.v = {     //内部変数
	prevCanvas:null,
	prevLayer:null,
	prevId:null,
	defFont:"Verdana",
	defFontpx:32,
	stamp:new Map()
}
Art.e = {}
//内部関数
Art.f = {
	//初期設定
	init:function(){
		createjs.Ticker.setFPS(4);
	},
	//Canvas追加
	//{canvas:CanvasID,laynum:レイヤー数}
	addCanvas:function(arg){
		//Stage生成
		var canvas = new createjs.Stage(arg.canvas);
		Art.cvss[arg.canvas] = canvas;
		//MouseOver使用可能
		canvas.enableMouseOver();
		//Frame生成
		var frame = new createjs.Container();
		frame.name = "frame";
		//Layer生成
		var layer = [];
		var laynum = (arg.laynum || 1) + 1;
		for (var i = 0; i <= laynum; i++) {
			layer.push(new createjs.Container());
			switch (i) {
			case 0:
				layer[i].name = "layerbg";
				break;
			case laynum:
				layer[i].name = "layerfg";
				break;
			default:
				layer[i].name = "layer" + i;
				break;
			}
			frame.addChildAt(layer[i], i);
		}
		canvas.addChild(frame);
		//Ticker
		createjs.Ticker.addEventListener("tick", canvas);
		//後処理
		Art.f.cleanup(arg);
	},
	//イメージ描画
	//{[canvas],[layer],id,x,y,img:[{src, x, y}...],padding{x,y}}
	addImg:function(arg){
		var layer = Art.f.lay(arg);
		//イメージ読み出し
		var preload = new createjs.LoadQueue(false);
		var manifest = [];
		for(var i=0; i<=arg.img.length-1; i++){
			manifest.push({id:"img"+i, src:arg.img[i].src});
		}
		preload.addEventListener("complete", function(){
			//Frame生成
			var imgframe = new createjs.Container();
			imgframe.x = (arg.x || 0);
			imgframe.y = (arg.y || 0);
			//id保持
			if(arg.id){
				imgframe.name = arg.id;
			}
			var imgnum = (Array.isArray(arg.img)) ? arg.img.length - 1 : 0;
			for(var i=0; i<=imgnum; i++){
				var bitmap = new createjs.Bitmap(preload.getResult("img"+i));
				bitmap.x = (arg.img[i].x || 0);
				bitmap.Y = (arg.img[i].y || 0);
				//hitArea
				if(arg.id && i==0){
					var shape = new createjs.Shape();
					var p = {x:0, y:0};
					if(arg.padding){
						p.x = (arg.padding.x || 0);
						p.y = (arg.padding.y || 0);
					}
					shape.graphics.beginFill("black");
					shape.graphics.drawEllipse(p.x, p.y, bitmap.getBounds().width-p.x*2, bitmap.getBounds().height-p.y*2);
					imgframe.hitArea = shape;
					//イベントアタッチ
					arg.frame = imgframe;
					Art.f.evatt(arg);
				}
				imgframe.addChildAt(bitmap, i);
			}
			//追加
			layer.addChild(imgframe);
			//
			if(arg.id) {
				//イメージリスト
				Art.containers[arg.id] = {id:arg.id, canvas:Art.f.cvs(arg), layer:Art.f.lay(arg)}
			}
		});
		preload.loadManifest(manifest, true);
		//後処理
		Art.f.cleanup(arg);
	},
	//イメージ移動 {[canvas],[layer],id,(move{x,y}|tween{to,msec})}
	moveImg:function(arg){
		//イメージ選択
		var layer = Art.f.lay(arg);
		var imgframe = layer.getChildByName(arg.id);
		//tween
		if(arg.tween){
			var tween = createjs.Tween.get(imgframe);
			tween.to(arg.tween.to, (arg.tween.msec || 200));
			tween.play();
		}else{
			//即時移動
			if(arg.move) {
				imgframe.x = (arg.move.x || imgframe.x);
				imgframe.y = (arg.move.y || imgframe.y);
			}
		}
		//後処理
		Art.f.cleanup(arg);
	},
	//イメージ複製 {fr{[canvas],[layer],id,x,y},to{[canvas],[layer],id,x,y}}
	copyImg:function(arg){
		if(arg.fr && arg.to){
			var layer0 = Art.f.lay(arg.fr);
			var layer1 = Art.f.lay(arg.to);
			var imgframe0 = layer0.getChildByName(arg.fr.id);
			var imgframe1 = imgframe0.clone(true);
			imgframe1.name = (arg.to.id || "");
			imgframe1.x = (arg.to.x || imgframe1.x);
			imgframe1.y = (arg.to.y || imgframe1.y);
			//イベント追加
			arg.to.frame = imgframe1;
			Art.f.evatt(arg.to)
			//レイヤーに追加
			layer1.addChild(imgframe1);
		}
	},
	//文字列 {[canvas],[layer],[frame],text{v,s,f,c},[outline{w,c}]}
	addText:function(arg){
		//出力先
		var layer = Art.f.lay(arg);
		var outframe = (arg.frame) ? layer.getChildByName(arg.frame) : layer;
		//テキスト作成
		var txtframe = new createjs.Container();
		var text = new createjs.Text(arg.text.v, (arg.text.s||Art.v.defFontpx)+"px "+(arg.text.f||Art.v.defFont), (arg.text.c||"#000000"));
		text.textAlign = (arg.text.a||"left");
		text.textBaseline = "top";
		text.x = (arg.x || (arg.frame) ? outframe.getChildAt(0).image.width / 2 : 0);
		text.y = (arg.y || (arg.frame) ? outframe.getChildAt(0).image.height / 2 : 0);
		txtframe.addChild(text);
		if(arg.outline){
			var line = text.clone();
			line.color = (arg.outline.c||"#ffffff");
			line.outline = arg.outline.w;
			txtframe.addChild(line);
		}
		outframe.addChild(txtframe);
		//後処理
		Art.f.cleanup(arg);
	},
	//文字列 {[canvas],[layer],[frame],text{v,s,f,c},[outline{w,c}]}
	entryStamp:function(arg) {
		//登録
		Art.v.stamp.set(arg.id, arg.stamp);
	},
	addStamp:function(arg){
		var stamp = Art.v.stamp.get(arg.id);
		if(stamp){
			//出力先
			var layer = Art.f.lay(arg);
			//図形
			if(arg.fillcolor){
				var shape = new createjs.Shape();
				shape.graphics.beginFill(arg.fillcolor);
				shape.graphics.moveTo(arg.point[0][0], arg.point[0][1]);
				for(let i=1; i<=arg.point.length-1; i++){
					shape.graphics.moveTo(arg.point[0][0], arg.point[0][1]);
				}
				layer.addChild(shape);
			}
			if(arg.linecolor){
				var shape = new createjs.Shape();
				shape.graphics.beginStroke(arg.linecolor);
				shape.graphics.moveTo(arg.point[0][0], arg.point[0][1]);
				for(let i=1; i<=arg.point.length-1; i++){
					shape.graphics.moveTo(arg.point[0][0], arg.point[0][1]);
				}
				layer.addChild(shape);
			}
		}
		//後処理
		Art.f.cleanup(arg);
	},
	//ダイヤ {xywh, line, fill, pen}
	addDiamond:function(arg){
		var x, y, w, h;
		//出力先
		var layer = Art.f.lay(arg);
		var shape = new createjs.Shape();
		shape.graphics.beginStroke(arg.line);
		if(arg.fill){
			shape.graphics.beginFill(arg.fill);
		}
		if(arg.pen){
			shape.graphics.setStrokeStyle(arg.pen);
		}
		[x, y, w, h] = arg.xywh;
		shape.graphics.moveTo(x + Math.floor((w-1)/2), y);
		shape.graphics.lineTo(x + Math.floor(w/2), y);
		shape.graphics.lineTo(x + w, y + Math.floor((h-1)/2));
		shape.graphics.lineTo(x + w, y + Math.floor(h/2));
		shape.graphics.lineTo(x + Math.floor(w/2), y + h);
		shape.graphics.lineTo(x + Math.floor((w-1)/2), y + h);
		shape.graphics.lineTo(x, y + Math.floor(h/2));
		shape.graphics.lineTo(x, y + Math.floor((h-1)/2));
		shape.graphics.lineTo(x + Math.floor((w-1)/2), y);
		layer.addChild(shape);
	},
	//{src,fw,fh,ani{}}
	preSprite:function(arg){
		var SpriteDat = {};
		var Anime = {};
		SpriteDat.images = [arg.src];
		SpriteDat.frames = {width:arg.fw, height:arg.fh, regX:0, regY:0, spacing:0, margin:0};
		for(let [key,val] of arg.ani){
			Anime[key] = val;
		}
		SpriteDat.animations = Anime;
		var mySSheet = new createjs.SpriteSheet(SpriteDat);
		//Spriteをストック
		Art.ssheets.set(arg.id, mySSheet);
	},
	//{id,ssid,x,y}
	addSprite(arg){
		if(Art.v.ssheets.has(arg.ssid)){
			//出力先
			var layer = Art.f.lay(arg);
			var mySprite = new createjs.Sprite(Art.v.ssheets[arg.ssid]);
			mySprite.name = arg.id;
			mySprite.x = arg.x;
			mySprite.y = arg.y;
			//レイヤーに追加
			layer.addChild(mySprite);
		}

	},
	//イベント追加 {[canvas],[layer],id,[act],f}
	addEvent:function(arg){
		var id = (arg.id || Art.v.prevId);
		var act = (arg.act || "click");
		if(typeof arg.f == "function"){
			Art.e[id+"-"+act] = arg.f;
		}
		//後処理
		Art.f.cleanup(arg);
	},
	//イベントアタッチ
	evatt:function(arg){
		arg.frame.addEventListener("click", function(e) {
			Art.f.event({id:arg.id, act:"click"});
		});
		arg.frame.addEventListener("mousedown", function(e) {
			Art.e[arg.id+"-offset"] = {x:e.stageX - e.target.x,y:e.stageY - e.target.y}
			Art.f.event({id:arg.id, act:"mousedown"});
		});
		arg.frame.addEventListener("mouseup", function(e) {
			Art.e[arg.id+"-offset"] = null
			Art.f.event({id:arg.id, act:"mouseup"});
		});
		arg.frame.addEventListener("mouseover", function(e) {
			Art.f.event({id:arg.id, act:"mouseover"});
		});
		if(arg.drag){
			frame.addEventListener("pressmove", function(e) {
				e.target.x = e.stageX - Art.e[arg.id+"-offset"].x;
				e.target.y = e.stageY - Art.e[arg.id+"-offset"].y;
			});
		}
	},
	//イベント発生
	event:function(arg){
		var ev_id = arg.id+"-"+arg.act;
		if(typeof Art.e[ev_id] == "function"){
			Art.e[ev_id]();
		}else{
			console.log(ev_id);
		}
	},
	//後処理関数
	cleanup:function(arg){
		//Canvas id
		if (arg.canvas) {
			Art.v.prevCanvas = arg.canvas;
		}
		//Container Name
		if (arg.layer) {
			if(arg.layer != "layerfg"){
				Art.v.prevLayer = arg.layer;
			}
		}
		//Image Container id
		if (arg.id) {
			Art.v.prevId = arg.id;
		}
	},
	//オブジェクトショートカット
	cvs:function(arg){
		return Art.cvss[(arg.canvas || Art.v.prevCanvas)];
	},
	lay:function(arg){
		var canvas = Art.f.cvs(arg);
		var frame = canvas.getChildByName("frame");
		if(Array.isArray(arg.layer)){
			var layers = [];
			for(var i=0; i<=arg.layer.length-1; i++){
				layers.push(frame.getChildByName(arg.layer[i]));
			}
			return layers;
		}else{
			var layer = frame.getChildByName((arg.layer || Art.v.prevLayer || "layer1"));
			return layer;
		}
	},
	dummy:{}
}
var $A = function(id){
	if(Art.containers.id){
		return Art.f.obj(id);
	}else{
		return false;
	}
}