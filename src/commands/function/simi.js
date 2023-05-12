export default async function({ m }) {
    if (m.isGroup && !global.db.users[m.from].simi) return
    let text = await (new api('xzn')).get('/api/simi', { text: m.body })
    if (text.status !== 200) return m.reply('Sorry, I do not understand')
    m.reply(text.data.result)
}