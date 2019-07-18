'use strict'

// node 在新的版本中已经简化了HTTP请求，书中createClient方法已经弃用，具体查看官方文档：https://nodejs.org/api/http.html
exports.get = function (url, callback) {
  url = require('url').parse(url)
  var http = require('http')
  http.get(url, (res) => {
    const {
      statusCode
    } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`);
    }
    if (error) {
      console.error(error.message);
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
      rawData += chunk;
      console.log(chunk)
    });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log(parsedData);
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });

}

exports.post = function (url, path, params, callback) {
  const http = require('http')
  const options = {
    hostname: 'localhost',
    port: 8000,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': JSON.stringify(params).length
    }
  }
  const req = http.request(options, (res) => {
    res.resume();
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(chunk)
    })
    res.on('end', () => {
      if (!res.complete)
        console.error(
          'The connection was terminated while the message was still being sent');
    });
  });
  req.write(JSON.stringify(params))
  req.end()
}