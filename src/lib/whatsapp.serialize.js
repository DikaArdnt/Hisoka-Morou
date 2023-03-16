const { Client: _Client } = require("whatsapp-web.js")
const { Base, ClientInfo, Message, MessageMedia, Contact, Location, GroupNotification, Label, Call, Buttons, List, Reaction } = require("whatsapp-web.js/src/structures")
const Util = require("whatsapp-web.js/src/util/Util")
const { Function } = require("./lib.function")
const fs = require('fs')
const { extension } = require('mime-types')
const { join } = require("path")



class Client extends _Client {
    constructor(...args) {
        super(...args)
        this.user = {
            id: this?.info?.me?._serialized,
            ...this?.info
        }
    }


    /**
     * Send a message to a specific chatId
     * @param {string} chatId
     * @param {string|MessageMedia|Location|Contact|Array<Contact>|Buttons|List} content
     * @param {MessageSendOptions} [options] - Options used when sending the message
     * 
     * @returns {Promise<Message>} Message that was just sent
     */
    async sendMessage(chatId, content, options = {}) {
        let internalOptions = {
            linkPreview: options.linkPreview === false ? undefined : true,
            sendAudioAsVoice: options.ptt,
            sendVideoAsGif: options.gifPlayBack,
            sendMediaAsSticker: options.asSticker,
            sendMediaAsDocument: options.asDocument,
            caption: options.caption,
            quotedMessageId: options.quoted?.id ? (options.quoted._serialized || options.quoted.id._serialized) : options.quoted,
            parseVCards: options.parseVCards === false ? false : true,
            mentionedJidList: Array.isArray(options.mentions) ? options.mentions.map(contact => (contact?.id ? contact?.id?._serialized : contact)) : [],
            extraOptions: options.extra
        };

        const sendSeen = typeof options.sendSeen === 'undefined' ? true : options.sendSeen;

        if ((Buffer.isBuffer(content) || /^data:.*?\/.*?;base64,/i.test(content) || /^https?:\/\//i.test(content) || fs.existsSync(content))) {
            let media = await Function.getFile(content)
            let data, mime, pathFile
            if (options.asSticker && /webp/i.test(media.mime)) {
                let { writeExif } = require('./lib.sticker')
                pathFile = await writeExif({ mimetype: media.mime, data: media.data }, { packId: options?.packId ? options.packId : global?.Exif?.packId, packName: options?.packName ? options.packName : global?.Exif?.packName, packPublish: options?.packPublish ? options.packPublish : global?.Exif?.packPublish, packEmail: options?.packEmail ? options.packEmail : global?.Exif?.packEmail, packWebsite: options?.packWebsite ? options.packWebsite : global?.Exif?.packWebsite, androidApp: options?.androidApp ? options.androidApp : global?.Exif?.androidApp, iOSApp: options?.iOSApp ? options.iOSApp : global?.Exif?.iOSApp, emojis: options?.emojis ? options.emojis : global?.Exif?.emojis, isAvatar: options?.isAvatar ? options.isAvatar : global?.Exif?.isAvatar, ...options })
                data = fs.readFileSync(pathFile)
                mime = 'image/webp'
            } else {
                data = media.data
                mime = media.mime
            }
            internalOptions.attachment = { mimetype: (options.mimetype ? options.mimetype : mime), data: Function.bufferToBase64(data), filename: (options.fileName ? options.fileName : undefined), filesize: (options.fileSize ? options.fileSize : media.size), ...options }
            pathFile ? fs.unlinkSync(pathFile) : ''
            content = ''
        } else if (content instanceof MessageMedia) {
            internalOptions.attachment = content;
            content = '';
        } else if (options.media instanceof MessageMedia) {
            internalOptions.attachment = options.media;
            internalOptions.caption = content;
            content = '';
        } else if (content instanceof Location) {
            internalOptions.location = content;
            content = '';
        } else if (content instanceof Contact) {
            internalOptions.contactCard = (content.id ? content.id._serialized : content);
            content = '';
        } else if (Array.isArray(content) && content.length > 0 && content[0] instanceof Contact) {
            internalOptions.contactCardList = content.map(contact => (contact.id ? contact.id._serialized : contact));
            content = '';
        } else if (content instanceof Buttons) {
            if (content.type !== 'chat') { internalOptions.attachment = content.body; }
            internalOptions.buttons = content;
            content = '';
        } else if (content instanceof List) {
            internalOptions.list = content;
            content = '';
        }
        
        if (internalOptions.sendMediaAsSticker && internalOptions.attachment) {
            internalOptions.attachment = await Util.formatToWebpSticker(
                internalOptions.attachment, {
                    name: options.packName,
                    author: options.packPublish,
                    categories: options.categories || []
                }, this.pupPage
            );
        }

        const newMessage = await this.pupPage.evaluate(async (chatId, message, options, sendSeen) => {
            const chatWid = window.Store.WidFactory.createWid(chatId);
            const chat = await window.Store.Chat.find(chatWid);


            if (sendSeen) {
                window.WWebJS.sendSeen(chatId);
            }

            const msg = await window.WWebJS.sendMessage(chat, message, options, sendSeen);
            return msg.serialize();
        }, chatId, content, internalOptions, sendSeen);

        return new exports.serializeM(this, newMessage._data);
    }


    /**
     * Downloads and returns the attatched message media
     * @returns {Promise<MessageMedia>}
     */
    async downloadMediaMessage(message) {
        if (!message.isMedia) return

        const result = await this.pupPage.evaluate(async (msgId) => {
            const msg = window.Store.Msg.get(msgId);
            if (!msg) {
                return undefined;
            }
            if (msg.mediaData.mediaStage != 'RESOLVED') {
                // try to resolve media
                await msg.downloadMedia({
                    downloadEvenIfExpensive: true,
                    rmrReason: 1
                });
            }

            if (msg.mediaData.mediaStage.includes('ERROR') || msg.mediaData.mediaStage === 'FETCHING') {
                // media could not be downloaded
                return undefined;
            }

            try {
                const decryptedMedia = await (window.Store.DownloadManager.downloadAndMaybeDecrypt || window.Store.DownloadManager.downloadAndDecrypt)({
                    directPath: msg.directPath,
                    encFilehash: msg.encFilehash,
                    filehash: msg.filehash,
                    mediaKey: msg.mediaKey,
                    mediaKeyTimestamp: msg.mediaKeyTimestamp,
                    type: msg.type,
                    signal: (new AbortController).signal
                });

                const data = await window.WWebJS.arrayBufferToBase64Async(decryptedMedia);

                return {
                    data,
                    mimetype: msg.mimetype,
                    filename: msg.filename,
                    filesize: msg.size
                };
            } catch (e) {
                if(e.status && e.status === 404) return undefined;
                throw e;
            }
        }, (message._serialized || message.id._serialized));

        if (!result) return undefined;
        return Function.base64ToBuffer(result?.data)
    }

    /**
     * 
     * @param {*} message 
     * @param {*} filename 
     * @returns 
     */
    async downloadAndSaveMediaMessage(message, filename) {
        if (!message.isMedia) return

        filename = filename ? filename : Function.getRandom(extension(message?.mime || message._data.mimetype || message.mimetype))
        const buffer = await this.downloadMediaMessage(message)
        const filePath = join(__dirname, "..", "..", "temp", filename)
        await fs.promises.writeFile(filePath, buffer)

        return filePath
    }


    /**
     * 
     * @param {*} msgId 
     * @returns 
     */
    async loadMessage(msgId) {
        const msg = await this.pupPage.evaluate(async (msgId) => {
            let msg = window.Store.Msg.get(msgId)
            if (msg) return window.WWebJS.getMessageModel(msg)
            const param = msgId.split('_')
            if (param.length !== 3) throw new Error('Invalid Message ID')

            const chatId = param[1]
            const chat = window.Store.Chat.get(chatId)
            while (chat.msgs._models.find(m => m.id._serialized === msgId)) {
                await chat.loadEarlierMsgs()
            }
            msg = window.WWebJS.getMessageModel(msg)
            if (msg) return window.WWebJS.getMessageModel(msg)
        }, msgId)

        if (msg) return new Message(this, msg)
        return null
    }

    /**
     * 
     * @param {*} chatId 
     * @returns 
     */
    async clearMessage(chatId) {
        return this.pupPage.evaluate(chatId => {
            return window.WWebJS.sendClearChat(chatId)
        }, chatId)
    }

    /**
     * 
     * @param {*} text 
     * @returns 
     */
    parseMention(text) {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@c.us') || []
    }
}
exports.Client = Client


exports.serialize = async (hisoka, m) => {
    if (!m) return

    const msg = new exports.serializeM(hisoka, m._data)

    if (m.hasQuotedMsg) {
        let data = await m.getQuotedMessage() || {}
        msg.quoted = new exports.serializeM(hisoka, data._data)
    }

    return msg
}


class serializeM extends Base {
    constructor(hisoka, data) {
        super(hisoka)

        if (data) this._patch(data)
    }

