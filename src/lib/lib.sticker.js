/**
   * Create By Mhankbarbar
   * Contact -
   * Follow https://github.com/MhankBarBar
*/

const fs = require('fs')
const { tmpdir } = require("os")
const Crypto = require("crypto")
const ff = require('fluent-ffmpeg')
const webp = require("node-webpmux")
const path = require("path")

async function imageToWebp (media) {

    const tmpFileOut = path.join(__dirname, "..", "..", "temp", `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(__dirname, "..", "..", "temp", `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`)

    fs.writeFileSync(tmpFileIn, media)

    await new Promise((resolve, reject) => {
        ff(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            //.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale=512:512:force_original_aspect_ratio=increase,fps=15,crop=512:512`]).toFormat('webp').save(tmpFileOut)
            .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
            ])
            .toFormat("webp")
            .save(tmpFileOut)
    })

    const buff = fs.readFileSync(tmpFileOut)
    fs.promises.unlink(tmpFileOut)
    fs.promises.unlink(tmpFileIn)
    return buff
}

async function videoToWebp (media) {

    const tmpFileOut = path.join(__dirname, "..", "..", "temp", `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(__dirname, "..", "..", "temp", `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`)

    fs.writeFileSync(tmpFileIn, media)

    await new Promise((resolve, reject) => {
        ff(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            //.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale=512:512:force_original_aspect_ratio=increase,fps=15,crop=512:512`]).toFormat('webp').save(tmpFileOut)
            .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                "-loop",
                "0",
                "-ss",
                "00:00:00",
                "-t",
                "00:00:10",
                "-preset",
                "default",
                "-an",
                "-vsync",
                "0"
            ])
            .toFormat("webp")
            .save(tmpFileOut)
    })

    const buff = fs.readFileSync(tmpFileOut)
    fs.promises.unlink(tmpFileOut)
    fs.promises.unlink(tmpFileIn)
    return buff
}

async function writeExifImg (media, metadata) {
    let wMedia = await imageToWebp(media)
    const tmpFileOut = path.join(__dirname, "..", "..", "temp", `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(__dirname, "..", "..", "temp", `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    fs.writeFileSync(tmpFileIn, wMedia)

    if (Object.keys(metadata).length != 0 || Object.keys(global?.Exif).length != 0) {
        const img = new webp.Image()
        let opt = { packId: metadata?.packId ? metadata.packId : global?.Exif?.packId, packName: metadata?.packName ? metadata.packName : global?.Exif?.packName, packPublish: metadata?.packPublish ? metadata.packPublish : global?.Exif?.packPublish, packEmail: metadata?.packEmail ? metadata.packEmail : global?.Exif?.packEmail, packWebsite: metadata?.packWebsite ? metadata.packWebsite : global?.Exif?.packWebsite, androidApp: metadata?.androidApp ? metadata.androidApp : global?.Exif?.androidApp, iOSApp: metadata?.iOSApp ? metadata.iOSApp : global?.Exif?.iOSApp, emojis: metadata?.emojis ? metadata.emojis : global?.Exif?.emojis, isAvatar: metadata?.isAvatar ? metadata.isAvatar : global?.Exif?.isAvatar   }
        const json = { "sticker-pack-id": opt.packId, "sticker-pack-name": opt.packName, "sticker-pack-publisher": opt.packPublish, "sticker-pack-publisher-email": opt.packEmail, "sticker-pack-publisher-website": opt.packWebsite, "android-app-store-link": opt.androidApp, "ios-app-store-link": opt.iOSApp, "emojis": opt.emojis, "is-avatar-sticker": opt.isAvatar }
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuff])
        exif.writeUIntLE(jsonBuff.length, 14, 4)
        await img.load(tmpFileIn)
        fs.promises.unlink(tmpFileIn)
        img.exif = exif
        await img.save(tmpFileOut)
        return tmpFileOut
    }
}

