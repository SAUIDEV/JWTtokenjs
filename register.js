// register.js
const https = require('https');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const generateJWT = require('./generatejwt');

const register = (username, password, email) => {
    return new Promise((resolve, reject) => {
        // Send a request to the server to register the user
        const postData = JSON.stringify({
            username: username,
            password: password,
            email: email
        });
        const options = {
            hostname: 'yourserver.com',
            port: 443,
            path: '/api/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };
        const req = https.request(options, (res) => {
            res.on('data', (d) => {
                const json = JSON.parse(d);
                if (json.error) {
                    reject(new Error(json.error));
                } else {
                    // If the registration is successful, generate a new JWT token for the user
                    generateJWT.generateJWT({username: username}).then(token => {
                        resolve(token);
                    }).catch(err => {
                        reject(err);
                    });
                }
            });
        });
        req.on('error', (e) => {
            reject(e);
        });
        req.write(postData);
        req.end();
    });
}
module.exports = { register };

