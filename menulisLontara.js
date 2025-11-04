import DrawingBoard from "./object/drawingBoard.js";

class menulisLontara extends Phaser.Scene {
    constructor() {
        super({ key: 'menulisLontara' });
        this.questions = [
            { imageKey: 'a', answer: 'a' },
            { imageKey: 'ba', answer: 'ba' },
            { imageKey: 'ca', answer: 'ca' },
            { imageKey: 'da', answer: 'da' },
            { imageKey: 'ga', answer: 'ga' },
            { imageKey: 'ha', answer: 'ha' },
            { imageKey: 'ja', answer: 'ja' },
            { imageKey: 'ka', answer: 'ka' },
            { imageKey: 'la', answer: 'la' },
            { imageKey: 'ma', answer: 'ma' },
            { imageKey: 'na', answer: 'na' },
            { imageKey: 'mpa', answer: 'mpa' },
            { imageKey: 'nca', answer: 'nca' },
            { imageKey: 'nga', answer: 'nga' },
            { imageKey: 'ngka', answer: 'ngka' },
            { imageKey: 'nra', answer: 'nra' },
            { imageKey: 'nya', answer: 'nya' },
            { imageKey: 'pa', answer: 'pa' },
            { imageKey: 'ra', answer: 'ra' },
            { imageKey: 'sa', answer: 'sa' },
            { imageKey: 'ta', answer: 'ta' },
            { imageKey: 'wa', answer: 'wa' },
            { imageKey: 'ya', answer: 'ya' },
        ];
        this.score = 0;
        this.usedIndices = [];
        this.currentQuestionIndex = Math.floor(Math.random() * this.questions.length);
        this.lives = 3;
        this.initialLives = 3;
    }

    preload() {
        this.load.image('heart', 'assets/heart.png')
        this.load.image('menulisbg', 'assets/Frame pengenalan lontara.png');
        this.load.audio('button_click', 'music/click_effect-86995.mp3'); // Suara tombol home
        this.load.audio('wrong_answer_sound', 'music/negative_beeps-6008.mp3');
        this.load.audio('true_answer_sound', 'music/correct-2-46134.mp3'); 
        this.questions.forEach(question => {
            this.load.image(question.imageKey, `assets/latin/${question.imageKey}.png`);
        });
        this.load.image('button_hapus_ungu', 'assets/button hapus ungu.png');
        this.load.image('button_submit_ungu', 'assets/button submit ungu.png');
        this.load.image('wrongMessage', 'assets/Frame salah.png');
        this.load.image('trueMessage', 'assets/Frame benar.png');
        this.load.image('buttonHomeHijau', 'assets/button home.png');
        this.load.audio('soundBack', 'music/click_effect-86995.mp3');
        this.load.image('akhirKuisLontara', 'assets/Frame skor.png');
        this.load.audio('tepukTangan', 'music/applause-alks-ses-efekti-125030.mp3');
    }

