import { toAudio } from "../../lib/lib.convert.js"
import api from "skrep"

export default {
    name:"instagram",
    aliases: ["ig","igdl"],
    type: 'download',
    desc: "Download Video and Audio Instagram",
    example: "No Urls!\n\nExample : %prefix%command https://www.instagram.com/p/Crwj7nMSgYY/?utm_source=ig_web_copy_link",
    execute: async({ hisoka, m }) => {
        mess("wait", m)
        let json = await api.downloader.instagram.download(Func.isUrl(m.text)[0])
        if (json?.media == undefined) return mess("error", m)
        let text = `
Instagram Video and Image Downloader

⭔ Caption : ${json?.caption}
⭔ Credits : ${json?.Credits}
`
        
        for (let i of json?.media)   {
        await hisoka.sendMessage(m.from, i, { caption: text, quoted: m })
        }
    }
}