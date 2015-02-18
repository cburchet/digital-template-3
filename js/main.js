window.onload = function() 
{
	"use strict";

	var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

	var player;
	var girl;
	var cursors;
	var earth;
	var boulders;
	var scrolls;
	var scroll;
	var gameoverText; 
	
	function preload() 
	{
		game.load.image('landscape', 'assets/landscape.png');
		game.load.image('ground', 'assets/ground.png');
		game.load.image('boulder', 'assets/boulder/png');
		game.load.image('scroll', 'assets/scroll.png');
		game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
		game.load.image('girl', 'assets/static.png');
	}
	 
	function create() 
	{
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.add.sprite(0, 0, 'landscape');
		earth = game.add.group();
		earth.enableBody = true;
		var ground = earth.create(0, game.world.height - 64, 'ground');
		ground.body.immovable = true;
		ground.scale.setTo(7, 1);
		
		//player
		player = game.add.sprite(32, game.world.height - 150, 'dude');
	 
		//  We need to enable physics on the player
		game.physics.arcade.enable(player);
	 
		//  Player physics properties. Give the little guy a slight bounce.
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 300;
		
		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);
		
		cursors = game.input.keyboard.createCursorKeys();
		
		boulders = game.add.group();
		boulders.enableBody = true;
		
		scrolls = game.add.group();
		scrolls.enableBody = true;
		
		
		createBoulders();
		
		createScroll();
		
	}
	 
	function update() 
	{
		game.physics.arcade.collide(player, earth);
		game.physics.arcade.overlap(boulders, earth, destroyBoulder, null, this);
		game.physics.arcade.overlap(player, boulders, gameover, null, this);
		game.physics.arcade.overlap(player, scroll, collectScroll, null, this);
		game.physics.arcade.overlap(player, girl, Winner, null, this);
		
		if (boulders.countLiving() == 0)
		{
			createBoulders();
		}
		
		if (scrolls.countLiving() == 0)
		{
			createScroll();
		}
		
		player.body.velocity.x = 0;
	 
		if (cursors.left.isDown)
		{
			//  Move to the left
			player.body.velocity.x = -150;
	 
			player.animations.play('left');
		}
		else if (cursors.right.isDown)
		{
			//  Move to the right
			player.body.velocity.x = 150;
	 
			player.animations.play('right');
		}
		else
		{
			//  Stand still
			player.animations.stop();
	 
			player.frame = 4;
		}
		
		//  Allow the player to jump if they are touching the ground.
		if (cursors.up.isDown && player.body.touching.down)
		{
			player.body.velocity.y = -350;
		}
	}
	
	var count = 0;
	function createScroll()
	{
		var positions = [50, 750, 200, 600, 400]
		scroll = scrolls.create(positions[count], 64, 'scroll')
	}
	
	function createSaved()
	{
		girl = game.add.sprite(32, game.world.height - 150, 'girl');
		game.physics.arcade.enable(girl);
	}
	
	function createBoulders()
	{
		//create random boulders
		for (var i = 0; i < 12; i++)
		{
			var chance = game.rnd.integerInRange(1,3);
			if (chance == 2)
			{
				var boulder = boulders.create(i * 70, game.rnd.integerInRange(100,200), 'boulder');
				boulder.rotation = game.rnd.integerInRange(1, 5);
				//  Let gravity do its thing
				boulder.body.gravity.y = 15;
			}
		}
	}
	
	function destroyBoulder()
	{
		boulder.kill();
	}

	function collectScroll (player, scroll) 
	{
		
		// Removes the star from the screen
		scroll.kill();
		count++;
		if (count < 5)
		{
			createScroll()
		}
		else
		{
			createSaved();
		}
	}

	function gameover()
	{
		this.game.paused = true;
		gameoverText = game.add.text(350, 300, 'You win', { fontSize: '128px', fill: '#000' });
	}
	
	function gameover()
	{
		this.game.paused = true;
		gameoverText = game.add.text(350, 300, 'Game Over', { fontSize: '128px', fill: '#000' });
	}
};
	 
