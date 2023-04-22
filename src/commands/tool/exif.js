import webp from "node-webpmux"


export default {
    name: "exif",
    aliases: ["getexif"],
    type: 'tool',
    desc: "Get Metadata Sticker",
    execute: async({ m, quoted }) => {
        let img = new webp.Image()
        let media = await quoted.downloadMedia()
        await img.load(media)
        m.reply(Func.Format(JSON.parse(img.exif.slice(22).toString())))
    },
    isMedia: {
        Sticker: true
    }
}