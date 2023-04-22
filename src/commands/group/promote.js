export default {
    name: 'promote',
    aliases: ['admin'],
    type: 'group',
    desc: 'promote participants to group',
    execute: async({ m }) => {
        let users = m.mentions.length !== 0 ? m.mentions.filter((_, index) => index < 3) : m.hasQuotedMsg ? [m.quoted.sender] : m.text.split`,`.map(v => v.replace(/[^0-9]/g, '') + "@c.us").filter((_, index) => index < 3)
        if (users.length == 0) return m.reply('No Query')
        let chat = await m.getChat()
        await chat.promoteParticipants(users)
    },
    isGroup: true,
    isAdmin: true,
    isBotAdmin: true
}