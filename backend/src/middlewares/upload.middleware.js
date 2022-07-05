const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const mimetypes = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, 'public/images');
  },
  filename: (request, file, callback) => {
    const name = uuidv4();
    const extension = mimetypes[file.mimetype];
    callback(null, `${name}.${extension}`);
  }
});

const upload = multer({ storage });

module.exports = upload.single('image');
