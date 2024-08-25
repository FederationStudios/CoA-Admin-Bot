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
    run: async(client, interaction, options) => {

        await interaction.deferReply({ephemeral:true});
        const requiredRoles = ['1264055683884646482', '1008740829017424053', '1270040254891692152', '1276746698022060083'];
        const hasRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));

        if (!hasRole) {
            return interaction.editReply({ content: "You do not have permission to run this command.", ephemeral: true });
        }

        const evidence = options.getString("evidence");
        const channelId = '1270046126070042798'; // Replace with your actual channel ID

        const channel = await client.channels.fetch(channelId).catch(() => null);
        if (!channel || !channel.isText()) {
            return interaction.editReply({ content: "Invalid channel ID provided.", ephemeral: true });
        }

        try {
            await channel.send({ content: `Evidence submitted:\n${evidence}` });
            interaction.editReply({ content: "Evidence submitted successfully!", ephemeral: true });
        } catch (error) {
            interaction.editReply({ content: "An error occurred while submitting the evidence.", ephemeral: true });
        }
    }
};
