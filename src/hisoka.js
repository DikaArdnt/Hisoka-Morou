require("../config")

const { LocalAuth } = require("whatsapp-web.js")
const path = require("path")
const qrcode = require("qrcode-terminal")
const { Client, serialize } = require("./lib/whatsapp.serialize")
const { readCommands, Message } = require('./event/event.message')
const chalk = require("chalk")
const os = require('os')


global.api = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name] } : {}) })) : '')


async function start() {
    process.on("uncaughtException", console.error)
    process.on("unhandledRejection", console.error)
    readCommands()

    const hisoka = new Client({
        authStrategy: new LocalAuth({
            dataPath: `./${sessionName}`
        }),
        puppeteer: {
            headless: true,
            devtools: false,
            args: ['--enable-features=NetworkService', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-web-security', '--disable-features=IsolateOrigins,site-per-process', '--shm-size=8gb'],
            executablePath: os.platform() === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : '/usr/bin/google-chrome-stable'
        },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
    })

    hisoka.initialize()

    hisoka.on("qr", qr => {
        console.info("Loading QR Code for WhatsApp, Please Scan...")
        qrcode.generate(qr, { small: true })
    })

    hisoka.on("loading_screen", (percent, message) => {
        console.log(chalk.bgBlack(chalk.green(message)) + " :" + chalk.bgBlack(chalk.yellow(percent)))
    })

    hisoka.on("authenticated", console.info)

    hisoka.on("auth_failure", console.error)

    hisoka.on("ready", m => {
        console.info("Client is already on ")
    })

    hisoka.on("disconnected", m => {
        if (m) start()
    })

    hisoka.on("message_create", async (message) => {
        if (!message._data.isNewMsg) return
        let m = await serialize(hisoka, message)
        await Message(hisoka, m)
    })

    return hisoka
}

start()
