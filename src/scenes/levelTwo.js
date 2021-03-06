import Phaser from 'phaser';


var player;
var cursors;
var platforms;
var resourcesGathered = 0;
var resourcesMax = 100;
var resourcesDropped = 0;
var playerHealth = 100;


export class LevelTwo extends Phaser.Scene {
    constructor () {
        super({
            key: 'levelTwo',
            parent: 'ohana',
        })
    }

    preload ()
    {
        this.load.image('platforms', 'assets/ground.png');
        this.load.image('background', 'assets/Forest.png');//Change background
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 128, frameHeight: 120});
    }

    create () {

        platforms = this.physics.add.staticGroup();
        platforms.create(500,800, 'platforms').setScale(4).refreshBody();

        this.background = this.add.tileSprite(window.innerWidth/2.35, window.innerHeight/2.06,1200,800, 'background')
        player = this.physics.add.sprite(100, 450, 'player')
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.physics.add.collider(player, platforms)

        this.physics.add.overlap(player, resource, collectResources, null, this);
        this.physics.add.overlap(player, bomb, collectResources, null, this);

        this.anims.create({

            key: "left",
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 6}),
            frameRate: 20,
            repeat: -1

        })

        this.anims.create({

            key: "turn",
            frames: [{key:'player', frame: 7}],
            frameRate: 20

        })

        this.anims.create({

            key: "right",
            frames: this.anims.generateFrameNumbers('player', {start: 8, end: 17}),
            frameRate: 10,
            repeat: -1

        })

        cursors = this.input.keyboard.createCursorKeys();
    }

    update () {
        let direction = 0;

        if (cursors.left.isDown) {
            direction = -1;
            player.setVelocityX(-160);
            player.anims.play('left', true)
        } else if (cursors.right.isDown) {
            direction = 1;
            player.setVelocityX(160);
            player.anims.play('right', true)
        } else {
            direction = 0;
            player.setVelocityX(0);
            player.anims.play('turn', true)
        }

        if (cursors.up.isDown && player.body.touching.down) {

            player.setVelocityY(-370)
        }

        this.background.tilePositionX += direction*5

        if (resourcesGathered === resourcesMax || resourcesDropped === 100) {

            this.scene.start('bossTwo')
        }

        if (playerHealth === 0) {

            this.scene.start('die')
        }
    }

    collectResources (resource) {

        resource.disableBody(true, true);
        resourcesGathered += 1;
        resourcesGatheredText.setText('Resources Gathered: ' + score);

    }

    takeDamage (bomb) {

        bomb.disableBody(true, true);
        playerHealth = 0;
    }
}
