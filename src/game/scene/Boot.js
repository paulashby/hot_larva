//namespace
var PrimeEight = {
};

(function () {
	
	"use strict";
	
	PrimeEight.HotLarva = {
	
	};


	PrimeEight.HotLarva.Boot = function (game) {
		return this;
	};


	PrimeEight.HotLarva.Boot.prototype = {

		preload: function () {
			this.load.image('preloaderBackground', 'assets/preloader_background.png');
			this.load.image('preloaderBar', 'assets/preloader_bar.png');
		},

		create: function () {
		
			this.input.maxPointers = 1;
			this.stage.disableVisibilityChange = true;
			this.scaleStage();
			this.state.start('Preloader');

	   },
   
		scaleStage:function(){
			if (this.game.device.desktop)
	       {
	           this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; 
	       }
	       else
	       {
	           this.scale.scaleMode = Phaser.ScaleManager.NO_BORDER;
	           this.scale.forceOrientation(true, false);
	           this.scale.hasResized.add(this.gameResized, this);
	           this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
	           this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
	           this.scale.setScreenSize(true);
	       }
       
	       this.scale.minWidth = PrimeEight.HotLarva.gameWidth/2;
	       this.scale.minHeight = PrimeEight.HotLarva.gameHeight/2;
	       this.scale.maxWidth = PrimeEight.HotLarva.gameWidth;
	       this.scale.maxHeight = PrimeEight.HotLarva.gameHeight;
	       this.scale.pageAlignHorizontally = true;
	       this.scale.pageAlignVertically = true;
	       this.scale.setScreenSize(true);
       
				if(this.scale.scaleMode===Phaser.ScaleManager.NO_BORDER){
						PrimeEight.HotLarva.viewX = (this.scale.width/2 - window.innerWidth/2)*this.scale.scaleFactor.x;
						PrimeEight.HotLarva.viewY = (this.scale.height/2 - window.innerHeight/2 - 1)*this.scale.scaleFactor.y;
						PrimeEight.HotLarva.viewWidth = PrimeEight.HotLarva.gameWidth-PrimeEight.HotLarva.viewX;
						PrimeEight.HotLarva.viewHeight = PrimeEight.HotLarva.gameHeight-PrimeEight.HotLarva.viewY;
				}
				else {
						PrimeEight.HotLarva.viewX = 0;
						PrimeEight.HotLarva.viewY = 0;
						PrimeEight.HotLarva.viewWidth = PrimeEight.HotLarva.gameWidth;
						PrimeEight.HotLarva.viewHeight = PrimeEight.HotLarva.gameHeight;
				}

			this.styleGameDiv();
	   },

		gameResized: function (width, height) {
			this.styleGameDiv();
	   },

	   enterIncorrectOrientation: function () {

	       PrimeEight.HotLarva.orientated = false;

	       document.getElementById('orientation').style.display = 'block';

	   },

	   leaveIncorrectOrientation: function () {

	       PrimeEight.HotLarva.orientated = true;

	       document.getElementById('orientation').style.display = 'none';
				this.scaleStage();
	   }, 
		styleGameDiv: function () {
			document.getElementById("game").style.width = window.innerWidth+"px";
			document.getElementById("game").style.height = window.innerHeight-1+"px";//The css for body includes 1px top margin, I believe this is the cause for this -1
			document.getElementById("game").style.overflow = "hidden";
		}
	};
}());