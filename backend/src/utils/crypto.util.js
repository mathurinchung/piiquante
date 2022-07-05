const crypto = require('crypto');

exports.encrypt = (plaintext)=>{
  return new Promise((resolve, reject) => {
    const algorithm = 'aes-192-ctr';
    const key = crypto.scryptSync(process.env.CRYPTO_SECRET_KEY, '', 24);
    const iv = Buffer.alloc(16, 0);

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = '';

    cipher.on('readable', () => {
      let chunk;
      while (null !== (chunk = cipher.read())) {
        encrypted += chunk.toString('hex');
      }
    });

    cipher.on('end', () => {
      return resolve(encrypted)
    });

    cipher.write(plaintext);

    cipher.end();
  });
}

exports.decrypt = (enctext) => {
  return new Promise((resolve, reject)=>{
    const algorithm = 'aes-192-ctr';
    const key = crypto.scryptSync(process.env.CRYPTO_SECRET_KEY, '', 24);
    const iv = Buffer.alloc(16, 0);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = '';

    decipher.on('readable', () => {
      while (null !== (chunk = decipher.read())) {
          decrypted += chunk.toString('utf8');
      }
    });

    decipher.on('end', () => {
      return resolve(decrypted);
    });

    decipher.write(enctext, 'hex');

    decipher.end();
  });
}

// crypto.randomBytes(150).toString('hex').slice(0, 150)
