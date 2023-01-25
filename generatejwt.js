// generatejwt.js
const crypto = require('crypto');

const generateJWT = (payload) => {
    return new Promise((resolve, reject) => {
        // Fetch a unique secret key for the user from the server
        https.get('https://yourserver.com/api/secret', (res) => {
            res.on('data', (secret) => {
                // Set the expiration time for the JWT token (e.g. 1 hour)
                const expiresIn = '1h';
                // Generate the JWT token using the user's unique secret key
                const token = jwt.sign(payload, secret, { expiresIn });
                // Hash the token using sha-256
                crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)).then(tokenHash => {
                    const tokenHashArray = Array.from(new Uint8Array(tokenHash));
                    const hashedToken = tokenHashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
                    resolve(hashedToken);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    });
}
module.exports = { generateJWT };
