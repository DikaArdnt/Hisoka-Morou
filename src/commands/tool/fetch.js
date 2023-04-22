import axios from "axios"
import { format } from "util"


export default {
    name: "fetch",
    aliases: ["get","url"],
    type: 'tool',
    desc: "Fetching url",
    example: "No Urls!?\n\nExample : %prefix%command https://google.com",
    execute: async({ hisoka, m }) => {
        if (!/^https?:\/\//.test(m.text)) return m.reply("Url not matched")
        mess("wait", m)
        let res = await axios.get(Func.isUrl(m.text)[0])
        if (!/text|json/.test(res?.headers?.get("content-type"))) {
            let { size, data, ext, mime } = await Func.getFile(Func.isUrl(m.text)[0])
            if (size >= limit.download.free && !m.isPremium) return mess("dlFree", m)
            if (size >= limit.download.premium && !m.isVIP) return mess("dlPremium", m)
            if (size >= limit.download.VIP) return mess("dlVIP", m)
            let fileName = m?.text?.toLowerCase()?.includes("filename=") ? m.text.split`filename=`[1] + "." + ext : Func.getRandom(ext, 20)
            let caption = m?.text?.toLowerCase()?.includes("caption=") ? m.text.split`caption=`[1] : ""
            //return hisoka.sendMessage(m.from, Func.isUrl(m.text)[0], { mimetype: res?.headers?.get("content-type"), fileName, caption, quoted: m })
            return hisoka.sendFile(m.from, Func.isUrl(m.body)[0], { mimetype: res?.headers?.get("content-type"), filename: fileName, caption, quoted: m })
        }
        let text = res?.data
        try {
            m.reply(format(text))
        } catch (e) {
            m.reply(format(e))
        }
    }
}