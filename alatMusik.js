class alatMusik extends Phaser.Scene {
    constructor() {
        super({ key: 'alatMusik' });
        this.currentContentIndex = 0;
        this.contents = ['alatMusikContent1', 'alatMusikContent2', 'alatMusikContent3', 'alatMusikContent4', 'alatMusikContent5', 'alatMusikContent6', 'alatMusikContent7']; // Daftar konten
    }

    preload() {
        this.load.image('alatMusikbg', 'assets/bg.png');
        this.load.image('alatMusikContent1', 'assets/papan menu balajar musik 1.png');
        this.load.image('alatMusikContent2', 'assets/papan menu balajar musik 2.png');
        this.load.image('alatMusikContent3', 'assets/papan menu balajar musik 3.png');
        this.load.image('alatMusikContent4', 'assets/papan menu balajar musik 4.png');
        this.load.image('alatMusikContent5', 'assets/papan menu balajar musik 5.png');
        this.load.image('alatMusikContent6', 'assets/papan menu balajar musik 6.png');
        this.load.image('alatMusikContent7', 'assets/papan menu balajar musik 7.png');
        this.load.image('buttonBack', 'assets/button kembali.png');
        this.load.image('buttonKiri', 'assets/button geser ke kiri.png');
        this.load.image('buttonKanan', 'assets/button geser ke kanan.png');
        this.load.audio('soundBack', 'music/click_effect-86995.mp3'); // Suara tombol
    }
    
    create() {
        // Gambar latar belakang
        const alatMusikbg = this.add.image(0, 0, 'alatMusikbg').setOrigin(0, 0);
        this.resizeImage(alatMusikbg);

        // Suara tombol
        const soundBack = this.sound.add('soundBack');

        // menu belajar
        this.currentContent = this.add.image(window.innerWidth / 2, window.innerHeight / 2, this.contents[this.currentContentIndex]).setInteractive();
        this.currentContent.setOrigin(0.5, 0.5);
        this.resizeContent(this.currentContent);

        // Tombol kembali
        const buttonBack = this.createButton(80, 40, 'buttonBack', soundBack, () => {
            this.scene.start('Belajar');
        });

        // Tombol geser ke kiri
        const buttonKiri = this.createButton(window.innerWidth / 2 - 500, window.innerHeight / 2, 'buttonKiri', soundBack, () => {
            this.changeContent(-1);
        });

        // Tombol geser ke kanan
        const buttonKanan = this.createButton(window.innerWidth / 2 + 500, window.innerHeight / 2, 'buttonKanan', soundBack, () => {
            this.changeContent(1);
        });

        // Responsif saat ukuran jendela berubah
        window.addEventListener('resize', () => {
            this.game.scale.resize(window.innerWidth, window.innerHeight);
            this.resizeImage(alatMusikbg);
            this.resizeContent(this.currentContent);
            buttonBack.setPosition(80, 80);

            buttonKiri.setPosition(window.innerWidth / 2 - 500, window.innerHeight / 2);
            buttonKanan.setPosition(window.innerWidth / 2 + 500, window.innerHeight / 2);
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
        button.setOrigin(0.5, 0.5);
        button.setScale(0.50);

        // Efek visual dan suara untuk tombol saat ditekan
        button.on('pointerdown', () => {
            sound.play();
            button.setScale(0.35); // Kecilkan tombol saat ditekan
        });

        button.on('pointerup', () => {
            button.setScale(0.50); // Kembalikan ukuran tombol saat dilepas
            callback(); // Panggil callback saat tombol dilepas
        });

        button.on('pointerout', () => {
            button.setScale(0.50); // Kembalikan ukuran tombol saat kursor keluar dari tombol
        });

        return button;
    }

    resizeButton(button, offsetY = 0) {
        // Set posisi tombol kembali di tengah layar dengan offset Y yang diberikan
        button.setPosition(window.innerWidth / 2, window.innerHeight / 2 + offsetY);
    }

    changeContent(direction) {
        // Hapus konten saat ini
        this.currentContent.destroy();

        // Perbarui indeks konten
        this.currentContentIndex += direction;
        if (this.currentContentIndex < 0) {
            this.currentContentIndex = this.contents.length - 1;
        } else if (this.currentContentIndex >= this.contents.length) {
            this.currentContentIndex = 0;
        }

        // Tambahkan konten baru
        this.currentContent = this.add.image(window.innerWidth / 2, window.innerHeight / 2, this.contents[this.currentContentIndex]).setInteractive();
        this.currentContent.setOrigin(0.5, 0.5);
        this.resizeContent(this.currentContent);
    }
}

export default alatMusik;
