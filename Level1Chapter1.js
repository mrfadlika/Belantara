import DrawingBoard from "./object/drawingBoard.js";

class Level1Chapter1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1Chapter1" });
    this.questions = [
      { imageKey: "a", answer: "a" },
      { imageKey: "ba", answer: "ba" },
      { imageKey: "ca", answer: "ca" },
      { imageKey: "da", answer: "da" },
      { imageKey: "ga", answer: "ga" },
      { imageKey: "ha", answer: "ha" },
      { imageKey: "ja", answer: "ja" },
      { imageKey: "ka", answer: "ka" },
      { imageKey: "la", answer: "la" },
      { imageKey: "ma", answer: "ma" },
      { imageKey: "na", answer: "na" },
      { imageKey: "mpa", answer: "mpa" },
      { imageKey: "nca", answer: "nca" },
      { imageKey: "nga", answer: "nga" },
      { imageKey: "ngka", answer: "ngka" },
      { imageKey: "nra", answer: "nra" },
      { imageKey: "nya", answer: "nya" },
      { imageKey: "pa", answer: "pa" },
      { imageKey: "ra", answer: "ra" },
      { imageKey: "sa", answer: "sa" },
      { imageKey: "ta", answer: "ta" },
      { imageKey: "wa", answer: "wa" },
      { imageKey: "ya", answer: "ya" },
    ];
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.lives = 3;
    this.initialLives = 3;
  }

  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  preload() {
    this.load.image("heart", "assets/heart.png");
    this.load.image("menulisbg", "assets/Frame pengenalan lontara.png");
    this.load.audio("button_click", "music/click_effect-86995.mp3"); // Suara tombol home
    this.load.audio("wrong_answer_sound", "music/negative_beeps-6008.mp3");
    this.load.audio("true_answer_sound", "music/correct-2-46134.mp3");
    this.questions.forEach((question) => {
      this.load.image(
        question.imageKey,
        `assets/latin/${question.imageKey}.png`
      );
    });
    this.load.image("button_hapus_ungu", "assets/button hapus ungu.png");
    this.load.image("button_submit_ungu", "assets/button submit ungu.png");
    this.load.image("wrongMessage", "assets/Frame salah.png");
    this.load.image("trueMessage", "assets/Frame benar.png");
    this.load.image("buttonHomeUngu", "assets/button home.png");
    this.load.audio("soundBack", "music/click_effect-86995.mp3");
    this.load.image("akhirKuisLontara", "assets/Frame skor.png");
    this.load.image("pop_up_hatiabis", "assets/Frame Pop Up.png");
    this.load.audio("tepukTangan", "music/applause-alks-ses-efekti-125030.mp3");
  }

  create() {
    const maxHearts = 3;
    const cooldownSeconds = 300; // 5 menit
    let hearts = parseInt(localStorage.getItem("hearts") || maxHearts);
    let lastHeartTime = parseInt(localStorage.getItem("lastHeartTime") || "0");
    const now = Math.floor(Date.now() / 1000);

    // Hitung pengisian hati berdasarkan waktu yang sudah berlalu
    if (hearts < maxHearts && lastHeartTime) {
        const elapsed = now - lastHeartTime;
        const heartsToAdd = Math.floor(elapsed / cooldownSeconds);
        if (heartsToAdd > 0) {
            hearts = Math.min(maxHearts, hearts + heartsToAdd);
            localStorage.setItem("hearts", hearts);
            // Update lastHeartTime jika belum penuh
            if (hearts < maxHearts) {
                lastHeartTime += heartsToAdd * cooldownSeconds;
                localStorage.setItem("lastHeartTime", lastHeartTime);
            } else {
                localStorage.removeItem("lastHeartTime");
            }
        }
    }

    // Jika hati habis, tampilkan pop up dan countdown
    if (hearts <= 0) {
        let timeLeft = cooldownSeconds - (now - lastHeartTime);
        if (timeLeft < 0) timeLeft = 0;

        const popup = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "pop_up_hatiabis"
        );

        const countdownText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            "",
            { font: "20px Arial", fill: "#000" }
        ).setOrigin(0.5);

        const updateCountdown = () => {
            const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
            const seconds = (timeLeft % 60).toString().padStart(2, "0");
            countdownText.setText(`Waktu pengisian hati: ${minutes}:${seconds}`);
        };
        updateCountdown();

        const timer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                timeLeft--;
                updateCountdown();
                if (timeLeft <= 0) {
                    timer.remove();
                    // Tambah 1 hati
                    hearts = 1;
                    localStorage.setItem("hearts", hearts);
                    localStorage.setItem("lastHeartTime", Math.floor(Date.now() / 1000));
                    this.scene.restart();
                }
            },
            callbackScope: this,
            loop: true,
        });

        const closeButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            "Tutup",
            {
                font: "24px Arial",
                fill: "#000",
                backgroundColor: "#fff",
                padding: 10,
            }
        ).setOrigin(0.5).setInteractive();

        closeButton.on("pointerdown", () => {
            this.scene.start("Chapter1");
        });

        return;
    }

    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    // Shuffle questions when game starts
    this.questions = this.shuffleArray(this.questions);
    this.currentQuestionIndex = 0;

    // Tambahkan background
    const menulisbg = this.add.image(0, 0, "menulisbg").setOrigin(0, 0);
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
    leftBox.strokeRoundedRect(
      leftBoxX,
      centerY - boxHeight / 2,
      boxWidth,
      boxHeight,
      32
    );
    leftBox.fillStyle(0xffffff, 1);
    leftBox.fillRoundedRect(
      leftBoxX,
      centerY - boxHeight / 2,
      boxWidth,
      boxHeight,
      32
    );

    // Background kotak kanan (soal)
    const rightBox = this.add.graphics();
    rightBox.lineStyle(4, 0x8e24aa, 1); // ungu
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

    // Judul atas kotak
    this.add
      .text(
        leftBoxX + boxWidth / 2,
        centerY - boxHeight / 2 + 18,
        "GAMBAR DISINI",
        {
          font: "bold 20px Arial",
          color: "#8e24aa",
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
          color: "#8e24aa",
        }
      )
      .setOrigin(0.5, 0);

    // Drawing board di tengah kotak kiri
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

    // Gambar soal di tengah kotak kanan
    this.questionImage = this.add
      .image(
        rightBoxX + boxWidth / 2,
        centerY,
        this.questions[this.currentQuestionIndex].imageKey
      )
      .setOrigin(0.5, 0.5)
      .setScale(0.9);

    const button_click = this.sound.add("button_click");

    const soundBack = this.sound.add("soundBack");

    // Tombol kembali
    const buttonBack = this.createButtonBack(
      80,
      40,
      "buttonHomeUngu",
      soundBack,
      () => {
        if (this.questionImage) {
          this.questionImage.destroy();
          this.questionImage = null;
        }
        this.scene.start("Bermain");
      }
    );

    this.resizeImage(menulisbg);
    window.addEventListener("resize", () => {
      this.game.scale.resize(window.innerWidth, window.innerHeight);
      this.resizeImage(menulisbg);
      buttonBack.setPosition(80, 80);
    });

    this.hearts = [];
    // Tambahkan tiga gambar hati ke layar
    for (let i = 0; i < this.lives; i++) {
      const heart = this.add
        .image(screenWidth - i * 60 - 50, 50, "heart")
        .setOrigin(1, 0)
        .setScale(0.1);
      this.hearts.push(heart);
    }

    // ===== Area tombol di bawah kedua box =====
    const buttonAreaY = centerY + boxHeight / 2 + 50;

    // Tombol hapus (kiri bawah)
    const button_hapus_ungu = this.createButton(
      leftBoxX + boxWidth / 2 - 300,
      buttonAreaY,
      "button_hapus_ungu",
      button_click,
      () => {
        this.clearBoard();
      }
    );

    // Tombol submit (kanan bawah, masih di bawah box kiri)
    const button_submit_ungu = this.createButton(
      leftBoxX + boxWidth / 2 - 180,
      buttonAreaY + 8,
      "button_submit_ungu",
      button_click,
      () => {
        this.drawingBoard.captureCanvasImage(this.checkAnswer.bind(this));
      }
    );

    // Menambahkan latar belakang putih dan gambar soal
    this.questionBackground = this.add.graphics();

    this.wrongMessage = this.add
      .image(screenWidth / 2, this.scale.height / 2, "wrongMessage")
      .setOrigin(0.5, 0.5)
      .setScale(0.8)
      .setVisible(false);

    this.trueMessage = this.add
      .image(screenWidth / 2, this.scale.height / 2, "trueMessage")
      .setOrigin(0.5, 0.5)
      .setScale(0.8)
      .setVisible(false);
  }

  resetGame() {
    // Reset score
    this.score = 0;
    this.scoreText.setText(this.score);

    // Reset lives
    this.lives = this.initialLives;

    // Reset hearts visibility
    this.hearts.forEach((heart) => heart.setVisible(true));

    // Reset index pertanyaan
    this.usedIndices = [];
    this.currentQuestionIndex = Math.floor(
      Math.random() * this.questions.length
    );
    this.questionImage.setTexture(
      this.questions[this.currentQuestionIndex].imageKey
    );
  }

  resizeImage(image) {
    image.setDisplaySize(window.innerWidth, window.innerHeight);
  }

  clearBoard() {
    this.drawingBoard.clear();
  }

  createButton(x, y, texture, sound, callback) {
    const button = this.add.image(x, y, texture).setInteractive();
    button.setOrigin(0.6, 0.6);
    button.setScale(0.6);

    button.on("pointerdown", () => {
      sound.play();
      button.setScale(0.5); // Kecilkan tombol saat ditekan
    });

    button.on("pointerup", () => {
      button.setScale(0.6); // Kembalikan ukuran tombol saat dilepas
      callback(); // Panggil callback saat tombol dilepas
    });

    button.on("pointerout", () => {
      button.setScale(0.6); // Kembalikan ukuran tombol saat kursor keluar dari tombol
    });

    return button;
  }

  createButtonBack(x, y, texture, sound, callback) {
    const button = this.add.image(x, y, texture).setInteractive();
    button.setOrigin(0.5, 0.5);
    button.setScale(0.5);

    button.on("pointerdown", () => {
      sound.play();
      button.setScale(0.35); // Kecilkan tombol saat ditekan
    });

    button.on("pointerup", () => {
      button.setScale(0.5); // Kembalikan ukuran tombol saat dilepas
      callback(); // Panggil callback saat tombol dilepas
    });

    button.on("pointerout", () => {
      button.setScale(0.5); // Kembalikan ukuran tombol saat kursor keluar dari tombol
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
    const currentQuestion = this.questions[this.currentQuestionIndex];
    if (predictedAnswer === currentQuestion.answer) {
      // Jawaban benar - kembali ke Chapter1
      this.showTrueMessage();
      this.time.delayedCall(1500, () => {
        this.scene.start("Chapter1");
      });
    } else {
      // Jawaban salah - kurangi nyawa dan tetap di pertanyaan yang sama
      this.showWrongMessage();
      this.lives--;

      if (this.lives > 0) {
        // Update tampilan hati
        this.hearts[this.lives].setVisible(false);
        // Tetap di pertanyaan yang sama
        this.time.delayedCall(1500, () => {
          this.clearBoard();
        });
      } else {
        // Jika nyawa habis, simpan waktu habis ke localStorage
        localStorage.setItem("hearts", "0");
        localStorage.setItem("lastHeartTime", Math.floor(Date.now() / 1000));
        this.hearts[0].setVisible(false);
        this.time.delayedCall(1500, () => {
          this.scene.start("Chapter1");
        });
      }
    }
  }
}

export default Level1Chapter1;
