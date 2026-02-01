export function createNpcAnimations(scene) {
  scene.anims.create({
    key: "idle_rocky",
    frames: scene.anims.generateFrameNumbers("rocky_idle", {
      start: 0,
      end: 7, // Use 0-7, ignore the extra frame 8
    }),
    frameRate: 8,
    repeat: -1,
  });
  scene.anims.create({
    key: "attack_rocky",
    frames: scene.anims.generateFrameNumbers("rocky_attack", {
      start: 0,
      end: 3,
    }),
    frameRate: 10,
  });
}