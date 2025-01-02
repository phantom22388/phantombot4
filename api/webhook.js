import { Telegraf, Markup } from 'telegraf';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
    throw new Error('BOT_TOKEN is not set');
}
console.log('Bot token:', botToken);

const bot = new Telegraf(botToken);

// Add error handling
bot.catch((err, ctx) => {
    console.error('Bot error:', err);
    ctx.reply('An error occurred').catch(console.error);
});

// Add debug middleware
bot.use(async (ctx, next) => {
    console.log('New update:', ctx.update);
    await next();
    console.log('Response sent');
});

const sendMediaWithLink = async (ctx) => {
    try {
        const imagePath = path.join(__dirname, '../images/cbtf button.jpg');
        const videoPath1 = path.join(__dirname, '../videos/cbtf.register.mp4'); 
        const videoPath2 = path.join(__dirname, '../videos/VID-20241231-WA0013.mp4'); 

        // Send image with link
        await ctx.replyWithPhoto(
            { source: imagePath },
            {
                caption: 'The Arena Buzzing with excitement as countdown to victory begins!',
                ...Markup.inlineKeyboard([
                    Markup.button.url('Get ID Now', 'https://cbtflotus247.com/')
                ])
            }
        );

        // Send first video with link
        await ctx.replyWithVideo(
            { source: videoPath1 },
            {
                caption: 'Register Now!',
                ...Markup.inlineKeyboard([
                    Markup.button.url('Register Now', 'https://cbtflotus247.com/')
                ])
            }
        );

        // Send second video with link
        await ctx.replyWithVideo(
            { source: videoPath2 },
            {
                caption: 'Join the excitement!',
                ...Markup.inlineKeyboard([
                    Markup.button.url('Join Now', 'https://cbtflotus247.com/')
                ])
            }
        );

    } catch (error) {
        console.error('Error sending media:', error);
        await ctx.reply('Sorry, could not send media').catch(console.error);
    }
};

// Message handlers
bot.on('text', async (ctx) => {
    const messageText = ctx.message.text.toLowerCase();
    console.log('Received message:', messageText);

    if (messageText === '/start') {
        await sendMediaWithLink(ctx);
    } else if (messageText === 'send media') {
        await sendMediaWithLink(ctx);
    } else {
        await ctx.reply(`You said: ${ctx.message.text}`);
    }
});

// Test commands
bot.command('test', (ctx) => ctx.reply('Bot is working!'));
bot.command('ping', (ctx) => ctx.reply('pong'));

bot.start(async (ctx) => {
    console.log('Start command received');
    await ctx.reply('Welcome! Bot is active.');
    await sendMediaWithLink(ctx);
});

bot.launch();