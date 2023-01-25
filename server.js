// server.js
const https = require('https');
const login = require('./login');
const register = require('./register');

https.createServer((req, res) => {
    if (req.url === '/login' && req.method === 'POST') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            const { username, password } = JSON.parse(data);
            login.login(username, password)
                .then(token => {
                    res.end(JSON.stringify({ token }));
                })
                .catch(err => {
                    res.statusCode = 401;
                    res.end(JSON.stringify({ error: err.message }));
                });
        });
    } else if (req.url === '/register' && req.method === 'POST') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            const { username, password, email } = JSON.parse(data);
            register.register(username, password, email)
                .then(token => {
                    res.end(JSON.stringify({ token }));
                })
                .catch(err => {
                    res.statusCode = 401;
                    res.end(JSON.stringify({ error: err.message }));
                });
        });
    } else {
        res.statusCode = 404;
        res.end();
    }
}).listen(3000);
console.log('Server running on port 3000');

