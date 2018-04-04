const http = require('http')
const url = require('url')
const fs = require('fs')
const mine = require('./mine')
const path = require('path')
const httpProxy = require('http-proxy')

const args = process.argv.slice(2)
/**
 * 默认设置
 */
let argmap = {
  port: '3000',
  target: 'http://39.108.178.228:8009/',
  mark: 'index.php',
  src: 'src'
}
/**
 * 命令行参数
 * -port 9000
 * -target http://baidu.com/
 * -mark local
 * -src src
 */
args.forEach((v, i) => i%2 || (argmap[v.slice(1)] = args[i+1]))

const proxy = httpProxy.createProxyServer({
  target: argmap.target,
  // ssl: {
  //   key: fs.readFileSync('server_decrypt.key', 'utf8'),
  //   cert: fs.readFileSync('server.crt', 'utf8')
  // },
  // secure: false
})

proxy.on('error', (err, req, res) => {
  res.writeHead(500, { 'content-type': 'text/plain' })
  console.log(err)
  res.end('err: 500')
})

http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname
  pathname.length === 1 && (pathname = 'index.html')
  let realpath = path.join('./', argmap.src, pathname)
  let ext = path.extname(realpath)
  ext = ext ? ext.slice(1) : 'unknow'
  if (req.url.indexOf(argmap.mark) > 0) {
    return proxy.web(req, res)
  }

  fs.exists(realpath, exists => {
    if (!exists) {
      res.writeHead(404, { 'content-type': 'text/plain' })
      res.end('404')
    } else {
      fs.readFile(realpath, 'binary', (err, file) => {
        if (err) {
          res.writeHead(500, {'content-type': 'text/plain'})
          res.end(err)
        } else {
          const contentType = mine[ext] || 'text/plain'
          res.writeHead(200, {'content-type': contentType})
          res.write(file, 'binary')
          res.end()
        }
      })
    }
  })
}).listen(argmap.port)

console.log(`server is on http://localhost:${argmap.port}`)
