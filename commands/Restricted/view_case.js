const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, EmbedBuilder, CommandInteractionOptionResolver } = require('discord.js');
const case_list = require('../../DBModels/case_list.js');
const { paginationEmbed, interactionEmbed } = require('../../functions.js'); // Import paginationEmbed

module.exports = {
    name: 'view_case',
    description: 'View all cases with details',
    data: new SlashCommandBuilder()
        .setName('view_case')
        .setDescription('Fetch and view all case details'),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {CommandInteractionOptionResolver} options
     */
    async run(client, interaction, options) {
        await interaction.deferReply();

        try {
            // Fetch all cases from the database
            const cases = await case_list.find();
            const pageSize = 5; // Number of cases per page

            if (!cases || cases.length === 0) {
                return interactionEmbed(3, "No cases found", "", interaction, client, [true, 15]);
            }

            // Create pages of embeds
            let embeds = [];
            for (let i = 0; i < cases.length; i += pageSize) {
                const casesPage = cases.slice(i, i + pageSize);
                const embed = new EmbedBuilder()
                    .setTitle('Case List')
                    .setColor('Aqua')
                    .setFooter({
                        text: `Page ${Math.floor(i / pageSize) + 1}/${Math.ceil(cases.length / pageSize)}`,
                        iconURL: interaction.guild.iconURL({ dynamic: true })
                    });

                casesPage.forEach(caseData => {
                    embed.addFields(
                        { name: `Case ID: ${caseData.case_id}`, value: `**Discord Username:** ${caseData.discord_username || 'N/A'}\n**Status:** ${caseData.status || 'N/A'}\n**Judges Assigned:** ${caseData.judges_assigned ? 'Yes' : 'No'}` }
                    );

                    if (caseData.judges_assigned) {
                        embed.addFields(
                            { name: 'Judges Username', value: caseData.judges_username || 'N/A' }
                        );
                    }
                });

                embeds.push(embed);
            }

            // Use paginationEmbed function to handle embeds with pagination
            paginationEmbed(interaction, embeds);
        } catch (error) {
            console.error('Error fetching cases:', error);
            return interactionEmbed(3, "[ERR-ARGS]", `An error occured while fetching the records`, interaction, client, [true, 15]);
        }
    }
};
