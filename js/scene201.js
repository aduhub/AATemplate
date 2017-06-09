var scene201 = {}
scene201.v = {

}
scene201.f = {
	init:function(){
		$("#scene201").css("display","block");
		Art.f.addCanvas({canvas:"canvas201"});
		//[canvas],[layer],id,x,y,img:[{src, x, y}],padding{x,y}
		Art.f.addImg({layer:"layerbg", id:dat.id, x:dat.x, y:dat.y, img:{src:"img/box.png"}});
	}
}
scene201.e = {

}