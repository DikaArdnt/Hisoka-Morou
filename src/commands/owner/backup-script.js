import fs from "fs"
import { execSync } from "child_process"


export default {
    name: "backup",
    aliases: ["bckp"],
    type: 'owner',
    desc: "Backup script gwehj",
    execute: async({ hisoka, m }) => {
        let dir = fs.readdirSync(".")
        let file = dir.filter(a => a !== "node_modules" && a !== "package-lock.json" && a !== ".git" && a !== global.session.Path)
        mess("wait", m)
        let exec = await execSync(`zip -r hisoka.zip ${file.join(" ")}`)
        await hisoka.sendMessage(global.options.owner[0] + "@s.whatsapp.net", "./hisoka.zip", { quoted: m, fileName: "hisoka-wawebjs-backup.zip" })
        fs.unlinkSync("./hisoka.zip")
    },
    isOwner: true
}