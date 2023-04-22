export default {
    name: 'setprofile',
    aliases: ['setpp'],
    type: 'owner',
    desc: 'change profile pic number bot, for long profile %prefix%command <reply image>',
    execute: async({ hisoka, m, quoted }) => {
        let media = await quoted.downloadMedia()
        if (m.text.toLowerCase().endsWith('long')) {
            await hisoka.setProfilePic(hisoka.info.wid._serialized, media, 'long')
        } else {
            await hisoka.setProfilePic(hisoka.info.wid._serialized, media)
        }
    },
    isOwner: true,
    isMedia: {
        Image: true
    }
}