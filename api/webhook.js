import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
    await ctx.replyWithPhoto(
        { 
            url: 'https://imgs.search.brave.com/BpXs26bfzlO4TBTMItL09Tq1qrkHu8NPCaOCrWGt1hE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlZWltYWdl/cy5jb20vc2xpZGVz/LzMxMzYzNDlmYjhl/YzRiZTRiNmU3NTI3/OGQ1MjEyZGVkLndl/YnA'
        },
        {
            caption: 'Here is an image for you!'
        }
    );
});

export default async function handler(request, response) {
    try {
        if (request.method === 'POST') {
            await bot.handleUpdate(request.body);
        }
        response.status(200).json({ message: 'OK' });
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ error: 'Failed to process update' });
    }
}