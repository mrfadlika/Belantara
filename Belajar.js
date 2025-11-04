class Belajar extends Phaser.Scene {
    constructor() {
        super({ key: 'Belajar' });
    }

    preload() {
        this.load.image('belajarbg', 'assets/bg.png');
        this.load.image('buttonHome', 'assets/button home hijau.png');
        this.load.image('belajarButton1', 'assets/button menulis lontara.png');
        this.load.image('belajarButton2', 'assets/button baju adat.png');
        this.load.image('belajarButton3', 'assets/button menulis.png');
        this.load.audio('soundHome', 'music/click_effect-86995.mp3'); // Suara tombol home
        this.load.audio('buttonSound', 'music/item-pick-up-38258.mp3'); // Suara tombol
    }

    create() {
        // gambar latar belakang 
        const belajarbg = this.add.image(0, 0, 'belajarbg').setOrigin(0, 0);
        this.resizeImage(belajarbg);

        // suara tombol home
        const soundHome = this.sound.add('soundHome');

        // suara tombol
        const buttonSound = this.sound.add('buttonSound');

        // Jarak vertikal antara kedua tombol
        const buttonVerticalSpacing = 225;

        // Koordinat posisi untuk ditengah layar
        const button1X = window.innerWidth / 2;
        const button1Y = window.innerHeight / 2 - buttonVerticalSpacing; 

        // Koordinat posisi untuk sedikit bergeser ke kanan dari tengah
        const button2X = window.innerWidth / 2 ; // Geser 330 piksel ke kanan dari tengah
        const button2Y = button1Y + buttonVerticalSpacing; 

        // Assign buttons to class properties
        this.belajarButton1 = this.createButton(button1X, button1Y, 'belajarButton1', buttonSound, () => {
            this.scene.start('latihanMenulisLontara');
        });

        this.belajarButton2 = this.createButton(button2X, button2Y, 'belajarButton2', buttonSound, () => {
            this.scene.start('bajuAdat');
        });

        this.belajarButton3 = this.createButton(button2X, button2Y, 'belajarButton3', buttonSound, () => {
            this.scene.start('developing');
        });

        // tombol home
        const buttonMargin = 60; 
        this.buttonHome = this.createButton(buttonMargin, buttonMargin, 'buttonHome', soundHome, () => {
            this.buttonHome.setOrigin(0, 0); 
            this.scene.start('Home');
        });

        this.updateButtonPositions();

        // simpan handler agar bisa dihapus nanti
        this._resizeHandler = () => {
            this.game.scale.resize(window.innerWidth, window.innerHeight);
            this.resizeImage(belajarbg);
            this.updateButtonPositions();
        };
        window.addEventListener('resize', this._resizeHandler);

        // responsif saat ukuran jendela berubah
        window.addEventListener('resize', this._resizeHandler);

        this.events.on('shutdown', this.shutdown, this);
        this.events.on('destroy', this.destroy, this);
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

    isMobile(){
        return window.innerWidth <= 800;
    }

    updateButtonPositions() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        if (this.isMobile()) {
            // Adjust button positions for mobile (vertical layout)
            const buttonVerticalSpacing = 150;
            this.belajarButton1.setPosition(centerX, centerY - 1.5 * buttonVerticalSpacing - 50); // dinaikkan 50px
            this.belajarButton2.setPosition(centerX, centerY - 0.5 * buttonVerticalSpacing - 50); // dinaikkan 50px
            this.belajarButton3.setPosition(centerX, centerY + 0.5 * buttonVerticalSpacing - 50); // dinaikkan 50px
        } else {
            // Adjust button positions for desktop (horizontal layout)
            const buttonVerticalSpacing = 80;
            this.belajarButton1.setPosition(centerX, centerY - buttonVerticalSpacing - 50); // dinaikkan 50px
            this.belajarButton2.setPosition(centerX, centerY + buttonVerticalSpacing - 50); // dinaikkan 50px
            this.belajarButton3.setPosition(centerX, centerY + buttonVerticalSpacing * 2 + 25); // dinaikkan 50px
        }
    }

    shutdown() {
        if (this._resizeHandler) {
            window.removeEventListener('resize', this._resizeHandler);
            this._resizeHandler = null;
        }
    }

    destroy() {
        this.shutdown();
    }
}

export default Belajar;
