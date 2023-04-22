export default {
    name: 'invite',
    aliases: ['linkgrup', 'linkgroup','linkgc'],
    type: 'group',
    desc: 'revoke invite group',
    execute: async({ m }) => {
        let chat = await m.getChat()
        let code = await chat.getInviteCode()
        await m.reply(`Link Group ${m.metadata.subject} :\n\n https://chat.whatsapp.com/` + code, { linkPreview: true })
    },
    isGroup: true,
    isBotAdmin: true
}