    _patch(data) {
        if (data.id) {
            this.key = {
                remoteJid: data.id?.remote || data?.to,
                fromMe: data.id?.fromMe,
                id: data.id?.id,
                participant: (typeof (data.author) === 'object' && data.author !== null) ? data.author._serialized : data.author,
                _serialized: data.id?._serialized
            }
        }

        this.timestamps = data?.t

        this.pushName = data?.notifyName

        this.from = this.key?.remoteJid

        this.fromMe = this.key?.fromMe

        this.id = this.key?.id

        this.type = data.type

        this._serialized = this.key?._serialized

        this.isBot = (this.key?.id?.startsWith("3EB") && this.key?.id?.length === 20) || (this.key?.id?.startsWith("BAE5") && this.key?.id?.length === 16) || false

        this.isGroup = this.from.endsWith('g.us')

        this.participant = this.key?.participant

        this.sender = ((typeof (data.author) === 'object' && data.author !== null) ? data.author._serialized : data.author) || this.key.remoteJid

        this.mentions = data?.mentionedJidList || []

        this.isMedia = Boolean(data.mediaKey && data.directPath)

        this.links = data.links

        this.ephemeralDuration = data.ephemeralDuration

        this.isNewMsg = data.isNewMsg

        if (this.isMedia) {
            this.deprecatedMms3Url = data.deprecatedMms3Url
            this.directPath = data.directPath
            this.mime = data.mimetype
            this.filehash = data.filehash
            this.encFilehash = data.encFilehash
            this.mediaKey = data.mediaKey
            this.width = data.width
            this.height = data.height
            if (data.mediaKeyTimestamp) this.mediaKeyTimestamp = data.mediaKeyTimestamp
            if (data.size) this.fileSize = data.size
            if (data.isViewOnce) this.isViewOnce = data.isViewOnce
            if (data.wavefrom) this.wavefrom = data.wavefrom
            if (data.duration) this.duration = data.duration
            if (data.thumbnailWidth) this.thumbnailWidth = data.thumbnailWidth
            if (data.thumbnailHeight) this.thumbnailHeight = data.thumbnailHeight
        }

        // sticker message
        if (this.type == "sticker") {
            this.isAnimated = data.isAnimated
            this.isAvatar = data.isAvatar
            this.stickerSent = data.stickerSentTs
            this.body = ''

            if (this.isAnimated) {
                this.frameLength = data.firstFrameLength
                this.frameSidecar = data.firstFrameSidecar
            }
        }

        // image message
        if (this.type == "image") {
            this.scanLength = data.scanLengths
            this.scanSidecar = data.scansSidecar
            this.body = data.caption || ''
        }

        // video message
        if (this.type == "video") {
            this.body = data.caption || ''
            this.streamingSidecar = data.streamingSidecar
            this.isGif = data.isGif
            this.gifAttribution = data.gifAttribution
        }

        // location message
        if (this.type == 'location') {
            this.isLiveLocation = data.isLive
            this.comment = data.comment || ''
            this.latitude = data.lat
            this.longitude = data.lng
            this.sequence = data.sequence
            this.description = data.description || ''
            this.url = data.clientUrl || ''
            this.location = data.loc
        }

        if (this.type == 'vcard') {
            this.vcard = data.body
            this.body = ''
        }

        if (this.type == 'multi_vcard') {
            this.vcard = data.vcardList
            this.isDocument = data.isVcardOverMmsDocument
            this.formattedName = data.vcardFormattedName
        }

        if (data.title) {
            this.body = data.title;
        }

        if (data.description) {
            this.body = data.description;
        }

        if (data.businessOwnerJid) {
            this.businessOwnerJid = data.businessOwnerJid;
        }

        if (data.productId) {
            this.productId = data.productId;
        }

        this.body = (this.type == "list_response") ? data.listResponse.singleSelectReply.selectedRowId : (this.type === "buttons_response") ? data?.selectedButtonId : (this.type === "template_button_reply") ? data?.dynamicReplyButtons : data.caption || data.comment || data.body || ''

        this.arg = this?.body?.trim()?.split(/ +/) || []

        this.args = this?.body?.trim()?.split(/ +/)?.slice(1) || []
        
        this.text = this?.args?.join(" ")

        return super._patch(data)
    }

    reply(content, options = {}) {
        return this.client.sendMessage(options?.from ? options.from : this.from, content, { quoted: this, ...options })
    }

    download(filepath) {
        if (filepath) return this.client.downloadAndSaveMediaMessage(this, filepath)
        else return this.client.downloadMediaMessage(this)
    }
}
exports.serializeM = serializeM


global.reloadFile(__filename)
