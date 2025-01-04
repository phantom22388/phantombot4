import { Telegraf, Markup } from 'telegraf';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
    throw new Error('BOT_TOKEN is not set');
}
console.log('Bot token:', botToken);

const bot = new Telegraf(botToken);

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

// Message handlers
bot.on('text', async (ctx) => {
    const messageText = ctx.message.text.toLowerCase();
    console.log('Received message:', messageText);

    if (messageText === '/start') {
        try {
            const imagePath = path.join(__dirname, '../images/cbtf button.jpg');
            const videoPath1 = path.join(__dirname, '../videos/cbtf.register.mp4'); 
            const videoPath2 = path.join(__dirname, '../videos/VID-20241231-WA0013.mp4'); 

            await ctx.replyWithPhoto(
                { source: imagePath },
                {
                    caption: 'The Arena Buzzing with excitement as countdown to victory begins! make fairless Predictions https://cbtflotus247.com/ ',
                    ...Markup.inlineKeyboard([
                        Markup.button.url('Get Id Now', 'https://cbtflotus247.com/')
                    ])
                }
            );

            // Send first video with link
            await ctx.replyWithVideo(
                { source: videoPath1 },
                {
                    ...Markup.inlineKeyboard([
                        Markup.button.url('Deposit Now', 'https://cbtflotus247.com/')
                    ])
                }
            );

            // Send second video with link
            await ctx.replyWithVideo(
                { source: videoPath2 },
                {
                    ...Markup.inlineKeyboard([
                        Markup.button.url('Register Now', 'https://cbtflotus247.com/')
                    ])
                }
            );

        } catch (error) {
            console.error('Error sending media:', error);
            await ctx.reply('Sorry, could not send media').catch(console.error);
        }
    } else {
        await ctx.reply(`You said: ${ctx.message.text}`);
    }
});

// Express server to handle webhook updates
const app = express();
app.use(express.json()); // Ensure the body is parsed as JSON

app.post('/webhook', (req, res) => {
    bot.handleUpdate(req.body, res);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});