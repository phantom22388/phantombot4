import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN);

// Add error handling
bot.catch((err, ctx) => {
    console.error('Bot error:', err);
    ctx.reply('An error occurred');
});

// Message handlers
bot.on('text', (ctx) => {
    console.log('Received message:', ctx.message.text);
    return ctx.reply(`You said: ${ctx.message.text}`);
});

// Test commands
bot.command('test', (ctx) => ctx.reply('Bot is working!'));
bot.command('ping', (ctx) => ctx.reply('pong'));

bot.start(async (ctx) => {
    try {
        console.log('Start command received');
        await ctx.reply('Welcome! Bot is active.');
        await ctx.replyWithPhoto(
            { 
                url: 'https://imgs.search.brave.com/BpXs26bfzlO4TBTMItL09Tq1qrkHu8NPCaOCrWGt1hE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlZWltYWdl/cy5jb20vc2xpZGVz/LzMxMzYzNDlmYjhl/YzRiZTRiNmU3NTI3/OGQ1MjEyZGVkLndl/YnA'
            },
            {
                caption: 'Here is an image for you!'
            }
        );
    } catch (error) {
        console.error('Start command error:', error);
        await ctx.reply('Sorry, could not send image');
    }
});

export default async function handler(request, response) {
    try {
        // Health check endpoint
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