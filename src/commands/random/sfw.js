const regex = /(waifu|neko|shinobu|megumin)/i


export default {
    name: 'sfw',
    type: 'search',
    desc: 'search random image',
    execute: async({ hisoka, m }) => {
        let search = regex.test(m.args[0]) ? m.args[0].match(regex)[0] : 'waifu'
        let res = await (new api('xzn')).get('/api/sfw', { search }, '', { responseType: 'arraybuffer' })
        if (res.status !== 200) return mess('error', m)
        hisoka.sendFile(m.from, res.data, { quoted: m })
    }
}
