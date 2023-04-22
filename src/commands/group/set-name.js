export default {
    name: 'setsubject',
    aliases: ['set-subject', 'subject'],
    type: 'group',
    desc: 'change name group',
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