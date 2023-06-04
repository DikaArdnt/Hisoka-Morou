import axios from "axios"
import { format } from "util"


export default {
    name: "fetch",
    aliases: ["get","url"],
    type: 'tool',
    desc: "Fetching url",
    example: "No Urls!?\n\nExample : %prefix%command https://google.com",
    execute: async({ hisoka, m, config }) => {
        if (!/^https?:\/\//.test(m.text)) return m.reply("Url not matched")
        m.reply("wait")
        let res = await axios.get(Func.isUrl(m.text)[0])
        if (!/text|json/.test(res?.headers?.get("content-type"))) {
            let { size, data, ext, mime } = await Func.getFile(Func.isUrl(m.text)[0])
            if (size >= config.limit.download.free && !m.isPremium) return m.reply("dlFree")
            if (size >= config.limit.download.premium && !m.isVIP) return m.reply("dlPremium")
            if (size >= config.limit.download.VIP) return m.reply("dlVIP")
            let fileName = m?.text?.toLowerCase()?.includes("filename=") ? m.text.split`filename=`[1] + "." + ext : Func.getRandom(ext, 20)
            let caption = m?.text?.toLowerCase()?.includes("caption=") ? m.text.split`caption=`[1] : ""
            return hisoka.sendMessage(m.from, Func.isUrl(m.text)[0], { mimetype: res?.headers?.get("content-type"), fileName, caption, quoted: m })
        }
        let text = res?.data
        try {
            m.reply(format(text))
        } catch (e) {
            m.reply(format(e))
        }
    }
}