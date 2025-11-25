import DrawingBoard from "./object/drawingBoard.js";

class latihanMenulisLontara extends Phaser.Scene {
  constructor() {
    super({ key: "latihanMenulisLontara" });
    this.training_questions = [
      { imageKey: "lat_a", answer: "a", sketch: "a" },
      { imageKey: "lat_ba", answer: "ba", sketch: "ba" },
      { imageKey: "lat_ca", answer: "ca", sketch: "ca" },
      { imageKey: "lat_da", answer: "da", sketch: "da" },
      // { imageKey: 'lat_ga', answer: 'ga', sketch: 'ga' },
      { imageKey: "lat_ha", answer: "ha", sketch: "ha" },
    //   { imageKey: "lat_ja", answer: "ja", sketch: "ja" },
      { imageKey: "lat_ka", answer: "ka", sketch: "ka" },
      { imageKey: "lat_la", answer: "la", sketch: "la" },
      { imageKey: "lat_ma", answer: "ma", sketch: "ma" },
      { imageKey: "lat_na", answer: "na", sketch: "na" },
      { imageKey: "lat_mpa", answer: "mpa", sketch: "mpa" },
      { imageKey: "lat_nca", answer: "nca", sketch: "nca" },
      { imageKey: "lat_nga", answer: "nga", sketch: "nga" },
      { imageKey: "lat_ngka", answer: "ngka", sketch: "ngka" },
      { imageKey: "lat_nra", answer: "nra", sketch: "nra" },
      { imageKey: "lat_nya", answer: "nya", sketch: "nya" },
      // { imageKey: 'lat_pa', answer: 'pa', sketch: 'pa' },
      { imageKey: "lat_ra", answer: "ra", sketch: "ra" },
      { imageKey: "lat_sa", answer: "sa", sketch: "sa" },
      { imageKey: "lat_ta", answer: "ta", sketch: "ta" },
      { imageKey: "lat_wa", answer: "wa", sketch: "wa" },
      { imageKey: "lat_ya", answer: "ya", sketch: "ya" },
    ];
    this.usedIndices = [];
    this.currentQuestionIndex = Math.floor(
      Math.random() * this.training_questions.length
    );
  }

  preload() {
    this.load.image("latihanmenulisbg", "assets/bg2.png");
    this.load.image("buttonBackHijau", "assets/button kembali.png");
    this.load.audio("button_click", "music/click_effect-86995.mp3");
    this.load.audio("soundHome", "music/click_effect-86995.mp3");
    this.load.audio("wrong_answer_sound", "music/negative_beeps-6008.mp3");
    this.load.audio("true_answer_sound", "music/correct-2-46134.mp3");

    // Load all question images and sketches
    this.training_questions.forEach((question) => {
      this.load.image(
        question.imageKey,
        `assets/menulis/${question.imageKey}.png`
      );
      this.load.image(`${question.sketch}_sketch`, `assets/sketsa/${question.sketch}.png`);
    });

    this.load.image("button_hapus", "assets/button hapus hijau.png");
    this.load.image("button_submit_jawaban", "assets/button submit hijau.png");
    this.load.image("wrongMessage", "assets/Frame salah.png");
    this.load.image("trueMessage", "assets/Frame benar.png");
  }

