import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.image("ui_frame", "assets/gui/healthbar.png");
        this.load.image("background_normal", "assets/background/background_green.png");
        this.load.image("background_winter", "assets/background/background_winter.png");
        this.load.image('background_blue', 'assets/background/background_blue.png');
        // this.load.image("background", "assets/background.png");
        this.load.image('mountain_grey', 'assets/background/mountain_grey.png');
        this.load.tilemapTiledJSON("map", "assets/tilemaps/world.json");
        this.load.image("normal_tiles", "assets/tilesets/grasstile.png");
        this.load.image("winter_tiles", "assets/tilesets/wintertile.png");

        // Player spritesheets
        this.load.spritesheet(
          "walk_normal",
          "assets/sprites/player_walk2.png", {
            frameWidth: 27,
            frameHeight: 42
        });
        this.load.spritesheet(
          "walk_winter",
          "assets/sprites/player_walk_winter.png", {
            frameWidth: 27,
            frameHeight: 42
        });

        this.load.spritesheet(
          "idle_normal",
          "assets/sprites/player_idle2.png", {
            frameWidth: 27,
            frameHeight: 42 
        });
        this.load.spritesheet(
          "idle_winter",
          "assets/sprites/player_idle_winter2.png", {
            frameWidth: 27,
            frameHeight: 42 
        });
        
        this.load.spritesheet("jump_normal", "assets/sprites/player_jump.png", {
            frameWidth: 27,
            frameHeight: 42,
        });
        this.load.spritesheet("jump_winter", "assets/sprites/player_jump_winter.png", {
            frameWidth: 27,
            frameHeight: 42,
        });

        this.load.spritesheet("attack_normal", "assets/sprites/player_fight.png", {
            frameWidth: 32,
            frameHeight: 40,
        });
        this.load.spritesheet("climb", "assets/sprites/player_climb.png", {
            frameWidth: 27,
            frameHeight: 42,
        });

        // NPC spritesheets
        this.load.spritesheet("rocky_idle", "assets/sprites/rocky_idle.png", {
          frameWidth: 30,
          frameHeight: 42,
          padding: 2,
          margin: 2,
        });
        this.load.spritesheet("rocky_attack", "assets/sprites/rocky_attack.png", {
          frameWidth: 40,
          frameHeight: 40,
        //   padding: 2,
        //   margin: 2,
        });
    
    }

    create ()
    {
        // console.log("Renderer type:", this.game.renderer.type); // 2 = WebGL
        // console.log(
        //   "Canvas dimensions:",
        //   this.game.canvas.width,
        //   "x",
        //   this.game.canvas.height,
        // );

        
        this.scene.start("MainMenu");
    }
}
