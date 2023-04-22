export default {
    name: 'revoke',
    type: 'group',
    desc: 'revoke invite group',
    execute: async({ m }) => {
        let chat = await m.getChat()
        await chat.revokeInvite()
    },
    isGroup: true,
    isAdmin: true,
    isBotAdmin: true
}