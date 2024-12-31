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

// Message handlers
bot.on('text', async (ctx) => {
    const messageText = ctx.message.text.toLowerCase();
    console.log('Received message:', messageText);

    if (messageText === '/start') {
        try {
            const imagePath = path.join(__dirname, '../images/cbtf button.jpg');
            const videoPath1 = path.join(__dirname, '../videos/cbtf.register.mp4'); 
            const videoPath2 = path.join(__dirname, '../videos/VID-20241231-WA0013.mp4'); 

            await ctx.replyWithMediaGroup([
                {
                    type: 'photo',
                    media: { source: imagePath },
                    caption: 'The Arena Buzzing with excitement as countdown to victory begins!',
                },
                {
                    type: 'video',
                    media: { source: videoPath1 },
                    caption: 'Watch this exciting video 1!',
                },
                {
                    type: 'video',
                    media: { source: videoPath2 },
                    caption: 'Watch this exciting video 2!',
                }
            ]);

            await ctx.reply('Check out these links:', Markup.inlineKeyboard([
                [Markup.button.url('Visit Image Link', 'https://cbtflotus247.com/')],
                [Markup.button.url('Watch Video 1', 'https://example.com/video1')],
                [Markup.button.url('Watch Video 2', 'https://example.com/video2')]
            ]));
        } catch (error) {
            console.error('Error sending media group:', error);
            await ctx.reply('Sorry, could not send media').catch(console.error);
        }
    } else {
        await ctx.reply(`You said: ${ctx.message.text}`);
    }
});

// Test commands
bot.command('test', (ctx) => ctx.reply('Bot is working!'));
bot.command('ping', (ctx) => ctx.reply('pong'));

bot.start(async (ctx) => {
    try {
        console.log('Start command received');
        await ctx.reply('Welcome! Bot is active.');
        const imagePath = path.join(__dirname, '../images/image.jpg');
        const videoPath1 = path.join(__dirname, '../videos/cbtf.register.mp4'); 
        const videoPath2 = path.join(__dirname, '../videos/VID-20241231-WA0013.mp4'); 

        await ctx.replyWithMediaGroup([
            {
                type: 'photo',
                media: { source: imagePath },
                caption: 'The Arena Buzzing with excitement as countdown to victory begins!',
            },
            {
                type: 'video',
                media: { source: videoPath1 },
                caption: 'Watch this exciting video 1!',
            },
            {
                type: 'video',
                media: { source: videoPath2 },
                caption: 'Watch this exciting video 2!',
            }
        ]);

        await ctx.reply('Check out these links:', Markup.inlineKeyboard([
            [Markup.button.url('Visit Image Link', 'https://cbtflotus247.com/')],
            [Markup.button.url('Watch Video 1', 'https://example.com/video1')],
            [Markup.button.url('Watch Video 2', 'https://example.com/video2')]
        ]));
    } catch (error) {
        console.error('Start command error:', error);
        await ctx.reply('Sorry, could not send media').catch(console.error);
    }
});

export default async function handler(request, response) {
    try {
        console.log(`Request ${request.method}:`, request.body);

        if (request.method === 'GET') {
            return response.status(200).json({ 
                status: 'alive',
                timestamp: new Date().toISOString()
            });
        }

        // Webhook handler
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

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));