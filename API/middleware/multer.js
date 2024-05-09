const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/imagesProducts'); // Tentukan folder penyimpanan untuk file-file yang diunggah
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file akan menjadi timestamp saat ini + ekstensi file
  }
});

// Fungsi filter untuk memeriksa tipe file
const fileFilter = (req, file, cb) => {
  // Cek apakah tipe file adalah jpg atau png
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Terima file
  } else {
    cb(new Error('Only JPEG and PNG files are allowed')); // Tolak file dengan tipe selain jpg atau png
  }
};

// Konfigurasi multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // Batas ukuran file (2MB)
  },
  fileFilter: fileFilter // Terapkan fungsi filter
});

module.exports = upload;
