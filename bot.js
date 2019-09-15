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
    if (db.has('db.read', item.title)) { return; }
    console.log(item);
    const embed = new Discord.RichEmbed()
        .setTitle(item.title)
        .setURL(item.link)
        .setDescription(shorten(item.description, 2000))
        .setFooter(item.meta.title)
        .setColor(0x50c878)
        .setTimestamp(item.pubDate);
    client.channels.get('592177693617815593').send({ embed });
    db.push('db.read', item.title);
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