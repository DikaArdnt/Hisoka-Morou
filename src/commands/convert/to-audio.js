import { toAudio } from "../../lib/lib.convert.js"


export default {
    name: "toaudio",
    aliases: ["tomp3", "toogg"],
    type: 'convert',
    desc: "Convert video to audio",
    execute: async({ hisoka, m, quoted }) => {
        if (!/video|audio/i.test(quoted.mime)) return m.reply(`Not Supported Mime "${quoted.mime}"\n\nReply video with caption #toaudio`)
        m.reply("wait")
        let media = await quoted.downloadMedia()
        let audio = await toAudio(media, 'mp4')
        hisoka.sendMessage(m.from, audio, { mimetype: "audio/mp4",asDocument: true, fileName: `To Audio ${hisoka.info?.pushname}.mp3`, quoted: m })
    },
    isMedia: true
}