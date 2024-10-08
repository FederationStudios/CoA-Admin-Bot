const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, CommandInteractionOptionResolver } = require('discord.js');
const case_list = require('../../DBModels/case_list');
const { interactionEmbed } = require("../../functions");

module.exports = {
    name: 'assign_appeal',
    description: 'Assign judges to a case or update the existing assignment',
    data: new SlashCommandBuilder()
        .setName('assign_appeal')
        .setDescription('Assign judges to a case or update the existing assignment')
        .addStringOption(option => 
            option.setName('case_id')
                .setDescription('The ID of the case to assign judges to')
                .setRequired(true))
        .addBooleanOption(option => 
            option.setName('judges_assigned')
                .setDescription('Whether judges are assigned or not')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('judges_username')
                .setDescription('The username of the assigned judges (if any)')
                .setRequired(false)),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {CommandInteractionOptionResolver} options
     */
    run: async(client, interaction, options) => {
       // Check if the user has appropriate permissions (CoA Leadership)
       const requiredRoles = ['1019717342227333192', '1083095989323313242', '1083096092356391043', '1270040254891692152'];

       const hasRole = requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));
       if (!hasRole) {
         return interactionEmbed(3, "[ERR-UPRM]", `You do not have permission to run this command, buddy.`, interaction, client, [true, 30]);
       }

        const caseId = interaction.options.getString('case_id');
        const judgesAssigned = interaction.options.getBoolean('judges_assigned');
        const judgesUsername = interaction.options.getString('judges_username') || 'N/A';

        try {
            // Find the case and update its judges information
            const result = await case_list.findOneAndUpdate(
                { case_id: caseId },
                { 
                    $set: { 
                        status: 'ASSIGNED',
                        judges_assigned: judgesAssigned,
                        judges_username: judgesAssigned ? judgesUsername : 'N/A'
                    }
                },
                { new: true } // Return the updated document
            );

            if (!result) {
                return interaction.reply({ content: `No case found with ID ${caseId}.`, ephemeral: true });
            }

            await interaction.reply({ content: `The case with ID ${caseId} has been updated successfully.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while assigning judges to the case.', ephemeral: true });
        }
    }
};
