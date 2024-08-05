// events/messageCreate.js
const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {import('discord.js').Message} message
     * @param {import('discord.js').Client} client
     */
    async execute(message, client) {
        // Check if the message is a direct message
        if (message.channel.type === 'DM' && !message.author.bot) {
            // Log the user's information
            console.log(`Received a DM from ${message.author.tag} (${message.author.id}): ${message.content}`);
            
            // Optional: You can also send a confirmation reply to the user
            message.reply('Your message has been received.');
        }
    },
};
