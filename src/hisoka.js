import "../config.js"

import { LocalAuth } from 'whatsapp-web.js'
import qrcode from "qrcode-terminal"
import chokidar from "chokidar"
import { chromium } from 'playwright-chromium'
import { platform } from 'os'
import path from 'path'
import API from "./lib/lib.api.js"


import Function from "./lib/lib.function.js"
import { Client, serialize } from "./lib/whatsapp.serialize.js"
import { Message, readCommands } from "./event/event.message.js"
import { database as databes } from "./lib/lib.database.js"


const database = new databes()
global.Func = Function
global.api = API


async function start() {
    process.on("uncaughtException", console.error)
    process.on("unhandledRejection", console.error)
    readCommands()

    const content = await database.read()
    if (!content.data && Object.keys(content.data).length === 0) {
        global.db = {
            users: {},
            groups: {},
            ...(content.data || {})
        }
        await database.write(global.db)
    } else {
        global.db = content.data
    }

    const hisoka = new Client({
        authStrategy: new LocalAuth({
            dataPath: `./${session.Path}`,
            clientId: `${session.Name}`
        }),
        playwright: {
            headless: true,
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
            executablePath: platform() === 'win32' ? chromium.executablePath() : '/usr/bin/google-chrome-stable',
            bypassCSP: true
        },
        markOnlineAvailable: true,
        qrMaxRetries: 2,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/11.1.2 Safari/603.2.4',
        takeoverTimeoutMs: 'Infinity',
        autoClearSession: true
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


let choki = chokidar.watch(Func.__filename(path.join(process.cwd(), 'src', 'commands')), { ignored: /^\./ })
choki
.on('change', async(path) => {
    const command = await import(Func.__filename(path))
    global.commands.set(command?.default?.name, command)
})
.on('add', async function(path) {
    const command = await import(Func.__filename(path))
    global.commands.set(command?.default?.name, command)
})
