const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Client, CommandInteraction, CommandInteractionOptionResolver } = require('discord.js');
const Case = require('../../DBModels/case_list'); // Adjust path if necessary

module.exports = {
    name: 'appeal_details',
    description: 'To fetch all case details of an individual',
    data: new SlashCommandBuilder()
        .setName('appeal_details')
        .setDescription('View the details of a specific case.')
        .addStringOption(option =>
            option.setName('caseid')
                .setDescription('The case ID to view details')
                .setRequired(true)),
    /**
    * @param {Client} client
    * @param {CommandInteraction} interaction
    * @param {CommandInteractionOptionResolver} options
    */
    async run(client, interaction, options) {
        const caseId = options.getString('caseid');

        try {
            const caseData = await Case.findOne({ case_id: caseId });

            if (!caseData) {
                return interaction.reply(`No case found with ID ${caseId}`);
            }

            const embed = new EmbedBuilder()
                .setTitle(`Case Details: ${caseData.case_id}`)
                .addFields(
                    { name: 'Discord Username', value: caseData.discord_username || 'N/A', inline: true },
                    { name: 'Roblox Username', value: caseData.roblox_username || 'N/A', inline: true },
                    { name: 'Offense', value: caseData.offense || 'N/A', inline: false },
                    { name: 'Case Link', value: caseData.case_link || 'N/A', inline: false },
                    { name: 'Punishment', value: caseData.punishment || 'N/A', inline: false },
                    { name: 'Background', value: caseData.background || 'N/A', inline: false },
                    { name: 'In-Person or Discord', value: caseData.in_person_or_discord || 'N/A', inline: false },
                    { name: 'Deserved or Not', value: caseData.deserved_or_not || 'N/A', inline: false },
                    { name: 'Status', value: caseData.status || 'N/A', inline: false },
                    { name: 'Judges Assigned', value: caseData.judges_assigned ? 'Yes' : 'No', inline: false },
                    { name: 'Judges Username', value: caseData.judges_username || 'N/A', inline: false },
                    { name: 'Branch', value: caseData.branch || 'N/A', inline: false },
                    { name: 'Submitted Date', value: caseData.submitted_date.toDateString() || 'N/A', inline: false },
                    { name: 'Decline Reason', value: caseData.decline_reason || 'N/A', inline: false }
                )
                .setColor('Red')
                .setFooter({ text: 'Court of Appeals' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching case details:', error);
            await interaction.reply('There was an error while fetching the case details.');
        }
    },
};
