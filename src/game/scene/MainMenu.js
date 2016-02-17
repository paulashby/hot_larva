(function () {
	
	"use strict";
	
	PrimeEight.HotLarva.MainMenu = function (game) {

		this.music = null; 

	};

	PrimeEight.HotLarva.MainMenu.prototype = {

		create: function () {  
			this.FONT_SIZE = Math.floor(PrimeEight.HotLarva.gameHeight/9.4);
 
			this.background = this.game.add.sprite(0,0, 'mainmenubg');
			this.background.inputEnabled = true;
			this.background.events.onInputDown.add(this.onPlay, this, this);
		
			this.backgroundElements = this.add.group();
		
			this.mmlogo = this.game.add.sprite(PrimeEight.HotLarva.viewWidth * 0.5, PrimeEight.HotLarva.viewHeight * 0.4, 'logo');
			this.mmlogo.anchor.setTo(0.5, 0.5);
			this.backgroundElements.add(this.mmlogo);
		
			this.playbg = this.game.add.sprite(0,0, 'playbg');
			this.backgroundElements.add(this.playbg);		
			this.playLink = this.game.add.bitmapText(0, PrimeEight.HotLarva.viewHeight * 0.75, 'SlackeyPrime8', 'play', this.FONT_SIZE);
			this.playLink.x = (PrimeEight.HotLarva.viewWidth * 0.8) - this.playLink.width/2;
			this.backgroundElements.add(this.playLink);
			this.playbg.x = this.playLink.x - (this.playLink.width * 0.13);
			this.playbg.y = this.playLink.y - (this.playLink.height * 0.2);
		
			this.mmcritter = this.game.add.sprite(PrimeEight.HotLarva.viewWidth * 0.47, PrimeEight.HotLarva.viewHeight * 0.73, 'mainmenucritter');
			this.mmcritter.anchor.setTo(0.5, 0.5);
		
			this.backgroundTween = this.add.tween(this.backgroundElements);
		  this.backgroundTween.to( { y: this.backgroundElements.y + PrimeEight.HotLarva.gameHeight * 0.5 }, 200, Phaser.Easing.Quadratic.InOut)
		  .to( { y: - PrimeEight.HotLarva.gameHeight }, 200, Phaser.Easing.Quadratic.In);
	
			this.critterTween = this.add.tween(this.mmcritter);
		  this.critterTween.to( { y: this.mmcritter.y - PrimeEight.HotLarva.gameHeight * 0.2 }, 200, Phaser.Easing.Quadratic.InOut)
		  .to( { y: PrimeEight.HotLarva.gameHeight }, 200, Phaser.Easing.Quadratic.In);
			this.critterTween._lastChild.onComplete.add(this.onCritterTweenComplete, this);
		},	 
		onCritterTweenComplete: function(){
			this.game.state.start('Instructions');
		},
		removeTween: function(_tween) {
			if (_tween) {
				_tween.onComplete.removeAll();
				_tween.stop();
				_tween = null;
			}
		},
		shutdown: function(){
			this.removeTween(this.backgroundTween);
			this.removeTween(this.critterTween);
			this.background.destroy();
			this.backgroundElements.destroy(true);
			this.mmcritter.destroy();
		},
		onPlay: function(game) { 
			this.backgroundTween.start();
			this.critterTween.start(); 

		}
	};
}());