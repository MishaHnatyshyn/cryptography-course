const http = require('http');
const url = require('url');

const HOST = '95.217.177.249';

const formatQueryString = (queryParams) => {
    return '?' + new url.URLSearchParams(queryParams).toString()
}

const getRequest = (path, queryParams) => {
    return new Promise((resolve, reject) => {
        const queryString = formatQueryString(queryParams);
        const options = {
            host: HOST,
            path: path + queryString
        }

        http.request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                resolve(JSON.parse(data));
            });

            response.on('error', reject)
        }).end();
    })
}

module.exports = {
    getRequest
}