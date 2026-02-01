export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setBounce(0);
    // Body Setup
    this.body.setCollideWorldBounds(true);
    this.body.setSize(20, 40);
    this.body.setOffset(4, 3);

    // Hitbox Setup
    this.attackHitbox = scene.add.rectangle(0, 0, 10, 10, 0xff0000, 0);
    scene.physics.add.existing(this.attackHitbox);
    this.attackHitbox.body.setAllowGravity(false);
    this.attackHitbox.body.enable = false;
    this.attackHitbox.setVisible(false);

    // Attack State
    this.isAttacking = false;
    this.lungeApplied = false;
    this.hitEnemiesThisAttack = new Set();

    // Climbing State
    this.isClimbing = false;
    this.wasClimbing = false; // Track previous state

    // Attack State
    this.isKnockback = false;
    this.isInvincible = false;
    this.invincibilityDuration = 500;
    // Attributes
    this.speed = 100;
    this.jumpPower = 200;
    this.attackDamage = 30;
    this.lungePower = 520;
    this.attackFriction = 0.85;
    this.health = 100;
    this.climbSpeed = 80;
    this.climbGraceTimer = 0;

    // Input Setup
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys("W,A,S,D,SPACE,E,SHIFT");

    // Setup animation listeners once
    this.setupAnimationListeners();
  }

  setupAnimationListeners() {
    this.on("animationstart", (anim) => {
      if (anim.key === "attack_normal") {
        this.lungeApplied = false;
        this.hitEnemiesThisAttack.clear();
      }
    });

    this.on("animationupdate", (anim, frame) => {
      if (anim.key === "attack_normal") {
        if (frame.index === 3 && !this.lungeApplied) {
          this.lungeApplied = true;
          this.applyLunge();
          this.enableAttackHitbox();
        }

        if (frame.index === 5) {
          this.disableAttackHitbox();
        }
      }
    });

    this.on("animationcomplete", (anim) => {
      if (anim.key === "attack_normal") {
        this.endAttack();
      }
    });
  }

  applyLunge() {
    const lungeDirection = this.facingDirection * this.lungePower;
    this.setVelocityX(lungeDirection);
  }

  enableAttackHitbox() {
    this.attackHitbox.body.enable = true;
  }

  disableAttackHitbox() {
    this.attackHitbox.body.enable = false;
  }

  checkAttackCollision() {
    if (!this.attackHitbox.body.enable) return;

    this.scene.physics.overlap(
      this.attackHitbox,
      this.scene.enemies,
      (hitbox, enemy) => {
        if (!this.hitEnemiesThisAttack.has(enemy) && enemy.takeDamage) {
          enemy.takeDamage(this.attackDamage);
          this.hitEnemiesThisAttack.add(enemy);
        }
      },
    );
  }

  takeDamage(amount) {
    if (this.isInvincible) return;
    console.log("Player took damage:", amount);
    this.health -= amount;
    this.scene.events.emit("playerDamaged", this.health);
    if (this.health <= 0) {
      this.die();
    } else {
      this.isInvincible = true;
      this.isKnockback = true;

      this.setVelocityY(-50);
      this.setVelocityX(-this.facingDirection * 200);

      this.setTintFill(0xff0000);
      this.setAlpha(0.5);

      this.scene.time.delayedCall(300, () => {
        this.isKnockback = false;
      });

      this.scene.time.delayedCall(this.invincibilityDuration, () => {
        this.isInvincible = false;
        this.clearTint();
        this.setAlpha(1);
      });
    }
  }

  die() {
    // console.log("Player health: " + this.health);
    this.scene.cameras.main.shake(500, 0.02);
    this.scene.cameras.main.fadeOut(2000, 0, 0, 0);
    this.scene.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.scene.scene.restart();
      },
    );
    this.respawn();
  }
  respawn() {
    const checkpoint = this.scene.storyManager.getLastCheckpointPosition();
    this.setPosition(checkpoint.x, checkpoint.y);
    this.health = 100;
    this.scene.events.emit("playerDamaged", this.health);
  }

  attack() {
    if (this.isAttacking) return;

    this.isAttacking = true;
    this.setPhysicsSize(true);
    this.anims.play("attack_normal", true);
    this.anims.pause();
  }

  endAttack() {
    this.setPhysicsSize(false);
    this.isAttacking = false;
    this.disableAttackHitbox();
    this.hitEnemiesThisAttack.clear();
    this.anims.play(this.scene.maskManager.getAnimKey("idle"), true);
  }

  updateHitbox() {
    const offsetX = this.facingDirection * 15;
    this.attackHitbox.x = this.x + offsetX;
    this.attackHitbox.y = this.y;
  }

  handleInput() {
    const pointer = this.scene.input.activePointer;

    // Attack input
    if (pointer.isDown && !this.isAttacking) {
      this.attack();
    }

    // Release to execute attack
    if (this.isAttacking && this.anims.isPaused && !pointer.isDown) {
      this.anims.resume();
    }

    // Mask change
    if (Phaser.Input.Keyboard.JustDown(this.keys.E)) {
      this.scene.events.emit("changeMapTileset");
    }
  }

  // Helper method to safely play animation only if it's not already playing
  playAnimationSafe(animKey, ignoreIfPlaying = true) {
    // 1. If no animation is loaded, play it.
    if (!this.anims.currentAnim) {
      this.anims.play(animKey, ignoreIfPlaying);
      return;
    }

    // 2. If the keys are different, play the new one.
    if (this.anims.currentAnim.key !== animKey) {
      this.anims.play(animKey, ignoreIfPlaying);
      return;
    }

    // 3. If keys match, but it is NOT playing (it finished or is stuck), force restart.
    // Note: We check !isPaused because we handle pausing manually in handleMovement.
    if (
      this.anims.currentAnim.key === animKey &&
      !this.anims.isPlaying &&
      !this.anims.isPaused
    ) {
      this.anims.play(animKey, ignoreIfPlaying);
    }
  }

  handleMovement() {
    // If attacking, apply friction to slow down after lunge
    if (this.isKnockback) return;
    if (this.isAttacking) {
      this.setVelocityX(this.body.velocity.x * this.attackFriction);
      return;
    }

    const onGround = this.isOnGround();
    const idleState = this.scene.maskManager.getAnimKey("idle");
    const walkState = this.scene.maskManager.getAnimKey("walk");
    const jumpState = this.scene.maskManager.getAnimKey("jump");
    const climbState = "climb"; // Climb animation doesn't change with mask

    // Check if we can climb
    const canClimb = this.canClimbWall();

    // CLIMBING MODE

    if (this.keys.SHIFT.isDown && canClimb) {
      if (!this.isClimbing) {
        this.isClimbing = true;
        this.body.setAllowGravity(false);
        this.setVelocity(0, 0);
      }

      this.setVelocityX(0);

      const movingUp = this.cursors.up.isDown || this.keys.W.isDown;
      const movingDown = this.cursors.down.isDown || this.keys.S.isDown;

      if (movingUp) {
        this.setVelocityY(-this.climbSpeed);
        this.anims.resume(); // Un-pause if we were holding still
        this.playAnimationSafe(climbState); // Now this will restart if it finished!
      } else if (movingDown) {
        this.setVelocityY(this.climbSpeed);
        this.anims.resume();
        this.playAnimationSafe(climbState);
      } else {
        this.setVelocityY(0);
        // Stick the animation on a specific frame when not moving
        this.playAnimationSafe(climbState);
        this.anims.pause();
      }

      this.wasClimbing = true;
      return; // Stop the rest of the function!
    } else {
      if (this.isClimbing) {
        this.isClimbing = false;
        this.body.setAllowGravity(true);
        // If we were climbing and now stopped, give a small downward nudge
        if (this.wasClimbing) {
          this.setVelocityY(10);
          this.wasClimbing = false;
        }
      }
    }

    // NORMAL MOVEMENT - Only executes if not climbing

    // Horizontal movement
    if (this.cursors.left.isDown || this.keys.A.isDown) {
      this.setVelocityX(-this.speed);
      this.setFlipX(true);
      if (onGround) this.playAnimationSafe(walkState);
    } else if (this.cursors.right.isDown || this.keys.D.isDown) {
      this.setVelocityX(this.speed);
      this.setFlipX(false);
      if (onGround) this.playAnimationSafe(walkState);
    } else {
      this.setVelocityX(0);
      if (onGround) this.playAnimationSafe(idleState);
    }

    // Jumping - only when on ground
    if (
      (this.cursors.up.isDown ||
        this.keys.W.isDown ||
        this.keys.SPACE.isDown) &&
      onGround
    ) {
      this.setVelocityY(-this.jumpPower);
      this.playAnimationSafe(jumpState);
    }

    // Air state - only when not on ground
    if (!onGround) {
      this.playAnimationSafe(jumpState);
    }
  }

  update() {
    this.updateHitbox();
    this.handleInput();
    this.handleMovement();

    // Continuously check for attack collisions while hitbox is active
    if (this.isAttacking && this.attackHitbox.body.enable) {
      this.checkAttackCollision();
    }
  }

  setPhysicsSize(isAttacking) {
    if (isAttacking) {
      this.body.setSize(23, 40);
      this.body.setOffset(4, 0);
    } else {
      this.body.setSize(20, 40);
      this.body.setOffset(4, 3);
    }
  }

  // Helper Methods
  isOnGround() {
    return this.body.blocked.down || this.body.touching.down;
  }

  get facingDirection() {
    return this.flipX ? -1 : 1;
  }

  destroy() {
    if (this.attackHitbox) {
      this.attackHitbox.destroy();
    }
    super.destroy();
  }

  canClimbWall() {
    const layer = this.scene.groundLayer;
    if (!layer || this.scene.maskManager.currentMask !== "winter") return false;

    // Check if player is actually pressing towards a wall or already "stuck" to one
    const pressingLeft = this.cursors.left.isDown || this.keys.A.isDown;
    const pressingRight = this.cursors.right.isDown || this.keys.D.isDown;

    // Look slightly further left/right than the body edge
    const checkOffset = 4;
    const checkX = this.flipX
      ? this.body.left - checkOffset
      : this.body.right + checkOffset;

    let tileFound = false;
    for (let yOffset = 4; yOffset < this.body.height; yOffset += 16) {
      const tile = layer.getTileAtWorldXY(
        checkX,
        this.body.top + yOffset,
        true,
      );
      if (this.isTouchingClimbableTile(tile)) {
        tileFound = true;
        break;
      }
    }

    // Stable state: Either we are physically blocked OR we found a tile while already climbing
    if (
      tileFound &&
      (this.body.blocked.left || this.body.blocked.right || this.isClimbing)
    ) {
      this.climbGraceTimer = 5; // Reset grace period frames
      return true;
    }

    // Use grace period to prevent flickering
    if (this.climbGraceTimer > 0) {
      this.climbGraceTimer--;
      return true;
    }

    return false;
  }

  isTouchingClimbableTile(tile) {
    if (!tile) return false;
    if (!tile.properties) return false;
    return tile.properties.climbable === true;
  }
}
