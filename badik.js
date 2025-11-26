class badikscene extends Phaser.Scene {
  constructor() {
    super({ key: "badikscene" });
  }

  preload() {
    // Load assets jika diperlukan
  }

  create() {
    this.createBackground();
    this.createSketchfabContainer();
    this.createNavigationButtons();

    // Pastikan container Sketchfab dibersihkan saat scene ini ditutup/dihancurkan
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
    this.events.on(Phaser.Scenes.Events.DESTROY, this.destroy, this);
  }

  createBackground() {
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0xf5f5f5
    );
  }

  createSketchfabContainer() {
    // Hapus container lama jika sudah ada (hindari duplikat saat kembali ke scene ini)
    const old = document.getElementById("sketchfab-container");
    if (old) {
      old.remove();
    }

    // Buat container DOM untuk embed Sketchfab
    const container = document.createElement("div");
    container.id = "sketchfab-container";
    container.style.cssText = `
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 800px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      z-index: 9999;
    `;

    document.body.appendChild(container);

    // Embed Sketchfab (struktur sama seperti BandoScene)
    const embedHTML = `
      <div class="sketchfab-embed-wrapper">
        <iframe
          title="Badik"
          frameborder="0"
          allowfullscreen
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          xr-spatial-tracking
          execution-while-out-of-viewport
          execution-while-not-rendered
          web-share
          src="https://sketchfab.com/models/529373f416af41b2a6150c34f363aa9b/embed"
          style="width: 100%; height: 500px; border: 0; position: relative; z-index: 9999;"
        >
        </iframe>
        <p style="font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;">
          <a href="https://sketchfab.com/3d-models/badik-529373f416af41b2a6150c34f363aa9b?utm_medium=embed&utm_campaign=share-popup&utm_content=529373f416af41b2a6150c34f363aa9b"
             target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;">
            Badik
          </a> by
          <a href="https://sketchfab.com/ariefdirgakusuma?utm_medium=embed&utm_campaign=share-popup&utm_content=529373f416af41b2a6150c34f363aa9b"
             target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;">
            ariefdirgakusuma
          </a> on
          <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=529373f416af41b2a6150c34f363aa9b"
             target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;">
            Sketchfab
          </a>
        </p>
      </div>
    `;

    container.innerHTML = embedHTML;

    // Add title text dengan Phaser
    this.add
      .text(this.scale.width / 2, 40, "Senjata Tradisional Bugis - Badik", {
        fontSize: "32px",
        fontFamily: "Arial",
        color: "#333333",
        align: "center",
      })
      .setOrigin(0.5);

    // Add description text
    this.add
      .text(
        this.scale.width / 2,
        90,
        "Badik adalah senjata tradisional masyarakat Bugis.",
        {
          fontSize: "16px",
          fontFamily: "Arial",
          color: "#666666",
          align: "center",
        }
      )
      .setOrigin(0.5);
  }

  createNavigationButtons() {
    const buttonY = this.scale.height - 80;

    // Tombol Kembali
    this.createButton(100, buttonY, "Kembali", () => {
      this.scene.start("Home");
    });

    // Tombol Belajar
    this.createButton(this.scale.width - 100, buttonY, "Belajar", () => {
      this.scene.start("Belajar");
    });
  }

  createButton(x, y, label, callback) {
    const button = this.add
      .rectangle(x, y, 120, 50, 0x4caf50)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => button.setFillStyle(0x45a049))
      .on("pointerout", () => button.setFillStyle(0x4caf50))
      .on("pointerdown", callback);

    this.add
      .text(x, y, label, {
        fontSize: "14px",
        fontFamily: "Arial",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);
  }

  shutdown() {
    // Hapus container Sketchfab saat scene ditutup
    const container = document.getElementById("sketchfab-container");
    if (container) {
      container.remove();
    }
  }

  destroy() {
    // Jaga-jaga jika scene benar-benar dihancurkan, pastikan container ikut hilang
    const container = document.getElementById("sketchfab-container");
    if (container) {
      container.remove();
    }
  }
}

export default badikscene;

// Export untuk digunakan di main.js
// game.scene.add('badikscene', badikscene);
