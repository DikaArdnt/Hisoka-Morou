chalk = require("chalk")
const fs = require("fs")
const { Function } = require("./src/lib/lib.function")


global.reloadFile = (file, options = {}) => reloadFile(file)
global.Func = Function

// Rest Api
global.APIs = {
	zenz: 'https://api.zahwazein.xyz'
}

// Apikey
global.APIKeys = {
	zenz: 'get apikey in https://api.zahwazein.xyz',
 	openai: 'your openai key',
 	dood: ''
}
// Other
global.mess = (type, m, options = {}) => {
 	let msg = {
 		owner: 'Perintah ini hanya dapat digunakan oleh Owner!',
 		group: 'Perintah ini hanya dapat digunakan di group!',
 		private: 'Perintah ini hanya dapat digunakan di private chat!',
 		admin: 'Perintah ini hanya dapat digunakan oleh admin group!',
 		botAdmin: 'Bot bukan admin, tidak dapat mengakses fitur tersebut',
 		bot: 'Fitur ini hanya dapat diakses oleh Bot',
 		main: 'Fitur ini sedang perbaikan!',
 		media: 'Reply media...',
 		error: "No Results Found",
 		quoted: "Reply pesan",
 		wait: "Is being processed, please wait...",
 	}[type]

 if (msg) return m.reply(msg, { quoted: m, ...options })
}
global.options = {
 	public: false,
 	multiPrefix: true,
 	singlePrefix: false,
 	noPrefix: false,
 	prefix: "#",
 	URI: "",
}
global.Exif = {
 	packId: "https://zenkafako.me",
 	packName: `Sticker ini Dibuat Oleh :\nhttps://zenkafako.me\n\nPada :\n${Function.tanggal(new Date)}\n\nOleh :\nHisoka Bot`,
 	packPublish: "Hisoka Morou",
	packEmail: "zenkafako@yahoo.com",
 	packWebsite: "https://zenkafako.me",
 	androidApp: "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
 	iOSApp: "https://apps.apple.com/id/app/muslim-pro-al-quran-adzan/id388389451?|=id",
 	emojis: [],
 	isAvatar: 0
}
global.owner = ["6285815663170"] //ojo dihapus njir
global.sessionName = "session"

const { readCommands } = require('./src/event/event.message')
function reloadFile(file) {
 	file = require.resolve(file)
 	fs.watchFile(file, () => {
		delete require.cache[file]
		if (/commands/i.test(file)) readCommands(file)
		fs.unwatchFile(file)
		console.log(`Update ${file}`)
 	})
}


global.reloadFile(__filename)
