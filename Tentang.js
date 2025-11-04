class Tentang extends Phaser.Scene {
    constructor() {
        super({ key: 'Tentang' });
    }

    preload() {
        this.load.image('tentang', 'assets/bg.png');
        this.load.image('tentangContent', 'assets/papan tentang.png');
        this.load.image('buttonHome', 'assets/button home biru.png');
        this.load.audio('soundHome', 'music/click_effect-86995.mp3'); // Suara tombol
    }

    create() {
        // gambar latar belakang 
        const bg = this.add.image(0, 0, 'tentang').setOrigin(0, 0);
        this.resizeImage(bg);

         // suara tombol
        const soundHome = this.sound.add('soundHome');

        // content papan tentang
        const tentangContent = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'tentangContent').setInteractive();
        tentangContent.setOrigin(0.5, 0.5);
        this.resizeContent(tentangContent);

         // tombol home
        const buttonMargin = 60; 
        const buttonHome = this.createButton(buttonMargin, buttonMargin, 'buttonHome', soundHome, () => {
        buttonHome.setOrigin(0, 0); // Mengatur origin ke pojok kiri atas
        this.scene.start('Home');
    });


        // responsif saat ukuran jendela berubah
        window.addEventListener('resize', () => {
            this.game.scale.resize(window.innerWidth, window.innerHeight);
            this.resizeImage(bg);
            this.resizeContent(tentangContent);
            this.resizeButton(buttonHome);
        });
    }

    resizeImage(image) {
        image.setDisplaySize(window.innerWidth, window.innerHeight);
    }

    resizeContent(image) {
        const imageWidth = window.innerWidth * 0.6;  
        const imageHeight = window.innerHeight * 0.9; 
        image.setDisplaySize(imageWidth, imageHeight);

        // Set posisi gambar kembali di tengah layar
        image.setPosition(window.innerWidth / 2, window.innerHeight / 2);
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

export default Tentang;
