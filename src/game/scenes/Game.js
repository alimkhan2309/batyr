import { Scene } from 'phaser';
import { createPlayerAnimations } from "../animations/playerAnimations.js";
import { createNpcAnimations } from "../animations/npcAnimations.js";
import { Player } from "../entities/Player.js";
import { MaskManager } from "../managers/MaskManager.js";
import { Npc } from "../entities/Npc.js";
import { UserInterface } from "../ui/userInterface.js";
import { StoryManager } from '../managers/StoryManager.js';
export class Game extends Scene
{
    constructor ()
    {
        super('Game');
        this.enemies = [];
        this.initialMask = "normal";
        this.climableTiles = [];

    }
    preload ()
    {
        this.load.image("snowflake", "assets/particles/snowflake.png");   
        
    }
    
    create()
    {
      createPlayerAnimations(this);
      createNpcAnimations(this);
      // Tilemap
      const map = this.make.tilemap({ key: "map" });
      const tileset = map.addTilesetImage("world", "normal_tiles");
      this.groundLayer = map.createLayer("myLayer", tileset, 0, 0);

      this.storyManager = new StoryManager(this);
      const startX = this.storyManager.getLastCheckpointPosition().x;
      const startY = this.storyManager.getLastCheckpointPosition().y;
      this.player = new Player(this, startX, startY, this.initialMask);
      this.player.setDepth(99);
      this.maskManager = new MaskManager(this, this.player);

      // Background
      this.background = this.add
        .image(0, 0, "background_" + this.maskManager.currentMask)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(-100);

      this.mountain_grey = this.add
        .tileSprite(0, 0, 320, 180, "mountain_grey")
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(-50);

      // UI
      this.ui = new UserInterface(this, 10, 10);
    //   this.ui.setScrollFactor(0);
      this.ui.setDepth(1000);
      if (this.player.x > 11 * 32) {
        this.ui.tutorial.setAlpha(0);
      }

      // Entities
      this.enemy = new Npc(this, 35 * 32, 24 * 32, "rocky_idle");
      this.enemy2 = new Npc(this, 1624, 450, "rocky_idle");
      this.enemy3 = new Npc(this, 2157, 426, "rocky_idle");
      this.enemy4 = new Npc(this, 2630, 1226, "rocky_idle");
      this.enemy5 = new Npc(this, 2660, 1226, "rocky_idle");
      this.enemy6 = new Npc(this, 2670, 1226, "rocky_idle");
      this.enemies.push(this.enemy);
      this.enemies.push(this.enemy2);
      this.enemies.push(this.enemy3);

        
      // Snow particles
      const snowManager = this.add
        .particles(0, 0, "snowflake", {
          x: { min: 0, max: this.cameras.main.width },
          y: -20,
          lifespan: 10000,
          speedX: { min: -10, max: 10 },
          speedY: { min: 20, max: 50 },
          scale: 0.067,
          alpha: { start: 0.6, end: 0 },
          frequency: 1200, // ms
          blendMode: "ADD",
        })
        .setScrollFactor(0)
        .setDepth(100);

      // Change Map Tileset Event
      this.events.on("changeMapTileset", () => {
        this.cameras.main.flash(400, 255, 255, 255);
        this.cameras.main.shake(200, 0.005);

        // this.maskManager.switchMask("winter");
        this.maskManager.toggleMask();
        snowManager.start();
        const currentMask = this.maskManager.currentMask;
        const newTexture = this.textures.get(currentMask + "_tiles");
        // console.log("Changing tileset to:", currentMask + "_tiles");
        tileset.setImage(newTexture);

        this.background.setTexture("background_" + currentMask);
      });

      this.events.on("playerDamaged", (health) => {
        this.ui.updateHealth(health);
      });

      // Collisions
      this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      this.physics.add.collider(this.player, this.groundLayer);
      this.physics.add.collider(this.enemy, this.groundLayer);
      this.physics.add.collider(this.enemy2, this.groundLayer);
      this.physics.add.collider(this.enemy3, this.groundLayer);
      this.physics.add.collider(this.enemy4, this.groundLayer);
      this.physics.add.collider(this.enemy5, this.groundLayer);
      this.physics.add.collider(this.enemy6, this.groundLayer);

      this.groundLayer.setCollisionByProperty({ collides: true });

      //   this.groundLayer.setPosition(
      //     Math.round(this.groundLayer.x),
      //     Math.round(this.groundLayer.y),
      //   );

      // this.setupCamera();
      // Camera
      this.cameras.main.roundPixels = true;
      this.cameras.main.startFollow(this.player, true, 1, 1);
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }
    
    update () {
        
      console.log(this.player.x, this.player.y);
        if (this.player.x > 11 * 32) {
          this.ui.tutorial.setAlpha(0);
        }
        if (this.player.x > 32*32) {
            this.ui.tutorial2.setVisible(false);
        }
        // Player update
        this.player.update();
        this.enemy.update();
        this.enemy2.update();
        this.enemy3.update();
        this.enemy4.update();
        this.enemy5.update();
        this.enemy6.update();

        if (this.player.x>= 32*37) {
            this.ui.tutorial3.setVisible(true);
            this.ui.tutorial4.setVisible(true);
        }
        
        if (this.player.body.blocked.down || this.player.body.touching.down) {
            //   console.log("On the ground!");
        }
        this.cameras.main.scrollX = Math.round(this.cameras.main.scrollX);
        this.cameras.main.scrollY = Math.round(this.cameras.main.scrollY);
        // Update background parallax
        this.mountain_grey.tilePositionX = this.cameras.main.scrollX * 0.1;
    }
    setupCamera() {
    }
}
    
    
    