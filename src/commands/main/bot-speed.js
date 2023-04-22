import cp from "child_process"
import { promisify } from "util"


export default {
    name: "speed",
    aliases: ["speedtes", "speedtest"],
    type: 'main',
    desc: "Check speed",
    execute: async({ hisoka, m }) => {
        let exec = promisify(cp.exec).bind(cp)
        await m.reply("Test Speed...")
        let o 
        try {
            o = await exec(`speedtest`)
        } catch (e) {
            o = e
        } finally {
            let { stdout, stderr } = o
            if (stdout) return m.reply(stdout)
            if (stderr) return m.reply(stderr)
        }
    }
}