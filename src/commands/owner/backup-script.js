const fs = require("fs")
const { execSync } = require("child_process")


module.exports = {
    name: "backup",
    aliases: ["bckp"],
    desc: "Backup script gwehj",
    execute: async({ hisoka, m }) => {
        let dir = fs.readdirSync(".")
        let file = dir.filter(a => a !== "node_modules" && a !== "package-lock.json" && a !== ".git" && a !== global.sessionName)
        mess("wait", m)
        let exec = await execSync(`zip -r hisoka.zip ${file.join(" ")}`)
        for(let i of owner){
        await hisoka.sendMessage(i+"@s.whatsapp.net", "./hisoka.zip", { quoted: m, fileName: "hisoka-wawebjs-backup.zip" })
        }
        fs.unlinkSync("./hisoka.zip")
    },
    isOwner: true
}