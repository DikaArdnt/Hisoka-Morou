import { toAudio } from "../../lib/lib.convert.js"
import api from "skrep"

export default {
    name:"facebook",
    aliases: ["fb","fbdl"],
    type: 'download',
    desc: "Download Video and Image Facebook",
    example: "No Urls!\n\nExample : %prefix%command https://www.facebook.com/reel/1221811732075864/?mibextid=eA6d3HrSeJoD5Dg0",
    execute: async({ hisoka, m }) => {
        mess("wait", m)
        let json = await api.downloader.Facebook.scrape(Func.isUrl(m.text)[0])
        if (json?.link == undefined) return mess("error", m)
        let text = `
Facebook Video and Image Downloader

⭔ Caption : ${json?.description}
⭔ Credits : ${json?.Credits}
`
        if (m.text.toLowerCase().endsWith("audio-video")) hisoka.sendMessage(m.from, (await toAudio(json?.link[0].link, "mp4")), { mimetype: "audio/mpeg", asDocument: true, quoted: m })
        else {
        await hisoka.sendMessage(m.from, json?.link[0].link, { caption: text, quoted: m })
        }
    }
}