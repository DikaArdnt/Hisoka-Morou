export default {
    name: 'ouo',
    type: 'tool',
    desc: 'shortlink from https://ouo.io',
    example: 'No Urls!?\n\nExample : %prefix%command https://ouo.io/yourlink',
    execute: async({ m }) => {
        const data = (new api('sinon')).get('/api/shortlink/ouo', {
            url: Func.isUrl(m.body)[0]
        }, 'apikey')

        if (data.status !== 200) return mess('error', m)
        m.reply(data.data.result)
    },
    isLimit: true
}
