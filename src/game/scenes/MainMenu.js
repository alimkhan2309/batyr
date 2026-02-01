import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create()
    {
      // 1. Create the text button
      const startButton = this.add
        .text(this.cameras.main.centerX, this.cameras.main.centerY, "СТАРТ", {
          fontSize: "12px",
          fontFamily: "Arial", // Ensure your font supports Cyrillic
          fill: "#ffffff",
          backgroundColor: "#2d2d2d",
          padding: { x: 42, y: 12 },
          resolution: 2,
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      // 2. Add Hover Effects (Visual Polish)
      startButton.on("pointerover", () => {
        startButton.setStyle({ fill: "#ffcc00" }); // Change text to gold
        startButton.setBackgroundColor("#444444"); // Lighten background
      });

      startButton.on("pointerout", () => {
        startButton.setStyle({ fill: "#ffffff" }); // Back to white
        startButton.setBackgroundColor("#2d2d2d"); // Back to dark grey
      });

      // 3. Add the Click Logic
      startButton.on("pointerdown", () => {
        // Replace 'GameScene' with the name of your actual play scene
        this.scene.start("Game");
      });

      // 4. Fix it to the screen (so it doesn't move with camera)
      startButton.setScrollFactor(0);
    }
}
