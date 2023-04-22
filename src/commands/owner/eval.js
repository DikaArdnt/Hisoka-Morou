import { format } from "util"
const wweb = await import('whatsapp-web.js')


export default {
    name: ">",
    aliases: ["eval",">>"],
    type: 'owner',
    desc: "Eval",
    execute: async(opt) => {
        const { m, hisoka } = opt
        let evalCmd
        try {
            evalCmd = /await/i.test(m.text) ? eval("(async() => { " + m.text + " })()") : eval(m.text)
        } catch (e) {
            m.reply(format(e))
        }
        new Promise(async (resolve, reject) => {
            try {
                resolve(evalCmd);
            } catch (err) {
                reject(err)
            }   
        })
        ?.then((res) => m.reply(format(res)))
        ?.catch((err) => m.reply(format(err)))
    },
    isOwner: true,
    noPrefix: true
}