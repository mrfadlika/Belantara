class Developing extends Phaser.Scene {
    constructor() {
        super({ key: 'developing' });
    }

    preload() {
        this.load.image('developing_bg', 'assets/bg2.png');
        this.load.image('developing_frame', 'assets/Frame tahap pengembangan.png');
        this.load.image('buttonKembali', 'assets/button kembali.png');
    }

    create() {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        // Background
        const bg = this.add.image(0, 0, 'developing_bg').setOrigin(0, 0);
        bg.setDisplaySize(screenWidth, screenHeight);

        // Frame pengembangan (sudah termasuk logo & text)
        const frame = this.add.image(screenWidth / 2, screenHeight / 2, 'developing_frame')
            .setOrigin(0.5, 0.5);

        // Tombol kembali (pojok kiri atas)
        const button = this.add.image(120, 70, 'buttonKembali')
            .setOrigin(0.5, 0.5)
            .setScale(0.8)
            .setInteractive({ useHandCursor: true });

        button.on('pointerdown', () => {
            this.scene.start('Home');
        });
    }
}

export default Developing;