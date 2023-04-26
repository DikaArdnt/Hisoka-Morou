import axios from "axios"
import fs from "fs"
import { fileTypeFromBuffer } from "file-type"
import path from "path"
import stream from "stream"
import { createRequire } from "module"
import { fileURLToPath, pathToFileURL } from "url"
import { platform } from "os"
import moment from "moment-timezone"
import { format } from "util"
import sharp from "sharp"


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const depen = fs.readFileSync('./package.json').toString()


export default new class Function {
    constructor() {
        for (const a in depen?.dependencies) {
            this[a] = import(a)
        }
    }

    require(module, dir = import.meta) {
        const path = (dir).url || (dir)
        let require = createRequire(path)
        return require(module)
    }

    __filename(pathURL = import.meta, rmPrefix = platform() !== 'win32') {
        const path = (pathURL).url || (pathURL)
        return rmPrefix ?
            /file:\/\/\//.test(path) ?
                fileURLToPath(path) :
                path : /file:\/\/\//.test(path) ?
                path : pathToFileURL(path).href
    }

    __dirname(pathURL) {
        const dir = this.__filename(pathURL, true)
        const regex = /\/$/
        return regex.test(dir) ?
            dir : fs.existsSync(dir) && fs.statSync(dir).isDirectory ?
                dir.replace(regex, '') :
                path.dirname(dir)
    }

    async dirSize(directory) {
        const files = await fs.readdirSync(directory)
        const stats = files.map(file => fs.statSync(path.join(directory, file)))

        return (await Promise.all(stats)).reduce((accumulator, { size }) => accumulator + size, 0)
    }

    sleep(ms) {
        return new Promise(a => setTimeout(a, ms))
    }

    format(str) {
        return JSON.stringify(str, null, 2)
    }

    Format(str, options = {}) {
        return format(str)
    }

    jam(numer, options = {}) {
        let format = options.format ? options.format : "HH:mm"
        let jam = options?.timeZone ? moment(numer).tz(timeZone).format(format) : moment(numer).format(format)

        return `${jam}`
    }

    tanggal(numer, timeZone = '') {
        const myMonths = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum’at', 'Sabtu'];
        var tgl = new Date(numer);
        timeZone ? tgl.toLocaleString("en", { timeZone }) : ""
        var day = tgl.getDate()
        var bulan = tgl.getMonth()
        var thisDay = tgl.getDay(),
            thisDay = myDays[thisDay];
        var yy = tgl.getYear()
        var year = (yy < 1000) ? yy + 1900 : yy;
        let gmt = new Date(0).getTime() - new Date('1 January 1970').getTime()
        let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(((tgl * 1) + gmt) / 84600000) % 5]

        return `${thisDay}, ${day} ${myMonths[bulan]} ${year}`
    }

    async getFile(PATH, save) {
        try {
            let filename = 'Not Saved'
            let data
            if (/^https?:\/\//.test(PATH)) {
                data = await this.fetchBuffer(PATH)
            } else if (/^data:.*?\/.*?;base64,/i.test(PATH) || this.isBase64(PATH)) {
                data = Buffer.from(PATH.split`,`[1], 'base64')
            } else if (fs.existsSync(PATH) && (fs.statSync(PATH)).isFile()) {
                data = fs.readFileSync(PATH)
            } else if (Buffer.isBuffer(PATH)) {
                data = PATH
            } else {
                data = Buffer.alloc(20)
            }

            let type = await fileTypeFromBuffer(data) || {
                mime: 'application/octet-stream',
                ext: '.bin'
            }

            if (data && save) {
                filename = path.join(__dirname, "..", "..", 'temp', new Date * 1 + "." + type.ext)
                fs.promises.writeFile(filename, data)
            }
            let size = Buffer.byteLength(data)
            return {
                filename,
                size,
                sizeH: this.formatSize(size),
                ...type,
                data
            }
        } catch { }
    }

    async fetchJson(url, options = {}) {
        try {
            let data = await axios(url, {
                method: "get",
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
                    origin: url,
                    referer: url
                },
                responseType: 'json'
            })

            return data?.data
        } catch (e) {
            return e
        }
    }

    fetchBuffer(string, options = {}) {
        return new Promise(async (resolve, reject) => {
            if (this.isUrl(string)) {
                let buffer = await axios({
                    url: string,
                    method: "GET",
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
                        'Referer': string
                    },
                    responseType: 'arraybuffer',
                    ...options
                })

                resolve(buffer.data)
            } else if (Buffer.isBuffer(string)) {
                resolve(string)
            } else if (/^data:.*?\/.*?;base64,/i.test(string)) {
                let buffer = Buffer.from(string.split`,`[1], 'base64')
                resolve(buffer)
            } else {
                let buffer = fs.readFileSync(string)
                resolve(buffer)
            }
        })
    }

    isUrl(url) {
        //url = url.replace(/ /g, '%20')
        return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'gi'))
    }

    random(list) {
        return list[Math.floor(Math.random() * list.length)]
    }

    randomInt(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    getRandom(ext = "", length = "10") {
        var result = ""
        var character = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
        var characterLength = character.length
        for (var i = 0; i < length; i++) {
            result += character.charAt(Math.floor(Math.random() * characterLength))
        }

        return `${result}${ext ? `.${ext}` : ""}`
    }

    async reloadCommand(file, dirname = 'commands') {
        const { readCommands } = (await import('../event/event.message.js'))
        file = (file).url || (file)
        let fileP = fileURLToPath(file)
        fs.watchFile(fileP, () => {
            fs.unwatchFile(fileP)
            if (/commands/g.test(fileP)) readCommands(dirname, file)
            console.log(`Update Command "${fileP}"`)
            import(`${file}?update=${Date.now()}`)
        })
    }

    isReadableStream(obj) {
        return obj instanceof stream.Stream &&
            typeof (obj._read == "function") &&
            typeof (obj._readableState === "object")
    }

    isBase64(string) {
        const regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
        return regex.test(string)
    }

    bufferToStream(buffer) {
        let buff = Buffer.isBuffer(buffer) ? buffer : Buffer.alloc()
        return new stream.Readable({
            read() {
                this.push(buff)
                this.push(null)
            }
        })
    }

    bufferToBase64(buffer) {
        if (!Buffer.isBuffer(buffer)) throw new Error("Buffer Not Detected")

        var buf = new Buffer(buffer)
        return buf.toString('base64')
    }

    base64ToBuffer(base) {
        return Buffer.from(base, 'base64')
    }

    streamToBuffer(strea) {
        let buff = Buffer.alloc(0)
        for (const chunk of strea) {
            buff = Buffer.concat([buff, chunk])
        }
        strea.destroy()
        return buff
    }

    formatSize(bytes) {
        if (bytes >= 1000000000) { bytes = (bytes / 1000000000).toFixed(2) + " GB"; }
        else if (bytes >= 1000000) { bytes = (bytes / 1000000).toFixed(2) + " MB"; }
        else if (bytes >= 1000) { bytes = (bytes / 1000).toFixed(2) + " KB"; }
        else if (bytes > 1) { bytes = bytes + " bytes"; }
        else if (bytes == 1) { bytes = bytes + " byte"; }
        else { bytes = "0 bytes"; }
        return bytes;
    }

    runtime(seconds) {
        seconds = Number(seconds)
        var d = Math.floor(seconds / (3600 * 24))
        var h = Math.floor(seconds % (3600 * 24) / 3600)
        var m = Math.floor(seconds % 3600 / 60)
        var s = Math.floor(seconds % 60)
        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : ""
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : ""
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""
        return dDisplay + hDisplay + mDisplay + sDisplay
    }

    async resizeImage(buffer, height) {
        buffer = (await this.getFile(buffer)).data
        /**
         * @param {Sharp} img
         * @param {number} maxSize
         * @return {Promise<Sharp>}
         */
        const resizeByMax = async (img, maxSize) => {
            const metadata = await img.metadata();
            const outputRatio = maxSize / Math.max(metadata.height, metadata.width);
            return img.resize(Math.floor(metadata.width * outputRatio), Math.floor(metadata.height * outputRatio));
        };

        const img = await sharp(buffer)

        return (await resizeByMax(img, height)).toFormat('jpg').toBuffer()
    }


    async correct(mainString, targetStrings) {
        function compareTwoStrings(first, second) {
            first = first.replace(/\s+/g, '')
            second = second.replace(/\s+/g, '')

            if (first === second) return 1; // identical or empty
            if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

            let firstBigrams = new Map();
            for (let i = 0; i < first.length - 1; i++) {
                const bigram = first.substring(i, i + 2);
                const count = firstBigrams.has(bigram)
                    ? firstBigrams.get(bigram) + 1
                    : 1;

                firstBigrams.set(bigram, count);
            };

            let intersectionSize = 0;
            for (let i = 0; i < second.length - 1; i++) {
                const bigram = second.substring(i, i + 2);
                const count = firstBigrams.has(bigram)
                    ? firstBigrams.get(bigram)
                    : 0;

                if (count > 0) {
                    firstBigrams.set(bigram, count - 1);
                    intersectionSize++;
                }
            }

            return (2.0 * intersectionSize) / (first.length + second.length - 2);
        }

        targetStrings = Array.isArray(targetStrings) ? targetStrings : []

        const ratings = [];
        let bestMatchIndex = 0;

        for (let i = 0; i < targetStrings.length; i++) {
            const currentTargetString = targetStrings[i];
            const currentRating = compareTwoStrings(mainString, currentTargetString)
            ratings.push({ target: currentTargetString, rating: currentRating })
            if (currentRating > ratings[bestMatchIndex].rating) {
                bestMatchIndex = i
            }
        }

        const bestMatch = ratings[bestMatchIndex]

        return { all: ratings, indexAll: bestMatchIndex, result: bestMatch.target, rating: bestMatch.rating };
    }
}


let fileP = fileURLToPath(import.meta.url)
fs.watchFile(fileP, () => {
    fs.unwatchFile(fileP)
    console.log(`Update File "${fileP}"`)
    import(`${import.meta.url}?update=${Date.now()}`)
})