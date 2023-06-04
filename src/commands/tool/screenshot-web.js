import playwright from 'playwright-chromium'


export default {
     name: "ssweb",
     aliases: ["screenshotweb", "screenshot"],
     type: 'tool',
     desc: "screenshot website",
     example: "No Urls!?\n\nExample %prefix%command https://google.com",
     execute: async ({ hisoka, m }) => {
          m.reply("wait")
          const browser = await hisoka.pupBrowser || await getBrowser()

          // create a new page
          const page = await browser.newPage()
          /*
          let device = /mobile=/i.test(m.text.toLowerCase()) ? m.text.split`mobile='`[1].split`'`[0] : 'iPhone 12 Pro Max'
          if (!(device in a.devices)) return m.reply(`Device type is not supported\n\nList :\n${Object.keys(a.devices).join('\n')}`)
          if (/mobile/i.test(m.text.toLowerCase())) await page.emulate(a.devices[device])
          */
          // option
          await page.goto(Func.isUrl(m.text)[0])

          // Capture
          if (/full/i.test(m.text.toLowerCase())) await page.waitForTimeout(15000)
          let media = await page.screenshot({ fullPage: /full/i.test(m.text.toLowerCase()) ? true : false })

          // send message
          hisoka.sendMessage(m.from, media, { quoted: m })
          await page.close()
     }
}


async function getBrowser(opts = {}) {
     const chrome = {
          headless: true,
          args: [
               '--no-sandbox',
               '--no-first-run',
               '--no-default-browser-check',
               '--disable-setuid-sandbox',
               '--disable-accelerated-2d-canvas',
               '--disable-session-crashed-bubble',
               '--start-maximied',
               '--enable-features=WebContentsForceDark:inversion_method/cielab_based/image_behavior/selective/text_lightness_threshold/150/background_lightness_threshold/205'
          ],
          ...opts
     }
     return await playwright.chromium.launch(chrome)
}