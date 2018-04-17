#!/usr/bin/env node

const path = require('path')
const liveServer = require("live-server")
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
 * 命令行参数形式
 * -port 9000
 * -target http://baidu.com/
 * -mark local
 * -src src
 */
args.forEach((v, i) => i%2 || (argmap[v.slice(1)] = args[i+1]))

// 配置文件形式
let src = process.argv[process.argv.length - 1]
if (src[0] !== '-') {
  let config = require(__dirname.replace(/((\w\\)+)node_modules.+/, `$1${src}.config.js`))
  argmap = Object.assign(argmap, config)
}

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
let params = {
	port: ~~argmap.port, // Set the server port. Defaults to 8080.
	host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
	root: argmap.src, // Set root directory that's being served. Defaults to cwd.
	open: true, // When false, it won't load your browser by default.
	ignore: 'bundle,plugin', // comma-separated string for paths to ignore
	// file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
	wait: 500, // Waits for all changes, before reloading. Defaults to 0 sec.
	mount: [['/components', './node_modules']], // Mount a directory to a route.
	logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
	middleware: [function(req, res, next) {
    if (req.url.indexOf(argmap.mark) > 0) {
      return proxy.web(req, res)
    }
    next()
  }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
}
liveServer.start(params)
