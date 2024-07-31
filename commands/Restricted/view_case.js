const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, EmbedBuilder } = require('discord.js');
const case_list = require('../../DBModels/case_list');

module.exports = {
    name: 'view_case',
    description: 'View all cases with details',
    data: new SlashCommandBuilder()
        .setName('view_case')
        .setDescription('Fetch and view all case details'),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async run(client, interaction) {
        await interaction.deferReply();
        try {
            // Fetch all cases from the database
            const cases = await case_list.find();

            if (cases.length === 0) {
                return await interaction.editReply({ content: 'No cases found.', ephemeral: true });
            }

            // Create an embed message to display case details
            const embed = new EmbedBuilder()
                .setTitle('Case List')
                .setColor('Aqua');

            // Add case details to the embed
            cases.forEach(caseData => {
                embed.addFields(
                    { name: `Case ID: ${caseData.case_id}`, value: `**Discord Username:** ${caseData.discord_username}\n**Status:** ${caseData.status}\n**Judges Assigned:** ${caseData.judges_assigned ? 'Yes' : 'No'}` }
                );

                // Add judges' usernames if assigned
                if (caseData.judges_assigned) {
                    embed.addFields(
                        { name: 'Judges Username', value: caseData.judges_username }
                    );
                }
            });

            // Send the embed message
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'An error occurred while fetching the cases.', ephemeral: true });
        }
    }
};
