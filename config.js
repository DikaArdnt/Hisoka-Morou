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

// set notification
global.notification = {
 	welcome: `Selamat Datang di Group Kami\n\n- Member : @member\n- Name : @name\n- Group : @group\n- Time : @time WIB\n- Type : @type\n\nDon't forget to read and understand the group description\n\n@desc`,
 	leave: `Member Telah Berkurang 1\n\n- Member : @member\n- Name : @name\n- Group : @group\n- Time : @time WIB\n- Type : @type`,
 	promote: `Member telah Level Up Menjadi Admin\n\n- Member : @member\n- Name : @name\n- By : @by\n- Group : @group\n- Time : @time WIB\n\nOmedetou Gozaimasu :D`,
 	demote: `Seorang Admin telah Turun Menjadi Member\n\n- Member : @member\n- Name : @name\n- By : @by\n- Group : @group\n- Time : @time WIB\n\nZannen Desu Ne :(`,
 	announcement: `The group has been closed\n\n- Group : @group\n- By : @by\n- Name Modifier : @name\n- Time : @time\n\nonly admins can send messages`,
 	not_announcement: `The group has been opened\n\n- Group : @group\n- By : @by\n- Name Modifier : @name\n- Time : @time\n\nNow all members can send messages`,
 	subject: `Group name has been changed\n\n- Becomes : @newName\n- By : @by\n- Name Modifier : @name\n- Time : @time`,
 	description: `Group description has been changed\n\n- By : @by\n- Name Modifier : @name\n- Time : @time\n- Becomes :\n@newDesc`,
 	ephemeral: `Ephemeral message has been turned on\n\n- In : @group\n- By : @by\n- Name Modifier : @name\n- During : @during\n- At : @time`,
 	not_ephemeral: `Ephemeral message has been turned off\n\n- In : @group\n- By : @by\n- Name Modifier : @name\n- At : @time`,
 	unlocked: `Group setting have been changed\n\n- Group : @group\n- By : @by\n- Name Modifier : @name\n- Time : @time\n\nCurrently all members can change the info this group`,
 	locked: `Group setting have been changed\n\n- Group : @group\n- By : @by\n- Name Modifier : @name\n- Time : @time\n\nCurrently all members can't change the info this group`,
 	invite: `Invite code has been reset\n\n- New Code : @code\n- Group : @group\n- By : @by\n- Name Modifier : @name\n- Time : @time`,
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

 if (msg) return m.reply(msg, m.from, { quoted: m, ...options })
}
global.options = {
 	public: false,
 	antiSpam: true,
 	antiCall: true,
 	multiPrefix: true,
 	singlePrefix: false,
 	noPrefix: false,
 	limitAwal: 50,
 	prefix: "#",
 	URI: "",
}
global.Exif = {
 	packId: "https://zenkafako.me",
 	packName: `Sticker ini Dibuat Oleh :\nhttps://zenkafako.me\n\nPada :\n${Function.tanggal(new Date)}\n\nOleh :\nZenkafako Bot`,
 	packPublish: "Zenkafako Bot",
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