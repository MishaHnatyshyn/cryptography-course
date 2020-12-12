const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
    cert: fs.readFileSync(path.join(__dirname, 'certs/crt.pem')),
    key: fs.readFileSync(path.join(__dirname, 'certs/key.pem'))
};

https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(8000);