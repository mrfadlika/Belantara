class TukarCoin extends Phaser.Scene {
    constructor() {
        super({ key: 'TukarCoin' });
        this.currentContentIndex = 0;
        this.contents = ['fort_rotterdam', 'museum_kota_makassar', 'pantai_losari'];
    }

    preload() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('tukar_coin_judul', 'assets/tukar_coin_judul.png');
        this.load.image('bajubodo_tukar', 'assets/bajubodo_tukar.png');
        this.load.image('recca_tukar', 'assets/recca_tukar.png');
        this.load.image('passappu_tukar', 'assets/passappu_tukar.png');
        this.load.image('Rectangle_tukar', 'assets/Rectangle_tukar.png');
        this.load.image('fort_rotterdam', 'assets/frame pembelian tour 1.png');
        this.load.image('museum_kota_makassar', 'assets/frame pembelian tour 2.png');
        this.load.image('pantai_losari', 'assets/frame pembelian tour 3.png');
        this.load.image('arrow_left', 'assets/button geser ke kiri.png');
        this.load.image('arrow_right', 'assets/button geser ke kanan.png');
        this.load.image('coin_icon', 'assets/coin.png');
        this.load.image('button_kembali', 'assets/button kembali.png');
    }

    getCoin() {
        return parseInt(localStorage.getItem('coin')) || 0;
    }

    setCoin(amount) {
        localStorage.setItem('coin', amount);
    }

    changeContent(direction) {
        this.currentContentIndex += direction;
        
        // Handle wrap-around for continuous scrolling
        if (this.currentContentIndex < 0) {
            this.currentContentIndex = this.contents.length - 1;
        } else if (this.currentContentIndex >= this.contents.length) {
            this.currentContentIndex = 0;
        }
        
        // Update the displayed content
        this.displayedContent.setTexture(this.contents[this.currentContentIndex]);
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Background page
        const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Tombol kembali di kiri atas
        const btnKembali = this.add.image(40, 40, 'button_kembali')
            .setOrigin(0, 0)
            .setScale(0.5)
            .setInteractive()
            .on('pointerup', () => this.scene.start('Belajar'));

        // Coin di kanan atas
        this.coinIcon = this.add.image(this.cameras.main.width - 60, 40, 'coin_icon').setOrigin(1, 0.5).setScale(0.08);
        this.coinText = this.add.text(this.cameras.main.width - 50, 40, this.getCoin(), {
            fontSize: '32px', color: '#fff', fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        // Rectangle atas
        this.add.image(centerX, centerY - 180, 'Rectangle_tukar').setDisplaySize(800, 220).setScale(0.8, 0.8);

        // Judul tukar coin
        this.add.image(centerX, centerY - 345, 'tukar_coin_judul').setOrigin(0.5);

        // Card item tukar (3 item)
        const cardSpacing = 250;
        const cardY = centerY - 180;
        const items = [
            { key: 'passappu_tukar', price: 10 },
            { key: 'recca_tukar', price: 10 },
            { key: 'bajubodo_tukar', price: 10 }
        ];
        items.forEach((item, i) => {
            const x = centerX - cardSpacing + i * cardSpacing;
            this.add.image(x, cardY + 25, item.key).setOrigin(0.5).setScale(0.85);
            this.add.image(x - 30, cardY + 90, 'coin_icon').setScale(0.08);
        });

        // Menambahkan konten yang bisa digeser
        this.displayedContent = this.add.image(centerX, centerY + 170, this.contents[this.currentContentIndex])
            .setDisplaySize(350, 150)
            .setScale(0.8, 0.8);

        // Tombol panah kiri
        const leftArrow = this.add.image(centerX - 600, centerY + 170, 'arrow_left')
            .setScale(0.7)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.changeContent(-1));

        // Tombol panah kanan
        const rightArrow = this.add.image(centerX + 600, centerY + 170, 'arrow_right')
            .setScale(0.7)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.changeContent(1));

        // Efek hover pada tombol
        [leftArrow, rightArrow].forEach(button => {
            button.on('pointerover', () => button.setScale(0.8));
            button.on('pointerout', () => button.setScale(0.7));
        });
    }
}

export default TukarCoin;