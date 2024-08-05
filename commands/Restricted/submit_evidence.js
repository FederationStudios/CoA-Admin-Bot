const { SlashCommandBuilder, Client, CommandInteraction, CommandInteractionOptionResolver } = require('discord.js');

module.exports = {
    name: "submit_evidence",
    description: "Submit evidence collected and send it to the specified channel.",
    data: new SlashCommandBuilder()
        .setName("submit_evidence")
        .setDescription("Submit evidence and send it to a channel.")
        .addStringOption(option => option
            .setName("evidence")
            .setDescription("The evidence you want to submit.")
            .setRequired(true)),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {CommandInteractionOptionResolver} options
     */
    async run(client, interaction, options) {
        const evidence = options.getString("evidence");
        const channelId = '1265982268162183178'; // Replace with your actual channel ID

        const channel = await client.channels.fetch(channelId).catch(() => null);
        if (!channel || !channel.isText()) {
            return interaction.reply({ content: "Invalid channel ID provided.", ephemeral: true });
        }

        try {
            await channel.send({ content: `Evidence submitted:\n${evidence}` });
            interaction.reply({ content: "Evidence submitted successfully!", ephemeral: true });
        } catch (error) {
            interaction.reply({ content: "An error occurred while submitting the evidence.", ephemeral: true });
        }
    }
};