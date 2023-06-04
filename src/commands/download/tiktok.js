import { toAudio } from "../../lib/lib.convert.js"


export default {
    name:"tiktok",
    aliases: ["tt","ttdl"],
    type: 'download',
    desc: "Download Video and Audio Tiktok",
    example: "No Urls!\n\nExample : %prefix%command https://www.tiktok.com/@flocki__/video/7158539658333392129",
    execute: async({ hisoka, m }) => {
        m.reply("wait")
        let json = await Func.fetchJson(`https://api.tiklydown.me/api/download?url=${Func.isUrl(m.text)[0]}`)
        if (json?.video?.noWatermark == undefined) return m.reply("error")
        let text = `
Tiktok Video and Audio Downloader

⭔ Author : ${json?.author?.name} (https://www.tiktok.com/@${json?.author?.unique_id})
⭔ ID : ${json?.id}
⭔ Title : ${json?.title}
⭔ Created At : ${json?.created_at}
⭔ Comment : ${json?.stats?.commentCount}
⭔ Shared : ${json?.stats?.shareCount}
⭔ Watched : ${json?.stats?.playCount}
⭔ Saved : ${json?.stats?.saveCount}
⭔ Duration : ${json?.video?.durationFormatted}
⭔ Quality Video : ${json?.video?.ratio}
⭔ Audio Title : ${json?.music?.title}
⭔ Audio Author : ${json?.music?.author}
`
        if (m.text.toLowerCase().endsWith("audio-original")) hisoka.sendMessage(m.from, json?.music?.play_url, { mimetype: "audio/mpeg", fileName: json?.music?.title + ".mp3", caption: text, asDocument: true, quoted: m })
        else if (m.text.toLowerCase().endsWith("audio-video")) hisoka.sendMessage(m.from, (await toAudio(json?.video?.noWatermark, "mp4")), { mimetype: "audio/mpeg", asDocument: true, quoted: m })
        else {
            await hisoka.sendMessage(m.from, json?.video?.noWatermark, { caption: text, quoted: m })
            hisoka.sendMessage(m.from, json?.music?.play_url, { mimetype: "audio/mpeg", fileName: json?.music?.title + ".mp3", caption: text, asDocument: true, quoted: m })
        }
    }
}