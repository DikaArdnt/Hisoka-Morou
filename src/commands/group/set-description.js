export default {
    name: 'description',
    aliases: ['desc', 'set-description', 'setdesc', 'set-desc'],
    type: 'group',
    desc: 'change description group',
    example: 'Ghost?\n\nExample : %prefix%command Hisoka Morrou',
    execute: async({ m }) => {
        let text = m.hasQuotedMsg && !m.text ? m.quoted.body : m.text
        let chat = await m.getChat()
        await chat.setDescription(text)
    },
    isGroup: true,
    isAdmin: true,
    isBotAdmin: true
}