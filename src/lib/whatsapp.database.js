import config from "../../config.js"

import { fileURLToPath } from "url"
import fs from "fs"

const loadDatabase = (m) => {
    const isNumber = x => typeof x === "number" && !isNaN(x)
    const isBoolean = x => typeof x === "boolean" && Boolean(x)
    let user = global.db.users[m.sender]
    if (typeof user !== "object") global.db.users[m.sender] = {}
    if (user) {
        if (!isNumber(user.limit)) user.limit = config.limit.free
        if (!isBoolean(user.premium)) user.premium = m.isOwner ? true : false
        if (!isBoolean(user.VIP)) user.VIP = m.isOwner ? true : false
        if (!isBoolean(user.registered)) user.registered = false
        if (!("lastChat" in user)) user.lastChat = new Date * 1
        if (!("name" in user)) user.name = m.pushName
        if (!isNumber(user.exp)) user.exp = 0
        if (!isBoolean(user.banned)) user.banned = false
        if (!isBoolean(user.simi)) user.simi = false
    } else {
        global.db.users[m.sender] = {
            limit: config.limit.free,
            lastChat: new Date * 1,
            premium: m.isOwner ? true : false,
            VIP: m.isOwner ? true : false,
            registered: false,
            name: m.pushName,
            exp: 0,
            banned: false,
            simi: false
        }
    }

    if (m.isGroup) {
        let group = global.db.groups[m.from]
        if (typeof group !== "object") global.db.groups[m.from] = {}
        if (group) {
            if (!isBoolean(group.mute)) group.mute = false
            if (!isNumber(group.lastChat)) group.lastChat = new Date * 1
        } else {
            global.db.groups[m.from] = {
                lastChat: new Date * 1,
                mute: false
            }
        }
    }
}

export { loadDatabase }


let fileP = fileURLToPath(import.meta.url)
fs.watchFile(fileP, () => {
    fs.unwatchFile(fileP)
    console.log(`Update File "${fileP}"`)
    import(`${import.meta.url}?update=${Date.now()}`)
})