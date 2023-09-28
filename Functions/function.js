import chalk from 'chalk';
import { YTDL } from "ytdl-easy"
import axios from 'axios';
import { downloadMediaMessage } from '@whiskeysockets/baileys';






export function logs(gcName, from, name, text, m, isGroup) {

  if (m.messages[0].message && isGroup) {
    console.log(
      "" + "\n" + chalk.black(chalk.bgWhite("[ GROUP ]   => ")),
      chalk.black(
        chalk.bgRed(gcName)
      ) +
      "\n" +
      chalk.black(chalk.bgWhite("[ SENDER ]  => ")),
      chalk.black(chalk.bgRed(name)) +
      "\n" +
      chalk.black(chalk.bgWhite("[ MESSAGE ] => ")),
      chalk.black(chalk.bgRed(text)) + "\n" + ""
    );
  }
  if (m.messages[0].message && !isGroup) {
    console.log(
      "" + "\n" + chalk.black(chalk.bgWhite("[ PRIVATE CHAT ] => ")),
      chalk.black(chalk.bgMagentaBright(from.split("@")[0])) +
      "\n" +
      chalk.black(chalk.bgWhite("[ SENDER ]       => ")),

      chalk.black(chalk.bgMagentaBright(name)) +
      "\n" +
      chalk.black(chalk.bgWhite("[ MESSAGE ]      => ")),
      chalk.black(chalk.bgMagentaBright(text)) + "\n" + ""
    );
  }
}



export async function YT(Neko, sendtext, from, sender, m, name) {
  try {
    if ((sendtext.includes("youtu.be/") || sendtext.includes("youtube.com/")) && (sendtext.includes("Audio") || sendtext.includes("audio"))) {

      Neko.sendMessage(from, {
        text: `Please wait a Minute ${name}`
      }, { quoted: m.messages[0] })

      const aud = sendtext.includes("Audio") ? sendtext.replace("Audio", "").trim() : sendtext.replace("audio", "").trim();

      let url = await YTDL(aud);
      let buff = await axios.get(url.video.Medium, { responseType: 'arraybuffer' });
      try {
        return await Neko.sendMessage(from,
          {
            audio: buff.data,
            mimetype: "audio/mpeg",
            fileName: `Converted By Neko ${sender}`,
          }, { quoted: m.messages[0] }
        )
      } catch (err) {
        Neko.sendMessage(from, {
          text: url.Audio
        }, { quoted: m.messages[0] })
      }

    } else if ((sendtext.includes("youtu.be/") || sendtext.includes("youtube.com/")) && (sendtext.includes("Video") || sendtext.includes("video"))) {
      const vid = sendtext.includes("Video") ? sendtext.replace("Video", "").trim() : sendtext.replace("video", "").trim();
      await Neko.sendMessage(from, {
        text: `Please wait a Minute ${name}`
      }, { quoted: m.messages[0] })

      let url = await YTDL(vid)
      try {
        await Neko.sendMessage(from, {
          video: {
            url: url.video.Medium
          }
        }, { quoted: m.messages[0] }
        )
      } catch (err) {
        Neko.sendMessage(from, { text: `An Error Occurred!!` })
      }
    }
  } catch (err) {
    await Neko.sendMessage(from, {
      text: `An Error Occurred ${name}`
    }, { quoted: m.messages[0] })
  }
}


export async function onceView(viewonce, Neko, m, name) {
  try{
  if (viewonce?.message) {
    let viewonceType = Object.keys(JSON.parse(JSON.stringify(viewonce?.message)))[0].replace('Message', "")
    if (viewonceType == "image") {
      if (viewonce?.message.imageMessage.url != undefined) {

        const buffer = await downloadMediaMessage(
          m.messages[0], 'buffer', {},
          {
            reuploadRequest: Neko.updateMediaMessage
          }
        )

        await Neko.sendMessage(Neko.user.id, {
          image: buffer,
          caption: `Scraped by *NekoKun* from *${name}*`
        })
      }
    } else {
      if (viewonce?.message.videoMessage.url != undefined) {

        let buffer = await downloadMediaMessage(m.messages[0], 'buffer', {},
          {
            reuploadRequest: Neko.updateMediaMessage
          })

        await Neko.sendMessage(Neko.user.id, {
          video: buffer,
          caption: `Scraped by *NekoKun* from *${name}*`
        })
      }
    }
  } } catch (err) {
  console.log("An Error Occurred ")
  }
}