export default {
    name: 'public',
    aliases: ['option', 'switch'],
    type: 'owner',
    desc: 'switch self or public acces bot',
    execute: ({ m, config }) => {
        if (config.options.public) {
            config.options.public = false
            m.reply('Switch Bot To Self Mode')
        } else {
            config.options.public = true
            m.reply('Switch Bot To Public Mode')
        }
    },
    isOwner: true
}