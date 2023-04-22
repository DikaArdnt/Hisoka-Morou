export default {
    name: 'sswa',
    aliases: ['listchat', 'listmsg'],
    type: 'owner',
    desc: "Screenshot homepage whatsapp web",
    execute: async({ hisoka, m }) => {
        await hisoka.pupPage.setViewport({ width: 961, height: 2000, devicePixelRatio: 2 })
        let media = await hisoka.pupPage.screenshot()
        await hisoka.sendMessage(m.from, media, { quoted: m })
        const session = await hisoka.pupPage.target().createCDPSession()
        const { windowId } = await session.send('Browser.getWindowForTarget')
        await session.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'minimized' } })
    },
    isOwner: true
}