export default {
    name: 'seticon',
    aliases: ['setikon', 'setppgc', 'setppgroup'],
    type: 'group',
    desc: 'change profile pic group, for long profile %prefix%command <reply image>',
    execute: async({ hisoka, m, quoted }) => {
        let group = await m.getChat()
        let media = await quoted.downloadMedia()
        if (m.text.toLowerCase().endsWith('long')) {
            await hisoka.setProfilePic(m.from, media, 'long')
        } else {
            await hisoka.setProfilePic(m.from, media)
        }
    },
    isGroup: true,
    isAdmin: true,
    isBotAdmin: true,
    isMedia: {
        Image: true
    }
}