import "../config.js"

import { LocalAuth } from 'whatsapp-web.js'
import qrcode from "qrcode-terminal"
import chokidar from "chokidar"
import { executablePath } from 'puppeteer'
import { platform } from 'os'


import Function from "./lib/lib.function.js"
import { Client, serialize } from "./lib/whatsapp.serialize.js"
import { Message, readCommands } from "./event/event.message.js"
import { database as databes } from "./lib/lib.database.js"


const database = new databes()
global.Func = Function


async function start() {
    process.on("uncaughtException", console.error)
    process.on("unhandledRejection", console.error)
    readCommands()

    const content = await database.read()
    if (content.data) {
        global.db = {
            users: {},
            groups: {},
            ...(content.data || {})
        }
        await database.write()
    } else {
        global.db = content.data
    }

    const hisoka = new Client({
        authStrategy: new LocalAuth({
            dataPath: `./${session.Path}`,
            clientId: `${session.Name}`
        }),
        puppeteer: {
            headless: false,
            devtools: false,
            args: [
                '--aggressive-tab-discard',
                '--disable-accelerated-2d-canvas',
                '--disable-application-cache',
                '--disable-cache',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-offline-load-stale-cache',
                '--disable-setuid-sandbox',
                '--disable-setuid-sandbox',
                '--disk-cache-size=0',
                '--ignore-certificate-errors',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                //'--enable-features=WebContentsForceDark:inversion_method/cielab_based/image_behavior/selective/text_lightness_threshold/150/background_lightness_threshold/205'
            ],
            executablePath: platform() === 'win32' ? executablePath() : '/usr/bin/google-chrome-stable'
        },
        markOnlineAvailable: true,
        qrMaxRetries: 2,
        bypassCSP: true,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        takeoverTimeoutMs: 'Infinity'
    })

    hisoka.initialize()

    hisoka.on("qr", qr => {
        console.info("Loading QR Code for WhatsApp, Please Scan...")
        qrcode.generate(qr, { small: true })
    })

    hisoka.on("loading_screen", (percent, message) => {
        console.log(chalk.bgBlack(chalk.green(message)) + " :" + chalk.bgBlack(chalk.yellow(percent)))
    })

    hisoka.on("auth_failure", console.error)

    hisoka.on("ready", m => {
        console.info("Client is already on ")
    })

    hisoka.on("disconnected", m => {
        if (m) start()
    })

    hisoka.on("message_create", async (message) => {
        const m = await (await serialize(hisoka, message))
        await (await Message(hisoka, m))
    })

    // rewrite database every 30 seconds
    setInterval(async () => {
        if (global.db) await database.write(global.db)
    }, 3000)

    return hisoka
}


start()


let choki = chokidar.watch('./src/commands', { ignored: /^\./, persistent: true })
choki
.on('change', async(path) => {
    await import(`${Func.__filename(path)}?version=${Date.now()}`)
    await readCommands('commands', Func.__filename(path))
})
.on('add', async function(path) {
    await import(`${Func.__filename(path, false)}?version=${Date.now()}`)
    await readCommands('commands', Func.__filename(path))
})