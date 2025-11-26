import DrawingBoard from "./object/drawingBoard.js";

class Level1Chapter3 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1Chapter3" });
    
    // Inisialisasi variabel nyawa
    this.lives = 3;
    this.initialLives = 3;
    this.hearts = [];

    // Daftar pertanyaan
    this.questions = [
      {
        imageKey: "JANGANG", // gambar soal di kotak kanan
        answerSequence: ["aksara62", "aksara63"],
      },
    ];

    // Reset urutan pilihan user
    this.userSequence = [];
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
    this.load.image("menulisbg", "assets/bg2.png");
    this.load.audio("button_click", "music/click_effect-86995.mp3"); // Suara tombol home
    this.load.audio("wrong_answer_sound", "music/negative_beeps-6008.mp3");
    this.load.audio("true_answer_sound", "music/correct-2-46134.mp3");

    // gambar soal (kata latin) untuk tiap question
    this.questions.forEach((question) => {
      this.load.image(
        question.imageKey,
        `assets/${question.imageKey}.png`
      );
    });

    // tombol aksara 61..70 (gambar pilihan aksara)
    for (let i = 61; i <= 70; i++) {
      this.load.image(`aksara${i}`, `assets/1/Group ${i}.png`);
    }
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

    // Sinkronkan this.lives dengan jumlah hati global
    this.lives = hearts;

    // Jika hati habis, tampilkan pop up dan countdown
    if (hearts <= 0) {
      let timeLeft = cooldownSeconds - (now - lastHeartTime);
      if (timeLeft < 0) timeLeft = 0;

      const popup = this.add.image(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "pop_up_hatiabis"
      );

      const countdownText = this.add
        .text(this.cameras.main.centerX, this.cameras.main.centerY + 50, "", {
          font: "20px Arial",
          fill: "#000",
        })
        .setOrigin(0.5);

      const updateCountdown = () => {
        const minutes = Math.floor(timeLeft / 60)
          .toString()
          .padStart(2, "0");
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
            localStorage.setItem(
              "lastHeartTime",
              Math.floor(Date.now() / 1000)
            );
            this.scene.restart();
          }
        },
        callbackScope: this,
        loop: true,
      });

      const closeButton = this.add
        .text(
          this.cameras.main.centerX,
          this.cameras.main.centerY + 100,
          "Tutup",
          {
            font: "24px Arial",
            fill: "#000",
            backgroundColor: "#fff",
            padding: 10,
          }
        )
        .setOrigin(0.5)
        .setInteractive();

      closeButton.on("pointerdown", () => {
        this.scene.start("Chapter1");
      });

      return;
    }

    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    // pilih dan acak urutan soal (kalau nanti lebih dari satu)
    this.questions = this.shuffleArray(this.questions);
    this.currentQuestionIndex = 0;
    const currentQuestion = this.questions[this.currentQuestionIndex];

    // reset urutan pilihan user
    this.userSequence = [];

    // Tambahkan background
    const menulisbg = this.add.image(0, 0, "menulisbg").setOrigin(0, 0);
    menulisbg.setDisplaySize(screenWidth, screenHeight);

    // Ukuran dan posisi kotak (sama dengan latihanMenulisLontara)
    const boxWidth = 720;
    const boxHeight = 700;
    const boxSpacing = 100;
    const centerY = screenHeight / 2;
    const rightBoxX = screenWidth / 2 - boxWidth - boxSpacing / 2;
    const leftBoxX = screenWidth / 2 + boxSpacing / 2;

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

    // Judul atas kotak (swapped positions)
    this.add
      .text(
        rightBoxX + boxWidth / 2,
        centerY - boxHeight / 2 + 18,
        "PILIH PILIHAN DIBAWAH",
        {
          font: "bold 20px Arial",
          color: "#8e24aa",
        }
      )
      .setOrigin(0.5, 0);

    this.add
      .text(
        leftBoxX + boxWidth / 2,
        centerY - boxHeight / 2 + 18,
        "MENULIS KOSAKATA MENGGUNAKAN AKSARA LONTARA",
        {
          font: "bold 20px Arial",
          color: "#8e24aa",
        }
      )
      .setOrigin(0.5, 0);

    // Question image in the left box (previously right)
    this.questionImage = this.add
      .image(
        leftBoxX + boxWidth / 2,
        centerY,
        currentQuestion.imageKey
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
    // Tambahkan gambar hati ke layar sesuai jumlah hearts global
    for (let i = 0; i < maxHearts; i++) {
      const heart = this.add
        .image(screenWidth - i * 60 - 50, 30, "heart")
        .setOrigin(1, 0)
        .setScale(0.1);
      // tampilkan hanya jika masih punya hati di index tsb
      heart.setVisible(i < this.lives);
      this.hearts.push(heart);
    }

    // ===== Area input aksara (tombol pilihan + teks urutan) =====

    // Container untuk menampilkan aksara yang dipilih (di tengah kotak kanan)
    const rightBoxCenterX = rightBoxX + boxWidth / 2;
    this.selectedAksaraContainer = this.add.container(
      rightBoxCenterX,
      centerY - boxHeight / 2 + 150
    );
    this.inputAksara = [];

    // grid tombol aksara 2 baris x 5 kolom (10 tombol: aksara61..aksara70)
    const aksaraBtnSize = 60;
    const aksaraBtnMargin = 18;
    const totalGridWidth = 5 * aksaraBtnSize + 4 * aksaraBtnMargin;
    const startBtnX = rightBoxCenterX - totalGridWidth / 2;
    const startBtnY = centerY - boxHeight / 2 + 500;

    let aksaraIdx = 61;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 5; col++) {
        const id = `aksara${aksaraIdx}`;
        const btnX = startBtnX + col * (aksaraBtnSize + aksaraBtnMargin);
        const btnY = startBtnY + row * (aksaraBtnSize + aksaraBtnMargin);

        const btn = this.add
          .image(btnX, btnY, id)
          .setInteractive()
          .setScale(0.9);

        btn.on("pointerup", () => {
          // simpan ID pilihan user secara berurutan, misal 'aksara61'
          this.userSequence.push(id);
          this.inputAksara.push(id);
          
          // Hapus aksara yang sudah ada
          this.selectedAksaraContainer.removeAll(true);
          
          // Tampilkan semua aksara yang dipilih
          this.inputAksara.forEach((aksaraId, index) => {
            const aksaraImg = this.add.image(
              index * 80,  // Spasi antar aksara
              0,
              aksaraId
            ).setScale(0.6);
            this.selectedAksaraContainer.add(aksaraImg);
          });
        });

        aksaraIdx++;
        if (aksaraIdx > 70) break;
      }
    }

    // ===== Tombol hapus & submit di bawah kotak kanan =====
    const buttonAreaY = centerY + boxHeight / 2 + 50;

    // Tombol hapus
    const button_hapus_ungu = this.createButton(
      rightBoxX + 120,
      buttonAreaY,
      "button_hapus_ungu",
      button_click,
      () => {
        // hapus gambar di drawing board dan reset urutan pilihan
        this.clearBoard();
        this.userSequence = [];
        this.inputAksara = [];
        this.selectedAksaraContainer.removeAll(true);
      }
    );

    // Tombol submit
    const button_submit_ungu = this.createButton(
      rightBoxX + 250,
      buttonAreaY,
      "button_submit_ungu",
      button_click,
      () => {
        // jika nanti tetap mau pakai pengenalan gambar, bisa panggil captureCanvasImage
        // untuk sekarang kita fokus ke urutan tombol aksara
        this.checkSequenceAnswer();
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

  // Cek jawaban berdasarkan urutan tombol aksara yang dipilih user
  checkSequenceAnswer() {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const isCorrect = JSON.stringify(this.userSequence) === JSON.stringify(currentQuestion.answerSequence);

    if (isCorrect) {
      // Tandai level 1 chapter 2 selesai
      localStorage.setItem('chapter3_level1_completed', 'true');
      this.trueAnswerSound.play();
      this.showTrueMessage();
      this.time.delayedCall(1500, () => {
        this.scene.start("Chapter3");
      });
    } else {
      // Jawaban salah - kurangi nyawa dan tetap di pertanyaan yang sama
      this.showWrongMessage();
      
      // Kurangi nyawa
      this.lives--;

      // Simpan ke localStorage supaya global
      localStorage.setItem("hearts", String(this.lives));
      if (this.lives === 0) {
        localStorage.setItem("lastHeartTime", Math.floor(Date.now() / 1000));
      }
      
      // Update tampilan hati
      if (this.lives >= 0) {
        this.hearts[this.lives].setVisible(false);
      }

      if (this.lives > 0) {
        // Reset pilihan tapi tetap di soal yang sama
        this.userSequence = [];
        this.inputAksara = [];
        this.inputText.setText("");
        this.time.delayedCall(1500, () => {
          this.clearBoard();
        });
      } else {
        // Jika nyawa habis, nilai hearts sudah disimpan sebagai 0 di atas
        // Tunggu sebentar sebelum kembali ke Chapter3
        this.time.delayedCall(1500, () => {
          this.scene.start("Chapter3");
        });
      }
    }
  }
}
export default Level1Chapter3;
