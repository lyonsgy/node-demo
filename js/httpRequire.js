'use strict'

var http = require('http')
var fs = require('fs')

var server = new http.Server()
server.listen(8000)

server.on('request', function (request, response) {
  var url = require('url').parse(request.url)

  if (url.pathname === '/test/delay') {
    if (request.method === 'POST') {
      var body = '';
      request.setEncoding('utf8');
      request.on('data', function (chunk) {
        body += chunk; //读取请求体
      })

      request.on('end', function () {
        const params = JSON.parse(body)

        var delay = parseInt(params.delay) || 2000

        response.writeHead(200, {
          'Content-type': 'text/plain; charset=UTF-8'
        })
        response.write('Sleeping for ' + delay + ' milliseconds...\r\n')

        setTimeout(() => {
          response.write('request done.')
          response.end()
        }, delay);
      })
    } else {
      var delay = parseInt(url.query) || 2000

      response.writeHead(200, {
        'Content-type': 'text/plain; charset=UTF-8'
      })
      response.write('Sleeping for ' + delay + ' milliseconds...\r\n')

      setTimeout(() => {
        response.write('request done.')
        response.end()
      }, delay);
    }

  } else if (url.pathname === '/test/mirror') {
    response.writeHead(200, {
      'Content-type': 'text/plain; charset=UTF-8'
    })
    response.write(request.method + ' ' + request.url + ' HTTP/' + request.httpVersion + '\r\n')
    for (const h in request.headers) {
      response.write(h + ': ' + request.headers[h] + '\r\n')
    }
    response.write('\r\n')
    response.write('hello mirror')
    request.on('data', function (chunk) {
      response.write(chunk)
    })
    request.on('end', function (chunk) {
      response.end()
    })
  } else {
    var filename = url.pathname.substring(1)
    var type
    switch (filename.substring(filename.lastIndexOf('.') + 1)) {
      case 'html':
      case 'htm':
        type = 'text/html; charset=UTF-8'
        break;

      case 'js':
        type = 'application/javascript; charset=UTF-8'
        break;

      case 'css':
        type = 'text/css; charset=UTF-8'
        break;

      case 'txt':
        type = 'text/plain; charset=UTF-8'
        break;

      case 'manifest':
        type = 'text/cache-manifest; charset=UTF-8'
        break;

      default:
        type = 'application/octet-stream'
        break;
    }

    fs.readFile(filename, function (err, content) {
      if (err) {
        response.writeHead(404, {
          'Content-type': 'text/plain; charset=UTF-8'
        })
        response.write(err.message)
        response.end()
      } else {
        response.writeHead(200, {
          'Content-type': type
        })
        response.write(content)
        response.end()
      }
    })
  }
})