  create() {
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    // Background
    const bg = this.add.image(0, 0, "latihanmenulisbg").setOrigin(0, 0);
    bg.setDisplaySize(screenWidth, screenHeight);

    // Box dimensions and positions
    const boxWidth = 600;
    const boxHeight = 600;
    const boxSpacing = 100;
    const centerY = screenHeight / 2 - 40;
    const leftBoxX = screenWidth / 2 - boxWidth - boxSpacing / 2;
    const rightBoxX = screenWidth / 2 + boxSpacing / 2;

    // Left box (drawing area)
    const leftBox = this.add.graphics();
    leftBox.lineStyle(4, 0x4caf50, 1);
    leftBox.strokeRoundedRect(
      leftBoxX,
      centerY - boxHeight / 2,
      boxWidth,
      boxHeight,
      32
    );
    leftBox.fillStyle(0xffffff, 1);
    leftBox.fillRoundedRect(leftBoxX, centerY - boxHeight / 2, boxWidth, boxHeight, 32);

    // Right box (question)
    const rightBox = this.add.graphics();
    rightBox.lineStyle(4, 0x4caf50, 1);
    rightBox.strokeRoundedRect(
      rightBoxX,
      centerY - boxHeight / 2,
      boxWidth,
      boxHeight,
      32
    );
    rightBox.fillStyle(0xffffff, 1);
    rightBox.fillRoundedRect(
      rightBoxX,
      centerY - boxHeight / 2,
      boxWidth,
      boxHeight,
      32
    );

    // Section labels
    this.add
      .text(
        leftBoxX + boxWidth / 2,
        centerY - boxHeight / 2 + 18,
        "GAMBAR DISINI",
        {
          font: "bold 20px Arial",
          color: "#2e7d32",
        }
      )
      .setOrigin(0.5, 0);

    this.add
      .text(
        rightBoxX + boxWidth / 2,
        centerY - boxHeight / 2 + 18,
        "TULIS HURUF DIBAWAH INI",
        {
          font: "bold 20px Arial",
          color: "#2e7d32",
        }
      )
      .setOrigin(0.5, 0);

    // Drawing board
    this.drawingBoardX = leftBoxX + 30;
    this.drawingBoardY = centerY - boxHeight / 2 + 40;
    this.drawingBoard = new DrawingBoard(
      this,
      this.drawingBoardX,
      this.drawingBoardY,
      boxWidth - 60,
      boxHeight - 80
    );

    this.clearBoard();

    // Add sketch guide
    // Change this in the create() method where the sketch guide is created
    this.sketchGuide = this.add
      .image(
        this.drawingBoardX + (boxWidth - 60) / 2,
        this.drawingBoardY + (boxHeight - 80) / 2,
        `${this.training_questions[this.currentQuestionIndex].sketch}_sketch`
      )
      .setOrigin(0.5)
      .setAlpha(3) // Changed from 0.3 to 1 for 100% opacity
      .setScale(1)
      .setDepth(0);

    // Make sure drawing board is on top
    this.drawingBoard.setDepth(1);

    // Question image
    this.questionImage = this.add
      .image(
        rightBoxX + boxWidth / 2,
        centerY,
        this.training_questions[this.currentQuestionIndex].imageKey
      )
      .setOrigin(0.5, 0.5)
      .setScale(0.9);

    // Buttons area
    const buttonAreaY = centerY + boxHeight / 2 + 50;

    // Clear button
    const button_hapus = this.createButton(
      leftBoxX + boxWidth / 2 - 250,
      buttonAreaY,
      "button_hapus",
      this.sound.add("button_click"),
      () => this.clearBoard()
    );

    // Submit button
    const button_submit_jawaban = this.createButton(
      leftBoxX + boxWidth / 2 - 120,
      buttonAreaY + 8,
      "button_submit_jawaban",
      this.sound.add("button_click"),
      () => {
        this.drawingBoard.captureCanvasImage(this.checkAnswer.bind(this));
      }
    );

    // Messages
    this.wrongMessage = this.add
      .image(screenWidth / 2, screenHeight / 2, "wrongMessage")
      .setOrigin(0.5)
      .setScale(0.8)
      .setVisible(false);

    this.trueMessage = this.add
      .image(screenWidth / 2, screenHeight / 2, "trueMessage")
      .setOrigin(0.5)
      .setScale(0.8)
      .setVisible(false);

    // Back button
    const buttonMargin = 60;
    this.buttonBackHijau = this.createButton(
      buttonMargin + 60,
      buttonMargin,
      "buttonBackHijau",
      this.sound.add("soundHome"),
      () => {
        this.buttonBackHijau.setOrigin(0, 0);
        this.scene.start("Belajar");
      }
    );

    // Responsive handling
    window.addEventListener("resize", () => {
      this.game.scale.resize(window.innerWidth, window.innerHeight);
    });
  }

  clearBoard() {
    if (this.drawingBoard) {
      this.drawingBoard.clear();
    }
  }

  createButton(x, y, texture, sound, callback) {
    const button = this.add.image(x, y, texture).setInteractive();
    button.setOrigin(0.6, 0.6);
    button.setScale(0.6);

    button.on("pointerdown", () => {
      sound.play();
      button.setScale(0.5);
    });

    button.on("pointerup", () => {
      button.setScale(0.6);
      callback();
    });

    button.on("pointerout", () => {
      button.setScale(0.6);
    });

    return button;
  }

  showWrongMessage() {
    this.sound.add("wrong_answer_sound").play();
    this.wrongMessage.setVisible(true);
    this.time.delayedCall(1500, () => {
      this.wrongMessage.setVisible(false);
    });
  }

  showTrueMessage() {
    this.sound.add("true_answer_sound").play();
    this.trueMessage.setVisible(true);
    this.time.delayedCall(1500, () => {
      this.trueMessage.setVisible(false);
    });
  }

  checkAnswer(predictedAnswer) {
    const currentQuestion = this.training_questions[this.currentQuestionIndex];
    if (predictedAnswer === currentQuestion.answer) {
      this.usedIndices.push(this.currentQuestionIndex);
      this.showTrueMessage();

      if (this.usedIndices.length < this.training_questions.length) {
        let nextIndex;
        do {
          nextIndex = Math.floor(
            Math.random() * this.training_questions.length
          );
        } while (this.usedIndices.includes(nextIndex));

        this.currentQuestionIndex = nextIndex;
        const nextQuestion = this.training_questions[this.currentQuestionIndex];
        this.questionImage.setTexture(nextQuestion.imageKey);

        // Update sketch guide for the new question
        this.sketchGuide.setTexture(nextQuestion.sketch);
      } else {
        alert("Anda telah menyelesaikan semua soal!");
      }
    } else {
      this.showWrongMessage();
    }
    this.clearBoard();
  }
}

export default latihanMenulisLontara;
