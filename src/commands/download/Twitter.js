import { toAudio } from "../../lib/lib.convert.js"
import api from "skrep"

export default {
    name:"twitter",
    aliases: ["twt","twtdl"],
    type: 'download',
    desc: "Download Video and Image Facebook",
    example: "No Urls!\n\nExample : %prefix%command https://twitter.com/kikka_cos/status/1654259614362501121?s=20",
    execute: async({ hisoka, m }) => {
        mess("wait", m)
        let json = await api.downloader.Twitter.download(Func.isUrl(m.text)[0])
        if (json?.link == undefined) return mess("error", m)
        let text = `
Twitter Video and Image Downloader

⭔ Caption : ${json?.description}
⭔ Credits : ${json?.Credits}
`
        await hisoka.sendMessage(m.from, json?.link[0], { caption: text, quoted: m })
    }
}