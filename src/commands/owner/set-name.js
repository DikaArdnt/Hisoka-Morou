export default {
    name: 'setname',
    type: 'owner',
    desc: 'change name bot',
    example: 'Ghost?\n\nExample : %prefix%command Hisoka Morrou',
    execute: async({ m }) => {
        let text = m.hasQuotedMsg && !m.text ? m.quoted.body : m.text
        await hisoka.setDisplayName(text)
    },
    isOwner: true
}