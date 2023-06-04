import sharp from "sharp"
import axios from "axios"


export default {
    name: "sticker",
    aliases: ["s","stiker"],
    type: 'convert',
    desc: "Convert Image, Gif, Video, and Url media to Sticker\n\nWith Options?\n1. --circle\n2. --round\n3. --gray\n3. --negate\n4. --pixel\n5. --flip\n6. --flop\n7. --rotate\n8. --nobg\n\nExample :\n1. --circle : %prefix%command --circle\n2. --rotate : %prefix%command --rotate=20 (max 360)",
    execute: async({ hisoka, m, quoted, config }) => {
        m.reply("wait")
        if (/image|video|sticker/.test(quoted.mime)) {
            if (quoted?.duration > 10) return m.reply(`Max video 9 second`)
            let download = await hisoka.downloadMediaMessage(quoted)
            let media, exif = {}
            if (m.text.toLowerCase().endsWith("circle")) {
                media = await crop(download, "circle")
            } else if (m.text.toLowerCase().endsWith("round")) {
                media = await crop(download, "rounded")
            } else if (m.text.toLowerCase().endsWith("gray")) {
                media = await processImage(download, "grayscale")
            } else if (m.text.toLowerCase().endsWith("negate")) {
                media = await processImage(download, "negate")
            } else if (m.text.toLowerCase().endsWith("pixel")) {
                media = await processImage(download, "pixelate")
            } else if (m.text.toLowerCase().endsWith("flip")) {
                media = await rotate(download, "flip")
            } else if (m.text.toLowerCase().endsWith("flop")) {
                media = await rotate(download, "flop")
            } else if (m.text.toLowerCase().endsWith("nobg")) {
                media = await removeBG(download)
            } else if (/rotate=/i.test(m.text.toLowerCase())) {
                let text = m.text.toLowerCase().split`rotate=`[1]
                if (isNaN(text) && !Number(text)) return m.reply(`Value harus berupa angka`)
                exif = { packName: config.Exif.packName }
                media = await rotate(download, Number(text))
            } else { 
                let [packname, author] = m.text.split`|`
                exif = { packName: packname ? packname : config.Exif.packName, packPublish: author ? author : config.Exif.packPublish } 
                media = download
            }
            hisoka.sendMessage(m.from, media, { asSticker: true, quoted: m, ...exif })
        } else if (m.mentions.length != 0) {
            let url
            for (let a = 0; a < (m.mentions.length < 4 ? m.mentions.length : 4); a++) {
                url = await hisoka.getProfilePicUrl(m.mentions[a]).then(_ => _).catch(_ => 'https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu') 
            }
            hisoka.sendMessage(m.from, url, { asSticker: true, quoted: m, packName: config.Exif.packName, packPublish: config.Exif.packPublish })
        } else if (/(https?:\/\/.*\.(?:png|jpg|jpeg|webp|mov|mp4|webm))/i.test(m.text)) {
            hisoka.sendMessage(m.from, Func.isUrl(m.text)[0], { quoted: m, asSticker: true, packName: config.Exif.packName, packPublish: config.Exif.packPublish })
        } else {
            m.reply(`Reply media or send command with url media`)
        }
    }
}



function crop(input, type = 'circle') {
    return new Promise(async (resolve, reject) => {
        sharp(input)
        .toFormat('webp')
        .resize(512, 512)
        .composite([{
            input: (type == 'circle') ? new Buffer.from('<svg height="485" width="485"><circle cx="242.5" cy="242.5" r="242.5" fill="#3a4458"/></svg>') : (type == "rounded") ? new Buffer.from('<svg><rect x="0" y="0" width="450" height="450" rx="50" ry="50"/></svg>') : false,
            blend: 'dest-in',
            cutout: true
        }])
        .toBuffer()
        .then(resolve)
        .catch(reject)
    })
}

async function processImage(input, type = "pixelate") {
    input = (type == "pixelate") ? await sharp(input).resize(20, null, { kernel: 'nearest' }).toBuffer() : input
    return new Promise(async (resolve, reject) => {
        sharp(input)
        .negate(type === 'negate')
        .greyscale(type === "grayscale")
        .resize(512, 512, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toColourspace(Func.random(["b-w", "b-w", "cmyk", "srgb"]))
        .toFormat("webp")
        .toBuffer()
        .then(resolve)
        .catch(reject)
    })
}

function rotate(input, type = "flip") {
    return new Promise(async (resolve, reject) => {
        if (!isNaN(type) && deg > 360) reject(`max degress is 360`)
        sharp(input)
        .flip(type == "flip")
        .flop(type == "flop")
        .rotate(/fl(o|i)p/i.test(type) ? 0 : parseInt(type))
        .toFormat("webp")
        .toBuffer()
        .then(resolve)
        .catch(reject)
    })
}

function removeBG(buffer) {
    return new Promise(async (resolve, reject) => {
        let file = await Func.getFile(buffer)
        const { data } = await axios.post(`https://bgremover.zyro.com/v1/ai/background-remover`, { "image_data": `data:image/jpeg;base64,${file.data.toString("base64")}` })
        resolve(Buffer.from(data.result.split`,`[1], "base64"))
    })
}