import axios from 'axios'


export default {
    name: 'removebg',
    aliases: ['rembg', 'nobg'],
    type: 'tool',
    desc: 'remove background image',
    execute: async({ hisoka, m, quoted }) => {
        let media = await quoted.downloadMedia()
        let image = await removeBG(media)
        hisoka.sendMessage(m.from, image, { quoted: m })
    },
    isMedia: {
        Image: true
    }
}


function removeBG(buffer) {
    return new Promise(async (resolve, reject) => {
        let file = await Func.getFile(buffer)
        const { data } = await axios.post(`https://bgremover.zyro.com/v1/ai/background-remover`, { "image_data": `data:image/jpeg;base64,${file.data.toString("base64")}` })
        resolve(Buffer.from(data.result.split`,`[1], "base64"))
    })
}
