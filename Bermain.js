class Bermain extends Phaser.Scene {
    constructor() {
        super({ key: 'Bermain' });
    }

    preload() {
        this.load.image('bermainbg', 'assets/bg.png');
        this.load.image('buttonHomeHijau', 'assets/button home.png');
        this.load.image('bermainButton1', 'assets/button tebak kata.png');
        this.load.image('bermainButton2', 'assets/button buat kalimat.png');
        this.load.image('bermainButton3', 'assets/button lontara.png');
        this.load.image('bermainButton4', 'assets/button kuis budaya.png');
        this.load.audio('soundHome', 'music/click_effect-86995.mp3'); // Suara tombol home
        this.load.audio('buttonSound', 'music/item-pick-up-38258.mp3'); // Suara tombol
    }

    create() {
        // gambar latar belakang 
        const bermainbg = this.add.image(0, 0, 'bermainbg').setOrigin(0, 0);
        this.resizeImage(bermainbg);

        // suara tombol home
        const soundHome = this.sound.add('soundHome');

        // suara tombol
        const buttonSound = this.sound.add('buttonSound');

        // Jarak horizontal & vertikal antar tombol
        const buttonHorizontalSpacing = 260;
        const buttonVerticalSpacing = 150;

        // Titik tengah layar
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Posisi tombol (2x2 grid)
        const button1X = centerX - buttonHorizontalSpacing / 2;
        const button1Y = centerY - buttonVerticalSpacing / 2;
        const button2X = centerX + buttonHorizontalSpacing / 2;
        const button2Y = centerY - buttonVerticalSpacing / 2;
        const button3X = centerX - buttonHorizontalSpacing / 2;
        const button3Y = centerY + buttonVerticalSpacing / 2;
        const button4X = centerX + buttonHorizontalSpacing / 2;
        const button4Y = centerY + buttonVerticalSpacing / 2;

        // Assign buttons to class properties
        this.bermainButton1 = this.createButton(button1X, button1Y, 'bermainButton1', buttonSound, () => {
            this.scene.start('developing');
        });
        this.bermainButton2 = this.createButton(button2X, button2Y, 'bermainButton2', buttonSound, () => {
            this.scene.start('developing');
        });
        this.bermainButton3 = this.createButton(button3X, button3Y, 'bermainButton3', buttonSound, () => {
            this.scene.start('menulisLontara');
        });
        this.bermainButton4 = this.createButton(button4X, button4Y, 'bermainButton4', buttonSound, () => {
            this.scene.start('developing');
        });

        // tombol home
        const buttonMargin = 60; 
        this.buttonHome = this.createButton(buttonMargin, buttonMargin, 'buttonHomeHijau', soundHome, () => {
            this.buttonHome.setOrigin(0, 0); 
            this.scene.start('Home');
        });

        this.updateButtonPositions = () => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const buttonHorizontalSpacing = 530;
            const buttonVerticalSpacing = 200;

            this.bermainButton1.setPosition(centerX - buttonHorizontalSpacing / 2, centerY - buttonVerticalSpacing / 2);
            this.bermainButton2.setPosition(centerX + buttonHorizontalSpacing / 2, centerY - buttonVerticalSpacing / 2);
            this.bermainButton3.setPosition(centerX - buttonHorizontalSpacing / 2, centerY + buttonVerticalSpacing / 2);
            this.bermainButton4.setPosition(centerX + buttonHorizontalSpacing / 2, centerY + buttonVerticalSpacing / 2);
        };

        this.updateButtonPositions();

        window.addEventListener('resize', () => {
            this.game.scale.resize(window.innerWidth, window.innerHeight);
            this.resizeImage(bermainbg);
            this.updateButtonPositions();
        });
    }

    resizeImage(image) {
        image.setDisplaySize(window.innerWidth, window.innerHeight);
    }

    createButton(x, y, texture, sound, callback) {
        const button = this.add.image(x, y, texture).setInteractive();
        button.setOrigin(0.5, 0.5);
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

    isMobile() {
        return window.innerWidth <= 800;
    }
}

export default Bermain;
