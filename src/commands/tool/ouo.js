import WhatsappWeb from "whatsapp-web.js"
const { Message, MessageMedia, Contact, Location, Buttons, List } = WhatsappWeb

export default {
    name: "ouo",
    aliases: ["ouo"],
    type: 'tool',
    desc: "Get Direct Link From Ouo",
    execute: async({ hisoka, m }) => {
        Func.fetchJson(`http://api-rest-sinon.my.id:5000/api/shortlink/ouo?&apikey=${global.apikeySinon}&url=${m.text}`)
        .then(async (a) => {
            hisoka.sendMessage(m.from, a.result, { quoted: m })
        })
    }
}