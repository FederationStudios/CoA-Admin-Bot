/* eslint-disable no-unused-vars */
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
        try{
        await interaction.deferReply({ephemeral:true});
        const requiredRoles = ['1264055683884646482', '1008740829017424053', '1270040254891692152', '1276746698022060083'];
        const hasRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));

        if (!hasRole) {
            return interaction.editReply({ content: "You do not have permission to run this command.", ephemeral: true });
        }

        const evidence = options.getString("evidence");
        const targetChannel = client.channels.cache.get("1270046126070042798");

        if(targetChannel)
        {
            await targetChannel.send({
                content: `Incoming case submit eveidence from ${interaction.user.tag} (${interaction.user.id})\n${evidence}` 
            })
        }
            else {
                console.error('Target channel not found.');
                await interaction.editReply({
                    content: "Target channel not found. Please contact an administrator.",
                    ephemeral: true
                });
                return;
            }
        }catch(error){
            console.error('Error handling slash command:', error);
                await interaction.editReply({
                    content: "There was an error processing your submission. Please try again later.",
                    ephemeral: true
                });
        }
    }
};
