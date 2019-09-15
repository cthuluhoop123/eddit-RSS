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
    console.log(item);
    const embed = new Discord.RichEmbed()
        .setTitle(item.title)
        .setDescription(item.description)
        .setFooter(item.meta.title)
        .setColor(0x50c878)
        .setTimestamp(item.pubDate);
    client.channels.get('592177693617815593').send({ embed });
    // if (db.has('db.read', item.title)) { return; }
    // db.push('db.read', item.title);
    // console.log(db.get('db.read'));
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

/**
 * const request = require('superagent');
const Parser = require('rss-parser');
const parser = new Parser();

request
    .get('https://undisputed-rs.com/community/index.php?/forum/22-runescape.xml/')
    .set('Cookie', 'ips4_ipsTimezone=Australia/Sydney; ips4_hasJS=true; ips4_noCache=1; ips4_device_key=2c9e40fc25a5891eb453c5980a88399e; ips4_acp_login_key=7b1b4d6ae9f844f451c32eb2dfb13437; ips4_acpTabs=%7B%22core%22%3A%5B%5D%2C%22community%22%3A%5B%5D%2C%22members%22%3A%5B%5D%2C%22nexus%22%3A%5B%5D%2C%22cms%22%3A%5B%5D%2C%22stats%22%3A%5B%5D%2C%22customization%22%3A%5B%5D%7D; ips4_acpNotificationCount=0; ips4_status_widget_conf=%5B%5D; ips4_stream_view_all=expanded; ips4_guestTime=1568526067; ips4_member_id=86; ips4_login_key=e0ef847d7e389d7051fc3d0bd6fe6e64; ips4_loggedIn=1; __cfduid=d80e8b12f007fc991cb0e57fb95abc5e51568524758; ips4_IPSSessionAdmin=6g91gvmqunfdlih84ubnie3q3dptub66; ips4_IPSSessionFront=qt4qrvs8l9pr2505uminroe60scpd2ne')
    .then(async res => {
        const rss = res.text;
        const parsedRSS = await parser.parseString(rss);
        console.log(parsedRSS);
    });

 */