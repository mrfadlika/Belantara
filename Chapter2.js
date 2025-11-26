class Chapter2 extends Phaser.Scene {
  constructor() {
    super({ key: "Chapter2" });
  }

  preload() {
    this.load.image("chapter2bg", "assets/bg.png");
    this.load.image("buttonHomeUngun", "assets/button home.png");
    this.load.image("topJudulChapter2", "assets/button chapter 2.png");
    this.load.image("chapter2Level1", "assets/button level 1.png");
    this.load.image("chapter2Level2", "assets/button level 2.png");
    this.load.image("chapter2Level3", "assets/button level 3.png");
    this.load.image("chapter2Level4", "assets/button level 4.png");
    this.load.image("chapter2Level5", "assets/button level 5.png");
    this.load.image("chapter2Level6", "assets/button level 6.png");
    this.load.image("pop_up_hatiabis", "assets/Frame Pop Up.png");
    this.load.image("ke_belajar", "assets/button belajar.png");
    this.load.audio("soundHome", "music/click_effect-86995.mp3"); // Suara tombol home
    this.load.audio("buttonSound", "music/item-pick-up-38258.mp3"); // Suara tombol
  }

  create() {
    // gambar latar belakang
    const chapter2bg = this.add.image(0, 0, "chapter2bg").setOrigin(0, 0);
    this.resizeImage(chapter2bg);

    // suara tombol home
    const soundHome = this.sound.add("soundHome");

    // suara tombol
    const buttonSound = this.sound.add("buttonSound");

    // Jarak horizontal & vertikal antar tombol
    const buttonHorizontalSpacing = 260;
    const buttonVerticalSpacing = 150;

    // Titik tengah layar
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // topJudul di tengah atas, tidak interaktif
    const topJudulY = centerY + 300;
    this.topJudul = this.add
      .image(centerX, centerY, "topJudulChapter2")
      .setOrigin(0.5, 0.8)
      .setScale(0.8);

    // Posisi tombol (grid 3x2)
    const gridCols = 3;
    const gridRows = 2;
    const gridSpacingX = 500;
    const gridSpacingY = 250;
    const startX = centerX - gridSpacingX;
    const startY = centerY - gridSpacingY / 2;
    this.levelButtons = [];
    
    // Dapatkan status penyelesaian level
    const level1Completed = localStorage.getItem('chapter2_level1_completed') === 'true';
    const level2Completed = localStorage.getItem('chapter2_level2_completed') === 'true';
    
    for (let i = 0; i < 6; i++) {
      const row = Math.floor(i / gridCols);
      const col = i % gridCols;
      const x = startX + col * gridSpacingX;
      const y = startY + row * gridSpacingY;
      const btnKey = `chapter2Level${i + 1}`;
      
      // Tentukan apakah level terkunci atau tidak
      let isLocked = true;
      if (i === 0) {
        // Level 1 selalu terbuka
        isLocked = false;
      } else if (i === 1) {
        // Level 2 terbuka jika level 1 selesai
        isLocked = !level1Completed;
      } else if (i === 2) {
        // Level 3 terbuka jika level 2 selesai
        isLocked = !level2Completed;
      } else {
        // Level 4,5,6 selalu terkunci
        isLocked = true;
      }
      
      const btn = this.createButton(x, y, btnKey, buttonSound, () => {
        if (isLocked) return;
        
        // Cek jumlah hati sebelum masuk level
        let hearts = parseInt(localStorage.getItem("hearts") || "3");
        if (hearts > 0) {
          // Tentukan scene tujuan berdasarkan level
          let targetScene = "Level1Chapter2";
          if (i === 1) {
            targetScene = "Level2Chapter2";
          } else if (i === 2) {
            targetScene = "Level3Chapter2";
          }
          this.scene.start(targetScene);
        } else {
          // Tampilkan pop up hati habis di Chapter2
          const popup = this.add
            .image(
              window.innerWidth / 2,
              window.innerHeight / 2,
              "pop_up_hatiabis"
            )
            .setOrigin(0.5);

          // Countdown
          let lastHeartTime = parseInt(
            localStorage.getItem("lastHeartTime") || "0"
          );
          const cooldownSeconds = 300;
          const now = Math.floor(Date.now() / 1000);
          let timeLeft = cooldownSeconds - (now - lastHeartTime);
          if (timeLeft < 0) timeLeft = 0;

          const countdownText = this.add
            .text(window.innerWidth / 2, window.innerHeight / 2 + 18, "", {
              font: "24px Arial",
              fill: "#000",
            })
            .setOrigin(0.5);

          const updateCountdown = () => {
            const minutes = Math.floor(timeLeft / 60)
              .toString()
              .padStart(2, "0");
            const seconds = (timeLeft % 60).toString().padStart(2, "0");
            countdownText.setText(`${minutes}:${seconds}`);
          };
          updateCountdown();

          const timer = this.time.addEvent({
            delay: 1000,
            callback: () => {
              timeLeft--;
              updateCountdown();
              if (timeLeft <= 0) {
                timer.remove();
                localStorage.setItem("hearts", "1");
                localStorage.setItem(
                  "lastHeartTime",
                  Math.floor(Date.now() / 1000)
                );
                popup.destroy();
                countdownText.destroy();
              }
            },
            callbackScope: this,
            loop: true,
          });

          // Tombol ke_belajar sebagai tombol tutup pop up
          const closeButton = this.add
            .image(
              window.innerWidth / 2,
              window.innerHeight / 2 + 175,
              "ke_belajar"
            )
            .setOrigin(0.5)
            .setInteractive()
            .setScale(0.5);

          closeButton.on("pointerup", () => {
            popup.destroy();
            countdownText.destroy();
            closeButton.destroy();
            timer.remove();
            this.scene.start("Belajar");
          });
        }
      });
      
      // Jika level terkunci, buat tampilan tombol menjadi abu-abu
      if (isLocked) {
        btn.setTint(0x888888); // Warna abu-abu untuk level terkunci
      }
      
      this.levelButtons.push(btn);
    }

    // tombol home
    const buttonMargin = 60;
    this.buttonHomeUngu = this.createButton(
      buttonMargin,
      buttonMargin,
      "buttonHomeUngu",
      soundHome,
      () => {
        this.buttonHomeUngu.setOrigin(0, 0);
        this.scene.start("Home");
      }
    );

    // Inisialisasi coin dari localStorage, jika belum ada set ke 0
    let coin = parseInt(localStorage.getItem("coin")) || 0;
    if (localStorage.getItem("coin") === null) {
      localStorage.setItem("coin", 0);
    }
    // Tampilkan coin di pojok kanan atas
    this.coinText = this.add
      .text(window.innerWidth - 80, 40, `Coin: ${coin}`, {
        font: "32px Arial",
        fill: "#FFD700",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(1, 0);

    if (!localStorage.getItem("hearts")) {
      localStorage.setItem("hearts", "3");
      localStorage.setItem("lastHeartUpdate", Date.now().toString());
    }

    function updateHearts() {
      const lastUpdate = parseInt(
        localStorage.getItem("lastHeartUpdate") || "0"
      );
      const currentTime = Date.now();
      const timeDiff = Math.floor((currentTime - lastUpdate) / 1000); // in seconds
      const heartRegenTime = 300; // 5 minutes in seconds

      let hearts = parseInt(localStorage.getItem("hearts") || "5");
      const heartsToAdd = Math.floor(timeDiff / heartRegenTime);

      if (heartsToAdd > 0) {
        hearts = Math.min(5, hearts + heartsToAdd);
        localStorage.setItem("hearts", hearts.toString());
        localStorage.setItem(
          "lastHeartUpdate",
          (lastUpdate + heartsToAdd * heartRegenTime * 1000).toString()
        );
      }
    }

    updateHearts();
    setInterval(updateHearts, 60000);

    this.updateButtonPositions = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 1.8;
      const gridSpacingX = 500;
      const gridSpacingY = 250;
      const startX = centerX - gridSpacingX;
      const startY = centerY - gridSpacingY / 2;
      this.topJudul.setPosition(centerX, centerY - 250);
      for (let i = 0; i < 6; i++) {
        const row = Math.floor(i / gridCols);
        const col = i % gridCols;
        const x = startX + col * gridSpacingX;
        const y = startY + row * gridSpacingY;
        this.levelButtons[i].setPosition(x, y);
      }
      this.buttonHomeUngu.setPosition(buttonMargin, buttonMargin);
      this.coinText.setPosition(window.innerWidth - 80, 40);
      this.resizeImage(chapter2bg);
    };
    this.updateButtonPositions();

    window.addEventListener("resize", () => {
      this.game.scale.resize(window.innerWidth, window.innerHeight);
      this.updateButtonPositions();
    });
  }

  resizeImage(image) {
    image.setDisplaySize(window.innerWidth, window.innerHeight);
  }

  createButton(x, y, texture, sound, callback) {
    const button = this.add.image(x, y, texture).setInteractive();
    button.setOrigin(0.5, 0.5);
    button.setScale(0.6);

    button.on("pointerdown", () => {
      sound.play();
      button.setScale(0.46);
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

  resizeButton(button, offsetY = 0) {
    // Set posisi tombol kembali di tengah layar dengan offset Y yang diberikan
    button.setPosition(window.innerWidth / 2, window.innerHeight / 2 + offsetY);
  }

  isMobile() {
    return window.innerWidth <= 800;
  }

  // Fungsi untuk menambah coin dan update localStorage serta UI
  addCoin(amount) {
    let coin = parseInt(localStorage.getItem("coin")) || 0;
    coin += amount;
    localStorage.setItem("coin", coin);
    // Jika ada coinText di scene, update tampilannya
    if (this.coinText) {
      this.coinText.setText(`Coin: ${coin}`);
    }
  }
}

export default Chapter2;
