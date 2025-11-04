class Home extends Phaser.Scene {
    constructor() {
        super({ key: 'Home' });
    }

    preload() {
        this.load.image('home', 'assets/Frame awal.png');
        this.load.image('button', 'assets/button belajar.png'); // Gambar tombol belajar
        this.load.image('button1', 'assets/button bermain.png'); // Gambar tombol bermain
        this.load.image('button2', 'assets/button tentang.png'); // Gambar tombol tentang
        this.load.audio('buttonSound', 'music/item-pick-up-38258.mp3'); // Suara tombol
    }

    create() {
        // gambar latar belakang 
        const homeImage = this.add.image(0, 0, 'home').setOrigin(0, 0);
        this.resizeImage(homeImage);

        // suara tombol
        const buttonSound = this.sound.add('buttonSound');

        // tombol belajar
        const button = this.createButton(window.innerWidth / 2, window.innerHeight / 2, 'button', buttonSound, () => {
            button.setOrigin(0.5, 0.5);
            this.scene.start('Belajar'); 
        });

        // tombol bermain
        const button1 = this.createButton(window.innerWidth / 2, window.innerHeight / 2 + 100, 'button1', buttonSound, () => {
            button.setOrigin(0.5, 0.5);
            this.scene.start('Bermain'); 
        });

        // tombol tentang
        const button2 = this.createButton(window.innerWidth / 2, window.innerHeight / 2 + 208, 'button2', buttonSound, () => {
            button.setOrigin(0.5, 0.5);
            this.scene.start('Tentang'); 
        });

        // responsif saat ukuran jendela berubah
        window.addEventListener('resize', () => {
            this.game.scale.resize(window.innerWidth, window.innerHeight);
            this.resizeImage(homeImage);
            this.resizeButton(button);
            this.resizeButton(button1, 100);
            this.resizeButton(button2, 200);
        });
    }

    resizeImage(image) {
        image.setDisplaySize(window.innerWidth, window.innerHeight);
    }

    createButton(x, y, texture, sound, callback) {
        const button = this.add.image(x, y, texture).setInteractive();
        button.setScale(0.60);

        // efek visual dan suara untuk tombol saat ditekan
        button.on('pointerdown', () => {
            sound.play();
            button.setScale(0.46); // Kecilkan tombol saat ditekan
        });

        button.on('pointerup', () => {
            button.setScale(0.60); // Kembalikan ukuran tombol saat dilepas
            callback(); // Panggil callback saat tombol dilepas
        });

        button.on('pointerout', () => {
            button.setScale(0.60); // Kembalikan ukuran tombol saat kursor keluar dari tombol
        });

        return button;
    }

    resizeButton(button, offsetY = 0) {
        // Set posisi tombol kembali di tengah layar dengan offset Y yang diberikan
        button.setPosition(window.innerWidth / 2, window.innerHeight / 2 + offsetY);
    }
}

export default Home;