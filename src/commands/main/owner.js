export default {
    name: 'owner',
    aliases: ['develer'],
    type: 'main',
    execute: async({ hisoka, m, config }) => {
        let contacts = []
        for (const contact of config.options.owner) {
            contacts.push(await hisoka.getContactById(contact + '@c.us'))
        }
        
        m.reply(contacts)
    }
}
