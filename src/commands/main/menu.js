function toUpper(query) {
    const arr = query.split(" ")
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
    }

    return arr.join(" ")
    //return query.replace(/^\w/, c => c.toUpperCase())
}

module.exports = {
    name: "menu",
    aliases: ["menu","help","list"],
    desc: "To display the menu by list, and see how to use the menu",
    execute: async({ hisoka, m, prefix, command, commands }) => {
        if (m.args.length >= 1) {
            let data = []
            const nama = m.text.toLowerCase()
            const cmd = commands.get(nama) ?? commands.find((cmd) => cmd.aliases && cmd.aliases.includes(nama))
            if (cmd.isOwner && !m.isOwner) return global.mess("owner", m)
            if (!cmd) return m.reply("Command Not Found")
            if (cmd.name) data.push(`*- Command :* ${cmd.name}`)
            if (cmd.aliases) data.push(`*- Alias :* ${cmd.aliases.join(", ")}`)
            if (cmd.desc) data.push(`*- Desc :* ${cmd.desc.replace(/%prefix/gi, prefix).replace(/%command/gi, cmd.name)}`)
            if (cmd.example) data.push(`*- Exm :* ${cmd.example.replace(/%prefix/gi, prefix).replace(/%command/gi, command)}`)
            if (cmd.isLimit) data.push(`*- Use Limit :* Command uses limit to work`)
            if (cmd.limit) data.push(`*- Amount of Limit :* ${cmd.limit}`)

            m.reply(`*Command Info :*\n\n${data.join("\n")}`)
        } else {
            let teks = `Hai @${m.sender.split("@")[0]}, Ini Adalah Daftar Perintah Yang Tersedia\n\n`

            for (const category of global.Categories) {
                teks += `┌──⭓ *${toUpper(category)} Menu*\n`
                teks += `│\n`
                teks += `${global.Commands[category].filter(v => v.type !== "hide").map((cmd) => `│⎚ ${prefix + cmd.name} ${(cmd?.isLimit ? "(" + (cmd?.limit || 1 + " Limit") + ")" : "")}`).join("\n")}\n`
                teks += `│\n`
                teks += `└───────⭓\n\n`
            }

            hisoka.sendMessage(m.from, 'https://dafunda.com/wp-content/uploads/2021/01/Karakter-Hunter-x-Hunter-Yang-Kuat-Menurut-Hisoka.jpg', { caption: teks, quoted: m, mentions: hisoka.parseMention(teks) })
        }
    }
}