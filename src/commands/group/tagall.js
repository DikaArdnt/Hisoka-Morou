export default {
    name: "hidetag",
    aliases: ["ht","h","totag","tag"],
    type: 'group',
    desc: 'mentions all member',
    execute: async({ hisoka, m, quoted, prefix, command }) => {
        let mentions = m.metadata.participants.map(a => a.id._serialized)
        let text = (quoted.hasMedia && (await quoted.reload())?._data?.caption) ? (/hidetag|tag|ht|h|totag/i.test(quoted.body.toLowerCase()) ? quoted.body.toLowerCase().replace(prefix + command, '') : quoted.body) : (/hidetag|tag|ht|h|totag/i.test(quoted.body.toLowerCase()) ? quoted.body.toLowerCase().replace(prefix + command, '') : quoted.body)
        hisoka.forwardMessage(m.from, quoted._serialized, { mentions, text })
    },
    isGroup: true,
    isAdmin: true
}