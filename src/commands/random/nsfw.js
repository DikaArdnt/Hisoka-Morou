const regex = /(waifu|neko)/i


export default {
    name: 'nsfw',
    type: 'random',
    desc: 'search random image',
    execute: async({ hisoka, m }) => {
        mess('wait', m)
        let search = regex.test(m.args[0]) ? m.args[0].match(regex)[0] : 'waifu'
        let res = await (new api('xzn')).get('/api/nsfw', { search }, '', { responseType: 'arraybuffer' })
        if (res.status !== 200) return mess('error', m)
        hisoka.sendFile(m.from, res.data, { quoted: m })
    }
}
