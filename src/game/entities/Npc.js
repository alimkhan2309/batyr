import Phaser from "phaser";

export class Npc extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    // this.setOrigin(0.5, 0.5);
    this.body.setAllowGravity(true);
    this.body.setImmovable(false);
    this.body.setCollideWorldBounds(true);
    this.body.setSize(23, 36);
    this.body.setOffset(4, 7);

    this.health = 100;
    this.isKnockBack = false;

    this.hitBox = scene.add.rectangle(0, 0, 30, 40, 0xff0000, 0);
    scene.physics.add.existing(this.hitBox);
    this.hitBox.body.setAllowGravity(false);
    this.hitBox.body.enable = false;
    this.hitBox.setVisible(true);
    this.hasHitPlayer = false;
    this.setupAnimationListeners();
  }
  // Helper method
  // Checks which "mask" is currently applied and plays the corresponding animation
  playState(state) {
    // const key = this.scene.maskManager.getAnimKey(state);
    // this.anims.play(key, true);
  }
  takeDamage(amount) {
    // console.log("NPC took damage:", this.health);
    if (this.isKnockback) return;

    this.health -= amount;
    if (this.health <= 0) {
      this.die();
      return;
    }
    // Flash red and bounce back
    this.setTintFill(0x0000ff);

    this.isKnockback = true;
    this.anims.play("idle_rocky", true);

    this.setVelocityY(-150);
    this.setVelocityX(-this.facingDirection * 300);

    this.scene.time.delayedCall(300, () => {
      this.isKnockback = false;
      this.clearTint();
    });
  }
  die() {
    this.destroy();
    this.hitBox.destroy();
  }
  setupAnimationListeners() {
    this.on("animationstart", (anim) => {
      // Reset the hit flag when a new attack starts
      if (anim.key === "attack_rocky") {
        this.hasHitPlayer = false;
      }
    });

    this.on("animationupdate", (anim, frame) => {
      if (anim.key === "attack_rocky") {
        // Frame 2: Enable hitbox
        if (frame.index === 2) {
          this.hitBox.body.enable = true;
        }
      }
    });

    this.on("animationcomplete", (anim) => {
      this.endAttack();
    });
  }
  attackPlayer(player) {
    if (this.isKnockback) return;

    // Movement logic...
    const direction = player.x < this.x ? -1 : 1;
    this.setFlipX(direction === -1);

    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      player.x,
      player.y,
    );

    if (distance < 20) {
      this.setVelocityX(0);
      // Just play the animation. DO NOT deal damage here!
      this.anims.play("attack_rocky", true);
    } else {
      this.anims.play("idle_rocky", true);
      if (!this.isKnockback) {
        this.setVelocityX(direction * 50);
      }
    }
  }

  endAttack() {
    this.hitBox.body.enable = false;
    this.anims.play("idle_rocky", true);
  }
  updateHitbox() {
    const offsetX = this.facingDirection * 15;
    this.hitBox.x = this.x + offsetX;
    this.hitBox.y = this.y;
  }

  update() {
    if (!this.active || !this.scene) return;
    this.updateHitbox();

    if (this.hitBox.body.enable && !this.hasHitPlayer) {
      this.scene.physics.overlap(this.hitBox, this.scene.player, () => {
        // Double check inside the callback
        if (!this.hasHitPlayer) {
          this.scene.player.takeDamage(10);
          this.hasHitPlayer = true; // Mark as hit so we don't hit again this swing

          // Push player back slightly
          // this.scene.player.setVelocityX(this.facingDirection * 200);
        }
      });
    }
    // Check if player is within attack range
    const player = this.scene.player;
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      player.x,
      player.y,
    );
    if (distance < 128) {
      this.attackPlayer(player);
    } else {
      this.anims.play("idle_rocky", true);
    }

    // Face player
    if (player.x < this.x) {
      this.setFlipX(true);
    } else {
      this.setFlipX(false);
    }
  }
  get facingDirection() {
    return this.flipX ? -1 : 1;
  }
}
