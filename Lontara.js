class Lontara extends Phaser.Scene {
    constructor() {
        super({ key: 'Lontara' });
        this.currentContentIndex = 0;
        this.contents = ['LontaraContent1', 'LontaraContent2', 'LontaraContent3', 'LontaraContent4', 'LontaraContent5']; // Daftar konten
    }

    preload() {
        this.load.image('Lontaratbg', 'assets/bg.png');
        this.load.image('LontaraContent1', 'assets/papan menu balajar lontara 1.png');
        this.load.image('LontaraContent2', 'assets/papan menu balajar lontara 2.png');
        this.load.image('LontaraContent3', 'assets/papan menu balajar lontara 3.png');
        this.load.image('LontaraContent4', 'assets/papan menu balajar lontara 4.png');
        this.load.image('LontaraContent5', 'assets/papan menu balajar lontara 5.png');
        this.load.image('buttonBack', 'assets/button kembali.png');
        this.load.image('buttonKiri', 'assets/button geser ke kiri.png');
        this.load.image('buttonKanan', 'assets/button geser ke kanan.png');
        this.load.audio('soundBack', 'music/click_effect-86995.mp3'); // Suara tombol
    }
    
    create() {
        // Gambar latar belakang
        const Lontaratbg = this.add.image(0, 0, 'Lontaratbg').setOrigin(0, 0);
        this.resizeImage(Lontaratbg);

        // Suara tombol
        const soundBack = this.sound.add('soundBack');

        // Menu belajar
        this.currentContent = this.add.image(window.innerWidth / 2, window.innerHeight / 2, this.contents[this.currentContentIndex]).setInteractive();
        this.currentContent.setOrigin(0.5, 0.5);
        this.resizeContent(this.currentContent);

        // Tombol kembali
        const buttonBack = this.createButton(80, 40, 'buttonBack', soundBack, () => {
            this.scene.start('Belajar');
        });

        // Tombol geser ke kiri
        const buttonKiri = this.createButton(window.innerWidth * 0.2, window.innerHeight / 2, 'buttonKiri', soundBack, () => {
            this.changeContent(-1);
        });

        // Tombol geser ke kanan
        const buttonKanan = this.createButton(window.innerWidth * 0.8, window.innerHeight / 2, 'buttonKanan', soundBack, () => {
            this.changeContent(1);
        });

        // Responsif saat ukuran jendela berubah
        window.addEventListener('resize', () => {
            this.game.scale.resize(window.innerWidth, window.innerHeight);
            this.resizeImage(Lontaratbg);
            this.resizeContent(this.currentContent);
            buttonBack.setPosition(80, 40);

            buttonKiri.setPosition(window.innerWidth * 0.2, window.innerHeight / 2);
            buttonKanan.setPosition(window.innerWidth * 0.8, window.innerHeight / 2);
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

export default Lontara;
