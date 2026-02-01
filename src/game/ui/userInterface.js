export class UserInterface extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);

    this.healthBarBackground = this.scene.add.graphics();
    this.healthBarBackground.fillStyle(0x000000, 1);
    this.healthBarBackground.fillRect(-6, -6, 124, 24);

    this.healthBar = this.scene.add.rectangle(56, 6, 120, 24, 0x79a848);

    this.frame = this.scene.add.image(0, 0, "ui_frame").setOrigin(0, 0);
    this.frame.setPosition(-8, -10);
    this.frame.setOrigin(0, 0);

    // Add text label
    this.tutorial = this.scene.add
      .text(32, 40, "Используйте WASD для движения", {
        fontSize: "10px",
        fontFamily: "Arial",
        fill: "#ffffff",
        resolution: 3,
      })
      .setOrigin(0, 0);

      this.tutorial2 = this.scene.add
        .text(
          30*32,
          22*32,
          "ПКМ для атаки",
          {
            fontSize: "10px",
            fontFamily: "Arial",
            fill: "#ffffff",
            resolution: 3,
          },
        )
        .setOrigin(0, 0);
      this.tutorial3 = this.scene.add
        .text(
          41 * 32,
          21 * 32,
          "Нажми E, чтобы сменить маску", 
          {
            fontSize: "10px",
            fontFamily: "Arial",
            fill: "#ffffff",
            resolution: 3,
          },
        )
        .setOrigin(0, 0)
        .setVisible(false);
      this.tutorial4 = this.scene.add
        .text(
          39 * 32,
          23 * 32,
          "Удерживай SHIFT, чтобы карабкаться ->", 
          {
            fontSize: "10px",
            fontFamily: "Arial",
            fill: "#ffffff",
            resolution: 3,
          },
        )
        .setOrigin(0, 0)
        .setVisible(false);

    // Add all elements to container
    this.add(this.healthBarBackground);
    this.add(this.healthBar);
    this.add(this.frame);
    this.add(this.tutorial);

    // Set scroll factor ONCE at the end
    this.setScrollFactor(0);
  }

  updateHealth(health) {
    const newWidth = Phaser.Math.Clamp(health, 0, 100) * 1.2;
    this.healthBar.width = newWidth;
  }
}
