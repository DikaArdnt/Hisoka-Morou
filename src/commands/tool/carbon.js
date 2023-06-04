import axios from "axios"


export default {
    name: 'carbon',
    aliases: ['carbon.now'],
    type: 'tool',
    desc: 'code heker',
    example: "No Query?!\n\nExample : %prefix%command <html?",
    execute: async({ hisoka, m }) => {
        m.reply("wait")
        let data = await axios({
            url: 'https://carbonara.solopov.dev/api/cook',
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: { code: m.text },
            responseType: 'arraybuffer'
        })
        hisoka.sendMessage(m.from, data?.data, { quoted: m })
    }
}