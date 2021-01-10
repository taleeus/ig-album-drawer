/* eslint-disable no-case-declarations */
require('dotenv').config()
const Discord = require('discord.js')
const { fetchAlbums, peekAlbums, removeAlbums, addAlbums } = require('./functions')

const bot = new Discord.Client()
const DISCORD_TOKEN = process.env.DISCORD_TOKEN

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`)
})

bot.on('message', async msg => {
  const command = msg.content.trim()
  
  if (command === '!ping') {
    console.info('Pinging')
    msg.reply(':ping_pong:')
  }

  if (command === '!albums') {
    console.info('Sending albums')
    const albumList = await fetchAlbums()

    msg.reply('La lista al momento contiene:')
    while (albumList.length > 0) {
      msg.channel.send(albumList.splice(0, 10).join('\n'))
    }
  }

  if (command === '!peek') {
    console.info('Peeking albums')

    msg.reply('Inizio estrazione (gli album non verranno rimossi dalla lista):')
    for (const album of await peekAlbums()) {
      msg.channel.send(album)
    }
  }

  if (command === '!draw') {
    console.info('Drawing albums')    

    msg.reply('Inizio estrazione:')
    const peekedAlbums = await peekAlbums()
    for (const album of peekedAlbums) {
      msg.channel.send(album)
    }

    await removeAlbums(peekedAlbums)
  }

  if (command.startsWith('!add')) {
    console.info('Adding albums')

    const albumList = command.split(/(\r\n|\r|\n|\s)/)
      .filter(it => it.includes('rateyourmusic.com'))
      .map(it => it.trim())

    await addAlbums(albumList)
    msg.reply(`Added ${albumList.length} albums!`)
  }
})

bot.login(DISCORD_TOKEN)
