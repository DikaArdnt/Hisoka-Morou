import path from 'path'
import fs from "fs"
import archiver from 'archiver'


export default {
    name: "backup",
    aliases: ["bckp"],
    type: 'owner',
    desc: "Backup script gwehj",
    execute: async({ hisoka, m, config }) => {
        m.reply("wait")
        const output = fs.createWriteStream(path.join(process.cwd(), 'hisoka.zip'))
        const archive = archiver('zip') // tar & zip

        archive.pipe(output)

        let dir = fs.readdirSync(".")
        let files = dir.filter(a => a !== "node_modules" && a !== "package-lock.json" && a !== ".git" && a !== config.session.Path)

        files.forEach(function (file) {
            const lockFile = path.join(process.cwd(), file)

            if ((fs.lstatSync(lockFile)).isDirectory()) {
                archive.directory(lockFile, file)
            } else {
                archive.file(lockFile, { name: file })
            }
        })

        await archive.finalize()
        
        await hisoka.sendFile(config.options.owner[0] + "@c.us", "./hisoka.zip", { quoted: m, filename: "hisoka-wawebjs-backup.zip", type: 'document' })
        fs.unlinkSync("./hisoka.zip")
    },
    isOwner: true
}