'use strict'

console.log("Hello World")

// setTimeout(function () {
//   console.log("lazy Hellow World")
// }, 3000)


// console.log(process.version)
// console.log(process.argv[0])
// console.log(process.env)
// console.log(process.pid)
// console.log(process.getuid())
// console.log(process.cwd())
// console.log(process.chdir())
// console.log(process.exit())



// httpUtils get
var httpUtils = require('./httpUtils')
var url1 = 'http://localhost:8000/test/delay?3000'
httpUtils.get(url1, function (status, headers, body) {
  console.log(body)
})

// httpUtils post
const url2 = 'localhost'
const path = '/test/delay'
var params = {
  delay: 5000
}
httpUtils.post(url2, path, params, function (status, headers, body) {
  console.log(body)
})