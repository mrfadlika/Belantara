import DrawingBoard from "./object/drawingBoard.js";

class latihanMenulisLontara extends Phaser.Scene {
    constructor() {
        super({ key: 'latihanMenulisLontara' });
        this.training_questions = [
            { imageKey: 'lat_a', answer: 'a' },
            { imageKey: 'lat_ba', answer: 'ba' },
            { imageKey: 'lat_ca', answer: 'ca' },
            { imageKey: 'lat_da', answer: 'da' },
            { imageKey: 'lat_ga', answer: 'ga' },
            { imageKey: 'lat_ha', answer: 'ha' },
            { imageKey: 'lat_ja', answer: 'ja' },
            { imageKey: 'lat_ka', answer: 'ka' },
            { imageKey: 'lat_la', answer: 'la' },
            { imageKey: 'lat_ma', answer: 'ma' },
            { imageKey: 'lat_na', answer: 'na' },
            { imageKey: 'lat_mpa', answer: 'mpa' },
            { imageKey: 'lat_nca', answer: 'nca' },
            { imageKey: 'lat_nga', answer: 'nga' },
            { imageKey: 'lat_ngka', answer: 'ngka' },
            { imageKey: 'lat_nra', answer: 'nra' },
            { imageKey: 'lat_nya', answer: 'nya' },
            { imageKey: 'lat_pa', answer: 'pa' },
            { imageKey: 'lat_ra', answer: 'ra' },
            { imageKey: 'lat_sa', answer: 'sa' },
            { imageKey: 'lat_ta', answer: 'ta' },
            { imageKey: 'lat_wa', answer: 'wa' },
            { imageKey: 'lat_ya', answer: 'ya' },
        ];
        this.usedIndices = [];
        this.currentQuestionIndex = Math.floor(Math.random() * this.training_questions.length);
    }

    preload() {
        this.load.image('latihanmenulisbg', 'assets/bg2.png');
        this.load.image('buttonHome', 'assets/button kembali.png');
        this.load.audio('button_click', 'music/click_effect-86995.mp3'); // Suara tombol home
        this.load.audio('soundHome', 'music/click_effect-86995.mp3');
        this.load.audio('wrong_answer_sound', 'music/negative_beeps-6008.mp3');
        this.load.audio('true_answer_sound', 'music/correct-2-46134.mp3');
        this.training_questions.forEach(question => {
            this.load.image(question.imageKey, `assets/menulis/${question.imageKey}.png`);
        });
        this.load.image('button_hapus', 'assets/button hapus hijau.png');
        this.load.image('button_submit_jawaban', 'assets/button submit hijau.png');
        this.load.image('wrongMessage', 'assets/Frame salah.png');
        this.load.image('trueMessage', 'assets/Frame benar.png');
        console.log(this.training_questions);
    }

