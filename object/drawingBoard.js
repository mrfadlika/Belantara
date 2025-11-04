// class DrawingBoard extends Phaser.GameObjects.Graphics {
//   constructor(scene, x, y, width, height, options) {
//     super(scene, options);
//     this.scene = scene;
//     this.setPosition(x, y);
//     this.width = width;
//     this.height = height;
//     this.isDrawing = false;
//     this.isDrawingEnabled = false;
//     this.lineStyle(2, 0x000000); // Mengatur ketebalan dan warna garis
//     // Menggambar latar belakang putih
//     this.fillStyle(0xffffff, 1); // Warna putih dengan opasitas penuh
//     this.fillRect(0, 0, this.width, this.height);
//     // Menggambar area papan tulis sebagai batas
//     this.strokeRect(0, 0, this.width, this.height);

//     // Menambahkan objek ini ke dalam scene
//     this.scene.add.existing(this);

//     // Mengatur event listener untuk input mouse
//     this.scene.input.on('pointerdown', this.startDrawing, this);
//     this.scene.input.on('pointermove', this.draw, this);
//     this.scene.input.on('pointerup', this.stopDrawing, this);
// }

// startDrawing(pointer) {
//     if (this.isPointerInBounds(pointer) && this.isDrawingEnabled) {
//         this.isDrawing = true;
//         this.moveTo(pointer.x - this.x, pointer.y - this.y);
//     }
// }

// draw(pointer) {
//     if (this.isDrawing) {
//         if (this.isPointerInBounds(pointer)) {
//             this.lineTo(pointer.x - this.x, pointer.y - this.y);
//             this.strokePath();
//             this.moveTo(pointer.x - this.x, pointer.y - this.y); // Update posisi untuk menggambar garis kontinu
//         } else {
//             this.stopDrawing();
//         }
//     }
// }

// stopDrawing() {
//     this.isDrawing = false;
// }

// isPointerInBounds(pointer) {
//     return (
//         pointer.x >= this.x &&
//         pointer.x <= this.x + this.width &&
//         pointer.y >= this.y &&
//         pointer.y <= this.y + this.height
//     );
// }

// captureCanvasImage() {
//   const canvas = Phaser.Display.Canvas.CanvasPool.create(this, this.width, this.height);
//   const context = canvas.getContext('2d');

//   // Menggambar konten dari Graphics ke kanvas
//   this.scene.game.renderer.snapshotArea(this.x, this.y, this.width, this.height, image => {
//       context.drawImage(image, 0, 0);
//       const canvasImage = canvas.toDataURL('image/png');
//       console.log(canvasImage);

//       // Cleanup
//       Phaser.Display.Canvas.CanvasPool.remove(canvas);
//   });
// }
// }

// export default DrawingBoard;
  
//----------------------dibawah ini bagus --------------------------------------

// class DrawingBoard extends Phaser.GameObjects.Graphics {
//     constructor(scene, x, y, width, height, options) {
//         super(scene, options);
//         this.scene = scene;
//         this.setPosition(x, y);
//         this.width = width;
//         this.height = height;
//         this.isDrawing = false;
//         this.isDrawingEnabled = false;
//         this.lineColor = 0x000000; // Warna garis (hitam)
//         this.lineWidth = 20; // Ketebalan garis
//         this.lineAlpha = 1; // Opasitas garis
//         this.lineCap = 'round'; // Ujung garis yang bulat untuk garis yang lebih halus

//         // Gambar latar belakang putih
//         this.fillStyle(0xffffff, 1);
//         this.fillRect(0, 0, this.width, this.height);
//         // Gambar batas area papan tulis
//         this.strokeRect(0, 0, this.width, this.height);

//         this.scene.add.existing(this);

//         // Atur event listener untuk input pointer
//         this.scene.input.on('pointerdown', this.startDrawing, this);
//         this.scene.input.on('pointermove', this.draw, this);
//         this.scene.input.on('pointerup', this.stopDrawing, this);
//     }

//     startDrawing(pointer) {
//         if (this.isPointerInBounds(pointer) && this.isDrawingEnabled) {
//             this.isDrawing = true;
//             this.lineStyle(this.lineWidth, this.lineColor, this.lineAlpha, 0, false, this.lineCap);
//             this.moveTo(pointer.x - this.x, pointer.y - this.y);
//         }
//     }

