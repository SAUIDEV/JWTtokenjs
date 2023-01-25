//Based on the new req

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const generateJWT = require('./generatejwt');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        if (parsedUrl.pathname === '/login') {
            if (req.method === 'POST') {
                // Check the user credentials
                const { username, password } = JSON.parse(body);
                if (username === 'admin' && password === 'password') {
                    // Generate a JWT token for the user
                    generateJWT({ username }).then(token => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ token }));
                    }).catch(err => {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: err.message }));
                    });
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Incorrect username or password' }));
                }
            } else {
                res.writeHead(405, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Method not allowed' }));
            }
        } else if (parsedUrl.pathname === '/register') {
            if (req.method === 'POST') {
                // Register the user
                const { username, password } = JSON.parse(body);
                // Save the user to the database (not implemented in this example)
                // ...

                // Generate a JWT token for the user
                generateJWT({ username }).then(token => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ token }));
                }).catch(err => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message }));
                });
            } else {
                res.writeHead(405, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Method not allowed' }));
            }
        } else if (parsedUrl.pathname === '/logout') {
            // Log the user out
            generateJWT.logout(res);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Successfully logged out' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Route not found' }));
        }
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

