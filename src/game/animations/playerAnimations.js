export function createPlayerAnimations(scene) {
  scene.anims.create({
    key: "walk_normal",
    frames: scene.anims.generateFrameNumbers("walk_normal", {
      start: 0,
      end: 7, // Use 0-7, ignore the extra frame 8
    }),
    frameRate: 12,
    repeat: -1,
  });
  scene.anims.create({
    key: "walk_winter",
    frames: scene.anims.generateFrameNumbers("walk_winter", {
      start: 0,
      end: 7, // Use 0-7, ignore the extra frame 8
    }),
    frameRate: 12,
    repeat: -1,
  });
  scene.anims.create({
    key: "idle_normal",
    frames: scene.anims.generateFrameNumbers("idle_normal", {
      start: 0,
      end: 7,
    }),
    frameRate: 8,
    repeat: -1,
  });
  scene.anims.create({
    key: "idle_winter",
    frames: scene.anims.generateFrameNumbers("idle_winter", {
      start: 0,
      end: 7,
    }),
    frameRate: 8,
    repeat: -1,
  });

  scene.anims.create({
    key: "jump_normal",
    frames: scene.anims.generateFrameNumbers("jump_normal", {
      start: 0,
      end: 0,
    }),
    frameRate: 4,
    repeat: 0,
  });
  scene.anims.create({
    key: "jump_winter",
    frames: scene.anims.generateFrameNumbers("jump_winter", {
      start: 0,
      end: 0,
    }),
    frameRate: 4,
    repeat: 0,
  });
  scene.anims.create({
    key: "attack_normal",
    frames: scene.anims.generateFrameNumbers("attack_normal", {
      start: 0,
      end: 3,
    }),
    frameRate: 10,
  });
  scene.anims.create({
    key: "climb",
    frames: scene.anims.generateFrameNumbers("climb", {
      start: 0,
      end: 3,
    }),
    frameRate: 10,
  });
}
