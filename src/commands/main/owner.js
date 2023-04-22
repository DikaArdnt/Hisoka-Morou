export default {
    name: 'owner',
    aliases: ['developer'],
    type: 'main',
    execute: async({ hisoka, m }) => {
        hisoka.sendContact(m.from, global.options.owner, { quotedMsg: m._serialized })
    }
}