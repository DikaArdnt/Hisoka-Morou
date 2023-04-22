export default {
    name: 'restrict',
    aliases: ['editinfo', 'editinfogroup', 'editinfogc'],
    type: 'group',
    desc: 'edit info group, only admin or all member',
    execute: async({ m }) => {
        let group = await m.getChat()
        if (m.metadata.restrict) return await group.setInfoAdminsOnly(false)
        await group.setInfoAdminsOnly(true)
    },
    isGroup: true,
    isAdmin: true,
    isBotAdmin: true
}