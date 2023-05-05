export default {
    name: 'owner',
    aliases: ['develer'],
    type: 'main',
    execute: async({ hisoka, m }) => {
        let contacts = []
        for (const contact of global.owner) {
            contacts.push(await hisoka.getContactById(contact + '@c.us'))
        }
        
        m.reply(contacts)
    }
}
