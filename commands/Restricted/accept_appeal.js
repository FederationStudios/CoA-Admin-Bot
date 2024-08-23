const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, CommandInteractionOptionResolver } = require('discord.js');
const { interactionEmbed } = require("../../functions");
const case_list = require('../../DBModels/case_list');

module.exports = {
    name: 'accept_appeal',
    description: 'Put a case on awaiting assignment status',
    data: new SlashCommandBuilder()
        .setName('accept_appeal')
        .setDescription('Put a case on awaiting assignment status')
        .addStringOption(option => 
            option.setName('case_id')
                .setDescription('The ID of the case to put on awaiting assignment')
                .setRequired(true)),
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

        try {
            // Find the case and update its status
            const result = await case_list.findOneAndUpdate(
                { case_id: caseId },
                { 
                    $set: { 
                        status: 'AWAITING ASSIGNMENT'
                    }
                },
                { new: true } // Return the updated document
            );

            if (!result) {
                return interaction.reply({ content: `No case found with ID ${caseId}.`, ephemeral: true });
            }

            await interaction.reply({ content: `The case with ID ${caseId} has been put on awaiting assignment status.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while accepting the case.', ephemeral: true });
        }
    }
};
