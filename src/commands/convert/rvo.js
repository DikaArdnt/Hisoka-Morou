export default {
    name: 'rvo',
    aliases: ['readviewonce', 'read-view-once'],
    type: 'convert',
    desc: 'convert view once to media',
    execute: async({ hisoka, m, quoted }) => {
        let a = await quoted.downloadMedia()
        hisoka.sendMessage(m.from, a, { quoted: m, caption: quoted?.caption ? quoted.caption : '' })
    },
    isMedia: {
        ViewOnce: true
    }
}