    create() {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        // Tambahkan background
        const bg = this.add.image(0, 0, 'latihanmenulisbg').setOrigin(0, 0);
        bg.setDisplaySize(screenWidth, screenHeight);

        // Ukuran dan posisi kotak (LEBIH BESAR)
        const boxWidth = 600;
        const boxHeight = 600;
        const boxSpacing = 100;
        const centerY = screenHeight / 2 - 40; // sedikit naik agar bawah cukup untuk tombol
        const leftBoxX = screenWidth / 2 - boxWidth - boxSpacing / 2;
        const rightBoxX = screenWidth / 2 + boxSpacing / 2;

        // Background kotak kiri (drawing)
        const leftBox = this.add.graphics();
        leftBox.lineStyle(4, 0x4CAF50, 1);
        leftBox.strokeRoundedRect(leftBoxX, centerY - boxHeight / 2, boxWidth, boxHeight, 32);
        leftBox.fillStyle(0xffffff, 1);
        leftBox.fillRoundedRect(leftBoxX, centerY - boxHeight / 2, boxWidth, boxHeight, 32);

        // Background kotak kanan (soal)
        const rightBox = this.add.graphics();
        rightBox.lineStyle(4, 0x4CAF50, 1);
        rightBox.strokeRoundedRect(rightBoxX, centerY - boxHeight / 2, boxWidth, boxHeight, 32);
        rightBox.fillStyle(0xffffff, 1);
        rightBox.fillRoundedRect(rightBoxX, centerY - boxHeight / 2, boxWidth, boxHeight, 32);

        // Judul atas kotak
        this.add.text(leftBoxX + boxWidth / 2, centerY - boxHeight / 2 + 18, 'GAMBAR DISINI', {
            font: 'bold 20px Arial',
            color: '#2e7d32'
        }).setOrigin(0.5, 0);

        this.add.text(rightBoxX + boxWidth / 2, centerY - boxHeight / 2 + 18, 'TULIS HURUF DIBAWAH INI', {
            font: 'bold 20px Arial',
            color: '#2e7d32'
        }).setOrigin(0.5, 0);

        // Drawing board di tengah kotak kiri
        this.drawingBoardX = leftBoxX + 30;
        this.drawingBoardY = centerY - boxHeight / 2 + 40;
        this.drawingBoard = new DrawingBoard(this, this.drawingBoardX, this.drawingBoardY, boxWidth - 60, boxHeight - 80);

        // Gambar soal di tengah kotak kanan
        this.questionImage = this.add.image(rightBoxX + boxWidth / 2, centerY, this.training_questions[this.currentQuestionIndex].imageKey)
            .setOrigin(0.5, 0.5)
            .setScale(0.9);

        // ===== Area tombol di bawah kedua box =====
        const buttonAreaY = centerY + boxHeight / 2 + 50;

        // Tombol hapus (kiri bawah)
        const button_hapus = this.createButton(
            leftBoxX + boxWidth / 2 - 250, buttonAreaY,
            'button_hapus', this.sound.add('button_click'), () => this.clearBoard()
        );

        // Tombol submit (kanan bawah, masih di bawah box kiri)
        const button_submit_jawaban = this.createButton(
            leftBoxX + boxWidth / 2 - 120, buttonAreaY + 8,
            'button_submit_jawaban', this.sound.add('button_click'), () => {
                this.drawingBoard.captureCanvasImage(this.checkAnswer.bind(this));
            }
        );

        // Pesan benar/salah di tengah layar
        this.wrongMessage = this.add.image(screenWidth / 2, screenHeight / 2, 'wrongMessage').setOrigin(0.5).setScale(0.8).setVisible(false);
        this.trueMessage = this.add.image(screenWidth / 2, screenHeight / 2, 'trueMessage').setOrigin(0.5).setScale(0.8).setVisible(false);

        // Tombol home di pojok kiri atas
        const buttonMargin = 60;
        this.buttonHome = this.createButton(buttonMargin, buttonMargin, 'buttonHome', this.sound.add('soundHome'), () => {
            this.buttonHome.setOrigin(0, 0);
            this.scene.start('Belajar');
        });

        // Responsif
        window.addEventListener('resize', () => {
            this.game.scale.resize(window.innerWidth, window.innerHeight);
            // Tambahkan logika resize jika perlu
        });
    }

    resizeImage(image) {
        image.setDisplaySize(window.innerWidth, window.innerHeight);
    }

    clearBoard(){
        this.drawingBoard.clear();
        this.drawingBoard.fillStyle(0xffffff, 1);
        this.drawingBoard.fillRect(0, 0, this.drawingBoard.width, this.drawingBoard.height);
        this.drawingBoard.strokeRect(0, 0, this.drawingBoard.width, this.drawingBoard.height);
        this.drawingBoard.lineStyle(10, 0x000000); // Pastikan ketebalan garis tetap 10
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
        const currentQuestion = this.training_questions[this.currentQuestionIndex];
        if (predictedAnswer === currentQuestion.answer) {
            this.usedIndices.push(this.currentQuestionIndex); // buat property baru untuk menampung index
            this.showTrueMessage()
            if (this.usedIndices.length < this.training_questions.length) {
                let nextIndex;
                do {
                    nextIndex = Math.floor(Math.random() * this.training_questions.length);
                } while (this.usedIndices.includes(nextIndex))
                this.currentQuestionIndex = nextIndex;
                this.questionImage.setTexture(this.training_questions[this.currentQuestionIndex].imageKey);
            } else {
                alert('Anda telah menyelesaikan semua soal!');
            }
        } else {
            this.showWrongMessage()
        }
        this.clearBoard()
    }
}

export default latihanMenulisLontara;
