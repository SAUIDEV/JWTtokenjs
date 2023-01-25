// login.js
const https = require('https');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const generateJWT = require('./generatejwt');

const login = (username, password) => {
    return new Promise((resolve, reject) => {
        // Send a request to the server to check if the login credentials are valid
        const postData = JSON.stringify({
            username: username,
            password: password
        });
        const options = {
            hostname: 'yourserver.com',
            port: 443,
            path: '/api/login',
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
                    // If the login is successful, generate a new JWT token for the user
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
module.exports = { login };
