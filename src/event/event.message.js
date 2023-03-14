require("../../config")

const fs = require('fs')
const moment = require('moment-timezone')
const path = require('path')
const { format } = require('util')
const { Collection } = require('../lib/lib.collection')
const wwebjs = require("whatsapp-web.js")


const commands = new Collection()
const aliases = new Collection()
const cooldowns = new Collection()
const isNumber = x => typeof x === "number" && !isNaN(x)


exports.Message = async (hisoka, m) => {
    try {
        if (!m) return
        if (m.isBot) return

        if (global.options.multiPrefix) {
            var prefix = /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#%^&.©^]/gi.test(m.body) ? m.body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#%^&.©^]/gi)[0] : "#"
        } else if (global.options.singlePrefix) {
            prefix = global.options.prefix
        } else if (global.options.noPrefix) {
            prefix = ""
        } else prefix = m.body && ([[new RegExp("^[" + (global.options.prefix || "/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-").replace(/[|\\{}()[\]^$+*?.\-^]/g, "\\$&") + "]").exec(m.body), global.options.prefix || "/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-"]].find((p) => p[1])[0] || [""])[0]
        m.prefix = prefix

        const cmd = m.cmd = m.body && !!prefix && m.body.startsWith(prefix) && m.body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        const command = m.command = commands.get(cmd) || commands.find((v) => v.aliases && v.aliases.includes(cmd)) || aliases.get(cmd)
        const quoted = m?.quoted ? m.quoted : m
        const isOwner = m.sender && [...global.owner].includes(m.sender.replace(/\D+/g, ""))
        //if (m.isGroup) m.metadata = await hisoka.getChatById(m.from).then(_ => _)
        

        // log chat
        if (m && !m.isBot) {
            console.log(chalk.black(chalk.bgWhite("- FROM")), chalk.black(chalk.bgGreen(m.pushName)), chalk.black(chalk.yellow(m.sender)) + "\n" + chalk.black(chalk.bgWhite("- IN")), chalk.black(chalk.bgGreen(m.isGroup ? "Group Chat" : "Private Chat", m.from)) + "\n" + chalk.black(chalk.bgWhite("- MESSAGE")), chalk.black(chalk.bgGreen(m.body || m.type)))
            m.exp = Math.ceil(Math.random() * 15)
        }

        // command
        if (command && !m.isBot) {
            if (!global.options.public && !isOwner) return

            if (command.main) {
                return global.mess("main", m)
            }

            if (command.isMedia && !quoted.isMedia) {
                return global.mess("media", m)
            }

            if (command.isOwner && !isOwner) {
                return global.mess("owner", m)
            }

            if (command.isGroup && !m.isGroup) {
                return global.mess("group", m)
            }

            if (command.isPrivate && m.isGroup) {
                return global.mess("private", m)
            }

            if (command.isBot && m.fromMe) {
                return global.mess("bot", m)
            }

            if (command.example && !m.text) {
                return m.reply(command.example.replace(/%prefix/gi, prefix).replace(/%command/gi, command.name).replace(/%text/gi, m.text))
            }


            command.execute({
                hisoka,
                m,
                command: cmd,
                quoted,
                prefix,
                isOwner,
                commands
            })
            ?.then(a => a)
            ?.catch((err) => { 
                //global.db.users[m.sender].limit += 1
                let text = format(err)
                for (let key of Object.values(global.APIKeys))
                text = text.replace(new RegExp(key, 'g'), "#HIDDEN#")
                m.reply(`*Error Command*\n\n*- Name :* ${command.name}\n*- Sender :* ${m.sender.split`@`[0]} (@${m.sender.split`@`[0]})\n*- Time :* ${moment(m.timestamps * 1).tz("Asia/Jakarta")}\n*- Log :*\n\n${text}`)
            })

        } else {
            if (m?.body?.startsWith(">") || m?.body?.startsWith(">>")) {
                if (!isOwner) return
                let evalCmd
                try {
                    evalCmd = eval("(async() => { " + m.text + " })()")
                } catch (e) {
                    evalCmd = new EvalError(e)
                }
                new Promise(async (resolve, reject) => {
                    try {
                        resolve(evalCmd);
                    } catch (err) {
                        reject(new EvalError(err))
                    }   
                })
                .then((res) => m.reply(format(res)))
                .catch((err) => m.reply(format(err)))
            }
            if (m?.body?.startsWith("$")) {
                if (!isOwner) return
                try {
                    Func['child_process'].exec(m.text, async(err, stdout) => {
                        if (err) return m.reply(format(err))
                        if (stdout) return m.reply(format(stdout))
                    })
                } catch (e) {
                    m.reply(format(e, true))
                }
            }
        }

    } catch (e) {
        console.error(e)
    }
}


exports.readCommands = (pathname = "commands") => {
    if (pathname.endsWith('.js')) {
        const command = require(pathname)
        commands.set(command.name, command)
        if (command.aliases) command.aliases.forEach((alias) => aliases.set(alias, command))
        return false
    }
    const dir = path.join(__dirname, "..", pathname)
    const dirs = fs.readdirSync(dir)
    let listCommands = {}
    dirs.map((res) => {
        listCommands[res.toLowerCase()] = []
        global.Categories = dirs.filter(v => v !== "__").map(v => v.toLowerCase())
        let files = fs.readdirSync(`${dir}/${res}`).filter((file) => file.endsWith(".js"))
        for (const file of files) {
            const command = require(`${dir}/${res}/${file}`)
            global.reloadFile(`${dir}/${res}/${file}`)
            listCommands[res.toLowerCase()].push(command)
            commands.set(command.name, command)
            if (command.aliases) command.aliases.forEach((alias) => aliases.set(alias, command))
        }
    })
    global.Commands = listCommands
    commands.sort()
}


global.reloadFile(__filename)