import Home from "./Home.js";
import Tentang from "./Tentang.js";
import Belajar from "./Belajar.js";
import bajuAdat from "./bajuAdat.js";
import alatMusik from "./alatMusik.js";
import rumahAdat from "./rumahAdat.js";
import Lontara from "./Lontara.js";
import Bermain from "./Bermain.js";
import Kuis from "./Kuis.js";
import menulisLontara from "./menulisLontara.js";
import latihanMenulisLontara from "./latihanMenulisLontara.js";
import musikBg from "./musikBg.js";
import Developing from "./Developing.js";
import Chapter1 from "./Chapter1.js";
import Kosakata from "./Kosakata.js";
import TukarCoin from "./TukarCoin.js";
import Level1Chapter1 from "./Level1Chapter1.js";
import Chapter2 from "./Chapter2.js";
import Chapter3 from "./Chapter3.js";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    musikBg,
    Home,
    Tentang,
    Belajar,
    bajuAdat,
    alatMusik,
    rumahAdat,
    Lontara,
    Bermain,
    Chapter1,
    Kuis,
    menulisLontara,
    latihanMenulisLontara,
    Developing,
    Kosakata,
    TukarCoin,
    Level1Chapter1,
    Chapter2,
    Chapter3,
  ],
  parent: "gameContainer",
  dom: {
    createContainer: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  audio: {
    disableWebAudio: true,
  },
};

const game = new Phaser.Game(config);

window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
