module.exports = {
    name: "sticker",
    aliases: ["s","stiker"],
    desc: "Convert Image, Gif, Video, and Url media to Sticker",
    execute: async({ hisoka, m, prefix, command, quoted }) => {
        mess("wait", m)
        if (/image|video|sticker/.test(quoted.mime)) {
            if (quoted?.duration > 10) return m.reply(`Max video 9 second`)
            let media = await hisoka.downloadMediaMessage(quoted)
            let [packname, author] = m.text.split`|`
            hisoka.sendMessage(m.from, media, { asSticker: true, quoted: m, packName: packname ? packname : global.Exif.packName, packPublish: author ? author : global.Exif.packPublish })
        } else if (m.mentions.length != 0) {
            let url
            for (let a = 0; a < (m.mentions.length < 4 ? m.mentions.length : 4); a++) {
                url = await hisoka.getProfilePicUrl(m.mentions[a]).then(_ => _).catch(_ => 'https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu') 
            }
            hisoka.sendMessage(m.from, url, { asSticker: true, quoted: m, packName: global.Exif.packName, packPublish: global.Exif.packPublish })
        } else if (/(https?:\/\/.*\.(?:png|jpg|jpeg|webp|mov|mp4|webm))/i.test(m.text)) {
            hisoka.sendMessage(m.from, Func.isUrl(m.text)[0], { quoted: m, asSticker: true, packName: global.Exif.packName, packPublish: global.Exif.packPublish })
        } else {
            m.reply(`Reply media or send command with url media`)
        }
    }
}
