const { format } = require("util")


module.exports = {
    name: "eval",
    aliases: [">",">>"],
    desc: "Eval",
    execute: async(opt) => {
        const { m, hisoka } = opt
        let evalCmd
        try {
            evalCmd = eval(m.text)
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
        .then((res) => m.reply(format(res)))
        .catch((err) => m.reply(format(err)))
    },
    isOwner: true
}