    create() {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        // Tambahkan background
        const menulisbg = this.add.image(0, 0, 'menulisbg').setOrigin(0, 0);
        menulisbg.setDisplaySize(screenWidth, screenHeight);

        // Ukuran dan posisi kotak (sama dengan latihanMenulisLontara)
        const boxWidth = 720;
        const boxHeight = 442;
        const boxSpacing = 100;
        const centerY = screenHeight / 2 + 89;
        const leftBoxX = screenWidth / 2 - boxWidth - boxSpacing / 2;
        const rightBoxX = screenWidth / 2 + boxSpacing / 2;

        // Background kotak kiri (drawing)
const leftBox = this.add.graphics();
leftBox.lineStyle(4, 0x8e24aa, 1); // ungu
leftBox.strokeRoundedRect(leftBoxX, centerY - boxHeight / 2, boxWidth, boxHeight, 32);
leftBox.fillStyle(0xffffff, 1);
leftBox.fillRoundedRect(leftBoxX, centerY - boxHeight / 2, boxWidth, boxHeight, 32);

// Background kotak kanan (soal)
const rightBox = this.add.graphics();
rightBox.lineStyle(4, 0x8e24aa, 1); // ungu
rightBox.strokeRoundedRect(rightBoxX, centerY - boxHeight / 2, boxWidth, boxHeight, 32);
rightBox.fillStyle(0xffffff, 1);
rightBox.fillRoundedRect(rightBoxX, centerY - boxHeight / 2, boxWidth, boxHeight, 32);

        // Judul atas kotak
        this.add.text(leftBoxX + boxWidth / 2, centerY - boxHeight / 2 + 18, 'GAMBAR DISINI', {
            font: 'bold 20px Arial',
            color: '#8e24aa'
        }).setOrigin(0.5, 0);

        this.add.text(rightBoxX + boxWidth / 2, centerY - boxHeight / 2 + 18, 'TULIS HURUF DIBAWAH INI', {
            font: 'bold 20px Arial',
            color: '#8e24aa'
        }).setOrigin(0.5, 0);

        // Drawing board di tengah kotak kiri
        this.drawingBoardX = leftBoxX + 30;
        this.drawingBoardY = centerY - boxHeight / 2 + 40;
        this.drawingBoard = new DrawingBoard(this, this.drawingBoardX, this.drawingBoardY, boxWidth - 60, boxHeight - 80);

        // Gambar soal di tengah kotak kanan
        this.questionImage = this.add.image(
            rightBoxX + boxWidth / 2,
            centerY,
            this.questions[this.currentQuestionIndex].imageKey
        ).setOrigin(0.5, 0.5).setScale(0.9);

        const button_click = this.sound.add('button_click');

        const soundBack = this.sound.add('soundBack');

        // Tombol kembali
        const buttonBack = this.createButtonBack(80, 40, 'buttonHomeHijau',     soundBack, () => {
            if (this.questionImage) {
                this.questionImage.destroy();
                this.questionImage = null;
            }
            this.scene.start('Bermain');
        });

        this.resizeImage(menulisbg);
        window.addEventListener('resize', () => {
            this.game.scale.resize(window.innerWidth, window.innerHeight);
            this.resizeImage(menulisbg);
            buttonBack.setPosition(80, 80);
        });

        this.hearts = [];
        // Tambahkan tiga gambar hati ke layar
        for (let i = 0; i < this.lives; i++) {
            const heart = this.add.image(screenWidth - (i * 60) - 50, 50, 'heart').setOrigin(1, 0).setScale(0.1);
            this.hearts.push(heart);
        }

        // ===== Area tombol di bawah kedua box =====
        const buttonAreaY = centerY + boxHeight / 2 + 50;

        // Tombol hapus (kiri bawah)
        const button_hapus_ungu = this.createButton(
            leftBoxX + boxWidth / 2 - 300, buttonAreaY,
            'button_hapus_ungu', button_click, () => {
                this.clearBoard()
            }
        );

        // Tombol submit (kanan bawah, masih di bawah box kiri)
        const button_submit_ungu = this.createButton(
            leftBoxX + boxWidth / 2 - 180, buttonAreaY + 8,
            'button_submit_ungu', button_click, () => {
                this.drawingBoard.captureCanvasImage(this.checkAnswer.bind(this));
            }
        );

        // Menambahkan latar belakang putih dan gambar soal
        this.questionBackground = this.add.graphics();

        this.scoreText = this.add.text((window.innerWidth/2) - 20, 180, this.score, { fontSize: '45px', color: '#fff', fontStyle: 'bold', stroke: '#000' ,strokeThickness: 1});

        this.wrongMessage = this.add.image(screenWidth / 2, this.scale.height / 2, 'wrongMessage').setOrigin(0.5, 0.5).setScale(0.8).setVisible(false);

        this.trueMessage = this.add.image(screenWidth / 2, this.scale.height / 2, 'trueMessage').setOrigin(0.5, 0.5).setScale(0.8).setVisible(false);

    }

    resetGame() {
        // Reset score
        this.score = 0;
        this.scoreText.setText(this.score);

        // Reset lives
        this.lives = this.initialLives;

        // Reset hearts visibility
        this.hearts.forEach(heart => heart.setVisible(true));

        // Reset index pertanyaan
        this.usedIndices = [];
        this.currentQuestionIndex = Math.floor(Math.random() * this.questions.length);
        this.questionImage.setTexture(this.questions[this.currentQuestionIndex].imageKey);
    }

