class Bermain extends Phaser.Scene {
    constructor() {
        super({ key: 'Bermain' });
    }

    preload() {
        this.load.image('bermainbg', 'assets/bg.png');
        this.load.image('buttonHomeUngu', 'assets/button home.png');
        this.load.image('bermainButton1', 'assets/button chapter 1.png');
        this.load.image('bermainButton2', 'assets/button chapter 2.png');
        this.load.image('bermainButton3', 'assets/button chapter 3.png');
        this.load.image('pop_up_terkunci', 'assets/Frame 109.png');
        this.load.image('button_kesebelumnya', 'assets/button lanjutkan.png');
        // this.load.image('lockIcon', 'assets/lock_icon.png'); // Ikon kunci
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

        // Titik tengah layar
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        // Jarak vertikal antar tombol
        const buttonVerticalSpacing = 170;

        // Posisi tombol (vertikal di tengah)
        const button1Y = centerY - buttonVerticalSpacing;
        const button2Y = centerY;
        const button3Y = centerY + buttonVerticalSpacing;

        // Tombol Chapter 1 (aktif)
        this.bermainButton1 = this.createButton(centerX, button1Y, 'bermainButton1', buttonSound, () => {
            this.scene.start('Chapter1');
        });

        // Tombol Chapter 2 (terkunci)
        this.bermainButton2 = this.createButton(centerX, button2Y, 'bermainButton2', buttonSound, () => {
            this.scene.start('Chapter2');
        });

        // Tombol Chapter 3 (terkunci)
        this.bermainButton3 = this.createButton(centerX, button3Y, 'bermainButton3', buttonSound, () => {
            // Show locked popup
            this.showLockedPopup();
        });
        
        // Make the button look locked
        this.bermainButton3.setAlpha(0.6);

        // tombol home (pojok kiri atas)
        const buttonMargin = 60;
        this.buttonHomeUngu = this.createButton(buttonMargin, buttonMargin, 'buttonHomeUngu', soundHome, () => {
            this.buttonHomeUngu.setOrigin(0, 0);
            this.scene.start('Home');
        });
        this.buttonHomeUngu.setScale(0.5);
        this.buttonHomeUngu.setOrigin(0, 0);

        // Responsif saat resize
        this.updateButtonPositions = () => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            this.bermainButton1.setPosition(centerX, centerY - buttonVerticalSpacing);
            this.bermainButton2.setPosition(centerX, centerY);
            this.bermainButton3.setPosition(centerX, centerY + buttonVerticalSpacing);
            // this.lockIcon2.setPosition(centerX - 70, centerY);
            // this.lockIcon3.setPosition(centerX - 70, centerY + buttonVerticalSpacing);
            this.buttonHomeUngu.setPosition(buttonMargin, buttonMargin);
            this.resizeImage(bermainbg);
        };
        this.updateButtonPositions();
        window.addEventListener('resize', () => {
            this.game.scale.resize(window.innerWidth, window.innerHeight);
            this.updateButtonPositions();
        });
    }

    showLockedPopup() {
        // Create semi-transparent background
        const bg = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x000000, 0.5)
            .setOrigin(0, 0)
            .setInteractive()
            .on('pointerdown', (pointer) => pointer.event.stopPropagation());

        // Add popup
        const popup = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'pop_up_terkunci')
            .setScale(0.8);

        // Add button to go to Chapter 2
        const buttonKembali = this.add.image(
            window.innerWidth / 2,
            window.innerHeight / 2 + 100,
            'button_kesebelumnya'
        )
        .setInteractive()
        .on('pointerdown', () => {
            this.sound.play('buttonSound');
            this.scene.start('Chapter2');
        });

        // Make button interactive
        buttonKembali.on('pointerover', () => buttonKembali.setScale(1.1));
        buttonKembali.on('pointerout', () => buttonKembali.setScale(1));

        // Add close functionality when clicking outside the popup
        bg.on('pointerdown', () => {
            bg.destroy();
            popup.destroy();
            buttonKembali.destroy();
        });
    }

    resizeImage(image) {
        image.setDisplaySize(window.innerWidth, window.innerHeight);
    }

    createButton(x, y, texture, sound, callback, isLocked = false) {
        const button = this.add.image(x, y, texture).setInteractive();
        button.setOrigin(0.5, 0.5);
        button.setScale(0.60);
        if (isLocked) {
            button.setAlpha(0.7);
            button.disableInteractive();
        } else {
            button.on('pointerdown', () => {
                sound.play();
                button.setScale(0.46);
            });
            button.on('pointerup', () => {
                button.setScale(0.60);
                if (callback) callback();
            });
            button.on('pointerout', () => {
                button.setScale(0.60);
            });
        }
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
