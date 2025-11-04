import Home from './Home.js';    
import Tentang from './Tentang.js'; 
import Belajar from './Belajar.js'; 
import bajuAdat from './bajuAdat.js'; 
import alatMusik from './alatMusik.js'; 
import rumahAdat from './rumahAdat.js'; 
import Lontara from './Lontara.js'; 
import Bermain from './Bermain.js'; 
import Kuis from './Kuis.js'; 
import menulisLontara from './menulisLontara.js'; 
import latihanMenulisLontara from './latihanMenulisLontara.js'; 
import musikBg from './musikBg.js'; 
import Developing from './Developing.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [ musikBg, Home, Tentang, Belajar, bajuAdat, alatMusik, rumahAdat, Lontara, Bermain, Kuis, menulisLontara, latihanMenulisLontara, Developing],
    parent: 'gameContainer',
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    audio: {
        disableWebAudio: true 
    }
};

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});