(function () {
	
	"use strict";
	
	PrimeEight.HotLarva.Game = function (game) {
		return this;
	};

	PrimeEight.HotLarva.Game.prototype = {

		create: function () {
			// keep the spacebar from propogating up to the browser
			this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
			this.SLAB_ANGLE = 1;
			this.CENTER_H = PrimeEight.HotLarva.gameWidth/2;
			this.BACKGROUND_SCROLL_SPEED = PrimeEight.HotLarva.gameWidth/7.2;
			this.SCORE_INSET = Math.floor(PrimeEight.HotLarva.gameWidth/60);
			this.LAVA_BG_Y = Math.round(PrimeEight.HotLarva.gameHeight - PrimeEight.HotLarva.lavaHeight * 1.2); // using PrimeEight.HotLarva.gameHeight as bg lava otherwise obscures stone wall on wide(shallow) screens
			this.LAVA_Y = Math.round(PrimeEight.HotLarva.viewHeight - PrimeEight.HotLarva.lavaHeight/2); // using PrimeEight.HotLarva.viewHeight as it's essential that lava sits at bottom of screen to obscure front of slab
			this.CRITTER_VELOCITY_X = PrimeEight.HotLarva.gameWidth; 
			this.CRITTER_VELOCITY_Y = - PrimeEight.HotLarva.viewHeight * 1.04; 
			this.CRITTER_Y = this.LAVA_Y - PrimeEight.HotLarva.critterHeight * 1.5; 
			this.LEDGE_HALF_WIDTH = PrimeEight.HotLarva.ledgeWidth/2;
			this.LEDGE_INIT_X = PrimeEight.HotLarva.gameWidth + this.LEDGE_HALF_WIDTH; 
			this.BOOTY_INTERVAL = 100;
			this.BOOTY_PERSISTENCE = 1500;
			this.BOOTY_INERTIA = 5; 
			this.SIDE_MARGIN = (PrimeEight.HotLarva.gameWidth - PrimeEight.HotLarva.slabWidth)/2;
			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			/*
			 * If changing ledge intervals, be aware that this.LEDGE_SEPARATION_SHORT_MAX
			 * must not overlap this.LEDGE_SEPARATION_MIN since this relationship is tested
			 * to determine the position of a added ledges.
			 * Failing to maintain this separation will break the game
			*/ 
			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			this.LEDGE_SEPARATION_SHORT_MIN = PrimeEight.HotLarva.gameWidth * 0.2;
			this.LEDGE_SEPARATION_SHORT_MAX = PrimeEight.HotLarva.gameWidth * 0.4;
			this.LEDGE_SEPARATION_MIN = PrimeEight.HotLarva.gameWidth * 0.41;
			this.LEDGE_SEPARATION_MAX = PrimeEight.HotLarva.gameWidth * 0.55; 
			this.LEDGE_Y_HIGH_T = (PrimeEight.HotLarva.critterHeight * 2) + (PrimeEight.HotLarva.ledgeHeight/2);
			this.LEDGE_Y_LOW_B = PrimeEight.HotLarva.viewHeight -(PrimeEight.HotLarva.lavaHeight + (PrimeEight.HotLarva.critterHeight * 1.5));
			this.LEDGE_SEPRATION_Y =  this.LEDGE_Y_LOW_B - this.LEDGE_Y_HIGH_T;
			this.LEDGE_Y_HIGH_B = this.LEDGE_Y_HIGH_T + (this.LEDGE_SEPRATION_Y/2);
			this.LEDGE_Y_LOW_T = this.LEDGE_Y_HIGH_B + 10;
			this.LAVA_SPEED = -40;
			this.SCORE_VAL = 1;
			this.GEM_SCORE_VAL = 4; 
			this.JUMP_VELOCITY = - PrimeEight.HotLarva.gameHeight * 3.2;
			this.PILLAR_Y_RANGE = PrimeEight.HotLarva.pillarHeight - PrimeEight.HotLarva.viewHeight;
			this.PILLAR_FINAL_X = - PrimeEight.HotLarva.ledgeWidth; // Used for position of both pillar and ledge
			this.PILLAR_TWEEN_DURATION = 6000;
			this.MUSIC_LOW_VOL = 0.8;
			this.HOTFOOT_VOL = 0.4;
			
			var ppLogoClearance;
			
			ppLogoClearance = PrimeEight.HotLarva.desktop ? PrimeEight.HotLarva.viewX + this.SCORE_INSET : 50;
		
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.game.physics.arcade.gravity.y = 400;
			PrimeEight.HotLarva.background = this.add.tileSprite(0, 0, PrimeEight.HotLarva.gameWidth, PrimeEight.HotLarva.gameHeight, 'background');
			PrimeEight.HotLarva.background.autoScroll(-this.BACKGROUND_SCROLL_SPEED, 0); 
			this.bgLava = this.add.tileSprite(0, this.LAVA_BG_Y, PrimeEight.HotLarva.gameWidth, PrimeEight.HotLarva.lavaHeight, 'lavabg');
			this.bgLava.autoScroll(this.LAVA_SPEED, 0);
			this.pillars = this.add.group();  
			this.slabSprite = this.add.sprite(this.CENTER_H, this.LAVA_Y,'slab');
			this.slabSprite.anchor.setTo(0.5, 0.5);
			this.slabSprite.angle = this.SLAB_ANGLE;
			this.game.physics.arcade.enableBody(this.slabSprite);
			this.slabSprite.body.allowGravity = false;
			this.slabSprite.body.immovable = true; 

			this.bootyGroup = this.add.group();
			this.lava = this.add.tileSprite(0, this.LAVA_Y, PrimeEight.HotLarva.gameWidth, PrimeEight.HotLarva.lavaHeight, 'lava');
			this.lava.autoScroll(- this.LAVA_SPEED, 0);
			this.ledges = this.add.group();
			this.ledges.gemPossible = false; // either false or a reference to a ledge
			this.addLedge();
			this.ledges.getAt(0).visible = false;
			this.pillars.getAt(0).visible = false;
		
			// slab rocking motion
			this.slabAngleTween = this.add.tween(this.slabSprite);
			this.slabAngleTween.to( { angle: - this.SLAB_ANGLE * 2 }, 1000, Phaser.Easing.Quadratic.InOut)
			.to( { angle: this.SLAB_ANGLE }, 1000, Phaser.Easing.Quadratic.InOut);
			this.slabAngleTween._lastChild.onComplete.add(function() { this.slabAngleTween.start(); }, this);
			this.slabAngleTween.start();
		
			PrimeEight.HotLarva.totalScore = 0;
			this.scores = this.add.group();
			this.FONT_SIZE = Math.floor(PrimeEight.HotLarva.gameHeight/9.4); 
			this.SCORE_FONT_SIZE = this.FONT_SIZE * 0.8;
			this.scoreText = this.game.add.bitmapText(ppLogoClearance, PrimeEight.HotLarva.viewY + this.SCORE_INSET, 'SlackeyPrime8', PrimeEight.HotLarva.totalScore.toString(), this.SCORE_FONT_SIZE);   
			this.scores.add(this.scoreText); 

			this.stompSound = this.game.add.audio('stomp');
			this.stompSound.volume = 0.5;
			this.dropBootySound = this.game.add.audio('dropbooty');
			this.dropBootySound.volume = 0.5;
			this.collectBootySound = this.game.add.audio('collectbooty');
			this.collectBootySound.volume = 0.4;		
			this.ledgeHopSound = this.game.add.audio('ledgeHop');
			this.ledgeHopSound.volume = 0.3;		
			this.gruntSound = this.game.add.audio('grunt');
			this.gruntSound.volume = 0.5;
			this.collectGemSound = this.game.add.audio('gem');
			this.collectGemSound.volume = 0.5;
			this.popSound = this.game.add.audio('pop');
			this.popSound.volume = 0.7;
			this.hotFootSound = this.game.add.audio('hotfeet');
		
			this.countdownDisplay = this.add.group();
			this.countdownSeconds = 3;
			this.countdownBg = this.game.add.sprite(PrimeEight.HotLarva.viewWidth/2, PrimeEight.HotLarva.viewHeight/2, 'okbg');
			this.countdownBg.anchor.setTo(0.5, 0.5);
			this.countdown = this.game.add.bitmapText(PrimeEight.HotLarva.viewWidth/2, PrimeEight.HotLarva.viewHeight/2, 'SlackeyPrime8', this.countdownSeconds.toString(), this.FONT_SIZE);
			this.countdown.x = PrimeEight.HotLarva.viewWidth/2 - this.countdown.width * 0.4;
			this.countdown.y -= this.countdown.height/2;
			this.countdownDisplay.add(this.countdownBg);
			this.countdownDisplay.add(this.countdown);
			this.countdownTimer = this.time.create(false);// autodestroy false
			this.countdownTimer.repeat(1000,this.countdownSeconds + 1, this.updateCountdown, this);
			this.popSound.play();// first tick of countdown
			this.critter = this.add.sprite(this.CENTER_H , this.countdownBg.y - (this.countdownBg.height/2) - (PrimeEight.HotLarva.critterHeight * 0.41),'critter');
			this.critter.anchor.setTo(0.5, 0.5);
			this.critter.scale.setTo(-1, 1);		 
			this.countdownTimer.start();
		
			this.soundButton = this.game.add.button(PrimeEight.HotLarva.viewWidth - (PrimeEight.HotLarva.buttonsSoundWidth * 1.5), PrimeEight.HotLarva.viewY + this.SCORE_INSET, 'buttonsSound', this.onToggleSound, this, 2, 2, 2, 2);
			this.musicButton = this.game.add.button(PrimeEight.HotLarva.viewWidth - (PrimeEight.HotLarva.buttonsSoundWidth * 2.7), PrimeEight.HotLarva.viewY + this.SCORE_INSET, 'buttonsSound', this.onToggleMusic, this, 0, 0, 0, 0);
			this.initSoundButtons();
		},
	  update: function() { 
			if(!this.critter.ledgeDead){ 
				this.game.physics.arcade.collide(this.slabSprite, this.critter, this.onCritterBounce, null, this); 
				this.game.physics.arcade.collide(this.ledges, this.critter, this.onLedgeHit, null, this);
			}
			this.updateLedges();
			this.updateCritter();
			this.updateBooty();
	 	}, 
	
		updateCountdown: function() {
			this.countdownSeconds--;
			if(this.countdownSeconds > 0){
				this.countdown.setText(this.countdownSeconds.toString());
				if(this.countdownSeconds > 1){
					this.countdown.x = PrimeEight.HotLarva.viewWidth/2 - this.countdown.width * 0.4;
				}
				else{
					this.countdown.x = PrimeEight.HotLarva.viewWidth/2 - this.countdown.width * 0.2;
				}
				this.popSound.play();
			}
			else{
				this.initCritter();
				this.initSound();
				this.countdownDisplay.destroy(true);
			}		
		},
		initSound: function() {
			if(PrimeEight.HotLarva.music === undefined){
				PrimeEight.HotLarva.music = this.game.add.audio('bgLoop', 1,true);
			} 
			if(!PrimeEight.HotLarva.music.isPlaying){
				PrimeEight.HotLarva.music.play('',0,1,true);				
				var chrome = window.chrome;
				if(chrome){
					// Workaround as Chrome has deprecated 'webkitAudioContext'
					PrimeEight.HotLarva.music.onLoop.add(this.playMusic, this);
				}			
			}
			PrimeEight.HotLarva.music.volume = this.MUSIC_LOW_VOL;
		
			if(this.game.soundOff) {
				this.onSoundOff();
			}
			if(this.game.musicOff) {
				this.onMusicOff();
			}		
		}, 
		playMusic: function() {
			PrimeEight.HotLarva.music.play('', 0, 1, true);
		}, 
		updateLedges: function(){
			if(this.ledges.newestLedge.x <= this.ledges.separationPoint){
				// current ledge has reached correct separation from this.LEDGE_INIT_X
				this.addLedge();
			}
		},
		updateBooty: function (){
			this.bootyGroup.forEach(function(booty){
			 
				if(this.spriteCirclesColliding(this.critter, booty, this.critter.collisionTolerance)){
					this.collectBooty(booty, this.critter);
				}
				else{
					if(booty.gem){
						booty.x = booty.ledge.x;
					}
					else{
						booty.angle++;
					}
				}
			}, this);
		},
		updateCritter:function(){ 
			if(this.critter.y > this.LAVA_Y){
				this.fryCritter();
			} 
			if(this.critter.ledgeDead){
				this.critter.angle += 10;
				this.critter.jumping = false;
			}
		
			var xScale = this.critter.scale.x;
		
			if(this.critter.jumping){ 
			
				// turn upwards during jumps 
				this.critter.angle -= xScale;
			
				this.critter.events.onAnimationComplete.add(function() {
				    if (this.critter.animations.currentAnim.name === 'flap') {
					    this.critter.animations.play('run', 20, true); 
					 } 
				}, this);
			}
		
			// swoop upwards after direction change
			if( (xScale > 0 && this.critter.angle > 0) || (xScale < 0 && this.critter.angle < 0)){
				this.critter.angle -= 4 * xScale;
			}
		},
		collectBooty:function(booty) {  
			this.onScore(booty);
			this.removeBooty(booty);
		},
		removeBooty: function(booty) {
			booty.exists = false;
			booty.scoreValue = 0;
		},
		cursorJump: function(){
		    if(!this.critter.jumping){
		       this.critterJump();
				}
		},
		onTap: function() { 
			if(this.game.input.y >= PrimeEight.HotLarva.viewHeight/2){
				this.critterChangeDir();			
			}
			else if(!this.critter.jumping){
				this.critterJump();
			}
		},
		initCritter: function() {
			this.game.physics.arcade.enableBody(this.critter);
			this.critter.body.velocity.y = this.CRITTER_VELOCITY_Y;
			this.critter.body.acceleration.y = PrimeEight.HotLarva.viewHeight * 12.5;
			this.critter.body.drag.x = PrimeEight.HotLarva.gameWidth/2; 
			this.critter.body.bounce.y = 1;
			this.critter.collisionTolerance = PrimeEight.HotLarva.critterWidth/2;
			this.critter.score = 0;
			this.critter.previousScore = 0; 
			this.critter.ledgeHops = 0; // used to determine score multiplier (reward for jumping from ledge to ledge)
			this.critter.scoreMultiplier = 0;
			this.critter.level = 0; 
			this.critter.ledgeDead = false;
			this.critter.animations.add('run', [0, 1]);
			this.critter.animations.add('flap', [0, 1, 2, 3, 2, 3]);
			this.critter.animations.play('run', 20, true);		
		},
		onCritterBounce: function() {
			if(!this.critter.playable){
				PrimeEight.HotLarva.background.inputEnabled = true;
				PrimeEight.HotLarva.background.events.onInputDown.add(this.onTap, this);			
				this.jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
				this.jumpKey.onDown.add(this.cursorJump, this);
				this.cursors = this.game.input.keyboard.createCursorKeys();
				this.cursors.up.onDown.add(this.cursorJump, this);
				this.cursors.left.onDown.add(this.critterChangeDirL, this);
				this.cursors.right.onDown.add(this.critterChangeDirR, this);
				this.hotFootSound.play('',0,this.HOTFOOT_VOL,true);
				this.critter.playable = true;
				this.activateLedges();
			}
			if(this.countdownSeconds <= 1){
				if(this.critter.jumping || this.critter.level > 0) {
					this.critterEndJump();
				 }
				this.critter.body.velocity.x = (this.CRITTER_VELOCITY_X * this.critter.scale.x)/2;
				this.critterRunOn();
			}
		},	
		onLedgeHit: function(critter, ledge) {
			if(this.critter.body.touching.down){
					this.critterLedgeRun(ledge);
				}
				else{
					this.critterLedgeDeath();
				}				
		},
		critterStartRun: function(power) {
			this.critter.body.velocity.x = this.critter.velocityX * power * this.critter.scale.x;
			this.critter.angle = 0;		
		},
		critterRunOn: function() {
			// put the spring back his step
			this.critter.body.velocity.y = this.CRITTER_VELOCITY_Y;	
		},
		critterLedgeRun: function(ledge) {
			if(this.critter.jumping){
				this.critterEndLedgeJump(ledge);
			}
			this.critterRunOnLedge();
		},	
		critterRunOnLedge: function() {
			if(this.critter.scale.x === -1){
				this.stompSound.play();
			}
			this.dropBooty(true);
			this.setCritterLedgeVelocities();
			this.critterStartRun(0.3);	
		},
		critterJump: function() {
			// Make sure angle is zero as critter rotates during jump 
			this.critter.angle = 0; 
			this.setJumpVelocities();
			this.critter.jumping = true;
			if(this.critter.level === 0){
				this.gruntSound.play();
			} 
			this.critter.animations.stop('run', 20, false); 
			this.critter.animations.play('flap', 20, false);
			this.hotFootSound.stop();
		},
		critterEndJump: function() {
			this.critterStartRun(1);
			this.critter.level = 0;
			this.critter.jumping = false;
		
			//set scoreMultiplier in case we score. 
			this.critter.scoreMultiplier = this.critter.ledgeHops > 0 ? this.critter.ledgeHops : 1;
		
			// reset ledgeHops as we are no longer jumping between ledges
			this.critter.ledgeHops = 0; 
		
			if(PrimeEight.HotLarva.music.isPlaying){
				PrimeEight.HotLarva.music.volume = this.MUSIC_LOW_VOL;
			}
			if(!this.hotFootSound.isPlaying){
				this.hotFootSound.play('',0,this.HOTFOOT_VOL,true);
			}
		},	
		critterEndLedgeJump: function(ledge) {
			this.critter.level = ledge.level;
			this.ledges.targetLedge = this.ledges.getAt(this.ledges.getIndex(ledge));
			this.critter.scale.x = 1;
			this.critter.jumping = false;
			this.ledges.scoringLedge = null;
			if(this.critter.ledgeHops > 0){
				this.ledgeHopSound.play();
			}
		
			PrimeEight.HotLarva.music.volume = 1;
			this.critter.ledgeHops++;
		},
		setJumpVelocities: function() {
			this.critter.velocityX = this.critter.body.velocity.x;
			this.critter.body.velocity.x = 0; 
			this.critter.body.velocity.y = this.JUMP_VELOCITY;		
		},	
		setCritterLedgeVelocities: function() {
			this.critter.body.velocity.y = this.CRITTER_VELOCITY_Y * 1.6;
		
			// Keep critter moving on ledge
			if(this.critter.body.velocity.x === 0){
				this.critter.velocityX = this.CRITTER_VELOCITY_X * this.critter.scale.x;			 
			}	
		},
		critterChangeDirL: function() {
			if(this.critter.scale.x === 1){
				this.critterChangeDir();
			}
		},
	
		critterChangeDirR: function() {
			if(this.critter.scale.x === -1){
				this.critterChangeDir();
			}
		},
		critterChangeDir: function() {
			var turboCharge, // Less energy if turning on ledge, as otherwise shoot right off it!
			xScale;
			this.critter.scale.x *= -1;
			xScale = this.critter.scale.x;
			turboCharge = (this.critter.level > 0 && this.critter.scale.x === 1) ? 0.2 : 1.15; // Less energy if turning on ledge, as otherwise shoot right off it!
			this.critter.body.velocity.x = (this.CRITTER_VELOCITY_X * xScale) * turboCharge;
			this.critter.angle = 45 * xScale;
			if(this.critter.score > 0){
				this.showScoreValue();
				this.critter.scoreMultiplier = 0;
				PrimeEight.HotLarva.totalScore += this.critter.score;
				this.scoreText.setText(PrimeEight.HotLarva.totalScore.toString());
				this.critter.score = 0;
			} 
		},
		fryCritter: function() {
			this.hotFootSound.stop();
			PrimeEight.HotLarva.sizzleSound.play();
			this.deathHandler();
		},
		critterLedgeDeath: function() {
			PrimeEight.HotLarva.endBumpSound.play();
			this.critter.ledgeDead = true;
		},
 
		addLedge:function() { 
		
			var recycledLedge = this.ledges.getFirstExists(false),
			randomY,
			level;
		
			if(this.ledges.addHighLedge){
				randomY = this.getRandomInt(this.LEDGE_Y_HIGH_B, this.LEDGE_Y_HIGH_T);
				level = 2;
			}
			else{
				randomY = this.getRandomInt(this.LEDGE_Y_LOW_B, this.LEDGE_Y_LOW_T);
				level = 1;  
			}
		
			if(!recycledLedge) { // No existing ledges available - make new

				recycledLedge = this.add.sprite(this.LEDGE_INIT_X, randomY, 'ledge');
			}
			else{ // Use existing ledge
				recycledLedge.x = this.LEDGE_INIT_X;
				recycledLedge.y = randomY;
			} 
			this.ledges.add(recycledLedge);
			this.initLedge(recycledLedge, level); 
			this.setNextLedgeType();
			this.addPillar();
		},
		addPillar:function() { 
			var recycledPillar = this.pillars.getFirstExists(false),
			pillarY = this.getRandomInt (-this.PILLAR_Y_RANGE, 0);
		
			if(!recycledPillar) { // No existing pillars available - make new

				recycledPillar = this.add.sprite(this.LEDGE_INIT_X, pillarY, 'pillar');
			}
			else{ // Use existing pillar
				recycledPillar.x = this.LEDGE_INIT_X;
				recycledPillar.y = pillarY;
			} 
			this.pillars.add(recycledPillar);
			this.initPillar(recycledPillar);	
		}, 
		initPillar: function(pillar) {
			pillar.exists = true;
			pillar.visible = true;
			if(Math.random() >= 0.5){
				pillar.scale.x = 1;
			}
			else{
				pillar.scale.x = -1;
			}
			pillar.anchor.setTo(0.5, 0);
			pillar.tweenX = this.game.add.tween(pillar).to({x: this.PILLAR_FINAL_X}, this.PILLAR_TWEEN_DURATION, Phaser.Easing.Linear.InOut, true);
			pillar.tweenX.onComplete.add(function() { pillar.exists = false; }, this);
		},
		initLedge: function(ledge, level) {
			this.ledges.newestLedge = this.ledges.getAt(this.ledges.getIndex(ledge));
			ledge.level = level;
		 	ledge.exists = true;
		 	ledge.anchor.setTo(0.5, 0.5);
			if(this.ledges.active){
				this.game.physics.arcade.enableBody(ledge);
				ledge.body.allowGravity = false;
				ledge.body.immovable = true;
				ledge.visible = true;
			}
			ledge.hasGem = false;
			ledge.tweenX = this.game.add.tween(ledge).to({x: this.PILLAR_FINAL_X}, this.PILLAR_TWEEN_DURATION, Phaser.Easing.Linear.InOut, true);
			ledge.tweenX.onComplete.add(function() { ledge.exists = false; }, this);
		},
		activateLedges: function() {
			this.ledges.forEach(function(ledge){
				this.game.physics.arcade.enableBody(ledge);
				ledge.body.allowGravity = false;
				ledge.body.immovable = true;
			}, this);
			this.ledges.active = true;		
		},
		setNextLedgeType: function() {
			/*
			 * Should next ledge be high or low?
			 * we check the ledge separation to ensure that the current ledge isn't high –
			 * if we have two high ones in a row, the player could unwittingly doom
			 * themselves to a lava bath.
			 *
			 * If last ledge was low we might add a high one (Math.random > 0.5). If high, set a short timer interval
			 * and use y values from a higher range. This gives us a high ledge within jumping range 
			 * 
			*/ 
			if(Math.random() > 0.5 && (this.ledges.separation > this.LEDGE_SEPARATION_SHORT_MAX) ) {
				// previous ledge is low, so add a high one
				this.ledges.separation = this.getRandomInt(this.LEDGE_SEPARATION_SHORT_MIN, this.LEDGE_SEPARATION_SHORT_MAX);
				this.ledges.addHighLedge = true;
			}
			else{
				// random ledge is high, add a low one
				this.ledges.separation = this.getRandomInt(this.LEDGE_SEPARATION_MIN, this.LEDGE_SEPARATION_MAX);
				this.ledges.addHighLedge = false;
			} 
     
			this.ledges.separationPoint = PrimeEight.HotLarva.gameWidth - this.ledges.separation;

		},
		dropBooty:function(regularBooty) {
		
			var targetLedge = this.ledges.targetLedge,
			bootyX,
			bootyY,
			bootyFrame,
			thisScore,
			gemLedge,
			recycledBooty;

			if(regularBooty && !targetLedge.hasGem){ 
			
				bootyX = targetLedge.x - this.LEDGE_HALF_WIDTH;
				bootyY = targetLedge.y;
				bootyFrame = targetLedge.level - 1;
				thisScore = targetLedge.level * this.SCORE_VAL;			
			}
			else if(!regularBooty){
			
				// use newest ledge if gemPossible is already out of reach
				if(this.ledges.gemPossible === this.ledges.targetLedge){
					gemLedge = this.ledges.newestLedge;
				}
				else{
					gemLedge = this.ledges.gemPossible;
				}
			
				bootyX = gemLedge.x + this.LEDGE_HALF_WIDTH - PrimeEight.HotLarva.bootyWidth;
				bootyY = gemLedge.y - (PrimeEight.HotLarva.bootyWidth * 1.5);
			
				this.ledges.gemPossible = false; 
				bootyFrame = 2;
				thisScore = this.GEM_SCORE_VAL; 
			}
		
			/* we don't want both booty and gem on same ledge.
			 *  
			 * only add booty if:
			 * critter is bouncing to dislodge it
			 * the ledge has not had a gem
			 * 
			 * only add a gem if not regular booty
			 */
		
			if ( (this.critter.scale.x === -1 && bootyX > this.SIDE_MARGIN && !targetLedge.hasGem) || !regularBooty) { 
			
				recycledBooty = this.bootyGroup.getFirstExists(false);
		
				if(!recycledBooty) { // No existing booty available - make new
					recycledBooty = this.add.sprite(bootyX, bootyY, 'booty');
				}
				else{ // Use existing booty
					recycledBooty.x = bootyX;
					recycledBooty.y = bootyY;
				}
				recycledBooty.ledge = gemLedge; // used to make gem follow ledge
				recycledBooty.scoreValue = thisScore; 
				recycledBooty.frame = bootyFrame;
				this.bootyGroup.add(recycledBooty);
				this.initBooty(recycledBooty, bootyY, regularBooty); 
			}
		},
		initBooty: function(booty, bootyY, regularBooty) {
			booty.exists = true;
			booty.anchor.setTo(0.5, 0.5);
			booty.scale.setTo(0, 0); 
			booty.angle = 0;
			var inertiaDist = (this.CRITTER_Y - bootyY)/this.BOOTY_INERTIA; 
		
			if(regularBooty){
				booty.dropTween = this.add.tween(booty);
				booty.dropTween.to( { y: this.CRITTER_Y + inertiaDist }, this.BOOTY_INTERVAL, Phaser.Easing.Quadratic.InOut)
				.to( { y: this.CRITTER_Y }, this.BOOTY_INTERVAL/this.BOOTY_INERTIA, Phaser.Easing.Quadratic.InOut);
				booty.dropTween.start();
				this.dropBootySound.play();
				booty.gem = false; 
				this.ledges.gemPossible = this.ledges.newestLedge; 
			}
			else{
				booty.gem = true; 			
			} 
		                        
			booty.scaleTween = this.add.tween(booty.scale);
			booty.scaleTween.to( { x: 1, y: 1 }, this.BOOTY_INTERVAL, Phaser.Easing.Quadratic.InOut)
			.to( {x: 0.8, y: 0.8 }, this.BOOTY_INTERVAL/this.BOOTY_INERTIA, Phaser.Easing.Quadratic.InOut)
			.to( {x: 0.8, y: 0.8 }, this.BOOTY_PERSISTENCE, Phaser.Easing.Quadratic.InOut)// this line is just a timer really
			.to( {x: 0, y: 0 }, this.BOOTY_INTERVAL, Phaser.Easing.Quadratic.InOut);
		
			booty.scaleTween._lastChild.onComplete.add(function() { 
				booty.y = - PrimeEight.HotLarva.gameHeight; 
				booty.exists = false;
				if(booty.gem){ 
					this.popSound.play();
				} 
				}, this);
	
			booty.scaleTween.start();		
		},
		onScore: function(booty) { 
			 if(booty.scoreValue > 0){
				this.critter.score += booty.scoreValue * this.critter.scoreMultiplier;			

				if (booty.gem){ 
					// this is a gem 
					this.critter.score = this.critter.previousScore * 2;
					this.critter.previousScore = 0;
				 	this.showScoreValue();
					this.collectGemSound.play();
				}
				else{
					if(this.ledges.gemPossible !== false){ 
						// if we manage to collect the booty, the next ledge (gemPossible) is given a gem
						this.ledges.gemPossible.hasGem = true; 
						this.dropBooty(false);
					}
					this.critter.previousScore = this.critter.score;
					this.collectBootySound.play();
				}
				booty.scoreValue = 0;
			}
		},
		showScoreValue: function() {
			  var recycledScore = this.scores.getFirstExists(false);

				if(!recycledScore) { // No existing scores available - make a new one

					recycledScore = this.game.add.bitmapText(this.critter.x, this.critter.y, 'SlackeyPrime8', this.critter.score.toString(), this.FONT_SIZE);
				}
				else { // Use existing score 
					recycledScore.setText(this.critter.score.toString());
					recycledScore.x = this.critter.x;
					recycledScore.y = this.critter.y;
				}
				PrimeEight.HotLarva.totalScore += this.critter.score;
				this.scoreText.setText(PrimeEight.HotLarva.totalScore.toString());
			 
				this.critter.score = 0;
				this.initScoreVal(recycledScore);
				this.scores.add(recycledScore);  
			
			 	recycledScore.scaleXtween = this.add.tween(recycledScore.scale).to({x: 1}, 250, Phaser.Easing.Circular.Out, true);
				recycledScore.scaleXtween.onComplete.add(this.onScaleXtweenComplete, {_scoreVal: recycledScore, _game: this});  
			
				recycledScore.scaleYtween = this.add.tween(recycledScore.scale).to({y: 1}, 250, Phaser.Easing.Circular.Out, true);
				recycledScore.scaleYtween.onComplete.add(this.onScaleYtweenComplete, {_scoreVal: recycledScore, _game: this});
		},
		initScoreVal: function(scoreVal) {
			scoreVal.exists = true;
			scoreVal.visible = true;
			scoreVal.scale.setTo(0); 
			scoreVal.align = 'center';		
		},
		onScaleXtweenComplete: function() {		
			this._scoreVal.unscaleXtween = this._game.add.tween(this._scoreVal.scale).to({x: 0}, 250, Phaser.Easing.Circular.In, true);
			this._scoreVal.unscaleXtween.onComplete.add(function() { 
				this._scoreVal.visible = false;
				this._scoreVal.exists = false;
				}, this);
		},
		onScaleYtweenComplete: function() {
		  this._scoreVal.unscaleYtween = this._game.add.tween(this._scoreVal.scale).to({y: 0}, 250, Phaser.Easing.Circular.In, true);
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
			}
			else{
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
			PrimeEight.HotLarva.music.play('',0,1,true);
			PrimeEight.HotLarva.musicBtns = [0, 0, 0, 0];
			this.setButtonFrames(this.musicButton, PrimeEight.HotLarva.musicBtns);
			this.game.musicOff = false;
		},	
		onMusicOff: function() {
			PrimeEight.HotLarva.music.stop();
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
		getRandomInt: function (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
 
		spriteCirclesColliding: function (sprite1, sprite2, tolerance) {
		
			// return true if sprites are within tolerance, else false
			return (Phaser.Math.distance(sprite1.x, sprite1.y, sprite2.x, sprite2.y) - tolerance < sprite2.width/2 ? true : false);
		},
		deathHandler: function(){
			this.state.start('GameOver');
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
			this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
			this.cursors = null;
			this.bgLava.destroy();
			this.pillars.destroy(true);
			this.slabAngleTween.stop(); 
			this.slabAngleTween = null; 
			this.slabSprite.destroy();
			this.critter.destroy();
			this.bootyGroup.destroy(true);
			this.lava.destroy();
			this.ledges.destroy(true);
			this.scores.destroy(true);
			this.countdownDisplay.destroy(true);
			this.removeSound(this.stompSound);
			this.removeSound(this.dropBootySound);
			this.removeSound(this.collectBootySound);
			this.removeSound(this.ledgeHopSound);
			this.removeSound(this.gruntSound);
			this.removeSound(this.collectGemSound);
			this.removeSound(this.popSound);
			this.removeSound(this.hotFootSound);
			this.removeTween(this.slabAngleTween);		
			PrimeEight.HotLarva.music.stop();
			this.soundButton.destroy();
			this.musicButton.destroy();
			PrimeEight.HotLarva.background.events.onInputDown.remove(this.onTap, this);
			PrimeEight.HotLarva.background.inputEnabled = true;			
		}

	};
}());