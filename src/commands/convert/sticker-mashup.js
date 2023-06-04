export default {
    name: "emojimix",
    aliases: ["emojimashup"],
    type: 'convert',
    desc: "Combine 2 Emoji",
    example: "Example : %prefix%command 😎+😾 or %prefix%command 😎",
    execute: async({ hisoka, m }) => {
        m.reply("wait")
        let [emoji1, emoji2] = m.text.split`+` || m.text.split`,` || m.text.split`|`
        let fetch = await Func.fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${emoji1 ? encodeURIComponent(emoji1) : ""}${emoji2 ? "_" : ""}${emoji2 ? encodeURIComponent(emoji2) : ""}`)
        for (let url of fetch.results) {
            hisoka.sendMessage(m.from, url.url, { asSticker: true, emojis: url.tags })
        }
    }
}