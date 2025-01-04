import { Telegraf, Markup } from 'telegraf';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

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

// Function to send media
const sendMedia = async (ctx) => {
    try {
        const imagePath = path.join(__dirname, '../images/phantomregister.jpeg');
        const videoPath1 = path.join(__dirname, '../videos/register.mp4'); 
        const videoPath2 = path.join(__dirname, '../videos/withdrwal (2).mp4'); 

        console.log('Sending image from:', imagePath);
        await ctx.replyWithPhoto(
            { source: imagePath },
            {
                caption: 'The Arena Buzzing with excitement as countdown to victory begins! Make fearless predictions at https://phantom777.com/',
                ...Markup.inlineKeyboard([
                    Markup.button.url('🎟️ Get ID Now', 'https://phantom777.com/')
                ])
            }
        );

        console.log('Sending video 1 from:', videoPath1);
        await ctx.replyWithVideo(
            { source: videoPath1 },
            {
                ...Markup.inlineKeyboard([
                    Markup.button.url('📝 Register Now', 'https://phantom777.com/')
                ])
            }
        );

        console.log('Sending video 2 from:', videoPath2);
        await ctx.replyWithVideo(
            { source: videoPath2 },
            {
                ...Markup.inlineKeyboard([
                    Markup.button.url('💸 Withdraw Now', 'https://phantom777.com/')
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
        await sendMedia(ctx);
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
    await sendMedia(ctx);
});

// Webhook setup
const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (request, response) => {
    try {
        const update = request.body;

        if (update) {
            console.log('Received update:', update);
            await bot.handleUpdate(update);
            return response.status(200).json({ ok: true });
        }

        return response.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Webhook error:', error);
        return response.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});