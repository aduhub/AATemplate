var Director = {}
Director.f = {
	gameinit:function(){
		//Map
		scene201.f.init();
		//
		var mapdata = [];
		for(let dat in mapdata){
			//
			Gobj.new(dat);
			Art.f.preSprite({src:"img/box.png",fx:128});
		}

	},
	dammy:{}
}