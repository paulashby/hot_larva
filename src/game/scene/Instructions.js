(function () {
	
	"use strict";
	
	PrimeEight.HotLarva.Instructions = function (game) {

		this.music = null; 

	};

	PrimeEight.HotLarva.Instructions.prototype = {

		create: function () {
			
			this.MAIN_FONT_SIZE = Math.floor(PrimeEight.HotLarva.viewWidth/15);
			this.INSTRUCTION_FONT_SIZE = Math.floor(PrimeEight.HotLarva.viewWidth/25);
			this.LEFT_TEXT_X = PrimeEight.HotLarva.viewWidth * 0.04;
		
			this.highTapString = 'high tap to jump/flap';
			if(PrimeEight.HotLarva.desktop){
				this.highTapString = 'high click or up arrow/\rspacebar to jump/flap';
			}
			this.lowTapString = 'low tap to turn/stomp gems free';
			if(PrimeEight.HotLarva.desktop){
				this.lowTapString = 'low click or left/right arrow\rto turn/stomp gems free';
			}
		
			this.woosh = this.game.add.audio('woosh');
				
			this.background = this.game.add.sprite(0,0, 'mainmenubg');
		
			// additional bg sprite to hide seam between panels
			this.panelLbg = this.game.add.sprite(-PrimeEight.HotLarva.gameWidth,0, 'instructionsbg');
			this.panelL = this.game.add.sprite(-PrimeEight.HotLarva.gameWidth, 0, 'instructionsbg');
			this.panelR = this.game.add.sprite(PrimeEight.HotLarva.gameWidth * 2,0, 'instructionsbg');
			this.panelR.angle = 180;
			this.panelR.y = this.panelR.height;	
		
			this.gemElements = this.add.group();
			this.gemTitle = this.game.add.bitmapText(PrimeEight.HotLarva.viewWidth * 0.12, PrimeEight.HotLarva.viewY +  PrimeEight.HotLarva.viewHeight * 0.04, 'SlackeyPrime8', 'collect gems\rto score', this.MAIN_FONT_SIZE);
			this.gempanel = this.game.add.sprite(0,PrimeEight.HotLarva.viewY, 'gempanel');			
			this.booty1 = this.add.sprite(Math.round(PrimeEight.HotLarva.viewWidth * 0.49), PrimeEight.HotLarva.viewY +  PrimeEight.HotLarva.viewHeight * 0.18, 'booty');
			this.booty2 = this.add.sprite(Math.round(PrimeEight.HotLarva.viewWidth * 0.045), PrimeEight.HotLarva.viewY +  PrimeEight.HotLarva.viewHeight * 0.18, 'booty');
			this.booty2.frame = 1;
			this.booty3 = this.add.sprite(PrimeEight.HotLarva.viewWidth * 0.04, PrimeEight.HotLarva.viewY +  PrimeEight.HotLarva.viewHeight * 0.32, 'booty');
			this.booty3.frame = 2;
			this.instruction = this.game.add.bitmapText(PrimeEight.HotLarva.viewWidth * 0.12, PrimeEight.HotLarva.viewY +  PrimeEight.HotLarva.viewHeight * 0.33, 'SlackeyPrime8', 'score x 2', this.INSTRUCTION_FONT_SIZE);

			this.gemElements.add(this.gempanel);
			this.gemElements.add(this.gemTitle);		
			this.gemElements.add(this.instruction);
			this.gemElements.add(this.booty1);
			this.gemElements.add(this.booty2);
			this.gemElements.add(this.booty3);
		
			this.highClickElements = this.add.group();
			this.hcTap = this.game.add.sprite(0, PrimeEight.HotLarva.viewY + (PrimeEight.HotLarva.viewHeight * 0.03), 'tap');
			this.hcTap.x = PrimeEight.HotLarva.viewWidth - (this.hcTap.width * 1.2);

			this.hcWoosh1 = this.add.sprite(PrimeEight.HotLarva.viewWidth * 0.55, 0,'instructionswoosh');
			this.hcWoosh1.frame = 2; 
			this.hcCritter1 = this.add.sprite(this.hcWoosh1.x + (this.hcWoosh1.width * 0.8) , 0,'critter');
			this.hcWoosh2 = this.add.sprite(PrimeEight.HotLarva.viewWidth * 0.68, 0,'instructionswoosh');
			this.hcWoosh2.frame = 3; 
			this.hcCritter2 = this.add.sprite(this.hcWoosh2.x + (this.hcWoosh2.width * 0.65) , 0,'critter');
			this.hcCritter2.frame = 2;
			this.hcInstruction = this.game.add.bitmapText(0, 0, 'SlackeyPrime8', this.highTapString, this.INSTRUCTION_FONT_SIZE);
			this.hcInstruction.x = PrimeEight.HotLarva.viewWidth - (this.hcInstruction.width * 1.1);
			//y positions adjusted below relative to this.okbg.y
		
			this.highClickElements.add(this.hcTap);
			this.highClickElements.add(this.hcWoosh1);
			this.highClickElements.add(this.hcWoosh2);
			this.highClickElements.add(this.hcCritter1);
			this.highClickElements.add(this.hcCritter2);
			this.highClickElements.add(this.hcInstruction);	
		
			this.lowClickElements = this.add.group();
			this.lcTap = this.game.add.sprite(PrimeEight.HotLarva.viewWidth * 0.02, PrimeEight.HotLarva.viewHeight - (PrimeEight.HotLarva.viewHeight * 0.3), 'tap');
			this.lcWoosh1 = this.add.sprite(this.lcTap.x + PrimeEight.HotLarva.viewWidth * 0.15, this.lcTap.y - PrimeEight.HotLarva.viewHeight * 0.1,'instructionswoosh');
			this.lcWoosh1.frame = 0; 
			this.lcCritter1 = this.add.sprite(this.lcWoosh1.x + (this.lcWoosh1.width * 0.7) , this.lcWoosh1.y + (PrimeEight.HotLarva.critterHeight * 0.7),'critter');
			this.lcWoosh2 = this.add.sprite(this.lcWoosh1.x + (this.lcWoosh1.width * 2.5), this.lcWoosh1.y + this.lcWoosh1.height * 0.2,'instructionswoosh');
			this.lcWoosh2.frame = 1; 
			this.lcCritter2 = this.add.sprite(this.lcWoosh2.x + (this.lcWoosh2.width * 0.2) , this.lcWoosh2.y - (PrimeEight.HotLarva.critterHeight * 0.25),'critter');
			this.lcInstruction = this.game.add.bitmapText(this.lcTap.x + (this.lcTap.width * 0.9), this.lcTap.y + (this.lcTap.height * 0.6), 'SlackeyPrime8', this.lowTapString, this.INSTRUCTION_FONT_SIZE);
	
			this.lowClickElements.add(this.lcTap);
			this.lowClickElements.add(this.lcWoosh1);
			this.lowClickElements.add(this.lcWoosh2);
			this.lowClickElements.add(this.lcCritter1);
			this.lowClickElements.add(this.lcCritter2);
			this.lowClickElements.add(this.lcInstruction);
		
			this.tips = this.add.group();
			this.flapTip = this.game.add.bitmapText(PrimeEight.HotLarva.viewWidth * 0.15, PrimeEight.HotLarva.viewY + (PrimeEight.HotLarva.viewHeight * 0.05), 'SlackeyPrime8', 'jump from ledge to ledge\rfor higher score', this.INSTRUCTION_FONT_SIZE);
			this.tips.add(this.flapTip);
			this.stompTip = this.game.add.bitmapText(PrimeEight.HotLarva.viewWidth * 0.4, 0, 'SlackeyPrime8', 'turn on ledge\rto stomp\rgems free', this.INSTRUCTION_FONT_SIZE);
			this.stompTip.y = PrimeEight.HotLarva.viewHeight - (this.stompTip.height* 1.1);
			this.tips.add(this.stompTip);
			this.tips.y = - PrimeEight.HotLarva.gameHeight * 1.2;
			this.ledge1 = this.add.sprite(PrimeEight.HotLarva.gameWidth * 0.1, PrimeEight.HotLarva.viewY + (PrimeEight.HotLarva.viewHeight * 0.25), 'ledge');
			this.tips.add(this.ledge1);
			this.ledge2 = this.add.sprite(this.ledge1.x + (this.ledge1.width * 1.5), PrimeEight.HotLarva.viewY + (PrimeEight.HotLarva.viewHeight * 0.35), 'ledge');
			this.tips.add(this.ledge2);
			this.ledge3 = this.add.sprite(-this.ledge1.width * 0.1, this.stompTip.y + (this.stompTip.height* 0.15), 'ledge');
			this.tips.add(this.ledge3);
		
			this.okButton = this.add.group();
			this.okText = this.game.add.bitmapText(PrimeEight.HotLarva.viewWidth * 0.82, PrimeEight.HotLarva.viewHeight * 0.65, 'SlackeyPrime8', 'ok', this.MAIN_FONT_SIZE);
			this.okbg = this.game.add.sprite(this.okText.x + (this.okText.width/2), this.okText.y + (this.okText.height/2), 'okbg');
			this.okbg.anchor.setTo(0.5, 0.5);
			this.okButton.add(this.okbg);
			this.okButton.add(this.okText);
			this.okbg.inputEnabled = true;
			this.okbg.events.onInputDown.add(this.onOK, this, this);
			this.hcInstruction.y = (this.okbg.y - ( this.okbg.height/2) ) - (this.hcInstruction.height * 1.15);
			this.hcWoosh1.y = this.hcInstruction.y - (this.hcWoosh1.height);
			this.hcCritter1.y = this.hcWoosh1.y - (PrimeEight.HotLarva.critterHeight * 0.8);
			this.hcWoosh2.y = this.hcWoosh1.y - (this.hcWoosh2.height * 0.2);
			this.hcCritter2.y = this.hcWoosh2.y + (PrimeEight.HotLarva.critterHeight * 0.22);
					
			this.tipsText = this.game.add.bitmapText(PrimeEight.HotLarva.viewWidth * 0.65, 0, 'SlackeyPrime8', 'tips', this.INSTRUCTION_FONT_SIZE* 1.2);
			this.tipsbg = this.game.add.sprite(this.tipsText.x + (this.tipsText.width/2), this.okbg.y, 'okbg');
			this.tipsText.y = this.tipsbg.y - (this.tipsText.height/2);
			this.tipsbg.anchor.setTo(0.5, 0.5);
		
			// Add tips button to highClickElements so it gets tweened out of way once clicked
			this.highClickElements.add(this.tipsbg);
			this.highClickElements.add(this.tipsText);
			this.tipsbg.inputEnabled = true;
			this.tipsbg.events.onInputDown.add(this.showTips, this, this);
		
			this.gemElements.y = - PrimeEight.HotLarva.gameHeight;
			this.highClickElements.y = - PrimeEight.HotLarva.gameHeight;
			this.lowClickElements.y = PrimeEight.HotLarva.gameHeight;
		
			// ================================
			// = Tween elements into position =
			// ================================				
		
			this.panelLTween = this.add.tween(this.panelL);
			this.panelLTween.to( { x: 0 }, 200, Phaser.Easing.Bounce.Out);
			this.panelLTween.start();
		
			this.panelRTween = this.add.tween(this.panelR);
			this.panelRTween.to( { x: this.panelR.width }, 200, Phaser.Easing.Bounce.Out);
			this.panelRTween.onComplete.add(function() { this.panelLbg.x = 10; }, this);
			this.panelRTween.start();
		
			this.highClickTween = this.game.add.tween(this.highClickElements).to({y: 0}, 500, Phaser.Easing.Bounce.Out, true);
			this.lowClickTween = this.game.add.tween(this.lowClickElements).to({y: 0}, 500, Phaser.Easing.Bounce.Out, true);
			this.gemElementsTween = this.game.add.tween(this.gemElements).to({y: 0}, 500, Phaser.Easing.Bounce.Out, true);
			this.woosh.play();
		
			// ============================================
			// = Tween elements out and go to Game state =
			// ============================================
		
			this.okGemElementsTween = this.game.add.tween(this.gemElements).to({y: PrimeEight.HotLarva.gameHeight/5}, 200, Phaser.Easing.Quadratic.InOut, false, 250);
			this.okGemElementsTween.onComplete.add(this.onOKGemTweenComplete, this);
		
			this.okHighClickTween = this.game.add.tween(this.highClickElements).to({y: PrimeEight.HotLarva.gameHeight/5}, 200, Phaser.Easing.Quadratic.InOut, false, 250);
			this.okGemElementsTween.onComplete.add(this.onOKHighTweenComplete, this);
		
			this.okLowClickTween = this.game.add.tween(this.lowClickElements).to({y: -PrimeEight.HotLarva.gameHeight/5}, 200, Phaser.Easing.Quadratic.InOut, false, 250);
			this.okLowClickTween.onComplete.add(this.onOKLowTweenComplete, this);
		
			this.okTipsTween = this.game.add.tween(this.tips).to({y: +PrimeEight.HotLarva.gameHeight/5}, 200, Phaser.Easing.Quadratic.InOut, false, 250);
			this.okTipsTween.onComplete.add(this.okTipsTweenComplete, this);
		
			this.okButtonTween = this.game.add.tween(this.okButton).to({y: -PrimeEight.HotLarva.gameHeight/5}, 200, Phaser.Easing.Quadratic.In, false, 250);
			this.okButtonTween.onComplete.add(this.onOKButtonTweenComplete, this);
		
		},
		onOKButtonTweenComplete: function() {
			this.okButtonCallbackTween = this.game.add.tween(this.okButton).to({y: PrimeEight.HotLarva.gameHeight * 1.2}, 205, Phaser.Easing.Quadratic.In, true);
			this.okButtonCallbackTween.onComplete.add(this.onStartGame, this);		
		},
		onOKGemTweenComplete: function(){
			this.gemTweenCallbackTween = this.game.add.tween(this.gemElements).to({y: - PrimeEight.HotLarva.gameHeight * 1.2}, 200, Phaser.Easing.Quadratic.In, true);
			this.woosh.play();  
		},
		onOKHighTweenComplete: function(){
			this.okHighCallbackTween = this.game.add.tween(this.highClickElements).to({y: - PrimeEight.HotLarva.gameHeight * 1.2}, 200, Phaser.Easing.Quadratic.In, true);
		
			// add tips?
			this.okHighCallbackTween.onComplete.add(function() { if(this.tipsbg.clicked){ this.setTipGraphics(); } }, this);
		},
		onOKLowTweenComplete: function(){
			this.okLowCallbackTween = this.game.add.tween(this.lowClickElements).to({y: PrimeEight.HotLarva.gameHeight * 1.2}, 180, Phaser.Easing.Quadratic.In, true);
		},
		okTipsTweenComplete: function() {
			this.okTipsCallbackTween = this.game.add.tween(this.tips).to({y: - PrimeEight.HotLarva.gameHeight * 1.2}, 200, Phaser.Easing.Quadratic.In, true);
			this.woosh.play();
		},
		onOK: function() {
			if (!this.tipsbg.clicked) {
				this.hideInstructions();
			}
			else{
				this.okTipsTween.start();
			}
			this.okButtonTween.start();
		},
		hideInstructions: function() {
			this.okGemElementsTween.start();
			this.okHighClickTween.start();
			this.okLowClickTween.start();		
		},
		showTips: function() {
			this.tipsbg.clicked = true;
			this.hideInstructions();
		},
		setTipGraphics: function() {
			this.tips.add(this.lcWoosh2);//stomp lines
			this.tips.add(this.lcCritter2);//stomping critter
			this.lcCritter2.scale.x *= -1;
			this.lcCritter2.x = PrimeEight.HotLarva.gameWidth * 0.3;
			this.lcCritter2.y = PrimeEight.HotLarva.viewHeight * 0.535;
			this.lcWoosh2.x = this.lcCritter2.x + (this.lcCritter2.width * 1.15);
			this.lcWoosh2.y = PrimeEight.HotLarva.viewHeight * 0.57;
			this.tips.add(this.lcWoosh1);//turn lines
			this.lcWoosh1.scale.x *= -1;
			this.lcWoosh1.x = PrimeEight.HotLarva.gameWidth * 0.41;
			this.lcWoosh1.y = PrimeEight.HotLarva.viewY + (this.lcWoosh1.y - PrimeEight.HotLarva.viewHeight * 0.125);
			this.tips.add(this.hcWoosh2);
			this.hcWoosh2.x -= PrimeEight.HotLarva.gameWidth * 0.17;// flap lines
			this.hcWoosh2.y = this.ledge1.y - PrimeEight.HotLarva.gameHeight * 0.03;
			this.tips.add(this.hcCritter2);
			this.hcCritter2.x -= PrimeEight.HotLarva.gameWidth * 0.17;// flapping critter
			this.hcCritter2.y = this.ledge1.y;
			this.gem1 = this.add.sprite(this.ledge3.x + (this.ledge3.width * 0.8), this.ledge3.y + (this.ledge3.height * 1.5), 'booty');
			this.gem2 = this.add.sprite(this.gem1.x - this.gem1.width * 1.3, this.gem1.y, 'booty');
			this.gem3 = this.add.sprite(this.gem2.x - this.gem2.width * 1.3, this.gem1.y, 'booty');
			this.tips.add(this.gem1);
			this.tips.add(this.gem2);
			this.tips.add(this.gem3);
			this.tweenTips();		
		},
		tweenTips: function() {
			this.tipsTween = this.game.add.tween(this.tips).to({y: 0}, 500, Phaser.Easing.Bounce.Out, true);
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
			this.highClickElements.destroy(true);
			this.lowClickElements.destroy(true);
			this.gemElements.destroy(true);
			this.tips.destroy(true);
			this.okButton.destroy(true);
			this.background.destroy();
			this.panelLbg.destroy();
			this.panelL.destroy();
			this.panelR.destroy();
			this.removeTween(this.panelLTween);
			this.removeTween(this.panelRTween);
			this.removeTween(this.highClickTween);
			this.removeTween(this.lowClickTween);
			this.removeTween(this.gemElementsTween);
			this.removeTween(this.okGemElementsTween);
			this.removeTween(this.okHighClickTween);
			this.removeTween(this.okLowClickTween);
			this.removeTween(this.okTipsTween);
			this.removeTween(this.okButtonTween);
			this.removeSound(this.woosh);
		},
		onStartGame: function(){
			 this.game.state.start('Game');
		}
	};
}());