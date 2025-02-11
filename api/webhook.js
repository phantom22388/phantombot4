import { Telegraf, Markup } from 'telegraf';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
    throw new Error('BOT_TOKEN is not set');
}
console.log('Bot token:', botToken);

const bot = new Telegraf(botToken);

// Add error handling globally
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

// Helper function to send media (image/video)
async function sendMedia(ctx) {
    try {
        const imagePath = path.join(__dirname, '../images/phantomregister.jpeg');
        const videoPath1 = path.join(__dirname, '../videos/register.mp4');
        const videoPath2 = path.join(__dirname, '../videos/withdrwal (2).mp4');

        // Send image
        await ctx.replyWithPhoto(
            { source: imagePath },
            {
                caption: 'The Arena Buzzing with excitement as countdown to victory begins!',
                ...Markup.inlineKeyboard([Markup.button.url('🎟️ Get ID Now', 'https://phantom777.com/')])
            }
        );

        // Send first video
        await ctx.replyWithVideo(
            { source: videoPath1 },
            {
                ...Markup.inlineKeyboard([Markup.button.url('📝 Register Now', 'https://phantom777.com/')])
            }
        );

        // Send second video
        await ctx.replyWithVideo(
            { source: videoPath2 },
            {
                ...Markup.inlineKeyboard([Markup.button.url('💸 Withdraw Now', 'https://phantom777.com/')])
            }
        );
    } catch (error) {
        console.error('Error sending media:', error);
        await ctx.reply('Sorry, could not send media').catch(console.error);
    }
}

// Message handlers
bot.on('text', async (ctx) => {
    const messageText = ctx.message.text.toLowerCase();
    console.log('Received message:', messageText);

    if (messageText === '/start') {
        await sendMedia(ctx);
    } else {
        await ctx.reply('I am a bot. I only respond to the /start command').catch(console.error);
    }
});

// Start command handler
bot.start(async (ctx) => {
    try {
        console.log('Start command received');
        await ctx.reply('Welcome! Bot is active.');
        await sendMedia(ctx);
    } catch (error) {
        console.error('Start command error:', error);
        await ctx.reply('Sorry, could not send media').catch(console.error);
    }
});

// Other commands
bot.command('test', (ctx) => ctx.reply('Bot is working!'));
bot.command('ping', (ctx) => ctx.reply('pong'));

// Webhook handler (for deployment)
export default async function handler(request, response) {
    try {
        console.log(`Request ${request.method}:`, request.body);

        if (request.method === 'GET') {
            return response.status(200).json({ 
                status: 'alive',
                timestamp: new Date().toISOString()
            });
        }

        if (request.method === 'POST') {
            const update = request.body;
            console.log('Update body:', JSON.stringify(update, null, 2));
            
            if (!update) {
                throw new Error('No update body received');
            }

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
}

// Cleanup process (to gracefully stop the bot)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
