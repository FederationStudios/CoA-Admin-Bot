const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, CommandInteractionOptionResolver } = require('discord.js');
const case_list = require('../../DBModels/case_list');

module.exports = {
    name: 'decline_case',
    description: 'Decline a case by changing its status to DENIED',
    data: new SlashCommandBuilder()
        .setName('decline_case')
        .setDescription('Decline a case by changing its status to DENIED')
        .addStringOption(option => 
            option.setName('case_id')
                .setDescription('The ID of the case to decline')
                .setRequired(true)),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {CommandInteractionOptionResolver} options
     */
    async run(client, interaction, options) {
        // Check if the user has appropriate permissions (Clerk or CoA Leadership)
        const requiredRoles = ['1264055683884646482', '1008740829017424053'];

        const hasRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));
        if (!hasRole) {
          return interactionEmbed(3, "[ERR-UPRM]", `You do not have permission to run this command, buddy.`, interaction, client, [true, 30]);
        }

        const caseId = interaction.options.getString('case_id');

        try {
            // Find the case and update its status
            const result = await case_list.findOneAndUpdate(
                { case_id: caseId },
                { $set: { status: 'DENIED' } },
                { new: true } // Return the updated document
            );

            if (!result) {
                return interaction.reply({ content: `No case found with ID ${caseId}.`, ephemeral: true });
            }

            await interaction.reply({ content: `The case with ID ${caseId} has been declined successfully.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while declining the case.', ephemeral: true });
        }
    }
};
