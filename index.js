require('dotenv').config();
const TwitchApi = require('node-twitch').default;
const discord = require('discord.js');
const cron = require('cron');

const twitch = new TwitchApi({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
});

const bot = new discord.Client({
    disableEveryone: true,
    disabledEvents: ["TYPING_START"],
    intents: [discord.Intents.FLAGS.GUILDS]
});

let notifiedStreams = [];
let streamChecker = new cron.CronJob(`*/${process.env.PING} * * * *`, check);

async function check() {
    const streams = await getStreamsByGame(process.env.GAME_NAMES.split(","));
    notifyNewStreams(streams);
    notifiedStreams = [];
    streams.forEach(s => notifiedStreams.push(s.user_name));
}

async function getStreamsByGame(game_names) {
    const game_ids = await getGameIds(game_names);
    const streams = await twitch.getStreams({ game_id: game_ids });
    return streams.data;
}

async function getGameIds(name) {
    const games = await twitch.getGames(name);
    let game_ids = [];
    games.data.forEach(g => game_ids.push(g.id));
    return game_ids;
}

function notifyNewStreams(streams) {
    var newStreams = streams.filter(s => !notifiedStreams.includes(s.user_name));
    console.log(newStreams);
    let channel = bot.channels.cache.get(process.env.CHANNEL);
    for(const newStream of newStreams) {
        sendNotification(channel, newStream);
    }
}

async function sendNotification(channel, stream) {
    const userImage = (await getUser(stream.user_id)).profile_image_url;
    const messageEmbed = new discord.MessageEmbed()
        .setColor('#0099ff')
        .setAuthor({ name: stream.user_name, iconURL: userImage, url: 'https://www.twitch.tv/' + stream.user_login })
        .setTitle(stream.title)
        .setDescription("Playing **" + stream.game_name + '** for ' + stream.viewer_count + ' viewers')
        .setURL('https://www.twitch.tv/' + stream.user_login)
        .setImage(stream.thumbnail_url.replace('{width}x{height}', '1920x1080'))
    
    channel.send({ embeds: [messageEmbed] });
}

async function getUser(name) {
    const users = await twitch.getUsers(name);
    return users.data[0];
}

bot.login(process.env.BOT_TOKEN);
bot.on('ready', () => { streamChecker.start(); });