//     draw(pointer) {
//         if (this.isDrawing) {
//             if (this.isPointerInBounds(pointer)) {
//                 this.lineTo(pointer.x - this.x, pointer.y - this.y);
//                 this.strokePath();
//             } else {
//                 this.stopDrawing();
//             }
//         }
//     }

//     stopDrawing() {
//         this.isDrawing = false;
//     }

//     isPointerInBounds(pointer) {
//         return (
//             pointer.x >= this.x &&
//             pointer.x <= this.x + this.width &&
//             pointer.y >= this.y &&
//             pointer.y <= this.y + this.height
//         );
//     }

//     captureCanvasImage() {
//         const canvas = Phaser.Display.Canvas.CanvasPool.create(this, this.width, this.height);
//         const context = canvas.getContext('2d');

//         // Ambil snapshot area dari renderer game
//         this.scene.game.renderer.snapshotArea(this.x, this.y, this.width, this.height, image => {
//             context.drawImage(image, 0, 0);
//             const canvasImage = canvas.toDataURL('image/png');

//             // Kirim gambar ke server Flask untuk diproses
//             fetch('http://localhost:5000/process-image', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ image: canvasImage }),
//             })
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Success:', data);
//                 alert(`Hasil prediksi: ${data.result}`);
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//             });

//             // Hapus canvas dari pool setelah selesai
//             Phaser.Display.Canvas.CanvasPool.remove(canvas);
//         });
//     }
// }

// export default DrawingBoard;
// ----------------------------diatas bagus---------------

class DrawingBoard extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y, width, height, options) {
        super(scene, options);
        this.scene = scene;
        this.setPosition(x, y);
        this.width = width;
        this.height = height;
        this.isDrawing = false;
        this.lineColor = 0x000000; // Warna garis (hitam)
        this.lineWidth = 8; // Ketebalan garis
        this.lineAlpha = 1; // Opasitas garis
        this.lineCap = 'round'; // Ujung garis yang bulat untuk garis yang lebih halus

        // Gambar latar belakang putih
        this.fillStyle(0xffffff, 1);
        this.fillRect(0, 0, this.width, this.height);
        // Gambar batas area papan tulis
        this.strokeRect(0, 0, this.width, this.height);

        this.scene.add.existing(this);

        // Atur event listener untuk input pointer
        this.scene.input.on('pointerdown', this.startDrawing, this);
        this.scene.input.on('pointermove', this.draw, this);
        this.scene.input.on('pointerup', this.stopDrawing, this);
    }

    startDrawing(pointer) {
        if (this.isPointerInBounds(pointer)) {
            this.isDrawing = true;
            this.lineStyle(this.lineWidth, this.lineColor, this.lineAlpha, 0, false, this.lineCap);
            this.moveTo(pointer.x - this.x, pointer.y - this.y);
            // Gambar titik saat mulai menggambar
            this.drawDot(pointer.x - this.x, pointer.y - this.y);
        }
    }

    draw(pointer) {
        if (this.isDrawing) {
            if (this.isPointerInBounds(pointer)) {
                this.lineTo(pointer.x - this.x, pointer.y - this.y);
                this.strokePath();
                this.moveTo(pointer.x - this.x, pointer.y - this.y);
                // Gambar titik pada setiap titik mouse bergerak
                this.drawDot(pointer.x - this.x, pointer.y - this.y);
            } else {
                this.stopDrawing();
            }
        }
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    isPointerInBounds(pointer) {
        return (
            pointer.x >= this.x &&
            pointer.x <= this.x + this.width &&
            pointer.y >= this.y &&
            pointer.y <= this.y + this.height
        );
    }

    drawDot(x, y) {
        this.fillStyle(this.lineColor, this.lineAlpha);
        this.fillCircle(x, y, this.lineWidth / 2); // Ukuran titik sesuai dengan ketebalan garis
    }

    captureCanvasImage(callback) {
        const canvas = Phaser.Display.Canvas.CanvasPool.create(this, this.width, this.height);
        const context = canvas.getContext('2d');

        // Ambil snapshot area dari renderer game
        this.scene.game.renderer.snapshotArea(this.x, this.y, this.width, this.height, image => {
            context.drawImage(image, 0, 0);
            const canvasImage = canvas.toDataURL('image/png');

            // Kirim gambar ke server Flask untuk diproses
            fetch('http://127.0.0.1:5000/process-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: canvasImage }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                callback(data.result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

            // Hapus canvas dari pool setelah selesai
            Phaser.Display.Canvas.CanvasPool.remove(canvas);
        });
    }
}

export default DrawingBoard;

