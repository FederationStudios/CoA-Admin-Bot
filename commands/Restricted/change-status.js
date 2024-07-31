const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, CommandInteractionOptionResolver } = require('discord.js');
const case_list = require('../../DBModels/case_list');
const interactionEmbed = require('../../functions');

module.exports = {
    name: 'change_status',
    description: 'Change the status of a case',
    data: new SlashCommandBuilder()
        .setName('change_status')
        .setDescription('Change the status of a case')
        .addStringOption(option => 
            option.setName('case_id')
                .setDescription('The ID of the case to update')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('status')
                .setDescription('The new status of the case')
                .addChoices(
                    { name: 'PENDING', value: 'PENDING' },
                    { name: 'DENIED', value: 'DENIED' },
                    { name: 'PENDING APPROVAL FROM COA COMMAND', value: 'PENDING APPROVAL FROM COA COMMAND' },
                    { name: 'ON HOLD', value: 'ON HOLD' },
                    { name: 'AWAITING ASSIGNMENT', value: 'AWAITING ASSIGNMENT' },
                    { name: 'COMPLETED', value: 'COMPLETED' }
                )
                .setRequired(true)),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {CommandInteractionOptionResolver} options
     */
    async run(client, interaction, options) {
        // Check if the user has appropriate permissions (CoA Leadership or Clerk Command)
        const requiredRoles = ['1264055683884646482', '1008740829017424053'];

        const hasRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));
        if (!hasRole) {
          return interactionEmbed(3, "[ERR-UPRM]", `You do not have permission to run this command, buddy.`, interaction, client, [true, 30]);
        }
        const caseId = interaction.options.getString('case_id');
        const newStatus = interaction.options.getString('status');

        try {
            // Find the case and update its status
            const result = await case_list.findOneAndUpdate(
                { case_id: caseId },
                { 
                    $set: { 
                        status: newStatus
                    }
                },
                { new: true } // Return the updated document
            );

            if (!result) {
                return interaction.reply({ content: `No case found with ID ${caseId}.`, ephemeral: true });
            }

            await interaction.reply({ content: `The status of the case with ID ${caseId} has been updated to ${newStatus}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while updating the case status.', ephemeral: true });
        }
    }
};
