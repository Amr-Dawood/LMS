const crypto = require('crypto');


// Set the encryption algorithm
const algorithm = 'aes-256-cbc';

// Use a fixed passphrase to derive a key (for demonstration, but you should use something more secure in real applications)
const passphrase = 'your-secret-passphrase';

// Derive a key and IV from the passphrase
const key = crypto.createHash('sha256').update(passphrase).digest();  // Create a 256-bit key
const iv = Buffer.from('0000000000000000');  // Use a fixed IV (16 bytes for AES-256-CBC)

// console.log('Key:', key.toString('hex'));
// console.log('IV:', iv.toString('hex'));

// Function to encrypt text
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex'); // 'utf8' is input encoding, 'hex' is output encoding
    encrypted += cipher.final('hex');
    return encrypted;
}
module.exports = encrypt