window.onload = function() 
{
	"use strict";

	var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

	var player;
	var cursors;
    var earth;
	var rocks;
	var dogs;
	var cats;
	var score = 0;
	var scoreText;
	var timeText;
	var timer = 120;
	var gameoverText; 
	
	function preload() 
	{
		game.load.image('landscape', 'assets/landscape.png');
		game.load.image('ground', 'assets/ground.png');
		game.load.image('dog', 'assets/dog.png');
		game.load.image('cat', 'assets/cat.png');
		game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
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
		
		dogs = game.add.group();
	 
		dogs.enableBody = true;
		//dogs.scale.setTo(.5, .5);
		
		cats = game.add.group();
	 
		cats.enableBody = true;
		
		createDogs();
		
		game.time.events.loop(Phaser.Timer.SECOND * 10, createDogs, this);
		
		scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
		
		timeText = game.add.text(300, 16, 'Time: 2', { fontSize: '32px', fill: '#000' });
		
		game.time.events.loop(Phaser.Timer.SECOND, updateTimer, this);
		
		game.time.events.loop(Phaser.Timer.SECOND * timer, gameover, this);
	}
	 
	function update() 
	{
		game.physics.arcade.collide(player, earth);
		game.physics.arcade.collide(dogs, earth);
		game.physics.arcade.overlap(player, dogs, collectDog, null, this);
		game.physics.arcade.collide(cats, earth);
		game.physics.arcade.overlap(player, cats, collectCat, null, this);
		
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

	function createDogs()
	{
		//create 12 dogs
		for (var i = 0; i < 12; i++)
		{
			var chance = game.rnd.integerInRange(1, 4);
			if (chance <= 3)
			{
				var dog = dogs.create(i * 70, game.rnd.integerInRange(100,200), 'dog');
				dog.scale.setTo(.5, .5);
				dog.rotation = game.rnd.integerInRange(1, 5);
				//  Let gravity do its thing
				dog.body.gravity.y = game.rnd.integerInRange(10, 25);
		 
				//  This just gives each star a slightly random bounce value
				dog.body.bounce.y = 0.7 + Math.random() * 0.2;
				dog.lifespan = 10000;
			}
			else
			{
				var cat = cats.create(i * 70, game.rnd.integerInRange(100,200), 'cat');
				cat.scale.setTo(.5, .5);
				cat.rotation = game.rnd.integerInRange(1, 5);
				//  Let gravity do its thing
				cat.body.gravity.y = game.rnd.integerInRange(10, 25);
		 
				//  This just gives each star a slightly random bounce value
				cat.body.bounce.y = 0.7 + Math.random() * 0.2;
				cat.lifespan = 10000;
			}
		}
	}

	function collectDog (player, dog) 
	{
		
		// Removes the star from the screen
		score += 10;
		dog.kill();
		scoreText.text = 'Score: ' + score;
	}
	
	function collectCat (player, cat) 
	{
		
		// Removes the star from the screen
		score -= 10;
		cat.kill();
		scoreText.text = 'Score: ' + score;
	}

	function updateTimer()
	{
		timer--;
		timeText.text = 'Time: ' + Math.floor(timer/60) + ':' + timer % 60;
	}
	
	function gameover()
	{
		this.game.paused = true;
		gameoverText = game.add.text(350, 300, 'Game Over', { fontSize: '128px', fill: '#000' });
	}
};
	 
