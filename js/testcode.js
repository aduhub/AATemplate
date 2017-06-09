var test = {}
//##########[ firebase ]##########
//よみこみ
test.login = function(no) {
	var mail = "test1@server.com";
	var pass = "password";
	if(no){
		switch(no){
		case 2:
			mail = "test2@server.com";
			break;
		case 3:
			mail = "test3@server.com";
			break;
		}
	}
	//init
	fb.f.init();
	//login
	firebase.auth().signInWithEmailAndPassword(mail, pass).then(function(e){
		console.log('fb_login:');
	}).catch(function(error) {
		console.log('fb_error:'+error.message);
	});
}
//##########[ Operator ]##########
test.ope = function(){
	Operator.f.init();
	Operator.f.addStack({fnc:test.ope2, arg:"opetestdayo."});
	Operator.f.addStack({fnc:test.ope2, relay:true});
	Operator.f.addStack({fnc:test.ope2, relay:true});
	Operator.f.addStack(test.ope2);
}
test.ope2 = function(msg){
	console.log(msg);
	return `${msg}men.`
}

//##########[ Object ]##########
test.gobj = function(){
	var a = Gobj.new({id:"a",hp:10,st:10});
	a.tag.add("fxxk");
	a.tag.add("die");
	var b = Gobj.new({id:"b"});
	b.tag.add("big");
	b.tag.add("fxxk");
	console.log($G("fxxk"));
}
test.tagst = function(...tags){
	return tags;
}
//##########[ Generator ]#########
test.gen = function(){
	let gencnt = 0;
	function* gen(){
		gencnt++;
		yield gencnt;
	}
	console.log(gen().next().value);
	console.log(gen().next().value);
}

//##########[ Artist ]##########
test.art = function (){
	$("#scene201").css("display","block");
	Art.f.addCanvas({canvas:"canvas201"});
	Art.f.addText({text:{v:"test"}});
	Art.f.addDiamond({line:"#333333",fill:"#888888",xywh:[50,20,100,40],pen:2});
}
test.spr = {
	testCvs:{},
	testAni:{},
	init:function(){
		testCvs = new createjs.Stage("canvas101");
		testAni = test.spr.create("img/peng.png");
		testCvs.addChild(testAni);
		testAni.x = 200;
		testAni.y = 50;
		testAni.gotoAndPlay("walk");
		createjs.Ticker.setFPS(4);
		createjs.Ticker.addEventListener("tick", testCvs);
	},
	create:function(file) {
		var data = {};
		data.images = [file];
		data.frames = {width:82, height:109, regX:41, regY:55};
		data.animations = {walk:{frames:[0, 0, 1, 2, 2, 3]}};
		var mySSheet = new createjs.SpriteSheet(data);
		var mySprite = new createjs.Sprite(mySSheet);
		return mySprite;
	}
}


