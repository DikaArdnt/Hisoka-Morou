const axios = require("axios")
const cheerio = require("cheerio")
const fs = require("fs")
const FileType = require("file-type")
const path = require("path")
const stream = require("stream")
const depen = require("../../package.json")

class Function {
    constructor() {
        for (const a in depen?.dependencies) {
            this[a] = require(a)
        }
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
        return this?.util?.format(str, ...options)
    }

    tanggal(numer, timeZone = "Asia/Jakarta") {
        const myMonths = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
        const myDays = ['Minggu','Senin','Selasa','Rabu','Kamis','Jum’at','Sabtu'];
        var tgl = new Date(numer);
        tgl.toLocaleString("en", { timeZone })
        var day = tgl.getDate()
        var bulan = tgl.getMonth()
        var thisDay = tgl.getDay(),
        thisDay = myDays[thisDay];
        var yy = tgl.getYear()
        var year = (yy < 1000) ? yy + 1900 : yy;
        let d = new Date().toLocaleString("en", { timeZone });
        d.toLocaleString("en", { timeZone })
        let locale = 'id'
        let gmt = new Date(0).getTime() - new Date('1 January 1970').getTime()
        let weton = ['Pahing', 'Pon','Wage','Kliwon','Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]

        return `${thisDay}, ${day} ${myMonths[bulan]} ${year}`
    }

    async getFile(PATH, save) {
        let filename
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await this.fetchBuffer(PATH) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        filename = path.join(__dirname, "..", "..", 'temp', new Date * 1 + "." + type.ext)
        if (data && save) fs.promises.writeFile(filename, data)
        let size = Buffer.byteLength(data)
        return {
            filename,
	        size,
            sizeH: this.formatSize(size),
            ...type,
            data
        }
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

    isReadableStream(obj) {
        return obj instanceof stream.Stream && 
        typeof (obj._read == "function") &&
        typeof (obj._readableState === "object")
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
        if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
        else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
        else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB"; }
        else if (bytes > 1)           { bytes = bytes + " bytes"; }
        else if (bytes == 1)          { bytes = bytes + " byte"; }
        else                          { bytes = "0 bytes"; }
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
            ratings.push({target: currentTargetString, rating: currentRating})
            if (currentRating > ratings[bestMatchIndex].rating) {
                bestMatchIndex = i
            }
        }

        const bestMatch = ratings[bestMatchIndex]
	
	    return { all: ratings, indexAll: bestMatchIndex, result: bestMatch.target, rating: bestMatch.rating };
    }
}

exports.Function = new Function()