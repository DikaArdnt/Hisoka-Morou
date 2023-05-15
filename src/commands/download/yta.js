export default {
    name: "ytmp3",
    aliases: ["ytaudio","yta"],
    type: 'download',
    desc: "Download Youtube Audio",
    example: "No Urls!\n\nExample : %prefix%command https://www.youtube.com/watch?v=5ytnKggHwvY",
    execute: async({ hisoka, m }) => {
        mess("wait", m)
        let request = await (new api('xzn')).get('/api/y2mate', { url: Func.isUrl(m.body)[0] })
        if (request.data?.err) return mess('error', m)
        let { id: vid, title, links, a: channel } = request.data
        let a = links.audio[Object.keys(links.audio)[0]]
        let b = await Func.fetchJson(a.url)
        let { size, data } = await Func.getFile(b.dlink)
        if (size >= limit.download.free && !m.isPremium) return mess("dlFree", m, { extra: `, please download manually ${b.dlink}` })
        if (size >= limit.download.premium && !m.isVIP) return mess("dlPremium", m, { extra: `, please download manually ${b.dlink}` })
        if (size >= limit.download.VIP) return mess("dlVIP", m, { extra: `, please download manually ${b.dlink}` })
        let msg = await hisoka.sendMedia(m.from, thumbnail, m, { caption: title })
        hisoka.sendMessage(m.from, { document: data, mimetype: "audio/mpeg", fileName: `${title} - ${channel}.mp3` }, { quoted: msg })
    },
    isLimit: true
}
