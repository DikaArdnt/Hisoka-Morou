import fs from "fs"
import { exec } from "child_process"
import { webp2mp4File } from "../../lib/lib.convert.js"


export default {
    name: "toimage",
    aliases: ["toimg", "tovid", "tomp4", "tovideo"],
    type: 'convert',
    desc: "Convert Sticker to Image",
    execute: async ({ hisoka, m }) => {
        m.reply("wait")
        if (m.quoted.isAnimated) {
            let download = await m.quoted.downloadMedia()
            let media = await webp2mp4File(download)
            hisoka.sendMessage(m.from, media, { quoted: m })
        } else {
            let webp = await m.quoted.downloadMedia(await Func.getRandom('webp'))
            let png = `./temp/${await Func.getRandom('png')}`
            exec(`ffmpeg -i ${webp} ${png}`, async(err) => {
                fs.unlinkSync(webp)
                if (err) return m.reply(Func.Format(err))
                let buffer = fs.readFileSync(png)
                await hisoka.sendMessage(m.from, buffer, { quoted: m })
                fs.unlinkSync(png)
            })
        }
    },
    isMedia: {
        Sticker: true
    }
}