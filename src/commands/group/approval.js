export default {
    name: 'approval',
    aliases: ['approve'],
    type: 'group',
    desc: 'edit approval mode group, Approve new members by admin',
    execute: async({ m }) => {
        let group = await m.getChat()
        if (m.metadata.membershipApprovalMode) return await group.setMemberApprovalMode(false)
        await group.setMemberApprovalMode(true)
    },
    isGroup: true,
    isAdmin: true,
    isBotAdmin: true
}