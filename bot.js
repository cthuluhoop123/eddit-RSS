require('dotenv').config();

const config = require('./config.js');

const db = require('quick.db');

const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter();

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(await client.generateInvite());
});

feeder.on('new-item', item => {
    const readList = db.get('db.read');
    if (readList && readList.includes(item.title + item.summary)) { return; }
    const embed = new Discord.RichEmbed()
        .setTitle(item.link)
        .setURL(item.link)
        .setFooter(item.meta.title)
        .setColor(0x50c878)
        .setTimestamp(item.pubDate);
    client.channels.get(config.messageChannel).send(shorten(`New Forum Thread - **${item.title}**`, 1000), { embed });
    db.push('db.read', item.title + item.summary);
});

client.login(process.env.TOKEN)
    .then(() => {
        config.rssFeeds.forEach(url => {
            feeder.add({
                url,
                refresh: 2000
            });
        });
    });

function shorten(text, max) {
    if (text.length <= max) {
        return text;
    }
    return text.slice(0, max - 3) + '...';
}