    resizeImage(image) {
        image.setDisplaySize(window.innerWidth, window.innerHeight);
    }

    clearBoard(){
        this.drawingBoard.clear();
    }

    createButton(x, y, texture, sound, callback) {
        const button = this.add.image(x, y, texture).setInteractive();
        button.setOrigin(0.6, 0.6);
        button.setScale(0.60);

        button.on('pointerdown', () => {
            sound.play();
            button.setScale(0.50); // Kecilkan tombol saat ditekan
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

    createButtonBack(x, y, texture, sound, callback) {
        const button = this.add.image(x, y, texture).setInteractive();
        button.setOrigin(0.5, 0.5);
        button.setScale(0.50);

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

    showWrongMessage() {
        this.sound.add('wrong_answer_sound').play();
        this.wrongMessage.setVisible(true);
        this.time.delayedCall(1500, () => {
            this.wrongMessage.setVisible(false);
        });
    }

    showTrueMessage() {
        this.sound.add('true_answer_sound').play();
        this.trueMessage.setVisible(true);
        this.time.delayedCall(1500, () => {
            this.trueMessage.setVisible(false);
        });
    }

    checkAnswer(predictedAnswer) {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        if (predictedAnswer === currentQuestion.answer) {
            this.showTrueMessage()
            this.score += 10;
            this.scoreText.setText(this.score);
            this.usedIndices.push(this.currentQuestionIndex); // buat property baru untuk menampung index
          
            if (this.usedIndices.length < this.questions.length) {
                let nextIndex;
                do {
                    nextIndex = Math.floor(Math.random() * this.questions.length);
                } while (this.usedIndices.includes(nextIndex))
                this.currentQuestionIndex = nextIndex;
                this.questionImage.setTexture(this.questions[this.currentQuestionIndex].imageKey);
            } else {
                const tepukTangan = this.sound.add('tepukTangan');
                const akhirKuisLontara = this.add.image(
                    this.cameras.main.width / 2,
                    this.cameras.main.height / 2 ,
                    'akhirKuisLontara',
                ).setOrigin(0.5);
                tepukTangan.play();

                const finalScore = this.add.text(
                    this.cameras.main.width / 2, 100,
                    this.score, { fontSize: '120px', fill: '#A566AD', align: 'center' }
                ).setOrigin(0.5, -5);

                finalScore.setText(this.score);

                akhirKuisLontara.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
                console.log('Pertanyaan selesai.');
                console.log(this.score);
                this.time.delayedCall(12000, () => {
                    this.scene.start('Home');
                });
                alert('Anda telah menyelesaikan semua soal!');
            }
        } else {
            let nextIndex;
                do {
                    nextIndex = Math.floor(Math.random() * this.questions.length);
                } while (this.usedIndices.includes(nextIndex))
                this.currentQuestionIndex = nextIndex;
                this.questionImage.setTexture(this.questions[this.currentQuestionIndex].imageKey);
            if(this.score != 0){
                this.scoreText.setText(this.score);
            }
            this.lives--;
            if (this.lives >= 0) {
                this.hearts[this.lives].setVisible(false);
            }

            if (this.lives <= 0) {
                const tepukTangan = this.sound.add('tepukTangan');
                const akhirKuisLontara = this.add.image(
                    this.cameras.main.width / 2,
                    this.cameras.main.height / 2 ,
                    'akhirKuisLontara',
                ).setOrigin(0.5);
                alert('Game selesai! Anda kehabisan hati.');
                // Tambahkan logika untuk mengakhiri game atau restart
                tepukTangan.play();

                const finalScore = this.add.text(
                    this.cameras.main.width / 2, 0,
                    this.score, { fontSize: '120px', fill: '#A566AD', align: 'center' }
                ).setOrigin(0.5, -5);

                finalScore.setText(this.score);

                akhirKuisLontara.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
                console.log('Pertanyaan selesai.');
                console.log(this.score);
                this.time.delayedCall(12000, () => {
                    this.scene.start('Home');
                    this.resetGame();
                });
                // this.scene.start('Home');
                // this.resetGame();
            } else {
                this.showWrongMessage()
            }
        }
        this.clearBoard()
    }
}

export default menulisLontara;
