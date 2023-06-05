import axios from "axios"
import cheerio from "cheerio"
import BodyForm from "form-data"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { spawn } from "child_process"


const webp2mp4File = (source) => {
	return new Promise((resolve, reject) => {
		 const form = new BodyForm()
		 let isUrl = typeof source === 'string' && /https?:\/\//.test(source)
		 form.append('new-image-url', isUrl ? source : "")
		 form.append('new-image', isUrl ? "" : source, "image.webp")
		 axios({
			  method: 'post',
			  url: 'https://s6.ezgif.com/webp-to-mp4',
			  data: form,
			  headers: {
				   'Content-Type': `multipart/form-data; boundary=${form._boundary}`
			  }
		 }).then(({ data }) => {
			  const bodyFormThen = new BodyForm()
			  const $ = cheerio.load(data)
			  const file = $('input[name="file"]').attr('value')
			  const token = $('input[name="token"]').attr('value')
			  const convert = $('input[name="file"]').attr('value')
			  const gotdata = {
				   file: file,
				   token: token,
				   convert: convert
			  }
			  bodyFormThen.append('file', gotdata.file)
			  bodyFormThen.append('convert', "Convert WebP to MP4!")
			  axios({
				   method: 'post',
				   url: 'https://ezgif.com/webp-to-mp4/' + gotdata.file,
				   data: bodyFormThen,
				   headers: {
						'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`
				   }
			  }).then(({ data }) => {
				   const $ = cheerio.load(data)
				   const result = 'https:' + $('div#output > p.outfile > video > source').attr('src')
				   resolve(result)
			  }).catch(reject)
		 }).catch(reject)
	})
}

const ffmpeg = (buffer, args = [], ext = '', ext2 = '') => {
	return new Promise(async (resolve, reject) => {
	  try {
		let tmp = path.join(process.cwd(), './temp', + new Date + '.' + ext)
		let out = tmp + '.' + ext2
		await fs.promises.writeFile(tmp, buffer)
		spawn('ffmpeg', [
		  '-y',
		  '-i', tmp,
		  ...args,
		  out
		])
		  .on('error', reject)
		  .on('close', async (code) => {
			try {
			  await fs.promises.unlink(tmp)
			  if (code !== 0) return reject(code)
			  resolve(await fs.promises.readFile(out))
			  await fs.promises.unlink(out)
			} catch (e) {
			  reject(e)
			}
		  })
	  } catch (e) {
		reject(e)
	  }
	})
  }

  
  /**
   * Convert Audio to Playable WhatsApp Audio
   * @param {Buffer} buffer Audio Buffer
   * @param {String} ext File Extension 
   */
const toAudio = async (buffer, ext) => {
	buffer = await Func.getFile(buffer)
	return ffmpeg(buffer.data, [
	  '-vn',
	  '-ac', '2',
	  '-b:a', '128k',
	  '-ar', '44100',
	  '-f', 'mp3'
	], ext, 'mp3')
  }
  

  /**
   * Convert Audio to Playable WhatsApp PTT
   * @param {Buffer} buffer Audio Buffer
   * @param {String} ext File Extension 
   */
const toPTT = (buffer, ext) => {
	return ffmpeg(buffer, [
	  '-vn',
	  '-c:a', 'libopus',
	  '-b:a', '128k',
	  '-vbr', 'on',
	  '-compression_level', '10'
	], ext, 'opus')
  }
  

  /**
   * Convert Audio to Playable WhatsApp Video
   * @param {Buffer} buffer Video Buffer
   * @param {String} ext File Extension 
   */
const toVideo = (buffer, ext) => {
	return ffmpeg(buffer, [
	  '-c:v', 'libx264',
	  '-c:a', 'aac',
	  '-ab', '128k',
	  '-ar', '44100',
	  '-crf', '32',
	  '-preset', 'slow'
	], ext, 'mp4')
  }


const sticker = (buffer, mime = "image/jpg", options = {}) => {
    return new Promise((resolve, reject) => {
        axios(`https://sticker-api.openwa.dev/${mime.startsWith("image") ? "prepareWebp" : "convertMp4BufferToWebpDataUrl"}`, {
            method: "POST",
            maxBodyLength: 20000000, // 20mb request file limit
            maxContentLength: 1500000, // 1.5mb response body limit
            headers: {
                Accept: "application/json, text/plain, /",
		"Content-Type": "application/json;charset=utf-8",
		"User-Agent": "WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            },
            data: JSON.stringify(Object.assign(options, { [`${mime.startsWith("image") ? "image" : "file"}`]: `data:${mime};base64,${buffer.toString("base64")}` }))
        }).then(({ data }) => {
             resolve(mime.startsWith("image") ? data.webpBase64 : data)
        })
    })
}

const TelegraPh = (Path) => {
	return new Promise (async (resolve, reject) => {
		if (!fs.existsSync(Path)) return reject(new Error("File not Found"))
		try {
			const form = new BodyForm();
			form.append("file", fs.createReadStream(Path))
			const data = await  axios({
				url: "https://telegra.ph/upload",
				method: "POST",
				headers: {
					...form.getHeaders()
				},
				data: form
			})
			return resolve("https://telegra.ph" + data.data[0].src)
		} catch (err) {
			return reject(new Error(String(err)))
		}
	})
}

const UploadFileUgu = (input) => {
	return new Promise (async (resolve, reject) => {
			const form = new BodyForm();
			form.append("files[]", fs.createReadStream(input))
			await axios({
				url: "https://uguu.se/upload.php",
				method: "POST",
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
					...form.getHeaders()
				},
				data: form
			}).then((data) => {
				resolve(data.data.files[0])
			}).catch((err) => reject(err))
	})
}


export { webp2mp4File, ffmpeg, toAudio, toPTT, toVideo, TelegraPh, UploadFileUgu, sticker }


let fileP = fileURLToPath(import.meta.url)
fs.watchFile(fileP, () => {
    fs.unwatchFile(fileP)
    console.log(`Update File "${fileP}"`)
    import(`${import.meta.url}?update=${Date.now()}`)
})