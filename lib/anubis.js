/**
   * Create By anubiskun.
   * Contact Me on mailto://anubiskun.xyz@gmail.com
   * Follow https://github.com/anubiskun
*/

const fs = require('fs');
const Pageres = require('pageres');
const { TelegraPh } = require('./uploader')

module.exports = {
    ssweb(url) {
        return new Promise(async (resolve, reject) => {
            let a = await new Pageres({delay: 2})
            .src(url, [`720x1200`], {crop: false})
            .dest('./src')
            .run();
            let b = await TelegraPh('./src/'+ a[0].filename)
            await fs.promises.readFile('./src/'+ a[0].filename)
            await fs.promises.unlink('./src/'+ a[0].filename)
            return resolve(b)
        })
    }
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(`Update ${__filename}`)
	delete require.cache[file]
	require(file)
})
