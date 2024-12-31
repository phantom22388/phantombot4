import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN);

// Add error handling
bot.catch((err, ctx) => {
    console.error('Bot error:', err);
    ctx.reply('An error occurred');
});

// Test commands
bot.command('test', (ctx) => ctx.reply('Bot is working!'));
bot.command('ping', (ctx) => ctx.reply('pong'));

bot.start(async (ctx) => {
    try {
        console.log('Start command received');
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
        console.log('Received webhook:', request.method);
        
        if (request.method === 'POST') {
            console.log('Update body:', request.body);
            await bot.handleUpdate(request.body);
        }
        
        response.status(200).json({ message: 'OK' });
    } catch (error) {
        console.error('Webhook error:', error);
        response.status(500).json({ 
            error: error.message,
            stack: error.stack 
        });
    }
}