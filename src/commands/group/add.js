export default {
    name: 'add',
    aliases: ['+'],
    type: 'group',
    desc: 'add participants to group',
    execute: async({ hisoka, m }) => {
        let users = m.text.split`,`.map(a => (a.replace(/[^0-9]/g, '')).replace(/\D/g, '') + '@c.us')
        if (users.length == 0) return m.reply('No Query')
        let chat = await m.getChat()
        await chat.addParticipants(users)
    },
    isGroup: true,
    isAdmin: true,
    isBotAdmin: true
}