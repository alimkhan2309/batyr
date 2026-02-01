import { Boot } from "./scenes/Boot";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import { WEBGL, Game } from "phaser";

const config = {
  type: Phaser.CANVAS,
  width: 320,
  height: 180,
  parent: "game-container",
  backgroundColor: "#7aaa44",
  pixelArt: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 320,
    height: 180,
    zoom: Math.floor(Math.min(window.innerWidth / 320, window.innerHeight / 180)),
},
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  scene: [Boot, Preloader, MainMenu, MainGame],
};

const StartGame = (parent) => {
  return new Game({ ...config, parent });
};

export default StartGame;
