(function () {
	
	"use strict";
	
	PrimeEight.HotLarva.GameOver = function (game) {
		return this;
	};

	PrimeEight.HotLarva.GameOver.prototype = {

	  create: function () {
		  if(PrimeEight.HotLarva.background){
				PrimeEight.HotLarva.background.destroy();
				PrimeEight.HotLarva.background = null;
			}
			this.PLAY_X = PrimeEight.HotLarva.viewWidth * 0.33;
			this.SHARE_X =  PrimeEight.HotLarva.viewWidth * 0.67; 
			this.BUTTON_Y = PrimeEight.HotLarva.viewHeight * 0.7;
			this.SCORE_INSET = Math.floor(PrimeEight.HotLarva.gameWidth/60);
		
			this.mainFontSize = Math.floor(PrimeEight.HotLarva.viewHeight/9.4); 
			this.newBestFontSize  = Math.floor(PrimeEight.HotLarva.viewHeight/18);
		
			this.background = this.game.add.sprite(0,0, 'background'); 
		
			this.totalScore = PrimeEight.HotLarva.totalScore.toString();
			this.bestScore = localStorage.getItem('bestScore');
	
			if(this.bestScore === null || parseInt(this.bestScore, 10) < parseInt(this.totalScore, 10)){
				this.bestScore = this.totalScore;
				localStorage.setItem('bestScore', this.bestScore);
				this.newBestScoreLabel = this.game.add.bitmapText(0, PrimeEight.HotLarva.viewHeight * 0.32, 'SlackeyPrime8', 'new', this.newBestFontSize); 
				this.newBestScoreLabel.x = (PrimeEight.HotLarva.viewWidth * 0.24) - this.newBestScoreLabel.width;
			} 
		
			this.scoreGroup = this.add.group(); 
			this.buttonGroup = this.add.group();
		  
			this.buttonGroup.y = PrimeEight.HotLarva.viewHeight * 1.2;
		
			this.scoreLabel = this.game.add.bitmapText(PrimeEight.HotLarva.viewWidth * 0.25, PrimeEight.HotLarva.viewHeight * 0.15, 'SlackeyPrime8', 'score', this.mainFontSize);
			this.bestScoreLabel = this.game.add.bitmapText(PrimeEight.HotLarva.viewWidth * 0.25, PrimeEight.HotLarva.viewHeight * 0.3, 'SlackeyPrime8', 'best', this.mainFontSize);
		
			this.scoreText = this.game.add.bitmapText(PrimeEight.HotLarva.viewWidth * 0.57, PrimeEight.HotLarva.viewHeight * 0.15, 'SlackeyPrime8', this.totalScore, this.mainFontSize);
			this.bestScoreText = this.game.add.bitmapText(PrimeEight.HotLarva.viewWidth * 0.57, PrimeEight.HotLarva.viewHeight * 0.3, 'SlackeyPrime8', this.bestScore, this.mainFontSize);  
		
		 	this.scoreGroup.add(this.scoreLabel);
			this.scoreGroup.add(this.bestScoreLabel);
			this.scoreGroup.add(this.scoreText);
			this.scoreGroup.add(this.bestScoreText);
		
			this.playbg = this.game.add.sprite(0,0, 'playbg');
			this.playLink = this.game.add.bitmapText(this.PLAY_X, 0, 'SlackeyPrime8', 'play', this.mainFontSize);
			this.playLink.x = this.PLAY_X - (this.playLink.width/2.2);
			this.playLink.y = this.BUTTON_Y - (this.playLink.height/2);
			this.playbg.x = this.playLink.x - (this.playLink.width * 0.13);
			this.playbg.y = this.playLink.y - (this.playLink.height * 0.2);
			this.playbg.inputEnabled = true;
			this.playbg.events.onInputDown.add(this.onPlayAgain, this); 
		
			this.sharebg = this.game.add.button(0, 0, 'playbg', this.onMenu, this, 0, 0, 0, 0);
			this.shareLink = this.game.add.bitmapText(0, 0, 'SlackeyPrime8', 'menu', this.mainFontSize);
			this.shareLink.x = this.SHARE_X - (this.shareLink.width/2.2);
			this.shareLink.y = this.BUTTON_Y - (this.shareLink.height/2);
			this.sharebg.width = this.shareLink.width * 1.2;
			this.sharebg.x = this.SHARE_X - (this.sharebg.width/2);
			this.sharebg.y = this.BUTTON_Y - (this.sharebg.height/2);
			this.sharebg.inputEnabled = true;
			this.sharebg.events.onInputDown.add(this.onMenu, this);
		
		 	this.buttonGroup.add(this.playbg);
			this.buttonGroup.add(this.playLink);
			this.buttonGroup.add(this.sharebg);
			this.buttonGroup.add(this.shareLink); 
		
			this.woosh = this.game.add.audio('woosh');
		
			this.buttonGroupTween = this.game.add.tween(this.buttonGroup).to({y: 0}, 500, Phaser.Easing.Bounce.Out, true, 250); 
		
			this.playAgainBgTween = this.game.add.tween(this.buttonGroup).to({y: - PrimeEight.HotLarva.viewHeight/5}, 200, Phaser.Easing.Quadratic.InOut, false, 250);
			this.playAgainBgTween.onComplete.add(this.onplayAgainBgTweenComplete, this);
		
			this.playAgainFgTween = this.game.add.tween(this.scoreGroup).to({y: + PrimeEight.HotLarva.viewHeight/5}, 200, Phaser.Easing.Quadratic.InOut, false, 250);
			this.playAgainFgTween.onComplete.add(this.onplayAgainFgTweenComplete, this);		
		
			this.soundButton = this.game.add.button(PrimeEight.HotLarva.viewWidth - (PrimeEight.HotLarva.buttonsSoundWidth * 1.5), PrimeEight.HotLarva.viewY + this.SCORE_INSET, 'buttonsSound', this.onToggleSound, this, 2, 2, 2, 2);
			this.musicButton = this.game.add.button(PrimeEight.HotLarva.viewWidth - (PrimeEight.HotLarva.buttonsSoundWidth * 2.7), PrimeEight.HotLarva.viewY + this.SCORE_INSET, 'buttonsSound', this.onToggleMusic, this, 0, 0, 0, 0);
			this.initSoundButtons();		
		},
		onplayAgainBgTweenComplete: function(){ 
			this.woosh.play(); 
			this.playAgainTweenCallbackTween = this.game.add.tween(this.buttonGroup).to({y: PrimeEight.HotLarva.viewHeight * 1.2}, 200, Phaser.Easing.Quadratic.In, true); 
		},
		onplayAgainFgTweenComplete: function(){
			this.playAgainTweenFCallbackTween = this.game.add.tween(this.scoreGroup).to({y: - PrimeEight.HotLarva.viewHeight * 1.2}, 200, Phaser.Easing.Quadratic.In, true);
			this.playAgainTweenFCallbackTween.onComplete.add(this.onStartGame, this);
		},
	  onPlayAgain: function () { 
			this.playAgainBgTween.start();
			this.playAgainFgTween.start();
		},
		onStartGame: function (){
			this.game.state.start('Game');
		},
		onMenu: function () {
	    //back to main menu
			window.location.href = 'http://www.primitive.co/games/starmites/';
		},
		initSoundButtons: function() {
			if(PrimeEight.HotLarva.soundBtns){
				this.setButtonFrames(this.soundButton, PrimeEight.HotLarva.soundBtns);
			}
			if(PrimeEight.HotLarva.musicBtns){
				this.setButtonFrames(this.musicButton, PrimeEight.HotLarva.musicBtns);
			}
		},	
		onToggleSound: function() {
			if(this.game.soundOff){
				this.onSoundOn();
			}else{
				this.onSoundOff();
			}
		},
		onToggleMusic: function() {
			if(this.game.musicOff){
				this.onMusicOn();
			}
			else{
				this.onMusicOff();
			}
		},	
		onMusicOn: function() {
			PrimeEight.HotLarva.musicBtns = [0, 0, 0, 0];
			this.setButtonFrames(this.musicButton, PrimeEight.HotLarva.musicBtns);
			this.game.musicOff = false;
		},	
		onMusicOff: function() {
			PrimeEight.HotLarva.musicBtns = [1, 1, 1, 1];
			this.setButtonFrames(this.musicButton, PrimeEight.HotLarva.musicBtns);
			this.game.musicOff = true;
		},
		onSoundOn: function() {
			this.game.sound.volume = 1;
			PrimeEight.HotLarva.soundBtns = [2, 2, 2, 2];
			this.setButtonFrames(this.soundButton, PrimeEight.HotLarva.soundBtns);
			this.game.soundOff = false;
		},	
		onSoundOff: function() {
			this.game.sound.volume = 0;
			PrimeEight.HotLarva.soundBtns = [3, 3, 3, 3];
			this.setButtonFrames(this.soundButton, PrimeEight.HotLarva.soundBtns);
			this.game.soundOff = true;
		},
		setButtonFrames: function(btn, btnState) {
			btn.setFrames(btnState[0], btnState[1], btnState[2], btnState[3]);		
		},
		removeSound: function(_sound) {
			_sound.stop();
			_sound = null;		
		},
		removeTween: function(_tween) {
			if (_tween) {
				_tween.onComplete.removeAll();
				_tween.stop();
				_tween = null;
	    }		
		},
		shutdown: function(){
			this.buttonGroup.destroy(true);
			this.scoreGroup.destroy(true);
			this.background.destroy();
			this.removeSound(this.woosh);
			this.removeTween(this.buttonGroupTween);
			this.removeTween(this.playAgainFgTween);
			this.removeTween(this.playAgainBgTween);
			PrimeEight.HotLarva.music.stop();
			this.soundButton.destroy();
			this.musicButton.destroy();		
		}
	};
}());