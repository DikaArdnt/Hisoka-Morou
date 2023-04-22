export default {
    name: 'announ',
    aliases: ['onlyadmin', 'onlyadmins', 'announce'],
    type: 'group',
    desc: 'open and close group',
    execute: async({ m }) => {
        let group = await m.getChat()
        if (m.metadata.announce) return await group.setMessagesAdminsOnly(false)
        await group.setMessagesAdminsOnly(true)
    },
    isGroup: true,
    isAdmin: true,
    isBotAdmin: true
}