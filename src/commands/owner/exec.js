import { exec } from 'child_process'


export default {
    name: "$",
    aliases: ["exec"],
    type: 'owner',
    desc: "Exec",
    execute: async({ m }) => {
        try {
            exec(m.text, async(err, stdout) => {
                if (err) return m.reply(Func.Format(err))
                if (stdout) return m.reply(Func.Format(stdout))
            })
        } catch (e) {
            m.reply(Func.Format(e))
        }
    },
    isOwner: true,
    noPrefix: true
}