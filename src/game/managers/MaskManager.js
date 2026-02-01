
export class MaskManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.currentMask = "normal";
        this.masks = ["normal", "winter"];
        this.animMap = {
            normal: {
                walk: "walk_normal",
                idle: "idle_normal",
                jump: "jump_normal",
                attack: "attack_normal",
                climb: "climb_normal"
            },
            winter: {
                walk: "walk_winter",
                idle: "idle_winter",
                jump: "jump_winter",
                attack: "attack_winter",
                climb: "climb_winter"
            },
        };
    }

    switchMask(maskType) {
        const data = this.animMap[maskType];
        this.currentMask = maskType;
        console.log("MM: Switched to ", this.currentMask)
    }
    toggleMask() {
        const currentIndex = this.masks.indexOf(this.currentMask);
        const nextIndex = (currentIndex + 1) % this.masks.length;
        const nextMask = this.masks[nextIndex];
        this.switchMask(nextMask);
    }
    getAnimKey(state) {
        const maskType = this.currentMask;
        return `${state}_${maskType}`;
    }
}