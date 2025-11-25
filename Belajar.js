class Belajar extends Phaser.Scene {
    constructor() {
        super({ key: 'Belajar' });
    }

    preload() {
        this.load.image('belajarbg', 'assets/bg.png');
        this.load.image('buttonHomeHijau', 'assets/button home hijau.png');
        this.load.image('belajarButton1', 'assets/button menulis lontara.png');
        this.load.image('belajarButton2', 'assets/button baju adat.png');
        this.load.image('belajarButton3', 'assets/button menulis.png');
        this.load.image('belajarButton4', 'assets/button penukaran coin.png');
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
        const buttonVerticalSpacing = 800;

        // Semua tombol awalnya di tengah layar, spacing diatur oleh updateButtonPositions
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        this.belajarButton1 = this.createButton(centerX, centerY, 'belajarButton1', buttonSound, () => {
            this.scene.start('latihanMenulisLontara');
        });
        this.belajarButton2 = this.createButton(centerX, centerY, 'belajarButton2', buttonSound, () => {
            this.scene.start('bajuAdat');
        });
        this.belajarButton3 = this.createButton(centerX, centerY, 'belajarButton3', buttonSound, () => {
            this.scene.start('kosakata');
        });
        this.belajarButton4 = this.createButton(centerX, centerY, 'belajarButton4', buttonSound, () => {
            this.scene.start('TukarCoin');
        });

        // tombol home
        const buttonMargin = 60; 
        this.buttonHomeHijau = this.createButton(buttonMargin, buttonMargin, 'buttonHomeHijau', soundHome, () => {
            this.buttonHomeHijau.setOrigin(0, 0); 
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
            button.setScale(0.46);
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
        const centerY = window.innerHeight / 2 + 50;

        if (this.isMobile()) {
            // Adjust button positions for mobile (vertical layout)
            const buttonVerticalSpacing = 800;
            this.belajarButton1.setPosition(centerX, centerY - 1.5 * buttonVerticalSpacing - 50); // dinaikkan 50px
            this.belajarButton2.setPosition(centerX, centerY - 0.5 * buttonVerticalSpacing - 50); // dinaikkan 50px
            this.belajarButton3.setPosition(centerX, centerY + 0.5 * buttonVerticalSpacing - 50); // dinaikkan 50px
            this.belajarButton4.setPosition(centerX, centerY + 1.5 * buttonVerticalSpacing - 50); // dinaikkan 50px
        } else {
            // Adjust button positions for desktop (vertical layout, 4 bagian)
            const buttonVerticalSpacing = 150;
            this.belajarButton1.setPosition(centerX, centerY - 1.5 * buttonVerticalSpacing - 50);
            this.belajarButton2.setPosition(centerX, centerY - 0.5 * buttonVerticalSpacing - 50);
            this.belajarButton3.setPosition(centerX, centerY + 0.5 * buttonVerticalSpacing - 50);
            this.belajarButton4.setPosition(centerX, centerY + 1.5 * buttonVerticalSpacing - 50);
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
