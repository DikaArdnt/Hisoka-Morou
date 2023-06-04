export default {
    name: "ytmp4",
    aliases: ["ytvideo", "ytv"],
    type: 'download',
    desc: "Download Youtube Video",
    example: "No Urls!\n\nExample : %prefix%command https://www.youtube.com/watch?v=5ytnKggHwvY",
    execute: async({ hisoka, m, config }) => {
        m.reply("wait")
        let request = await (new api('xzn')).get('/api/y2mate', { url: Func.isUrl(m.body)[0] })
        if (request.data?.err) return m.reply("error")
        let { id: vid, title, links } = request.data
        let a = links.video[Object.keys(links.video)[0]]
        let b = await Func.fetchJson(a.url)
        let { size, data } = await Func.getFile(b.dlink)
        if (size >= config.limit.download.free && !m.isPremium) return m.reply("dlFree")
        if (size >= config.limit.download.premium && !m.isVIP) return m.reply("dlPremium")
        if (size >= config.limit.download.VIP) return m.reply("dlVIP")
        hisoka.sendMessage(m.from, b.dlink, { caption: title })
    },
    isLimit: true
}
