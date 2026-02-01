export class StoryManager {
  constructor(scene) {
    this.scene = scene;
    this.currentCheckpoint = null;
    this.storyFlags = {
      metGrandpa: false,
      defeatedRocky: false,
    };

    this.checkpoints = {
      start: { x: 32, y: 32*23 },
    //   start: { x: 72*32, y: 37*23 },
      grandpa: { x: 576, y: 1500 },
      climbed: { x: 3000, y: 1200 },
    };
  }
  setCheckpoint(checkpointId) {
    this.currentCheckpoint = checkpointId;
    console.log("SM: Checkpoint set to ", this.currentCheckpoint);
  }
  getLastCheckpointPosition() {
    if (this.currentCheckpoint && this.checkpoints[this.currentCheckpoint]) {
      return this.checkpoints[this.currentCheckpoint];
    }
    return this.checkpoints["start"];
  }
}