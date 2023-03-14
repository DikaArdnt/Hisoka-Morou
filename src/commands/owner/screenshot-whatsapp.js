module.exports = {
    name: 'sswa',
    aliases: ['listchat', 'listmsg'],
    desc: "Screenshot homepage whatsapp web",
    execute: async({ hisoka, m }) => {
        await hisoka.pupPage.setViewport({ width: 961, height: 2000 })
        let media = await hisoka.pupPage.screenshot()
        hisoka.sendMessage(m.from, media, { quoted: m })
    },
    isOwner: true
}