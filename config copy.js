import fs from "node:fs";
import { fileURLToPath } from "node:url";

// limit
const limit = {
  free: 25,
  premium: 250,
  VIP: "Infinity",
  download: {
    free: 30000000, // use byte
    premium: 100000000, // use byte
    VIP: 1130000000, // use byte
  },
};

export default {
  limit,
  APIs: {
    xzn: {
      URI: "https://xznsenpai.xyz/",
      Key: "i dont know",
    },
  },

  msg: {
    owner: "Perintah ini hanya dapat digunakan oleh Owner!",
    group: "Perintah ini hanya dapat digunakan di group!",
    private: "Perintah ini hanya dapat digunakan di private chat!",
    admin: "Perintah ini hanya dapat digunakan oleh admin group!",
    botAdmin: "Bot bukan admin, tidak dapat mengakses fitur tersebut",
    bot: "Fitur ini hanya dapat diakses oleh Bot",
    locked: "Fitur ini telah dinonaktifkan!",
    media: "Reply media...",
    error: "Sepertinya ada kesalahan. bot gagal dalam mengeksekusi...",
    quoted: "Reply message...",
    wait: "",
    premium: "Perintah ini hanya dapat digunakan oleh pengguna premium!",
    vip: "Perintah ini hanya dapat digunakan oleh pengguna VIP!",
    dlFree: `File over ${formatSize(
      limit.download.free
    )} can only be accessed by premium users`,
    dlPremium: `WhatsApp Web cannot send files larger than ${formatSize(
      limit.download.premium
    )}`,
    dlVIP: `WhatsApp cannot send files larger than ${formatSize(
      limit.download.VIP
    )}`,
  },

  options: {
    public: true,
    URI: "database.json", // use mongo or file json
    owner: ["6288292024190", "62858156631709"],
    pathCommand: "commands",
  },

  Exif: {
    packId: "https://instagram.com/cak_haho",
    packName: `Sticker ini Dibuat Oleh :`,
    packPublish: "Dika Ardnt.",
    packEmail: "dika.ardianta7@yahoo.com",
    packWebsite: "https://instgaram.com/cak_haho",
    androidApp:
      "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
    iOSApp:
      "https://apps.apple.com/id/app/muslim-pro-al-quran-adzan/id388389451?|=id",
    categories: ["😹", "😎", "😱"],
    isAvatar: 0,
  },

  session: {
    Path: "session",
    Name: "hisoka",
  },
};

function formatSize(bytes) {
  if (bytes >= 1000000024) {
    bytes = (bytes / 1000000024).toFixed(2) + " GB";
  } else if (bytes >= 1000024) {
    bytes = (bytes / 1000024).toFixed(2) + " MB";
  } else if (bytes >= 1024) {
    bytes = (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes > 1) {
    bytes = bytes + " bytes";
  } else if (bytes == 1) {
    bytes = bytes + " byte";
  } else {
    bytes = "0 bytes";
  }
  return bytes;
}

let fileP = fileURLToPath(import.meta.url);
fs.watchFile(fileP, () => {
  fs.unwatchFile(fileP);
  console.log(`Update File "${fileP}"`);
  import(`${import.meta.url}?update=${Date.now()}`);
});
