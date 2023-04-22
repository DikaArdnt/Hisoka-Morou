export default {
    name: 'quoted',
    aliases: ['q', 'get-quoted', 'getquoted'],
    type: 'main',
    desc: 'get quoted message',
    execute: async({ hisoka, m }) => {
        let message = await hisoka.loadMessage(m.quoted._serialized)
        if (!message.quoted) {
            if (message.id.remote === 'status@broadcast') {
                if (message.isMedia) {
                    let download = await hisoka.downloadMediaMessage(message)
                    return hisoka.sendMessage(m.from, download, { caption: message.body.length < 200 ? message.body : '' })
                } else {
                    return m.reply(message.body)
                }
            } else {
                return hisoka.forwardMessage(message.from, message._serialized)
            }
        }
        await hisoka.forwardMessage(message.quoted?.from, message.quoted?._serialized)
    },
    isQuoted: true
}