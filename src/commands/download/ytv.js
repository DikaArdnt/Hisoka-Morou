export default {
    name: "ytmp4",
    aliases: ["ytvideo", "ytv"],
    type: 'download',
    desc: "Download Youtube Video",
    example: "No Urls!\n\nExample : %prefix%command https://www.youtube.com/watch?v=5ytnKggHwvY",
    execute: async({ hisoka, m }) => {
        mess("wait", m)
        let request = await (new api('xzn')).get('/api/y2mate', { url: Func.isUrl(m.body)[0] })
        if (request.data?.err) return mess('error', m)
        let { id: vid, title, links } = request.data
        let a = links.video[Object.keys(links.video)[0]]
        let b = await Func.fetchJson(a.url)
        let { size, data } = await Func.getFile(b.dlink)
        if (size >= limit.download.free && !m.isPremium) return mess("dlFree", m, { extra: `, please download manually ${b.dlink}` })
        if (size >= limit.download.premium && !m.isVIP) return mess("dlPremium", m, { extra: `, please download manually ${b.dlink}` })
        if (size >= limit.download.VIP) return mess("dlVIP", m, { extra: `, please download manually ${b.dlink}` })
        hisoka.sendMessage(m.from, b.dlink, { caption: title })
    },
    isLimit: true
}
