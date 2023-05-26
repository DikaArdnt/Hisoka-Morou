export default {
    name: 'sswa',
    aliases: ['listchat', 'listmsg'],
    type: 'owner',
    desc: "Screenshot homepage whatsapp web",
    execute: async({ hisoka, m }) => {
        await hisoka.pupPage.setViewportSize({ width:961, height: 2000 })
        let media = await hisoka.mPage.screenshot()
        await hisoka.sendMessage(m.from, media, { quoted: m })
    },
    isOwner: true
}