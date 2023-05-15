import Function from "./src/lib/lib.function.js"
import Collection from "./src/lib/lib.collection.js"

import { fileURLToPath } from "url"
import fs from "fs"


global.reloadFile = (file) => reloadFile(file)
global.commands = new Collection()

// limit
global.limit = {
	free: 25,
	premium: 250,
	VIP: "Infinity",
	download: {
		free: 30000000, // use byte
		premium: 100000000, // use byte
		VIP: 1130000000, // use byte 
	}
}

//API
global.APIs = {
	sinon: {
		URI: 'http://api-rest-sinon.my.id:5000',
		Key: 'create your key at the url abrove'
	},
	xzn: {
		URI: 'https://xznsenpai.xyz/'
	}
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
		locked: 'Fitur ini telah dinonaktifkan!',
		media: 'Reply media...',
		error: "Sepertinya ada kesalahan. bot gagal dalam mengeksekusi...",
		quoted: "Reply message...",
		wait: "",
		premium: "Perintah ini hanya dapat digunakan oleh pengguna premium!",
		vip: "Perintah ini hanya dapat digunakan oleh pengguna VIP!",
		dlFree: `File over ${Function.formatSize(limit.download.free)} can only be accessed by premium users${options?.extra ? options.extra : ""}`,
		dlPremium: `WhatsApp Web cannot send files larger than ${Function.formatSize(limit.download.premium)}${options?.extra ? options.extra : ""}`,
		dlVIP: `WhatsApp cannot send files larger than ${Function.formatSize(limit.download.VIP)}${options?.extra ? options.extra : ""}`
	}[type]

	if (msg) return m.reply(msg, { quoted: m, ...options })
	return mess(type, { quoted: m, ...options })
}
global.options = {
	public: true,
	URI: "database.json", // use mongo or file json 
	owner: ["6288292024190", "62858156631709"],
	pathCommand: 'commands'
}
global.Exif = {
	packId: "https://instagram.com/cak_haho",
	packName: `Sticker ini Dibuat Oleh :\nhttps://instagram.com/cak_haho\n\nPada :\n${Function.tanggal(new Date())} Pukul ${Function.jam(new Date())} WIB\n\nOleh :\nDika Ardnt.`,
	packPublish: "Dika Ardnt.",
	packEmail: "dika.ardianta7@yahoo.com",
	packWebsite: "https://instgaram.com/cak_haho",
	androidApp: "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
	iOSApp: "https://apps.apple.com/id/app/muslim-pro-al-quran-adzan/id388389451?|=id",
	categories: ['😹', '😎', '😱'],
	isAvatar: 0
}
global.session = {
	Path: "session",
	Name: "hisoka"
}


async function reloadFile(file) {
	file = (file).url || (file)
	let fileP = fileURLToPath(file)
	fs.watchFile(fileP, () => {
		fs.unwatchFile(fileP)
		console.log(`Update File "${fileP}"`)
		import(`${file}?update=${Date.now()}`)
	})
}

reloadFile(import.meta.url)
