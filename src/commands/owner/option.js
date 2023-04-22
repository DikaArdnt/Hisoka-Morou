export default {
    name: 'public',
    aliases: ['option', 'switch'],
    type: 'owner',
    desc: 'switch self or public acces bot',
    execute: ({ m }) => {
        if (global.options.public) {
            global.options.public = false
            m.reply('Switch Bot To Self Mode')
        } else {
            global.options.public = true
            m.reply('Switch Bot To Public Mode')
        }
    },
    isOwner: true
}