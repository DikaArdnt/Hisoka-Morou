export default {
    name: 'subject',
    aliases: ['setsubject', 'set-subject'],
    type: 'group',
    desc: 'change subject group',
    example: 'Ghost?\n\nExample : %prefix%command Hisoka Morrou',
    execute: async({ m }) => {
        let text = m.hasQuotedMsg && !m.text ? m.quoted.body : m.text
        let chat = await m.getChat()
        await chat.setSubject(text)
    },
    isGroup: true,
    isAdmin: true,
    isBotAdmin: true
}