(function () {
	
	"use strict";
	
	PrimeEight.HotLarva.Preloader = function (game) {

		this.background = null;
		this.preloadBar = null;
		this.ready = false;

	};

	PrimeEight.HotLarva.Preloader.prototype = {

		preload: function () {
			this.background = this.add.sprite(0, 0, 'preloaderBackground');
			this.preloadBar = this.add.sprite(0, 0, 'preloaderBar');
			this.background.width = PrimeEight.HotLarva.srx;
			this.preloadBar.width = PrimeEight.HotLarva.srx;
			this.load.setPreloadSprite(this.preloadBar);		
			this.load.bitmapFont('SlackeyPrime8', 'assets/' + PrimeEight.HotLarva.screen + '/SlackeyPrime8/SlackeyPrime8.png', 'assets/' + PrimeEight.HotLarva.screen + '/SlackeyPrime8/SlackeyPrime8.fnt');
			this.load.audio('bgLoop', ['assets/audio/primitive/spaceball.mp3', 'assets/audio/primitive/spaceball.ogg']);
			this.load.audio('stomp', ['assets/audio/primitive/stomp.mp3', 'assets/audio/primitive/stomp.ogg']);
			this.load.audio('dropbooty', ['assets/audio/primitive/dropbooty.mp3', 'assets/audio/primitive/dropbooty.ogg']);
			this.load.audio('ledgeHop', ['assets/audio/primitive/ledgeHop.mp3', 'assets/audio/primitive/ledgeHop.ogg']);
			this.load.audio('collectbooty', ['assets/audio/primitive/collectbooty.mp3', 'assets/audio/primitive/collectbooty.ogg']);
			this.load.audio('grunt', ['assets/audio/primitive/grunt.mp3', 'assets/audio/primitive/grunt.ogg']);
			this.load.audio('endbump', ['assets/audio/primitive/endbump.mp3', 'assets/audio/primitive/endbump.ogg']);
			this.load.audio('sizzle', ['assets/audio/primitive/sizzle.mp3', 'assets/audio/primitive/sizzle.ogg']);
			this.load.audio('hotfeet', ['assets/audio/primitive/hotfeet.mp3', 'assets/audio/primitive/hotfeet.ogg']);
			this.load.audio('gem', ['assets/audio/primitive/gem.mp3', 'assets/audio/primitive/gem.ogg']);
			this.load.audio('pop', ['assets/audio/primitive/pop.mp3', 'assets/audio/primitive/pop.ogg']);
			this.load.audio('woosh', ['assets/audio/primitive/woosh.mp3', 'assets/audio/primitive/woosh.ogg']);
		
			this.load.image('instructionsbg','assets/' + PrimeEight.HotLarva.screen + '/instructionsbg.png');
			this.load.image('tap','assets/' + PrimeEight.HotLarva.screen + '/tap.png');
			this.load.image('okbg','assets/' + PrimeEight.HotLarva.screen + '/okbg.png');
			this.load.image('gempanel','assets/' + PrimeEight.HotLarva.screen + '/gempanel.png');
			this.load.spritesheet('instructionswoosh', 'assets/' + PrimeEight.HotLarva.screen + '/instructionswoosh.png', PrimeEight.HotLarva.wooshWidth, PrimeEight.HotLarva.wooshHeight, 4);
		
			this.load.image('mainmenubg','assets/' + PrimeEight.HotLarva.screen + '/mainmenubg.png');
			this.load.image('logo','assets/' + PrimeEight.HotLarva.screen + '/logo.png');
			this.load.image('mainmenucritter','assets/' + PrimeEight.HotLarva.screen + '/mainmenucritter.png');
			this.load.image('playbg','assets/' + PrimeEight.HotLarva.screen + '/playbg.png');
		
			this.load.image('background','assets/' + PrimeEight.HotLarva.screen + '/background.png');   
			this.load.image('lavabg','assets/' + PrimeEight.HotLarva.screen + '/lavabg.png');
			this.load.image('lava','assets/' + PrimeEight.HotLarva.screen + '/lava.png');
			this.load.image('slab','assets/' + PrimeEight.HotLarva.screen + '/slab.png'); 
			this.load.image('ledge','assets/' + PrimeEight.HotLarva.screen + '/ledge.png');
			this.load.image('pillar','assets/' + PrimeEight.HotLarva.screen + '/pillar.png');
			this.load.spritesheet('booty', 'assets/' + PrimeEight.HotLarva.screen + '/booty.png', PrimeEight.HotLarva.bootyWidth, PrimeEight.HotLarva.bootyWidth, 3);
			this.load.spritesheet('critter', 'assets/' + PrimeEight.HotLarva.screen + '/critter.png', PrimeEight.HotLarva.critterWidth, PrimeEight.HotLarva.critterHeight, 4);
			this.load.spritesheet('buttonsSound', 'assets/' + PrimeEight.HotLarva.screen + '/buttonsSound.png', PrimeEight.HotLarva.buttonsSoundWidth, PrimeEight.HotLarva.buttonsSoundHeight, 4);  
		},

		create: function () {
			this.ready = true;
			PrimeEight.HotLarva.endBumpSound = this.game.add.audio('endbump');
			PrimeEight.HotLarva.sizzleSound = this.game.add.audio('sizzle');
			this.state.start('MainMenu');
		},

		update: function () {

			if (this.cache.isSoundDecoded('titleMusic') && this.ready === false)
			{
				this.ready = true;
				this.state.start('MainMenu');
			}

		}

	};
}());