async function writeExifVid (media, metadata) {
    let wMedia = await videoToWebp(media)
    const tmpFileOut = path.join(__dirname, "..", "..", "temp", `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(__dirname, "..", "..", "temp", `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    fs.writeFileSync(tmpFileIn, wMedia)

    if (Object.keys(metadata).length != 0 || Object.keys(global?.Exif).length != 0) {
        const img = new webp.Image()
        let opt = { packId: metadata?.packId ? metadata.packId : global?.Exif?.packId, packName: metadata?.packName ? metadata.packName : global?.Exif?.packName, packPublish: metadata?.packPublish ? metadata.packPublish : global?.Exif?.packPublish, packEmail: metadata?.packEmail ? metadata.packEmail : global?.Exif?.packEmail, packWebsite: metadata?.packWebsite ? metadata.packWebsite : global?.Exif?.packWebsite, androidApp: metadata?.androidApp ? metadata.androidApp : global?.Exif?.androidApp, iOSApp: metadata?.iOSApp ? metadata.iOSApp : global?.Exif?.iOSApp, emojis: metadata?.emojis ? metadata.emojis : global?.Exif?.emojis, isAvatar: metadata?.isAvatar ? metadata.isAvatar : global?.Exif?.isAvatar   }
        const json = { "sticker-pack-id": opt.packId, "sticker-pack-name": opt.packName, "sticker-pack-publisher": opt.packPublish, "sticker-pack-publisher-email": opt.packEmail, "sticker-pack-publisher-website": opt.packWebsite, "android-app-store-link": opt.androidApp, "ios-app-store-link": opt.iOSApp, "emojis": opt.emojis, "is-avatar-sticker": opt.isAvatar }
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuff])
        exif.writeUIntLE(jsonBuff.length, 14, 4)
        await img.load(tmpFileIn)
        fs.promises.unlink(tmpFileIn)
        img.exif = exif
        await img.save(tmpFileOut)
        return tmpFileOut
    }
}

async function writeExif (media, metadata) {
    let wMedia = /webp/.test(media.mimetype) ? media.data : /image/.test(media.mimetype) ? await imageToWebp(media.data) : /video/.test(media.mimetype) ? await videoToWebp(media.data) : ""
    const tmpFileOut = path.join(__dirname, "..", "..", "temp", `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(__dirname, "..", "..", "temp", `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    fs.writeFileSync(tmpFileIn, wMedia)
    if (Object.keys(metadata).length != 0 || Object.keys(global?.Exif).length != 0) {
        const img = new webp.Image()
        let opt = { packId: metadata?.packId ? metadata.packId : global?.Exif?.packId, packName: metadata?.packName ? metadata.packName : global?.Exif?.packName, packPublish: metadata?.packPublish ? metadata.packPublish : global?.Exif?.packPublish, packEmail: metadata?.packEmail ? metadata.packEmail : global?.Exif?.packEmail, packWebsite: metadata?.packWebsite ? metadata.packWebsite : global?.Exif?.packWebsite, androidApp: metadata?.androidApp ? metadata.androidApp : global?.Exif?.androidApp, iOSApp: metadata?.iOSApp ? metadata.iOSApp : global?.Exif?.iOSApp, emojis: metadata?.emojis ? metadata.emojis : global?.Exif?.emojis, isAvatar: metadata?.isAvatar ? metadata.isAvatar : global?.Exif?.isAvatar   }
        const json = { "sticker-pack-id": opt.packId, "sticker-pack-name": opt.packName, "sticker-pack-publisher": opt.packPublish, "sticker-pack-publisher-email": opt.packEmail, "sticker-pack-publisher-website": opt.packWebsite, "android-app-store-link": opt.androidApp, "ios-app-store-link": opt.iOSApp, "emojis": opt.emojis, "is-avatar-sticker": opt.isAvatar }
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuff])
        exif.writeUIntLE(jsonBuff.length, 14, 4)
        await img.load(tmpFileIn)
        fs.promises.unlink(tmpFileIn)
        img.exif = exif
        await img.save(tmpFileOut)
        return tmpFileOut
    }
}

module.exports = { imageToWebp, videoToWebp, writeExifImg, writeExifVid, writeExif }