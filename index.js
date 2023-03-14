const fs = require("fs")

console.log('Starting . . .')
const { spawn: spawn } = require('child_process'), path = require('path')
//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

function start() {
	let args = [path.join(__dirname, "src", "hisoka.js"), ...process.argv.slice(2)]
	let p = spawn(process.argv[0], args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })
	.on('message', data => {
		if (data == 'reset') {
			console.log('Restarting...')
			p.kill()
			start()
			delete p
		}
	})
	.on("exit", code => {
		start()
	})
}

start()